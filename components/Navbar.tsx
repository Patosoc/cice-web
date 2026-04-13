"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const secciones = [
  { id: "inicio", label: "Inicio" },
  { id: "proyeccion", label: "Proyección" },
  { id: "sobre", label: "Modelo CICE" },
  { id: "lineas", label: "Líneas Estratégicas" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {

  const [activo, setActivo] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 60);

      secciones.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop - 120;
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
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
          ${scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-6"}
        `}
      >

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* LOGO */}
          <a href="#inicio" className="flex items-center gap-3">

            <Image
              src="/logo-cice.jpeg"
              alt="CICE"
              width={scrolled ? 50 : 80}
              height={scrolled ? 50 : 80}
              className="rounded-lg shadow-md transition-all duration-500"
              priority
            />

            <span
              className={`font-bold transition-all duration-500
                ${scrolled
                  ? "text-lg text-blue-900"
                  : "text-2xl text-white"}
              `}
            >
              CICE
            </span>

          </a>

          {/* MENÚ DESKTOP */}
          <div className="hidden md:flex gap-8">

            {secciones.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`transition font-medium relative
                  ${scrolled
                    ? activo === sec.id
                      ? "text-blue-700"
                      : "text-gray-700 hover:text-blue-600"
                    : activo === sec.id
                      ? "text-white"
                      : "text-white/80 hover:text-white"}
                `}
              >
                {sec.label}

                {activo === sec.id && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500"></span>
                )}
              </a>
            ))}

          </div>

          {/* BOTÓN HAMBURGUESA */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

      </nav>

      {/* MENÚ MÓVIL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-blue-950/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8"
          >

            {secciones.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setOpen(false)}
                className="text-white text-xl font-semibold hover:text-blue-300 transition"
              >
                {sec.label}
              </a>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}