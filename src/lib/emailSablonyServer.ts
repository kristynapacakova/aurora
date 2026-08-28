import { getEmailSablona } from "./db";
import {
  dosad,
  dosadDoRadku,
  vychoziSablona,
  type SablonaKlic,
  type SablonaText,
} from "./emailSablony";

// ─────────────────────────────────────────────────────────────────────────────
// Načtení šablony pro odeslání: co je upravené v administraci, přebije text
// z kódu. Prázdné pole znamená „nech původní" — jinak by omylem smazaný
// odstavec zmizel z e-mailu bez varování.
// ─────────────────────────────────────────────────────────────────────────────

function naRadky(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((r) => r.trim())
    .filter(Boolean);
}

export async function nactiSablonu(
  klic: SablonaKlic,
  hodnoty: Record<string, string>
): Promise<SablonaText> {
  const vychozi = vychoziSablona(klic);
  const ulozena = await getEmailSablona(klic).catch(() => null);

  const predmet = ulozena?.predmet?.trim() || vychozi.predmet;
  const odstavce = ulozena?.odstavce?.trim() ? naRadky(ulozena.odstavce) : vychozi.odstavce;
  const zaver = ulozena?.zaver?.trim() ? naRadky(ulozena.zaver) : vychozi.zaver;

  return {
    predmet: dosad(predmet, hodnoty),
    odstavce: dosadDoRadku(odstavce, hodnoty),
    zaver: dosadDoRadku(zaver, hodnoty),
  };
}
