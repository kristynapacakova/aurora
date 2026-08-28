import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createDarkovyPoukaz, getNastaveni, createNewsletterSignup, dbConfigured } from "@/lib/db";
import { generatePlatebniQr } from "@/lib/platba";
import { parseAmount, formatKc } from "@/lib/castky";
import {
  HONEYPOT_FIELD,
  isHoneypotTripped,
  FORM_LOADED_FIELD,
  isSubmittedTooFast,
  clamp,
  checkFormRateLimit,
} from "@/lib/formGuard";
import { NEWSLETTER_FIELD, wantsNewsletter } from "@/lib/newsletterOptIn";

// Veřejný formulář pro nákup dárkového poukazu. Vytvoří nezaplacený poukaz
// s unikátním kódem a variabilním symbolem, vrátí QR kód pro platbu.
// Až platba dorazí, klientka ji potvrdí ručně v administraci a poukaz
// (grafiku) pošle obdarované sama e-mailem.
export async function POST(request: Request) {
  if (!dbConfigured()) {
    return NextResponse.json(
      { error: "Dárkové poukazy zatím nejsou dostupné. Zkus to prosím později." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as {
    hodnota?: string;
    jmeno_kupujici?: string;
    email_kupujici?: string;
    telefon_kupujici?: string;
    jmeno_obdarovane?: string;
    vzkaz?: string;
    [HONEYPOT_FIELD]?: string;
    [FORM_LOADED_FIELD]?: number;
    [NEWSLETTER_FIELD]?: boolean;
  };

  if (isHoneypotTripped(body) || isSubmittedTooFast(body)) {
    return NextResponse.json({ ok: true });
  }
  if (!checkFormRateLimit(request, "darkovy-poukaz")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." }, { status: 429 });
  }

  const hodnota = clamp((body.hodnota ?? "").trim(), 100);
  const jmeno_kupujici = clamp((body.jmeno_kupujici ?? "").trim(), 200);
  const email_kupujici = clamp((body.email_kupujici ?? "").trim(), 200);
  const telefon_kupujici = clamp((body.telefon_kupujici ?? "").trim(), 50);
  const jmeno_obdarovane = clamp((body.jmeno_obdarovane ?? "").trim(), 200);
  const vzkaz = clamp((body.vzkaz ?? "").trim(), 2000);

  if (!hodnota || !jmeno_kupujici || !email_kupujici) {
    return NextResponse.json({ error: "Vyplňte prosím hodnotu, jméno a e-mail." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_kupujici)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  // Hodnota musí být číslo — poukaz se čerpá po částech, takže se z ní počítá.
  // Vlastní částku píše kupující volně, proto tahle kontrola.
  const hodnotaKc = Math.round(parseAmount(hodnota) ?? 0);
  if (hodnotaKc < 100 || hodnotaKc > 100000) {
    return NextResponse.json(
      { error: "Zadej prosím hodnotu poukazu v korunách, mezi 100 a 100 000 Kč." },
      { status: 400 }
    );
  }

  const nastaveni = await getNastaveni();
  if (!nastaveni.cislo_uctu_darky) {
    return NextResponse.json(
      { error: "Dárkové poukazy zatím nejsou dostupné. Zkus to prosím později." },
      { status: 503 }
    );
  }

  const poukaz = await createDarkovyPoukaz({
    // Text ceny sjednotíme, ať v administraci nejsou „1500Kc" i „1 500 Kč".
    hodnota: formatKc(hodnotaKc),
    hodnota_kc: hodnotaKc,
    jmeno_kupujici,
    email_kupujici,
    telefon_kupujici,
    jmeno_obdarovane,
    vzkaz,
  });

  // Do newsletteru jen se zaškrtnutým souhlasem.
  if (wantsNewsletter(body)) {
    try {
      await createNewsletterSignup(email_kupujici);
    } catch {
      // záměrně tiše — poukaz se vytvoří i tak
    }
  }

  const qrDataUrl = await generatePlatebniQr({
    cisloUctu: nastaveni.cislo_uctu_darky,
    castka: hodnotaKc,
    variabilniSymbol: poukaz.variabilni_symbol,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (apiKey && toEmail && fromEmail) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email_kupujici,
      subject: `Nový dárkový poukaz: ${poukaz.kod} (${poukaz.hodnota})`,
      text: [
        `Nový zájem o dárkový poukaz — čeká na platbu.`,
        ``,
        `Kód: ${poukaz.kod}`,
        `Hodnota: ${poukaz.hodnota}`,
        `Variabilní symbol: ${poukaz.variabilni_symbol}`,
        ``,
        `Kupující: ${jmeno_kupujici}`,
        `E-mail: ${email_kupujici}`,
        `Telefon: ${telefon_kupujici || "—"}`,
        ``,
        `Obdarovaná: ${jmeno_obdarovane || "—"}`,
        `Vzkaz: ${vzkaz || "—"}`,
      ].join("\n"),
    });
  }

  return NextResponse.json({
    ok: true,
    kod: poukaz.kod,
    variabilniSymbol: poukaz.variabilni_symbol,
    cisloUctu: nastaveni.cislo_uctu_darky,
    qrDataUrl,
  });
}
