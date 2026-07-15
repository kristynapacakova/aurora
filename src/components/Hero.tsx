"use client";

import { motion } from "framer-motion";
import { USCREEN } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section id="hero" className="relative bg-cream pt-24 pb-14 md:pt-28 md:pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-10 md:min-h-[62vh] md:flex-row-reverse md:gap-16">
          {/* ── Video v arch kartě ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease }}
            className="w-full shrink-0 md:w-[46%]"
          >
            <div className="photo-arch-right relative h-[240px] w-full overflow-hidden bg-sand sm:h-[300px] md:h-[440px]">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>

          {/* ── Textový blok ── */}
          <div className="flex flex-1 flex-col">
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
              className="font-allura text-5xl leading-[1.1] text-ink sm:text-6xl lg:text-7xl"
            >
              Rozsviť své vnitřní světlo.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease }}
              className="mt-6 max-w-xs text-sm leading-relaxed text-muted"
            >
              Drahá ženo, nemusíš čekat na chvíli, kdy bude všechno hotové.
              <br />
              Dopřej si prostor pro sebe už dnes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.34, ease }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <a
                href={USCREEN.signup}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gradient-aurora px-7 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:opacity-90"
              >
                Vstoupit do online studia
              </a>
              <a
                href="#lekce"
                className="rounded-full border border-ink/50 px-7 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-ink hover:bg-ink/5"
              >
                Aktuální lekce
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
