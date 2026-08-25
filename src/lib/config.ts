// ─────────────────────────────────────────────────────────────────────────────
// USCREEN ODKAZY — vyplňte zde vaše reálné URL adresy z Uscreen platformy
// ─────────────────────────────────────────────────────────────────────────────
export const USCREEN = {
  // Hlavní stránka vašeho Uscreen kanálu
  home: "https://aurora.uscreen.io",

  // Registrační stránka (nové členství)
  signup: "https://aurora.uscreen.io/sign_up",

  // Přihlašovací stránka (stávající členové)
  login: "https://aurora.uscreen.io/sign_in",

  // Stránka s ceníkem/plány přímo v Uscreen (volitelné)
  plans: "https://aurora.uscreen.io/plans",
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
