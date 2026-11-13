
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { enviarNotificacionContacto } from "@/lib/mailer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_BODY_SIZE = 12_000

const LIMITS = {
  nombre: 120,
  email: 254,
  telefono: 30,
  organizacion: 150,
  mensaje: 5_000,
}

function respuestaError(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (!contentType.toLowerCase().includes("application/json")) {
      return respuestaError(
        "El formato de la solicitud no es válido.",
        415
      )
    }

    const contentLength = Number(
      request.headers.get("content-length") ?? "0"
    )

    if (
      !Number.isFinite(contentLength) ||
      contentLength > MAX_BODY_SIZE
    ) {
      return respuestaError(
        "La solicitud supera el tamaño permitido.",
        413
      )
    }

    const rawBody = await request.text()

    if (
      !rawBody ||
      Buffer.byteLength(rawBody, "utf8") > MAX_BODY_SIZE
    ) {
      return respuestaError(
        "La solicitud está vacía o supera el tamaño permitido.",
        413
      )
    }

    let body: unknown

    try {
      body = JSON.parse(rawBody)
    } catch {
      return respuestaError(
        "El contenido de la solicitud no es válido.",
        400
      )
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return respuestaError(
        "Los datos enviados no tienen un formato válido.",
        400
      )
    }

    const data = body as Record<string, unknown>

    const nombre =
      typeof data.nombre === "string"
        ? data.nombre.trim()
        : ""

    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : ""

    const telefono =
      typeof data.telefono === "string"
        ? data.telefono.trim()
        : ""

    const organizacion =
      typeof data.organizacion === "string"
        ? data.organizacion.trim()
        : ""

    const mensaje =
      typeof data.mensaje === "string"
        ? data.mensaje.trim()
        : ""

    const autorizacionDatos =
      data.autorizacionDatos === true

    if (!nombre || !email || !telefono || !mensaje) {
      return respuestaError(
        "Completa todos los campos obligatorios.",
        400
      )
    }

    if (
      nombre.length > LIMITS.nombre ||
      email.length > LIMITS.email ||
      telefono.length > LIMITS.telefono ||
      organizacion.length > LIMITS.organizacion ||
      mensaje.length > LIMITS.mensaje
    ) {
      return respuestaError(
        "Uno o varios campos superan la longitud permitida.",
        400
      )
    }

    if (
      /[\u0000-\u001F\u007F]/.test(nombre) ||
      /[\u0000-\u001F\u007F]/.test(telefono) ||
      /[\u0000-\u001F\u007F]/.test(organizacion)
    ) {
      return respuestaError(
        "Los datos contienen caracteres no permitidos.",
        400
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respuestaError(
        "El correo electrónico no es válido.",
        400
      )
    }

    if (!autorizacionDatos) {
      return respuestaError(
        "Debes autorizar el tratamiento de tus datos personales.",
        400
      )
    }

    const contacto = await prisma.contacto.create({
      data: {
        nombre,
        email,
        telefono,
        organizacion: organizacion || null,
        mensaje,
        autorizacionDatos: true,
        fechaAutorizacion: new Date(),
        versionPolitica: "1.0",
      },
    })

    let correoEnviado = true

    try {
      await enviarNotificacionContacto({
        nombre,
        email,
        telefono,
        organizacion,
        mensaje,
      })
    } catch (error) {
      correoEnviado = false
      console.error(
        "Error enviando notificación de contacto:",
        error
      )
    }

    return NextResponse.json(
      {
        success: true,
        correoEnviado,
        id: contacto.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error registrando contacto:", error)

    return respuestaError(
      "No fue posible registrar tu solicitud.",
      500
    )
  }
}
