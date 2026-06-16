import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { STUDIO_COOKIE_NAME, verifySessionToken } from "@/lib/studioAuth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(STUDIO_COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    return NextResponse.redirect(new URL("/studium/login", request.url));
  }

  return NextResponse.next();
}

// Proxy chrání pouze přímo /studium, přihlašovací stránka
// /studium/login zůstává volně přístupná.
export const config = {
  matcher: ["/studium"],
};
