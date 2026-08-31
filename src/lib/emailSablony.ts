// ─────────────────────────────────────────────────────────────────────────────
// Šablony automatických e-mailů zákaznicím.
//
// Upravovat jde předmět, úvodní odstavce a závěr — tedy to, co je psaní.
// Tabulka s údaji (termín, částka, číslo účtu, kód) se skládá v kódu
// z reálných dat a do šablony nepatří: kdyby ji někdo přepsal, přestala by
// sedět s tím, co se opravdu stalo.
//
// V textu se dají použít zástupné značky ve složených závorkách. Neznámá
// značka se nechá být — je lepší, když si klientka ve zkušebním e-mailu
// všimne „{castka}", než aby text tiše zmizel.
// ─────────────────────────────────────────────────────────────────────────────

export type SablonaKlic =
  | "objednavka-pobytu"
  | "poukaz-platba"
  | "poukaz-kod";

export type SablonaText = {
  predmet: string;
  odstavce: string[];
  zaver: string[];
};

export type SablonaPopis = SablonaText & {
  klic: SablonaKlic;
  nazev: string;
  // Krátký popisek do menu — plné názvy jsou na tlačítka moc dlouhé.
  kratky: string;
  kdyChodi: string;
  znacky: { znacka: string; popis: string }[];
};

export const SABLONY: SablonaPopis[] = [
  {
    klic: "objednavka-pobytu",
    nazev: "Potvrzení objednávky pobytu",
    kratky: "Objednávka pobytu",
    kdyChodi: "Hned po odeslání závazné objednávky pobytu.",
    predmet: "🌿 Potvrzení objednávky — {pobyt}",
    odstavce: [
      "Ahoj {jmeno}, děkujeme za objednávku pobytu {pobyt}.",
      "Jakmile platbu uvidíme na účtu, ozveme se ti s potvrzením a máš místo závazně rezervované.",
    ],
    zaver: ["Kdyby cokoliv, stačí na tenhle e-mail odpovědět."],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno zákaznice" },
      { znacka: "{pobyt}", popis: "název pobytu" },
      { znacka: "{castka}", popis: "částka k úhradě" },
    ],
  },
  {
    klic: "poukaz-platba",
    nazev: "Dárkový poukaz — platební údaje",
    kratky: "Poukaz — platba",
    kdyChodi: "Hned po objednání poukazu, ještě před zaplacením.",
    predmet: "🎁 Dárkový poukaz — platební údaje ({castka})",
    odstavce: [
      "Ahoj {jmeno}, poukaz máme připravený. Zbývá ho uhradit.",
      "Jakmile platbu uvidíme na účtu, pošleme ti e-mailem kód poukazu.",
    ],
    zaver: [
      "V příloze je QR kód pro platbu.",
      "Kdyby cokoliv, stačí na tenhle e-mail odpovědět.",
    ],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno kupujícího" },
      { znacka: "{castka}", popis: "hodnota poukazu" },
    ],
  },
  {
    klic: "poukaz-kod",
    nazev: "Dárkový poukaz — kód po zaplacení",
    kratky: "Poukaz — kód",
    kdyChodi: "Ve chvíli, kdy poukaz označíš v administraci jako zaplacený.",
    predmet: "✨ Tvůj dárkový poukaz {kod}",
    odstavce: [
      "Ahoj {jmeno}, platbu máme, díky!",
      "Tady je kód poukazu — stačí ho zadat v objednávce pobytu.",
    ],
    zaver: [
      "Poukaz jde vyčerpat i po částech — co se nevyužije, zůstane na příště. Platnost je 6 měsíců.",
      "Kdyby cokoliv, stačí na tenhle e-mail odpovědět.",
    ],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno kupujícího" },
      { znacka: "{kod}", popis: "kód poukazu" },
      { znacka: "{castka}", popis: "hodnota poukazu" },
      { znacka: "{plati_do}", popis: "datum platnosti" },
    ],
  },
];

export function vychoziSablona(klic: SablonaKlic): SablonaPopis {
  const s = SABLONY.find((s) => s.klic === klic);
  if (!s) throw new Error(`Neznámá šablona: ${klic}`);
  return s;
}

// Dosadí hodnoty za značky. Prázdná hodnota značku nechá být — v textu je
// pak vidět, že se něco nedoplnilo.
export function dosad(text: string, hodnoty: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (cela, klic: string) => hodnoty[klic] || cela);
}

export function dosadDoRadku(radky: string[], hodnoty: Record<string, string>): string[] {
  return radky.map((r) => dosad(r, hodnoty)).filter((r) => r.trim().length > 0);
}
