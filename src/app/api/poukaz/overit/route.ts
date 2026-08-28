import { NextResponse } from "next/server";
import { getPobyt, dbConfigured } from "@/lib/db";
import { generatePlatebniQr } from "@/lib/platba";
import { rozpadSPoukazem } from "@/lib/castky";
import { overitPoukaz, POUKAZ_HLASKY } from "@/lib/poukaz";
import { clamp, checkFormRateLimit } from "@/lib/formGuard";

// Ověří kód poukazu a vrátí přepočítané částky i QR kódy pro daný pobyt.
// QR se generuje tady na serveru schválně — knihovna na QR kódy je velká
// a nemá smysl ji posílat do prohlížeče každé návštěvnici.
export async function POST(request: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Poukazy nejsou dostupné." }, { status: 503 });
  }
  // Bez limitu by šlo kódy zkoušet hrubou silou.
  if (!checkFormRateLimit(request, "poukaz")) {
    return NextResponse.json(
      { error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." },
      { status: 429 }
    );
  }

  const body = (await request.json()) as { kod?: string; pobyt_id?: number };
  const kod = clamp((body.kod ?? "").trim(), 40);

  const vysledek = await overitPoukaz(kod);
  if (!vysledek.ok) {
    return NextResponse.json({ error: POUKAZ_HLASKY[vysledek.duvod] }, { status: 400 });
  }

  const pobyt = typeof body.pobyt_id === "number" ? await getPobyt(body.pobyt_id) : null;
  if (!pobyt || !pobyt.zverejneno) {
    return NextResponse.json({ error: "Pobyt se nepodařilo najít." }, { status: 400 });
  }

  const rozpad = rozpadSPoukazem({
    cena: pobyt.cena,
    zalohaProcento: pobyt.zaloha_procento,
    zustatekPoukazu: vysledek.zustatek,
  });

  if (rozpad.sleva <= 0) {
    return NextResponse.json(
      { error: "U tohohle pobytu nejde poukaz uplatnit — nepodařilo se z ceny určit částku." },
      { status: 400 }
    );
  }

  const [qrCela, qrZaloha] = await Promise.all([
    rozpad.poSleve > 0
      ? generatePlatebniQr({
          cisloUctu: pobyt.cislo_uctu,
          castka: rozpad.poSleve,
          variabilniSymbol: pobyt.variabilni_symbol,
        })
      : Promise.resolve(null),
    rozpad.zaloha
      ? generatePlatebniQr({
          cisloUctu: pobyt.cislo_uctu,
          castka: rozpad.zaloha,
          variabilniSymbol: pobyt.variabilni_symbol,
        })
      : Promise.resolve(null),
  ]);

  return NextResponse.json({
    ok: true,
    kod: vysledek.poukaz.kod,
    zustatek: vysledek.zustatek,
    platiDo: vysledek.poukaz.plati_do,
    sleva: rozpad.sleva,
    poSleve: rozpad.poSleve,
    zaloha: rozpad.zaloha,
    doplatek: rozpad.doplatek,
    zalohaProcento: rozpad.zaloha ? rozpad.procento : 0,
    qrCela: qrCela ?? null,
    qrZaloha: qrZaloha ?? null,
  });
}
