import { getDarkovyPoukazByKod, type DarkovyPoukaz } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
// Ověření dárkového poukazu. Používá to jak endpoint, na který se ptá
// formulář při zadání kódu, tak odeslání objednávky — proto je logika na
// jednom místě: kdyby si prohlížeč slevu přepsal, server ji spočítá znovu.
// ─────────────────────────────────────────────────────────────────────────────

export type PoukazChyba =
  | "neexistuje"
  | "nezaplaceno"
  | "propadly"
  | "vycerpany";

export const POUKAZ_HLASKY: Record<PoukazChyba, string> = {
  neexistuje: "Takový kód neznáme. Zkontroluj prosím, jestli je opsaný správně.",
  nezaplaceno: "Tenhle poukaz zatím nemáme označený jako zaplacený. Ozvi se nám prosím.",
  propadly: "Platnost tohohle poukazu už bohužel vypršela.",
  vycerpany: "Tenhle poukaz už je vyčerpaný.",
};

export type OverenyPoukaz =
  | { ok: true; poukaz: DarkovyPoukaz; zustatek: number }
  | { ok: false; duvod: PoukazChyba };

export function jePoPlatnosti(platiDo: string | null): boolean {
  if (!platiDo) return false;
  // Porovnáváme jen datum, ne čas — poukaz platí celý poslední den.
  const dnes = new Date();
  const den = new Date(dnes.getFullYear(), dnes.getMonth(), dnes.getDate());
  return new Date(platiDo) < den;
}

export async function overitPoukaz(kod: string): Promise<OverenyPoukaz> {
  const cisty = kod.trim();
  if (!cisty) return { ok: false, duvod: "neexistuje" };

  const poukaz = await getDarkovyPoukazByKod(cisty);
  if (!poukaz) return { ok: false, duvod: "neexistuje" };
  if (!poukaz.zaplaceno) return { ok: false, duvod: "nezaplaceno" };
  if (jePoPlatnosti(poukaz.plati_do)) return { ok: false, duvod: "propadly" };
  if (poukaz.zustatek_kc <= 0) return { ok: false, duvod: "vycerpany" };

  return { ok: true, poukaz, zustatek: poukaz.zustatek_kc };
}
