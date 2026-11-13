
import {
  createHash,
  createHmac,
} from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  decryptTotpSecret,
  verifyTotpCode,
} from "@/lib/mfa-totp"
import {
  registerMfaLoginFailure,
} from "@/lib/mfa-challenge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function json(
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
  totpStep: bigint
) {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado.")
  }

  const payload = Buffer.from(
    JSON.stringify({
      userId,
      challengeToken,
      totpStep: totpStep.toString(),
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
      return json(
        { error: "Solicitud no autorizada." },
        403
      )
    }

    const challengeToken =
      request.cookies.get("cice_mfa_challenge")?.value

    if (!challengeToken) {
      return json(
        { error: "El desafío ha vencido." },
        401
      )
    }

    const body = await request.json().catch(() => null)

    const code =
      typeof body?.code === "string"
        ? body.code.trim()
        : ""

    if (!/^\d{6}$/.test(code)) {
      return json(
        { error: "Código no válido." },
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
        purpose: MfaChallengePurpose.TOTP_LOGIN,
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
      return json(
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
      return json(
        { error: "No es posible completar la autenticación." },
        403
      )
    }

    const secret = decryptTotpSecret(
      mfa.totpSecretEncrypted
    )

    const matchedStep = await verifyTotpCode(
      secret,
      code
    )

    if (matchedStep === null) {
      await registerMfaLoginFailure(
        user.id,
        challengeToken,
        MfaChallengePurpose.TOTP_LOGIN
      )

      return json(
        { error: "Código incorrecto." },
        401
      )
    }

    // El intervalo TOTP se consume posteriormente
    // junto con el desafío, dentro de la transacción
    // de autorización de Auth.js.
    const handoff = createHandoff(
      user.id,
      challengeToken,
      matchedStep
    )

    const result = json({
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
      "cice_mfa_challenge",
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
    return json(
      {
        error: "No fue posible validar el segundo factor.",
      },
      500
    )
  }
}
