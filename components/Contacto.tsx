"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function Contacto() {

  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "error">("idle");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setEstado("enviando");

    const data = new FormData(e.target);

    try {
      const res = await fetch("https://formspree.io/f/xzdkjgkj", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setEstado("ok");
        e.target.reset();
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  };

  return (
    <section
      
      id="contacto"
      className="relative py-20 bg-cover bg-center"
      style={{ backgroundImage: "url('/contacto.jpg')" }}
    >

      <div className="max-w-4xl mx-auto px-6">

        <div className="card">

          <h2 className="text-3xl font-bold text-center mb-8">
            Contacto
          </h2>

          <p className="text-center text-gray-600 mb-10">
            ¿Interesado en alianzas, formación o proyectos? Déjanos tus datos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="hidden"
              name="_subject"
              value="Nuevo contacto desde CICE"
            />

            {/* NOMBRE */}
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            {/* ORGANIZACIÓN */}
            <input
              type="text"
              name="organizacion"
              placeholder="Institución / Organización"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            {/* MENSAJE */}
            <textarea
              name="mensaje"
              placeholder="¿Cómo podemos ayudarte?"
              rows={4}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            {/* BOTÓN */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={estado === "enviando"}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-800 transition disabled:opacity-60"
            >
              {estado === "enviando" ? "Enviando..." : "Enviar información"}
            </motion.button>

          </form>

          {/* MENSAJES */}

          {estado === "ok" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg text-center"
            >
              <p className="text-green-700 font-semibold">
                ✅ Información enviada correctamente
              </p>
              <p className="text-green-600 text-sm mt-1">
                Te contactaremos pronto.
              </p>
            </motion.div>
          )}

          {estado === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center mt-6 font-semibold"
            >
              ❌ Ocurrió un error. Intenta nuevamente.
            </motion.p>
          )}

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