import Image from "next/image";
import FadeUp from "./FadeUp";

export default function About() {
  return (
    <section id="o-mne" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-24">
        {/* ── Fotka ── */}
        <FadeUp delay={0.05}>
          <div className="relative mx-auto max-w-sm">
            {/* Dekorativní rámeček posunutý — kopíruje tvar oblouku */}
            <div className="absolute -left-4 -top-4 h-full w-full rounded-t-full rounded-b-none border border-line" />
            <div className="relative h-[500px] overflow-hidden rounded-t-full rounded-b-none">
              {/*
                Nahraďte src vlastní fotkou lektorky, např.:
                src="/foto-anezka-2.jpg"
              */}
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85"
                alt="Anežka — lektorka jógy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        </FadeUp>

        {/* ── Text ── */}
        <div>
          <FadeUp delay={0}>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">
              O mně
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-serif text-4xl text-ink sm:text-5xl">
              Ahoj, jsem Anežka
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-6 leading-relaxed text-muted">
              Józe se věnuji přes osm let a věřím, že jóga není o výkonu — je
              o naslouchání sobě. Moje lekce jsou prostorem pro pohyb, dech i
              tichou práci s myslí.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Online studio jsem vytvořila pro všechny, kdo chtějí cvičit ve
              svém rytmu — bez tlaku, bez spěchu. Ať jsi úplný začátečník nebo
              zkušený cvičenec, jsi tu vítán/a.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="mt-10 flex gap-10">
              {[
                { num: "8+", label: "let praxe" },
                { num: "500+", label: "spokojených členů" },
                { num: "200+", label: "nahrávek v knihovně" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-4xl text-ink">{stat.num}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
