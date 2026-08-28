import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import {
  createPoukazNabidka,
  updatePoukazNabidka,
  deletePoukazNabidka,
  dbConfigured,
  type PoukazCastka,
} from "@/lib/db";

// Poukazy vystavené na web k prodeji. Konkrétní zakoupené poukazy s kódy
// jsou jinde (/api/admin/darkove-poukazy).

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
  popis?: string;
  fotka?: string;
  castky?: PoukazCastka[];
  zverejneno?: boolean;
};

function parseFields(body: Body) {
  return {
    nadpis: (body.nadpis ?? "").trim(),
    popis: (body.popis ?? "").trim(),
    fotka: (body.fotka ?? "").trim(),
    // Částky se čistí tady, ne až u nákupu — jinak by šlo vystavit poukaz
    // na hodnotu, kterou by pak formulář odmítl.
    castky: (Array.isArray(body.castky) ? body.castky : [])
      .map((c) => ({
        popisek: String(c?.popisek ?? "").trim().slice(0, 60),
        hodnota_kc: Math.round(Number(c?.hodnota_kc) || 0),
      }))
      .filter((c) => c.hodnota_kc >= 100 && c.hodnota_kc <= 100000),
    zverejneno: body.zverejneno !== false,
  };
}

function validate(fields: ReturnType<typeof parseFields>): string | null {
  if (!fields.nadpis) return "Nadpis je povinný.";
  if (fields.castky.length === 0) {
    return "Přidej aspoň jednu částku mezi 100 a 100 000 Kč.";
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const fields = parseFields((await request.json()) as Body);
  const chyba = validate(fields);
  if (chyba) return NextResponse.json({ error: chyba }, { status: 400 });

  const nabidka = await createPoukazNabidka(fields);
  return NextResponse.json({ ok: true, nabidka });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const body = (await request.json()) as Body;
  if (!body.id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

  const fields = parseFields(body);
  const chyba = validate(fields);
  if (chyba) return NextResponse.json({ error: chyba }, { status: 400 });

  await updatePoukazNabidka(body.id, fields);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deletePoukazNabidka(id);
  return NextResponse.json({ ok: true });
}
