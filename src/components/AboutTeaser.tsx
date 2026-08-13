import Image from "next/image";
import Link from "next/link";
import { IconLeafBranch, IconWave } from "./BrandIcons";
import { nbsp } from "@/lib/typo";

type Panel = {
  photo: string;
  eyebrow: string;
  body: string[];
};

const PANELS: Panel[] = [
  {
    photo: "/anezka-cesta.png",
    eyebrow: "Moje cesta k józe",
    body: [
      "Jmenuji se Anežka a jóga změnila způsob, jakým žiju.",
      "Začínala jsem sama doma, s touhou cítit se lépe ve svém těle. Postupně jsem ale zjistila, že jóga není jen o pohybu. Je o zastavení, dechu a návratu k sobě.",
      "Dnes vytvářím prostor, kde můžeš na chvíli zpomalit, nadechnout se a být sama sebou.",
      // Nezlomitelná mezera před srdíčkem, ať nespadne samo na další řádek.
      "Stačí přijít taková, jaká právě jsi. ♡",
    ],
  },
  {
    photo: "/anezka-online.png",
    eyebrow: "Proč jsem začala učit online",
    body: [
      "Ne každá žena má možnost přijít na lekci osobně.",
      "Právě proto vzniklo online studio.",
      "Abys mohla rozložit podložku doma, zapálit si svíčku a dopřát si chvíli jen pro sebe – kdykoliv budeš potřebovat.",
      "Protože někdy stačí i dvacet minut, aby se celý den změnil.",
    ],
  },
  {
    photo: "/anezka-pobyty.png",
    eyebrow: "Proč pořádám pobyty",
    body: [
      "Pobyty jsou pro mě víc než jen víkend s jógou.",
      "Jsou to dny, kdy na chvíli zpomalíme, odložíme všechny role a znovu uslyšíme samy sebe.",
      "Vznikají nová přátelství, sdílíme smích, ticho i společné chvíle.",
    ],
  },
];

export default function AboutTeaser() {
  return (
    <section id="o-mne" className="bg-cream py-20 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6">
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
              <div className="mt-3 flex max-w-[26ch] flex-col gap-3 text-sm leading-relaxed text-ink">
                {panel.body.map((odstavec) => (
                  <p key={odstavec}>{nbsp(odstavec)}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Menu vede na /o-mne, tahle sekce by jinak nikam nepokračovala. */}
        <Link
          href="/o-mne"
          className="mt-14 inline-flex max-w-full items-center gap-2 rounded-full border border-ink/30 px-7 py-3 text-center text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-accent hover:text-accent"
        >
          {nbsp("Zajímá tě celý můj příběh? Přečti si ho tady →")}
        </Link>
      </div>
    </section>
  );
}
