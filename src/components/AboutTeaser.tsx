import Image from "next/image";
import FadeUp from "./FadeUp";
import { IconLeafBranch, IconHeart } from "./BrandIcons";
import { nbsp } from "@/lib/typo";

export default function AboutTeaser() {
  return (
    <section id="o-mne" className="bg-sand relative pt-14 pb-14 sm:pt-16 sm:pb-16">
      {/* Plynulé prolnutí z barvy předchozí sekce */}
      <div
        className="absolute inset-x-0 top-0 h-24"
        style={{ background: "linear-gradient(to bottom, #FDF6F0, transparent)" }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-line bg-cream p-6 sm:p-10 md:p-12">
        <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-16">

          {/* Fotka — vpravo, organický arch */}
          <div className="w-full md:w-[46%] md:shrink-0">
            <FadeUp delay={0.05}>
              <div className="relative h-[260px] w-full overflow-hidden photo-arch-right sm:h-[320px] md:h-[380px]">
                <Image
                  src="/o-mne.png"
                  alt="Anežka — lektorka jógy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </FadeUp>
          </div>

          {/* Text — vlevo */}
          <div className="flex-1">
          <FadeUp delay={0.15}>
            <div className="mb-6 flex items-center gap-3">
              <IconLeafBranch size={22} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Moje cesta k józe</p>
            </div>
            <blockquote className="font-serif text-xl leading-[1.3] text-ink sm:text-2xl">
              {nbsp("Jmenuji se Anežka a jóga je pro mě mnohem víc než pohyb.")}
            </blockquote>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-muted">
              {nbsp("Ve svých lekcích vytvářím prostor, kde nemusíš nic dokazovat ani zvládat dokonale. Můžeš jednoduše zpomalit, nadechnout se a být chvíli sama se sebou.")}
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
        </div>
      </div>
    </section>
  );
}
