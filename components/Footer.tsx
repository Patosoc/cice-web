import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

const redes = {
  facebook: "https://www.facebook.com/share/1BxfXbXnWQ/",
  instagram: "https://www.instagram.com/mycicecol/",
  linkedin:
    "https://www.linkedin.com/company/my-cice",
  whatsapp:
    "https://wa.me/573175999993?text=Hola%2C%20quiero%20recibir%20informaci%C3%B3n%20sobre%20los%20servicios%20del%20Centro%20de%20Innovaci%C3%B3n%20y%20Ciberseguridad%20Educativa%20%28CICE%29.",
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="font-semibold">
          © 2026 Centro de Innovación y Ciberseguridad Educativa
        </p>

        <p className="mt-3">Cel. 317 599 99 93</p>

        <p>
          <a
            href="mailto:contacto@my-cice.com"
            className="hover:text-blue-300 transition"
          >
            contacto@my-cice.com
          </a>
        </p>

        <div className="mt-6 flex items-center justify-center gap-6">
          <a
            href={redes.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de CICE"
            title="Facebook"
            className="hover:text-blue-400 transition"
          >
            <Facebook size={25} />
          </a>

          <a
            href={redes.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de CICE"
            title="Instagram"
            className="hover:text-pink-400 transition"
          >
            <Instagram size={25} />
          </a>

          <a
            href={redes.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de CICE"
            title="LinkedIn"
            className="hover:text-blue-500 transition"
          >
            <Linkedin size={25} />
          </a>

          <a
            href={redes.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar a CICE por WhatsApp"
            title="WhatsApp"
            className="hover:text-green-400 transition"
          >
            <MessageCircle size={25} />
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-300">
          Síguenos en redes sociales y conoce nuestros servicios.
        </p>
      </div>
    </footer>
  );
}