"use client";

import { useState, type ReactNode } from "react";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle, IconLeafBranch } from "./BrandIcons";

// Ohlasy žen, které chodí na lekce. Texty jsou doslovné přepisy grafik, které
// klientka dostala zpátky z dotazníku — nekrátí se ani tam, kde se něco
// opakuje, protože to jsou jejich vlastní slova. Zvýrazněné věty jsou ty samé
// jako v originálech; označují se hvězdičkami: *takhle*.
//
// Ohlasy se listují po jednom. Vedle sebe by nešly: každý je jinak dlouhý
// a mřížka s kartami od dvou do deseti odstavců působí rozsypaně. Takhle má
// každý ohlas stejnou šířku i střed, jako jednotlivé grafiky.
type Recenze = {
  jmeno: string;
  misto: string;
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
  const [aktivni, setAktivni] = useState(0);
  const r = RECENZE[aktivni];

  const posun = (o: number) =>
    setAktivni((i) => (i + o + RECENZE.length) % RECENZE.length);

  return (
    <section id="ohlasy" className="relative overflow-hidden bg-cream pt-14 pb-16 sm:pt-16 sm:pb-20">
      {/* Jedna větvička u okraje — stejně decentně jako u rezervace. */}
      <IconLeafBranch
        size={200}
        className="pointer-events-none absolute -left-14 top-10 hidden text-accent/10 lg:block"
      />

      <div className="relative mx-auto max-w-3xl px-6">
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

        <FadeUp delay={0.1}>
          <article className="rounded-[28px] bg-sand/60 px-6 py-10 sm:px-12 sm:py-12">
            {/* Kroužek s uvozovkou — stejný motiv jako ikonky v rozvrhu. */}
            <div className="mx-auto mb-7 flex h-11 w-11 items-center justify-center rounded-full bg-cream">
              <span className="font-serif text-2xl leading-none text-accent" aria-hidden="true">
                &ldquo;
              </span>
            </div>

            {/* Text doleva — na celé ohlasy se to čte líp než na střed. */}
            <div className="mx-auto flex max-w-xl flex-col gap-4">
              {r.odstavce.map((odst, j) => (
                <p key={j} className="text-sm leading-relaxed text-muted sm:text-[15px]">
                  {zvyrazni(odst)}
                </p>
              ))}
              {r.odrazky && (
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-accent sm:text-[15px]">
                  {r.odrazky.map((o, j) => (
                    <li key={j}>{zvyrazni(o)}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mx-auto mt-9 max-w-xl border-t border-line pt-6 text-center">
              {r.triSlova && (
                <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-accent">
                  {r.triSlova.join(" · ")}
                </p>
              )}
              <p className="font-serif text-2xl leading-tight text-ink">{r.jmeno}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-muted">
                {r.misto}
              </p>
            </div>
          </article>

          {/* Listování */}
          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => posun(-1)}
              aria-label="Předchozí ohlas"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2.5">
              {RECENZE.map((polozka, i) => (
                <button
                  key={`${polozka.jmeno}-${polozka.misto}`}
                  type="button"
                  onClick={() => setAktivni(i)}
                  aria-label={`Ohlas ${i + 1} z ${RECENZE.length} — ${polozka.jmeno}`}
                  aria-current={i === aktivni}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === aktivni ? "w-6 bg-accent" : "w-1.5 bg-line hover:bg-accent/50"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => posun(1)}
              aria-label="Další ohlas"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
