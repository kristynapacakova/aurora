// DOČASNÁ STRÁNKA — jen na náhled variant úvodní fotky na O mně.
// Po výběru varianty se celý soubor smaže.
import type { ReactNode } from "react";
import Image from "next/image";
import { nbsp } from "@/lib/typo";
import { IconSparkle, IconLeafBranch } from "@/components/BrandIcons";

function Text() {
  return (
    <div className="max-w-2xl lg:max-w-none">
      <div className="mb-4 flex items-center gap-3">
        <IconSparkle size={12} />
        <p className="text-xs uppercase tracking-[0.3em] text-accent">O mně</p>
      </div>
      <h1 className="font-allura text-4xl leading-tight text-ink sm:text-5xl">
        {nbsp("Můj jógový příběh")}
      </h1>
      <p className="mt-5 text-[11px] uppercase leading-[2] tracking-[0.14em] text-accent sm:text-xs lg:tracking-[0.3em]">
        {nbsp("Věřím, že každá žena si zaslouží místo,")}
        <br />
        {nbsp("kde může na chvíli jen být.")}
      </p>
      <div className="mt-8 flex flex-col gap-4 text-justify text-sm leading-relaxed text-muted">
        <p>{nbsp("To, že teď nevidíš nebo neznáš svoji cestu, ještě neznamená, že neexistuje.")}</p>
        <p>{nbsp("Ani já bych si před pěti lety nepomyslela, že jednou budu provázet ženy jógou.")}</p>
        <p>
          {nbsp("K józe jsem se nedostala přes studia ani ")}
          <strong className="font-medium text-ink">{nbsp("skupinové lekce")}</strong>
          {nbsp(". Začínala jsem sama doma, ")}
          <strong className="font-medium text-ink">{nbsp("prostřednictvím online lekcí")}</strong>
          {nbsp(". Hledala jsem způsob, jak se cítit lépe ve svém těle, uvolnit napětí a dopřát si chvíli jen pro sebe.")}
        </p>
      </div>
    </div>
  );
}

function Stitek({ cislo, nazev, popis }: { cislo: number; nazev: string; popis: string }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-2 pt-14">
      <p className="text-xs uppercase tracking-[0.3em] text-accent-d">
        Návrh {cislo} — {nazev}
      </p>
      <p className="mt-1 text-xs text-muted">{popis}</p>
      <div className="mt-4 h-px w-full bg-line" />
    </div>
  );
}

/** Stejná kostra jako na ostré stránce: výšku řádku určuje text, obrázek
 *  leží absolutně a dopočítá si šířku z vlastního poměru stran. */
function Obal({ children }: { children: ReactNode }) {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-5xl py-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <Text />
          <div className="lg:h-full">
            <div className="relative lg:h-full">
              <div className="lg:absolute lg:inset-0 lg:flex lg:justify-end">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavrhyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream pb-20">
      {/* ── 1 — současný oblouk ── */}
      <Stitek cislo={1} nazev="Oblouk (současný)" popis="Fotka i s lesem, oříznutá do oblouku." />
      <Obal>
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:mx-0 lg:h-full lg:w-auto lg:max-w-none">
          <IconLeafBranch size={126} className="pointer-events-none absolute -left-4 top-12 -rotate-[58deg] text-accent/30 sm:-left-8 lg:-left-12" />
          <div className="relative aspect-[1500/1689] w-full overflow-hidden rounded-t-full rounded-br-[5rem] bg-sand lg:h-full lg:w-auto">
            <Image src="/anezka-o-mne.webp" alt="Anežka" fill className="object-cover" sizes="24rem" loading="eager" />
          </div>
          <IconLeafBranch size={92} className="pointer-events-none absolute -bottom-8 -right-8 rotate-[45deg] text-accent/30 lg:-right-16" />
        </div>
      </Obal>

      {/* ── 2 — výřez bez pozadí ── */}
      <Stitek cislo={2} nazev="Bez pozadí" popis="Les odstraněný, zůstala jen postava s podložkou. Dole se plynule rozplyne do stránky." />
      <Obal>
        <div className="relative mx-auto w-full max-w-[16rem] sm:max-w-xs lg:mx-0 lg:h-full lg:w-auto lg:max-w-none">
          <IconLeafBranch size={118} className="pointer-events-none absolute -left-6 top-16 -rotate-[58deg] text-accent/25 lg:-left-14" />
          <div className="relative aspect-[904/1470] w-full lg:h-full lg:w-auto">
            <Image src="/anezka-vyrez.webp" alt="Anežka" fill className="object-contain" sizes="20rem" loading="eager" />
          </div>
          <IconLeafBranch size={88} className="pointer-events-none absolute bottom-4 -right-6 rotate-[45deg] text-accent/25 lg:-right-12" />
        </div>
      </Obal>

      {/* ── 3 — pozadí do ztracena ── */}
      <Stitek cislo={3} nazev="Pozadí do ztracena" popis="Les zůstává, ale k okrajům se rozplývá do krémového pozadí. Žádná ostrá hrana." />
      <Obal>
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:mx-0 lg:h-full lg:w-auto lg:max-w-none">
          <IconLeafBranch size={118} className="pointer-events-none absolute -left-4 top-14 -rotate-[58deg] text-accent/25 lg:-left-10" />
          <div className="relative aspect-[1500/1689] w-full lg:h-full lg:w-auto">
            <Image src="/anezka-doztracena.webp" alt="Anežka" fill className="object-contain" sizes="24rem" loading="eager" />
          </div>
          <IconLeafBranch size={88} className="pointer-events-none absolute bottom-6 -right-6 rotate-[45deg] text-accent/25 lg:-right-12" />
        </div>
      </Obal>

      {/* ── 4 — výřez před obloukem ── */}
      <Stitek cislo={4} nazev="Výřez před obloukem" popis="Oblouk zůstane jako plocha v barvě písku a postava před ním stojí a přesahuje ho." />
      <Obal>
        <div className="relative mx-auto w-full max-w-[16rem] sm:max-w-xs lg:mx-0 lg:h-full lg:w-auto lg:max-w-none">
          <div className="absolute inset-x-[-14%] bottom-0 top-[8%] rounded-t-full rounded-br-[4rem] bg-sand" />
          <div className="relative aspect-[904/1470] w-full lg:h-full lg:w-auto">
            <Image src="/anezka-vyrez.webp" alt="Anežka" fill className="object-contain" sizes="20rem" loading="eager" />
          </div>
        </div>
      </Obal>
    </main>
  );
}
