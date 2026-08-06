// Nepovinný souhlas s odběrem novinek, který je u všech veřejných formulářů
// (kontakt, dotaz/objednávka u pobytu, čekací listina, dárkový poukaz).
//
// Důležité: e-mail se do newsletteru ukládá JEN když návštěvnice zaškrtne
// políčko. Automatické přidávání všech, kdo přes web napíšou, by bylo
// v rozporu s GDPR (souhlas musí být aktivní a dobrovolný) i s vlastními
// zásadami ochrany osobních údajů na webu.
export const NEWSLETTER_FIELD = "chceNovinky";

export const NEWSLETTER_LABEL =
  "Chci e-mailem dostávat aktuální informace o lekcích, novinkách a pobytech";

export function wantsNewsletter(body: Record<string, unknown>): boolean {
  return body[NEWSLETTER_FIELD] === true;
}
