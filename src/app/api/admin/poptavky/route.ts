import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  deletePoptavka,
  getPoptavka,
  getPobyt,
  oznacitPoptavkaEmail,
  updatePoptavkaPrecteno,
  updatePoptavkaZaplaceno,
  dbConfigured,
} from "@/lib/db";
import { posliZakaznici, oznamNeodeslano } from "@/lib/email";
import { nactiSablonu } from "@/lib/emailSablonyServer";
import { generatePlatebniQr } from "@/lib/platba";
import { qrPriloha } from "@/lib/qrPriloha";
import { rozpadPlatby, formatKc } from "@/lib/castky";

// Potvrzení zákaznici, že platba dorazila. Chodí ve chvíli, kdy klientka
// objednávku označí jako zaplacenou — první e-mail jí to slibuje, tak ať
// se to opravdu stane.
async function posliPotvrzeniPlatby(id: number): Promise<void> {
  const poptavka = await getPoptavka(id);
  if (!poptavka || poptavka.typ !== "objednavka") return;
  const pobyt = poptavka.pobyt_id ? await getPobyt(poptavka.pobyt_id) : null;

  const sablona = await nactiSablonu("platba-prijata", {
    jmeno: poptavka.jmeno,
    pobyt: poptavka.pobyt_nadpis ?? "",
    termin: pobyt?.termin ?? "",
    castka: poptavka.castka > 0 ? formatKc(poptavka.castka) : "",
  });

  const rozpad = rozpadPlatby({ cena: pobyt?.cena, zalohaProcento: pobyt?.zaloha_procento });
  const doplatek =
    poptavka.zpusob_platby === "zaloha"
      ? Math.max(0, (rozpad.celkem || 0) - poptavka.poukaz_sleva - poptavka.castka)
      : 0;

  const odeslano = await posliZakaznici({
    to: poptavka.email,
    subject: sablona.predmet,
    nadpis: "Platba dorazila",
    odstavce: sablona.odstavce,
    radky: [
      { popisek: "Pobyt:", hodnota: poptavka.pobyt_nadpis ?? "—" },
      ...(pobyt?.termin ? [{ popisek: "Termín:", hodnota: pobyt.termin }] : []),
      ...(pobyt?.misto ? [{ popisek: "Místo:", hodnota: pobyt.misto }] : []),
      ...(poptavka.castka > 0
        ? [
            {
              popisek: poptavka.zpusob_platby === "zaloha" ? "Uhrazená záloha:" : "Uhrazeno:",
              hodnota: formatKc(poptavka.castka),
            },
          ]
        : []),
    ],
    // U zálohy hned připomeneme, co ještě zbývá — ať to není překvapení.
    platba:
      doplatek > 0
        ? {
            nadpis: "Zbývá doplatit",
            radky: [
              { popisek: "Doplatek:", hodnota: formatKc(doplatek) },
              ...(pobyt?.cislo_uctu ? [{ popisek: "Číslo účtu:", hodnota: pobyt.cislo_uctu }] : []),
              ...(pobyt?.variabilni_symbol
                ? [{ popisek: "Variabilní symbol:", hodnota: pobyt.variabilni_symbol }]
                : []),
              { popisek: "Poznámka pro příjemce:", hodnota: poptavka.jmeno },
            ],
            poznamka: [
              "Doplatek pošli nejpozději 14 dnů před začátkem pobytu. Ozvu se ti s připomenutím i QR kódem.",
            ],
          }
        : undefined,
    zavěr: sablona.zaver,
  });

  await oznacitPoptavkaEmail(poptavka.id, !odeslano);
  if (!odeslano) {
    await oznamNeodeslano({
      komu: poptavka.email,
      co: "Potvrzení přijaté platby",
      detail: [
        `Pobyt: ${poptavka.pobyt_nadpis ?? "—"}`,
        `Jméno: ${poptavka.jmeno}`,
        `Částka: ${formatKc(poptavka.castka)}`,
      ],
    });
  }
}

// Výzva k doplatku u objednávek se zálohou. Posílá se ručně z administrace,
// aby klientka měla nad načasováním kontrolu.
async function posliVyzvuKDoplatku(id: number): Promise<{ ok: true } | { error: string }> {
  const poptavka = await getPoptavka(id);
  if (!poptavka || poptavka.typ !== "objednavka") {
    return { error: "Tohle není objednávka." };
  }
  if (poptavka.zpusob_platby !== "zaloha") {
    return { error: "Doplatek se týká jen objednávek se zálohou." };
  }
  const pobyt = poptavka.pobyt_id ? await getPobyt(poptavka.pobyt_id) : null;
  const rozpad = rozpadPlatby({ cena: pobyt?.cena, zalohaProcento: pobyt?.zaloha_procento });
  const doplatek = Math.max(0, (rozpad.celkem || 0) - poptavka.poukaz_sleva - poptavka.castka);
  if (doplatek <= 0) {
    return { error: "U téhle objednávky není co doplácet." };
  }

  const qr = pobyt?.cislo_uctu
    ? await generatePlatebniQr({
        cisloUctu: pobyt.cislo_uctu,
        castka: doplatek,
        variabilniSymbol: pobyt.variabilni_symbol,
        zpravaProPrijemce: poptavka.jmeno,
      })
    : null;

  const sablona = await nactiSablonu("doplatek", {
    jmeno: poptavka.jmeno,
    pobyt: poptavka.pobyt_nadpis ?? "",
    termin: pobyt?.termin ?? "",
    castka: formatKc(doplatek),
  });

  const odeslano = await posliZakaznici({
    to: poptavka.email,
    subject: sablona.predmet,
    nadpis: "Doplatek pobytu",
    odstavce: sablona.odstavce,
    radky: [
      { popisek: "Pobyt:", hodnota: poptavka.pobyt_nadpis ?? "—" },
      ...(pobyt?.termin ? [{ popisek: "Termín:", hodnota: pobyt.termin }] : []),
      ...(pobyt?.cena ? [{ popisek: "Cena pobytu:", hodnota: pobyt.cena }] : []),
      ...(poptavka.poukaz_sleva > 0
        ? [{ popisek: "Dárkový poukaz:", hodnota: `− ${formatKc(poptavka.poukaz_sleva)}` }]
        : []),
      { popisek: "Uhrazená záloha:", hodnota: formatKc(poptavka.castka) },
    ],
    platba: {
      nadpis: "Platební údaje",
      radky: [
        { popisek: "K doplacení:", hodnota: formatKc(doplatek) },
        ...(pobyt?.cislo_uctu ? [{ popisek: "Číslo účtu:", hodnota: pobyt.cislo_uctu }] : []),
        ...(pobyt?.variabilni_symbol
          ? [{ popisek: "Variabilní symbol:", hodnota: pobyt.variabilni_symbol }]
          : []),
        { popisek: "Poznámka pro příjemce:", hodnota: poptavka.jmeno },
      ],
      poznamka: [
        "Do poznámky pro příjemce prosím napiš svoje jméno a příjmení — podle toho platbu poznám.",
        ...(qr ? ["V příloze je QR kód na doplatek."] : []),
        ...(pobyt?.platebni_pokyny ? [pobyt.platebni_pokyny] : []),
      ],
    },
    zavěr: sablona.zaver,
    attachments: qrPriloha(qr, "qr-doplatek.png"),
  });

  await oznacitPoptavkaEmail(poptavka.id, !odeslano);
  if (!odeslano) {
    await oznamNeodeslano({
      komu: poptavka.email,
      co: "Výzva k doplatku",
      detail: [
        `Pobyt: ${poptavka.pobyt_nadpis ?? "—"}`,
        `Jméno: ${poptavka.jmeno}`,
        `Doplatek: ${formatKc(doplatek)}`,
      ],
    });
    return { error: "E-mail se nepodařilo odeslat." };
  }
  return { ok: true };
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Databáze není připojena." }, { status: 503 });
  }
  const { id, precteno, zaplaceno, akce } = (await request.json()) as {
    id?: number;
    precteno?: boolean;
    zaplaceno?: boolean;
    akce?: string;
  };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

  if (akce === "poslat-doplatek") {
    const vysledek = await posliVyzvuKDoplatku(id);
    if ("error" in vysledek) {
      return NextResponse.json({ error: vysledek.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  if (typeof zaplaceno === "boolean") {
    const zmeneno = await updatePoptavkaZaplaceno(id, zaplaceno);
    // E-mail jen při přechodu na „zaplaceno", ať se při vracení stavu
    // zpátky zákaznici nic neposílá.
    if (zmeneno && zaplaceno) await posliPotvrzeniPlatby(id);
    return NextResponse.json({ ok: true });
  }

  await updatePoptavkaPrecteno(id, precteno === true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Databáze není připojena." }, { status: 503 });
  }
  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deletePoptavka(id);
  return NextResponse.json({ ok: true });
}
