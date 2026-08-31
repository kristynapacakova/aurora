import QRCode from "qrcode";
import { parseAmount } from "./castky";

export * from "./castky";

// ─────────────────────────────────────────────────────────────────────────────
// České QR platby (formát SPD dle České bankovní asociace).
// Z čísla účtu (např. "123456789/0800") a volitelného variabilního
// symbolu se vygeneruje QR kód, který banky standardně umí načíst.
// ─────────────────────────────────────────────────────────────────────────────

function letterToDigits(text: string): string {
  return text
    .split("")
    .map((c) => (c.charCodeAt(0) - 55).toString())
    .join("");
}

function mod97(numericString: string): number {
  let remainder = 0;
  for (const ch of numericString) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  return remainder;
}

// Převede české číslo účtu ("123456789/0800" nebo "19-123456789/0800") na IBAN.
export function czechAccountToIban(accountNumber: string): string | null {
  const match = accountNumber.trim().match(/^(?:(\d{1,6})-)?(\d{1,10})\/(\d{4})$/);
  if (!match) return null;
  const [, prefixRaw, numberRaw, bankCode] = match;
  const prefix = (prefixRaw ?? "0").padStart(6, "0");
  const number = numberRaw.padStart(10, "0");
  const bban = bankCode + prefix + number; // 20 číslic

  const rearranged = bban + letterToDigits("CZ") + "00";
  const checkDigits = String(98 - mod97(rearranged)).padStart(2, "0");
  return `CZ${checkDigits}${bban}`;
}

// Zpráva pro příjemce ve formátu SPD: bez diakritiky (banky ji různě
// komolí), bez hvězdičky (odděluje pole) a nejvýš 60 znaků.
export function ocistitZpravuProPrijemce(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 .,\-/]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

function buildSpdString({
  iban,
  amount,
  vs,
  zprava,
}: {
  iban: string;
  amount?: number | null;
  vs?: string;
  zprava?: string;
}): string {
  const parts = ["SPD*1.0", `ACC:${iban}`];
  if (amount) parts.push(`AM:${amount.toFixed(2)}`);
  parts.push("CC:CZK");
  const vsDigits = (vs ?? "").replace(/\D/g, "").slice(0, 10);
  if (vsDigits) parts.push(`X-VS:${vsDigits}`);
  const msg = ocistitZpravuProPrijemce(zprava ?? "");
  if (msg) parts.push(`MSG:${msg}`);
  return parts.join("*");
}

// Vygeneruje QR kód (jako data: URL) pro platbu pobytu. Vrací null, když
// číslo účtu chybí nebo nemá platný tvar.
export async function generatePlatebniQr({
  cisloUctu,
  cena,
  castka,
  variabilniSymbol,
  zpravaProPrijemce,
}: {
  cisloUctu: string;
  cena?: string;
  // Konkrétní částka (třeba záloha) má přednost před vyčítáním z textu ceny.
  castka?: number | null;
  variabilniSymbol?: string;
  // Poznámka, která se v bance předvyplní — jméno a příjmení plátce, aby šla
  // platba spárovat i tehdy, když se variabilní symbol cestou ztratí.
  zpravaProPrijemce?: string;
}): Promise<string | null> {
  if (!cisloUctu) return null;
  const iban = czechAccountToIban(cisloUctu);
  if (!iban) return null;

  const amount = castka ?? (cena ? parseAmount(cena) : null);
  const spd = buildSpdString({
    iban,
    amount,
    vs: variabilniSymbol,
    zprava: zpravaProPrijemce,
  });

  return QRCode.toDataURL(spd, { margin: 1, width: 300 });
}
