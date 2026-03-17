"use client";

import Image from "next/image";

export default function Navbar() {
  return (

    <nav className="w-full bg-white shadow-md sticky top-0">

      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        <div className="flex items-center gap-3">

          <Image
            src="/logo-cice.svg"
            alt="CICE"
            width={40}
            height={40}
          />

          <span className="font-bold text-blue-900">
            CICE
          </span>

        </div>

        <div className="flex gap-6 text-gray-700">

          <a href="#sobre">El Centro</a>
          <a href="#lineas">Líneas</a>
          <a href="#fundador">Fundador</a>
          <a href="#contacto">Contacto</a>

        </div>

      </div>

    </nav>

  );
}