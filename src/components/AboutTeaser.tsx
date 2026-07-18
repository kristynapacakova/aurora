"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconLeafBranch, IconHeart, IconWave } from "./BrandIcons";
import { USCREEN } from "@/lib/config";
import { nbsp } from "@/lib/typo";

type Panel = {
  photo: string;
  eyebrow: string;
  body: string;
  cta: { label: string; href: string; external?: boolean };
};

const PANELS: Panel[] = [
  {
    photo: "/anezka-portret.jpg",
    eyebrow: "Moje cesta k józe",
    body: "Jmenuji se Anežka a jóga je pro mě mnohem víc než pohyb. Vytvářím prostor, kde nemusíš nic dokazovat ani zvládat dokonale.",
    cta: { label: "Přidej se k mé cestě →", href: USCREEN.signup, external: true },
  },
  {
    photo: "/studio.jpg",
    eyebrow: "Proč jsem začala učit online",
    body: "Online lekce vznikly z potřeby být blízko i těm, které se ke mně nedostanou na podložku osobně. Stačí pár minut jen pro sebe.",
    cta: { label: "Vstoupit do online studia →", href: USCREEN.signup, external: true },
  },
  {
    photo: "/pobyty-skupina.jpg",
    eyebrow: "Proč pořádám pobyty",
    body: "Pobyty jsou moje srdcovka — čas, kdy si na pár dní odložíme role, které běžně hrajeme, a jsme konečně jen samy sebou.",
    cta: { label: "Prohlédnout pobyty →", href: "/pobyty" },
  },
];

export default function AboutTeaser() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        if (wrap) {
          const rect = wrap.getBoundingClientRect();
          const total = wrap.offsetHeight - window.innerHeight;
          const scrolled = -rect.top;
          const progress = Math.min(1, Math.max(0, scrolled / total));
          const idx = Math.min(PANELS.length - 1, Math.floor(progress * PANELS.length));
          setActive(idx);
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: "250vh" }}>
      <section id="o-mne" className="sticky top-0 flex h-screen items-center overflow-hidden bg-cream">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-16">
        <div className="mb-4 flex items-center gap-3">
          <IconHeart size={14} className="text-accent" />
          <span className="text-xs uppercase tracking-[0.3em] text-accent">O mně</span>
        </div>
        <p className="font-allura text-4xl text-ink sm:text-5xl">{nbsp("Poznej můj příběh")}</p>
        <IconWave width={110} height={14} className="mb-12 mt-4 text-muted" />
        <div className="grid w-full grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
          {PANELS.map((panel, i) => {
            const isActive = i === active;
            return (
              <div key={panel.eyebrow} className="flex flex-col items-center text-center">
                <div className="relative h-[190px] w-[190px] shrink-0 sm:h-[220px] sm:w-[220px]">
                  {/* Stín pod fotkou — jediný náznak, která je právě aktivní */}
                  <div
                    className="absolute inset-x-4 -bottom-4 h-10 rounded-full bg-ink/55 blur-lg transition-opacity duration-700 ease-in-out"
                    style={{ opacity: isActive ? 1 : 0 }}
                  />
                  <div className="relative h-full w-full overflow-hidden rounded-t-[95px] sm:rounded-t-[110px]">
                    <Image
                      src={panel.photo}
                      alt={panel.eyebrow}
                      fill
                      className="object-cover"
                      sizes="220px"
                      priority={i === 0}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <IconLeafBranch size={14} className="text-accent-d" />
                  <p className="text-[11px] uppercase tracking-[0.25em] text-accent-d">{nbsp(panel.eyebrow)}</p>
                </div>
                <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-ink">
                  {nbsp(panel.body)}
                </p>
                <Link
                  href={panel.cta.href}
                  target={panel.cta.external ? "_blank" : undefined}
                  rel={panel.cta.external ? "noopener noreferrer" : undefined}
                  className="mt-5 inline-block rounded-full bg-gradient-aurora px-6 py-2.5 text-[10px] uppercase tracking-[0.18em] text-ink transition-opacity duration-200 hover:opacity-90"
                >
                  {nbsp(panel.cta.label)}
                </Link>
              </div>
            );
          })}
        </div>
        </div>

        {/* Tečky — jen dokud je sekce přilepená na obrazovce */}
        <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2.5">
          {PANELS.map((panel, i) => (
            <span
              key={panel.eyebrow}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                i === active ? "bg-accent" : "bg-ink/20"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
