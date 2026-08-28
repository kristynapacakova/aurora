import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import {
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
  return NextResponse.json({ ok: true });
}

// Ruční odečet z poukazu — pro to, co se neplatí přes web (živá lekce
// a podobně). Podmínky na platnost i zůstatek hlídá cerpatPoukaz.
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id, castka_kc, popis } = (await request.json()) as {
    id?: number;
    castka_kc?: number;
    popis?: string;
  };
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

// Vrácení odečtu zpět na poukaz (překlep, zrušená objednávka).
export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { cerpani_id } = (await request.json()) as { cerpani_id?: number };
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
