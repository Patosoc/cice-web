"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="py-32 px-6 text-center bg-gradient-to-br from-white via-slate-100 to-emerald-50">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold max-w-4xl mx-auto text-[#0F3057]"
      >
        Centro de Innovación y Ciberseguridad Educativa
      </motion.h1>

      <p className="mt-8 text-lg text-slate-600 max-w-3xl mx-auto">
        Iniciativa orientada a fortalecer la prevención y gestión del riesgo digital
        en instituciones educativas.
      </p>

    </section>
  );
}