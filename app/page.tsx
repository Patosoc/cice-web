import Hero from "@/components/Hero";
import SobreCICE from "@/components/SobreCICE";
import LineasEstrategicas from "@/components/LineasEstrategicas";
import Fundador from "@/components/Fundador";
import Contacto from "@/components/Contacto";
import Proyeccion from "@/components/Proyeccion";

export default function Home() {
  return (
    <main>

      <Hero />

      <Proyeccion />

      <SobreCICE />

      <LineasEstrategicas />

      <Contacto />

    </main>
  );
}