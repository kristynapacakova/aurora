"use client";

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
        qr_kod: p.qr_kod,
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
      <header className="border-b border-line bg-sand">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Administrace</p>
            <h1 className="font-allura text-2xl text-ink">AURORA jóga</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
              Zobrazit web
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-ink/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink hover:border-ink"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {!configured && (
          <div className="mb-8 rounded-2xl border border-accent/40 bg-sand p-6 text-sm text-ink">
            <p className="font-medium">Úložiště zatím není připojené.</p>
            <p className="mt-2 text-muted">
              Ve Vercelu otevři projekt → záložka <strong>Storage</strong> →{" "}
              <strong>Create Database → Postgres</strong> (texty) a{" "}
              <strong>Create → Blob</strong> (fotky). Potom se sem vrať — vše začne fungovat samo.
            </p>
          </div>
        )}

        {/* Záložky */}
        <div className="mb-8 flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-all ${
                tab === t.key
                  ? "bg-gradient-aurora text-ink"
                  : "border border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* ── Pobyty ── */}
        {tab === "pobyty" && (
          <section>
            <Link
              href="/admin/pobyt/novy"
              className="mb-6 inline-block rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-accent-d"
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
                    className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/60 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {p.nadpis}
                        {!p.zverejneno && (
                          <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                            skrytý
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {[p.misto, p.termin, p.cena].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        disabled={busy}
                        onClick={() => togglePobyt(p)}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink hover:border-ink"
                      >
                        {p.zverejneno ? "Skrýt" : "Zobrazit"}
                      </button>
                      <Link
                        href={`/admin/pobyt/${p.id}`}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink hover:border-ink"
                      >
                        Upravit
                      </Link>
                      <button
                        disabled={busy}
                        onClick={() => remove("pobyty", p.id, p.nadpis)}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d hover:border-accent-d"
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
              className="mb-6 inline-block rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-all hover:bg-accent-d"
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
                    className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white/60 p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {c.nadpis}
                        {!c.zverejneno && (
                          <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                            skrytý
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(c.created_at).toLocaleDateString("cs-CZ")}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link
                        href={`/admin/clanek/${c.id}`}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink hover:border-ink"
                      >
                        Upravit
                      </Link>
                      <button
                        disabled={busy}
                        onClick={() => remove("clanky", c.id, c.nadpis)}
                        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d hover:border-accent-d"
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
                  <li key={q.id} className="rounded-2xl border border-line bg-white/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-ink">
                          {q.jmeno}
                          {q.pobyt_nadpis && (
                            <span className="ml-2 text-xs text-accent">→ {q.pobyt_nadpis}</span>
                          )}
                          {q.typ === "objednavka" ? (
                            <span
                              className={`ml-2 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                                q.zaplaceno
                                  ? "bg-accent/20 text-accent-d"
                                  : "bg-line text-muted"
                              }`}
                            >
                              {q.zaplaceno ? "Zaplaceno" : "Objednávka"}
                            </span>
                          ) : (
                            <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                              Dotaz
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {new Date(q.created_at).toLocaleString("cs-CZ")}
                        </p>
                        <p className="mt-2 text-sm text-ink">
                          <a href={`mailto:${q.email}`} className="underline underline-offset-2">
                            {q.email}
                          </a>
                          {q.telefon && (
                            <>
                              {" · "}
                              <a href={`tel:${q.telefon}`} className="underline underline-offset-2">
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
                        className="shrink-0 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d hover:border-accent-d"
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
