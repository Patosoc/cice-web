"use client";

import { useEffect, useState } from "react";

const secciones = [
  { id: "inicio", label: "Inicio" },
  { id: "proyeccion", label: "Proyección" },
  { id: "sobre", label: "Modelo CICE" },
  { id: "lineas", label: "Líneas Estratégicas" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {

  const [activo, setActivo] = useState("inicio");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      secciones.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop - 100;
          const height = el.offsetHeight;

          if (scrollY >= top && scrollY < top + height) {
            setActivo(sec.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO / NOMBRE */}
        <a href="#inicio" className="font-bold text-blue-900">
          CICE
        </a>

        {/* MENÚ */}
        <div className="flex gap-6">

          {secciones.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`transition font-medium
                ${activo === sec.id
                  ? "text-blue-900 border-b-2 border-blue-900"
                  : "text-gray-600 hover:text-blue-800"}
              `}
            >
              {sec.label}
            </a>
          ))}

        </div>

      </div>

    </nav>
  );
}