import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, GraduationCap, Cpu, Users, Globe, Mail, BarChart3, Lock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CICEWebsite() {
  const [darkMode, setDarkMode] = useState(true);
  const [filter, setFilter] = useState("Todos");

  const projects = [
    { title: "DIRDE–CICE", category: "Diagnóstico" },
    { title: "Plataforma CICE", category: "Tecnología" },
    { title: "Programa PF–CICE", category: "Formación" },
    { title: "Observatorio de Bienestar Digital", category: "Investigación" },
  ];

  const categories = ["Todos", "Diagnóstico", "Tecnología", "Formación", "Investigación"];

  return (
    <div className={darkMode ? "bg-slate-950 text-slate-200" : "bg-white text-slate-900"}>
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide">CICE</h1>
        <nav className="space-x-6 text-sm">
          <a href="#modelo">Modelo</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#publicaciones">Publicaciones</a>
          <a href="#transparencia">Transparencia</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Modo Claro" : "Modo Oscuro"}
        </Button>
      </header>

      {/* Hero */}
      <section className="px-10 py-24 text-center bg-gradient-to-b from-slate-900 to-slate-950">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold leading-tight"
        >
          Centro de Innovación en Ciberseguridad Educativa
        </motion.h2>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400">
          Modelo integral, ético y escalable para la protección del bienestar digital en entornos educativos.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button className="rounded-2xl px-6 py-3">Explorar Modelo</Button>
          <Button variant="outline" className="rounded-2xl px-6 py-3">Área Aliados</Button>
        </div>
      </section>

      {/* Modelo */}
      <section id="modelo" className="px-10 py-20">
        <h3 className="text-3xl font-semibold mb-10">Modelo CICE</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Dimensión Tecnológica" },
            { icon: GraduationCap, title: "Dimensión Pedagógica" },
            { icon: Users, title: "Dimensión Psicosocial" },
            { icon: Lock, title: "Dimensión Normativa" },
            { icon: Globe, title: "Gobernanza Ética" },
            { icon: Cpu, title: "Innovación Responsable" },
          ].map((item, index) => (
            <Card key={index} className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <item.icon className="mb-4" />
                <h4 className="text-xl font-semibold">{item.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dashboard Métricas */}
      <section className="px-10 py-20 bg-slate-900">
        <h3 className="text-3xl font-semibold mb-10">Indicadores Estratégicos</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {["Instituciones acompañadas", "Docentes formados", "Diagnósticos aplicados"].map((metric, i) => (
            <Card key={i} className="rounded-2xl shadow-lg">
              <CardContent className="p-6 flex flex-col items-center">
                <BarChart3 className="mb-4" />
                <h4 className="text-xl font-semibold">{metric}</h4>
                <p className="text-3xl font-bold mt-4">---</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Proyectos con Filtro */}
      <section id="proyectos" className="px-10 py-20">
        <h3 className="text-3xl font-semibold mb-6">Portafolio Estratégico</h3>
        <div className="flex gap-4 mb-8 flex-wrap">
          {categories.map((cat) => (
            <Button key={cat} variant={filter === cat ? "default" : "outline"} onClick={() => setFilter(cat)}>
              {cat}
            </Button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects
            .filter((p) => filter === "Todos" || p.category === filter)
            .map((project, index) => (
              <Card key={index} className="rounded-2xl shadow-md">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold">{project.title}</h4>
                  <p className="text-sm text-slate-400 mt-2">Categoría: {project.category}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      {/* Publicaciones */}
      <section id="publicaciones" className="px-10 py-20 bg-slate-900">
        <h3 className="text-3xl font-semibold mb-6">Publicaciones y Recursos</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {["Guía DIRDE", "Marco Ético CICE", "Informe Bienestar Digital 2026"].map((pub, i) => (
            <Card key={i} className="rounded-2xl shadow-md">
              <CardContent className="p-6">
                <FileText className="mb-4" />
                <h4 className="text-lg font-semibold">{pub}</h4>
                <Button variant="outline" className="mt-4">Descargar</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Transparencia */}
      <section id="transparencia" className="px-10 py-20">
        <h3 className="text-3xl font-semibold mb-6">Transparencia y Cumplimiento</h3>
        <p className="max-w-4xl text-slate-400">
          La Plataforma CICE opera bajo principios de privacidad contextual, minimización de datos, control de accesos por roles y cumplimiento normativo en protección de datos personales. No se realizan procesos de vigilancia individual ni perfilamiento automatizado.
        </p>
      </section>

      {/* Contacto */}
      <section id="contacto" className="px-10 py-20 bg-slate-900">
        <h3 className="text-3xl font-semibold mb-6">Contacto Institucional</h3>
        <div className="flex items-center gap-4">
          <Mail />
          <span>contacto@cice.org</span>
        </div>
        <div className="mt-8 flex gap-6">
          <a href="#">LinkedIn</a>
          <a href="#">X</a>
          <a href="#">YouTube</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-6 border-t border-slate-800 text-sm text-center">
        © {new Date().getFullYear()} CICE - Arquitectura preparada para despliegue seguro (HTTPS, WAF, backend API, autenticación por roles, integración futura con LMS).
      </footer>
    </div>
  );
}
