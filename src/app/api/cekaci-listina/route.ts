import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createCekaciListina, getPobyt, createNewsletterSignup, dbConfigured } from "@/lib/db";
import {
  HONEYPOT_FIELD,
  isHoneypotTripped,
  FORM_LOADED_FIELD,
  isSubmittedTooFast,
  clamp,
  checkFormRateLimit,
} from "@/lib/formGuard";
import { NEWSLETTER_FIELD, wantsNewsletter } from "@/lib/newsletterOptIn";

// Veřejný formulář u vyprodaného pobytu — bez platby, jen zájem o uvolněné
// místo. Uloží se do databáze (zobrazí se v administraci) a pokud je
// nastaven Resend, přijde upozornění i na e-mail klientky.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    pobyt_id?: number;
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
  if (!checkFormRateLimit(request, "cekaci-listina")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." }, { status: 429 });
  }

  const jmeno = clamp((body.jmeno ?? "").trim(), 200);
  const email = clamp((body.email ?? "").trim(), 200);
  const telefon = clamp((body.telefon ?? "").trim(), 50);
  const zprava = clamp((body.zprava ?? "").trim(), 5000);

  if (!jmeno || !email) {
    return NextResponse.json({ error: "Vyplňte prosím jméno a e-mail." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  const pobytId = typeof body.pobyt_id === "number" ? body.pobyt_id : null;
  const pobyt = pobytId ? await getPobyt(pobytId) : null;

  if (dbConfigured()) {
    await createCekaciListina({ pobyt_id: pobytId, jmeno, email, telefon, zprava });

    // Do newsletteru jen se zaškrtnutým souhlasem.
    if (wantsNewsletter(body)) {
      try {
        await createNewsletterSignup(email);
      } catch {
        // záměrně tiše — přihlášení na čekačku se uloží i tak
      }
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (apiKey && toEmail && fromEmail) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `Čekací listina: ${pobyt?.nadpis ?? "pobyt"}`,
      text: [
        `Nový zájem o čekací listinu.`,
        ``,
        `Pobyt: ${pobyt?.nadpis ?? "—"}`,
        `Jméno: ${jmeno}`,
        `E-mail: ${email}`,
        `Telefon: ${telefon || "—"}`,
        ``,
        `Zpráva:`,
        zprava || "—",
      ].join("\n"),
    });
  }

  return NextResponse.json({ ok: true });
}
