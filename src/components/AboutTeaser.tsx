import Image from "next/image";
import { IconLeafBranch, IconWave } from "./BrandIcons";
import { nbsp } from "@/lib/typo";

type Panel = {
  photo: string;
  eyebrow: string;
  body: string;
};

const PANELS: Panel[] = [
  {
    photo: "/anezka-cesta.png",
    eyebrow: "Moje cesta k józe",
    body: "Jmenuji se Anežka a jóga je pro mě mnohem víc než pohyb. Vytvářím prostor, kde nemusíš nic dokazovat ani zvládat dokonale.",
  },
  {
    photo: "/anezka-online.png",
    eyebrow: "Proč jsem začala učit online",
    body: "Online lekce vznikly z potřeby být blízko i těm, které se ke mně nedostanou na podložku osobně. Stačí pár minut jen pro sebe.",
  },
  {
    photo: "/anezka-pobyty.png",
    eyebrow: "Proč pořádám pobyty",
    body: "Pobyty jsou moje srdcovka — čas, kdy si na pár dní odložíme role, které běžně hrajeme, a jsme konečně jen samy sebou.",
  },
];

export default function AboutTeaser() {
  return (
    <section id="o-mne" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-accent">O mně</span>
        </div>
        <p className="font-allura mb-12 text-4xl text-ink sm:text-5xl">{nbsp("Poznej můj příběh")}</p>
        <div className="grid w-full grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
          {PANELS.map((panel, i) => (
            <div key={panel.eyebrow} className="relative flex flex-col items-center text-center">
              <div
                className="relative w-[170px] shrink-0 sm:w-[198px]"
                style={{ aspectRatio: "684 / 842" }}
              >
                <Image
                  src={panel.photo}
                  alt={panel.eyebrow}
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-105"
                  sizes="198px"
                  priority={i === 0}
                />
              </div>
              {i < PANELS.length - 1 && (
                <IconWave
                  width={44}
                  height={10}
                  className="pointer-events-none absolute right-0 top-[122px] z-10 hidden -translate-y-1/2 translate-x-1/2 text-muted/70 sm:block"
                />
              )}

              <div className="mt-5 flex items-center gap-2">
                <IconLeafBranch size={14} className="text-accent-d" />
                <p className="text-[11px] uppercase tracking-[0.25em] text-accent-d">{nbsp(panel.eyebrow)}</p>
              </div>
              <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-ink">
                {nbsp(panel.body)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
