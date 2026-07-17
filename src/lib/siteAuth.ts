export const SITE_COOKIE_NAME = "site_session";

const SESSION_VALUE = "site-unlocked";

function getSecret() {
  return process.env.SITE_COOKIE_SECRET ?? "dev-site-secret-change-me";
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Podepsaný token pro session cookie, která odemyká celý veřejný web
// (dokud je web ve fázi "zatím neveřejné").
export async function createSiteToken() {
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(SESSION_VALUE)
  );
  return toBase64Url(signature);
}

export async function verifySiteToken(token: string | undefined) {
  if (!token) return false;
  const expected = await createSiteToken();
  return token === expected;
}
