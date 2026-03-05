import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LineasEstrategicas from "@/components/LineasEstrategicas";
import ModeloActuacion from "@/components/ModeloActuacion";
import PropuestaValor from "@/components/PropuestaValor";
import Fundador from "@/components/Fundador";
import EstadoProyecto from "@/components/EstadoProyecto";
import Contacto from "@/components/Contacto";

export default function Home() {
  return (
    <main>

      <Navbar />

      <Hero />

      <LineasEstrategicas />

      <ModeloActuacion />

      <PropuestaValor />

      <Fundador />

      <EstadoProyecto />

      <Contacto />

    </main>
  );
}