import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { ulozitPravniText, smazatPravniText, dbConfigured } from "@/lib/db";
import { PRAVNI_TEXTY } from "@/lib/pravniTexty";

function unauthorized() {
  return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ error: "Databáze není připojena." }, { status: 503 });
}

function znamyKlic(klic: unknown): klic is string {
  return typeof klic === "string" && PRAVNI_TEXTY.some((s) => s.klic === klic);
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { klic, platne_od, text } = (await request.json()) as {
    klic?: string;
    platne_od?: string;
    text?: string;
  };
  if (!znamyKlic(klic)) {
    return NextResponse.json({ error: "Neznámá stránka." }, { status: 400 });
  }
  if (!(text ?? "").trim()) {
    return NextResponse.json({ error: "Text nesmí být prázdný." }, { status: 400 });
  }

  await ulozitPravniText(klic, (platne_od ?? "").trim(), (text ?? "").trim());
  return NextResponse.json({ ok: true });
}

// Vrátí stránku k výchozímu znění z kódu.
export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { klic } = (await request.json()) as { klic?: string };
  if (!znamyKlic(klic)) {
    return NextResponse.json({ error: "Neznámá stránka." }, { status: 400 });
  }
  await smazatPravniText(klic);
  return NextResponse.json({ ok: true });
}
