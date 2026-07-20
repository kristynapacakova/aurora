"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Nastaveni } from "@/lib/db";

const SiteSettingsContext = createContext<Nastaveni | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: Nastaveni;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): Nastaveni {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    throw new Error("useSiteSettings musí být volané uvnitř SiteSettingsProvider.");
  }
  return ctx;
}
