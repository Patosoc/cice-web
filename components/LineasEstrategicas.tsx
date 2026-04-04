"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, BookOpen, Lightbulb, Users } from "lucide-react";

export default function LineasEstrategicas() {

  const [activo, setActivo] = useState("Formacion");

  const servicios = [
    {
      id: "Diagnostico",
      title: "Diagnóstico Integral de Riesgo Digital Escolar (DIRDE–CICE)",
      icon: <BookOpen />,
      contenido:
        "El Diagnóstico Integral de Riesgo Digital Escolar es un servicio especializado que permite a una institución educativa comprender su nivel real de riesgo digital, identificar brechas críticas y contar con una hoja de ruta clara y priorizada para proteger el bienestar de niños y adolescentes en contextos tecnológicos. No es una auditoría técnica. Es un diagnóstico educativo, preventivo y estratégico.",
    
    },
    {
      id: "Acompañamiento",
      title: "Acompañamiento Estratégico en Ciberseguridad Educativa",
      icon: <Shield />,
      contenido:
        "El Acompañamiento Estratégico en Ciberseguridad Educativa es un servicio continuo mediante el cual CICE apoya a la institución educativa en la implementación real de la hoja de ruta definida en el diagnóstico, fortaleciendo capacidades internas, prácticas pedagógicas y protocolos institucionales. Aquí no se “entrega un informe y se va”. Aquí se transforma la institución.",
    },
    {
      id: "Formacion",
      title: "Programa de Formación en Ciberseguridad Educativa",
      icon: <Lightbulb />,
      contenido:
        "El Programa de Formación en Ciberseguridad Educativa y Bienestar Digital es una oferta formativa especializada dirigida a directivos, docentes y equipos de orientación, orientada a desarrollar capacidades reales para prevenir, detectar y gestionar riesgos digitales en contextos educativos. No es capacitación técnica aislada. Es formación aplicada, contextual y ética.",
    },
    {
      id: "Plataforma",
      title: "Sistema Integrado de Ciberseguridad Educativa",
      icon: <Users />,
      contenido:
        "La Plataforma CICE es un sistema digital especializado que integra, soporta y amplifica los Servicios 1, 2 y 3, permitiendo a las instituciones educativas gestionar de forma continua, preventiva y ética los riesgos digitales que afectan a niños y adolescentes.  No es una plataforma de ciberseguridad tradicional. Es una plataforma sociotécnica de ciberseguridad educativa.",
    },
    {
      id: "Observatorio",
      title: "Observatorio y Evidencia CICE",
      icon: <Users />,
      contenido:
        "El Servicio 5 es una capacidad avanzada del modelo CICE orientada a generar, analizar y transferir evidencia agregada y no individual sobre riesgos digitales, bienestar infantil en contextos tecnológicos y capacidades institucionales del sistema educativo. No es un servicio operativo para colegios individuales. Es un servicio de inteligencia institucional, académica y de política pública.",
    },
  ];

  const seleccionado = servicios.find((s) => s.id === activo);

  return (
    <section id="lineas" className="py-20">

      <div className="max-w-6xl mx-auto px-6">

        <div className="relative rounded-2xl overflow-hidden shadow-xl">

          {/* FONDO CON PARALLAX SUAVE */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/estrategicas.jpg')" }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm"></div>

          {/* CONTENIDO */}
          <div className="relative z-10 p-8">

            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Líneas Estratégicas
            </h2>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {servicios.map((item) => {

                const isActive = activo === item.id;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => setActivo(item.id)}
                    whileHover={{ y: -6, scale: 1.04 }}
                    className={`relative p-4 rounded-xl text-center cursor-pointer border transition-all duration-300
                      ${isActive
                        ? "bg-white text-blue-900 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                        : "bg-white/90 backdrop-blur-md text-gray-800 border-transparent hover:shadow-lg"}
                    `}
                  >

                    {/* ICONO */}
                    <div className={`flex justify-center mb-4 transition ${
                      isActive ? "text-blue-600 scale-110" : "text-blue-700"
                    }`}>
                      {item.icon}
                    </div>

                    {/* TITULO */}
                    <h3 className="font-bold text-sm">
                      {item.title}
                    </h3>

                    {/* INDICADOR */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-b-xl"
                      />
                    )}

                  </motion.div>
                );
              })}

            </div>

            {/* CONTENIDO DINÁMICO */}
            <div className="mt-12 min-h-[180px]">

              <AnimatePresence mode="wait">

                <motion.div
                  key={seleccionado?.id}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                  transition={{ duration: 0.4 }}
                  className="text-white text-center max-w-3xl mx-auto"
                >

                  {/* ICONO */}
                  <div className="flex justify-center mb-4 text-blue-300">
                    {seleccionado?.icon}
                  </div>

                  {/* TITULO */}
                  <h3 className="text-xl font-semibold mb-3">
                    {seleccionado?.title}
                  </h3>

                  {/* CONTENIDO */}
                  <p className="text-gray-200">
                    {seleccionado?.contenido}
                  </p>

                </motion.div>

              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}