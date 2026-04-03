"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="inicio" className="min-h-[600px] flex items-center">

      <div className="max-w-6xl mx-auto px-6 w-full">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl text-left text-white"
        >

          {/* TÍTULO */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Centro de Innovación y Ciberseguridad Educativa
          </h1>

          {/* DESCRIPCIÓN */}
          <p className="text-lg mb-8 text-white/90">
            iniciativa estratégica orientada a transformar la manera en que los sistemas
            educativos abordan la protección del bienestar infantil en contextos mediados por la tecnología.
          </p>

          {/* BOTÓN */}
          <motion.a
            href="#proyeccion"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Conocer más
          </motion.a>

        </motion.div>

      </div>

    </section>
  );
}