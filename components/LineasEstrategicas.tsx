"use client";

import { motion } from "framer-motion";
import { Shield, BookOpen, Lightbulb, Users } from "lucide-react";

export default function LineasEstrategicas() {
  return (
    <section id="lineas" className="py-20">

      <div className="max-w-6xl mx-auto px-6">

        <div className="card">

          <h2 className="text-3xl font-bold text-center mb-12">
            Líneas Estratégicas
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[ 
              { title: "Formación", icon: <BookOpen /> },
              { title: "Investigación", icon: <Shield /> },
              { title: "Innovación", icon: <Lightbulb /> },
              { title: "Acompañamiento", icon: <Users /> },
            ].map((item, i) => (

              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white shadow-md p-6 rounded-xl text-center cursor-pointer"
              >

                <div className="flex justify-center mb-4 text-blue-700">
                  {item.icon}
                </div>

                <h3 className="font-bold">{item.title}</h3>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}