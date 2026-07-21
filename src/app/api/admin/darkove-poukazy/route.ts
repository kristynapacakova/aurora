import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { updateDarkovyPoukazStav, deleteDarkovyPoukaz, dbConfigured } from "@/lib/db";

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

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deleteDarkovyPoukaz(id);
  return NextResponse.json({ ok: true });
}
