import { NextResponse } from "next/server";
import { createRecenze, dbConfigured } from "@/lib/db";
import { posliKlientce, vetaProOdpoved } from "@/lib/email";
import {
  HONEYPOT_FIELD,
  isHoneypotTripped,
  FORM_LOADED_FIELD,
  isSubmittedTooFast,
  clamp,
  checkFormRateLimit,
} from "@/lib/formGuard";

// Veřejný formulář pro recenzi od ženy, která chodí na lekce. Recenze se
// uloží jako nezveřejněná a na web ji pustí až klientka v administraci — na
// formulář bez schvalování by dřív nebo později přišel spam.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    jmeno?: string;
    misto?: string;
    text?: string;
    email?: string;
    souhlas?: boolean;
    [HONEYPOT_FIELD]?: string;
    [FORM_LOADED_FIELD]?: number;
  };

  if (isHoneypotTripped(body) || isSubmittedTooFast(body)) {
    return NextResponse.json({ ok: true });
  }
  if (!checkFormRateLimit(request, "recenze")) {
    return NextResponse.json(
      { error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." },
      { status: 429 }
    );
  }

  const jmeno = clamp((body.jmeno ?? "").trim(), 80);
  const misto = clamp((body.misto ?? "").trim(), 80);
  const text = clamp((body.text ?? "").trim(), 4000);
  const email = clamp((body.email ?? "").trim(), 200);

  if (!jmeno || !text) {
    return NextResponse.json(
      { error: "Vyplň prosím jméno a text recenze." },
      { status: 400 }
    );
  }
  if (text.length < 40) {
    return NextResponse.json(
      { error: "Napiš prosím pár vět, ať má recenze co říct." },
      { status: 400 }
    );
  }
  // Zveřejňujeme jméno i text, takže bez souhlasu to dál nejde.
  if (body.souhlas !== true) {
    return NextResponse.json(
      { error: "Potvrď prosím souhlas se zveřejněním." },
      { status: 400 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  if (!dbConfigured()) {
    return NextResponse.json(
      { error: "Recenze teď nejde přijímat. Zkus to prosím později." },
      { status: 503 }
    );
  }

  await createRecenze({ jmeno, misto, text, tri_slova: "", email, zverejneno: false });

  await posliKlientce({
    subject: `💬 Nová recenze od ${jmeno}`,
    replyTo: email || undefined,
    nadpis: "Nová recenze čeká na schválení",
    odstavce: [
      "Někdo poslal recenzi přes formulář na webu. Na web se ukáže, až ji v administraci zveřejníš.",
    ],
    radky: [
      { popisek: "Jméno:", hodnota: jmeno },
      { popisek: "Odkud:", hodnota: misto || "—" },
      { popisek: "E-mail:", hodnota: email || "—" },
    ],
    zprava: text,
    "zavěr": [
      "Recenzi najdeš v administraci v sekci Recenze. Můžeš ji před zveřejněním i upravit.",
      vetaProOdpoved(),
    ],
  });

  return NextResponse.json({ ok: true });
}
