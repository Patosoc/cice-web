"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { User, Mail, Building, MessageSquare } from "lucide-react";

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
/*      style={{ backgroundImage: "url('/contacto.jpg')" }}*/
    >

      <div className="max-w-4xl mx-auto px-6">

        <div className="card">

          <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-6">

          <input type="hidden" name="_subject" value="Nuevo contacto desde CICE" />

          {/* NOMBRE */}
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

          {/* EMAIL */}
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

          {/* ORGANIZACIÓN */}
          <div className="relative group">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
            <input
              type="text"
              name="organizacion"
              placeholder="Institución / Organización"
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* MENSAJE */}
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

          {/* IMAGEN */}
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