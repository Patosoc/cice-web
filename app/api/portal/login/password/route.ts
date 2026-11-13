
import { NextRequest, NextResponse } from "next/server"
import * as argon2 from "argon2"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  createMfaChallenge,
  registerPasswordLoginFailure,
} from "@/lib/mfa-challenge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function response(
  data: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin")
    const requestOrigin = new URL(request.url).origin

    if (!origin || origin !== requestOrigin) {
      return response(
        { error: "Solicitud no autorizada." },
        403
      )
    }

    const contentType =
      request.headers.get("content-type") ?? ""

    if (!contentType.toLowerCase().includes("application/json")) {
      return response(
        { error: "Formato de solicitud no válido." },
        415
      )
    }

    const contentLength = Number(
      request.headers.get("content-length") ?? "0"
    )

    if (
      Number.isFinite(contentLength) &&
      contentLength > 12_000
    ) {
      return response(
        { error: "Solicitud demasiado grande." },
        413
      )
    }

    const body = await request.json().catch(() => null)

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return response(
        { error: "Solicitud no válida." },
        400
      )
    }

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : ""

    const password =
      typeof body.password === "string"
        ? body.password
        : ""

    if (
      !email ||
      !password ||
      email.length > 254 ||
      password.length > 1024
    ) {
      return response(
        { error: "Credenciales no válidas." },
        400
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
        active: true,
      },
      include: {
        role: true,
        mfa: true,
      },
    })

    if (!user || !user.role.active) {
      return response(
        { error: "Credenciales no válidas." },
        401
      )
    }

    const now = new Date()

    if (
      user.mfa?.lockedUntil &&
      user.mfa.lockedUntil > now
    ) {
      return response(
        {
          error: "No es posible completar la autenticación. Inténtelo más tarde.",
          code: "MFA_TEMPORARILY_LOCKED",
        },
        423
      )
    }

    let passwordValid = false

    try {
      passwordValid = await argon2.verify(
        user.passwordHash,
        password
      )
    } catch {
      passwordValid = false
    }

    if (!passwordValid) {
      if (user.mfa) {
        await registerPasswordLoginFailure(user.id)
      }

      return response(
        { error: "Credenciales no válidas." },
        401
      )
    }

    if (
      !user.mfa ||
      !user.mfa.totpEnabled ||
      !user.mfa.totpSecretEncrypted
    ) {
      return response(
        {
          error: "La cuenta requiere configurar un segundo factor de autenticación.",
          code: "MFA_ENROLLMENT_REQUIRED",
        },
        403
      )
    }

    const [challenge, recoveryChallenge] = await Promise.all([
      createMfaChallenge(
        user.id,
        MfaChallengePurpose.TOTP_LOGIN,
        300
      ),
      createMfaChallenge(
        user.id,
        MfaChallengePurpose.RECOVERY_LOGIN,
        300
      ),
    ])

    const result = response({
      ok: true,
      nextStep: "totp",
      recoveryAvailable: true,
      expiresAt: challenge.expiresAt.toISOString(),
    })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/api/portal/login",
      maxAge: 300,
    }

    result.cookies.set(
      "cice_mfa_challenge",
      challenge.token,
      cookieOptions
    )

    result.cookies.set(
      "cice_mfa_recovery_challenge",
      recoveryChallenge.token,
      cookieOptions
    )

    return result
  } catch {
    return response(
      {
        error: "No fue posible procesar la autenticación.",
      },
      500
    )
  }
}
