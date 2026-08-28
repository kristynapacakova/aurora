import { NextResponse } from "next/server";
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
import { posliKlientce, posliZakaznici, vetaProOdpoved, type Radek } from "@/lib/email";
import { generatePlatebniQr } from "@/lib/platba";
import { qrPriloha } from "@/lib/qrPriloha";
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

  // 2) E-maily — klientce notifikace, zákaznici potvrzení. Ani jedno nesmí
  // shodit objednávku, proto se chyby uvnitř posílání polykají.
  const platbaRadky: Radek[] =
    typ === "objednavka" && castka > 0
      ? zpusobPlatby === "zaloha"
        ? [
            { popisek: `Záloha ${rozpad.procento} %:`, hodnota: formatKc(castka) },
            {
              popisek: "Doplatek 14 dnů před pobytem:",
              hodnota: formatKc(rozpad.doplatek ?? 0),
            },
          ]
        : [{ popisek: "K úhradě:", hodnota: formatKc(castka) }]
      : [];

  const poukazRadky: Radek[] =
    rozpad.sleva > 0
      ? [{ popisek: "Dárkový poukaz:", hodnota: `− ${formatKc(rozpad.sleva)}` }]
      : [];

  await posliKlientce({
    subject:
      typ === "objednavka"
        ? `🌿 Závazná objednávka (${zpusobPlatby === "zaloha" ? "záloha" : "zaplaceno"}): ${pobyt?.nadpis ?? "pobyt"}`
        : `💬 Nový dotaz: ${pobyt?.nadpis ?? "pobyt"}`,
    replyTo: email,
    nadpis: typ === "objednavka" ? "Závazná objednávka" : "Nový dotaz",
    odstavce: [
      typ === "objednavka"
        ? zpusobPlatby === "zaloha"
          ? "Zákaznice potvrdila, že uhradila zálohu."
          : "Zákaznice potvrdila, že uhradila celou částku."
        : "Přišel nezávazný dotaz z detailu pobytu.",
    ],
    radky: [
      { popisek: "Pobyt:", hodnota: pobyt?.nadpis ?? "—" },
      ...poukazRadky,
      ...platbaRadky,
      { popisek: "Jméno:", hodnota: jmeno },
      { popisek: "E-mail:", hodnota: email },
      { popisek: "Telefon:", hodnota: telefon || "—" },
    ],
    zprava: zprava || undefined,
    "zavěr": [vetaProOdpoved()],
  });

  // Potvrzení posíláme jen u objednávky — u dotazu se klientka ozve sama
  // a automatická odpověď by působila odosobněně.
  if (typ === "objednavka") {
    const zbyvaZaplatit = castka > 0;
    // QR kód posíláme i do potvrzení — zákaznice stránku zavře a pak nemá
    // platbu odkud dodělat. Takhle ho má po ruce v poště.
    const qr =
      zbyvaZaplatit && pobyt?.cislo_uctu
        ? await generatePlatebniQr({
            cisloUctu: pobyt.cislo_uctu,
            castka,
            variabilniSymbol: pobyt.variabilni_symbol,
          })
        : null;
    await posliZakaznici({
      to: email,
      subject: `🌿 Potvrzení objednávky — ${pobyt?.nadpis ?? "pobyt"}`,
      nadpis: "Máme tvou objednávku",
      odstavce: [
        `Milá ${jmeno}, děkujeme za objednávku pobytu ${pobyt?.nadpis ?? ""}.`.trim(),
        zbyvaZaplatit
          ? "Jakmile platbu uvidíme na účtu, ozveme se ti s potvrzením a máš místo závazně rezervované."
          : "Pobyt máš pokrytý dárkovým poukazem, nic už posílat nemusíš. Brzy se ti ozveme s potvrzením.",
      ],
      radky: [
        ...(pobyt?.termin ? [{ popisek: "Termín:", hodnota: pobyt.termin }] : []),
        ...(pobyt?.misto ? [{ popisek: "Místo:", hodnota: pobyt.misto }] : []),
        ...(pobyt?.cena ? [{ popisek: "Cena pobytu:", hodnota: pobyt.cena }] : []),
        ...poukazRadky,
        ...platbaRadky,
        ...(zbyvaZaplatit && pobyt?.cislo_uctu
          ? [{ popisek: "Číslo účtu:", hodnota: pobyt.cislo_uctu }]
          : []),
        ...(zbyvaZaplatit && pobyt?.variabilni_symbol
          ? [{ popisek: "Variabilní symbol:", hodnota: pobyt.variabilni_symbol }]
          : []),
      ],
      zavěr: [
        ...(qr
          ? [
              zpusobPlatby === "zaloha"
                ? "V příloze je QR kód na zálohu — kdyby se ti platbu nepovedlo odeslat hned, můžeš ho použít i později."
                : "V příloze je QR kód pro platbu — kdyby se ti ji nepovedlo odeslat hned, můžeš ho použít i později.",
            ]
          : []),
        ...(zpusobPlatby === "zaloha"
          ? ["Doplatek pošleš na stejný účet nejpozději 14 dnů před začátkem pobytu."]
          : []),
        ...(pobyt?.platebni_pokyny ? [pobyt.platebni_pokyny] : []),
        vetaProOdpoved(),
      ],
      attachments: qrPriloha(qr, "qr-platba.png"),
    });
  }

  return NextResponse.json({ ok: true });
}
