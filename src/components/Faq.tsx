"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";

const FAQ_ITEMS = [
  {
    otazka: "Jak funguje online studio?",
    odpoved:
      "Po zaplacení členství získáš přístup ke knihovně nahraných lekcí i k živým streamům. Cvičíš odkudkoliv a kdykoliv ti to vyhovuje — stačí telefon, tablet nebo počítač.",
  },
  {
    otazka: "Mohu členství kdykoliv zrušit?",
    odpoved:
      "Ano, členství je bez závazků a můžeš ho kdykoliv zrušit přímo ve svém účtu. Žádné skryté poplatky ani dlouhodobé smlouvy.",
  },
  {
    otazka: "Jsem úplná začátečnice, zvládnu to?",
    odpoved:
      "Určitě. Lekce jsou stavěné tak, aby v nich našla něco pro sebe jak úplná začátečnice, tak zkušenější cvičenka. Nikdy nemusíš nic dokazovat ani zvládat dokonale.",
  },
  {
    otazka: "Co si mám na lekci připravit?",
    odpoved:
      "Stačí podložka, pohodlné oblečení a trocha volného místa kolem sebe. Nic dalšího není potřeba — pomůcky jako bloky nebo pásek jsou vítané, ale nepovinné.",
  },
  {
    otazka: "Jak probíhají pobyty pro ženy?",
    odpoved:
      "Pobyty se konají na klidných místech v přírodě a kombinují jógu, dech, odpočinek i společný čas. Přesný program a termíny najdeš na stránce Pobyty pro ženy.",
  },
  {
    otazka: "Jak funguje platba za pobyt?",
    odpoved:
      "Po odeslání objednávky ti přijdou platební údaje i QR kód pro rychlou platbu. Jakmile platbu potvrdíš, je tvoje místo na pobytu závazně rezervované.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-cream relative pt-14 pb-16 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <FadeUp>
          <div className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Časté otázky</p>
              <IconSparkle size={12} />
            </div>
            <h2 className="font-allura text-4xl text-ink sm:text-5xl">
              {nbsp("Odpovědi na to, co tě zajímá")}
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.otazka}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-serif text-lg text-ink">{nbsp(item.otazka)}</span>
                    <span
                      className={`shrink-0 text-xl text-accent transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                          {nbsp(item.odpoved)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
