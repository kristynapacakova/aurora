import { NextResponse } from "next/server";
import { createNewsletterSignup, dbConfigured } from "@/lib/db";

// Veřejný formulář (newsletter / lead magnet) — uloží e-mail do databáze,
// zobrazí se v administraci v sekci Newsletter i s exportem do CSV.
export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const trimmed = (email ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return NextResponse.json({ error: "E-mail nemá platný tvar." }, { status: 400 });
  }

  if (dbConfigured()) {
    await createNewsletterSignup(trimmed);
  }

  return NextResponse.json({ ok: true });
}
