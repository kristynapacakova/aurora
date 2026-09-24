// ─────────────────────────────────────────────────────────────────────────────
// USCREEN ODKAZY
//
// Výchozí adresy online studia. Klientka je může přebít v administraci
// (Nastavení → Uscreen odkazy) — co je vyplněné tam, má přednost.
//
// Teď studio běží na adrese od Uscreenu. Až se přejde na vlastní doménu
// (studio.aurorayoga.cz, což je placená funkce), stačí přepsat tuhle
// jednu konstantu.
// ─────────────────────────────────────────────────────────────────────────────
const USCREEN_DOMENA = "https://aurorasmembership-66e7.uscreen.io";

export const USCREEN = {
  // Hlavní stránka online studia
  home: USCREEN_DOMENA,

  // Registrační stránka (nové členství)
  signup: `${USCREEN_DOMENA}/sign_up`,

  // Přihlašovací stránka (stávající členky)
  login: `${USCREEN_DOMENA}/sign_in`,

  // Stránka s ceníkem/plány přímo v Uscreenu
  plans: `${USCREEN_DOMENA}/plans`,
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
