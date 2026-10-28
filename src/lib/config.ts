// ─────────────────────────────────────────────────────────────────────────────
// USCREEN ODKAZY
//
// Výchozí adresy online studia. Klientka je může přebít v administraci
// (Nastavení → Uscreen odkazy) — co je vyplněné tam, má přednost.
//
// Studio běží na poddoméně od Uscreenu. Vlastní doména (studio.aurorayoga.cz)
// je u Uscreenu zamčená až za tarifem Growth, který se kvůli samotné adrese
// nevyplatí — kdyby se na něj někdy přešlo, stačí přepsat tuhle jednu
// konstantu a propíše se to všude včetně výchozích hodnot v databázi.
// ─────────────────────────────────────────────────────────────────────────────
const USCREEN_DOMENA = "https://aurorayoga.uscreen.io";

export const USCREEN = {
  // Hlavní stránka online studia
  home: USCREEN_DOMENA,

  // Výběr členství. U Uscreenu je to /join — cesty /sign_up ani /plans
  // neexistují a vracejí chybovou stránku (ověřeno proklikáním 26. 10.).
  // Registrace probíhá právě tudy: žena si vybere předplatné a účet si
  // založí v témže kroku, takže sem míří i odkaz „Vstoupit do studia“.
  signup: `${USCREEN_DOMENA}/join`,

  // Přihlašovací stránka (stávající členky). Tahle cesta funguje.
  login: `${USCREEN_DOMENA}/sign_in`,

  // Ceník vede na tutéž stránku — ceny jsou až u výběru členství.
  plans: `${USCREEN_DOMENA}/join`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DOMÉNA — použitá v sitemap.xml, robots.txt a pro absolutní odkazy v metadatech
// ─────────────────────────────────────────────────────────────────────────────
export const SITE_URL = "https://www.aurorayoga.cz";

// ─────────────────────────────────────────────────────────────────────────────
// KONTAKTNÍ ÚDAJE — upravte podle potřeby
// ─────────────────────────────────────────────────────────────────────────────
export const CONTACT = {
  email: "aurora.yogaaa@gmail.com",
  instagram: "https://www.instagram.com/aurora_yogaa",
  instagramHandle: "@aurora_yogaa",
  facebook: "https://www.facebook.com/aurora.joga",
  youtube: "https://www.youtube.com/@aurora.joga",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// INSTAGRAM
//
// Prázdná adresa je záměr, ne nedodělek — klientka živý widget nechce, takže
// se v sekci Instagram zobrazuje pevná mřížka fotek z InstagramFeed.tsx.
// Kdyby si to někdy rozmyslela, stačí sem vložit adresu widgetu ze
// snapwidget.com (v kódu pro vložení atribut src="…") a feed se přepne sám.
// ─────────────────────────────────────────────────────────────────────────────
export const INSTAGRAM_WIDGET_URL = "";
