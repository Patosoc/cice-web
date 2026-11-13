
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "crypto"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"

function getCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get("cookie") ?? ""

  const entry = cookies
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))

  return entry ? entry.slice(name.length + 1) : null
}

function verifyHandoff(handoff: string) {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error("AUTH_SECRET no está configurado.")
  }

  const parts = handoff.split(".")

  if (parts.length !== 2) return null

  const [payload, suppliedSignature] = parts

  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest()

  const receivedSignature = Buffer.from(
    suppliedSignature,
    "base64url"
  )

  if (
    receivedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return null
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    )

    if (
      typeof data.userId !== "string" ||
      !data.userId ||
      typeof data.challengeToken !== "string" ||
      !data.challengeToken ||
      typeof data.expiresAt !== "number" ||
      !Number.isFinite(data.expiresAt) ||
      data.expiresAt <= Date.now()
    ) {
      return null
    }

    if (
      data.recoveryCodeId !== undefined &&
      typeof data.recoveryCodeId !== "string"
    ) {
      return null
    }

    if (
      data.totpStep !== undefined &&
      typeof data.totpStep !== "string"
    ) {
      return null
    }

    const isRecovery =
      typeof data.recoveryCodeId === "string" &&
      data.recoveryCodeId.length > 0

    const isTotp =
      typeof data.totpStep === "string" &&
      /^[0-9]{1,20}$/.test(data.totpStep)

    if (isRecovery === isTotp) {
      return null
    }

    return {
      userId: data.userId as string,
      challengeToken: data.challengeToken as string,
      recoveryCodeId: isRecovery
        ? (data.recoveryCodeId as string)
        : undefined,
      totpStep: isTotp
        ? (data.totpStep as string)
        : undefined,
    }
  } catch {
    return null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "mfa-handoff",
      name: "MFA verification",
      credentials: {},

      async authorize(_credentials, request) {
        const handoff = getCookie(
          request,
          "cice_mfa_verified"
        )

        if (!handoff) return null

        const verified = verifyHandoff(handoff)

        if (!verified) return null

        const challengeHash = createHash("sha256")
          .update(verified.challengeToken)
          .digest("hex")

        const user = await prisma.user.findFirst({
          where: {
            id: verified.userId,
            active: true,
            role: {
              active: true,
            },
            mfa: {
              is: {
                totpEnabled: true,
                totpSecretEncrypted: {
                  not: null,
                },
              },
            },
          },
          include: {
            role: true,
          },
        })

        if (!user) return null

        const now = new Date()

        const expectedPurpose = verified.recoveryCodeId
          ? MfaChallengePurpose.RECOVERY_LOGIN
          : MfaChallengePurpose.TOTP_LOGIN

        const invalidHandoff = "INVALID_MFA_HANDOFF"

        try {
          await prisma.$transaction(async (tx) => {
            const consumedChallenge =
              await tx.mfaChallenge.updateMany({
                where: {
                  userId: user.id,
                  challenge: challengeHash,
                  purpose: expectedPurpose,
                  consumedAt: null,
                  expiresAt: {
                    gt: now,
                  },
                  attempts: {
                    lt: 5,
                  },
                },
                data: {
                  consumedAt: now,
                },
              })

            if (consumedChallenge.count !== 1) {
              throw new Error(invalidHandoff)
            }

            if (verified.recoveryCodeId) {
              const consumedRecoveryCode =
                await tx.recoveryCode.updateMany({
                  where: {
                    id: verified.recoveryCodeId,
                    userId: user.id,
                    usedAt: null,
                  },
                  data: {
                    usedAt: now,
                  },
                })

              if (consumedRecoveryCode.count !== 1) {
                throw new Error(invalidHandoff)
              }

              const resetMfa = await tx.userMfa.updateMany({
                where: {
                  userId: user.id,
                  OR: [
                    {
                      lockedUntil: null,
                    },
                    {
                      lockedUntil: {
                        lte: now,
                      },
                    },
                  ],
                },
                data: {
                  failedAttempts: 0,
                  lockedUntil: null,
                },
              })

              if (resetMfa.count !== 1) {
                throw new Error(invalidHandoff)
              }
            } else if (verified.totpStep) {
              const totpStep = BigInt(verified.totpStep)

              const consumedTotpStep =
                await tx.userMfa.updateMany({
                  where: {
                    userId: user.id,
                    totpEnabled: true,
                    AND: [
                      {
                        OR: [
                          {
                            lastTotpStep: null,
                          },
                          {
                            lastTotpStep: {
                              lt: totpStep,
                            },
                          },
                        ],
                      },
                      {
                        OR: [
                          {
                            lockedUntil: null,
                          },
                          {
                            lockedUntil: {
                              lte: now,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  data: {
                    lastTotpStep: totpStep,
                    failedAttempts: 0,
                    lockedUntil: null,
                  },
                })

              if (consumedTotpStep.count !== 1) {
                throw new Error(invalidHandoff)
              }
            } else {
              throw new Error(invalidHandoff)
            }
          })
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === invalidHandoff
          ) {
            return null
          }

          throw error
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.name,
          mfaVerified: true,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
        token.mfaVerified = user.mfaVerified === true
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        // Transferir el identificador del JWT a la sesión.
        session.user.id =
          typeof token.sub === "string" ? token.sub : ""

        session.user.role =
          typeof token.role === "string"
            ? token.role
            : undefined

        session.mfaVerified =
          token.mfaVerified === true
      }

      return session
    },
  },

  pages: {
    signIn: "/portal/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
})
