import { NextResponse } from "next/server";
import { createDarkovyPoukaz, getNastaveni, getPoukazNabidka, createNewsletterSignup, dbConfigured } from "@/lib/db";
import { generatePlatebniQr } from "@/lib/platba";
import { formatKc } from "@/lib/castky";
import { posliKlientce, posliZakaznici, vetaProOdpoved } from "@/lib/email";
import { qrPriloha } from "@/lib/qrPriloha";
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
    nabidka_id?: number;
    hodnota_kc?: number;
    jmeno_kupujici?: string;
    email_kupujici?: string;
    telefon_kupujici?: string;
    platba_potvrzena?: boolean;
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

  const jmeno_kupujici = clamp((body.jmeno_kupujici ?? "").trim(), 200);
  const email_kupujici = clamp((body.email_kupujici ?? "").trim(), 200);
  const telefon_kupujici = clamp((body.telefon_kupujici ?? "").trim(), 50);

  if (!jmeno_kupujici || !email_kupujici) {
    return NextResponse.json({ error: "Vyplňte prosím jméno a e-mail." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_kupujici)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  const nastaveni = await getNastaveni();

  // Částka musí odpovídat tomu, co je u daného poukazu vystavené — jinak by
  // šlo poslat cokoliv.
  const nabidka =
    typeof body.nabidka_id === "number" ? await getPoukazNabidka(body.nabidka_id) : null;
  if (!nabidka || !nabidka.zverejneno) {
    return NextResponse.json({ error: "Tenhle poukaz už není v nabídce." }, { status: 400 });
  }
  const hodnotaKc = Math.round(Number(body.hodnota_kc) || 0);
  const zvolenaCastka = nabidka.castky.find((c) => c.hodnota_kc === hodnotaKc);
  if (!zvolenaCastka) {
    return NextResponse.json(
      { error: "Vyber prosím jednu z nabízených hodnot poukazu." },
      { status: 400 }
    );
  }
  if (!nastaveni.cislo_uctu_darky) {
    return NextResponse.json(
      { error: "Dárkové poukazy zatím nejsou dostupné. Zkus to prosím později." },
      { status: 503 }
    );
  }

  // Zákaznice platí ještě před odesláním formuláře (QR má rovnou u sebe),
  // takže objednávka bez potvrzení platby by klientku jen mátla.
  if (body.platba_potvrzena !== true) {
    return NextResponse.json(
      { error: "Potvrď prosím odeslání platby." },
      { status: 400 }
    );
  }

  const poukaz = await createDarkovyPoukaz({
    // Text ceny sjednotíme, ať v administraci nejsou „1500Kc" i „1 500 Kč".
    hodnota: formatKc(hodnotaKc),
    hodnota_kc: hodnotaKc,
    // Grafika té konkrétní částky; společná se použije, jen když u částky
    // vlastní není. Jinak by zákaznici dorazil obrázek s cizí hodnotou.
    fotka: zvolenaCastka.fotka || nabidka.fotka,
    platba_ohlasena: true,
    jmeno_kupujici,
    email_kupujici,
    telefon_kupujici,
    jmeno_obdarovane: "",
    vzkaz: "",
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

  await posliKlientce({
    subject: `🎁 Nový dárkový poukaz: ${poukaz.kod} (${poukaz.hodnota})`,
    replyTo: email_kupujici,
    nadpis: "Nový dárkový poukaz",
    odstavce: [
      "Někdo si objednal poukaz a potvrdil odeslání platby. Až ji uvidíš na účtu, označ poukaz v administraci jako zaplacený — tím odejde e-mail s kódem.",
    ],
    radky: [
      { popisek: "Kód:", hodnota: poukaz.kod },
      { popisek: "Hodnota:", hodnota: poukaz.hodnota },
      { popisek: "Variabilní symbol:", hodnota: poukaz.variabilni_symbol },
      { popisek: "Kupující:", hodnota: jmeno_kupujici },
      { popisek: "E-mail:", hodnota: email_kupujici },
      { popisek: "Telefon:", hodnota: telefon_kupujici || "—" },
    ],
    "zavěr": [
      "Až platbu uvidíš na účtu, označ poukaz v administraci jako zaplacený — kupující tím automaticky dostane e-mail s kódem a poukazu se rozeběhne platnost.",
    ],
  });

  // Kupující dostane platební údaje hned; kód poukazu až po zaplacení.
  // QR kód jde jako příloha, protože obrázky vložené přímo do e-mailu
  // (data:) většina poštovních programů zahodí.
  await posliZakaznici({
    to: email_kupujici,
    subject: `🎁 Dárkový poukaz — platební údaje (${poukaz.hodnota})`,
    nadpis: "Děkujeme za objednávku poukazu",
    odstavce: [
      `Ahoj ${jmeno_kupujici}, poukaz máme připravený. Zbývá ho uhradit.`,
      "Jakmile platbu uvidíme na účtu, pošleme ti e-mailem kód poukazu.",
    ],
    radky: [
      { popisek: "Hodnota:", hodnota: poukaz.hodnota },
      { popisek: "Číslo účtu:", hodnota: nastaveni.cislo_uctu_darky },
      { popisek: "Variabilní symbol:", hodnota: poukaz.variabilni_symbol },
    ],
    zavěr: [
      "V příloze je QR kód pro platbu.",
      vetaProOdpoved(),
    ],
    attachments: qrPriloha(qrDataUrl, `qr-poukaz-${poukaz.kod}.png`),
  });

  return NextResponse.json({
    ok: true,
    kod: poukaz.kod,
    variabilniSymbol: poukaz.variabilni_symbol,
    cisloUctu: nastaveni.cislo_uctu_darky,
    qrDataUrl,
  });
}
