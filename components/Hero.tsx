"use client";

import Image from "next/image";

export default function Hero() {

  return (

    <section className="bg-blue-50 py-24">

      <div className="max-w-5xl mx-auto text-center px-6">

        <Image
          src="/logo-cice.svg"
          alt="Centro de Innovación y Ciberseguridad Educativa"
          width={150}
          height={150}
          className="mx-auto mb-6"
        />

        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Centro de Innovación y Ciberseguridad Educativa
        </h1>

        <p className="text-gray-700 text-lg">
          Iniciativa dedicada a la investigación,
          formación e innovación en ciberseguridad
          orientada a la protección de estudiantes
          en entornos educativos digitales.
        </p>

      </div>

    </section>

  );
}