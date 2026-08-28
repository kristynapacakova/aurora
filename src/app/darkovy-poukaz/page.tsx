import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import PoukazSekce from "@/components/PoukazSekce";
import { getNastaveni, getPoukazyNabidka } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { generatePlatebniQr } from "@/lib/platba";

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
                  <PoukazSekce
                    poukaz={poukaz}
                    qrKody={qrKody}
                    cisloUctu={cislo_uctu_darky}
                    prvni={i === 0}
                    obraceno={i % 2 === 1}
                  />
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
