"use client";

import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

export default function SobreCICE() {
  return (
    <section id="sobre" className="py-20">

      <div className="max-w-5xl mx-auto px-6">

        <AnimatedSection>

          <div className="card text-center">

            <h2 className="text-3xl font-bold mb-6">
              Modelo CICE
            </h2>

            <p className="text-gray-700 mb-6">
              El Modelo Integral de Ciberseguridad Educativa constituye un marco
              metodológico y conceptual diseñado para orientar la prevención,
              comprensión y gestión de los riesgos digitales que afectan el bienestar
              de niños y adolescentes en contextos educativos.
            </p>

            <p className="text-gray-700 mb-8">
              Se fundamenta en evidencia empírica y marcos conceptuales contemporáneos,
              proponiendo una aproximación integral que supera las visiones fragmentadas
              de la ciberseguridad tradicional en el ámbito escolar.
            </p>

            <h3 className="text-xl font-semibold mb-4">
              Dimensiones del Modelo
            </h3>

            import { Cpu, BookOpen, Heart, Users, Scale, ShieldCheck } from "lucide-react";

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

              <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">

                {dimensiones.map((dim, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-white shadow-md cursor-pointer
                      bg-gradient-to-br ${dim.color}`}
                  >
                    <div className="text-white">
                      {dim.icono}
                    </div>

                    <span className="font-semibold">
                      {dim.nombre}
                    </span>
                  </motion.div>
                ))}

              </div>

          </div>

        </AnimatedSection>

      </div>

    </section>
  );
}