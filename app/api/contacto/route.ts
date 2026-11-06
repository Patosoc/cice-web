import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarNotificacionContacto } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nombre = String(body.nombre || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const telefono = String(body.telefono || "").trim();
    const organizacion = String(body.organizacion || "").trim();
    const mensaje = String(body.mensaje || "").trim();
    const autorizacionDatos = body.autorizacionDatos === true;

    if (!nombre || !email || !telefono || !mensaje) {
      return NextResponse.json(
        { error: "Completa todos los campos obligatorios." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "El correo electrónico no es válido." },
        { status: 400 }
      );
    }

    if (!autorizacionDatos) {
      return NextResponse.json(
        { error: "Debes autorizar el tratamiento de tus datos personales." },
        { status: 400 }
      );
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
    });

    let correoEnviado = true;

    try {
      await enviarNotificacionContacto({
        nombre,
        email,
        telefono,
        organizacion,
        mensaje,
      });
    } catch (error) {
      correoEnviado = false;
      console.error("Error enviando notificación de contacto:", error);
    }

    return NextResponse.json(
      {
        success: true,
        correoEnviado,
        id: contacto.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrando contacto:", error);

    return NextResponse.json(
      { error: "No fue posible registrar tu solicitud." },
      { status: 500 }
    );
  }
}
