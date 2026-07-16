import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { createClanek, updateClanek, deleteClanek, dbConfigured } from "@/lib/db";

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
  text?: string;
  zverejneno?: boolean;
};

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const body = (await request.json()) as Body;
  const nadpis = (body.nadpis ?? "").trim();
  const text = (body.text ?? "").trim();
  if (!nadpis) {
    return NextResponse.json({ error: "Nadpis je povinný." }, { status: 400 });
  }
  const clanek = await createClanek(nadpis, text, body.zverejneno !== false);
  return NextResponse.json({ ok: true, clanek });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const body = (await request.json()) as Body;
  if (!body.id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  const nadpis = (body.nadpis ?? "").trim();
  if (!nadpis) {
    return NextResponse.json({ error: "Nadpis je povinný." }, { status: 400 });
  }
  await updateClanek(body.id, nadpis, (body.text ?? "").trim(), body.zverejneno !== false);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deleteClanek(id);
  return NextResponse.json({ ok: true });
}
