import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import PoptavkaForm from "@/components/PoptavkaForm";
import { getPobyty } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pobyty pro ženy | AURORA jóga",
  description:
    "Ženské jógové pobyty — čas, který patří jen tobě. Pohyb, dech, odpočinek a příroda.",
};

export default async function PobytyPage() {
  const pobyty = await getPobyty(true);

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
              {pobyty.map((p, i) => (
                <FadeUp key={p.id}>
                  <article
                    className={`flex flex-col gap-8 md:items-start md:gap-14 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Fotky */}
                    <div className="w-full shrink-0 md:w-[46%]">
                      {p.fotky.length > 0 ? (
                        <>
                          <div
                            className={`relative h-[260px] w-full overflow-hidden sm:h-[320px] md:h-[380px] ${
                              i % 2 === 0 ? "photo-arch-left" : "photo-arch-right"
                            }`}
                          >
                            <Image
                              src={p.fotky[0]}
                              alt={p.nadpis}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 46vw"
                            />
                          </div>
                          {p.fotky.length > 1 && (
                            <div className="mt-3 grid grid-cols-4 gap-3">
                              {p.fotky.slice(1, 5).map((url, j) => (
                                <div key={url} className="relative aspect-square overflow-hidden rounded-xl">
                                  <Image src={url} alt={`${p.nadpis} — fotka ${j + 2}`} fill className="object-cover" sizes="150px" />
                                </div>
                              ))}
                            </div>
                          )}
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
                    </div>

                    {/* Text */}
                    <div className="flex flex-1 flex-col">
                      <h2 className="font-allura text-3xl text-ink sm:text-4xl">{nbsp(p.nadpis)}</h2>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs uppercase tracking-[0.2em] text-accent">
                        {p.termin && <span>📅 {p.termin}</span>}
                        {p.misto && <span>📍 {p.misto}</span>}
                      </div>

                      {p.popis && (
                        <div className="mt-5 flex max-w-md flex-col gap-3">
                          {p.popis.split(/\n\s*\n/).map((odst, j) => (
                            <p key={j} className="text-sm leading-relaxed text-muted">
                              {nbsp(odst)}
                            </p>
                          ))}
                        </div>
                      )}

                      {p.cena && (
                        <p className="mt-5 text-lg text-ink">
                          <span className="text-xs uppercase tracking-[0.2em] text-muted">Cena: </span>
                          <strong className="font-medium">{p.cena}</strong>
                        </p>
                      )}

                      <div className="mt-7">
                        <PoptavkaForm pobytId={p.id} pobytNadpis={p.nadpis} />
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
