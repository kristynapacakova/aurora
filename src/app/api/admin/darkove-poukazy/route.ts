import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { posliZakaznici, oznamNeodeslano } from "@/lib/email";
import { nactiSablonu } from "@/lib/emailSablonyServer";
import { prilohaZUrl } from "@/lib/qrPriloha";
import { formatKc } from "@/lib/castky";
import {
  createDarkovyPoukaz,
  updateDarkovyPoukazFotka,
  updateDarkovyPoukazHodnota,
  oznacitPoukazEmail,
  getDarkovyPoukazById,
  updateDarkovyPoukazStav,
  deleteDarkovyPoukaz,
  cerpatPoukaz,
  vratitCerpani,
  dbConfigured,
} from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
}

function noDb() {
  return NextResponse.json(
    { error: "Databáze není připojena. Ve Vercelu: Storage → Create Database → Postgres." },
    { status: 503 }
  );
}

// E-mail s kódem. Posílá se ve chvíli, kdy poukaz začne platit — ať už
// klientka potvrdila platbu, nebo poukaz rovnou vystavila jako zaplacený.
// Případné selhání e-mailu nesmí shodit uložení, proto se volá až po něm
// a chyby si polyká modul e-mailů.
async function posliKodPoukazu(id: number): Promise<void> {
  const poukaz = await getDarkovyPoukazById(id);
  if (!poukaz) return;
  const sablona = await nactiSablonu("poukaz-kod", {
    jmeno: poukaz.jmeno_kupujici,
    kod: poukaz.kod,
    castka: poukaz.hodnota,
    plati_do: poukaz.plati_do ? new Date(poukaz.plati_do).toLocaleDateString("cs-CZ") : "",
  });

  const odeslano = await posliZakaznici({
    to: poukaz.email_kupujici,
    subject: sablona.predmet,
    nadpis: "Poukaz je připravený",
    odstavce: sablona.odstavce,
    obrazek: poukaz.fotka || undefined,
    radky: [
      { popisek: "Kód poukazu:", hodnota: poukaz.kod },
      { popisek: "Hodnota:", hodnota: poukaz.hodnota },
      ...(poukaz.plati_do
        ? [
            {
              popisek: "Platí do:",
              hodnota: new Date(poukaz.plati_do).toLocaleDateString("cs-CZ"),
            },
          ]
        : []),
    ],
    zavěr: sablona.zaver,
    // Grafika té konkrétní hodnoty jde i jako soubor — vložený obrázek si
    // pošta často nestáhne a poukaz se stejně hodí vytisknout či přeposlat.
    attachments: await prilohaZUrl(poukaz.fotka, `darkovy-poukaz-${poukaz.kod}`),
  });

  // Bez kódu je poukaz zákaznici k ničemu, proto se selhání zaznamená
  // a klientce přijde upozornění. Povedené odeslání značku zase smaže,
  // takže tlačítko „Poslat kód znovu" ji umí uklidit.
  await oznacitPoukazEmail(poukaz.id, !odeslano);
  if (!odeslano) {
    await oznamNeodeslano({
      komu: poukaz.email_kupujici,
      co: "Dárkový poukaz — kód",
      detail: [
        `Kód: ${poukaz.kod}`,
        `Hodnota: ${poukaz.hodnota}`,
        `Kupující: ${poukaz.jmeno_kupujici}`,
      ],
    });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id, zaplaceno, vyuzito } = (await request.json()) as {
    id?: number;
    zaplaceno?: boolean;
    vyuzito?: boolean;
  };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await updateDarkovyPoukazStav(id, { zaplaceno, vyuzito });

  // Označení platby je okamžik, kdy poukaz začne platit — kupující proto
  // teprve teď dostane kód.
  if (zaplaceno === true) await posliKodPoukazu(id);

  return NextResponse.json({ ok: true });
}

// POST slouží dvěma věcem podle pole „akce":
//   • bez akce (nebo „cerpat") — ruční odečet z poukazu,
//   • „zalozit" — vystavení nového poukazu přímo z administrace.
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const telo = (await request.json()) as {
    akce?: string;
    id?: number;
    castka_kc?: number;
    popis?: string;
    hodnota_kc?: number;
    jmeno_kupujici?: string;
    email_kupujici?: string;
    telefon_kupujici?: string;
    jmeno_obdarovane?: string;
    vzkaz?: string;
    fotka?: string;
    zaplaceno?: boolean;
  };

  if (telo.akce === "zalozit") {
    const hodnotaKc = Math.round(Number(telo.hodnota_kc) || 0);
    if (hodnotaKc < 100 || hodnotaKc > 100000) {
      return NextResponse.json(
        { error: "Zadej hodnotu poukazu mezi 100 a 100 000 Kč." },
        { status: 400 }
      );
    }
    const emailKupujici = (telo.email_kupujici ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKupujici)) {
      return NextResponse.json({ error: "Zadej platný e-mail." }, { status: 400 });
    }

    const poukaz = await createDarkovyPoukaz({
      hodnota: formatKc(hodnotaKc),
      hodnota_kc: hodnotaKc,
      fotka: (telo.fotka ?? "").trim(),
      jmeno_kupujici: (telo.jmeno_kupujici ?? "").trim() || "—",
      email_kupujici: emailKupujici,
      telefon_kupujici: (telo.telefon_kupujici ?? "").trim(),
      jmeno_obdarovane: (telo.jmeno_obdarovane ?? "").trim(),
      vzkaz: (telo.vzkaz ?? "").trim(),
    });

    // Poukaz vystavený v administraci bývá už zaplacený (hotovost, dárek),
    // tak ho rovnou aktivujeme a pošleme kód — stejná cesta jako u platby
    // potvrzené ručně.
    if (telo.zaplaceno) {
      await updateDarkovyPoukazStav(poukaz.id, { zaplaceno: true });
      await posliKodPoukazu(poukaz.id);
    }
    return NextResponse.json({ ok: true, kod: poukaz.kod });
  }

  const { id, castka_kc, popis } = telo;
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

  const castka = Math.round(Number(castka_kc) || 0);
  if (castka <= 0) {
    return NextResponse.json({ error: "Zadej částku k odečtení." }, { status: 400 });
  }

  const zbyva = await cerpatPoukaz({
    poukaz_id: id,
    castka_kc: castka,
    popis: (popis ?? "").trim().slice(0, 500) || "Ruční odečet",
  });
  if (zbyva === null) {
    return NextResponse.json(
      { error: "Odečíst nešlo — poukaz není zaplacený, propadl, nebo na něm tolik nezbývá." },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true, zustatek_kc: zbyva });
}

// Vrácení odečtu zpět na poukaz (překlep, zrušená objednávka) nebo
// doplnění grafiky k poukazu, který si někdo koupil přes web.
export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { cerpani_id, id, fotka, hodnota_kc, akce } = (await request.json()) as {
    cerpani_id?: number;
    id?: number;
    fotka?: string;
    hodnota_kc?: number;
    akce?: string;
  };

  if (typeof fotka === "string" && id) {
    await updateDarkovyPoukazFotka(id, fotka.trim());
    return NextResponse.json({ ok: true });
  }

  // Opětovné odeslání kódu — po opravě adresy nebo když e-mail poprvé
  // neprošel. Jde jen u zaplaceného poukazu, dřív kód neexistuje.
  if (akce === "poslat-kod" && id) {
    const poukaz = await getDarkovyPoukazById(id);
    if (!poukaz?.zaplaceno) {
      return NextResponse.json(
        { error: "Kód jde poslat až u zaplaceného poukazu." },
        { status: 400 }
      );
    }
    await posliKodPoukazu(id);
    return NextResponse.json({ ok: true });
  }

  if (typeof hodnota_kc === "number" && id) {
    const castka = Math.round(hodnota_kc);
    if (castka < 100 || castka > 100000) {
      return NextResponse.json(
        { error: "Hodnota musí být mezi 100 a 100 000 Kč." },
        { status: 400 }
      );
    }
    const zmeneno = await updateDarkovyPoukazHodnota(id, formatKc(castka), castka);
    if (!zmeneno) {
      return NextResponse.json(
        { error: "Hodnotu jde změnit jen u poukazu, který ještě není zaplacený." },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (!cerpani_id) return NextResponse.json({ error: "Chybí id čerpání." }, { status: 400 });
  await vratitCerpani(cerpani_id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deleteDarkovyPoukaz(id);
  return NextResponse.json({ ok: true });
}
