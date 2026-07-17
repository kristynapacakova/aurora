import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STUDIO_COOKIE_NAME, verifySessionToken } from "@/lib/studioAuth";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { SITE_COOKIE_NAME, verifySiteToken } from "@/lib/siteAuth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Administrace (/admin/*, /api/admin/*) — vlastní ochrana, mimo bránu webu ──
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/api/admin")) {
      // API routy si ověření admina hlídají samy (isAdminRequest uvnitř).
      return NextResponse.next();
    }
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }
  if (pathname === "/api/admin-login" || pathname === "/api/admin-logout") {
    return NextResponse.next();
  }

  // ── Brána vstupu — stránka s kódem a její API zůstávají volné ──
  if (pathname === "/vstup" || pathname === "/api/site-login") {
    return NextResponse.next();
  }

  // ── Web zatím není veřejný — vyžaduje přístupový kód ──
  const siteToken = request.cookies.get(SITE_COOKIE_NAME)?.value;
  const siteUnlocked = await verifySiteToken(siteToken);
  if (!siteUnlocked) {
    return NextResponse.redirect(new URL("/vstup", request.url));
  }

  // ── Členská sekce (/studium) — vlastní kód navíc ──
  if (pathname === "/studium" || pathname === "/studium/login") {
    if (pathname === "/studium/login") return NextResponse.next();
    const token = request.cookies.get(STUDIO_COOKIE_NAME)?.value;
    const valid = await verifySessionToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/studium/login", request.url));
    }
  }

  return NextResponse.next();
}

// Chrání celý veřejný web přístupovým kódem (/vstup), dokud není oficiálně
// spuštěný. Administrace (/admin, /api/admin/*) má vlastní samostatné
// heslo a branou webu neprochází. Statické soubory (obrázky, fonty, _next)
// jsou vyloučené, aby fungovala i samotná stránka /vstup.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico|woff2?)$).*)",
  ],
};
