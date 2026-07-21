import { Pool } from "pg";
import { cache } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Databáze (Vercel Postgres / Neon). Připojení se čte z env proměnných,
// které Vercel doplní automaticky po připojení Postgres úložiště k projektu.
// Bez nastavené databáze funkce vrací prázdná data a web běží dál.
// ─────────────────────────────────────────────────────────────────────────────

export type Pobyt = {
  id: number;
  nadpis: string;
  misto: string;
  termin: string;
  popis: string;
  cena: string;
  fotky: string[];
  cislo_uctu: string;
  variabilni_symbol: string;
  platebni_pokyny: string;
  zverejneno: boolean;
  created_at: string;
};

export type Clanek = {
  id: number;
  nadpis: string;
  slug: string;
  text: string;
  zverejneno: boolean;
  created_at: string;
};

export type Poptavka = {
  id: number;
  pobyt_id: number | null;
  pobyt_nadpis: string | null;
  typ: "dotaz" | "objednavka";
  zaplaceno: boolean;
  precteno: boolean;
  jmeno: string;
  email: string;
  telefon: string;
  zprava: string;
  created_at: string;
};

export type NewsletterSignup = {
  id: number;
  email: string;
  created_at: string;
};

export type Nastaveni = {
  kontakt_email: string;
  instagram_handle: string;
  instagram_url: string;
  cena_lekce: string;
  cena_mesicni: string;
  cena_rocni: string;
  uscreen_home: string;
  uscreen_signup: string;
  uscreen_login: string;
  uscreen_plans: string;
  domena_expiruje: string;
};

function connectionString() {
  return (
    process.env.POSTGRES_URL ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    null
  );
}

export function dbConfigured(): boolean {
  return connectionString() !== null;
}

let pool: Pool | null = null;
let schemaReady = false;

function getPool(): Pool {
  if (!pool) {
    const cs = connectionString();
    if (!cs) throw new Error("Databáze není nakonfigurována.");
    pool = new Pool({ connectionString: cs, max: 3 });
  }
  return pool;
}

async function ensureSchema() {
  if (schemaReady) return;
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS pobyty (
      id SERIAL PRIMARY KEY,
      nadpis TEXT NOT NULL,
      misto TEXT NOT NULL DEFAULT '',
      termin TEXT NOT NULL DEFAULT '',
      popis TEXT NOT NULL DEFAULT '',
      cena TEXT NOT NULL DEFAULT '',
      fotky JSONB NOT NULL DEFAULT '[]',
      zverejneno BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE pobyty ADD COLUMN IF NOT EXISTS platebni_pokyny TEXT NOT NULL DEFAULT '';
    ALTER TABLE pobyty ADD COLUMN IF NOT EXISTS cislo_uctu TEXT NOT NULL DEFAULT '';
    ALTER TABLE pobyty ADD COLUMN IF NOT EXISTS variabilni_symbol TEXT NOT NULL DEFAULT '';

    CREATE TABLE IF NOT EXISTS clanky (
      id SERIAL PRIMARY KEY,
      nadpis TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      text TEXT NOT NULL DEFAULT '',
      zverejneno BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS poptavky (
      id SERIAL PRIMARY KEY,
      pobyt_id INTEGER,
      jmeno TEXT NOT NULL,
      email TEXT NOT NULL,
      telefon TEXT NOT NULL DEFAULT '',
      zprava TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE poptavky ADD COLUMN IF NOT EXISTS typ TEXT NOT NULL DEFAULT 'dotaz';
    ALTER TABLE poptavky ADD COLUMN IF NOT EXISTS zaplaceno BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE poptavky ADD COLUMN IF NOT EXISTS precteno BOOLEAN NOT NULL DEFAULT FALSE;

    CREATE TABLE IF NOT EXISTS newsletter (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS nastaveni (
      id INTEGER PRIMARY KEY DEFAULT 1,
      kontakt_email TEXT NOT NULL DEFAULT '',
      instagram_handle TEXT NOT NULL DEFAULT '',
      instagram_url TEXT NOT NULL DEFAULT '',
      cena_lekce TEXT NOT NULL DEFAULT '',
      cena_mesicni TEXT NOT NULL DEFAULT '',
      cena_rocni TEXT NOT NULL DEFAULT '',
      uscreen_home TEXT NOT NULL DEFAULT '',
      uscreen_signup TEXT NOT NULL DEFAULT '',
      uscreen_login TEXT NOT NULL DEFAULT '',
      uscreen_plans TEXT NOT NULL DEFAULT '',
      admin_password_hash TEXT,
      CHECK (id = 1)
    );
    ALTER TABLE nastaveni ADD COLUMN IF NOT EXISTS domena_expiruje TEXT NOT NULL DEFAULT '';
  `);
  schemaReady = true;
}

async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const res = await getPool().query(sql, params);
  return res.rows as T[];
}

// ── Pobyty ──────────────────────────────────────────────────────────────────

export async function getPobyty(onlyPublished = true): Promise<Pobyt[]> {
  if (!dbConfigured()) return [];
  return query<Pobyt>(
    `SELECT * FROM pobyty ${onlyPublished ? "WHERE zverejneno = TRUE" : ""} ORDER BY created_at DESC`
  );
}

export async function getPobyt(id: number): Promise<Pobyt | null> {
  if (!dbConfigured()) return null;
  const rows = await query<Pobyt>(`SELECT * FROM pobyty WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createPobyt(p: Omit<Pobyt, "id" | "created_at">): Promise<Pobyt> {
  const rows = await query<Pobyt>(
    `INSERT INTO pobyty (nadpis, misto, termin, popis, cena, fotky, cislo_uctu, variabilni_symbol, platebni_pokyny, zverejneno)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      p.nadpis,
      p.misto,
      p.termin,
      p.popis,
      p.cena,
      JSON.stringify(p.fotky),
      p.cislo_uctu,
      p.variabilni_symbol,
      p.platebni_pokyny,
      p.zverejneno,
    ]
  );
  return rows[0];
}

export async function updatePobyt(id: number, p: Omit<Pobyt, "id" | "created_at">): Promise<void> {
  await query(
    `UPDATE pobyty SET nadpis=$1, misto=$2, termin=$3, popis=$4, cena=$5, fotky=$6, cislo_uctu=$7, variabilni_symbol=$8, platebni_pokyny=$9, zverejneno=$10 WHERE id=$11`,
    [
      p.nadpis,
      p.misto,
      p.termin,
      p.popis,
      p.cena,
      JSON.stringify(p.fotky),
      p.cislo_uctu,
      p.variabilni_symbol,
      p.platebni_pokyny,
      p.zverejneno,
      id,
    ]
  );
}

export async function deletePobyt(id: number): Promise<void> {
  await query(`DELETE FROM pobyty WHERE id = $1`, [id]);
}

// ── Články ──────────────────────────────────────────────────────────────────

export function makeSlug(nadpis: string): string {
  return nadpis
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "clanek";
}

export async function getClanky(onlyPublished = true): Promise<Clanek[]> {
  if (!dbConfigured()) return [];
  return query<Clanek>(
    `SELECT * FROM clanky ${onlyPublished ? "WHERE zverejneno = TRUE" : ""} ORDER BY created_at DESC`
  );
}

export async function getClanekBySlug(slug: string): Promise<Clanek | null> {
  if (!dbConfigured()) return null;
  const rows = await query<Clanek>(`SELECT * FROM clanky WHERE slug = $1`, [slug]);
  return rows[0] ?? null;
}

export async function getClanek(id: number): Promise<Clanek | null> {
  if (!dbConfigured()) return null;
  const rows = await query<Clanek>(`SELECT * FROM clanky WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createClanek(nadpis: string, text: string, zverejneno: boolean): Promise<Clanek> {
  const base = makeSlug(nadpis);
  // zajistí unikátní slug (pri kolizi přidá -2, -3, …)
  const existing = await query<{ slug: string }>(
    `SELECT slug FROM clanky WHERE slug LIKE $1`,
    [`${base}%`]
  );
  const taken = new Set(existing.map((r) => r.slug));
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;

  const rows = await query<Clanek>(
    `INSERT INTO clanky (nadpis, slug, text, zverejneno) VALUES ($1, $2, $3, $4) RETURNING *`,
    [nadpis, slug, text, zverejneno]
  );
  return rows[0];
}

export async function updateClanek(id: number, nadpis: string, text: string, zverejneno: boolean): Promise<void> {
  await query(`UPDATE clanky SET nadpis=$1, text=$2, zverejneno=$3 WHERE id=$4`, [
    nadpis,
    text,
    zverejneno,
    id,
  ]);
}

export async function deleteClanek(id: number): Promise<void> {
  await query(`DELETE FROM clanky WHERE id = $1`, [id]);
}

// ── Poptávky ────────────────────────────────────────────────────────────────

export async function createPoptavka(p: {
  pobyt_id: number | null;
  typ: "dotaz" | "objednavka";
  zaplaceno: boolean;
  jmeno: string;
  email: string;
  telefon: string;
  zprava: string;
}): Promise<void> {
  await query(
    `INSERT INTO poptavky (pobyt_id, typ, zaplaceno, jmeno, email, telefon, zprava)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [p.pobyt_id, p.typ, p.zaplaceno, p.jmeno, p.email, p.telefon, p.zprava]
  );
}

export async function getPoptavky(): Promise<Poptavka[]> {
  if (!dbConfigured()) return [];
  return query<Poptavka>(
    `SELECT poptavky.*, pobyty.nadpis AS pobyt_nadpis
     FROM poptavky LEFT JOIN pobyty ON pobyty.id = poptavky.pobyt_id
     ORDER BY poptavky.created_at DESC`
  );
}

export async function deletePoptavka(id: number): Promise<void> {
  await query(`DELETE FROM poptavky WHERE id = $1`, [id]);
}

export async function updatePoptavkaPrecteno(id: number, precteno: boolean): Promise<void> {
  await query(`UPDATE poptavky SET precteno = $1 WHERE id = $2`, [precteno, id]);
}

// ── Newsletter ──────────────────────────────────────────────────────────────

export async function createNewsletterSignup(email: string): Promise<boolean> {
  const rows = await query<{ id: number }>(
    `INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id`,
    [email]
  );
  return rows.length > 0;
}

export async function getNewsletterSignups(): Promise<NewsletterSignup[]> {
  if (!dbConfigured()) return [];
  return query<NewsletterSignup>(`SELECT * FROM newsletter ORDER BY created_at DESC`);
}

export async function deleteNewsletterSignup(id: number): Promise<void> {
  await query(`DELETE FROM newsletter WHERE id = $1`, [id]);
}

// ── Nastavení ───────────────────────────────────────────────────────────────
// Statické výchozí hodnoty (z config.ts) — použijí se, dokud si klientka
// v administraci nevyplní vlastní. Import je tady dole, aby se předešlo
// cyklické závislosti (config.ts nic z db.ts nepotřebuje).

const NASTAVENI_DEFAULTS: Nastaveni = {
  kontakt_email: "ahoj@aurorajoga.cz",
  instagram_handle: "@aurora_yogaa",
  instagram_url: "https://www.instagram.com/aurora_yogaa",
  cena_lekce: "120",
  cena_mesicni: "399",
  cena_rocni: "299",
  uscreen_home: "https://aurora.uscreen.io",
  uscreen_signup: "https://aurora.uscreen.io/sign_up",
  uscreen_login: "https://aurora.uscreen.io/sign_in",
  uscreen_plans: "https://aurora.uscreen.io/plans",
  domena_expiruje: "",
};

type NastaveniRow = Nastaveni & { admin_password_hash: string | null };

async function ensureNastaveniRow(): Promise<NastaveniRow> {
  const rows = await query<NastaveniRow>(`SELECT * FROM nastaveni WHERE id = 1`);
  if (rows[0]) return rows[0];
  const inserted = await query<NastaveniRow>(
    `INSERT INTO nastaveni (id, kontakt_email, instagram_handle, instagram_url, cena_lekce, cena_mesicni, cena_rocni, uscreen_home, uscreen_signup, uscreen_login, uscreen_plans, domena_expiruje)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      NASTAVENI_DEFAULTS.kontakt_email,
      NASTAVENI_DEFAULTS.instagram_handle,
      NASTAVENI_DEFAULTS.instagram_url,
      NASTAVENI_DEFAULTS.cena_lekce,
      NASTAVENI_DEFAULTS.cena_mesicni,
      NASTAVENI_DEFAULTS.cena_rocni,
      NASTAVENI_DEFAULTS.uscreen_home,
      NASTAVENI_DEFAULTS.uscreen_signup,
      NASTAVENI_DEFAULTS.uscreen_login,
      NASTAVENI_DEFAULTS.uscreen_plans,
      NASTAVENI_DEFAULTS.domena_expiruje,
    ]
  );
  return inserted[0];
}

export const getNastaveni = cache(async (): Promise<Nastaveni> => {
  if (!dbConfigured()) return NASTAVENI_DEFAULTS;
  const row = await ensureNastaveniRow();
  return {
    kontakt_email: row.kontakt_email || NASTAVENI_DEFAULTS.kontakt_email,
    instagram_handle: row.instagram_handle || NASTAVENI_DEFAULTS.instagram_handle,
    instagram_url: row.instagram_url || NASTAVENI_DEFAULTS.instagram_url,
    cena_lekce: row.cena_lekce || NASTAVENI_DEFAULTS.cena_lekce,
    cena_mesicni: row.cena_mesicni || NASTAVENI_DEFAULTS.cena_mesicni,
    cena_rocni: row.cena_rocni || NASTAVENI_DEFAULTS.cena_rocni,
    uscreen_home: row.uscreen_home || NASTAVENI_DEFAULTS.uscreen_home,
    uscreen_signup: row.uscreen_signup || NASTAVENI_DEFAULTS.uscreen_signup,
    uscreen_login: row.uscreen_login || NASTAVENI_DEFAULTS.uscreen_login,
    uscreen_plans: row.uscreen_plans || NASTAVENI_DEFAULTS.uscreen_plans,
    domena_expiruje: row.domena_expiruje || NASTAVENI_DEFAULTS.domena_expiruje,
  };
});

export async function updateNastaveni(fields: Nastaveni): Promise<void> {
  await ensureNastaveniRow();
  await query(
    `UPDATE nastaveni SET kontakt_email=$1, instagram_handle=$2, instagram_url=$3, cena_lekce=$4, cena_mesicni=$5, cena_rocni=$6, uscreen_home=$7, uscreen_signup=$8, uscreen_login=$9, uscreen_plans=$10, domena_expiruje=$11 WHERE id = 1`,
    [
      fields.kontakt_email,
      fields.instagram_handle,
      fields.instagram_url,
      fields.cena_lekce,
      fields.cena_mesicni,
      fields.cena_rocni,
      fields.uscreen_home,
      fields.uscreen_signup,
      fields.uscreen_login,
      fields.uscreen_plans,
      fields.domena_expiruje,
    ]
  );
}

export async function getAdminPasswordHash(): Promise<string | null> {
  if (!dbConfigured()) return null;
  const row = await ensureNastaveniRow();
  return row.admin_password_hash;
}

export async function setAdminPasswordHash(hash: string): Promise<void> {
  await ensureNastaveniRow();
  await query(`UPDATE nastaveni SET admin_password_hash = $1 WHERE id = 1`, [hash]);
}
