
BEGIN;

-- 1. Tipo de propósito de los desafíos MFA
CREATE TYPE public."MfaChallengePurpose" AS ENUM (
  'TOTP_LOGIN',
  'PASSKEY_LOGIN',
  'PASSKEY_REGISTRATION',
  'TOTP_ENROLLMENT',
  'RECOVERY_LOGIN'
);

-- 2. Configuración MFA por usuario
CREATE TABLE public."UserMfa" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "totpSecretEncrypted" TEXT,
  "pendingTotpSecretEncrypted" TEXT,
  "totpEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
  "totpEnabledAt" TIMESTAMPTZ(6),
  "lastTotpStep" BIGINT,
  "failedAttempts" INTEGER NOT NULL DEFAULT 0,
  "lockedUntil" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,

  CONSTRAINT "UserMfa_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserMfa_userId_key" UNIQUE ("userId"),
  CONSTRAINT "UserMfa_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES public."User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3. Credenciales Passkey
CREATE TABLE public."Passkey" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "credentialId" TEXT NOT NULL,
  "publicKey" TEXT NOT NULL,
  "counter" BIGINT NOT NULL DEFAULT 0,
  "transports" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "deviceType" TEXT,
  "backedUp" BOOLEAN NOT NULL DEFAULT FALSE,
  "name" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastUsedAt" TIMESTAMPTZ(6),

  CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Passkey_credentialId_key" UNIQUE ("credentialId"),
  CONSTRAINT "Passkey_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES public."User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Passkey_userId_idx"
ON public."Passkey"("userId");

-- 4. Códigos de recuperación
CREATE TABLE public."RecoveryCode" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "codeHash" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt" TIMESTAMPTZ(6),

  CONSTRAINT "RecoveryCode_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RecoveryCode_codeHash_key" UNIQUE ("codeHash"),
  CONSTRAINT "RecoveryCode_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES public."User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "RecoveryCode_userId_usedAt_idx"
ON public."RecoveryCode"("userId", "usedAt");

-- 5. Desafíos temporales de autenticación
CREATE TABLE public."MfaChallenge" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "challenge" TEXT NOT NULL,
  "purpose" public."MfaChallengePurpose" NOT NULL,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "consumedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MfaChallenge_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MfaChallenge_challenge_key" UNIQUE ("challenge"),
  CONSTRAINT "MfaChallenge_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES public."User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "MfaChallenge_userId_purpose_idx"
ON public."MfaChallenge"("userId", "purpose");

CREATE INDEX "MfaChallenge_expiresAt_idx"
ON public."MfaChallenge"("expiresAt");

-- 6. Protección RLS: acceso únicamente mediante backend autorizado
ALTER TABLE public."UserMfa" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Passkey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."RecoveryCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MfaChallenge" ENABLE ROW LEVEL SECURITY;

COMMIT;
