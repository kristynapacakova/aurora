import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { createPobyt, updatePobyt, deletePobyt, dbConfigured } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
}

function noDb() {
  return NextResponse.json(
    { error: "Databáze není připojena. Ve Vercelu: Storage → Create Database → Postgres." },
    { status: 503 }
  );
}

type Body = {
  id?: number;
  nadpis?: string;
  misto?: string;
  termin?: string;
  popis?: string;
  cena?: string;
  fotky?: string[];
  zverejneno?: boolean;
};

function parseFields(body: Body) {
  return {
    nadpis: (body.nadpis ?? "").trim(),
    misto: (body.misto ?? "").trim(),
    termin: (body.termin ?? "").trim(),
    popis: (body.popis ?? "").trim(),
    cena: (body.cena ?? "").trim(),
    fotky: Array.isArray(body.fotky) ? body.fotky : [],
    zverejneno: body.zverejneno !== false,
  };
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const body = (await request.json()) as Body;
  const fields = parseFields(body);
  if (!fields.nadpis) {
    return NextResponse.json({ error: "Nadpis je povinný." }, { status: 400 });
  }
  const pobyt = await createPobyt(fields);
  return NextResponse.json({ ok: true, pobyt });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const body = (await request.json()) as Body;
  if (!body.id) {
    return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  }
  const fields = parseFields(body);
  if (!fields.nadpis) {
    return NextResponse.json({ error: "Nadpis je povinný." }, { status: 400 });
  }
  await updatePobyt(body.id, fields);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deletePobyt(id);
  return NextResponse.json({ ok: true });
}
