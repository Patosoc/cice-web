"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  Users,
  Microscope,
  Network,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden relative">

      {/* FONDO TECNOLÓGICO SUTIL */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="#0F3057" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <h1 className="text-2xl font-bold text-[#0F3057] tracking-wide">
          CICE
        </h1>
        <nav className="space-x-6 text-sm text-slate-600 hidden md:block">
          <a href="#quienes" className="hover:text-[#059669] transition">Quiénes Somos</a>
          <a href="#lineas" className="hover:text-[#059669] transition">Líneas</a>
          <a href="#modelo" className="hover:text-[#059669] transition">Modelo</a>
          <a href="#estado" className="hover:text-[#059669] transition">Estado</a>
          <a href="#fundador" className="hover:text-[#059669] transition">Fundador</a>
          <a href="#contacto" className="hover:text-[#059669] transition">Contacto</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative text-center py-32 px-6 bg-gradient-to-br from-white via-slate-100 to-emerald-50">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#059669] rounded-full blur-3xl"
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-5xl md:text-6xl font-bold max-w-4xl mx-auto text-[#0F3057]"
        >
          CENTRO DE INNOVACION Y CIBERSEGURIDAD EDUCATIVA
        </motion.h1>

        <p className="relative mt-8 text-lg text-slate-600 max-w-3xl mx-auto">
          Iniciativa privada orientada a fortalecer la protección digital en el sector educativo mediante formación, investigación, innovación y acompañamiento institucional.
        </p>

        <div className="relative mt-10 flex justify-center gap-6 flex-wrap">
          <button className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg">
            Conocer el Proyecto
          </button>
          <button className="border border-[#059669] text-[#059669] hover:bg-[#059669] hover:text-white px-6 py-3 rounded-xl transition">
            Explorar Alianzas
          </button>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section id="quienes" className="py-24 px-10 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-[#0F3057]">
          Quiénes Somos
        </h2>
        <p className="text-slate-600 leading-relaxed">
          El CICE es una iniciativa privada que busca fortalecer la cultura de ciberseguridad en instituciones educativas, promoviendo la gestión preventiva de riesgos digitales y el desarrollo de capacidades institucionales para la protección integral de estudiantes.
        </p>
      </section>

      {/* LÍNEAS ESTRATÉGICAS */}
      <section id="lineas" className="py-28 px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#0F3057]">
          LINEAS ESTRATEGICAS
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <BookOpen size={32} />,
              title: "Formación y Capacitación",
              text: "Programas educativos para fortalecer competencias en seguridad digital."
            },
            {
              icon: <Microscope size={32} />,
              title: "Investigación Aplicada",
              text: "Generación de conocimiento sobre riesgos digitales en educación."
            },
            {
              icon: <Users size={32} />,
              title: "Acompañamiento Institucional",
              text: "Asesoría estratégica para fortalecer capacidades internas."
            },
            {
              icon: <Lightbulb size={32} />,
              title: "Innovación",
              text: "Desarrollo de metodologías adaptadas a la evolución tecnológica."
            },
            {
              icon: <Network size={32} />,
              title: "Articulación Interinstitucional",
              text: "Alianzas con actores públicos, privados y mixtos."
            },
            {
              icon: <Shield size={32} />,
              title: "Enfoque Preventivo Integral",
              text: "Promoción de cultura institucional orientada a la prevención."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-[#059669] mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-3 text-[#0F3057]">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

        {/* PROPUESTA DE VALOR */}
    <section id="valor" className="py-28 px-10 bg-gradient-to-b from-white to-slate-100">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-3xl font-bold mb-6 text-[#0F3057]">
          Propuesta de Valor para Aliados Estratégicos
        </h2>

        <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16">
          El CICE ofrece una plataforma especializada para fortalecer la gestión preventiva del riesgo digital en el sector educativo, contribuyendo a la reducción de incidentes, fortalecimiento institucional y mejora de la confianza digital.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#0F3057]">
              Reducción de Riesgos Reputacionales
            </h3>
            <p className="text-slate-600 text-sm">
              Contribuye a disminuir la exposición a incidentes de ciberseguridad que afectan la confianza institucional y la continuidad académica.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#0F3057]">
              Impacto Social Medible
            </h3>
            <p className="text-slate-600 text-sm">
              Desarrollo de capacidades institucionales y fortalecimiento de la cultura preventiva en comunidades educativas.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#0F3057]">
              Escalabilidad y Articulación
            </h3>
            <p className="text-slate-600 text-sm">
              Modelo adaptable a diferentes niveles educativos y territorios, facilitando alianzas público-privadas.
            </p>
          </motion.div>

        </div>

        <div className="mt-16">
          <button className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-xl transition shadow-md hover:shadow-lg">
            Explorar Modelo de Alianzas
          </button>
        </div>

      </div>
    </section>

      {/* MODELO */}
      <section id="modelo" className="bg-white py-24 px-10 text-center">
        <h2 className="text-3xl font-bold mb-10 text-[#0F3057]">
          MODELO DE ACTUACIÓN
        </h2>
        <p className="text-slate-600 max-w-4xl mx-auto leading-relaxed">
          El CICE integra formación, investigación aplicada y acompañamiento institucional bajo un enfoque preventivo y colaborativo, contribuyendo al fortalecimiento de la seguridad digital en comunidades educativas.
        </p>
      </section>

      {/* ESTADO */}
      <section id="estado" className="bg-gradient-to-r from-[#0F3057] to-[#1E3A5F] py-24 px-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-8">
          ESTADO DEL PROYECTO
        </h2>
        <p className="max-w-3xl mx-auto text-slate-200">
          Fase conceptual avanzada con estructura estratégica definida y liderazgo identificado. Actualmente en proceso de consolidación operativa y búsqueda de aliados estratégicos y mecanismos de financiación.
        </p>
      </section>

      {/* FUNDADOR */}
      <section id="fundador" className="py-24 px-10 bg-slate-50">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#0F3057]">
          FUNDADOR
        </h2>

        <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl border border-slate-200 shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-[#0F3057]">
            Ing. Oscar A. Fajardo Ortega
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Ingeniero de Sistemas, Especialista en Seguridad Informática y Magíster en Gerencia de Proyectos, con amplia experiencia en docencia y ejercicio profesional en seguridad digital y gestión de proyectos tecnológicos.
          </p>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 text-center border-t border-slate-200 bg-white">
        <h2 className="text-2xl font-semibold mb-4 text-[#0F3057]">
          Contacto
        </h2>
        <p className="text-slate-600">contacto@cice.org</p>
        <p className="text-slate-600">3175999993</p>
      </section>

    </main>
  );
}