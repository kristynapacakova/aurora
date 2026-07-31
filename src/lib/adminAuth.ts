import { createSecureToken, verifySecureToken, hasConfiguredSecret } from "./secureToken";

export const ADMIN_COOKIE_NAME = "admin_session";

const SESSION_VALUE = "admin-unlocked";
const ENV_VARS = ["ADMIN_COOKIE_SECRET"];
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dní — stejně jako maxAge cookie

export function adminAuthConfigured(): boolean {
  return hasConfiguredSecret(ENV_VARS);
}

// Vrátí null, pokud ADMIN_COOKIE_SECRET není nastavený — volající (login
// routa) to musí ošetřit zvlášť, dřív než se pokusí heslo ověřovat.
export async function createAdminToken(): Promise<string | null> {
  return createSecureToken(ENV_VARS, SESSION_VALUE);
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  return verifySecureToken(ENV_VARS, SESSION_VALUE, token, MAX_AGE_MS);
}

// Ověření admin session přímo z Request (pro API routy).
export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`)
  );
  return verifyAdminToken(match?.[1]);
}
