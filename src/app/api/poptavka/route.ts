import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createPoptavka, getPobyt, dbConfigured } from "@/lib/db";

// Veřejný formulář u pobytu — buď závazná objednávka (po potvrzení platby),
// nebo prostý dotaz. Uloží se do databáze (zobrazí se v administraci) a
// pokud je nastaven Resend, odešle se klientce i e-mail:
//   RESEND_API_KEY, RESEND_TO_EMAIL, RESEND_FROM_EMAIL
export async function POST(request: Request) {
  const body = (await request.json()) as {
    pobyt_id?: number;
    typ?: "dotaz" | "objednavka";
    zaplaceno?: boolean;
    jmeno?: string;
    email?: string;
    telefon?: string;
    zprava?: string;
  };

  const jmeno = (body.jmeno ?? "").trim();
  const email = (body.email ?? "").trim();
  const telefon = (body.telefon ?? "").trim();
  const zprava = (body.zprava ?? "").trim();
  const typ: "dotaz" | "objednavka" = body.typ === "objednavka" ? "objednavka" : "dotaz";
  const zaplaceno = typ === "objednavka" && body.zaplaceno === true;

  if (!jmeno || !email) {
    return NextResponse.json(
      { error: "Vyplňte prosím jméno a e-mail." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "E-mail nemá platný tvar." },
      { status: 400 }
    );
  }

  const pobytId = typeof body.pobyt_id === "number" ? body.pobyt_id : null;
  const pobyt = pobytId ? await getPobyt(pobytId) : null;
  const vyzadujePlatbu = Boolean(pobyt?.qr_kod || pobyt?.platebni_pokyny);

  if (typ === "objednavka" && vyzadujePlatbu && !zaplaceno) {
    return NextResponse.json(
      { error: "Potvrď prosím, že jsi platbu provedla." },
      { status: 400 }
    );
  }

  // 1) Uložit do databáze (administrace → Poptávky)
  if (dbConfigured()) {
    await createPoptavka({ pobyt_id: pobytId, typ, zaplaceno, jmeno, email, telefon, zprava });
  }

  // 2) Poslat e-mail klientce (pokud je Resend nastaven)
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (apiKey && toEmail && fromEmail) {
    const resend = new Resend(apiKey);
    const subject =
      typ === "objednavka"
        ? `Závazná objednávka (zaplaceno): ${pobyt?.nadpis ?? "pobyt"}`
        : `Nový dotaz: ${pobyt?.nadpis ?? "pobyt"}`;
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject,
      text: [
        typ === "objednavka" ? "ZÁVAZNÁ OBJEDNÁVKA — zákaznice potvrdila platbu." : "Nezávazný dotaz.",
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
