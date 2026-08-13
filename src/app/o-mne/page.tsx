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
  IconRetreaty,
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
    ikona: <IconRetreaty size={32} />,
    radky: ["Důvěřovat tomu,", "co cítím."],
    // Stonek vychází zpod pravého dolního rohu, lístky rostou ven a nahoru.
    dekor: <List velikost={92} trida="-bottom-12 -right-11 rotate-[36deg] text-accent/30" />,
  },
];

// Můj prostor je prostor pro tebe — tři sliby v závěru.
const SLIBY: { ikona: ReactNode; radky: [string, string] }[] = [
  { ikona: <IconHeart size={24} />, radky: ["Prostor, kde nemusíš", "podávat výkon."] },
  { ikona: <IconHeart size={24} />, radky: ["Nemusíš být", "dokonalá."] },
  { ikona: <IconHeart size={24} />, radky: ["Nemusíš nic", "dokazovat."] },
];

export default function OMnePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Úvod: fotka jako pozadí celé sekce, text leží na ní ──
            Žádné dělení na sloupce. Fotka vyplňuje sekci od hrany k hraně
            a čitelnost textu drží dlouhý broskvový přechod zleva. */}
        <section className="relative overflow-hidden bg-[#FDF6F0] md:min-h-[600px]">
          {/* Počítač: fotka drží pravou polovinu sekce. Začíná pod hlavičkou,
              jinak by na ní ležel hamburger a ztratil se v tmavém lese.
              Horní, pravá i spodní hrana jsou ostré; do ztracena jde jen
              levý okraj, a to maskou — překryv by fotku zakalil. */}
          <div
            className="absolute bottom-0 right-0 top-24 hidden w-[50%] md:block"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 16%)",
              maskImage: "linear-gradient(to right, transparent 0%, #000 16%)",
            }}
          >
            <Image
              src="/anezka-o-mne.jpg"
              alt="Anežka — lektorka jógy"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-14 sm:pt-36 md:pb-28">
            <div className="md:w-[46%] md:pr-8">
              <FadeUp>
                <div className="mb-4 flex items-center gap-3">
                  <IconSparkle size={12} />
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">O mně</p>
                </div>
                <h1 className="font-allura text-4xl leading-tight text-ink sm:text-5xl">
                  {nbsp("Můj jógový příběh")}
                </h1>
              </FadeUp>

              <FadeUp delay={0.1}>
                {/* Užší míra + vyvážené zalomení, ať věta drží jako dva
                    stejně dlouhé řádky, ne jako řádek a osamocený zbytek. */}
                <p className="mt-6 max-w-[32ch] text-balance text-lg font-medium leading-snug text-accent-d">
                  {nbsp("Věřím, že každá žena si zaslouží místo, kde může na chvíli jen být.")}
                </p>
              </FadeUp>

              <FadeUp delay={0.18}>
                <div className="mt-7 flex flex-col gap-4 text-sm leading-relaxed text-muted">
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
          </div>

          {/* Telefon: fotka přes celou šířku pod textem, ostrá po všech hranách */}
          <div className="relative h-[92vw] min-h-[340px] w-full overflow-hidden md:hidden">
            <Image
              src="/anezka-o-mne.jpg"
              alt="Anežka — lektorka jógy"
              fill
              className="object-cover"
              sizes="100vw"
            />
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
          <div className="mx-auto max-w-3xl text-center">
            <FadeUp>
              <h2 className="font-allura text-3xl leading-tight text-ink sm:text-4xl">
                {nbsp("Následovala jsem svůj vnitřní hlas")}
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mt-7 flex flex-col gap-4 leading-relaxed text-muted">
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
                <List velikost={110} trida="-bottom-6 -left-14 -rotate-[32deg] text-accent/30" />
                <List velikost={116} trida="-right-14 -top-10 rotate-[34deg] text-accent/30" />

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
