"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  BookOpen,
  Heart,
  Users,
  Scale,
  ShieldCheck,
} from "lucide-react";

export default function SobreCICE() {
  const dimensiones = [
    {
      nombre: "Tecnológica",
      icono: <Cpu />,
      color: "from-blue-500 to-blue-300",
    },
    {
      nombre: "Pedagógica",
      icono: <BookOpen />,
      color: "from-green-500 to-green-300",
    },
    {
      nombre: "Psicosocial",
      icono: <Heart />,
      color: "from-pink-500 to-pink-300",
    },
    {
      nombre: "Institucional",
      icono: <Users />,
      color: "from-purple-500 to-purple-300",
    },
    {
      nombre: "Normativa",
      icono: <Scale />,
      color: "from-yellow-500 to-yellow-300",
    },
    {
      nombre: "Ética",
      icono: <ShieldCheck />,
      color: "from-indigo-500 to-indigo-300",
    },
  ];

  return (
    <section id="sobre" className="py-20">

      <div className="max-w-5xl mx-auto px-6">

        {/* CARD CONTENEDORA (VERSIÓN ELEGANTE) */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-8 text-center">

          {/* TÍTULO */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6 text-blue-900"
          >
            Modelo CICE
          </motion.h2>

          {/* DESCRIPCIÓN */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-700 mb-10 leading-relaxed"
          >
            El Modelo Integral de Ciberseguridad Educativa (CICE) constituye un
            marco metodológico y conceptual diseñado para orientar la prevención,
            comprensión y gestión de los riesgos digitales que afectan el bienestar
            de niños, niñas y adolescentes en contextos educativos. Se fundamenta
            en evidencia empírica y propone una aproximación integral que supera
            las visiones fragmentadas de la ciberseguridad tradicional.
          </motion.p>

          {/* DIMENSIONES */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">

            {dimensiones.map((dim, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                }}
                className={`relative p-5 rounded-xl text-white cursor-pointer overflow-hidden
                  bg-gradient-to-br ${dim.color}`}
              >

                {/* ICONO */}
                <div className="mb-3 flex justify-center">
                  {dim.icono}
                </div>

                {/* TEXTO */}
                <h3 className="font-semibold text-sm">
                  {dim.nombre}
                </h3>

                {/* EFECTO BRILLO */}
                <div className="absolute inset-0 opacity-0 hover:opacity-20 bg-white transition duration-300"></div>

              </motion.div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}