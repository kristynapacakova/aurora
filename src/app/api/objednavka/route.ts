import { Resend } from "resend";
import { NextResponse } from "next/server";

// Alternativa k Formspree: odeslání objednávky e-mailem přes Resend
// (https://resend.com). Pro funkčnost je potřeba nastavit v .env.local:
//   RESEND_API_KEY=...
//   RESEND_TO_EMAIL=vas@email.cz
//   RESEND_FROM_EMAIL=objednavky@vasedomena.cz (musí být ověřená doména v Resend)
//
// Formulář na hlavní stránce tuto cestu použije automaticky, pokud není
// nastavená proměnná NEXT_PUBLIC_FORMSPREE_ENDPOINT.

export async function POST(request: Request) {
  const { jmeno, email, lekce, cena } = await request.json();

  if (!jmeno || !email || !lekce) {
    return NextResponse.json(
      { error: "Chybí povinné údaje." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return NextResponse.json(
      { error: "E-mailová služba není nakonfigurována." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `Nová objednávka: ${lekce}`,
    text: `Nová objednávka z webu\n\nJméno: ${jmeno}\nE-mail: ${email}\nLekce / balíček: ${lekce}\nCena: ${cena ?? "—"}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Odeslání e-mailu se nezdařilo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
