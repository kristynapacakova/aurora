import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { posliZkusebni, adresaKlientky } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

// Zkušební e-mail z administrace. Chodí jen na zadanou adresu a vrací
// skutečnou chybu od Resendu — jinak by se nedalo poznat, proč nic nedorazilo.
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  // I za přihlášením — ať se přes tenhle endpoint nedá rozesílat.
  if (!checkRateLimit(`test-email:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Příliš mnoho zkušebních e-mailů. Zkus to prosím za hodinu." },
      { status: 429 }
    );
  }

  const { email } = (await request.json()) as { email?: string };
  const to = (email ?? "").trim() || adresaKlientky() || "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Zadej platnou e-mailovou adresu." }, { status: 400 });
  }

  const vysledek = await posliZkusebni(to);
  if (!vysledek.ok) {
    return NextResponse.json({ error: vysledek.chyba ?? "Odeslání se nepovedlo." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, to });
}
