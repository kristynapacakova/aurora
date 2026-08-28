import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { updateNastaveni, dbConfigured, type Nastaveni } from "@/lib/db";
import { czechAccountToIban } from "@/lib/platba";

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json(
      { error: "Databáze není připojena. Ve Vercelu: Storage → Create Database → Postgres." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as Partial<Nastaveni>;
  const fields: Nastaveni = {
    kontakt_email: (body.kontakt_email ?? "").trim(),
    telefon: (body.telefon ?? "").trim(),
    instagram_handle: (body.instagram_handle ?? "").trim(),
    instagram_url: (body.instagram_url ?? "").trim(),
    facebook_handle: (body.facebook_handle ?? "").trim(),
    facebook_url: (body.facebook_url ?? "").trim(),
    cena_lekce: (body.cena_lekce ?? "").trim(),
    cena_mesicni: (body.cena_mesicni ?? "").trim(),
    cena_rocni: (body.cena_rocni ?? "").trim(),
    uscreen_home: (body.uscreen_home ?? "").trim(),
    uscreen_signup: (body.uscreen_signup ?? "").trim(),
    uscreen_login: (body.uscreen_login ?? "").trim(),
    uscreen_plans: (body.uscreen_plans ?? "").trim(),
    domena_expiruje: (body.domena_expiruje ?? "").trim(),
    cislo_uctu_darky: (body.cislo_uctu_darky ?? "").trim(),
    poukaz_nadpis: (body.poukaz_nadpis ?? "").trim(),
    poukaz_popis: (body.poukaz_popis ?? "").trim(),
    poukaz_fotka: (body.poukaz_fotka ?? "").trim(),
    // Částky procházejí kontrolou tady, ne až u nákupu — jinak by šlo
    // vystavit poukaz na hodnotu, kterou pak formulář odmítne.
    poukaz_castky: (Array.isArray(body.poukaz_castky) ? body.poukaz_castky : [])
      .map((c) => ({
        popisek: String(c?.popisek ?? "").trim().slice(0, 60),
        hodnota_kc: Math.round(Number(c?.hodnota_kc) || 0),
      }))
      .filter((c) => c.hodnota_kc >= 100 && c.hodnota_kc <= 100000),
  };

  if (fields.cislo_uctu_darky && !czechAccountToIban(fields.cislo_uctu_darky)) {
    return NextResponse.json(
      { error: "Číslo účtu pro dárkové poukazy nemá platný tvar (např. 123456789/0800)." },
      { status: 400 }
    );
  }

  await updateNastaveni(fields);
  return NextResponse.json({ ok: true });
}
