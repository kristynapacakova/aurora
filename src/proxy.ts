import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STUDIO_COOKIE_NAME, verifySessionToken } from "@/lib/studioAuth";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Administrace (/admin/*) ──
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // ── Členská sekce (/studium) ──
  const token = request.cookies.get(STUDIO_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    return NextResponse.redirect(new URL("/studium/login", request.url));
  }

  return NextResponse.next();
}

// Proxy chrání členskou sekci /studium a administraci /admin.
// Přihlašovací stránky /studium/login a /admin/login zůstávají volné.
export const config = {
  matcher: ["/studium", "/admin/:path*"],
};
