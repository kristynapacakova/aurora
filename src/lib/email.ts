import { Resend } from "resend";
import { SITE_URL, CONTACT } from "./config";

// ─────────────────────────────────────────────────────────────────────────────
// Odchozí e-maily.
//
// Dvě různé věci:
//   • notifikace klientce (Anežce) — na RESEND_TO_EMAIL, prostý text stačí,
//   • potvrzení zákaznici — na adresu z formuláře, v barvách webu.
//
// Odeslání nikdy nesmí shodit objednávku: když Resend není nastavený nebo
// selže, jen se to tiše přeskočí. Objednávka je v databázi a klientka ji
// vidí v administraci tak jako tak.
//
// Pozor: posílat na adresy zákaznic jde až po ověření domény v Resendu.
// Bez toho projdou jen e-maily na vlastní adresu.
// ─────────────────────────────────────────────────────────────────────────────

export type Priloha = { filename: string; content: string };

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

// Stav odesílání pro administraci. Klíč se schválně jen potvrzuje, nikdy
// nevypisuje — adresy jsou vlastní klientky, ty ukázat můžeme.
export type StavOdesilani = {
  klic: boolean;
  odesilatel: string;
  notifikace: string;
  // Odesílatel na cizí doméně (typicky gmail) je nejčastější důvod, proč
  // e-maily zákaznicím nikam nedojdou.
  odesilatelNaVlastniDomene: boolean;
};

export function stavOdesilani(domena: string): StavOdesilani {
  const odesilatel = process.env.RESEND_FROM_EMAIL ?? "";
  // Odesílatel může být i ve tvaru „Jméno <adresa>".
  const adresa = odesilatel.match(/<([^>]+)>/)?.[1] ?? odesilatel;
  return {
    klic: Boolean(process.env.RESEND_API_KEY),
    odesilatel: odesilatel ? odesilatelSJmenem(odesilatel) : "",
    notifikace: process.env.RESEND_TO_EMAIL ?? "",
    odesilatelNaVlastniDomene: adresa.toLowerCase().endsWith(`@${domena.toLowerCase()}`),
  };
}

// Zkušební e-mail z administrace. Na rozdíl od ostatních cest chybu
// nepolyká — právě kvůli ní se to tlačítko mačká.
export async function posliZkusebni(to: string): Promise<{ ok: boolean; chyba?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) return { ok: false, chyba: "Ve Vercelu chybí RESEND_API_KEY." };
  if (!from) return { ok: false, chyba: "Ve Vercelu chybí RESEND_FROM_EMAIL." };

  const obsah = {
    nadpis: "Zkušební e-mail",
    odstavce: [
      "Tohle je zkušební zpráva z administrace Aurory.",
      "Když ti dorazila, odesílání funguje a takhle uvidí potvrzení i zákaznice.",
    ],
    radky: [{ popisek: "Odesílatel:", hodnota: from }],
    "zavěr": ["Tenhle e-mail nikam dál nechodí, posílá se jen na adresu, kterou jsi zadala."],
  };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: odesilatelSJmenem(from),
      to,
      replyTo: adresaKlientky() ?? undefined,
      subject: "✨ Zkušební e-mail z Aurory",
      text: [obsah.nadpis, "", ...obsah.odstavce].join("\n"),
      html: sablona(obsah),
    });
    if (error) return { ok: false, chyba: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, chyba: e instanceof Error ? e.message : "Odeslání se nepovedlo." };
  }
}

export function adresaKlientky(): string | null {
  return process.env.RESEND_TO_EMAIL || null;
}

// Odesílací adresa je jen technická (schránka na doméně nemusí existovat),
// takže „stačí odpovědět" smí e-mail tvrdit jen tehdy, když je nastavená
// adresa pro odpovědi. Jinak radši rovnou napíšeme, kam psát.
export function vetaProOdpoved(): string {
  const kam = adresaKlientky();
  return kam
    ? "Kdyby cokoliv, stačí na tenhle e-mail odpovědět."
    : `Kdyby cokoliv, napiš nám na ${CONTACT.email}.`;
}

// Jméno odesílatele — bez něj ukazuje pošta jen část adresy před zavináčem
// („kontakt"), což vypadá jako od cizího. Když si někdo do proměnné napíše
// vlastní jméno ve tvaru „Jméno <adresa>", nechá se mu.
export const JMENO_ODESILATELE = "Aurora jóga";

function odesilatelSJmenem(from: string): string {
  return from.includes("<") ? from : `${JMENO_ODESILATELE} <${from}>`;
}

async function odeslat(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Priloha[];
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !options.to) return false;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: odesilatelSJmenem(from),
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });
    return true;
  } catch {
    // Záměrně tiše — formulář se kvůli e-mailu nemá zaseknout.
    return false;
  }
}

// Notifikace klientce — stejná šablona jako pro zákaznice, ať to vypadá
// jednotně. replyTo míří na návštěvnici, takže se dá odpovědět rovnou
// z došlé pošty.
export async function posliKlientce(
  o: ObsahEmailu & { subject: string; replyTo?: string; attachments?: Priloha[] }
): Promise<boolean> {
  const to = adresaKlientky();
  if (!to) return false;
  return odeslat({
    to,
    subject: o.subject,
    text: textovaVerze(o),
    html: sablona(o),
    replyTo: o.replyTo,
    attachments: o.attachments,
  });
}

// ── Šablona pro zákaznice ────────────────────────────────────────────────────

export type Radek = { popisek: string; hodnota: string };

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Logo se schválně načítá z webu, ne jako vložená příloha: příloha by
// v poštovním programu přidala ke zprávě sponku, což u potvrzení objednávky
// působí divně. Cenou je, že si někdo musí obrázky povolit — bez nich zůstane
// e-mail čitelný, jen bez loga.
//
// Tabulkové rozložení a inline styly schválně — poštovní programy si se
// současným CSS neporadí a Gmail navíc zahazuje <style> v hlavičce.
// Patkové písmo webu (Cormorant) se v e-mailu načíst nedá, proto Georgia —
// nejbližší patkové písmo, které má po ruce každý.
const PISMO_NADPIS = "Georgia, 'Times New Roman', Times, serif";
const PISMO_TEXT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export type ObsahEmailu = {
  nadpis: string;
  odstavce: string[];
  radky?: Radek[];
  // Text od návštěvnice — vykresluje se zvlášť, s zachovanými řádky.
  zprava?: string;
  zavěr?: string[];
};

// Exportovaná schválně — jde o čistou funkci, takže se dá vyrenderovat
// do souboru a šablona se zkontroluje očima, aniž by se něco odesílalo.
export function sablona(o: ObsahEmailu): string {
  const odstavce = o.odstavce
    .map(
      (t) =>
        `<p style="margin:0 0 14px;font-family:${PISMO_TEXT};font-size:15px;line-height:1.7;color:#6B5347;">${escapeHtml(t)}</p>`
    )
    .join("");

  const radky = (o.radky ?? [])
    .map(
      (r) =>
        `<tr>
           <td style="padding:5px 14px 5px 0;font-family:${PISMO_TEXT};font-size:14px;line-height:1.5;color:#6B5347;">${escapeHtml(r.popisek)}</td>
           <td style="padding:5px 0;font-family:${PISMO_TEXT};font-size:14px;line-height:1.5;color:#8C5F47;font-weight:600;">${escapeHtml(r.hodnota)}</td>
         </tr>`
    )
    .join("");

  const zavěr = (o.zavěr ?? [])
    .map(
      (t) =>
        `<p style="margin:0 0 10px;font-family:${PISMO_TEXT};font-size:13px;line-height:1.7;color:#8A7263;">${escapeHtml(t)}</p>`
    )
    .join("");

  return `<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#FCF4F1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FCF4F1;padding:32px 12px;">
    <tr><td align="center">

      <!-- Logo -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding-bottom:22px;">
          <img src="${SITE_URL}/logo-email.png" alt="Aurora jóga" width="104" height="82"
               style="display:block;border:0;outline:none;width:104px;height:auto;" />
        </td></tr>
      </table>

      <!-- Karta -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;">
        <tr><td style="padding:36px 34px 30px;">
          <p style="margin:0 0 8px;font-family:${PISMO_TEXT};font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:#F28D76;">Aurora jóga</p>
          <h1 style="margin:0 0 22px;font-family:${PISMO_NADPIS};font-size:27px;font-weight:400;line-height:1.25;color:#8C5F47;">${escapeHtml(o.nadpis)}</h1>
          ${odstavce}
          ${
            radky
              ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0 6px;background:#FBE9DE;border-radius:14px;"><tr><td style="padding:18px 20px;">
                   <table role="presentation" cellpadding="0" cellspacing="0" border="0">${radky}</table>
                 </td></tr></table>`
              : ""
          }
          ${
            o.zprava
              ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0 6px;"><tr><td style="padding:2px 0 2px 16px;border-left:3px solid #FBE9DE;">
                   <p style="margin:0;font-family:${PISMO_TEXT};font-size:14px;line-height:1.7;color:#6B5347;white-space:pre-wrap;">${escapeHtml(o.zprava)}</p>
                 </td></tr></table>`
              : ""
          }
          ${
            zavěr
              ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding-top:18px;border-top:1px solid #F2E4DC;">${zavěr}</td></tr></table>`
              : ""
          }
        </td></tr>
      </table>

      <!-- Patička -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
        <tr><td align="center" style="padding:20px 12px 0;font-family:${PISMO_TEXT};font-size:12px;line-height:1.8;color:#A08573;">
          <a href="${SITE_URL}" style="color:#A08573;text-decoration:none;">aurorayoga.cz</a>
          &nbsp;·&nbsp;
          <a href="mailto:${CONTACT.email}" style="color:#A08573;text-decoration:none;">${CONTACT.email}</a>
          <br />
          <a href="${CONTACT.instagram}" style="color:#A08573;text-decoration:none;">Instagram ${CONTACT.instagramHandle}</a>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body></html>`;
}

// Textová verze ze stejných dat, ať e-mail dává smysl i v programu, který
// HTML nezobrazuje.
function textovaVerze(o: ObsahEmailu): string {
  return [
    o.nadpis,
    "",
    ...o.odstavce,
    "",
    ...(o.radky ?? []).map((r) => `${r.popisek} ${r.hodnota}`),
    ...(o.zprava ? ["", o.zprava] : []),
    "",
    ...(o.zavěr ?? []),
    "",
    "Aurora jóga",
  ].join("\n");
}

// Potvrzení zákaznici.
export async function posliZakaznici(
  o: ObsahEmailu & { to: string; subject: string; attachments?: Priloha[] }
): Promise<boolean> {
  return odeslat({
    to: o.to,
    subject: o.subject,
    text: textovaVerze(o),
    html: sablona(o),
    replyTo: adresaKlientky() ?? undefined,
    attachments: o.attachments,
  });
}
