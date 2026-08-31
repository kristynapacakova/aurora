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
  | "platba-prijata"
  | "doplatek"
  | "cekaci-listina"
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
      "Platební údaje najdeš dole pod tímhle e-mailem — kdyby se platba nepovedla odeslat napoprvé nebo ji chceš poslat až později, máš je po ruce.",
      "Jakmile platbu uvidíme na účtu, ozveme se ti s potvrzením a máš místo závazně rezervované.",
    ],
    zaver: ["Kdyby cokoliv, stačí na tenhle e-mail odpovědět."],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno zákaznice" },
      { znacka: "{pobyt}", popis: "název pobytu" },
      { znacka: "{castka}", popis: "částka k úhradě" },
      { znacka: "{termin}", popis: "termín pobytu" },
    ],
  },
  {
    klic: "platba-prijata",
    nazev: "Platba dorazila — místo je rezervované",
    kratky: "Platba dorazila",
    kdyChodi: "Ve chvíli, kdy objednávku označíš v administraci jako zaplacenou.",
    predmet: "✅ Platba dorazila — {pobyt}",
    odstavce: [
      "Ahoj {jmeno}, platbu máme na účtu, díky!",
      "Místo na pobytu {pobyt} máš tím závazně rezervované. Před pobytem se ti ozvu s podrobnostmi — co si vzít s sebou a jak to bude probíhat.",
    ],
    zaver: ["Kdyby se ti cokoliv změnilo, dej mi prosím vědět co nejdřív."],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno zákaznice" },
      { znacka: "{pobyt}", popis: "název pobytu" },
      { znacka: "{termin}", popis: "termín pobytu" },
      { znacka: "{castka}", popis: "zaplacená částka" },
    ],
  },
  {
    klic: "doplatek",
    nazev: "Připomenutí doplatku",
    kratky: "Doplatek",
    kdyChodi:
      "Když u objednávky se zálohou klikneš v administraci na „Poslat výzvu k doplatku“.",
    predmet: "🌿 Doplatek pobytu — {pobyt}",
    odstavce: [
      "Ahoj {jmeno}, blíží se termín pobytu {pobyt} a zbývá doplatit zbytek ceny.",
      "Platební údaje i QR kód najdeš níž. Do poznámky pro příjemce prosím napiš svoje jméno a příjmení, ať platbu poznám.",
    ],
    zaver: ["Kdyby cokoliv, stačí na tenhle e-mail odpovědět."],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno zákaznice" },
      { znacka: "{pobyt}", popis: "název pobytu" },
      { znacka: "{termin}", popis: "termín pobytu" },
      { znacka: "{castka}", popis: "částka doplatku" },
    ],
  },
  {
    klic: "cekaci-listina",
    nazev: "Potvrzení čekací listiny",
    kratky: "Čekací listina",
    kdyChodi: "Hned po přihlášení na čekací listinu u vyprodaného pobytu.",
    predmet: "⏳ Jsi na čekací listině — {pobyt}",
    odstavce: [
      "Ahoj {jmeno}, mám tě na čekací listině na pobyt {pobyt}.",
      "Pobyt je momentálně plný. Kdyby se místo uvolnilo, ozvu se ti — a to dřív, než dám cokoliv vědět veřejně.",
    ],
    zaver: [
      "Nic teď platit nemusíš. Tenhle e-mail je jen potvrzení, že o tobě vím.",
      "Kdyby ses mezitím rozmyslela, stačí odpovědět a ze seznamu tě vyřadím.",
    ],
    znacky: [
      { znacka: "{jmeno}", popis: "jméno zájemkyně" },
      { znacka: "{pobyt}", popis: "název pobytu" },
      { znacka: "{termin}", popis: "termín pobytu" },
    ],
  },
  {
    klic: "poukaz-platba",
    nazev: "Dárkový poukaz — platební údaje",
    kratky: "Poukaz — platba",
    kdyChodi: "Hned po objednání poukazu, ještě před zaplacením.",
    predmet: "🎁 Dárkový poukaz — platební údaje ({castka})",
    odstavce: [
      "Ahoj {jmeno}, poukaz mám připravený. Zbývá ho uhradit.",
      "Jakmile platbu uvidím na účtu, pošlu ti e-mailem kód poukazu i jeho grafiku k předání.",
    ],
    zaver: [
      "V příloze je QR kód pro platbu — kdyby se ti platbu nepovedlo odeslat hned, můžeš ho použít i později.",
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
      "Ahoj {jmeno}, platbu mám, díky!",
      "Tady je poukaz i s kódem — grafiku posílám v příloze, takže ji můžeš vytisknout nebo rovnou přeposlat obdarovanému.",
      "Kód se zadává v objednávce pobytu.",
    ],
    zaver: [
      "Poukaz jde vyčerpat i po částech — co se nevyužije, zůstane na příště. Platnost je 6 měsíců.",
      "Poukaz platí na pobyty a živé lekce. Na online předplatné ho použít nejde.",
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
