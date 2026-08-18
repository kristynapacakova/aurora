import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { nbsp } from "@/lib/typo";
import { getLekce, getNastaveni } from "@/lib/db";
import { VYCHOZI_LEKCE } from "@/lib/vychoziLekce";
import {
  IconSparkle,
  IconSun,
  IconHeart,
  IconLeafBranch,
  IconPin,
  IkonaSoubor,
  IconTelefon,
  IconInstagram,
  IconFacebook,
} from "@/components/BrandIcons";

export const metadata: Metadata = {
  title: "Lekce | AURORA jóga",
  description:
    "Pravidelné společné lekce jógy — kde a kdy se potkáme, jak si rezervovat místo a co si vzít s sebou.",
};

// Rozvrh se plní z administrace, takže stránka nesmí zůstat viset na staticky
// vygenerované verzi z buildu.
export const dynamic = "force-dynamic";

/** Sušený lístek rozesetý kolem karet — leží pod kartou a smí přesahovat
 *  přes její okraj. Stejný princip jako na stránce O mně. */
function List({ velikost, trida }: { velikost: number; trida: string }) {
  return (
    <IconLeafBranch size={velikost} className={`pointer-events-none absolute ${trida}`} />
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

// Co si vzít s sebou. Texty jsou krátké a pevné, zlom na dva řádky je proto
// určený ručně.
//
// Ikony jsou kresby od designéra (public/icons). Rozměry se liší podle poměru
// stran kresby, ať jsou ve řádku opticky stejně velké — láhev je vysoká a úzká,
// ruce se srdcem naopak široké a nízké.
const VYBAVA: { ikona: ReactNode; radky: [string, string] }[] = [
  {
    ikona: <IkonaSoubor soubor="lekce-obleceni.svg" sirka={45} vyska={52} />,
    radky: ["pohodlné", "oblečení"],
  },
  {
    ikona: <IkonaSoubor soubor="lekce-podlozka.svg" sirka={60} vyska={46} />,
    radky: ["podložku", "na jógu"],
  },
  {
    ikona: <IkonaSoubor soubor="lekce-lahev.svg" sirka={30} vyska={54} />,
    radky: ["láhev", "s vodou"],
  },
  {
    // Ruce se srdcem jsou nejširší a nejnižší kresba a mezi rukama je hodně
    // prázdna — i při větší šířce proto působí stejně „těžce“ jako ostatní.
    ikona: <IkonaSoubor soubor="lekce-nalada.svg" sirka={80} vyska={41} />,
    radky: ["dobrou náladu", "a otevřenou mysl"],
  },
];

export default async function LekcePage() {
  const [lekceZAdministrace, nastaveni] = await Promise.all([getLekce(true), getNastaveni()]);

  // Dokud v administraci není ani jedna lekce, ukáže se výchozí rozvrh
  // zapsaný v kódu — skutečné termíny, které klientka učí. Jakmile si tam
  // přidá vlastní, řídí rozvrh už jen administrace.
  const lekce = lekceZAdministrace.length > 0 ? lekceZAdministrace : VYCHOZI_LEKCE;
  const { telefon, instagram_handle, instagram_url, facebook_handle, facebook_url } = nastaveni;

  // Telefon do odkazu tel: — mezery v čísle by odkaz rozbily.
  const telefonHref = `tel:${telefon.replace(/\s/g, "")}`;

  // Tři cesty k rezervaci. Sítě se ukážou jen když jsou v Nastavení vyplněné,
  // aby v řadě nezůstalo prázdné místo.
  const KONTAKTY: {
    popisek: string;
    hodnota: string;
    odkaz: string;
    externi: boolean;
    ikona: ReactNode;
  }[] = [
    {
      popisek: "Telefon",
      hodnota: telefon,
      odkaz: telefonHref,
      externi: false,
      ikona: <IconTelefon size={20} className="text-white" />,
    },
    ...(instagram_url
      ? [
          {
            popisek: "Instagram",
            hodnota: instagram_handle,
            odkaz: instagram_url,
            externi: true,
            ikona: <IconInstagram size={20} className="text-white" />,
          },
        ]
      : []),
    ...(facebook_url
      ? [
          {
            popisek: "Facebook",
            hodnota: facebook_handle,
            odkaz: facebook_url,
            externi: true,
            ikona: <IconFacebook size={20} className="text-white" />,
          },
        ]
      : []),
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-cream">
        {/* ── Úvod: fotka jako pozadí celé sekce, text leží na ní ──
            Stejné řešení jako na stránce O mně: fotka drží pravou polovinu
            a do textu se vytrácí dlouhou maskou, ne překryvem. */}
        <section className="relative overflow-hidden md:min-h-[max(520px,36vw)]">
          <div className="absolute bottom-0 right-0 top-24 hidden w-[51%] md:block">
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.18) 9%, rgba(0,0,0,0.42) 13%, rgba(0,0,0,0.7) 17%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,1) 24%)",
                maskImage:
                  "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,0.18) 9%, rgba(0,0,0,0.42) 13%, rgba(0,0,0,0.7) 17%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,1) 24%)",
              }}
            >
              {/* Záměrně bez preload: fotka je na telefonu schovaná a LCP
                  prvek se podle šířky okna liší. fetchPriority ji upřednostní
                  až ve chvíli, kdy ji prohlížeč opravdu vykresluje. */}
              <Image
                src="/lekce.jpeg"
                alt="Anežka na lekci jógy"
                fill
                className="object-cover"
                style={{ objectPosition: "center 30%" }}
                sizes="51vw"
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-14 sm:pt-36 md:pb-24">
            <div className="md:w-[46%] md:pr-8">
              <FadeUp>
                <div className="mb-4 flex items-center gap-3">
                  <IconSun size={14} className="text-accent" />
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">Lekce</p>
                </div>
                <h1 className="font-allura text-4xl leading-tight text-ink sm:text-5xl">
                  {nbsp("Potkejme se na podložce")}
                </h1>
              </FadeUp>

              <FadeUp delay={0.18}>
                <div className="mt-7 flex flex-col gap-4 text-justify text-sm leading-relaxed text-muted">
                  <p>
                    {nbsp("Společné lekce jsou místem, kde můžeš na chvíli odložit každodenní starosti, věnovat pozornost svému tělu a dopřát si čas jen pro sebe.")}
                  </p>
                  <p>
                    {nbsp("Čeká tě jemně plynoucí pohyb, vědomý dech, uvolnění i chvíle klidu.")}
                  </p>
                  {/* Srdíčko drží u poslední věty přes nbsp — jinak se umí
                      zalomit samo na další řádek. */}
                  <p>
                    {nbsp("Nemusíš mít žádné předchozí zkušenosti. Přijď přesně taková, jaká jsi.")}
                    {"\u00A0"}
                    <IconHeart size={13} className="inline-block align-[-0.1em] text-accent" />
                  </p>
                </div>
              </FadeUp>
            </div>
          </div>

          {/* Telefon: fotka přes celou šířku pod textem, ostrá po všech hranách */}
          <div className="relative h-[92vw] min-h-[340px] w-full overflow-hidden md:hidden">
            <Image
              src="/lekce.jpeg"
              alt="Anežka na lekci jógy"
              fill
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
              sizes="100vw"
            />
          </div>
        </section>

        {/* ── Pravidelné lekce ── */}
        <section className="overflow-hidden px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <Popisek>Pravidelné lekce</Popisek>
            </FadeUp>

            {/* Rozvrh nikdy není prázdný — když v administraci nic není,
                nastoupí výchozí termíny z kódu. */}
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lekce.map((l, i) => (
                <FadeUp key={l.id} delay={0.06 * i}>
                  <div className="flex h-full flex-col items-center rounded-[20px] bg-sand/50 px-6 py-8 text-center shadow-[0_2px_12px_rgba(140,95,71,0.045)] ring-1 ring-white/70">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70">
                      <IconPin size={20} />
                    </span>
                    <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-accent">
                      {l.den}
                    </p>
                    <p className="mt-1 font-serif text-3xl leading-tight text-ink">
                      {nbsp(l.misto)}
                    </p>
                    <p className="mt-3 text-sm text-muted">{nbsp(l.cas)}</p>
                    {l.poznamka && (
                      <p className="mt-1 text-xs text-muted/80">{nbsp(l.poznamka)}</p>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Jiskra je uvnitř textu, ne vedle bloku — jinak se při zalomení
                na dva řádky odtrhne a zůstane sama u levého okraje. */}
            <FadeUp delay={0.12}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted">
                <IconSparkle size={10} className="mr-2 inline-block align-[0.05em] text-accent/70" />
                {nbsp("Aktuální změny a doplňující informace vždy najdeš na Instagramu nebo Facebooku.")}
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ── Rezervace ──
            Blok je vystředěný jako zbytek stránky. Lístek přesahuje přes levý
            horní roh rámečku a leží pod ním, proto je obalen ještě jedním
            relativním divem a sekce ořezává přetečení. */}
        <section className="overflow-hidden px-6 pb-12 pt-4 sm:pb-16 sm:pt-6">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <div className="relative">
                <List velikost={150} trida="-left-16 -top-6 -rotate-[64deg] text-accent/25" />
              <div className="relative rounded-[20px] bg-sand/50 px-8 py-6 shadow-[0_2px_12px_rgba(140,95,71,0.045)] ring-1 ring-white/70 sm:px-10">
                <div className="text-center">
                  <h2 className="font-allura text-3xl leading-tight text-ink sm:text-4xl">
                    Rezervace
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
                    {nbsp("Své místo si můžeš rezervovat telefonicky nebo zprávou.")}
                  </p>
                </div>

                {/* Tři rovnocenné cesty, jak se ozvat. Ikona vedle textu, ne nad
                    ním — blok je tak stejně vysoký jako karty s termíny. Dělicí
                    linka místo rámečků, stejně jako sekce „Můj prostor“ na O mně.
                    Na telefonu se linka otočí naležato. */}
                <div className="mt-5 grid grid-cols-1 divide-y divide-line/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {KONTAKTY.map((k) => (
                    <a
                      key={k.popisek}
                      href={k.odkaz}
                      target={k.externi ? "_blank" : undefined}
                      rel={k.externi ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-center gap-3 px-4 py-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-accent-d">
                        {k.ikona}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
                          {k.popisek}
                        </span>
                        <span className="truncate font-serif text-lg leading-snug text-ink transition-colors group-hover:text-accent-d">
                          {k.hodnota}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Co si vzít s sebou ── */}
        <section className="px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <Popisek>Co si vzít s sebou?</Popisek>
            </FadeUp>

            {/* Bez rámečků a bez dělicích linek — ikona nad textem, čtyři
                sloupce vedle sebe. Na telefonu se zlomí do dvojic. */}
            <FadeUp delay={0.08}>
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
                {VYBAVA.map((v) => (
                  <div
                    key={v.radky.join(" ")}
                    className="flex flex-col items-center gap-3 px-2 text-center sm:px-6"
                  >
                    <span className="flex h-16 items-center justify-center">{v.ikona}</span>
                    <p className="text-sm leading-snug text-ink">
                      {nbsp(v.radky[0])}
                      <br />
                      {nbsp(v.radky[1])}
                    </p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── První lekce? ──
            Bez rámečku a bez fotky — jen text na střed, volně na krémovém
            podkladu. */}
        <section className="px-6 pb-24 pt-6 sm:pb-28">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <div className="text-center">
                <h2 className="font-allura text-3xl leading-tight text-ink sm:text-4xl">
                  {nbsp("První lekce?")}
                </h2>
                <div className="mx-auto mt-4 flex max-w-xl flex-col gap-3 text-sm leading-relaxed text-muted">
                  <p>
                    {nbsp("Pokud jdeš na jógu poprvé, nemusíš mít žádné obavy. Vše ti ráda vysvětlím a provedu tě lekcí krok za krokem.")}
                  </p>
                  <p>
                    {nbsp("Přijď přesně taková, jaká jsi.")}
                    {"\u00A0"}
                    <IconHeart size={13} className="inline-block align-[-0.1em] text-accent" />
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
