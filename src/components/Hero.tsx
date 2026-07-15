"use client";

import { motion } from "framer-motion";
import { USCREEN } from "@/lib/config";
import { IconSparkle, IconWave } from "./BrandIcons";

const ease = [0.22, 1, 0.36, 1] as const;

function HeroCardContent() {
  return (
    <>
      {/* Eyebrow s jiskřičkou */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
        className="mb-4 flex items-center gap-2.5"
      >
        <IconSparkle size={12} />
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          Online jógové studio
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.25, ease }}
        className="font-allura text-5xl leading-[1.15] text-ink sm:text-6xl"
      >
        Rozsviť své vnitřní světlo.
      </motion.h1>

      {/* Vlnka pod nadpisem */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease }}
        className="mt-3"
      >
        <IconWave width={120} height={18} className="text-accent/50" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.4, ease }}
        className="mt-5 max-w-xs text-sm leading-relaxed text-muted"
      >
        Drahá ženo, nemusíš čekat na chvíli, kdy bude všechno hotové.
        Dopřej si prostor pro sebe už dnes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.55, ease }}
        className="mt-8 flex flex-col items-start gap-4"
      >
        <a
          href={USCREEN.signup}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          Vstoupit do online studia
        </a>
        <a
          href="#lekce"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:text-accent"
        >
          Aktuální lekce
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </motion.div>
    </>
  );
}

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-cream">
      {/* ── Desktop ── */}
      <div className="relative hidden md:block md:h-[74vh] md:min-h-[540px]">
        {/* Video na plnou šířku */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        {/* Jemné sjednocení s paletou */}
        <div className="absolute inset-0 bg-cream/8" />

        {/* Plovoucí karta */}
        <div className="relative z-10 flex h-full items-center pl-[6vw]">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.95, ease }}
            className="max-w-md bg-cream/80 p-10 ring-1 ring-white/60 backdrop-blur-lg lg:p-12"
            style={{
              borderRadius: "80px 28px 28px 28px",
              boxShadow: "0 24px 60px -20px rgba(140, 95, 71, 0.25)",
            }}
          >
            <HeroCardContent />
          </motion.div>
        </div>

        {/* Vlnka dole — návaznost na sekce níže */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-20">
          <svg
            viewBox="0 0 1440 128"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <path d="M0,64 C480,124 960,4 1440,64 L1440,128 L0,128 Z" fill="#FCF4F1" />
          </svg>
        </div>
      </div>

      {/* ── Mobil: video nahoře s vlnkou, karta pod ním ── */}
      <div className="md:hidden">
        <div className="relative h-[64vw] min-h-[280px] overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 bottom-0 h-14">
            <svg
              viewBox="0 0 1440 128"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              <path d="M0,64 C480,124 960,4 1440,64 L1440,128 L0,128 Z" fill="#FCF4F1" />
            </svg>
          </div>
        </div>
        <div className="px-8 pb-12 pt-4">
          <HeroCardContent />
        </div>
      </div>
    </section>
  );
}
