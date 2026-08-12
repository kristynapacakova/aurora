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
  IconWave,
} from "@/components/BrandIcons";

export const metadata: Metadata = {
  title: "O mně | AURORA jóga",
  description:
    "Můj jógový příběh — jak jsem se k józe dostala, co mi dala a proč vytvářím prostor, kde nemusíš nic dokazovat.",
};

// Co mi jóga dala — čtyři karty pod úvodem. Velikosti se liší záměrně:
// každá ikona má jiný poměr stran (větev je na výšku), takže stejné číslo
// by dalo různě velké obrázky. Takhle mají stejnou optickou váhu.
const DARY = [
  { icon: <IconHeart size={26} />, text: "Naučila mě zastavit se." },
  { icon: <IconLeafBranch size={34} />, text: "Naslouchat sama sobě." },
  { icon: <IconSun size={30} className="text-accent" />, text: "Vnímat své tělo." },
  { icon: <IconRetreaty size={32} />, text: "Důvěřovat tomu, co cítím." },
];

// Můj prostor je prostor pro tebe — tři sliby v závěru.
const SLIBY = [
  "Prostor, kde nemusíš podávat výkon.",
  "Nemusíš být dokonalá.",
  "Nemusíš nic dokazovat.",
];

export default function OMnePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Úvod: text + portrét ──
            Fotka vyplňuje celou pravou stranu a směrem k textu se ztrácí
            do pozadí — stejný princip jako video v hero sekci. */}
        <section className="relative overflow-hidden">
          {/* Počítač: fotka na celou pravou stranu, vlevo přechod do krémové.
              Začíná pod hlavičkou, ať hamburger zůstane na krémovém podkladu. */}
          <div className="absolute bottom-0 right-0 top-24 hidden w-[58%] md:block">
            <Image
              src="/anezka-o-mne.jpg"
              alt="Anežka — lektorka jógy"
              fill
              className="object-cover object-top"
              sizes="58vw"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #FCF4F1 0%, rgba(252,244,241,0.94) 16%, rgba(252,244,241,0.6) 36%, rgba(252,244,241,0.2) 58%, transparent 78%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-14 sm:pt-36 md:pb-28">
            <div className="md:w-[52%] md:pr-8">
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
                <p className="mt-6 text-lg font-medium leading-relaxed text-accent-d">
                  {nbsp("Věřím, že každá žena si zaslouží místo, kde může na chvíli jen být.")}
                </p>
              </FadeUp>

              <FadeUp delay={0.18}>
                <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted">
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
              className="object-cover object-top"
              sizes="100vw"
            />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream to-transparent" />
          </div>
        </section>

        {/* ── Co mi jóga dala ── */}
        <section className="bg-sand px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <div className="flex items-center justify-center gap-4">
                <IconWave width={54} height={12} className="text-muted/60" />
                <p className="text-center text-xs uppercase tracking-[0.3em] text-accent">
                  Co mi jóga dala
                </p>
                <IconWave width={54} height={12} className="text-muted/60" />
              </div>
            </FadeUp>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DARY.map((dar, i) => (
                <FadeUp key={dar.text} delay={0.06 * i}>
                  <div className="flex h-full flex-col items-center gap-3 rounded-2xl bg-cream/70 px-5 py-7 text-center ring-1 ring-line">
                    <span className="flex h-9 items-center justify-center">{dar.icon}</span>
                    <p className="text-sm leading-relaxed text-ink">{nbsp(dar.text)}</p>
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
        <section className="bg-sand px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <FadeUp>
              <div className="flex items-center justify-center gap-4">
                <IconWave width={54} height={12} className="text-muted/60" />
                <p className="text-center text-xs uppercase tracking-[0.3em] text-accent">
                  Můj prostor je prostor pro tebe
                </p>
                <IconWave width={54} height={12} className="text-muted/60" />
              </div>
            </FadeUp>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {SLIBY.map((slib, i) => (
                <FadeUp key={slib} delay={0.06 * i}>
                  <div className="flex h-full items-start gap-3 rounded-2xl bg-cream/70 px-5 py-6 ring-1 ring-line">
                    <IconHeart size={18} className="mt-0.5 shrink-0 text-accent" />
                    <p className="text-sm leading-relaxed text-ink">{nbsp(slib)}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Závěr ── */}
        <section className="px-6 py-20 sm:py-24">
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
