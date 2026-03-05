export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-10 py-6 border-b border-slate-200 sticky top-0 bg-white">

      <h1 className="text-2xl font-bold text-[#0F3057]">
        CICE
      </h1>

      <nav className="space-x-6 text-sm text-slate-600">
        <a href="#lineas">Líneas</a>
        <a href="#modelo">Modelo</a>
        <a href="#valor">Propuesta de Valor</a>
        <a href="#contacto">Contacto</a>
      </nav>

    </header>
  );
}