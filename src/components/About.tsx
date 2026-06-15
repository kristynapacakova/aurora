"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="o-mne" className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="aspect-[4/5] w-full rounded-2xl bg-sand"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-dark">
            O mně
          </p>
          <h2 className="font-sans font-light text-4xl sm:text-5xl">Ahoj, jsem Anežka</h2>
          <p className="mt-6 text-foreground/70 leading-relaxed">
            Józe se věnuji už více než osm let a ráda vás provedu praxí, která
            propojuje dech, pohyb a klid mysli. Mé lekce jsou vhodné jak pro
            úplné začátečníky, tak pro ty, kdo si chtějí prohloubit svou
            praxi.
          </p>
          <p className="mt-4 text-foreground/70 leading-relaxed">
            Věřím, že jóga není o výkonu, ale o naslouchání vlastnímu tělu.
            Přijďte si odpočinout, protáhnout se a najít chvilku jen pro sebe.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
