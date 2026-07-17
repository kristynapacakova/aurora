"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { USCREEN } from "@/lib/config";

type MenuItem = { label: string; href: string; external?: boolean };

const MENU_ITEMS: MenuItem[] = [
  { label: "O mně", href: "/#o-mne" },
  { label: "Lekce", href: "/#lekce" },
  { label: "Online studio", href: USCREEN.signup, external: true },
  { label: "Pobyty pro ženy", href: "/pobyty" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/#kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          {/* Logo vlevo */}
          <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
            <Image src="/logo.png" alt="AURORA jóga" width={140} height={110} className="h-16 w-auto md:h-20" priority />
          </Link>

          {/* Menu vpravo (jen desktop) */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
            {MENU_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-xs uppercase tracking-[0.14em] text-muted whitespace-nowrap transition-colors duration-200 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Hamburger — jen mobil */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] flex flex-col gap-[7px] p-2 lg:hidden"
            aria-label="Menu"
          >
            <span className={`block h-px w-7 transition-all duration-300 ${open ? "translate-y-[10px] rotate-45 bg-cream" : "bg-ink"}`} />
            <span className={`block h-px w-7 transition-all duration-300 ${open ? "opacity-0 bg-cream" : "bg-ink"}`} />
            <span className={`block h-px w-7 transition-all duration-300 ${open ? "-translate-y-[10px] -rotate-45 bg-cream" : "bg-ink"}`} />
          </button>
        </div>
      </header>

      {/* Fullscreen overlay — jen mobil */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink lg:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {MENU_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.055 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setOpen(false)}
                    className="font-serif text-[20px] tracking-[0.08em] text-cream transition-colors duration-200 hover:text-accent md:text-[26px]"
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
