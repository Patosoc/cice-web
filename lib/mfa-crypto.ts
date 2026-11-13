import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "crypto"

const ALGORITHM = "aes-256-gcm"

function getEncryptionKey(): Buffer {
  const key = process.env.CICE_MFA_ENCRYPTION_KEY

  if (!key || !/^[a-f0-9]{64}$/i.test(key)) {
    throw new Error(
      "CICE_MFA_ENCRYPTION_KEY no está configurada correctamente."
    )
  }

  return Buffer.from(key, "hex")
}

export function encryptMfaSecret(secret: string): string {
  if (!secret || typeof secret !== "string") {
    throw new Error("El secreto MFA no es válido.")
  }

  const iv = randomBytes(12)
  const cipher = createCipheriv(
    ALGORITHM,
    getEncryptionKey(),
    iv
  )

  const encrypted = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":")
}

export function decryptMfaSecret(payload: string): string {
  const parts = payload.split(":")

  if (parts.length !== 3) {
    throw new Error("El secreto MFA cifrado no tiene un formato válido.")
  }

  const [ivHex, authTagHex, encryptedHex] = parts

  if (
    !/^[a-f0-9]{24}$/i.test(ivHex) ||
    !/^[a-f0-9]{32}$/i.test(authTagHex) ||
    !/^(?:[a-f0-9]{2})+$/i.test(encryptedHex)
  ) {
    throw new Error("El contenido cifrado MFA está dañado.")
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivHex, "hex")
  )

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ])

  return decrypted.toString("utf8")
}