import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { ulozitEmailSablonu, smazatEmailSablonu, dbConfigured } from "@/lib/db";
import { SABLONY } from "@/lib/emailSablony";

// Upravené texty automatických e-mailů. Smazání šablony znamená návrat
// k původnímu znění z kódu, ne e-mail bez textu.

function unauthorized() {
  return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
}

function noDb() {
  return NextResponse.json(
    { error: "Databáze není připojena. Ve Vercelu: Storage → Create Database → Postgres." },
    { status: 503 }
  );
}

function znamyKlic(klic: unknown): klic is string {
  return typeof klic === "string" && SABLONY.some((s) => s.klic === klic);
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { klic, predmet, odstavce, zaver } = (await request.json()) as {
    klic?: string;
    predmet?: string;
    odstavce?: string;
    zaver?: string;
  };
  if (!znamyKlic(klic)) {
    return NextResponse.json({ error: "Neznámá šablona." }, { status: 400 });
  }

  await ulozitEmailSablonu({
    klic,
    predmet: (predmet ?? "").trim().slice(0, 200),
    odstavce: (odstavce ?? "").trim().slice(0, 5000),
    zaver: (zaver ?? "").trim().slice(0, 5000),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { klic } = (await request.json()) as { klic?: string };
  if (!znamyKlic(klic)) {
    return NextResponse.json({ error: "Neznámá šablona." }, { status: 400 });
  }
  await smazatEmailSablonu(klic);
  return NextResponse.json({ ok: true });
}
