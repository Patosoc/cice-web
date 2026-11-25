"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SobreCICE() {
  return (
    <section id="sobre" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-6 md:p-8 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6 text-blue-900"
          >
            Modelo CICE
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-700 mb-10 leading-relaxed"
          >
            El Modelo Integral de Ciberseguridad Educativa (CICE) constituye un
            marco metodológico y conceptual diseñado para orientar la prevención,
            comprensión y gestión de los riesgos digitales que afectan el bienestar
            de niños, niñas y adolescentes en contextos educativos. Se fundamenta
            en evidencia empírica y propone una aproximación integral que supera
            las visiones fragmentadas de la ciberseguridad tradicional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full overflow-hidden rounded-xl"
          >
            <Image
              src="/modelo.jpeg"
              alt="Infografía del Modelo Integral de Ciberseguridad Educativa CICE"
              width={1452}
              height={864}
              sizes="(max-width: 768px) 100vw, 900px"
              className="w-full h-auto object-contain"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}