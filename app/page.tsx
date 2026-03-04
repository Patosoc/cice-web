"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Users, Lock, Radar } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CICE
        </h1>
        <nav className="space-x-6 text-sm text-slate-300">
          <a href="#modelo" className="hover:text-cyan-400">Modelo</a>
          <a href="#solucion" className="hover:text-cyan-400">Solución</a>
          <a href="#impacto" className="hover:text-cyan-400">Impacto</a>
          <a href="#contacto" className="hover:text-cyan-400">Contacto</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center py-32 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold max-w-4xl mx-auto leading-tight"
        >
          Protección Digital Inteligente para Estudiantes
        </motion.h1>

        <p className="mt-8 text-lg text-slate-400 max-w-2xl mx-auto">
          Detectamos, prevenimos y mitigamos riesgos digitales en entornos educativos mediante tecnología avanzada, análisis preventivo y enfoque ético.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-3 rounded-xl transition">
            Solicitar Diagnóstico
          </button>
          <button className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-slate-900 px-6 py-3 rounded-xl transition">
            Conocer Plataforma
          </button>
        </div>
      </section>

      {/* MODELO */}
      <section id="modelo" className="py-24 px-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-cyan-400">
          Arquitectura Integral CICE
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500 transition">
            <ShieldCheck size={40} className="text-cyan-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Prevención Activa</h3>
            <p className="text-slate-400 text-sm">
              Identificación temprana de riesgos como ciberacoso, exposición indebida y vulneraciones de datos.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500 transition">
            <Cpu size={40} className="text-cyan-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Inteligencia Analítica</h3>
            <p className="text-slate-400 text-sm">
              Modelos de análisis para detección de patrones de riesgo en entornos digitales educativos.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-cyan-500 transition">
            <Users size={40} className="text-cyan-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Formación Estratégica</h3>
            <p className="text-slate-400 text-sm">
              Capacitación especializada para docentes, estudiantes y padres.
            </p>
          </div>

        </div>
      </section>

      {/* SOLUCIÓN */}
      <section id="solucion" className="bg-slate-900 py-24 px-10">
        <h2 className="text-3xl font-bold text-center mb-16 text-cyan-400">
          Plataforma CICE
        </h2>

        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">

          <div>
            <Lock size={40} className="text-cyan-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Protección de Datos</h3>
            <p className="text-slate-400">
              Arquitectura segura basada en principios de privacidad contextual y minimización de datos.
            </p>
          </div>

          <div>
            <Radar size={40} className="text-cyan-400 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Monitoreo Ético</h3>
            <p className="text-slate-400">
              Supervisión agregada y preventiva sin vigilancia individual ni perfilamiento invasivo.
            </p>
          </div>

        </div>
      </section>

      {/* IMPACTO */}
      <section id="impacto" className="py-24 px-10 text-center">
        <h2 className="text-3xl font-bold mb-16 text-cyan-400">
          Impacto Esperado
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div>
            <h3 className="text-5xl font-bold text-cyan-400">+200</h3>
            <p className="text-slate-400 mt-4">Instituciones protegidas</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-cyan-400">+10.000</h3>
            <p className="text-slate-400 mt-4">Estudiantes beneficiados</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-cyan-400">24/7</h3>
            <p className="text-slate-400 mt-4">Capacidad preventiva</p>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="bg-slate-900 py-20 text-center border-t border-slate-800">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
          Contacto Estratégico
        </h2>
        <p className="text-slate-400">contacto@cice.org</p>
      </section>

    </main>
  );
}