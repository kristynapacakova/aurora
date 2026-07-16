export const ADMIN_COOKIE_NAME = "admin_session";

const SESSION_VALUE = "admin-unlocked";

function getSecret() {
  return (
    process.env.ADMIN_COOKIE_SECRET ??
    process.env.STUDIO_COOKIE_SECRET ??
    "dev-admin-secret-change-me"
  );
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

// Podepsaný token pro admin cookie — stejný princip jako studioAuth.
export async function createAdminToken() {
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(SESSION_VALUE)
  );
  return toBase64Url(signature);
}

export async function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const expected = await createAdminToken();
  return token === expected;
}

// Ověření admin session přímo z Request (pro API routy).
export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`)
  );
  return verifyAdminToken(match?.[1]);
}
