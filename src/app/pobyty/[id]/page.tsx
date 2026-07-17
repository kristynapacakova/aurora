import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import PoptavkaForm from "@/components/PoptavkaForm";
import PobytGallery from "@/components/PobytGallery";
import { getPobyt } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { generatePlatebniQr } from "@/lib/platba";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pobyt = await getPobyt(Number(id));
  if (!pobyt) return {};
  return {
    title: `${pobyt.nadpis} | AURORA jóga`,
    description: pobyt.popis.slice(0, 160),
  };
}

export default async function PobytDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pobyt = await getPobyt(Number(id));
  if (!pobyt || !pobyt.zverejneno) notFound();
  const qrDataUrl = await generatePlatebniQr({
    cisloUctu: pobyt.cislo_uctu,
    cena: pobyt.cena,
    variabilniSymbol: pobyt.variabilni_symbol,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <Link href="/pobyty" className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
              ← Zpět na pobyty
            </Link>
          </FadeUp>

          {/* Stejné rozložení jako Studio sekce: text na jedné straně, foto vedle */}
          <FadeUp delay={0.05}>
            <div className="mt-8 flex flex-col gap-8 md:flex-row-reverse md:items-start md:gap-14">
              {/* Fotky */}
              <div className="w-full shrink-0 md:w-[46%]">
                <PobytGallery
                  fotky={pobyt.fotky}
                  alt={pobyt.nadpis}
                  arch="right"
                  heightClass="h-[220px] sm:h-[280px] md:h-[320px]"
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h1 className="font-serif text-4xl text-ink sm:text-5xl">{nbsp(pobyt.nadpis)}</h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-accent">
                  {pobyt.termin && <span>📅 {pobyt.termin}</span>}
                  {pobyt.misto && <span>📍 {pobyt.misto}</span>}
                  {pobyt.cena && <span>🏷️ {pobyt.cena}</span>}
                </div>

                {pobyt.popis && (
                  <div className="mt-6 flex max-w-md flex-col gap-3">
                    {pobyt.popis.split(/\n\s*\n/).map((odst, i) => (
                      <p key={i} className="text-sm leading-relaxed text-muted">
                        {nbsp(odst)}
                      </p>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <PoptavkaForm
                    pobytId={pobyt.id}
                    pobytNadpis={pobyt.nadpis}
                    cena={pobyt.cena}
                    qrDataUrl={qrDataUrl ?? undefined}
                    cisloUctu={pobyt.cislo_uctu}
                    variabilniSymbol={pobyt.variabilni_symbol}
                    platebniPokyny={pobyt.platebni_pokyny}
                  />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
