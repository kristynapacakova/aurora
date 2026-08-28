import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import DarkovyPoukazForm from "@/components/DarkovyPoukazForm";
import { getNastaveni, getPoukazyNabidka } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "@/components/BrandIcons";

export const metadata = {
  title: "Dárkový poukaz | AURORA jóga",
  description: "Daruj někomu blízkému chvíli klidu — dárkový poukaz na jógu s Aurorou.",
};

export default async function DarkovyPoukazPage() {
  const [{ cislo_uctu_darky }, poukazy] = await Promise.all([
    getNastaveni(),
    getPoukazyNabidka(true),
  ]);
  // Bez čísla účtu není kam platit, bez vystaveného poukazu není co koupit.
  const dostupne = Boolean(cislo_uctu_darky) && poukazy.length > 0;

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
              {nbsp("Daruj chvíli jen pro ni")}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
              {nbsp("Kód poukazu pošleme e-mailem, jakmile platbu přijmeme.")}
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            {dostupne ? (
              <div className="mt-12 flex flex-col gap-16">
                {poukazy.map((poukaz) => (
                  <div key={poukaz.id}>
                    <div className="relative mx-auto aspect-[3/2] w-full max-w-md overflow-hidden rounded-3xl">
                      {poukaz.fotka ? (
                        <Image
                          src={poukaz.fotka}
                          alt={poukaz.nadpis}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 448px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-sand">
                          <span className="font-allura text-4xl text-accent/60">Aurora</span>
                        </div>
                      )}
                    </div>

                    <h2 className="mt-6 font-serif text-2xl text-ink sm:text-3xl">
                      {nbsp(poukaz.nadpis)}
                    </h2>
                    {poukaz.popis && (
                      <p className="mx-auto mt-3 max-w-md whitespace-pre-line text-sm leading-relaxed text-muted">
                        {nbsp(poukaz.popis)}
                      </p>
                    )}

                    <div className="mt-8 text-left">
                      <DarkovyPoukazForm nabidkaId={poukaz.id} castky={poukaz.castky} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10 text-left">
                <p className="rounded-2xl bg-white/70 p-6 text-center text-sm text-muted ring-1 ring-line">
                  {nbsp("Dárkové poukazy se právě chystají. Sleduj nás na Instagramu, ať ti spuštění neuteče. 🌿")}
                </p>
              </div>
            )}
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
