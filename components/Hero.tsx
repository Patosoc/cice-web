"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-[600px] flex items-center">

      <div className="max-w-6xl mx-auto px-6 w-full">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-left text-white"
        >

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Centro de Innovación y Ciberseguridad Educativa
          </h1>

          <p className="text-lg mb-6">
            Protegiendo el entorno digital de estudiantes mediante
            investigación, innovación y formación en ciberseguridad.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold shadow-lg"
          >
            Conocer más
          </motion.button>

        </motion.div>

      </div>

    </section>
  );
}