import Image from "next/image";
import FadeUp from "./FadeUp";
import { IconLeafBranch, IconHeart } from "./BrandIcons";

export default function AboutTeaser() {
  return (
    <section className="bg-sand relative py-16 sm:py-24">
      {/* Wave overlapping previous section */}
      <div className="absolute inset-x-0 z-10 h-24" style={{ top: '-48px' }}>
        <svg viewBox="0 0 1440 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,56 C400,2 1000,94 1440,40 L1440,96 L0,96 Z" fill="#FBE9DE" />
        </svg>
      </div>
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
              Jmenuji se Anežka a jóga je pro mě mnohem víc než pohyb.
            </blockquote>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-muted">
              Ve svých lekcích vytvářím prostor, kde nemusíš nic dokazovat ani zvládat dokonale.
              Můžeš jednoduše zpomalit, nadechnout se a být chvíli sama se sebou.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#o-mne"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:text-accent"
              >
                Poznat můj příběh →
              </a>
              <IconHeart size={14} />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
