// ─────────────────────────────────────────────────────────────────────────────
// Česká typografie: krátké předložky a spojky nesmí zůstat samy na konci
// řádku. Funkce nbsp() za ně vloží nezalomitelnou mezeru (U+00A0).
// ─────────────────────────────────────────────────────────────────────────────

const SHORT_WORDS = [
  // jednopísmenné předložky a spojky
  "a", "i", "k", "o", "s", "u", "v", "z",
  // dvoupísmenné předložky
  "na", "do", "od", "po", "za", "ze", "ke", "ku", "se", "ve",
  // trojpísmenné předložky
  "pro", "před", "pod", "nad", "bez", "při",
  // krátké spojky
  "až", "že", "ať", "či", "než",
];

const RE = new RegExp(
  `(^|[\\s\\u00A0(„‚])(${SHORT_WORDS.join("|")}) `,
  "gi"
);

export function nbsp(text: string): string {
  let out = text;
  // dvojí průchod kvůli řetězení („a v klidu“ → obě mezery)
  for (let i = 0; i < 2; i++) {
    out = out.replace(RE, (_m, pre: string, word: string) => `${pre}${word}\u00A0`);
  }
  return out;
}
