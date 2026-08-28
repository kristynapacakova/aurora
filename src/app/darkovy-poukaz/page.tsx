import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import DarkovyPoukazForm from "@/components/DarkovyPoukazForm";
import { getNastaveni } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "@/components/BrandIcons";

export const metadata = {
  title: "Dárkový poukaz | AURORA jóga",
  description: "Daruj někomu blízkému chvíli klidu — dárkový poukaz na jógu s Aurorou.",
};

export default async function DarkovyPoukazPage() {
  const { cislo_uctu_darky, poukaz_nadpis, poukaz_popis, poukaz_fotka, poukaz_castky } =
    await getNastaveni();
  const dostupne = Boolean(cislo_uctu_darky) && poukaz_castky.length > 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <div className="mb-4 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Dárkový poukaz</p>
              <IconSparkle size={12} />
            </div>
            <h1 className="font-allura text-4xl text-ink sm:text-5xl">
              {nbsp(poukaz_nadpis || "Daruj chvíli jen pro ni")}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">{nbsp(poukaz_popis)}</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            {/* Fotka poukazu — nastavuje se v administraci. */}
            {poukaz_fotka && (
              <div className="relative mx-auto mt-8 aspect-[3/2] w-full max-w-md overflow-hidden rounded-3xl">
                <Image
                  src={poukaz_fotka}
                  alt={poukaz_nadpis || "Dárkový poukaz"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 448px"
                  priority
                />
              </div>
            )}

            <div className="mt-10 text-left">
              {dostupne ? (
                <DarkovyPoukazForm castky={poukaz_castky} />
              ) : (
                <p className="rounded-2xl bg-white/70 p-6 text-center text-sm text-muted ring-1 ring-line">
                  {nbsp("Dárkové poukazy se právě chystají. Sleduj nás na Instagramu, ať ti spuštění neuteče. 🌿")}
                </p>
              )}
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
