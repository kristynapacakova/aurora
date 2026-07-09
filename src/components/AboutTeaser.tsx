import Image from "next/image";
import FadeUp from "./FadeUp";
import { IconLeafBranch, IconHeart } from "./BrandIcons";

export default function AboutTeaser() {
  return (
    <section className="bg-sand py-9 sm:py-11">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[2fr_3fr] md:gap-12">

          {/* Fotka */}
          <FadeUp delay={0.05}>
            <div className="relative h-[180px] w-full overflow-hidden rounded-tr-[2rem] rounded-bl-[2rem] sm:h-[220px] md:h-[280px]">
              <Image
                src="/o-mne.png"
                alt="Anežka — lektorka jógy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </FadeUp>

          {/* Text */}
          <FadeUp delay={0.15}>
            <div className="mb-6 flex items-center gap-3">
              <IconLeafBranch size={22} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Moje cesta k józe</p>
            </div>
            <blockquote className="font-serif text-xl leading-[1.3] text-ink sm:text-2xl">
              Jóga mě naučila zpomalit.
              <br />
              Přestat hledat štěstí venku
              <br />
              a začít ho objevovat sama&nbsp;v&nbsp;sobě.
            </blockquote>
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted">
              Aurora vznikla z touhy vytvořit prostor, kde se ženy mohou na chvíli
              zastavit, nadechnout a znovu uslyšet samy sebe.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#o-mne"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:text-accent"
              >
                Více o mně →
              </a>
              <IconHeart size={14} />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
