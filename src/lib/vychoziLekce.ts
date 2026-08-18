import type { Lekce } from "./db";

// ─────────────────────────────────────────────────────────────────────────────
// Výchozí rozvrh zapsaný napevno v kódu — skutečné termíny, které klientka
// aktuálně učí. Ukazuje se na stránce Lekce vždy, když v administraci není
// zadaná ani jedna lekce (což platí i dokud není připojená databáze).
//
// Jakmile klientka v administraci přidá vlastní lekci, tenhle seznam se
// přestane používat úplně a rozvrh na webu řídí jen administrace.
//
// Id jsou jen pro React klíče, na nic dalšího se nepoužívají — tyhle položky
// v databázi neexistují a v administraci se proto neobjeví.
// ─────────────────────────────────────────────────────────────────────────────

export const VYCHOZI_LEKCE: Lekce[] = [
  {
    id: -1,
    den: "Úterý",
    misto: "Maršovice",
    cas: "18:30 – 19:30",
    poznamka: "",
    zverejneno: true,
    created_at: "",
  },
  {
    id: -2,
    den: "Středa",
    misto: "Svratka",
    cas: "18:00 – 19:00",
    poznamka: "",
    zverejneno: true,
    created_at: "",
  },
  {
    id: -3,
    den: "Čtvrtek",
    misto: "Sněžné",
    cas: "18:30 – 19:30",
    poznamka: "",
    zverejneno: true,
    created_at: "",
  },
];
