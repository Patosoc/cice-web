
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp, User, Mail, Building, MessageSquare, Phone } from "lucide-react";

export default function Contacto() {
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEstado("enviando");

    const form = e.currentTarget;
    const data = new FormData(form);

    const datos = {
      nombre: String(data.get("nombre") || "").trim(),
      email: String(data.get("email") || "").trim(),
      telefono: String(data.get("telefono") || "").trim(),
      organizacion: String(data.get("organizacion") || "").trim(),
      mensaje: String(data.get("mensaje") || "").trim(),
      autorizacionDatos: data.get("autorizacionDatos") === "on",
    };

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        throw new Error("No fue posible registrar el contacto.");
      }

      setEstado("ok");
      form.reset();
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setEstado("error");
    }
  };

  return (
    <section id="contacto" className="relative py-20 bg-cover bg-center">
      <div className="max-w-4xl mx-auto px-6">
        <div className="card">
          <h2 className="text-3xl font-bold text-center mb-4">
            Contacto
          </h2>

          <p className="text-center text-gray-600 mb-8">
            ¿Interesado en alianzas, formación o proyectos? Déjanos tus datos.
          </p>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  required
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Ingresa tu nombre")}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  required
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Ingresa un correo válido")}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                />
              </div>

              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono de contacto"
                  required
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Ingresa tu teléfono")}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                />
              </div>

              <div className="relative group">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
                <input
                  type="text"
                  name="organizacion"
                  placeholder="Institución / Organización"
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="relative group">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500" size={18} />
                <textarea
                  name="mensaje"
                  placeholder="¿Cómo podemos ayudarte?"
                  rows={4}
                  required
                  className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onInvalid={(e) => (e.target as HTMLTextAreaElement).setCustomValidity("Escribe tu mensaje")}
                  onInput={(e) => (e.target as HTMLTextAreaElement).setCustomValidity("")}
                />
              </div>

              <div className="flex items-start gap-3 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="autorizacionDatos"
                  id="autorizacionDatos"
                  required
                  className="mt-1 h-4 w-4 accent-blue-900"
                />
                <label htmlFor="autorizacionDatos">
                  Autorizo el tratamiento de mis datos personales conforme a la{" "}
                  <a
                    href="/politica-de-tratamiento-de-datos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 underline font-semibold hover:text-blue-600"
                  >
                    Política de Tratamiento de Datos Personales del CICE
                  </a>.
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={estado === "enviando"}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-800 transition disabled:opacity-60"
              >
                {estado === "enviando" ? "Enviando..." : "Enviar información"}
              </motion.button>

              {estado === "ok" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg text-center"
                >
                  <div className="text-2xl mb-2">✅</div>
                  <p className="text-green-700 font-semibold">
                    Información enviada correctamente
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Te contactaremos pronto.
                  </p>
                </motion.div>
              )}

              {estado === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg text-center"
                >
                  <div className="text-2xl mb-2">❌</div>
                  <p className="text-red-700 font-semibold">
                    Ocurrió un error al enviar
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    Intenta nuevamente en unos segundos.
                  </p>
                </motion.div>
              )}
            </form>

            <div className="hidden md:block">
              <img
                src="/contacto.jpg"
                alt="Contacto CICE"
                className="rounded-xl shadow-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href="#"
        className="fixed bottom-6 right-6 bg-blue-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition"
      >
        <ArrowUp size={20} />
      </a>
    </section>
  );
}
