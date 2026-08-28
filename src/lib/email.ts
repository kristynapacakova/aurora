import { Resend } from "resend";

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

export function adresaKlientky(): string | null {
  return process.env.RESEND_TO_EMAIL || null;
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
      from,
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

// Notifikace klientce — prostý text, čte ji jen ona.
export async function posliKlientce(options: {
  subject: string;
  radky: string[];
  replyTo?: string;
  attachments?: Priloha[];
}): Promise<boolean> {
  const to = adresaKlientky();
  if (!to) return false;
  return odeslat({
    to,
    subject: options.subject,
    text: options.radky.join("\n"),
    replyTo: options.replyTo,
    attachments: options.attachments,
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

// Tabulkové rozložení a inline styly schválně — poštovní programy si se
// současným CSS neporadí a Gmail navíc zahazuje <style> v hlavičce.
function sablona(o: {
  nadpis: string;
  odstavce: string[];
  radky?: Radek[];
  zavěr?: string[];
}): string {
  const odstavce = o.odstavce
    .map(
      (t) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#6B5347;">${escapeHtml(t)}</p>`
    )
    .join("");

  const radky = (o.radky ?? [])
    .map(
      (r) =>
        `<tr>
           <td style="padding:6px 12px 6px 0;font-size:14px;color:#6B5347;white-space:nowrap;">${escapeHtml(r.popisek)}</td>
           <td style="padding:6px 0;font-size:14px;color:#8C5F47;font-weight:600;">${escapeHtml(r.hodnota)}</td>
         </tr>`
    )
    .join("");

  const zavěr = (o.zavěr ?? [])
    .map(
      (t) =>
        `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#6B5347;">${escapeHtml(t)}</p>`
    )
    .join("");

  return `<!doctype html>
<html lang="cs"><body style="margin:0;padding:0;background:#FCF4F1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FCF4F1;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:18px;padding:32px;">
        <tr><td>
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#F28D76;">Aurora jóga</p>
          <h1 style="margin:0 0 20px;font-size:24px;font-weight:400;color:#8C5F47;">${escapeHtml(o.nadpis)}</h1>
          ${odstavce}
          ${
            radky
              ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;background:#FBE9DE;border-radius:12px;padding:16px 18px;width:100%;"><tr><td>
                   <table role="presentation" cellpadding="0" cellspacing="0">${radky}</table>
                 </td></tr></table>`
              : ""
          }
          ${zavěr}
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#A08573;">Aurora jóga</p>
    </td></tr>
  </table>
</body></html>`;
}

// Potvrzení zákaznici. Textová verze se skládá ze stejných dat, ať e-mail
// dává smysl i v programu, který HTML nezobrazuje.
export async function posliZakaznici(o: {
  to: string;
  subject: string;
  nadpis: string;
  odstavce: string[];
  radky?: Radek[];
  zavěr?: string[];
  attachments?: Priloha[];
}): Promise<boolean> {
  const text = [
    o.nadpis,
    "",
    ...o.odstavce,
    "",
    ...(o.radky ?? []).map((r) => `${r.popisek} ${r.hodnota}`),
    "",
    ...(o.zavěr ?? []),
    "",
    "Aurora jóga",
  ].join("\n");

  return odeslat({
    to: o.to,
    subject: o.subject,
    text,
    html: sablona(o),
    replyTo: adresaKlientky() ?? undefined,
    attachments: o.attachments,
  });
}
