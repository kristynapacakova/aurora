import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";
import { IconSparkle, IconSun, IconLeafBranch } from "./BrandIcons";

const SERVICES = [
  {
    id: "lekce",
    bg: "bg-[#FCF4F1]",
    fill: "#FCF4F1",
    prevFill: null,
    wave: "M0,64 C480,124 960,4 1440,64 L1440,128 L0,128 Z",
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
    prevFill: "#FCF4F1",
    wave: "M0,64 C480,124 960,4 1440,64 L1440,128 L0,128 Z",
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
    photo: "/studio.jpg",
    alt: "Online studio",
    photoLeft: false,
  },
  {
    id: "retreaty",
    bg: "bg-[#FDF6F0]",
    fill: "#FDF6F0",
    prevFill: "#FBE9DE",
    wave: "M0,64 C480,124 960,4 1440,64 L1440,128 L0,128 Z",
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
      {/* ── Střídající se sekce ── */}
      {SERVICES.map((s) => (
        <section key={s.id} id={s.id} className={`${s.bg} relative pt-28 pb-32 sm:pt-36 sm:pb-40`}>
          <div className="mx-auto max-w-6xl px-6">
            <FadeUp>
              <div
                className={`flex flex-col items-center gap-8 md:gap-16 ${
                  s.photoLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Foto — organický arch */}
                <div
                  className={`relative h-[260px] w-full shrink-0 overflow-hidden sm:h-[320px] md:h-[380px] md:w-[46%] ${
                    s.photoLeft ? "photo-arch-left" : "photo-arch-right"
                  }`}
                >
                  <Image
                    src={s.photo}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-1 flex-col">
                  <div className="mb-3 flex items-center gap-3">
                    {s.icon}
                    <span className="text-xs uppercase tracking-[0.3em] text-accent">
                      {s.title}
                    </span>
                  </div>

                  <h3 className="mb-4 font-allura text-3xl text-ink sm:text-4xl">
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
          <div className="absolute inset-x-0 z-10 h-32" style={{ top: '-64px' }}>
            <svg viewBox="0 0 1440 128" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              {s.prevFill && <path d="M0,64 C480,124 960,4 1440,64 L1440,0 L0,0 Z" fill={s.prevFill} />}
              <path d={s.wave} fill={s.fill} />
            </svg>
          </div>
        </section>
      ))}
    </>
  );
}
