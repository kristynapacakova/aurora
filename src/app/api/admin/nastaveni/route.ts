import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { updateNastaveni, dbConfigured, type Nastaveni } from "@/lib/db";

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
    instagram_handle: (body.instagram_handle ?? "").trim(),
    instagram_url: (body.instagram_url ?? "").trim(),
    cena_lekce: (body.cena_lekce ?? "").trim(),
    cena_mesicni: (body.cena_mesicni ?? "").trim(),
    cena_rocni: (body.cena_rocni ?? "").trim(),
    uscreen_home: (body.uscreen_home ?? "").trim(),
    uscreen_signup: (body.uscreen_signup ?? "").trim(),
    uscreen_login: (body.uscreen_login ?? "").trim(),
    uscreen_plans: (body.uscreen_plans ?? "").trim(),
    domena_expiruje: (body.domena_expiruje ?? "").trim(),
  };

  await updateNastaveni(fields);
  return NextResponse.json({ ok: true });
}
