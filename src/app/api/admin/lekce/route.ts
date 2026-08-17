import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { createLekce, updateLekce, deleteLekce, dbConfigured } from "@/lib/db";
import { jeDen } from "@/lib/dny";

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
  den?: string;
  misto?: string;
  cas?: string;
  poznamka?: string;
  zverejneno?: boolean;
};

function parseFields(body: Body) {
  return {
    den: (body.den ?? "").trim(),
    misto: (body.misto ?? "").trim(),
    cas: (body.cas ?? "").trim(),
    poznamka: (body.poznamka ?? "").trim(),
    zverejneno: body.zverejneno !== false,
  };
}

/** Den musí být ze seznamu — podle něj se lekce na webu řadí. */
function validate(fields: ReturnType<typeof parseFields>): string | null {
  if (!jeDen(fields.den)) return "Vyber den v týdnu.";
  if (!fields.misto) return "Místo je povinné.";
  if (!fields.cas) return "Čas je povinný.";
  return null;
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const fields = parseFields((await request.json()) as Body);
  const error = validate(fields);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const lekce = await createLekce(fields);
  return NextResponse.json({ ok: true, lekce });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const body = (await request.json()) as Body;
  if (!body.id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });

  const fields = parseFields(body);
  const error = validate(fields);
  if (error) return NextResponse.json({ error }, { status: 400 });

  await updateLekce(body.id, fields);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  if (!dbConfigured()) return noDb();

  const { id } = (await request.json()) as { id?: number };
  if (!id) return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  await deleteLekce(id);
  return NextResponse.json({ ok: true });
}
