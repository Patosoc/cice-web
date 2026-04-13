import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CICE | Centro de Investigación en Ciberseguridad Educativa",
  description:
    "Centro dedicado a la investigación, innovación y formación en ciberseguridad aplicada a entornos educativos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="relative">

        {/* IMAGEN FIJA */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url('/aula.jpg')" }}
        />

        {/* DEGRADADO AZUL LATERAL (izquierda → derecha) */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-r from-[#0B2A5B]/90 via-[#1F4E8C]/70 to-transparent" />

        <Navbar />

        <main className="pt-20">{children}</main>

        <Footer />

      </body>
    </html>
  );
}