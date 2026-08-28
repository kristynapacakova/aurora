import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createPoptavka, getPobyt, createNewsletterSignup, dbConfigured } from "@/lib/db";
import {
  HONEYPOT_FIELD,
  isHoneypotTripped,
  FORM_LOADED_FIELD,
  isSubmittedTooFast,
  clamp,
  checkFormRateLimit,
} from "@/lib/formGuard";
import { NEWSLETTER_FIELD, wantsNewsletter } from "@/lib/newsletterOptIn";
import { rozpadSPoukazem, formatKc } from "@/lib/castky";
import { overitPoukaz, POUKAZ_HLASKY } from "@/lib/poukaz";
import { cerpatPoukaz } from "@/lib/db";

// Veřejný formulář u pobytu — buď závazná objednávka (po potvrzení platby),
// nebo prostý dotaz. Uloží se do databáze (zobrazí se v administraci) a
// pokud je nastaven Resend, odešle se klientce i e-mail:
//   RESEND_API_KEY, RESEND_TO_EMAIL, RESEND_FROM_EMAIL
export async function POST(request: Request) {
  const body = (await request.json()) as {
    pobyt_id?: number;
    typ?: "dotaz" | "objednavka";
    zaplaceno?: boolean;
    zpusob_platby?: string;
    poukaz_kod?: string;
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
  if (!checkFormRateLimit(request, "poptavka")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." }, { status: 429 });
  }

  const jmeno = clamp((body.jmeno ?? "").trim(), 200);
  const email = clamp((body.email ?? "").trim(), 200);
  const telefon = clamp((body.telefon ?? "").trim(), 50);
  const zprava = clamp((body.zprava ?? "").trim(), 5000);
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
  const vyzadujePlatbu = Boolean(pobyt?.cislo_uctu);

  // Poukaz ověřujeme znovu tady, i když ho formulář ověřoval už při zadání —
  // mezitím se mohl vyčerpat a hlavně si prohlížeč mohl slevu přepsat.
  const poukazKod = clamp((body.poukaz_kod ?? "").trim(), 40);
  const poukaz = typ === "objednavka" && poukazKod ? await overitPoukaz(poukazKod) : null;
  if (poukaz && !poukaz.ok) {
    return NextResponse.json({ error: POUKAZ_HLASKY[poukaz.duvod] }, { status: 400 });
  }

  // Částky počítáme z pobytu v databázi, ne z toho, co pošle prohlížeč —
  // z formuláře bereme jen volbu „celá částka / záloha" a kód poukazu.
  const rozpad = rozpadSPoukazem({
    cena: pobyt?.cena,
    zalohaProcento: pobyt?.zaloha_procento,
    zustatekPoukazu: poukaz?.ok ? poukaz.zustatek : 0,
  });
  const chceZalohu = body.zpusob_platby === "zaloha" && rozpad.zaloha !== null;
  const zpusobPlatby: "" | "cela" | "zaloha" =
    typ !== "objednavka" ? "" : chceZalohu ? "zaloha" : "cela";
  const castka =
    typ !== "objednavka" ? 0 : chceZalohu ? (rozpad.zaloha ?? 0) : rozpad.poSleve;

  // Potvrzení platby chceme jen tehdy, když je vůbec co posílat — poukaz
  // může pokrýt celou cenu.
  if (typ === "objednavka" && vyzadujePlatbu && castka > 0 && !zaplaceno) {
    return NextResponse.json(
      { error: "Potvrď prosím, že jsi platbu provedla." },
      { status: 400 }
    );
  }

  // 1) Uložit do databáze (administrace → Poptávky)
  let poptavkaId: number | null = null;
  if (dbConfigured()) {
    poptavkaId = await createPoptavka({
      pobyt_id: pobytId,
      typ,
      zaplaceno,
      zpusob_platby: zpusobPlatby,
      castka,
      poukaz_kod: poukaz?.ok ? poukaz.poukaz.kod : "",
      poukaz_sleva: rozpad.sleva,
      jmeno,
      email,
      telefon,
      zprava,
    });

    // Odečet z poukazu je až po uložení objednávky, ať je čerpání na co
    // navázat. Když mezitím poukaz někdo vyčerpal, odečet neprojde —
    // objednávka zůstane a klientka to uvidí v administraci.
    if (poukaz?.ok && rozpad.sleva > 0) {
      const zbyva = await cerpatPoukaz({
        poukaz_id: poukaz.poukaz.id,
        castka_kc: rozpad.sleva,
        popis: `Objednávka pobytu: ${pobyt?.nadpis ?? "—"}`,
        poptavka_id: poptavkaId,
      });
      if (zbyva === null) {
        return NextResponse.json(
          {
            error:
              "Poukaz se mezitím vyčerpal. Objednávku jsme uložili — ozveme se ti a doladíme platbu.",
          },
          { status: 409 }
        );
      }
    }

    // Do newsletteru jen se zaškrtnutým souhlasem.
    if (wantsNewsletter(body)) {
      try {
        await createNewsletterSignup(email);
      } catch {
        // záměrně tiše — objednávka/dotaz se uloží i tak
      }
    }
  }

  // 2) Poslat e-mail klientce (pokud je Resend nastaven)
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (apiKey && toEmail && fromEmail) {
    const resend = new Resend(apiKey);
    const subject =
      typ === "objednavka"
        ? `Závazná objednávka (${zpusobPlatby === "zaloha" ? "záloha" : "zaplaceno"}): ${pobyt?.nadpis ?? "pobyt"}`
        : `Nový dotaz: ${pobyt?.nadpis ?? "pobyt"}`;
    const platbaRadky =
      typ === "objednavka" && castka > 0
        ? zpusobPlatby === "zaloha"
          ? [
              `Platba: záloha ${rozpad.procento} % — ${formatKc(castka)}`,
              `Doplatek: ${formatKc(rozpad.doplatek ?? 0)} (14 dnů před pobytem)`,
            ]
          : [`Platba: celá částka — ${formatKc(castka)}`]
        : [];
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject,
      text: [
        typ === "objednavka"
          ? zpusobPlatby === "zaloha"
            ? "ZÁVAZNÁ OBJEDNÁVKA — zákaznice potvrdila platbu zálohy."
            : "ZÁVAZNÁ OBJEDNÁVKA — zákaznice potvrdila platbu celé částky."
          : "Nezávazný dotaz.",
        ``,
        `Pobyt: ${pobyt?.nadpis ?? "—"}`,
        ...platbaRadky,
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
