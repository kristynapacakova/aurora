import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { deletePoptavka, updatePoptavkaPrecteno, dbConfigured } from "@/lib/db";

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Databáze není připojena." }, { status: 503 });
  }
  const { id, precteno } = (await request.json()) as { id?: number; precteno?: boolean };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await updatePoptavkaPrecteno(id, precteno === true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ error: "Databáze není připojena." }, { status: 503 });
  }
  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deletePoptavka(id);
  return NextResponse.json({ ok: true });
}
