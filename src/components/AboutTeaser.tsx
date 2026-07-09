import Image from "next/image";
import FadeUp from "./FadeUp";
import { IconLeafBranch, IconHeart } from "./BrandIcons";

export default function AboutTeaser() {
  return (
    <section className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[3fr_2fr] md:gap-20">

          {/* Fotka */}
          <FadeUp delay={0.05}>
            <div className="relative h-[360px] w-full overflow-hidden rounded-tr-[4rem] rounded-bl-[4rem] sm:h-[460px]">
              <Image
                src="https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=85"
                alt="Anežka — lektorka jógy"
                fill
                className="object-cover brightness-[0.96] saturate-[0.75]"
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
            <blockquote className="font-serif text-2xl leading-[1.3] text-ink sm:text-3xl">
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
