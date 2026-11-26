
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const secciones = [
  { id: "inicio", label: "Inicio" },
  { id: "proyeccion", label: "Proyección" },
  { id: "sobre", label: "Modelo CICE" },
  { id: "lineas", label: "Líneas Estratégicas" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const esInicio = pathname === "/";

  const [activo, setActivo] = useState("inicio");
  const [scrolled, setScrolled] = useState(!esInicio);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!esInicio) {
      setScrolled(true);
      setActivo("");
      return;
    }

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

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [esInicio]);

  const destino = (id: string) =>
    esInicio ? `#${id}` : `/#${id}`;

  const cerrarMenu = () => setOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            href={esInicio ? "#inicio" : "/#inicio"}
            onClick={cerrarMenu}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo-cice.jpeg"
              alt="CICE"
              width={scrolled ? 50 : 80}
              height={scrolled ? 50 : 80}
              className="rounded-lg shadow-md transition-all duration-500"
              priority
            />

            <span
              className={`font-bold transition-all duration-500 ${
                scrolled
                  ? "text-lg text-blue-900"
                  : "text-2xl text-white"
              }`}
            >
              CICE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {secciones.map((sec) => (
              <Link
                key={sec.id}
                href={destino(sec.id)}
                className={`transition font-medium relative ${
                  scrolled
                    ? activo === sec.id && esInicio
                      ? "text-blue-700"
                      : "text-gray-700 hover:text-blue-600"
                    : activo === sec.id
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {sec.label}

                {esInicio && activo === sec.id && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-blue-500" />
                )}
              </Link>
            ))}

            <Link
              href="/portal/login"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                scrolled
                  ? "bg-[#0f1f5c] text-white hover:bg-[#1a3180]"
                  : "bg-[#c9a227] text-[#0a0f1e] hover:bg-[#e8c547]"
              }`}
            >
              <LogIn size={15} />
              Acceder al Portal
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className={`md:hidden ${
              scrolled ? "text-blue-950" : "text-white"
            }`}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

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
              <Link
                key={sec.id}
                href={destino(sec.id)}
                onClick={cerrarMenu}
                className="text-white text-xl font-semibold hover:text-blue-300 transition"
              >
                {sec.label}
              </Link>
            ))}

            <Link
              href="/portal/login"
              onClick={cerrarMenu}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#c9a227] text-[#0a0f1e] text-base font-bold hover:bg-[#e8c547] transition-all"
            >
              <LogIn size={18} />
              Acceder al Portal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
