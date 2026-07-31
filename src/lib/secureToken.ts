import { createHmac, timingSafeEqual } from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Sdílená logika pro podepsané session cookie tokeny (admin / vstup na web /
// členská sekce). Řeší dvě věci, které předchozí verze neřešila:
//
// 1. Tajný klíč se BEZ VÝJIMKY bere jen z env proměnné. Dřív měl kód napevno
//    zapsanou výchozí hodnotu jako zálohu — jenže ta byla vidět přímo ve
//    veřejném repozitáři na GitHubu, takže by ji mohl použít kdokoliv k
//    podvržení platné session bez hesla. Runtime „vygeneruju si vlastní
//    náhodný klíč" zálohu jsme taky zkusili, ale v tomhle Next.js běhovém
//    prostředí se ukázalo, že různé routy nesdílí stejnou instanci modulu
//    (proces je stejný, ale API routa a stránka běžely s jinou kopií
//    modulu) — vygenerovaný klíč se tak lišil request od requestu a session
//    hned po přihlášení přestala platit. Bez nastavené env proměnné tedy
//    ověření záměrně vždy selže; je to spolehlivější než tichá nefunkčnost.
// 2. Token nese vlastní časové razítko a při ověření se kontroluje i stáří —
//    ukradené cookie tak přestane platit nejpozději po uplynutí maxAge, i
//    kdyby ho někdo zkopíroval a poslal ručně (prohlížeč by ho po expiraci
//    už neposlal, ale bez kontroly na serveru by to nikoho nezastavilo).
// ─────────────────────────────────────────────────────────────────────────────

function resolveSecret(envVarNames: string[]): string | null {
  for (const name of envVarNames) {
    const value = process.env[name];
    if (value) return value;
  }
  return null;
}

export function hasConfiguredSecret(envVarNames: string[]): boolean {
  return resolveSecret(envVarNames) !== null;
}

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSecureToken(envVarNames: string[], sessionValue: string): string | null {
  const secret = resolveSecret(envVarNames);
  if (!secret) return null;
  const issuedAt = Date.now().toString(36);
  const signature = sign(secret, `${sessionValue}:${issuedAt}`);
  return `${issuedAt}.${signature}`;
}

export function verifySecureToken(
  envVarNames: string[],
  sessionValue: string,
  token: string | undefined,
  maxAgeMs: number
): boolean {
  if (!token) return false;
  const secret = resolveSecret(envVarNames);
  if (!secret) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const issuedAtMs = parseInt(issuedAt, 36);
  if (!Number.isFinite(issuedAtMs)) return false;
  if (Date.now() - issuedAtMs > maxAgeMs) return false;
  if (issuedAtMs > Date.now() + 60_000) return false; // hodiny do budoucna = podezřelé

  const expected = sign(secret, `${sessionValue}:${issuedAt}`);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
