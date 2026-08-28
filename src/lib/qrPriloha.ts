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
