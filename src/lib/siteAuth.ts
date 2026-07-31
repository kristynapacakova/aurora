import { createSecureToken, verifySecureToken, hasConfiguredSecret } from "./secureToken";

export const SITE_COOKIE_NAME = "site_session";

const SESSION_VALUE = "site-unlocked";
const ENV_VARS = ["SITE_COOKIE_SECRET"];
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dní — stejně jako maxAge cookie

export function siteAuthConfigured(): boolean {
  return hasConfiguredSecret(ENV_VARS);
}

// Podepsaný token pro session cookie, která odemyká celý veřejný web
// (dokud je web ve fázi "zatím neveřejné"). Vrátí null, pokud
// SITE_COOKIE_SECRET není nastavený.
export async function createSiteToken(): Promise<string | null> {
  return createSecureToken(ENV_VARS, SESSION_VALUE);
}

export async function verifySiteToken(token: string | undefined): Promise<boolean> {
  return verifySecureToken(ENV_VARS, SESSION_VALUE, token, MAX_AGE_MS);
}
