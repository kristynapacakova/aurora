import { NextResponse } from "next/server";
import { createNewsletterSignup, dbConfigured } from "@/lib/db";
import { HONEYPOT_FIELD, isHoneypotTripped, clamp, checkFormRateLimit } from "@/lib/formGuard";

// Veřejný formulář (newsletter / lead magnet) — uloží e-mail do databáze,
// zobrazí se v administraci v sekci Newsletter i s exportem do CSV.
export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; [HONEYPOT_FIELD]?: string };

  if (isHoneypotTripped(body)) {
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

  return NextResponse.json({ ok: true });
}
