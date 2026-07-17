import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import PobytGallery from "@/components/PobytGallery";
import { getPobyty } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pobyty pro ženy | AURORA jóga",
  description:
    "Ženské jógové pobyty — čas, který patří jen tobě. Pohyb, dech, odpočinek a příroda.",
};

function excerpt(text: string, max = 140): string {
  const plain = text.replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export default async function PobytyPage() {
  const pobyty = await getPobyty(true);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        {/* Hlavička stránky */}
        <section className="px-6 pb-14 pt-32 text-center sm:pt-36">
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
            <div className="flex flex-col gap-24">
              {pobyty.map((p, i) => {
                return (
                  <FadeUp key={p.id}>
                    <article
                      className={`flex flex-col gap-8 md:items-start md:gap-14 ${
                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Fotky — stejný rám jako Studio sekce, s miniaturami k prokliku */}
                      <div className="w-full shrink-0 md:w-[46%]">
                        <PobytGallery
                          fotky={p.fotky}
                          alt={p.nadpis}
                          arch={i % 2 === 0 ? "left" : "right"}
                          heightClass="h-[220px] sm:h-[280px] md:h-[320px]"
                        />
                      </div>

                      {/* Text */}
                      <div className="flex flex-1 flex-col">
                        <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                          {nbsp(p.nadpis)}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-accent">
                          {p.termin && <span>📅 {p.termin}</span>}
                          {p.misto && <span>📍 {p.misto}</span>}
                          {p.cena && <span>🏷️ {p.cena}</span>}
                        </div>

                        {p.popis && (
                          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
                            {nbsp(excerpt(p.popis))}
                          </p>
                        )}

                        <Link
                          href={`/pobyty/${p.id}`}
                          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-aurora px-7 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                        >
                          Zjistit více →
                        </Link>
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
