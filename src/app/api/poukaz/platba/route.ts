import { NextResponse } from "next/server";
import { ohlasitPlatbuPoukazu, getDarkovyPoukazByKod, dbConfigured } from "@/lib/db";
import { posliKlientce } from "@/lib/email";
import { clamp, checkFormRateLimit } from "@/lib/formGuard";

// Zákaznice po objednávce klikne, že platbu odeslala. Peníze tím nikdo
// nepotvrzuje — klientka je pořád musí vidět na účtu — ale ví, na co čekat.
export async function POST(request: Request) {
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Poukazy nejsou dostupné." }, { status: 503 });
  }
  if (!checkFormRateLimit(request, "poukaz-platba")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů." }, { status: 429 });
  }

  const { kod } = (await request.json()) as { kod?: string };
  const cistyKod = clamp((kod ?? "").trim(), 40);
  if (!cistyKod) return NextResponse.json({ error: "Chybí kód." }, { status: 400 });

  const ohlaseno = await ohlasitPlatbuPoukazu(cistyKod);
  if (!ohlaseno) {
    // Buď kód neexistuje, nebo je poukaz už zaplacený — v obou případech
    // nemá smysl posílat klientce další e-mail.
    return NextResponse.json({ ok: true });
  }

  const poukaz = await getDarkovyPoukazByKod(cistyKod);
  if (poukaz) {
    await posliKlientce({
      subject: `💸 Zákaznice odeslala platbu za poukaz ${poukaz.kod}`,
      replyTo: poukaz.email_kupujici,
      nadpis: "Platba za poukaz je na cestě",
      odstavce: [
        "Zákaznice potvrdila, že platbu odeslala. Až ji uvidíš na účtu, označ poukaz v administraci jako zaplacený — tím jí odejde e-mail s kódem.",
      ],
      radky: [
        { popisek: "Kód:", hodnota: poukaz.kod },
        { popisek: "Hodnota:", hodnota: poukaz.hodnota },
        { popisek: "Variabilní symbol:", hodnota: poukaz.variabilni_symbol },
        { popisek: "Kupující:", hodnota: poukaz.jmeno_kupujici },
        { popisek: "E-mail:", hodnota: poukaz.email_kupujici },
      ],
    });
  }

  return NextResponse.json({ ok: true });
}
