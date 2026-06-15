"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Hatha jóga",
    description:
      "Pomalejší tempo, důraz na správné dýchání a vědomé protažení celého těla.",
  },
  {
    title: "Vinyasa flow",
    description:
      "Dynamická praxe propojující pohyb s dechem, pro zvýšení síly a flexibility.",
  },
  {
    title: "Jóga pro začátečníky",
    description:
      "Úvod do základních pozic a principů jógy v klidném a podporujícím prostředí.",
  },
];

export default function Services() {
  return (
    <section id="lekce" className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="mb-16 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-dark">
          Lekce
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl">Co u mě najdete</h2>
      </div>

      <div className="grid gap-10 sm:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 h-px w-12 bg-accent-dark" />
            <h3 className="font-serif text-2xl">{service.title}</h3>
            <p className="mt-3 text-foreground/70">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
