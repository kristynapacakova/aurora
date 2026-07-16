import QRCode from "qrcode";

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

function buildSpdString({
  iban,
  amount,
  vs,
}: {
  iban: string;
  amount?: number | null;
  vs?: string;
}): string {
  const parts = ["SPD*1.0", `ACC:${iban}`];
  if (amount) parts.push(`AM:${amount.toFixed(2)}`);
  parts.push("CC:CZK");
  const vsDigits = (vs ?? "").replace(/\D/g, "").slice(0, 10);
  if (vsDigits) parts.push(`X-VS:${vsDigits}`);
  return parts.join("*");
}

// Vygeneruje QR kód (jako data: URL) pro platbu pobytu. Vrací null, když
// číslo účtu chybí nebo nemá platný tvar.
export async function generatePlatebniQr({
  cisloUctu,
  cena,
  variabilniSymbol,
}: {
  cisloUctu: string;
  cena?: string;
  variabilniSymbol?: string;
}): Promise<string | null> {
  if (!cisloUctu) return null;
  const iban = czechAccountToIban(cisloUctu);
  if (!iban) return null;

  const amount = cena ? parseAmount(cena) : null;
  const spd = buildSpdString({ iban, amount, vs: variabilniSymbol });

  return QRCode.toDataURL(spd, { margin: 1, width: 300 });
}
