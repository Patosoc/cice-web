
import { NextRequest, NextResponse } from "next/server"
import { createHash, randomBytes } from "crypto"
import * as argon2 from "argon2"
import QRCode from "qrcode"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { generateTotpSecret } from "@/lib/mfa-totp"
import { registerPasswordLoginFailure } from "@/lib/mfa-challenge"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ENROLLMENT_TTL_SECONDS = 300
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
      return json(
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
      return json(
        { error: "No fue posible iniciar el registro MFA." },
        401
      )
    }

    const now = new Date()

    if (
      user.mfa?.lockedUntil &&
      user.mfa.lockedUntil > now
    ) {
      return json(
        {
          error: "La cuenta está temporalmente bloqueada.",
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

      return json(
        {
          error: "No fue posible iniciar el registro MFA.",
        },
        401
      )
    }

    if (user.mfa?.totpEnabled) {
      return json(
        {
          error: "Esta cuenta ya tiene TOTP configurado.",
        },
        409
      )
    }

    const generated = generateTotpSecret(user.email)

    const qrCode = await QRCode.toDataURL(
      generated.uri,
      {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 240,
      }
    )

    const challengeToken =
      randomBytes(32).toString("base64url")

    const challengeHash =
      hashChallenge(challengeToken)

    const expiresAt = new Date(
      Date.now() + ENROLLMENT_TTL_SECONDS * 1000
    )

    const result = await prisma.$transaction(
      async (tx) => {
        const currentUser = await tx.user.findFirst({
          where: {
            id: user.id,
            active: true,
            passwordHash: user.passwordHash,
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
            status: "UNAUTHORIZED" as const,
          }
        }

        await tx.userMfa.upsert({
          where: {
            userId: user.id,
          },
          create: {
            userId: user.id,
          },
          update: {},
        })

        // Serializa los inicios de enrolamiento del mismo usuario.
        await tx.$queryRaw`
          SELECT "id"
          FROM "UserMfa"
          WHERE "userId" = CAST(${user.id} AS uuid)
          FOR UPDATE
        `

        const mfa = await tx.userMfa.findUnique({
          where: {
            userId: user.id,
          },
        })

        if (!mfa) {
          throw new Error("No fue posible consultar el estado MFA.")
        }

        const transactionNow = new Date()

        if (mfa.totpEnabled) {
          return {
            status: "ALREADY_ENABLED" as const,
          }
        }

        if (
          mfa.lockedUntil &&
          mfa.lockedUntil > transactionNow
        ) {
          return {
            status: "LOCKED" as const,
          }
        }

        const activeChallenge =
          await tx.mfaChallenge.findFirst({
            where: {
              userId: user.id,
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

        // No se reemplaza un secreto que todavía tiene
        // un desafío válido: el usuario debe terminar ese flujo.
        if (
          mfa.pendingTotpSecretEncrypted &&
          activeChallenge
        ) {
          return {
            status: "PENDING" as const,
          }
        }

        // Si el secreto quedó pendiente pero el desafío expiró,
        // o se agotaron sus intentos, se invalida el estado anterior.
        await tx.mfaChallenge.updateMany({
          where: {
            userId: user.id,
            purpose: MfaChallengePurpose.TOTP_ENROLLMENT,
            consumedAt: null,
          },
          data: {
            consumedAt: transactionNow,
          },
        })

        await tx.userMfa.update({
          where: {
            userId: user.id,
          },
          data: {
            pendingTotpSecretEncrypted:
              generated.encryptedSecret,
          },
        })

        await tx.mfaChallenge.create({
          data: {
            userId: user.id,
            challenge: challengeHash,
            purpose: MfaChallengePurpose.TOTP_ENROLLMENT,
            expiresAt,
          },
        })

        return {
          status: "CREATED" as const,
        }
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    )

    if (result.status === "UNAUTHORIZED") {
      return json(
        { error: "No fue posible iniciar el registro MFA." },
        401
      )
    }

    if (result.status === "ALREADY_ENABLED") {
      return json(
        { error: "Esta cuenta ya tiene TOTP configurado." },
        409
      )
    }

    if (result.status === "LOCKED") {
      return json(
        {
          error: "La cuenta está temporalmente bloqueada.",
          code: "MFA_TEMPORARILY_LOCKED",
        },
        423
      )
    }

    if (result.status === "PENDING") {
      return json(
        {
          error: "Ya existe un registro TOTP vigente. Finaliza ese registro antes de iniciar otro.",
          code: "MFA_ENROLLMENT_PENDING",
        },
        409
      )
    }

    const response = json({
      ok: true,
      qrCode,
      manualSecret: generated.secret,
      expiresAt: expiresAt.toISOString(),
    })

    response.cookies.set(
      "cice_mfa_enrollment",
      challengeToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/portal/mfa/enroll",
        maxAge: ENROLLMENT_TTL_SECONDS,
      }
    )

    return response
  } catch {
    return json(
      {
        error: "No fue posible iniciar el registro de autenticación.",
      },
      500
    )
  }
}
