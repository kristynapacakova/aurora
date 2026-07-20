import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { hashPassword } from "@/lib/passwordHash";
import { setAdminPasswordHash, dbConfigured } from "@/lib/db";

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json(
      { error: "Databáze není připojena. Ve Vercelu: Storage → Create Database → Postgres." },
      { status: 503 }
    );
  }

  const { heslo } = (await request.json()) as { heslo?: string };
  if (!heslo || heslo.length < 6) {
    return NextResponse.json({ error: "Heslo musí mít aspoň 6 znaků." }, { status: 400 });
  }

  await setAdminPasswordHash(hashPassword(heslo));
  return NextResponse.json({ ok: true });
}
