// Bezpečné pro použití na klientu i na serveru — žádné závislosti.
// Jméno skrytého pole, které vyplní jen boti (lidem ho schováváme CSS).
// Když přijde vyplněné, request tiše zahodíme, jako by proběhl úspěšně —
// bot se tak nic nedozví a nezkusí to jinak.
export const HONEYPOT_FIELD = "weburl";

export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}
