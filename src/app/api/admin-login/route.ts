import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminToken, adminAuthConfigured } from "@/lib/adminAuth";
import { verifyPassword } from "@/lib/passwordHash";
import { getAdminPasswordHash } from "@/lib/db";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

// Výchozí heslo do administrace, dokud si klientka v Nastavení nenastaví
// vlastní (to se pak uloží jako hash v databázi a má přednost).
// Nastavte ve Vercelu: ADMIN_PASSWORD=VaseHeslo
// Bez nastavené proměnné (a bez vlastního hesla uloženého v administraci)
// přihlášení záměrně selže — natvrdo napsané výchozí heslo by šlo přečíst
// přímo ve veřejném repozitáři na GitHubu.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  if (!checkRateLimit(`admin-login:${clientIp(request)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Příliš mnoho pokusů. Zkus to prosím za pár minut." },
      { status: 429 }
    );
  }

  const { password } = (await request.json()) as { password?: string };

  const storedHash = await getAdminPasswordHash();
  if ((!storedHash && !ADMIN_PASSWORD) || !adminAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Přihlášení do administrace není nastavené. Ve Vercelu přidej proměnné ADMIN_PASSWORD a ADMIN_COOKIE_SECRET.",
      },
      { status: 503 }
    );
  }

  const valid = storedHash
    ? verifyPassword(password ?? "", storedHash)
    : Boolean(password) && safeEquals(password!, ADMIN_PASSWORD!);

  if (!valid) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  const token = await createAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Přihlášení se nepovedlo. Zkus to prosím znovu." }, { status: 500 });
  }
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
