"use client";

import { motion } from "framer-motion";
import { USCREEN } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen w-full bg-cream">
      {/* Video + overlay clipped separately so wave can escape */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-cream/90 from-30% via-cream/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center px-8 pb-8 pt-16 md:px-16 lg:px-24">
        <div className="max-w-lg">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-5 text-xs uppercase tracking-[0.35em] text-accent"
          >
            Online jógové studio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
            className="font-allura text-4xl leading-[1.2] text-ink sm:text-5xl"
          >
            Rozsviť své vnitřní světlo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease }}
            className="mt-7 max-w-xs text-xs leading-relaxed text-muted"
          >
            Drahá ženo, nemusíš čekat na chvíli, kdy bude všechno hotové.
            <br />
            Dopřej si prostor pro sebe už dnes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.34, ease }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href={USCREEN.signup}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:opacity-90"
            >
              Vstoupit do online studia
            </a>
            <a
              href="#lekce"
              className="rounded-full border border-ink/50 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-ink hover:bg-ink/5"
            >
              Aktuální lekce
            </a>
          </motion.div>
        </div>
      </div>

      {/* Wave bottom edge */}
      <div className="absolute inset-x-0 z-10 h-24" style={{ bottom: '-48px' }}>
        <svg viewBox="0 0 1440 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,40 C1100,4 900,4 720,48 C540,92 340,92 0,56 Z" fill="#FBE9DE" />
        </svg>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-muted to-transparent"
        />
      </motion.div>
    </section>
  );
}
