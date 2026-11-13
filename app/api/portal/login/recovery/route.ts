
import {
  createHash,
  createHmac,
} from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { verifyRecoveryCode } from "@/lib/mfa-recovery"
import {
  registerMfaLoginFailure,
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

function createHandoff(
  userId: string,
  challengeToken: string,
  recoveryCodeId: string
) {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado.")
  }

  const payload = Buffer.from(
    JSON.stringify({
      userId,
      challengeToken,
      recoveryCodeId,
      expiresAt: Date.now() + 60_000,
    })
  ).toString("base64url")

  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url")

  return `${payload}.${signature}`
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

    const challengeToken =
      request.cookies.get("cice_mfa_recovery_challenge")?.value

    if (!challengeToken) {
      return response(
        { error: "El desafío ha vencido." },
        401
      )
    }

    const body = await request.json().catch(() => null)

    const code =
      typeof body?.code === "string"
        ? body.code.trim().toUpperCase()
        : ""

    if (!/^[A-F0-9]{16}$/.test(code)) {
      return response(
        { error: "El código de recuperación no es válido." },
        400
      )
    }

    const challengeHash = createHash("sha256")
      .update(challengeToken)
      .digest("hex")

    const now = new Date()

    const challenge = await prisma.mfaChallenge.findFirst({
      where: {
        challenge: challengeHash,
        purpose: MfaChallengePurpose.RECOVERY_LOGIN,
        consumedAt: null,
        expiresAt: { gt: now },
        attempts: { lt: 5 },
      },
      include: {
        user: {
          include: {
            role: true,
            mfa: true,
          },
        },
      },
    })

    if (!challenge) {
      return response(
        { error: "El desafío ha vencido o no es válido." },
        401
      )
    }

    const user = challenge.user
    const mfa = user.mfa

    if (
      !user.active ||
      !user.role.active ||
      !mfa ||
      !mfa.totpEnabled ||
      !mfa.totpSecretEncrypted ||
      (mfa.lockedUntil && mfa.lockedUntil > now)
    ) {
      return response(
        { error: "No es posible completar la autenticación." },
        403
      )
    }

    const recoveryCodes = await prisma.recoveryCode.findMany({
      where: {
        userId: user.id,
        usedAt: null,
      },
      select: {
        id: true,
        codeHash: true,
      },
    })

    let matchedRecoveryId: string | null = null

    for (const recoveryCode of recoveryCodes) {
      if (
        await verifyRecoveryCode(
          code,
          recoveryCode.codeHash
        )
      ) {
        matchedRecoveryId = recoveryCode.id
        break
      }
    }

    if (!matchedRecoveryId) {
      await registerMfaLoginFailure(
        user.id,
        challengeToken,
        MfaChallengePurpose.RECOVERY_LOGIN
      )

      return response(
        { error: "El código de recuperación no es válido." },
        401
      )
    }

    // El código no se consume aquí.
    // Auth.js lo consume junto con el desafío en una
    // única transacción al autorizar la sesión.
    const handoff = createHandoff(
      user.id,
      challengeToken,
      matchedRecoveryId
    )

    const result = response({
      ok: true,
      nextStep: "complete",
    })

    result.cookies.set(
      "cice_mfa_verified",
      handoff,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: 60,
      }
    )

    result.cookies.set(
      "cice_mfa_recovery_challenge",
      "",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/portal/login",
        maxAge: 0,
      }
    )

    return result
  } catch {
    return response(
      {
        error: "No fue posible validar el código de recuperación.",
      },
      500
    )
  }
}
