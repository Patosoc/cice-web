"use client";

import { motion } from "framer-motion";
import { Shield, BookOpen, Lightbulb, Users } from "lucide-react";

export default function LineasEstrategicas() {
  return (
    <section id="lineas" className="py-20">

      <div className="max-w-6xl mx-auto px-6">

        <div className="card">

          <h2 className="text-3xl font-bold text-center mb-12">
            Servicios
          </h2>

          <div className="grid md:grid-cols-5 gap-6">

            {[ 
              { title: "DIAGNÓSTICO INTEGRAL DE RIESGO DIGITAL ESCOLAR (DIRDE–CICE)", icon: <BookOpen /> },
              { title: "ACOMPAÑAMIENTO ESTRATÉGICO EN CIBERSEGURIDAD EDUCATIVA (AECE–CICE)", icon: <Shield /> },
              { title: "PROGRAMA DE FORMACIÓN EN CIBERSEGURIDAD EDUCATIVA (SICE)", icon: <Lightbulb /> },
              { title: "SISTEMA INTEGRADO DE CIBERSEGURIDAD EDUCATIVA", icon: <Users /> },
              { title: "OBSERVATORIO Y EVIDENCIA CICE", icon: <BookOpen /> },
            ].map((item, i) => (

              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white shadow-md p-6 rounded-xl text-center cursor-pointer"
              >

                <div className="flex justify-center mb-4 text-blue-700">
                  {item.icon}
                </div>

                <h3 className="font-bold">{item.title}</h3>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}