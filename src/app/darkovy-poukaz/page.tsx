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
        <div className="mx-auto max-w-6xl">
          {!dostupne ? (
            <FadeUp>
              <p className="mx-auto max-w-xl rounded-2xl bg-white/70 p-6 text-center text-sm text-muted ring-1 ring-line">
                {nbsp("Dárkové poukazy se právě chystají. Sleduj nás na Instagramu, ať ti spuštění neuteče. 🌿")}
              </p>
            </FadeUp>
          ) : (
            <div className="flex flex-col gap-28">
              {poukazy.map((poukaz, i) => (
                <FadeUp key={poukaz.id} delay={0.05}>
                  {/* Stejné rozložení jako sekce na úvodní stránce: grafika
                      na jedné straně, text a objednávka vedle ní. */}
                  <section
                    className={`flex flex-col items-center gap-10 md:items-start md:gap-16 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Výšku určuje grafika, ne rám — pevný poměr by kolem
                        návrhu nechával prázdné pruhy, nebo by ho ořízl. */}
                    {poukaz.fotka && (
                      <div className="w-full md:w-[52%]">
                        <Image
                          src={poukaz.fotka}
                          alt={poukaz.nadpis}
                          width={1400}
                          height={900}
                          className="h-auto w-full rounded-2xl shadow-[0_20px_50px_-24px_rgba(140,95,71,0.45)]"
                          sizes="(max-width: 768px) 100vw, 52vw"
                          priority={i === 0}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        <IconSparkle size={12} />
                        <p className="text-xs uppercase tracking-[0.3em] text-accent">
                          Dárkový poukaz
                        </p>
                      </div>

                      {i === 0 ? (
                        <h1 className="font-allura text-4xl text-ink sm:text-5xl">
                          {nbsp(poukaz.nadpis)}
                        </h1>
                      ) : (
                        <h2 className="font-allura text-4xl text-ink sm:text-5xl">
                          {nbsp(poukaz.nadpis)}
                        </h2>
                      )}

                      {poukaz.popis && (
                        <div className="mt-5 flex flex-col gap-3">
                          {poukaz.popis.split(/\n\s*\n/).map((odstavec, j) =>
                            // Odstavec uvozený hvězdičkou je poznámka pod
                            // čarou — vysází se drobněji a odsazeně.
                            odstavec.trimStart().startsWith("*") ? (
                              <p key={j} className="mt-1 text-xs leading-relaxed text-muted/80">
                                {nbsp(odstavec.trimStart())}
                              </p>
                            ) : (
                              <p key={j} className="text-sm leading-relaxed text-muted">
                                {nbsp(odstavec)}
                              </p>
                            )
                          )}
                        </div>
                      )}

                      <div className="mt-8">
                        <DarkovyPoukazForm
                          nabidkaId={poukaz.id}
                          nadpis={poukaz.nadpis}
                          castky={poukaz.castky}
                          qrKody={qrKody}
                          cisloUctu={cislo_uctu_darky}
                        />
                      </div>
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
