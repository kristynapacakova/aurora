import { createSecureToken, verifySecureToken, hasConfiguredSecret } from "./secureToken";

export const STUDIO_COOKIE_NAME = "studio_session";

const SESSION_VALUE = "unlocked";
const ENV_VARS = ["STUDIO_COOKIE_SECRET"];
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dní — stejně jako maxAge cookie

export function studioAuthConfigured(): boolean {
  return hasConfiguredSecret(ENV_VARS);
}

// Vytvoří podepsaný token pro session cookie. Token nenese žádná citlivá
// data, jen potvrzuje, že byl vystaven serverem (na základě tajného klíče
// STUDIO_COOKIE_SECRET) a kdy byl vydán. Vrátí null, pokud
// STUDIO_COOKIE_SECRET není nastavený.
export async function createSessionToken(): Promise<string | null> {
  return createSecureToken(ENV_VARS, SESSION_VALUE);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  return verifySecureToken(ENV_VARS, SESSION_VALUE, token, MAX_AGE_MS);
}
