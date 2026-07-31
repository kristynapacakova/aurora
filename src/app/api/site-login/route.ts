import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { SITE_COOKIE_NAME, createSiteToken, siteAuthConfigured } from "@/lib/siteAuth";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

// Přístupový kód pro celý web, dokud není oficiálně spuštěný.
// Nastavte ve Vercelu: SITE_ACCESS_CODE=VasKod
// Bez nastavené proměnné přihlášení záměrně selže — natvrdo napsané
// výchozí heslo by šlo přečíst přímo ve veřejném repozitáři na GitHubu.
const ACCESS_CODE = process.env.SITE_ACCESS_CODE;

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  if (!ACCESS_CODE || !siteAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Vstup na web není nastavený. Ve Vercelu přidej proměnné SITE_ACCESS_CODE a SITE_COOKIE_SECRET.",
      },
      { status: 503 }
    );
  }

  if (!checkRateLimit(`site-login:${clientIp(request)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Příliš mnoho pokusů. Zkus to prosím za pár minut." },
      { status: 429 }
    );
  }

  const { code } = (await request.json()) as { code?: string };

  if (!code || !safeEquals(code, ACCESS_CODE)) {
    return NextResponse.json(
      { error: "Nesprávný přístupový kód." },
      { status: 401 }
    );
  }

  const token = await createSiteToken();
  if (!token) {
    return NextResponse.json({ error: "Přihlášení se nepovedlo. Zkus to prosím znovu." }, { status: 500 });
  }
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SITE_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dní
  });

  return response;
}
