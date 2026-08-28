"use client";

import Image from "next/image";
import { useState } from "react";
import DarkovyPoukazForm from "./DarkovyPoukazForm";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";
import type { PoukazNabidka } from "@/lib/db";

// Grafika a výběr částky patří k sobě: každá hodnota má vlastní obrázek
// s tou správnou částkou, takže se náhled musí měnit s volbou. Proto sekci
// drží klientská komponenta a ne stránka.
export default function PoukazSekce({
  poukaz,
  qrKody,
  cisloUctu,
  prvni,
  obraceno,
}: {
  poukaz: PoukazNabidka;
  qrKody: Record<number, string | null>;
  cisloUctu: string;
  prvni: boolean;
  obraceno: boolean;
}) {
  const [hodnotaKc, setHodnotaKc] = useState(poukaz.castky[0]?.hodnota_kc ?? 0);

  const vybrana = poukaz.castky.find((c) => c.hodnota_kc === hodnotaKc);
  const fotka = vybrana?.fotka || poukaz.fotka;

  const Nadpis = prvni ? "h1" : "h2";

  return (
    <section
      className={`flex flex-col items-center gap-10 md:items-start md:gap-16 ${
        obraceno ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Výšku určuje grafika, ne rám — pevný poměr by kolem návrhu nechával
          prázdné pruhy, nebo by ho ořízl. */}
      {fotka && (
        <div className="w-full md:w-[52%]">
          <Image
            src={fotka}
            alt={poukaz.nadpis}
            width={1400}
            height={900}
            className="h-auto w-full rounded-2xl shadow-[0_20px_50px_-24px_rgba(140,95,71,0.45)]"
            sizes="(max-width: 768px) 100vw, 52vw"
            priority={prvni}
          />
        </div>
      )}

      <div className="flex-1">
        <div className="mb-3 flex items-center gap-3">
          <IconSparkle size={12} />
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Dárkový poukaz</p>
        </div>

        <Nadpis className="font-allura text-4xl text-ink sm:text-5xl">{nbsp(poukaz.nadpis)}</Nadpis>

        {poukaz.popis && (
          <div className="mt-5 flex flex-col gap-3">
            {poukaz.popis.split(/\n\s*\n/).map((odstavec, j) =>
              // Odstavec uvozený hvězdičkou je poznámka pod čarou — vysází se
              // drobněji a odsazeně.
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
            hodnotaKc={hodnotaKc}
            onZmenaCastky={setHodnotaKc}
            qrKody={qrKody}
            cisloUctu={cisloUctu}
          />
        </div>
      </div>
    </section>
  );
}
