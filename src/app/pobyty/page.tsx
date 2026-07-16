import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import PoptavkaForm from "@/components/PoptavkaForm";
import { getPobyty } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { generatePlatebniQr } from "@/lib/platba";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pobyty pro ženy | AURORA jóga",
  description:
    "Ženské jógové pobyty — čas, který patří jen tobě. Pohyb, dech, odpočinek a příroda.",
};

export default async function PobytyPage() {
  const pobyty = await getPobyty(true);
  const qrKody = await Promise.all(
    pobyty.map((p) =>
      generatePlatebniQr({ cisloUctu: p.cislo_uctu, cena: p.cena, variabilniSymbol: p.variabilni_symbol })
    )
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Hlavička stránky */}
        <section className="px-6 pb-10 pt-32 text-center sm:pt-36">
          <FadeUp>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
              Pobyty pro ženy
            </p>
            <h1 className="font-allura text-4xl text-ink sm:text-5xl">
              Čas, který patří jen Tobě
            </h1>
          </FadeUp>
        </section>

        {/* Výpis pobytů */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          {pobyty.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">
              {nbsp("Právě teď není vypsaný žádný pobyt. Sleduj nás na Instagramu, ať ti nový termín neuteče. 🌿")}
            </p>
          ) : (
            <div className="flex flex-col gap-20">
              {pobyty.map((p, i) => {
                const [prvniOdstavec] = p.popis.split(/\n\s*\n/);
                return (
                  <FadeUp key={p.id}>
                    <article
                      className={`flex flex-col gap-8 md:items-start md:gap-14 ${
                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Fotky */}
                      <Link href={`/pobyty/${p.id}`} className="w-full shrink-0 md:w-[46%]">
                        {p.fotky.length > 0 ? (
                          <>
                            <div
                              className={`group relative h-[260px] w-full overflow-hidden sm:h-[320px] md:h-[380px] ${
                                i % 2 === 0 ? "photo-arch-left" : "photo-arch-right"
                              }`}
                            >
                              <Image
                                src={p.fotky[0]}
                                alt={p.nadpis}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 46vw"
                              />
                              {p.fotky.length > 1 && (
                                <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-wider text-cream">
                                  +{p.fotky.length - 1} fotek
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <div
                            className={`flex h-[260px] w-full items-center justify-center bg-sand sm:h-[320px] md:h-[380px] ${
                              i % 2 === 0 ? "photo-arch-left" : "photo-arch-right"
                            }`}
                          >
                            <span className="font-allura text-3xl text-accent/60">Aurora</span>
                          </div>
                        )}
                      </Link>

                      {/* Text */}
                      <div className="flex flex-1 flex-col">
                        <Link href={`/pobyty/${p.id}`}>
                          <h2 className="font-allura text-3xl text-ink transition-colors hover:text-accent-d sm:text-4xl">
                            {nbsp(p.nadpis)}
                          </h2>
                        </Link>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs uppercase tracking-[0.2em] text-accent">
                          {p.termin && <span>📅 {p.termin}</span>}
                          {p.misto && <span>📍 {p.misto}</span>}
                          {p.cena && (
                            <span className="text-sm normal-case tracking-normal text-ink">
                              <strong className="font-medium">{p.cena}</strong>
                            </span>
                          )}
                        </div>

                        {prvniOdstavec && (
                          <div className="mt-5 flex max-w-md flex-col gap-3">
                            <p className="text-sm leading-relaxed text-muted">{nbsp(prvniOdstavec)}</p>
                            <Link
                              href={`/pobyty/${p.id}`}
                              className="w-fit text-xs uppercase tracking-[0.2em] text-accent-d underline underline-offset-4 hover:text-ink"
                            >
                              Zjistit více a prohlédnout fotky →
                            </Link>
                          </div>
                        )}

                        <div className="mt-7">
                          <PoptavkaForm
                            pobytId={p.id}
                            pobytNadpis={p.nadpis}
                            cena={p.cena}
                            qrDataUrl={qrKody[i] ?? undefined}
                            cisloUctu={p.cislo_uctu}
                            variabilniSymbol={p.variabilni_symbol}
                            platebniPokyny={p.platebni_pokyny}
                          />
                        </div>
                      </div>
                    </article>
                  </FadeUp>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
