"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { USCREEN } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-cream pt-20"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:gap-0 md:py-0">
        {/* ── Text ── */}
        <div className="flex flex-col justify-center md:pr-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-5 text-xs uppercase tracking-[0.35em] text-accent"
          >
            Online jógové studio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
            className="font-serif text-5xl leading-[1.1] text-ink sm:text-6xl lg:text-7xl"
          >
            Pohyb,
            <br />
            <span className="italic">dech</span>
            <br />a klid mysli.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease }}
            className="mt-7 max-w-sm text-base leading-relaxed text-muted"
          >
            Přidej se do online studia, kde tě Anežka provede praxí jógy —
            živě i kdykoliv na přehrávání. Pro každý den, pro každou úroveň.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.34, ease }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href={USCREEN.signup}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:bg-accent-d"
            >
              Vyzkoušet online studio
            </a>
            <a
              href="#o-mne"
              className="rounded-full border border-line px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-muted transition-all duration-200 hover:border-ink hover:text-ink"
            >
              Zjistit více
            </a>
          </motion.div>
        </div>

        {/* ── Fotka ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="relative flex items-center justify-center"
        >
          {/* Dekorativní blob pozadí */}
          <div className="absolute -right-8 -top-8 h-72 w-72 rounded-full bg-sand opacity-60 blur-3xl" />
          <div className="absolute -bottom-8 -left-4 h-48 w-48 rounded-full bg-accent/20 blur-2xl" />

          <div className="relative h-[480px] w-full max-w-md overflow-hidden rounded-tl-[4rem] rounded-tr-md rounded-br-md rounded-bl-md md:ml-8 md:mt-12 md:rounded-tl-[6rem]">
            {/*
              Nahraďte src vlastní fotkou lektorky, např.:
              src="/foto-anezka.jpg"   (vložte soubor do složky public/)
            */}
            <Image
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85"
              alt="Anežka — lektorka jógy"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-muted to-transparent"
        />
      </motion.div>
    </section>
  );
}
