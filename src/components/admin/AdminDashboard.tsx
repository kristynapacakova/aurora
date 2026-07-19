"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Pobyt, Clanek, Poptavka } from "@/lib/db";

type Tab = "pobyty" | "clanky" | "poptavky";

export default function AdminDashboard({
  configured,
  pobyty,
  clanky,
  poptavky,
}: {
  configured: boolean;
  pobyty: Pobyt[];
  clanky: Clanek[];
  poptavky: Poptavka[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pobyty");
  const [busy, setBusy] = useState(false);

  async function remove(kind: "pobyty" | "clanky" | "poptavky", id: number, label: string) {
    if (!confirm(`Opravdu smazat „${label}“?`)) return;
    setBusy(true);
    await fetch(`/api/admin/${kind}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    router.refresh();
  }

  async function togglePobyt(p: Pobyt) {
    setBusy(true);
    await fetch("/api/admin/pobyty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        nadpis: p.nadpis,
        misto: p.misto,
        termin: p.termin,
        popis: p.popis,
        cena: p.cena,
        fotky: p.fotky,
        cislo_uctu: p.cislo_uctu,
        variabilni_symbol: p.variabilni_symbol,
        platebni_pokyny: p.platebni_pokyny,
        zverejneno: !p.zverejneno,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "pobyty", label: "Pobyty", count: pobyty.length },
    { key: "clanky", label: "Články", count: clanky.length },
    { key: "poptavky", label: "Poptávky", count: poptavky.length },
  ];

  return (
    <main className="min-h-screen bg-cream">
      {/* Hlavička */}
      <header className="border-b border-line bg-cream">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex flex-col items-start">
            <Image src="/logo.png" alt="AURORA jóga" width={140} height={110} className="h-10 w-auto" priority />
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-accent">Administrace</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
            >
              Zobrazit web
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-ink/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {!configured && (
          <div className="mb-8 rounded-2xl border border-accent/40 bg-white p-6 text-sm text-ink shadow-sm">
            <p className="font-medium">Úložiště zatím není připojené.</p>
            <p className="mt-2 text-muted">
              Ve Vercelu otevři projekt → záložka <strong>Storage</strong> →{" "}
              <strong>Create Database → Postgres</strong> (texty) a{" "}
              <strong>Create → Blob</strong> (fotky). Potom se sem vrať — vše začne fungovat samo.
            </p>
          </div>
        )}

        {/* Záložky */}
        <div className="mb-8 flex gap-2 border-b border-line pb-px">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
                tab === t.key ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 ${tab === t.key ? "text-accent" : "text-muted/70"}`}>
                {t.count}
              </span>
              {tab === t.key && (
                <span className="bg-gradient-aurora absolute inset-x-0 -bottom-px h-[2px] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Pobyty ── */}
        {tab === "pobyty" && (
          <section>
            <Link
              href="/admin/pobyt/novy"
              className="bg-gradient-aurora mb-6 inline-block rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              + Přidat pobyt
            </Link>
            {pobyty.length === 0 ? (
              <p className="text-sm text-muted">Zatím žádné pobyty. Přidej první!</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {pobyty.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-serif text-lg text-ink">
                        {p.nadpis}
                        {!p.zverejneno && (
                          <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                            Skrytý
                          </span>
                        )}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted">
                        {[p.misto, p.termin, p.cena].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        disabled={busy}
                        onClick={() => togglePobyt(p)}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        {p.zverejneno ? "Skrýt" : "Zobrazit"}
                      </button>
                      <Link
                        href={`/admin/pobyt/${p.id}`}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        Upravit
                      </Link>
                      <button
                        disabled={busy}
                        onClick={() => remove("pobyty", p.id, p.nadpis)}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                      >
                        Smazat
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ── Články ── */}
        {tab === "clanky" && (
          <section>
            <Link
              href="/admin/clanek/novy"
              className="bg-gradient-aurora mb-6 inline-block rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              + Napsat článek
            </Link>
            {clanky.length === 0 ? (
              <p className="text-sm text-muted">Zatím žádné články. Napiš první!</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {clanky.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate font-serif text-lg text-ink">
                        {c.nadpis}
                        {!c.zverejneno && (
                          <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                            Skrytý
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(c.created_at).toLocaleDateString("cs-CZ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/admin/clanek/${c.id}`}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                      >
                        Upravit
                      </Link>
                      <button
                        disabled={busy}
                        onClick={() => remove("clanky", c.id, c.nadpis)}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                      >
                        Smazat
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ── Poptávky ── */}
        {tab === "poptavky" && (
          <section>
            {poptavky.length === 0 ? (
              <p className="text-sm text-muted">
                Zatím žádné poptávky ani objednávky. Jakmile někdo klikne na „Závazně objednat“
                nebo „Mám dotaz“ u pobytu, objeví se tady (a přijde ti e-mail).
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {poptavky.map((q) => (
                  <li key={q.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                          {q.jmeno}
                          {q.pobyt_nadpis && (
                            <span className="text-xs text-accent">→ {q.pobyt_nadpis}</span>
                          )}
                          {q.typ === "objednavka" ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                                q.zaplaceno
                                  ? "bg-accent/20 text-accent-d"
                                  : "bg-line text-muted"
                              }`}
                            >
                              {q.zaplaceno ? "Zaplaceno" : "Objednávka"}
                            </span>
                          ) : (
                            <span className="rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                              Dotaz
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {new Date(q.created_at).toLocaleString("cs-CZ")}
                        </p>
                        <p className="mt-2 text-sm text-ink">
                          <a href={`mailto:${q.email}`} className="underline underline-offset-2 hover:text-accent-d">
                            {q.email}
                          </a>
                          {q.telefon && (
                            <>
                              {" · "}
                              <a href={`tel:${q.telefon}`} className="underline underline-offset-2 hover:text-accent-d">
                                {q.telefon}
                              </a>
                            </>
                          )}
                        </p>
                        {q.zprava && <p className="mt-2 text-sm text-muted">{q.zprava}</p>}
                      </div>
                      <button
                        disabled={busy}
                        onClick={() => remove("poptavky", q.id, `poptávka od ${q.jmeno}`)}
                        className="shrink-0 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                      >
                        Smazat
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
