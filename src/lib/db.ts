import { Pool } from "pg";

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
  qr_kod: string;
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
  jmeno: string;
  email: string;
  telefon: string;
  zprava: string;
  created_at: string;
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
    ALTER TABLE pobyty ADD COLUMN IF NOT EXISTS qr_kod TEXT NOT NULL DEFAULT '';
    ALTER TABLE pobyty ADD COLUMN IF NOT EXISTS platebni_pokyny TEXT NOT NULL DEFAULT '';

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
    `INSERT INTO pobyty (nadpis, misto, termin, popis, cena, fotky, qr_kod, platebni_pokyny, zverejneno)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [p.nadpis, p.misto, p.termin, p.popis, p.cena, JSON.stringify(p.fotky), p.qr_kod, p.platebni_pokyny, p.zverejneno]
  );
  return rows[0];
}

export async function updatePobyt(id: number, p: Omit<Pobyt, "id" | "created_at">): Promise<void> {
  await query(
    `UPDATE pobyty SET nadpis=$1, misto=$2, termin=$3, popis=$4, cena=$5, fotky=$6, qr_kod=$7, platebni_pokyny=$8, zverejneno=$9 WHERE id=$10`,
    [p.nadpis, p.misto, p.termin, p.popis, p.cena, JSON.stringify(p.fotky), p.qr_kod, p.platebni_pokyny, p.zverejneno, id]
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
