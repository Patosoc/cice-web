
import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  decryptTotpSecret,
  verifyTotpCode,
} from "@/lib/mfa-totp"
import { generateRecoveryCodes } from "@/lib/mfa-recovery"
import {
  registerMfaLoginFailure,
} from "@/lib/mfa-challenge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_ATTEMPTS = 5

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

function hashChallenge(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex")
}

function clearEnrollmentCookie(response: NextResponse) {
  response.cookies.set(
    "cice_mfa_enrollment",
    "",
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/portal/mfa/enroll",
      maxAge: 0,
    }
  )

  return response
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin")

    if (!origin || origin !== new URL(request.url).origin) {
      return json(
        { error: "Solicitud no autorizada." },
        403
      )
    }

    const contentType =
      request.headers.get("content-type") ?? ""

    if (!contentType.toLowerCase().includes("application/json")) {
      return json(
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
      return json(
        { error: "Solicitud demasiado grande." },
        413
      )
    }

    const challengeToken =
      request.cookies.get("cice_mfa_enrollment")?.value

    if (!challengeToken) {
      return clearEnrollmentCookie(
        json(
          { error: "El registro ha vencido." },
          401
        )
      )
    }

    const body = await request.json().catch(() => null)

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return json(
        { error: "Solicitud no válida." },
        400
      )
    }

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : ""

    if (!/^\d{6}$/.test(code)) {
      return json(
        { error: "Ingresa un código de seis dígitos." },
        400
      )
    }

    const challengeHash = hashChallenge(challengeToken)
    const now = new Date()

    const challenge = await prisma.mfaChallenge.findFirst({
      where: {
        challenge: challengeHash,
        purpose: MfaChallengePurpose.TOTP_ENROLLMENT,
        consumedAt: null,
        expiresAt: { gt: now },
        attempts: { lt: MAX_ATTEMPTS },
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
      return clearEnrollmentCookie(
        json(
          {
            error: "El registro ha vencido o no es válido.",
          },
          401
        )
      )
    }

    const user = challenge.user
    const mfa = user.mfa

    if (
      !user.active ||
      !user.role.active ||
      !mfa ||
      mfa.totpEnabled ||
      !mfa.pendingTotpSecretEncrypted ||
      (mfa.lockedUntil && mfa.lockedUntil > now)
    ) {
      return clearEnrollmentCookie(
        json(
          { error: "No es posible completar el registro." },
          403
        )
      )
    }

    const originalPendingSecret =
      mfa.pendingTotpSecretEncrypted

    const secret = decryptTotpSecret(
      originalPendingSecret
    )

    const matchedStep = await verifyTotpCode(
      secret,
      code
    )

    if (matchedStep === null) {
      await registerMfaLoginFailure(
        user.id,
        challengeToken,
        MfaChallengePurpose.TOTP_ENROLLMENT
      )

      return json(
        { error: "El código no es correcto." },
        401
      )
    }

    // Los códigos se generan antes de la transacción,
    // pero solo se almacenan si la activación termina correctamente.
    const recovery = await generateRecoveryCodes()

    const activation = await prisma.$transaction(
      async (tx) => {
        const transactionNow = new Date()

        // Bloquea la fila MFA para serializar verificaciones
        // simultáneas del mismo usuario.
        await tx.$queryRaw`
          SELECT "id"
          FROM "UserMfa"
          WHERE "userId" = CAST(${user.id} AS uuid)
          FOR UPDATE
        `

        const currentUser = await tx.user.findFirst({
          where: {
            id: user.id,
            active: true,
            role: {
              active: true,
            },
          },
          select: {
            id: true,
          },
        })

        if (!currentUser) {
          return {
            status: "USER_INVALID" as const,
          }
        }

        const currentMfa = await tx.userMfa.findUnique({
          where: {
            userId: user.id,
          },
        })

        if (
          !currentMfa ||
          currentMfa.totpEnabled ||
          !currentMfa.pendingTotpSecretEncrypted ||
          currentMfa.pendingTotpSecretEncrypted !==
            originalPendingSecret
        ) {
          return {
            status: "MFA_CHANGED" as const,
          }
        }

        if (
          currentMfa.lockedUntil &&
          currentMfa.lockedUntil > transactionNow
        ) {
          return {
            status: "LOCKED" as const,
          }
        }

        const currentChallenge =
          await tx.mfaChallenge.findFirst({
            where: {
              id: challenge.id,
              userId: user.id,
              challenge: challengeHash,
              purpose: MfaChallengePurpose.TOTP_ENROLLMENT,
              consumedAt: null,
              expiresAt: {
                gt: transactionNow,
              },
              attempts: {
                lt: MAX_ATTEMPTS,
              },
            },
            select: {
              id: true,
            },
          })

        if (!currentChallenge) {
          return {
            status: "CHALLENGE_INVALID" as const,
          }
        }

        // Se vuelve a verificar el código contra el secreto
        // vigente dentro de la sección protegida.
        const currentSecret = decryptTotpSecret(
          currentMfa.pendingTotpSecretEncrypted
        )

        const confirmedStep = await verifyTotpCode(
          currentSecret,
          code
        )

        if (
          confirmedStep === null ||
          confirmedStep !== matchedStep ||
          (
            currentMfa.lastTotpStep !== null &&
            confirmedStep <= currentMfa.lastTotpStep
          )
        ) {
          return {
            status: "CODE_INVALID" as const,
          }
        }

        const consumed = await tx.mfaChallenge.updateMany({
          where: {
            id: currentChallenge.id,
            userId: user.id,
            consumedAt: null,
            expiresAt: {
              gt: transactionNow,
            },
            attempts: {
              lt: MAX_ATTEMPTS,
            },
          },
          data: {
            consumedAt: transactionNow,
          },
        })

        if (consumed.count !== 1) {
          return {
            status: "CHALLENGE_INVALID" as const,
          }
        }

        const activated = await tx.userMfa.updateMany({
          where: {
            userId: user.id,
            totpEnabled: false,
            pendingTotpSecretEncrypted:
              originalPendingSecret,
            OR: [
              { lockedUntil: null },
              { lockedUntil: { lte: transactionNow } },
            ],
          },
          data: {
            totpSecretEncrypted:
              originalPendingSecret,
            pendingTotpSecretEncrypted: null,
            totpEnabled: true,
            totpEnabledAt: transactionNow,
            lastTotpStep: confirmedStep,
            failedAttempts: 0,
            lockedUntil: null,
          },
        })

        if (activated.count !== 1) {
          throw new Error(
            "No fue posible activar TOTP."
          )
        }

        await tx.recoveryCode.createMany({
          data: recovery.hashedCodes.map((item) => ({
            userId: user.id,
            codeHash: item.codeHash,
          })),
        })

        return {
          status: "ACTIVATED" as const,
        }
      },
      {
        maxWait: 5000,
        timeout: 15000,
      }
    )

    if (activation.status === "LOCKED") {
      return clearEnrollmentCookie(
        json(
          {
            error: "La cuenta está temporalmente bloqueada.",
            code: "MFA_TEMPORARILY_LOCKED",
          },
          423
        )
      )
    }

    if (activation.status === "USER_INVALID") {
      return clearEnrollmentCookie(
        json(
          { error: "La cuenta no está habilitada." },
          403
        )
      )
    }

    if (
      activation.status === "MFA_CHANGED" ||
      activation.status === "CHALLENGE_INVALID"
    ) {
      return clearEnrollmentCookie(
        json(
          {
            error: "El registro venció o ya fue utilizado. Inicia el enrolamiento nuevamente.",
          },
          409
        )
      )
    }

    if (activation.status === "CODE_INVALID") {
      await registerMfaLoginFailure(
        user.id,
        challengeToken,
        MfaChallengePurpose.TOTP_ENROLLMENT
      )

      return json(
        { error: "El código no es correcto." },
        401
      )
    }

    const response = json({
      ok: true,
      message: "Autenticación TOTP activada.",
      recoveryCodes: recovery.codes,
    })

    return clearEnrollmentCookie(response)
  } catch {
    return json(
      {
        error: "No fue posible completar el registro MFA.",
      },
      500
    )
  }
}
