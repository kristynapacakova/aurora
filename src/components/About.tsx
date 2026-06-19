import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";

export default function About() {
  return (
    <section id="o-mne" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-24">
          {/* ── Fotky — překryté, oblouk + diagonální rohy ── */}
          <FadeUp delay={0.05}>
            <div className="relative mx-auto max-w-sm pb-24">
              {/*
                Nahraďte src vlastní fotkou lektorky, např.:
                src="/foto-anezka-2.jpg"
              */}
              <div className="relative h-[440px] w-full overflow-hidden rounded-t-full rounded-bl-none rounded-br-[5rem]">
                <Image
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85"
                  alt="Anežka — lektorka jógy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/*
                Nahraďte src vlastní fotkou, např.:
                src="/foto-anezka-3.jpg"
              */}
              <div className="absolute bottom-0 right-0 z-10 h-[300px] w-[78%] overflow-hidden rounded-tl-[5rem] rounded-tr-none rounded-br-none rounded-bl-[5rem] shadow-xl ring-8 ring-sand">
                <Image
                  src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=85"
                  alt="Jóga — detail praxe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 35vw"
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
                Józe se věnuji přes osm let a věřím, že jóga není o výkonu —
                je o naslouchání sobě. Moje lekce jsou prostorem pro pohyb,
                dech i tichou práci s myslí.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Online studio jsem vytvořila pro všechny, kdo chtějí cvičit
                ve svém rytmu — bez tlaku, bez spěchu. Ať jsi úplný
                začátečník nebo zkušený cvičenec, jsi tu vítán/a.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <a
                href={USCREEN.signup}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:bg-accent-d"
              >
                Vyzkoušet studio
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
