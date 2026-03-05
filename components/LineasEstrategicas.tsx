"use client";

import { BookOpen, Lightbulb, Users, Microscope } from "lucide-react";
import { motion } from "framer-motion";

export default function LineasEstrategicas() {

  const lineas = [
    {
      icon: <BookOpen size={32}/>,
      titulo:"Formación",
      texto:"Programas orientados al fortalecimiento de competencias en seguridad digital para estudiantes, docentes y directivos."
    },
    {
      icon:<Microscope size={32}/>,
      titulo:"Investigación",
      texto:"Desarrollo de estudios y análisis sobre riesgos digitales emergentes que afectan al sector educativo."
    },
    {
      icon:<Users size={32}/>,
      titulo:"Acompañamiento",
      texto:"Apoyo técnico y metodológico a instituciones educativas para fortalecer sus capacidades en ciberseguridad."
    },
    {
      icon:<Lightbulb size={32}/>,
      titulo:"Innovación",
      texto:"Diseño de iniciativas, proyectos y soluciones que promuevan entornos digitales educativos seguros."
    }
  ]

  return (

<section id="lineas" className="py-28 px-10 max-w-6xl mx-auto">

<h2 className="text-3xl font-bold text-center mb-16 text-[#0F3057]">
Líneas Estratégicas
</h2>

<div className="grid md:grid-cols-2 gap-10">

{lineas.map((l,i)=>(
<motion.div
key={i}
whileHover={{y:-6}}
className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition"
>

<div className="text-emerald-600 mb-4">
{l.icon}
</div>

<h3 className="text-lg font-semibold text-[#0F3057] mb-2">
{l.titulo}
</h3>

<p className="text-slate-600 text-sm">
{l.texto}
</p>

</motion.div>
))}

</div>
</section>
)
}