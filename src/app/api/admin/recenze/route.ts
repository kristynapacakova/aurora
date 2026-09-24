import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  createRecenze,
  updateRecenze,
  updateRecenzeZverejneno,
  deleteRecenze,
  dbConfigured,
} from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
}

function noDb() {
  return NextResponse.json({ error: "Databáze není připojena." }, { status: 503 });
}

// Vlastní recenze vložená rovnou z administrace — třeba když ji někdo pošle
// zprávou na Instagramu. Vkládá se rovnou zveřejněná.
export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const b = (await request.json()) as {
    jmeno?: string;
    misto?: string;
    text?: string;
  };
  const jmeno = (b.jmeno ?? "").trim();
  const text = (b.text ?? "").trim();
  if (!jmeno || !text) {
    return NextResponse.json({ error: "Vyplň jméno a text recenze." }, { status: 400 });
  }

  const id = await createRecenze({
    jmeno,
    misto: (b.misto ?? "").trim(),
    text,
    tri_slova: "",
    email: "",
    zverejneno: true,
  });
  return NextResponse.json({ ok: true, id });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const b = (await request.json()) as {
    id?: number;
    zverejneno?: boolean;
    jmeno?: string;
    misto?: string;
    text?: string;
  };
  if (!b.id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

  if (typeof b.zverejneno === "boolean") {
    await updateRecenzeZverejneno(b.id, b.zverejneno);
    return NextResponse.json({ ok: true });
  }

  const jmeno = (b.jmeno ?? "").trim();
  const text = (b.text ?? "").trim();
  if (!jmeno || !text) {
    return NextResponse.json({ error: "Vyplň jméno a text recenze." }, { status: 400 });
  }
  await updateRecenze(b.id, {
    jmeno,
    misto: (b.misto ?? "").trim(),
    text,
    tri_slova: "",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deleteRecenze(id);
  return NextResponse.json({ ok: true });
}
