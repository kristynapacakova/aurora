import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";

// Chrání administraci. Web samotný je veřejný — přístupový kód, který ho
// držel schovaný před spuštěním (1. 11. 2026), byl odstraněn i se stránkou
// /vstup a jejím API. V historii gitu je, kdyby se někdy hodil znovu.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Přihlašovací stránka musí zůstat dostupná, jinak se nejde přihlásit.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// Jen administrace. Routy /api/admin/* tu schválně nejsou — ověřují si
// přihlášení samy přes isAdminRequest a díky tomu proxy neběží při každém
// požadavku na veřejný web.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
