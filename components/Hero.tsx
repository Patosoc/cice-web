"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-6">

      <div className="max-w-6xl mx-auto text-center">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/logo-cice.svg"
            alt="Centro de Innovación y Ciberseguridad Educativa"
            width={200}
            height={200}
            priority
          />
        </motion.div>

        {/* TITULO */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-[#0B2A5B]"
        >
          Centro de Innovación y Ciberseguridad Educativa
        </motion.h1>

        {/* LINEA DECORATIVA */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="w-32 h-1 bg-[#D4A017] mx-auto my-6 rounded"
        />

        {/* SUBTITULO */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto"
        >
          Iniciativa dedicada a la investigación, innovación, formación y
          acompañamiento en ciberseguridad, orientada a la protección de
          estudiantes, instituciones educativas y ecosistemas digitales en
          colegios y universidades.
        </motion.p>

        {/* BOTONES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <a
            href="#lineas"
            className="bg-[#1F4E8C] hover:bg-[#0B2A5B] text-white px-8 py-3 rounded-xl shadow-md transition"
          >
            Conocer líneas estratégicas
          </a>

          <a
            href="#contacto"
            className="border border-[#1F4E8C] text-[#1F4E8C] hover:bg-blue-50 px-8 py-3 rounded-xl transition"
          >
            Contactar
          </a>
        </motion.div>

      </div>

    </section>
  );
}