
import { generateSecret, generateURI } from "otplib"
import {
  createHmac,
  timingSafeEqual,
} from "crypto"
import {
  encryptMfaSecret,
  decryptMfaSecret,
} from "@/lib/mfa-crypto"

const ISSUER = "CICE"
const WINDOW = 1

function base32ToBuffer(value: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const normalized = value.toUpperCase().replace(/=+$/, "")

  let bits = ""

  for (const char of normalized) {
    const index = alphabet.indexOf(char)

    if (index === -1) {
      throw new Error("Secreto TOTP no válido.")
    }

    bits += index.toString(2).padStart(5, "0")
  }

  const bytes: number[] = []

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2))
  }

  return Buffer.from(bytes)
}

function generateTotp(secret: string, step: bigint): string {
  const key = base32ToBuffer(secret)
  const counter = Buffer.alloc(8)

  counter.writeBigUInt64BE(step)

  const digest = createHmac("sha1", key)
    .update(counter)
    .digest()

  const offset = digest[digest.length - 1] & 0x0f

  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff)

  return String(binary % 1_000_000).padStart(6, "0")
}

export function generateTotpSecret(email: string) {
  const secret = generateSecret()

  const uri = generateURI({
    issuer: ISSUER,
    label: email,
    secret,
  })

  return {
    secret,
    encryptedSecret: encryptMfaSecret(secret),
    uri,
  }
}

export function decryptTotpSecret(encryptedSecret: string) {
  return decryptMfaSecret(encryptedSecret)
}

export async function verifyTotpCode(
  secret: string,
  token: string
): Promise<bigint | null> {
  if (!/^\d{6}$/.test(token)) {
    return null
  }

  try {
    const currentStep = BigInt(
      Math.floor(Date.now() / 30_000)
    )

    const supplied = Buffer.from(token, "utf8")

    for (let offset = -WINDOW; offset <= WINDOW; offset++) {
      const matchedStep = currentStep + BigInt(offset)

      if (matchedStep < BigInt(0)) continue

      const expected = Buffer.from(
        generateTotp(secret, matchedStep),
        "utf8"
      )

      if (
        supplied.length === expected.length &&
        timingSafeEqual(supplied, expected)
      ) {
        return matchedStep
      }
    }

    return null
  } catch {
    return null
  }
}

export function generateRecoveryCode(): string {
  return require("crypto").randomBytes(8).toString("hex").toUpperCase()
}
