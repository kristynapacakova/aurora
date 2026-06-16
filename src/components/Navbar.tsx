"use client";

import { useEffect, useState } from "react";
import { USCREEN } from "@/lib/config";

const NAV_LINKS = [
  { href: "#o-mne", label: "O mně" },
  { href: "#studio", label: "Lekce" },
  { href: "#cenik", label: "Ceník" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="#hero"
          className="font-serif text-2xl tracking-[0.12em] text-ink"
        >
          AURORA
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={USCREEN.login}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-full border border-ink px-5 py-2 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:bg-ink hover:text-cream md:inline-flex"
        >
          Vstoupit do studia
        </a>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col items-center gap-6 bg-cream/95 pb-8 pt-4 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] text-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href={USCREEN.login}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ink"
          >
            Vstoupit do studia
          </a>
        </div>
      )}
    </header>
  );
}
