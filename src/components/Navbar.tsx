"use client";

import { useState } from "react";

const links = [
  { href: "#o-mne", label: "O mně" },
  { href: "#lekce", label: "Lekce" },
  { href: "#cenik", label: "Ceník" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-line">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="font-serif text-2xl tracking-wide">
          Klára&nbsp;Jóga
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-accent-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-sm uppercase tracking-widest"
          onClick={() => setOpen((v) => !v)}
          aria-label="Otevřít menu"
        >
          {open ? "Zavřít" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden flex flex-col items-center gap-4 pb-6 text-sm uppercase tracking-widest">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-accent-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
