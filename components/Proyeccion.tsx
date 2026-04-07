"use client";

import { motion } from "framer-motion";

export default function Proyeccion() {
  return (
    <section id="proyeccion" className="py-20">

      <div className="max-w-6xl mx-auto px-6">

        {/* CARD FLOTANTE */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-8">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* TEXTO */}
            <div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-blue-900"
              >
                Proyección del CICE
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mt-6 text-gray-700 leading-relaxed"
              >
                El CICE se proyecta como un núcleo institucional, metodológico y operativo que articula investigación aplicada, innovación educativa, formación especializada, gobernanza ética y soporte tecnológico responsable.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 text-gray-700 leading-relaxed"
              >
                Su propósito es fortalecer de forma sostenible las capacidades de las instituciones educativas para prevenir, comprender y gestionar los riesgos digitales en contextos escolares.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg"
              >
                <p className="text-blue-900 font-medium">
                  Un enfoque integral que conecta tecnología, educación y bienestar digital.
                </p>
              </motion.div>

            </div>

            {/* IMAGEN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/proyeccion.jpg"
                alt="Proyección CICE"
                className="rounded-2xl shadow-xl object-cover w-full h-[350px]"
              />
            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}