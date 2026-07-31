// Bezpečné pro použití na klientu i na serveru — žádné závislosti.

// Jméno skrytého pole, které vyplní jen boti (lidem ho schováváme CSS).
// Když přijde vyplněné, request tiše zahodíme, jako by proběhl úspěšně —
// bot se tak nic nedozví a nezkusí to jinak.
export const HONEYPOT_FIELD = "weburl";

export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

// Jméno pole s časem, kdy se formulář zobrazil (Date.now() při mountu).
// Automatizované vyplňování (skripty, AI agenti) typicky odešle formulář
// během pár desítek milisekund od načtení — člověk potřebuje aspoň chvíli
// na přečtení a vyplnění. Nejde o spolehlivou identifikaci bota samu o
// sobě, ale v kombinaci s honeypotem a rate limitem výrazně zvedá laťku.
export const FORM_LOADED_FIELD = "formLoadedAt";
const MIN_FILL_TIME_MS = 1500;

export function isSubmittedTooFast(body: Record<string, unknown>): boolean {
  const value = body[FORM_LOADED_FIELD];
  const loadedAt = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(loadedAt)) return true; // chybí/neplatné = podezřelé
  const elapsed = Date.now() - loadedAt;
  return elapsed < MIN_FILL_TIME_MS;
}
