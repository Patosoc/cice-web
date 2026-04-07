"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, BookOpen, Lightbulb, Users } from "lucide-react";

export default function LineasEstrategicas() {

  const [activo, setActivo] = useState("Formacion");

  const servicios = [
    {
      id: "Diagnostico",
      title: "Diagnóstico Integral de Riesgo Digital Escolar",
      icon: <BookOpen />,
      contenido:
        "El Diagnóstico Integral de Riesgo Digital Escolar es un servicio especializado que permite a una institución educativa comprender su nivel real de riesgo digital, identificar brechas críticas y contar con una hoja de ruta clara y priorizada para proteger el bienestar de niños y adolescentes en contextos tecnológicos. No es una auditoría técnica. Es un diagnóstico educativo, preventivo y estratégico.",
    },
    {
      id: "Acompañamiento",
      title: "Acompañamiento Estratégico",
      icon: <Shield />,
      contenido:
        "El Acompañamiento Estratégico en Ciberseguridad Educativa es un servicio continuo mediante el cual CICE apoya a la institución educativa en la implementación real de la hoja de ruta definida en el diagnóstico, fortaleciendo capacidades internas, prácticas pedagógicas y protocolos institucionales. Aquí no se “entrega un informe y se va”. Aquí se transforma la institución.",
    },
    {
      id: "Formacion",
      title: "Programa de Formación",
      icon: <Lightbulb />,
      contenido:
        "El Programa de Formación en Ciberseguridad Educativa y Bienestar Digital es una oferta formativa especializada dirigida a directivos, docentes y equipos de orientación, orientada a desarrollar capacidades reales para prevenir, detectar y gestionar riesgos digitales en contextos educativos. No es capacitación técnica aislada. Es formación aplicada, contextual y ética.",
    },
    {
      id: "Plataforma",
      title: "Sistema Integrado",
      icon: <Users />,
      contenido:
        "La Plataforma CICE es un sistema digital especializado que integra, soporta y amplifica los Servicios 1, 2 y 3, permitiendo a las instituciones educativas gestionar de forma continua, preventiva y ética los riesgos digitales que afectan a niños y adolescentes.  No es una plataforma de ciberseguridad tradicional. Es una plataforma sociotécnica de ciberseguridad educativa.",
    },
    {
      id: "Observatorio",
      title: "Observatorio CICE",
      icon: <Users />,
      contenido:
        "El Servicio 5 es una capacidad avanzada del modelo CICE orientada a generar, analizar y transferir evidencia agregada y no individual sobre riesgos digitales, bienestar infantil en contextos tecnológicos y capacidades institucionales del sistema educativo. No es un servicio operativo para colegios individuales. Es un servicio de inteligencia institucional, académica y de política pública.",
    },
  ];

  const seleccionado = servicios.find((s) => s.id === activo);

  return (
    <section id="lineas" className="py-20">

      <div className="max-w-6xl mx-auto px-6">

        {/* CARD FLOTANTE */}
        <div className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-2xl shadow-xl p-8">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* CONTENIDO */}
            <div>

              <h2 className="text-3xl font-bold text-blue-900 mb-8">
                Líneas Estratégicas
              </h2>

              {/* CARDS */}
              <div className="grid grid-cols-2 gap-4">

                {servicios.map((item) => {

                  const isActive = activo === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => setActivo(item.id)}
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-xl cursor-pointer border transition
                        ${isActive
                          ? "bg-blue-900 text-white border-blue-900 shadow-lg"
                          : "bg-white text-gray-800 border-gray-200"}
                      `}
                    >

                      <div className="mb-2 text-blue-500">
                        {item.icon}
                      </div>

                      <h3 className="text-sm font-semibold">
                        {item.title}
                      </h3>

                    </motion.div>
                  );
                })}

              </div>

              {/* CONTENIDO DINÁMICO */}
              <div className="mt-8 min-h-[140px]">

                <AnimatePresence mode="wait">

                  <motion.div
                    key={seleccionado?.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg"
                  >

                    <h4 className="font-semibold text-blue-900 mb-2">
                      {seleccionado?.title}
                    </h4>

                    <p className="text-gray-700">
                      {seleccionado?.contenido}
                    </p>

                  </motion.div>

                </AnimatePresence>

              </div>

            </div>

            {/* IMAGEN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="/estrategicas.jpg"
                alt="Líneas estratégicas CICE"
                className="rounded-2xl shadow-xl object-cover w-full h-[400px]"
              />
            </motion.div>

          </div>

        </div>

      </div>

    </section>
  );
}