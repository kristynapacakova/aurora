// ─────────────────────────────────────────────────────────────────────────────
// Počítání s cenami pobytů — schválně bez závislostí, aby si tenhle soubor
// mohl načíst i formulář v prohlížeči. (V platba.ts je knihovna na QR kódy,
// kterou by si jinak stáhla každá návštěvnice detailu pobytu.)
// ─────────────────────────────────────────────────────────────────────────────

// Zkusí z volného textu ceny ("4 900 Kč", "od 3 500,50 Kč") vytáhnout částku.
// Vrací null, když se nepovede — v tom případě QR částku prostě neobsahuje
// a zákaznice ji do bankovní aplikace zadá ručně (bezpečnější než hádat).
export function parseAmount(cena: string): number | null {
  const match = cena.replace(/\s/g, "").match(/(\d+)(?:[.,](\d{1,2}))?/);
  if (!match) return null;
  const whole = match[1];
  const decimals = (match[2] ?? "00").padEnd(2, "0");
  return Number(`${whole}.${decimals}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Rozpad ceny pobytu na celou částku a zálohu.
// Záloha se nabízí jen tehdy, když je v administraci vyplněné procento a
// z ceny (volný text jako „4 900 Kč") jde vyčíst číslo. Když ne, zůstane
// jediná možnost — zaplatit celou částku.
// ─────────────────────────────────────────────────────────────────────────────

export type ZpusobPlatby = "cela" | "zaloha";

export type RozpadPlatby = {
  celkem: number | null;
  procento: number;
  zaloha: number | null;
  doplatek: number | null;
};

export function rozpadPlatby({
  cena,
  zalohaProcento,
}: {
  cena?: string;
  zalohaProcento?: number;
}): RozpadPlatby {
  const celkem = cena ? parseAmount(cena) : null;
  const procento = Math.round(zalohaProcento ?? 0);
  // Nula i sto procent znamenají „žádná dělená platba" — sto procent by byla
  // záloha ve výši celé ceny, což je jen matoucí druhé tlačítko.
  if (!celkem || procento <= 0 || procento >= 100) {
    return { celkem, procento: 0, zaloha: null, doplatek: null };
  }
  const zaloha = Math.round((celkem * procento) / 100);
  return { celkem, procento, zaloha, doplatek: Math.round(celkem - zaloha) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cena pobytu po uplatnění dárkového poukazu.
// Poukaz se odečítá z celé ceny a teprve ze zbytku se počítá případná
// záloha — jinak by nebylo jasné, jestli se sleva vztahuje na zálohu,
// nebo na doplatek.
// ─────────────────────────────────────────────────────────────────────────────
export type RozpadSPoukazem = RozpadPlatby & {
  sleva: number;
  // Kolik zbývá zaplatit po odečtení poukazu.
  poSleve: number;
};

export function rozpadSPoukazem({
  cena,
  zalohaProcento,
  zustatekPoukazu,
}: {
  cena?: string;
  zalohaProcento?: number;
  zustatekPoukazu?: number;
}): RozpadSPoukazem {
  const zaklad = rozpadPlatby({ cena, zalohaProcento });
  const celkem = zaklad.celkem ?? 0;
  const sleva = Math.min(Math.max(zustatekPoukazu ?? 0, 0), Math.round(celkem));
  const poSleve = Math.round(celkem) - sleva;

  if (sleva <= 0) {
    return { ...zaklad, sleva: 0, poSleve: Math.round(celkem) };
  }
  // Zálohu má smysl nabízet jen z toho, co po poukazu zbylo.
  if (zaklad.procento <= 0 || poSleve <= 0) {
    return { ...zaklad, zaloha: null, doplatek: null, sleva, poSleve };
  }
  const zaloha = Math.round((poSleve * zaklad.procento) / 100);
  return { ...zaklad, zaloha, doplatek: poSleve - zaloha, sleva, poSleve };
}

// Vlastní formátování místo Intl — server (Node) a prohlížeč se u mezery
// v tisících liší a React by hlásil nesoulad při hydrataci.
export function formatKc(castka: number): string {
  const cele = Math.round(castka)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${cele}\u00A0Kč`;
}
