import type { Metadata } from "next";
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

// Vzdušná průsvitná karta — používá se v obou pásech, ať drží jeden rukopis.
const KARTA =
  "h-full rounded-[28px] bg-white/40 px-6 ring-1 ring-white/60 backdrop-blur-[2px] shadow-[0_2px_24px_rgba(140,95,71,0.05)]";

// Co mi jóga dala. Texty jsou zalomené natvrdo na dva řádky — jsou krátké
// a pevné, takže je hezčí určit zlom ručně než ho nechat na šířce okna.
// Velikosti ikon se liší záměrně: každá má jiný poměr stran (větev je na
// výšku), takže stejné číslo by dalo opticky různě velké obrázky.
const DARY: { icon: React.ReactNode; radky: [string, string] }[] = [
  { icon: <IconHeart size={26} />, radky: ["Naučila mě", "zastavit se."] },
  { icon: <IconLeafBranch size={34} />, radky: ["Naslouchat", "sama sobě."] },
  { icon: <IconSun size={30} className="text-accent" />, radky: ["Vnímat", "své tělo."] },
  { icon: <IconRetreaty size={32} />, radky: ["Důvěřovat tomu,", "co cítím."] },
];

// Můj prostor je prostor pro tebe — tři sliby v závěru.
const SLIBY: [string, string][] = [
  ["Prostor, kde nemusíš", "podávat výkon."],
  ["Nemusíš být", "dokonalá."],
  ["Nemusíš nic", "dokazovat."],
];

export default function OMnePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Úvod: text + portrét ──
            Stejný princip jako video v hero sekci: fotka drží pravou stranu,
            přes celou šířku leží vodorovný přechod, který je pod textem plně
            krémový — tam fotka prosvítat nemá. */}
        <section className="relative overflow-hidden md:min-h-[680px]">
          {/* Počítač: fotka na pravé straně, začíná pod hlavičkou, ať
              hamburger zůstane na krémovém podkladu. */}
          <div className="absolute bottom-0 right-0 top-24 hidden w-[62%] md:block">
            <Image
              src="/anezka-o-mne.jpg"
              alt="Anežka — lektorka jógy"
              fill
              className="object-cover"
              sizes="62vw"
              priority
            />
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 top-24 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, #FCF4F1 0%, #FCF4F1 50%, rgba(252,244,241,0.72) 60%, rgba(252,244,241,0.24) 71%, transparent 82%)",
            }}
          />

          {/* Prolnutí spodní hrany do další sekce — jako v hero sekci,
              ať fotka nekončí ostrým řezem. */}
          <div
            className="absolute inset-x-0 bottom-0 hidden h-32 md:block"
            style={{
              background:
                "linear-gradient(to top, #FCF4F1 0%, rgba(252,244,241,0.85) 20%, rgba(252,244,241,0.55) 42%, rgba(252,244,241,0.28) 65%, rgba(252,244,241,0.08) 85%, transparent 100%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-14 sm:pt-36 md:pb-28">
            <div className="md:w-[46%] md:pr-6">
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

          {/* Telefon: fotka přes celou šířku pod textem, nahoře se ztrácí */}
          <div className="relative h-[92vw] min-h-[340px] w-full overflow-hidden md:hidden">
            <Image
              src="/anezka-o-mne.jpg"
              alt="Anežka — lektorka jógy"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent" />
          </div>
        </section>

        {/* ── Co mi jóga dala ── */}
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="text-center text-xs uppercase tracking-[0.3em] text-accent">
                Co mi jóga dala
              </p>
            </FadeUp>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DARY.map((dar, i) => (
                <FadeUp key={dar.radky.join(" ")} delay={0.06 * i}>
                  <div className={`${KARTA} flex flex-col items-center gap-4 py-10 text-center`}>
                    <span className="flex h-9 items-center justify-center">{dar.icon}</span>
                    <p className="text-sm leading-relaxed text-ink">
                      {nbsp(dar.radky[0])}
                      <br />
                      {nbsp(dar.radky[1])}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Následovala jsem svůj vnitřní hlas ── */}
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <FadeUp>
              <h2 className="font-allura text-3xl leading-tight text-ink sm:text-4xl">
                {nbsp("Následovala jsem svůj vnitřní hlas")}
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="mt-7 flex flex-col gap-4 text-sm leading-relaxed text-muted">
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
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <p className="text-center text-xs uppercase tracking-[0.3em] text-accent">
                Můj prostor je prostor pro tebe
              </p>
            </FadeUp>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {SLIBY.map((slib, i) => (
                <FadeUp key={slib.join(" ")} delay={0.06 * i}>
                  <div className={`${KARTA} flex items-start gap-3.5 py-8`}>
                    <IconHeart size={18} className="mt-0.5 shrink-0 text-accent" />
                    <p className="text-sm leading-relaxed text-ink">
                      {nbsp(slib[0])}
                      <br />
                      {nbsp(slib[1])}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Závěr ── */}
        <section className="px-6 pb-24 pt-8 sm:pb-28">
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
