export default function SobreCICE() {
  return (
    <section id="sobre" className="py-20">

      <div className="max-w-4xl mx-auto text-center px-6">

        <h2 className="text-3xl font-bold mb-6">
          Modelo CICE
        </h2>

        <p className="text-gray-700 mb-6">
          El Modelo Integral de Ciberseguridad Educativa constituye un marco
          metodológico y conceptual diseñado para orientar la prevención,
          comprensión y gestión de los riesgos digitales que afectan el bienestar
          de niños y adolescentes en contextos educativos.
        </p>

        <p className="text-gray-700 mb-8">
          Se fundamenta en evidencia empírica y marcos conceptuales contemporáneos,
          proponiendo una aproximación integral que supera las visiones fragmentadas
          de la ciberseguridad tradicional en el ámbito escolar.
        </p>

        <h3 className="text-xl font-semibold mb-4">
          Dimensiones del Modelo
        </h3>

        <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto text-left">

          <div className="bg-white shadow p-4 rounded-lg">Tecnológica</div>
          <div className="bg-white shadow p-4 rounded-lg">Pedagógica</div>
          <div className="bg-white shadow p-4 rounded-lg">Psicosocial</div>
          <div className="bg-white shadow p-4 rounded-lg">Institucional</div>
          <div className="bg-white shadow p-4 rounded-lg">Normativa</div>
          <div className="bg-white shadow p-4 rounded-lg">Ética</div>

        </div>

      </div>

    </section>
  );
}