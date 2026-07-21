import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createDarkovyPoukaz, getNastaveni, dbConfigured } from "@/lib/db";
import { generatePlatebniQr } from "@/lib/platba";

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
  };

  const hodnota = (body.hodnota ?? "").trim();
  const jmeno_kupujici = (body.jmeno_kupujici ?? "").trim();
  const email_kupujici = (body.email_kupujici ?? "").trim();
  const telefon_kupujici = (body.telefon_kupujici ?? "").trim();
  const jmeno_obdarovane = (body.jmeno_obdarovane ?? "").trim();
  const vzkaz = (body.vzkaz ?? "").trim();

  if (!hodnota || !jmeno_kupujici || !email_kupujici) {
    return NextResponse.json({ error: "Vyplňte prosím hodnotu, jméno a e-mail." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_kupujici)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  const nastaveni = await getNastaveni();
  if (!nastaveni.cislo_uctu_darky) {
    return NextResponse.json(
      { error: "Dárkové poukazy zatím nejsou dostupné. Zkus to prosím později." },
      { status: 503 }
    );
  }

  const poukaz = await createDarkovyPoukaz({
    hodnota,
    jmeno_kupujici,
    email_kupujici,
    telefon_kupujici,
    jmeno_obdarovane,
    vzkaz,
  });

  const qrDataUrl = await generatePlatebniQr({
    cisloUctu: nastaveni.cislo_uctu_darky,
    cena: hodnota,
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
      subject: `Nový dárkový poukaz: ${poukaz.kod} (${hodnota})`,
      text: [
        `Nový zájem o dárkový poukaz — čeká na platbu.`,
        ``,
        `Kód: ${poukaz.kod}`,
        `Hodnota: ${hodnota}`,
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
