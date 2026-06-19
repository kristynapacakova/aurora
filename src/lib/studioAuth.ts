export const STUDIO_COOKIE_NAME = "studio_session";

const SESSION_VALUE = "unlocked";

function getSecret() {
  return process.env.STUDIO_COOKIE_SECRET ?? "dev-secret-change-me";
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

// Vytvoří podepsaný token pro session cookie. Token nenese žádná citlivá
// data, jen potvrzuje, že byl vystaven serverem (na základě tajného klíče
// STUDIO_COOKIE_SECRET).
export async function createSessionToken() {
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(SESSION_VALUE)
  );
  return toBase64Url(signature);
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const expected = await createSessionToken();
  return token === expected;
}
