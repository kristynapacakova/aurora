"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Clanek } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export default function ClanekForm({ initial }: { initial: Clanek | null }) {
  const router = useRouter();
  const [nadpis, setNadpis] = useState(initial?.nadpis ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [zverejneno, setZverejneno] = useState(initial?.zverejneno ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/clanky", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: initial?.id, nadpis, text, zverejneno }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Uložení se nepovedlo.");
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← Zpět na přehled
        </Link>
        <h1 className="mt-4 mb-8 font-allura text-4xl text-ink">
          {initial ? "Upravit článek" : "Nový článek"}
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Obsah článku</p>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Nadpis *
                <input value={nadpis} onChange={(e) => setNadpis(e.target.value)} required className={inputCls} placeholder="Nadpis článku" />
              </label>

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Text *
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={18}
                  required
                  className={inputCls}
                  placeholder="Text článku… (odstavce odděl prázdným řádkem)"
                />
              </label>
            </div>

            <label className="flex items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={zverejneno}
                onChange={(e) => setZverejneno(e.target.checked)}
                className="h-4 w-4 accent-[#F28D76]"
              />
              Zobrazit na webu
            </label>

            {error && <p className="text-sm text-accent-d">{error}</p>}

            <div className="mt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Ukládám…" : "Uložit článek"}
              </button>
              <Link
                href="/admin"
                className="rounded-full border border-line px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Zrušit
              </Link>
            </div>
          </form>

          {/* ── Živý náhled — stejné zobrazení jako na /blog/[slug] ── */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              Náhled — takhle to uvidí návštěvnice webu
            </p>
            <article className="rounded-3xl border border-line bg-cream p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                {new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.15] text-ink sm:text-4xl">
                {nbsp(nadpis || "Nadpis článku")}
              </h2>
              <div className="mt-6 flex flex-col gap-4">
                {(text || "Text článku se zobrazí zde…").split(/\n\s*\n/).map((odst, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted">
                    {nbsp(odst)}
                  </p>
                ))}
              </div>
            </article>
            {!zverejneno && (
              <p className="mt-3 text-xs text-accent-d">
                Článek je označený jako skrytý — na webu se nezobrazí, dokud nezaškrtneš „Zobrazit na webu“.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
