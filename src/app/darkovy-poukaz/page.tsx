import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import DarkovyPoukazForm from "@/components/DarkovyPoukazForm";
import { getNastaveni, getPoukazyNabidka } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { generatePlatebniQr } from "@/lib/platba";
import { IconSparkle } from "@/components/BrandIcons";

// Poukazy se plní z administrace, takže stránka nesmí zůstat viset na verzi
// vygenerované při nasazení — stejná minutová cache jako u pobytů.
export const revalidate = 60;

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

  // QR kód pro každou nabízenou částku připravíme tady — knihovna na QR kódy
  // je velká a nemá smysl ji posílat do prohlížeče každé návštěvnici.
  // Variabilní symbol vzniká až se samotným poukazem, takže v QR není;
  // platba se páruje podle jména v poznámce.
  const vsechnyCastky = [...new Set(poukazy.flatMap((p) => p.castky.map((c) => c.hodnota_kc)))];
  const qrDvojice = await Promise.all(
    vsechnyCastky.map(async (castka) => [
      castka,
      dostupne ? await generatePlatebniQr({ cisloUctu: cislo_uctu_darky, castka }) : null,
    ] as const)
  );
  const qrKody = Object.fromEntries(qrDvojice);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <FadeUp>
            <div className="mb-10 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Dárkový poukaz</p>
              <IconSparkle size={12} />
            </div>
          </FadeUp>

          {!dostupne ? (
            <FadeUp delay={0.1}>
              <p className="mx-auto mt-8 rounded-2xl bg-white/70 p-6 text-center text-sm text-muted ring-1 ring-line">
                {nbsp("Dárkové poukazy se právě chystají. Sleduj nás na Instagramu, ať ti spuštění neuteče. 🌿")}
              </p>
            </FadeUp>
          ) : (
            <div className="flex flex-col gap-24">
              {poukazy.map((poukaz, i) => (
                <FadeUp key={poukaz.id} delay={0.05}>
                  <section className="text-center">
                    {/* Grafika je to, co poukaz prodává, takže je hrdinou
                        stránky. Výška se řídí obrázkem — pevný rám by kolem
                        návrhu nechával prázdné pruhy. */}
                    {poukaz.fotka && (
                      <Image
                        src={poukaz.fotka}
                        alt={poukaz.nadpis}
                        width={1400}
                        height={900}
                        className="mx-auto h-auto w-full rounded-3xl shadow-[0_18px_50px_-20px_rgba(140,95,71,0.35)]"
                        sizes="(max-width: 768px) 100vw, 768px"
                        priority={i === 0}
                      />
                    )}

                    {i === 0 ? (
                      <h1 className="mt-10 font-allura text-4xl text-ink sm:text-5xl">
                        {nbsp(poukaz.nadpis)}
                      </h1>
                    ) : (
                      <h2 className="mt-10 font-allura text-4xl text-ink sm:text-5xl">
                        {nbsp(poukaz.nadpis)}
                      </h2>
                    )}

                    {poukaz.popis && (
                      <div className="mx-auto mt-5 flex max-w-xl flex-col gap-3">
                        {poukaz.popis.split(/\n\s*\n/).map((odstavec, j) => (
                          <p key={j} className="text-sm leading-relaxed text-muted sm:text-base">
                            {nbsp(odstavec)}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Tlačítka i rozbalený formulář drží v jednom sloupci
                        pod textem — stejný postup jako u objednávky pobytu. */}
                    <div className="mt-9 flex flex-col items-center">
                      <DarkovyPoukazForm
                        nabidkaId={poukaz.id}
                        nadpis={poukaz.nadpis}
                        castky={poukaz.castky}
                        qrKody={qrKody}
                        cisloUctu={cislo_uctu_darky}
                      />
                    </div>
                  </section>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
