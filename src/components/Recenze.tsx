import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle, IconLeafBranch } from "./BrandIcons";
import { getRecenze } from "@/lib/db";
import RecenzeKaruzel from "./RecenzeKaruzel";

// Ohlasy žen, které chodí na lekce. Načítají se z databáze — klientka je
// spravuje v administraci a ženy si můžou přidat vlastní formulářem níž.
export default async function Recenze() {
  const recenze = await getRecenze(true);
  if (recenze.length === 0) return null;

  return (
    <section id="ohlasy" className="relative overflow-hidden bg-cream pt-14 pb-16 sm:pt-16 sm:pb-20">
      <IconLeafBranch
        size={180}
        className="pointer-events-none absolute -left-14 top-10 hidden text-accent/10 lg:block"
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <FadeUp>
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Ohlasy</p>
              <IconSparkle size={12} />
            </div>
            <h2 className="font-allura text-4xl text-ink sm:text-5xl">
              {nbsp("Slova žen, které už chodí")}
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <RecenzeKaruzel recenze={recenze} />
        </FadeUp>
      </div>
    </section>
  );
}
