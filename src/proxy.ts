import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STUDIO_COOKIE_NAME, verifySessionToken } from "@/lib/studioAuth";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/studium") {
    const token = request.cookies.get(STUDIO_COOKIE_NAME)?.value;
    const valid = await verifySessionToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/studium/login", request.url));
    }
  }

  if (pathname === "/aurora-admin") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const valid = await verifyAdminToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/aurora-admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studium", "/aurora-admin"],
};
