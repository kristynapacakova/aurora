"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";

// Ohlasy žen, které chodí na lekce. Texty jsou přepsané z dotazníku, který
// klientka rozeslala — proto má většina na konci tři slova, kterými lekce
// shrnuly. Ta trojice se ukazuje jako první, celý text až po rozkliknutí:
// ohlasy jsou dlouhé a pět odstavců vedle sebe nikdo nečte.
type Recenze = {
  jmeno: string;
  misto: string;
  triSlova?: string[];
  // První odstavec je vidět vždycky, zbytek se rozbalí.
  uvod: string;
  dalsi: string[];
};

const RECENZE: Recenze[] = [
  {
    jmeno: "Jajda",
    misto: "Svratka",
    triSlova: ["klid", "smíření", "rovnováha"],
    uvod:
      "O lekcích jsem se dozvěděla od kamarádky, která hned po první lekci byla nadšená, a z jejího vyprávění jsem prostě musela vyzkoušet. No a byla to pravda. Jóga s Anežkou není jen o cvičení těla, ale i duše.",
    dalsi: [
      "Chodím 2 roky a i když mě někdy tělo zlobí a některé cviky nemohu dělat naplno, vždy se snažíme najít cestu a naučila jsi mě správnému cvičení.",
      "Tvoje lekce mi přinášejí hlavně klid, smíření, rovnováhu a radost, že jsem si na sebe udělala čas. Díky jógovým lekcím už nemám problémy s krční páteří, s ramenem, moje tělo je vzpřímenější. Naučila jsem se pracovat s dechem a myslí a často díky józe, meditaci a dechu dokážu rozehnat drobné bolesti na těle a strasti na duši.",
      "Před lekcí jsem často unavená z práce, mám plnou hlavu pracovních požadavků a domácích úkolů. Hned na začátku jógy se díky dechovému cvičení člověk soustředí jen na tady a teď, na své tělo a duši, a v této koncentraci vydrží až do samého konce. Po lekci jsem volná jako pták — bez starostí, s lehkou chůzí a dobrou náladou odcházím domů.",
      "Tvé lekce jógy nelze s nikým a ničím srovnávat. Je to balzám pro duši. Jsi naše Slunce.",
    ],
  },
  {
    jmeno: "Katka",
    misto: "Svratka",
    triSlova: ["vůně", "dynamika", "relax"],
    uvod:
      "Lekce jsou pro mě hlavně relax v hlavě, chvíle sama pro sebe, načerpání ženské energie, být sama se sebou tady a teď, protažení celého těla i svalů.",
    dalsi: [
      "Ale také mi přenesly kamarádku do života a nová přátelství s ženami, která jsou pro mě velkým přínosem, a za to jsem vděčná.",
      "Před lekcí jsem většinou strašně líná se vůbec dokopat a jít, ale jakmile jsem na lekci i po ní, cítím se svěže, načerpaná energií a mám klid na duši.",
      "Tvůj úsměv, aroma oleje, úvod do lekce a to, co nás čeká, tvoje jemná ženská energie, to, jak nám všechny pozice vysvětluješ a jak nás upravuješ, abychom byly dobře v každé pozici, a nakonec ten relax… To všechno dohromady dělá lekce tak výjimečnými. Vždy odcházím úplně vyrovnaná a cítím každý sval — a to je vždy známka toho, že jsem cvičila opravdu poctivě.",
      "Neváhej a zkus to. Už jen to protažení a chvíle sama pro sebe je prostě to nej, co můžeš pro sebe udělat.",
    ],
  },
  {
    jmeno: "Lucka",
    misto: "Sněžné",
    triSlova: ["klid", "uvolnění", "odreagování"],
    uvod:
      "K józe jsem se dostala před cca třemi lety, dovedla mě k ní zvědavost zkusit něco nového. Nejvíc mi přináší klid a odreagování.",
    dalsi: [
      "Na lekci často přicházím vyčerpaná, s hlavou plnou všeho možného, a odcházím příjemně uvolněná a tak nějak srovnaná.",
      "Mám ráda hlavně tu příjemnou atmosféru a to, že jóga u tebe není o tom, kdo co zvládne nebo jak dokonale cvik vypadá. Každý si jede podle svých možností a člověk se tam cítí dobře.",
      "Ženě, která váhá, bych určitě řekla, ať to prostě jednou zkusí. Nemusí být vůbec zkušená — já jsem taky nezačínala jako žádný jogín. A myslím, že právě po první lekci člověk pochopí, proč se tam chce vracet.",
    ],
  },
  {
    jmeno: "Lucka",
    misto: "Maršovice",
    triSlova: ["atmosféra", "pohyb", "uvolnění"],
    uvod:
      "Šla jsem poprvé s respektem, protože jsem už dlouho žádnou pohybovou aktivitu nedělala. Po první lekci jsem zjistila, že vlastně udělám takové cviky, na které mám.",
    dalsi: [
      "A pokud je nezvládnu provést přesně, vůbec nic se neděje. Tělo takový pohyb opravdu uvítalo.",
      "A závěrečná relaxace a ten pocit volnosti, že zrovna nic nemusím řešit — to bylo naprosto uvolňující a moc příjemné.",
    ],
  },
  {
    jmeno: "Lenka",
    misto: "Svratka",
    triSlova: ["klid", "láska", "péče"],
    uvod:
      "Zaujala mě nabídka lekce zdarma, přístup a žádný nátlak. Lekce přinášejí vyrovnanost a uvědomění okamžiku, sílu.",
    dalsi: [
      "Cítím se hezky, těším se, a pokud před lekcí je únava — po ní je energie, ale klidná.",
      "Nejraději mám Tvé povídání, relaxaci a uvědomění dechu, těla a přítomného okamžiku. Léčíš tělo, pohybové problémy, uvědomění postavení těla.",
      "Řekla bych: pokud hledáš sebe, klid a chceš najít samu sebe, jsi tu správně a navíc děláš něco opravdu pro sebe.",
    ],
  },
];

export default function Recenze() {
  const [otevrena, setOtevrena] = useState<number | null>(null);

  return (
    <section id="ohlasy" className="relative bg-sand/50 pt-14 pb-16 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <FadeUp>
          <div className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Ohlasy</p>
              <IconSparkle size={12} />
            </div>
            <h2 className="font-allura text-4xl text-ink sm:text-5xl">
              {nbsp("Slova žen, které už chodí")}
            </h2>
          </div>
        </FadeUp>

        <div className="grid items-start gap-5 md:grid-cols-2">
          {RECENZE.map((r, i) => {
            const jeOtevrena = otevrena === i;
            return (
              <FadeUp key={`${r.jmeno}-${r.misto}`} delay={Math.min(i, 3) * 0.06}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 sm:p-7">
                  {r.triSlova && (
                    <p className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.18em] text-accent">
                      {r.triSlova.map((slovo, j) => (
                        <span key={slovo}>
                          {slovo}
                          {j < r.triSlova!.length - 1 && (
                            <span className="ml-2 text-line" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </span>
                      ))}
                    </p>
                  )}

                  <p className="text-sm leading-relaxed text-ink">{nbsp(r.uvod)}</p>

                  <AnimatePresence initial={false}>
                    {jeOtevrena && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 pt-3">
                          {r.dalsi.map((odst, j) => (
                            <p key={j} className="text-sm leading-relaxed text-muted">
                              {nbsp(odst)}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {r.dalsi.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setOtevrena(jeOtevrena ? null : i)}
                      className="mt-3 w-fit text-xs uppercase tracking-[0.15em] text-accent-d transition-colors hover:text-ink"
                    >
                      {jeOtevrena ? "Skrýt" : "Číst celé"}
                    </button>
                  )}

                  <div className="mt-5 flex items-baseline gap-3 border-t border-line pt-4">
                    <p className="font-serif text-lg text-ink">{r.jmeno}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{r.misto}</p>
                  </div>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
