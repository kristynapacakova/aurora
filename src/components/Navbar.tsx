"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { USCREEN } from "@/lib/config";

const MENU_ITEMS = [
  { label: "O mně",        href: "#o-mne" },
  { label: "Lekce",        href: "#lekce" },
  { label: "Online studio",href: USCREEN.signup, external: true },
  { label: "Retreaty",     href: "#retreaty" },
  { label: "Akce pro ženy",href: "#akce" },
  { label: "E-shop",       href: "#",    disabled: true },
  { label: "Kontakt",      href: "#kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10">
        <a href="#hero" onClick={() => setOpen(false)}>
          {/* celé logo na md+, jen značka A na mobilu */}
          <Image src="/logo.svg" alt="Aurora Yoga" width={96} height={96} priority className="hidden md:block" />
          <Image src="/logo-mark.svg" alt="Aurora Yoga" width={52} height={52} priority className="block md:hidden" />
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="relative z-[60] flex flex-col gap-[7px] p-2"
          aria-label="Menu"
        >
          <span className={`block h-px w-7 transition-all duration-300 ${open ? "translate-y-[10px] rotate-45 bg-cream" : "bg-ink"}`} />
          <span className={`block h-px w-7 transition-all duration-300 ${open ? "opacity-0 bg-cream" : "bg-ink"}`} />
          <span className={`block h-px w-7 transition-all duration-300 ${open ? "-translate-y-[10px] -rotate-45 bg-cream" : "bg-ink"}`} />
        </button>
      </header>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-ink"
          >
            <nav className="flex flex-col items-center gap-8">
              {MENU_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.055 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.disabled ? (
                    <span className="font-serif text-2xl tracking-[0.08em] text-cream/30 md:text-3xl">
                      {item.label}
                      <span className="ml-2 text-sm font-sans tracking-normal">(do budoucna)</span>
                    </span>
                  ) : (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                      className="font-serif text-2xl tracking-[0.08em] text-cream transition-colors duration-200 hover:text-accent md:text-3xl"
                    >
                      {item.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
