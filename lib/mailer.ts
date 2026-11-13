import * as nodemailer from "cice-mailer";

export async function enviarNotificacionContacto(datos: {
  nombre: string;
  email: string;
  telefono: string;
  organizacion: string;
  mensaje: string;
}) {
  const host = process.env.RADAR_SMTP_HOST;
  const port = Number(process.env.RADAR_SMTP_PORT);
  const user = process.env.RADAR_SMTP_USER;
  const password = process.env.RADAR_SMTP_PASSWORD;
  const from = process.env.RADAR_SMTP_FROM || user;

  if (!host || !port || !user || !password || !from) {
    throw new Error("Configuración SMTP incompleta.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from,
    to: "contacto@my-cice.com",
    subject: "Nuevo contacto recibido desde el sitio web CICE",
    text: [
      `Nombre: ${datos.nombre}`,
      `Correo: ${datos.email}`,
      `Teléfono: ${datos.telefono}`,
      `Organización: ${datos.organizacion || "No indicada"}`,
      "",
      "Mensaje:",
      datos.mensaje,
    ].join("\n"),
  });
}

