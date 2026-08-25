import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { nbsp } from "@/lib/typo";
import {
  IconSparkle,
  IconHeart,
  IconSun,
  IconLeafBranch,
} from "@/components/BrandIcons";

export const metadata: Metadata = {
  title: "O mně | AURORA jóga",
  description:
    "Můj jógový příběh — jak jsem se k józe dostala, co mi dala a proč vytvářím prostor, kde nemusíš nic dokazovat.",
};

/** Sušený lístek rozesetý kolem karet. Leží pod kartou, ne v ní — proto se
 *  vykresluje před dlaždicí a smí přesahovat přes její okraj. */
function List({ velikost, trida }: { velikost: number; trida: string }) {
  return (
    <IconLeafBranch size={velikost} className={`pointer-events-none absolute ${trida}`} />
  );
}

/** Drobná tečka — používá se tam, kde by celý lístek byl už moc. */
function Tecka({ velikost, trida }: { velikost: number; trida: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${trida}`}
      style={{ width: velikost, height: velikost }}
    />
  );
}

/** Dlaždice s ikonou a patkovým textem.
 *  Dekorace se předává zvenčí a leží pod dlaždicí, aby rozmístění mohlo být
 *  u každé karty jiné — souměrné lístky ve všech rozích působí tiskařsky. */
function Karta({
  ikona,
  radky,
  dekor,
}: {
  ikona: ReactNode;
  radky: [string, string];
  dekor?: ReactNode;
}) {
  return (
    <div className="relative h-full">
      {dekor}
      <div className="relative flex h-full flex-col items-center rounded-[20px] bg-sand/75 px-6 py-9 text-center shadow-[0_2px_12px_rgba(140,95,71,0.045)] ring-1 ring-white/60">
        <span className="flex h-9 items-center justify-center">{ikona}</span>
        <p className="mt-4 font-serif text-xl leading-snug text-ink">
          {nbsp(radky[0])}
          <br />
          {nbsp(radky[1])}
        </p>
      </div>
    </div>
  );
}

/** Ikona z SVG souboru od klientky. Soubor je černý a slouží jako maska —
 *  barvu tak určuje CSS a ikona sedí do palety webu. Rozměry se zadávají
 *  po dvojicích, protože kresby mají hodně rozdílné poměry stran a stejné
 *  číslo by dalo opticky různě velké ikony. */
function IkonaSoubor({
  soubor,
  sirka,
  vyska,
}: {
  soubor: string;
  sirka: number;
  vyska: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="block shrink-0 bg-accent"
      style={{
        width: sirka,
        height: vyska,
        WebkitMaskImage: `url(/icons/${soubor})`,
        maskImage: `url(/icons/${soubor})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

/** Růžový prostrkaný popisek sekce. */
function Popisek({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <IconSparkle size={11} />
      <p className="text-center text-xs uppercase tracking-[0.3em] text-accent">{children}</p>
      <IconSparkle size={11} />
    </div>
  );
}

// Co mi jóga dala. Texty jsou zalomené natvrdo na dva řádky — jsou krátké
// a pevné, takže je hezčí určit zlom ručně než ho nechat na šířce okna.
// Velikosti ikon se liší záměrně: každá má jiný poměr stran (větev je na
// výšku), takže stejné číslo by dalo opticky různě velké obrázky.
// Dekorace je u každé karty jiná: první nese velký list výrazně přes roh,
// zbylé jen drobnost v jednom rohu — někde lístek, někde tečky, jinde nic.
const DARY: { ikona: ReactNode; radky: [string, string]; dekor?: ReactNode }[] = [
  {
    ikona: <IconHeart size={26} />,
    radky: ["Naučila mě", "zastavit se."],
    // Větší úhel — stonek leží do boku, ne vzhůru.
    dekor: <List velikost={138} trida="-left-16 -top-4 -rotate-[64deg] text-accent/30" />,
  },
  // Záměrně bez dekorace — pravidelnost je to, co působí tiskařsky.
  {
    ikona: <IconLeafBranch size={34} />,
    radky: ["Naslouchat", "sama sobě."],
  },
  {
    ikona: <IconSun size={30} className="text-accent" />,
    radky: ["Vnímat", "své tělo."],
    dekor: (
      <>
        <Tecka velikost={7} trida="-top-3 left-12 bg-accent/35" />
        <Tecka velikost={4} trida="-top-6 left-[5.5rem] bg-accent/25" />
      </>
    ),
  },
  {
    ikona: <IkonaSoubor soubor="ikona-citim.svg" sirka={58} vyska={34} />,
    radky: ["Důvěřovat tomu,", "co cítím."],
    // Stonek vychází zpod pravého dolního rohu, lístky rostou ven a nahoru.
    dekor: <List velikost={92} trida="-bottom-12 -right-11 rotate-[36deg] text-accent/30" />,
  },
];

// Můj prostor je prostor pro tebe — tři sliby v závěru.
const SLIBY: { ikona: ReactNode; radky: [string, string] }[] = [
  {
    ikona: <IkonaSoubor soubor="ikona-prostor.svg" sirka={30} vyska={68} />,
    radky: ["Prostor, kde nemusíš", "podávat výkon."],
  },
  {
    ikona: <IkonaSoubor soubor="ikona-dokonala.svg" sirka={78} vyska={39} />,
    radky: ["Nemusíš být", "dokonalá."],
  },
  {
    ikona: <IkonaSoubor soubor="ikona-dokazovat.svg" sirka={84} vyska={62} />,
    radky: ["Nemusíš nic", "dokazovat."],
  },
];

export default function OMnePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Úvod: text vlevo, fotka v oblouku vpravo ──
            Fotka už neleží pod textem jako pozadí. Stojí vedle něj jako
            samostatný objekt v oblouku — stejný tvar má i úvodní fotka na
            domovské stránce, takže to drží jednu vizuální rodinu. Text tak
            neleží na fotce a nepotřebuje žádné prolnutí do pozadí. */}
        {/* overflow-hidden je tu kvůli lístkům u fotky — smějí přesahovat přes
            okraj sloupce, ale nesmí vytáhnout vodorovné posouvání stránky. */}
        <section className="relative overflow-hidden px-6">
          {/* Stejný obal jako zbytek stránky (px-6 na sekci, max-w-5xl uvnitř),
              takže levá hrana textu i pravá hrana oblouku stojí přesně nad
              kartami v sekci níž. */}
          <div className="mx-auto max-w-5xl pt-32 pb-14 sm:pt-36 md:pb-12">
            {/* Výšku řádku určuje text; oblouk se do ní vejde přesně (viz
                níže), takže obě strany začínají i končí na stejné lince. */}
            {/* Stejné dělení sloupců i mezera jako u sekce „Následovala jsem
                svůj vnitřní hlas" níž, takže pravý sloupec je na obou místech
                stejně široký a obě fotky stojí na jedné svislé ose. */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
              {/* Dokud jsou sloupce pod sebou, drží text rozumnou délku řádku —
                  na tabletu by přes celou šířku sekce byl špatně čitelný. */}
              <div className="max-w-2xl lg:max-w-none">
                <FadeUp>
                  <div className="mb-4 flex items-center gap-3">
                    <IconSparkle size={12} />
                    <p className="text-xs uppercase tracking-[0.3em] text-accent">O mně</p>
                  </div>
                  <h1 className="font-allura text-4xl leading-tight text-ink sm:text-5xl">
                    {nbsp("Můj jógový příběh")}
                  </h1>
                  {/* Hlavní myšlenka ve stylu popisků sekcí — prostrkané
                      verzálky v korálové. Řádkování je vyšší, verzálky se
                      přes dva řádky jinak lepí na sebe. */}
                  <p className="mt-5 text-[11px] uppercase leading-[2] tracking-[0.14em] text-accent sm:text-xs lg:tracking-[0.3em]">
                    {nbsp("Věřím, že každá žena si zaslouží místo,")}
                    <br />
                    {nbsp("kde může na chvíli jen být.")}
                  </p>
                </FadeUp>

                <FadeUp delay={0.18}>
                  {/* Bloková sazba bez dělení slov — dlouhé slovo se radši
                      přesune celé na další řádek. Krátké předložky drží
                      u následujícího slova přes nbsp() z lib/typo. */}
                  <div className="mt-8 flex flex-col gap-4 text-justify text-sm leading-relaxed text-muted">
                    <p>
                      {nbsp("To, že teď nevidíš nebo neznáš svoji cestu, ještě neznamená, že neexistuje.")}
                    </p>
                    <p>
                      {nbsp("Ani já bych si před pěti lety nepomyslela, že jednou budu provázet ženy jógou.")}
                    </p>
                    <p>
                      {nbsp("K józe jsem se nedostala přes studia ani ")}
                      <strong className="font-medium text-ink">{nbsp("skupinové lekce")}</strong>
                      {nbsp(". Začínala jsem sama doma, ")}
                      <strong className="font-medium text-ink">
                        {nbsp("prostřednictvím online lekcí")}
                      </strong>
                      {nbsp(". Hledala jsem způsob, jak se cítit lépe ve svém těle, uvolnit napětí a dopřát si chvíli jen pro sebe.")}
                    </p>
                  </div>
                </FadeUp>

              </div>

              {/* Fotka i s obloukem přijde hotová od klientky — je to průhledné
                  PNG, kde je oblouk namalovaný za postavou. Proto tu není žádný
                  rámeček, ořezávání ani barva pozadí; obrázek se jen položí na
                  krémové pozadí stránky (object-contain, aby se nic nezkreslilo).
                  Na počítači leží obsah buňky absolutně (lg:absolute inset-0).
                  Díky tomu do výšky řádku sám nemluví — tu určí jen text — a
                  fotka se do ní vejde na výšku přesně. Šířku si dopočítá
                  z poměru stran. Na telefonu je to obyčejný blok pod textem. */}
              <FadeUp delay={0.1} className="lg:h-full">
                <div className="relative lg:h-full">
                  <div className="lg:absolute lg:inset-0 lg:flex lg:justify-center">
                    <div className="relative mx-auto aspect-[1000/1385] w-full max-w-[15rem] sm:max-w-xs lg:mx-0 lg:h-full lg:w-auto lg:max-w-none">
                      <Image
                        src="/anezka-oblouk.webp"
                        alt="Anežka se srolovanou podložkou"
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 70vw, 22rem"
                        fetchPriority="high"
                      />
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Co mi jóga dala ── */}
        <section className="overflow-hidden px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <Popisek>Co mi jóga dala</Popisek>
            </FadeUp>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DARY.map((dar, i) => (
                <FadeUp key={dar.radky.join(" ")} delay={0.06 * i}>
                  <Karta ikona={dar.ikona} radky={dar.radky} dekor={dar.dekor} />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Následovala jsem svůj vnitřní hlas ──
            Záměrně jen text na krémovém podkladu, žádná fotka na pozadí. */}
        <section className="px-6 py-12 sm:py-16">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-10 md:grid-cols-[1.45fr_1fr] md:gap-14">
            <div>
              <FadeUp>
                <h2 className="font-allura text-3xl leading-tight text-ink sm:text-4xl">
                  {nbsp("Následovala jsem svůj vnitřní hlas")}
                </h2>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="mt-7 flex flex-col gap-4 text-justify text-sm leading-relaxed text-muted sm:text-base">
                  <p>
                    {nbsp("Přestože si tehdy mnoho lidí kolem mě myslelo, že je bláznivé chtít se stát lektorkou jógy, něco uvnitř mě vedlo dál.")}
                  </p>
                  <p>
                    {nbsp("Nevěděla jsem, kam mě tato cesta zavede. Jen jsem cítila, že ji chci následovat.")}
                  </p>
                  <p>
                    {nbsp("Dnes provázím ženy na skupinových lekcích, v online studiu i na ženských pobytech. A s pokorou sleduji, jak si každá žena nachází svou vlastní cestu zpět k sobě.")}
                  </p>
                </div>
              </FadeUp>
            </div>

            {/* Fotka nese organický tvar rovnou v souboru a okolo něj je
                průhledno, takže na krémovém podkladu nepotřebuje žádný rám.
                Vysoká je jako textový sloupec vedle ní. */}
            <FadeUp delay={0.12} className="md:h-full">
              <div className="relative mx-auto h-[280px] w-full max-w-[360px] md:h-full md:min-h-[300px] md:max-w-none">
                <Image
                  src="/anezka-les-tvar.webp"
                  alt="Anežka při józe v lese"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 360px, 400px"
                />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Můj prostor je prostor pro tebe ── */}
        <section className="overflow-hidden px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <Popisek>Můj prostor je prostor pro tebe</Popisek>
            </FadeUp>

            {/* Bez rámečků — jen ikony ve třech sloupcích, které dělí
                jemná svislá linka. Na telefonu se linka otočí naležato. */}
            <FadeUp delay={0.08}>
              <div className="relative mt-10">
                <div className="relative grid grid-cols-1 divide-y divide-line/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {SLIBY.map((slib) => (
                    <div
                      key={slib.radky.join(" ")}
                      className="flex items-center justify-center gap-4 px-6 py-7"
                    >
                      <span className="shrink-0">{slib.ikona}</span>
                      <p className="font-serif text-xl leading-snug text-ink">
                        {nbsp(slib.radky[0])}
                        <br />
                        {nbsp(slib.radky[1])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Závěr ── */}
        <section className="px-6 pb-24 pt-6 sm:pb-28">
          <FadeUp>
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
              <p className="font-allura text-3xl leading-tight text-ink sm:text-4xl">
                {nbsp("Stačí přijít taková, jaká právě jsi.")}
              </p>
              <IconHeart size={20} className="text-accent" />
            </div>
          </FadeUp>
        </section>
      </main>

      <Footer />
    </>
  );
}
