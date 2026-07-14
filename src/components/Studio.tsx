import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";
import { IconSparkle, IconSun, IconLeafBranch, IconWave } from "./BrandIcons";

const SERVICES = [
  {
    id: "lekce",
    bg: "bg-[#FCF4F1]",
    fill: "#FCF4F1",
    wavePath: "M0,0 L1440,0 L1440,40 C1100,4 900,4 720,48 C540,92 340,92 0,56 Z",
    icon: <IconSun size={30} />,
    title: "Lekce",
    subtitle: "Potkejme se na podložce",
    body: [
      "Společné lekce jsou místem, kde můžeš na chvíli odložit každodenní starosti, věnovat pozornost svému tělu a dopřát si čas jen pro sebe.",
      "Čeká tě jemně plynoucí pohyb, vědomý dech, uvolnění i chvíle klidu. Nemusíš mít žádné předchozí zkušenosti — stačí přijít taková, jaká právě jsi.",
    ],
    cta: "Zobrazit rozvrh lekcí",
    href: "#kontakt",
    photo: "/lekce.jpeg",
    alt: "Lekce jógy",
    photoLeft: true,
  },
  {
    id: "studio",
    bg: "bg-[#FBE9DE]",
    fill: "#FBE9DE",
    wavePath: "M0,0 L1440,0 L1440,56 C1100,92 900,92 720,48 C540,4 340,4 0,40 Z",
    icon: <IconSparkle size={30} className="text-accent" />,
    title: "Online studio",
    subtitle: "Jóga kdykoliv a kdekoliv",
    body: [
      "Dopřej si čas pro sebe doma, na cestách nebo kdekoliv, kde se právě nacházíš.",
      "V online studiu najdeš lekce různých délek a zaměření — pro chvíle, kdy potřebuješ zpomalit, protáhnout tělo, načerpat energii nebo se jednoduše vrátit sama k sobě.",
      "Cvič vlastním tempem, podle své nálady a přesně tehdy, kdy ti to vyhovuje.",
    ],
    cta: "Vstoupit do online studia",
    href: USCREEN.signup,
    external: true,
    photo: "/studio.png",
    alt: "Online studio",
    photoLeft: false,
  },
  {
    id: "retreaty",
    bg: "bg-[#FDF6F0]",
    fill: "#FDF6F0",
    wavePath: "M0,0 L1440,0 L1440,40 C1100,4 900,4 720,48 C540,92 340,92 0,56 Z",
    icon: <IconLeafBranch size={30} />,
    title: "Pobyty pro ženy",
    subtitle: "Čas, který patří jen Tobě",
    body: [
      "Někdy potřebujeme na chvíli vystoupit z každodenního rytmu, změnit prostředí a dopřát si více prostoru pro sebe.",
      "Ženské jógové pobyty propojují pohyb, dech, odpočinek, přírodu, společné chvíle i čas, kdy nemusíš vůbec nic. Jsou pozvánkou ke zpomalení, načerpání nové energie a návratu k tomu, co je pro tebe důležité.",
    ],
    cta: "Objevit pobyty",
    href: "#kontakt",
    photo: "/retreaty.png",
    alt: "Pobyty pro ženy",
    photoLeft: true,
  },
];

export default function Studio() {
  return (
    <>
      {/* ── Nadpis ── */}
      <div className="relative bg-[#FBE9DE] pb-16 pt-20 text-center sm:pt-24">
        <FadeUp>
          <div className="mb-3 flex items-center justify-center gap-3">
            <IconSparkle size={11} />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Co tě čeká</span>
            <IconSparkle size={11} />
          </div>
          <h2 className="font-allura text-3xl text-ink sm:text-4xl">
            Vyber si cestu, která tě právě volá.
          </h2>
          <div className="mt-4 flex justify-center">
            <IconWave width={160} height={22} className="text-accent/50" />
          </div>
        </FadeUp>
        {/* Wave into Lekce */}
        <div className="absolute inset-x-0 z-10 h-24" style={{ bottom: '-48px' }}>
          <svg viewBox="0 0 1440 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,56 C1100,92 900,92 720,48 C540,4 340,4 0,40 Z" fill="#FBE9DE" />
          </svg>
        </div>
      </div>

      {/* ── Střídající se sekce ── */}
      {SERVICES.map((s) => (
        <section key={s.id} id={s.id} className={`${s.bg} relative pt-14 pb-14 sm:pt-20 sm:pb-20`}>
          <div className="mx-auto max-w-6xl px-6">
            <FadeUp>
              <div
                className={`grid grid-cols-1 items-center gap-6 md:gap-10 ${
                  s.photoLeft
                    ? "md:grid-cols-[2fr_3fr]"
                    : "md:grid-cols-[3fr_2fr] md:[&>*:first-child]:order-last"
                }`}
              >
                {/* Foto */}
                <div
                  className={`relative h-[180px] w-full overflow-hidden sm:h-[220px] md:h-[280px] ${
                    s.photoLeft
                      ? "rounded-tl-[2rem] rounded-br-[0.75rem]"
                      : "rounded-tr-[2rem] rounded-bl-[0.75rem]"
                  }`}
                >
                  <Image
                    src={s.photo}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <div className="mb-3 flex items-center gap-3">
                    {s.icon}
                    <span className="text-xs uppercase tracking-[0.3em] text-accent">
                      {s.title}
                    </span>
                  </div>

                  <h3 className="mb-4 font-serif text-[20px] uppercase tracking-[0.12em] text-ink sm:text-[24px]">
                    {s.subtitle}
                  </h3>

                  <div className="mb-5 flex max-w-sm flex-col gap-3">
                    {s.body.map((p, i) => (
                      <p key={i} className="text-xs leading-relaxed text-muted">
                        {p}
                      </p>
                    ))}
                  </div>

                  <a
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noopener noreferrer" : undefined}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/30 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-accent hover:text-accent"
                  >
                    {s.cta} →
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Wave divider */}
          <div className="absolute inset-x-0 z-10 h-24" style={{ bottom: '-48px' }}>
            <svg viewBox="0 0 1440 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              <path d={s.wavePath} fill={s.fill} />
            </svg>
          </div>
        </section>
      ))}
    </>
  );
}
