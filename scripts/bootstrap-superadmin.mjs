import { PrismaClient } from "@prisma/client"
import argon2 from "argon2"
import { createInterface, emitKeypressEvents } from "node:readline"

const prisma = new PrismaClient()
const SUPERADMIN_ROLE_ID = 1

let rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer))
  })
}

function askHidden(prompt) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin

    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(new Error("Ejecuta el script desde una terminal interactiva."))
      return
    }

    // Cerramos readline para evitar que muestre los caracteres de la contraseÃ±a.
    rl.close()
    rl = null

    let value = ""

    process.stdout.write(prompt)
    emitKeypressEvents(stdin)
    stdin.setRawMode(true)
    stdin.resume()

    const cleanup = () => {
      stdin.removeListener("keypress", onKeypress)
      stdin.setRawMode(false)
      process.stdout.write("\n")

      rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      })
    }

    const onKeypress = (str, key = {}) => {
      if (key.ctrl && key.name === "c") {
        cleanup()
        reject(new Error("OperaciÃ³n cancelada."))
        return
      }

      if (key.name === "return" || key.name === "enter") {
        cleanup()
        resolve(value)
        return
      }

      if (key.name === "backspace") {
        value = Array.from(value).slice(0, -1).join("")
        return
      }

      if (str && !key.ctrl && !key.meta) {
        value += str
      }
    }

    stdin.on("keypress", onKeypress)
  })
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("No se encontrÃ³ DATABASE_URL.")
  }

  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Abre una terminal interactiva de PowerShell.")
  }

  console.log("\n=== InicializaciÃ³n del administrador CICE ===\n")
  console.log("Se crearÃ¡ una cuenta con el rol superadmin.\n")

  const name = (await ask("Nombre completo: ")).trim()
  const email = (await ask("Correo electrÃ³nico: "))
    .trim()
    .toLowerCase()
  const telefono = (await ask("TelÃ©fono: ")).trim()

  if (!name || name.length > 120) {
    throw new Error("El nombre no es vÃ¡lido.")
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254
  ) {
    throw new Error("El correo electrÃ³nico no es vÃ¡lido.")
  }

  if (!telefono || telefono.length > 30) {
    throw new Error("El telÃ©fono no es vÃ¡lido.")
  }

  let password = await askHidden("ContraseÃ±a (no se mostrarÃ¡): ")
  const confirmation = await askHidden("Confirma la contraseÃ±a: ")

  if (password.length < 14 || password.length > 128) {
    password = ""
    throw new Error("La contraseÃ±a debe tener entre 14 y 128 caracteres.")
  }

  if (password !== confirmation) {
    password = ""
    throw new Error("Las contraseÃ±as no coinciden.")
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  })

  password = ""

  const user = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(hashtext(${email}))
    `

    const role = await tx.rol.findUnique({
      where: { id: SUPERADMIN_ROLE_ID },
    })

    if (!role || role.name !== "superadmin" || !role.active) {
      throw new Error("El rol superadmin no existe o estÃ¡ inactivo.")
    }

    const existingAdmin = await tx.user.findFirst({
      where: { roleId: SUPERADMIN_ROLE_ID },
      select: { id: true },
    })

    if (existingAdmin) {
      throw new Error("Ya existe un superadmin. No se creÃ³ otro.")
    }

    const existingEmail = await tx.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: { id: true },
    })

    if (existingEmail) {
      throw new Error("Ya existe un usuario con ese correo.")
    }

    return tx.user.create({
      data: {
        name,
        email,
        telefono,
        passwordHash,
        roleId: SUPERADMIN_ROLE_ID,
        active: true,
      },
      select: {
        id: true,
        email: true,
        active: true,
      },
    })
  })

  console.log("\nAdministrador creado correctamente.")
  console.log("ID:", user.id)
  console.log("Correo:", user.email)
  console.log("Rol: superadmin")
  console.log("Activo:", user.active)
  console.log("\nEl enrolamiento MFA se realizarÃ¡ desde el portal.")
}

main()
  .catch((error) => {
    console.error("\nNo fue posible crear el administrador:")
    console.error(error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    if (rl) rl.close()
    await prisma.$disconnect()
  })

