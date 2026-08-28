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
          <FadeUp>
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <IconSparkle size={12} />
                <p className="text-xs uppercase tracking-[0.3em] text-accent">Dárkový poukaz</p>
                <IconSparkle size={12} />
              </div>
              <h1 className="font-allura text-4xl text-ink sm:text-5xl">
                {nbsp("Daruj chvíli jen pro ni")}
              </h1>
            </div>
          </FadeUp>

          {!dostupne ? (
            <FadeUp delay={0.1}>
              <p className="mx-auto mt-10 max-w-xl rounded-2xl bg-white/70 p-6 text-center text-sm text-muted ring-1 ring-line">
                {nbsp("Dárkové poukazy se právě chystají. Sleduj nás na Instagramu, ať ti spuštění neuteče. 🌿")}
              </p>
            </FadeUp>
          ) : (
            <div className="mt-14 flex flex-col gap-24">
              {poukazy.map((poukaz, i) => (
                <FadeUp key={poukaz.id} delay={0.05}>
                  {/* Stejné rozložení jako sekce na úvodní stránce a u pobytů:
                      grafika na jedné straně, text vedle ní. */}
                  <div
                    className={`flex flex-col items-center gap-8 md:gap-14 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Grafika poukazu se nesmí ořezávat — je to hotový návrh,
                        ne ilustrační fotka. Proto object-contain a obyčejný
                        zaoblený rám: obloukový tvar, který používáme
                        u fotek, by grafice ukrojil rohy. */}
                    <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-3xl bg-sand/40 sm:h-[300px] md:h-[340px] md:w-[48%]">
                      {poukaz.fotka ? (
                        <Image
                          src={poukaz.fotka}
                          alt={poukaz.nadpis}
                          fill
                          className="object-contain p-3"
                          sizes="(max-width: 768px) 100vw, 45vw"
                          priority={i === 0}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-allura text-4xl text-accent/60">Aurora</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                        {nbsp(poukaz.nadpis)}
                      </h2>
                      {poukaz.popis && (
                        <div className="mt-5 flex max-w-md flex-col gap-3">
                          {poukaz.popis.split(/\n\s*\n/).map((odstavec, j) => (
                            <p key={j} className="text-sm leading-relaxed text-muted">
                              {nbsp(odstavec)}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Formulář zabírá celou šířku pod grafikou — je to nejdelší
                      část a vedle textu by se mačkal. */}
                  <div className="mx-auto mt-10 max-w-2xl">
                    <DarkovyPoukazForm
                      nabidkaId={poukaz.id}
                      nadpis={poukaz.nadpis}
                      castky={poukaz.castky}
                      qrKody={qrKody}
                      cisloUctu={cislo_uctu_darky}
                    />
                  </div>
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
