"use client";

import { motion } from "framer-motion";
import { USCREEN } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden bg-cream md:flex-row"
    >
      {/* ── Video — mobile: nahoře / desktop: vpravo ── */}
      <div className="order-1 relative h-[65vw] min-h-[280px] overflow-hidden md:order-2 md:h-auto md:flex-1">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Jemný celoplošný teplý overlay – sjednocuje video s paletou, bez ostrého přechodu */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FBE9DE]/18 via-transparent to-[#FDF6F0]/12" />

        {/* Blend z videa do textu (spodní okraj na mobilu) */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent md:hidden" />
      </div>

      {/* ── Text — mobile: dole / desktop: vlevo ── */}
      <div className="order-2 flex flex-col justify-center bg-cream px-8 py-16 md:order-1 md:w-[46%] md:py-32 md:pl-16 md:pr-12 lg:pl-24 lg:pr-16 xl:pl-32">
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
          className="mt-6 max-w-sm text-base leading-relaxed text-muted"
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
            className="rounded-full border border-ink px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:bg-ink/5"
          >
            Aktuální lekce
          </a>
        </motion.div>
      </div>

      {/* Bottom blend do další sekce */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream via-cream/50 to-transparent" />

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
