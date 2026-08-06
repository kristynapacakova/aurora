import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  HONEYPOT_FIELD,
  isHoneypotTripped,
  FORM_LOADED_FIELD,
  isSubmittedTooFast,
  clamp,
  checkFormRateLimit,
} from "@/lib/formGuard";
import { NEWSLETTER_FIELD, wantsNewsletter } from "@/lib/newsletterOptIn";
import { createNewsletterSignup, dbConfigured } from "@/lib/db";

// Kontaktní formulář ze stránky /kontakt. Zpráva se posílá e-mailem
// přes Resend na adresu z RESEND_TO_EMAIL — do databáze se neukládá,
// je to jen běžný dotaz, ne objednávka.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    jmeno?: string;
    email?: string;
    telefon?: string;
    zprava?: string;
    [HONEYPOT_FIELD]?: string;
    [FORM_LOADED_FIELD]?: number;
    [NEWSLETTER_FIELD]?: boolean;
  };

  if (isHoneypotTripped(body) || isSubmittedTooFast(body)) {
    return NextResponse.json({ ok: true });
  }
  if (!checkFormRateLimit(request, "kontakt")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." }, { status: 429 });
  }

  const jmeno = clamp((body.jmeno ?? "").trim(), 200);
  const email = clamp((body.email ?? "").trim(), 200);
  const telefon = clamp((body.telefon ?? "").trim(), 50);
  const zprava = clamp((body.zprava ?? "").trim(), 5000);

  if (!jmeno || !email || !zprava) {
    return NextResponse.json(
      { error: "Vyplňte prosím jméno, e-mail a zprávu." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  // Do newsletteru jen se zaškrtnutým souhlasem. Případná chyba ukládání
  // nesmí shodit odeslání zprávy — ta je pro návštěvnici to podstatné.
  if (wantsNewsletter(body) && dbConfigured()) {
    try {
      await createNewsletterSignup(email);
    } catch {
      // záměrně tiše — zpráva se odešle i tak
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return NextResponse.json(
      { error: "Odesílání zpráv zatím není nastavené. Napiš prosím přímo na uvedený e-mail." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: `Zpráva z kontaktního formuláře: ${jmeno}`,
    text: [
      `Nová zpráva z kontaktního formuláře na webu.`,
      ``,
      `Jméno: ${jmeno}`,
      `E-mail: ${email}`,
      `Telefon: ${telefon || "—"}`,
      ``,
      `Zpráva:`,
      zprava,
    ].join("\n"),
  });

  if (error) {
    return NextResponse.json(
      { error: "Odeslání se nepovedlo. Zkus to prosím znovu, nebo napiš přímo na uvedený e-mail." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
