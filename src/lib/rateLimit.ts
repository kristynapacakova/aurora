// ─────────────────────────────────────────────────────────────────────────────
// Jednoduchý rate limiter v paměti procesu. Není to náhrada za sdílené
// úložiště (Redis/KV) přes víc instancí, ale na malý web bez vlastní
// infrastruktury poskytuje smysluplnou ochranu proti hrubému hádání hesel
// a spamování formulářů — zvlášť když běží dlouho v jednom „warm" procesu,
// jak to Vercel u serverless funkcí běžně dělá.
// ─────────────────────────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Občas se zbavíme starých záznamů, ať mapa neroste do nekonečna.
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Vrátí true, pokud je požadavek v rámci limitu (a započítá ho).
// Vrátí false, pokud limit pro dané okno už byl vyčerpán.
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  cleanup();
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= max) return false;
  existing.count += 1;
  return true;
}
