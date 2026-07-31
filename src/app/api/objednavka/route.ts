import { Resend } from "resend";
import { NextResponse } from "next/server";
import { HONEYPOT_FIELD, isHoneypotTripped, clamp, checkFormRateLimit } from "@/lib/formGuard";

// Alternativa k Formspree: odeslání objednávky e-mailem přes Resend
// (https://resend.com). Pro funkčnost je potřeba nastavit v .env.local:
//   RESEND_API_KEY=...
//   RESEND_TO_EMAIL=vas@email.cz
//   RESEND_FROM_EMAIL=objednavky@vasedomena.cz (musí být ověřená doména v Resend)
//
// Formulář na hlavní stránce tuto cestu použije automaticky, pokud není
// nastavená proměnná NEXT_PUBLIC_FORMSPREE_ENDPOINT.

export async function POST(request: Request) {
  const body = (await request.json()) as {
    jmeno?: string;
    email?: string;
    lekce?: string;
    cena?: string;
    [HONEYPOT_FIELD]?: string;
  };

  if (isHoneypotTripped(body)) {
    return NextResponse.json({ ok: true });
  }
  if (!checkFormRateLimit(request, "objednavka")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." }, { status: 429 });
  }

  const jmeno = clamp((body.jmeno ?? "").trim(), 200);
  const email = clamp((body.email ?? "").trim(), 200);
  const lekce = clamp((body.lekce ?? "").trim(), 200);
  const cena = clamp((body.cena ?? "").trim(), 100);

  if (!jmeno || !email || !lekce) {
    return NextResponse.json(
      { error: "Chybí povinné údaje." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
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
    text: `Nová objednávka z webu\n\nJméno: ${jmeno}\nE-mail: ${email}\nLekce / balíček: ${lekce}\nCena: ${cena || "—"}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "Odeslání e-mailu se nezdařilo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
