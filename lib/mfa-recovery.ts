import * as argon2 from "argon2"
import { randomBytes } from "crypto"

const RECOVERY_CODE_COUNT = 10

export async function generateRecoveryCodes() {
  const codes = Array.from(
    { length: RECOVERY_CODE_COUNT },
    () => randomBytes(8).toString("hex").toUpperCase()
  )

  const hashedCodes = await Promise.all(
    codes.map(async (code) => ({
      codeHash: await argon2.hash(code),
    }))
  )

  return {
    codes,
    hashedCodes,
  }
}

export async function verifyRecoveryCode(
  code: string,
  codeHash: string
): Promise<boolean> {
  if (!code || !codeHash) return false

  try {
    return await argon2.verify(codeHash, code.trim().toUpperCase())
  } catch {
    return false
  }
}