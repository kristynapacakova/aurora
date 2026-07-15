"use client";

import { motion } from "framer-motion";
import { USCREEN } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-cream md:flex md:min-h-screen md:items-center"
    >
      {/* ── Desktop: video jen v pravé části — postava mimo textovou zónu ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-y-0 right-0 hidden h-full w-[72%] object-cover md:block"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Desktop: horizontální gradient cream → průhlednost ── */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, #FCF4F1 0%, #FCF4F1 34%, rgba(252,244,241,0.78) 50%, rgba(252,244,241,0.28) 66%, transparent 80%)",
        }}
      />

      {/* ── Mobil: video jako blokový element nad textem ── */}
      <div className="relative h-[68vw] min-h-[300px] overflow-hidden md:hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </div>

      {/* ── Textový blok ── */}
      <div className="relative z-10 flex flex-col px-8 py-14 md:w-[48%] md:py-0 md:pl-[7vw] md:pr-6 lg:pl-[8vw]">
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease }}
          className="whitespace-nowrap font-allura text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl"
        >
          Rozsviť své vnitřní světlo.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease }}
          className="mt-6 max-w-sm text-base leading-relaxed text-muted"
        >
          Moje drahá ženo, nemusíš čekat na chvíli, až bude všechno hotové.
          <br />
          Dopřej si prostor pro sebe už dnes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.34, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href={USCREEN.signup}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-aurora px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Vstoupit do online studia
          </a>
          <a
            href="#lekce"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/40 px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Aktuální lekce
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>

      {/* Prolnutí do další sekce */}
      <div className="absolute inset-x-0 bottom-0 hidden h-28 bg-gradient-to-t from-cream to-transparent md:block" />

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Dolů
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-9 w-px bg-gradient-to-b from-muted to-transparent"
        />
      </motion.div>
    </section>
  );
}
