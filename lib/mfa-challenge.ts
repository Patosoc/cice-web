
import { createHash, randomBytes } from "crypto"
import { MfaChallengePurpose } from "@prisma/client"
import { prisma } from "@/lib/prisma"

const DEFAULT_TTL_SECONDS = 300
const MAX_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15

function hashChallenge(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex")
}

async function incrementAccountFailure(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  userId: string,
  now: Date
) {
  await tx.userMfa.updateMany({
    where: {
      userId,
      lockedUntil: { lte: now },
    },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
    },
  })

  await tx.userMfa.updateMany({
    where: {
      userId,
      failedAttempts: { lt: MAX_ATTEMPTS },
      OR: [
        { lockedUntil: null },
        { lockedUntil: { lte: now } },
      ],
    },
    data: {
      failedAttempts: { increment: 1 },
    },
  })

  const status = await tx.userMfa.findUnique({
    where: { userId },
    select: {
      failedAttempts: true,
      lockedUntil: true,
    },
  })

  if (
    status &&
    status.failedAttempts >= MAX_ATTEMPTS &&
    (!status.lockedUntil || status.lockedUntil <= now)
  ) {
    await tx.userMfa.updateMany({
      where: {
        userId,
        failedAttempts: { gte: MAX_ATTEMPTS },
        OR: [
          { lockedUntil: null },
          { lockedUntil: { lte: now } },
        ],
      },
      data: {
        lockedUntil: new Date(
          now.getTime() +
          LOCK_DURATION_MINUTES * 60 * 1000
        ),
      },
    })
  }
}

export async function createMfaChallenge(
  userId: string,
  purpose: MfaChallengePurpose,
  ttlSeconds = DEFAULT_TTL_SECONDS
) {
  if (!userId || ttlSeconds <= 0) {
    throw new Error("Parámetros del desafío no válidos.")
  }

  const token = randomBytes(32).toString("base64url")

  const expiresAt = new Date(
    Date.now() + ttlSeconds * 1000
  )

  await prisma.mfaChallenge.create({
    data: {
      userId,
      challenge: hashChallenge(token),
      purpose,
      expiresAt,
    },
  })

  return {
    token,
    expiresAt,
  }
}

export async function consumeMfaChallenge(
  token: string,
  purpose: MfaChallengePurpose
): Promise<{ userId: string } | null> {
  if (!token || typeof token !== "string") {
    return null
  }

  const challengeHash = hashChallenge(token)
  const now = new Date()

  const challenge = await prisma.mfaChallenge.findFirst({
    where: {
      challenge: challengeHash,
      purpose,
      consumedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: MAX_ATTEMPTS },
    },
    select: {
      id: true,
      userId: true,
    },
  })

  if (!challenge) {
    return null
  }

  const consumed = await prisma.mfaChallenge.updateMany({
    where: {
      id: challenge.id,
      consumedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: MAX_ATTEMPTS },
    },
    data: {
      consumedAt: now,
    },
  })

  if (consumed.count !== 1) {
    return null
  }

  return {
    userId: challenge.userId,
  }
}

export async function registerMfaChallengeFailure(
  token: string,
  purpose: MfaChallengePurpose
): Promise<void> {
  if (!token || typeof token !== "string") {
    return
  }

  await prisma.mfaChallenge.updateMany({
    where: {
      challenge: hashChallenge(token),
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
      attempts: { lt: MAX_ATTEMPTS },
    },
    data: {
      attempts: { increment: 1 },
    },
  })
}

export async function registerMfaLoginFailure(
  userId: string,
  token: string,
  purpose: MfaChallengePurpose
): Promise<void> {
  if (!userId || !token || typeof token !== "string") {
    return
  }

  const now = new Date()
  const challengeHash = hashChallenge(token)

  await prisma.$transaction(async (tx) => {
    const challenge = await tx.mfaChallenge.updateMany({
      where: {
        challenge: challengeHash,
        userId,
        purpose,
        consumedAt: null,
        expiresAt: { gt: now },
        attempts: { lt: MAX_ATTEMPTS },
      },
      data: {
        attempts: { increment: 1 },
      },
    })

    if (challenge.count !== 1) {
      return
    }

    await incrementAccountFailure(tx, userId, now)
  })
}

export async function registerPasswordLoginFailure(
  userId: string
): Promise<void> {
  if (!userId) {
    return
  }

  const now = new Date()

  await prisma.$transaction(async (tx) => {
    await incrementAccountFailure(tx, userId, now)
  })
}
