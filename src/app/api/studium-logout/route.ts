import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME } from "@/lib/studioAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(STUDIO_COOKIE_NAME);
  return response;
}
