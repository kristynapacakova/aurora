import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminToken } from "@/lib/adminAuth";

// Heslo do administrace. Nastavte ve Vercelu: ADMIN_PASSWORD=VaseHeslo
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Aurora2026";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  const token = await createAdminToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dní
  });

  return response;
}
