import type { Priloha } from "./email";

// QR kód generujeme jako data: URL (tak ho potřebuje web). Do e-mailu ale
// obrázek vložený přes data: nepatří — Gmail a spol. ho zahodí — takže
// z něj uděláme běžnou přílohu.
export function qrPriloha(dataUrl: string | null, filename: string): Priloha[] {
  if (!dataUrl) return [];
  const base64 = dataUrl.split(",")[1];
  if (!base64) return [];
  return [{ filename, content: base64 }];
}

// Grafika dárkového poukazu jako příloha. V e-mailu je i vložená obrázkem,
// jenže poštovní programy stahování obrázků často blokují — jako soubor
// dorazí vždycky a jde rovnou vytisknout nebo přeposlat obdarovanému.
export async function prilohaZUrl(
  url: string | null | undefined,
  zaklad: string
): Promise<Priloha[]> {
  if (!url) return [];
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const buffer = Buffer.from(await res.arrayBuffer());
    // Přílohy chodí přes JSON, takže moc velký soubor radši vynecháme —
    // e-mail se pak aspoň odešle bez ní.
    if (buffer.byteLength > 4_000_000) return [];
    const pripona = (url.split("?")[0].match(/\.(png|jpe?g|webp|gif|pdf)$/i)?.[1] ?? "png").toLowerCase();
    return [{ filename: `${zaklad}.${pripona}`, content: buffer.toString("base64") }];
  } catch {
    // Bez přílohy se e-mail pošle dál — obrázek je v něm i odkazem.
    return [];
  }
}
