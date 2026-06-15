"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sand"
    >
      {/* decorative background shape */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-accent-dark/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-sm uppercase tracking-[0.3em] text-accent-dark"
        >
          Hatha &amp; Vinyasa jóga
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-sans font-light text-5xl leading-tight sm:text-6xl md:text-7xl"
        >
          Najdi svůj klid
          <br />
          na podložce i v životě
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-6 max-w-xl text-lg text-foreground/70"
        >
          Lekce jógy pro všechny úrovně — v klidném studiu i online. Společně
          si najdeme rovnováhu mezi pohybem, dechem a klidnou myslí.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#cenik"
            className="rounded-full bg-accent-dark px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-accent"
          >
            Rezervovat lekci
          </a>
          <a
            href="#o-mne"
            className="rounded-full border border-accent-dark px-8 py-3 text-sm uppercase tracking-widest text-accent-dark transition-colors hover:bg-accent-dark/10"
          >
            O mně
          </a>
        </motion.div>
      </div>
    </section>
  );
}
