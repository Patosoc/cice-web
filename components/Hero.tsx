"use client";

import Image from "next/image";

export default function Hero() {

  return (
    <section className="min-h-[600px] flex items-center">

      <div className="max-w-6xl mx-auto px-6 w-full">

        <div className="max-w-xl text-left text-white">

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Centro de Innovación y Ciberseguridad Educativa
          </h1>

          <p className="text-lg mb-6">
            Protegiendo el entorno digital de estudiantes mediante
            investigación, innovación y formación en ciberseguridad.
          </p>

          <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200">
            Conocer más
          </button>

        </div>

      </div>

    </section>
        

  );
}




