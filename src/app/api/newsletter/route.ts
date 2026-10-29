import { NextResponse } from "next/server";
import { createNewsletterSignup, dbConfigured } from "@/lib/db";
import { posliKlientce, vetaProOdpoved } from "@/lib/email";
import {
  HONEYPOT_FIELD,
  isHoneypotTripped,
  FORM_LOADED_FIELD,
  isSubmittedTooFast,
  clamp,
  checkFormRateLimit,
} from "@/lib/formGuard";

// Veřejný formulář (newsletter / lead magnet) — uloží e-mail do databáze,
// zobrazí se v administraci v sekci Newsletter i s exportem do CSV.
// Zároveň o něm přijde notifikace, stejně jako u ostatních formulářů na webu;
// bez ní by přihlášení k odběru bylo jediné, co se stane potichu.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    [HONEYPOT_FIELD]?: string;
    [FORM_LOADED_FIELD]?: number;
  };

  if (isHoneypotTripped(body) || isSubmittedTooFast(body)) {
    return NextResponse.json({ ok: true });
  }
  if (!checkFormRateLimit(request, "newsletter")) {
    return NextResponse.json({ error: "Příliš mnoho pokusů. Zkus to prosím za chvíli." }, { status: 429 });
  }

  const trimmed = clamp((body.email ?? "").trim(), 200);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  if (dbConfigured()) {
    await createNewsletterSignup(trimmed);
  }

  // Notifikace nesmí shodit odpověď formuláři — e-mail už je uložený
  // a žena nemá co řešit, i kdyby se zrovna nepodařilo odeslat.
  try {
    await posliKlientce({
      subject: "💌 Nové přihlášení k odběru novinek",
      replyTo: trimmed,
      nadpis: "Někdo se přihlásil k odběru",
      odstavce: ["Na webu se někdo přihlásil k odběru novinek."],
      radky: [{ popisek: "E-mail:", hodnota: trimmed }],
      "zavěr": [
        "Všechny adresy najdeš v administraci v sekci Newsletter, odkud se dají stáhnout i jako soubor CSV.",
        vetaProOdpoved(),
      ],
    });
  } catch {
    // Úmyslně potichu — viz poznámka výš.
  }

  return NextResponse.json({ ok: true });
}
