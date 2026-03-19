import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CICE | Centro de Innovación y Ciberseguridad Educativa",
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

  {/* FONDO FIJO */}
  <div
    className="fixed inset-0 -z-10 bg-cover bg-center"
    style={{ backgroundImage: "url('/aula.jpg')" }}
  />

  {/* CAPA AZUL SUAVE */}
  <div className="fixed inset-0 -z-10 bg-blue-900/70" />

  <Navbar />

  <main>{children}</main>

  <Footer />

</body>
    </html>
  );
}