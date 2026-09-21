"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle, IconLeafBranch } from "./BrandIcons";

// Ohlasy žen, které chodí na lekce. Texty jsou doslovné přepisy grafik, které
// klientka dostala zpátky z dotazníku — nezkracují se ani tam, kde se něco
// opakuje, protože to jsou jejich vlastní slova. Zvýrazněné věty jsou ty samé
// jako v originálech; označují se hvězdičkami: *takhle*.
type Recenze = {
  jmeno: string;
  misto: string;
  // První odstavec je vidět vždycky, zbytek se rozbalí.
  odstavce: string[];
  odrazky?: string[];
  // Závěrečná trojice slov z dotazníku („Vůně, dynamika, relax").
  triSlova?: string[];
};

// Rozdělí text podle hvězdiček a vybarví, co je mezi nimi. Stejné zvýraznění
// vět jako v původních grafikách — nese to celý tón ohlasu.
function zvyrazni(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((cast, i) =>
    cast.startsWith("*") && cast.endsWith("*") && cast.length > 2 ? (
      <span key={i} className="text-accent-d">
        {nbsp(cast.slice(1, -1))}
      </span>
    ) : (
      <span key={i}>{nbsp(cast)}</span>
    )
  );
}

const RECENZE: Recenze[] = [
  {
    jmeno: "Jajda",
    misto: "Svratka",
    odstavce: [
      "O lekcích jsem se dozvěděla od kamarádky, která hned po první lekci byla nadšená, a z jejího vyprávění jsem prostě musela vyzkoušet. No a byla to pravda. Jóga s Anežkou *není jen o cvičení těla, ale i duše.* Chodím 2 roky a i když mě někdy tělo zlobí a některé cviky nemohu dělat naplno, vždy se snažíme najít cestu a naučila jsi mě správnému cvičení.",
      "Tvoje lekce mi přinášejí hlavně *klid, smíření, rovnováhu a radost,* že jsem si na sebe udělala čas. Díky jógovým lekcím už nemám problémy s krční páteří, s ramenem, moje tělo je vzpřímenější. Naučila jsem se pracovat s dechem a myslí a často díky józe, meditaci a dechu dokážu rozehnat drobné bolesti na těle a strasti na duši. A to vše díky tobě, protože tomu dáváš *své srdce* a naučila jsi mě to. Děkuji z celého srdce za tvé lekce jógy.",
      "Před lekcí jsem často unavená z práce, mám plnou hlavu pracovních požadavků a domácích úkolů. Člověk vlastně celý den přemýšlí a furt něco někde. Hned na začátku jógy díky dechovému cvičení se člověk soustředí jen na tady a teď, na své tělo a duši a v této koncentraci vydrží až do samého konce. Po lekci jsem volná jako pták – bez starostí, s lehkou chůzí a dobrou náladou odcházím domů. Přemítám si v hlavě, co mi můj vesmír poradil a jsem vděčná, že mohu a že jsem tady a teď.",
      "*Tvé lekce jógy nelze s nikým a ničím srovnávat. Je to balzám pro duši. Jsi naše Slunce.* ❤️",
    ],
  },
  {
    jmeno: "Katka",
    misto: "Svratka",
    odstavce: [
      "O józe jsem se dozvěděla z *informačního letáku ve Svratce na úřadě před 4 roky.*",
      "Lekce jsou pro mě hlavně *relax v hlavě, chvíle sama pro sebe, načerpání ženské energie,* být sama se sebou tady a teď, protažení celého těla i svalů. Ale také mi přenesly kamarádku do života a *nová přátelství s ženami,* která jsou pro mě velkým přínosem, a za to jsem vděčná.",
      "Před lekcí jsem většinou strašně líná se vůbec dokopat a jít, ale jakmile jsem na lekci i po ní, *cítím se svěže, načerpaná energií a mám klid na duši.*",
      "Když tě vidím a když si s tebou můžu popovídat – jen tak o životě nebo o čemkoliv, aroma oleje, tvůj úsměv, úvod do lekce a to, co nás čeká, *tvoji jemnou ženskou energii,* to, jak nám všechny pozice vysvětluješ během lekce a jak nás upravuješ, abychom byly dobře v každé pozici, a nakonec ten relax… To všechno dohromady dělá lekce tak výjimečnými. *Vždy odcházím úplně vyrovnaná* a někdy tak pěkně zmoždovaná a cítím každý sval. A to je vždy známka toho, že jsem cvičila opravdu poctivě a z toho mám dobrý pocit, že jsem *pro své tělo udělala něco přínosného.*",
      "*Neváhej a zkus to,* už jen to protažení a chvíle sama pro sebe je prostě to nej, co můžeš pro sebe udělat.",
    ],
    triSlova: ["Vůně", "dynamika", "relax"],
  },
  {
    jmeno: "Lucka",
    misto: "Sněžné",
    odstavce: [
      "K józe jsem se dostala před cca třemi lety. Dovedla mě k ní zvědavost zkusit něco nového.",
      "Nejvíc mi přináší *klid a odreagování.* Na lekci často přicházím vyčerpaná, s hlavou plnou všeho možného, a odcházím *příjemně uvolněná a tak nějak srovnaná.* 😊",
      "Před lekcí bývám často unavená nebo mám hlavu plnou všeho možného, ale odcházím vždycky taková *klidnější, uvolněnější a s mnohem lepší náladou.* 🥰",
      "Mám ráda hlavně tu *příjemnou atmosféru* a to, že jóga u tebe není o tom, kdo co zvládne nebo jak dokonale cvik vypadá. Každý si jede podle svých možností a *člověk se tam cítí dobře.*",
      "Ženě, která váhá, bych určitě řekla, *ať to prostě jednou zkusí.* 😊 Nemusí být vůbec zkušená. Já jsem taky nezačínala jako žádný jogín 😄. A myslím, že právě po první lekci člověk pochopí, proč se tam chce vracet.",
    ],
    triSlova: ["Klid", "uvolnění", "odreagování"],
  },
  {
    jmeno: "Lenka",
    misto: "Svratka",
    odstavce: [
      "Zaujala mě nabídka lekce zdarma, přístup a žádný nátlak. Lekce přinášejí *vyrovnanost a uvědomění* okamžiku, sílu.",
      "Cítím se hezky, těším se a pokud před lekcí je únava – *po ní je energie, ale klidná…*",
      "Nejraději mám *Tvé povídání, relaxaci a uvědomění* dechu, těla a přítomného okamžiku.",
      "Řekla bych, pokud *hledáš sebe, klid a chceš najít samu sebe.* Jsi tu správně a navíc *děláš něco opravdu pro sebe.*",
      "*Klid, láska, péče* – když doplníš lekci slovy *k nám jako k ženě* … jelikož si myslím, že potřebujeme stále nakopávat správným slovem ❤️💛",
    ],
    odrazky: [
      "léčíš tělo, pohybové problémy, uvědomění postavení těla – střed a zpevnění",
      "důležité pro naše dny, které jsou bez Tebe",
    ],
  },
  {
    jmeno: "Lucka",
    misto: "Maršovice",
    odstavce: [
      "S jógou jsem se seznámila díky mé sestře, která na ni už chvíli chodila. Šla jsem poprvé s respektem, protože jsem už dlouho žádnou pohybovou aktivitu nedělala a nebyl bohužel čas.",
      "Po první lekci jsem zjistila, že vlastně udělám takové cviky, na které mám. A pokud je nezvládnu provést přesně, *vůbec nic se neděje.* Tělo takový pohyb opravdu uvítalo. A závěrečná relaxace a ten *pocit volnosti, že zrovna nic nemusím řešit,* to bylo naprosto uvolňující a moc příjemné…",
    ],
    triSlova: ["atmosféra", "pohyb", "uvolnění"],
  },
];

export default function Recenze() {
  const [otevrena, setOtevrena] = useState<number | null>(null);

  return (
    <section
      id="ohlasy"
      className="relative overflow-hidden bg-gradient-to-b from-sand via-[#FDEEE6] to-cream pt-16 pb-20 sm:pt-20 sm:pb-24"
    >
      {/* Botanika v rozích — stejný motiv jako na grafikách od klientky */}
      <IconLeafBranch
        size={190}
        className="pointer-events-none absolute -left-10 -top-6 hidden text-accent/15 sm:block"
      />
      <IconLeafBranch
        size={190}
        className="pointer-events-none absolute -right-10 bottom-4 hidden -scale-x-100 text-accent/15 sm:block"
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <FadeUp>
          <div className="mb-12 text-center">
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

        <div className="grid items-start gap-6 md:grid-cols-2">
          {RECENZE.map((r, i) => {
            const jeOtevrena = otevrena === i;
            const zbytek = r.odstavce.slice(1);
            const maPokracovani = zbytek.length > 0 || Boolean(r.odrazky);
            return (
              <FadeUp key={`${r.jmeno}-${r.misto}`} delay={Math.min(i, 3) * 0.06}>
                {/* Dvojitý rám jako na grafikách: broskvová deska a v ní
                    světlý panel s tenkou linkou. */}
                <article className="rounded-[30px] bg-gradient-to-b from-[#FBE3D5] to-[#F9D9CA] p-2.5 shadow-[0_18px_40px_-28px_rgba(140,95,71,0.55)]">
                  <div className="rounded-[22px] bg-cream/85 px-6 py-8 text-center ring-1 ring-accent/20 sm:px-8">
                    <p
                      className="mb-1 font-serif text-5xl leading-none text-accent/60"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </p>

                    <p className="text-sm leading-relaxed text-ink">
                      {zvyrazni(r.odstavce[0])}
                    </p>

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
                            {zbytek.map((odst, j) => (
                              <p key={j} className="text-sm leading-relaxed text-ink">
                                {zvyrazni(odst)}
                              </p>
                            ))}
                            {r.odrazky && (
                              <ul className="mx-auto flex max-w-sm list-disc flex-col gap-1 pl-5 text-left text-sm leading-relaxed text-ink marker:text-accent">
                                {r.odrazky.map((o, j) => (
                                  <li key={j}>{zvyrazni(o)}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Trojice slov uzavírá ohlas stejně jako na grafikách —
                        proto sedí hned pod textem, ne až za tlačítkem. */}
                    {r.triSlova && (
                      <p className="mt-5 text-sm text-accent-d">
                        {r.triSlova.join(", ")}
                        <span className="ml-1.5 text-accent" aria-hidden="true">
                          ♥
                        </span>
                      </p>
                    )}

                    {maPokracovani && (
                      <button
                        type="button"
                        onClick={() => setOtevrena(jeOtevrena ? null : i)}
                        className="mt-5 text-xs uppercase tracking-[0.18em] text-accent-d transition-colors hover:text-ink"
                      >
                        {jeOtevrena ? "Skrýt" : "Číst celé"}
                      </button>
                    )}

                    {/* Dělicí linka s větvičkou — stejný předěl nad jménem
                        jako na grafikách. */}
                    <div className="mt-6 flex items-center justify-center gap-3" aria-hidden="true">
                      <span className="h-px w-12 bg-line" />
                      <IconLeafBranch size={20} className="text-accent/70" />
                      <span className="h-px w-12 bg-line" />
                    </div>

                    <p className="mt-4 font-serif text-2xl leading-tight text-ink">{r.jmeno}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-muted">
                      {r.misto}
                    </p>
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
