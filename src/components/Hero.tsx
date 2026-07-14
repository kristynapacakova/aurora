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
      {/* ── Desktop: video plné pozadí (skryto na mobilu) ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 hidden h-full w-full object-cover object-right md:block"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Desktop: horizontální gradient cream → průhlednost ── */}
      {/* Levá strana je 100% krémová (čisté plátno pro text),
          plynule přechází do průhlednosti a odhaluje fotografii vpravo */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, #FCF4F1 0%, #FCF4F1 36%, rgba(252,244,241,0.82) 52%, rgba(252,244,241,0.35) 68%, transparent 82%)",
        }}
      />

      {/* ── Mobil: video jako blokový element nad textem ── */}
      <div className="relative h-[68vw] min-h-[300px] overflow-hidden md:hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Plynulý přechod do krémového podkladu textu níže */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream to-transparent" />
      </div>

      {/* ── Textový blok ── */}
      <div className="relative z-10 flex flex-col px-8 py-14 md:w-[46%] md:py-0 md:pl-[8vw] md:pr-6 lg:w-[44%] lg:pl-[10vw] xl:pl-[12vw]">
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
          className="font-allura text-6xl leading-[1.1] text-ink sm:text-7xl lg:text-8xl"
        >
          Rozsviť své vnitřní světlo.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease }}
          className="mt-6 max-w-xs text-base leading-relaxed text-muted"
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

      {/* Blend do další sekce */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream via-cream/60 to-transparent" />

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
