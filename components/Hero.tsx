<section className="relative w-full h-[600px] flex items-center justify-center text-center text-white">

  {/* IMAGEN DE FONDO */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/aula.jpg')" }}
  />

  {/* CAPA DEGRADADA AZUL */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0B2A5B]/90 via-[#1F4E8C]/80 to-[#2FA4FF]/70"
  />  

  {/* CONTENIDO */}
  <div className="relative z-10 max-w-4xl px-6">

    <h1 className="text-4xl md:text-5xl font-bold mb-6">
      Centro de Innovación y Ciberseguridad Educativa
    </h1>

    <p className="text-lg">
      iniciativa estratégica orientada a transformar la manera en que los sistemas
      educativos abordan la protección del bienestar infantil en contextos mediados 
      por la tecnología.
    </p>

  </div>

</section>