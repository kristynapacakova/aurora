import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME, createSessionToken } from "@/lib/studioAuth";

// Přístupový kód pro členskou sekci /studium.
// Nastavte v .env.local: STUDIO_ACCESS_CODE=VasKod
const ACCESS_CODE = process.env.STUDIO_ACCESS_CODE ?? "Namaste2026";

export async function POST(request: Request) {
  const { code } = await request.json();

  if (code !== ACCESS_CODE) {
    return NextResponse.json(
      { error: "Nesprávný přístupový kód." },
      { status: 401 }
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });

  response.cookies.set(STUDIO_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dní
  });

  return response;
}
