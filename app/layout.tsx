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
      <body>

        <Navbar />

        <main>{children}</main>

        <Footer />

      </body>
    </html>
  );
}