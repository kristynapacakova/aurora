// Dny v týdnu pro rozvrh lekcí. Schválně samostatný soubor bez závislostí —
// sahá sem i klientský formulář v administraci, a kdyby to bylo v db.ts,
// přitáhl by si import databázového ovladače až do prohlížeče.

export const DNY_V_TYDNU = [
  "Pondělí",
  "Úterý",
  "Středa",
  "Čtvrtek",
  "Pátek",
  "Sobota",
  "Neděle",
] as const;

export type Den = (typeof DNY_V_TYDNU)[number];

export function jeDen(hodnota: string): hodnota is Den {
  return (DNY_V_TYDNU as readonly string[]).includes(hodnota);
}

/** Neznámý den (třeba po ruční úpravě v databázi) spadne na konec seznamu. */
export function poradiDne(den: string): number {
  const i = (DNY_V_TYDNU as readonly string[]).indexOf(den);
  return i === -1 ? DNY_V_TYDNU.length : i;
}
