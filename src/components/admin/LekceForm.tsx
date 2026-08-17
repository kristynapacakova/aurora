"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Lekce } from "@/lib/db";
import { DNY_V_TYDNU } from "@/lib/dny";
import { nbsp } from "@/lib/typo";
import { IconPin } from "@/components/BrandIcons";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";
const cardCls = "flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm";
const labelCls = "flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted";

export default function LekceForm({ initial }: { initial: Lekce | null }) {
  const router = useRouter();
  const [den, setDen] = useState(initial?.den ?? "");
  const [misto, setMisto] = useState(initial?.misto ?? "");
  const [cas, setCas] = useState(initial?.cas ?? "");
  const [poznamka, setPoznamka] = useState(initial?.poznamka ?? "");
  const [zverejneno, setZverejneno] = useState(initial?.zverejneno ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/lekce", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: initial?.id, den, misto, cas, poznamka, zverejneno }),
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

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/admin"
          className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          ← Zpět na přehled
        </Link>
        <h1 className="mt-4 mb-8 font-allura text-4xl text-ink">
          {initial ? "Upravit lekci" : "Nová lekce"}
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* ── Formulář ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className={cardCls}>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Pravidelná lekce</p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className={labelCls}>
                  Den *
                  <select
                    value={den}
                    onChange={(e) => setDen(e.target.value)}
                    required
                    className={inputCls}
                  >
                    <option value="">— vyber den —</option>
                    {DNY_V_TYDNU.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelCls}>
                  Čas *
                  <input
                    value={cas}
                    onChange={(e) => setCas(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="Např. 18:30 – 19:30"
                  />
                </label>
              </div>

              <label className={labelCls}>
                Místo *
                <input
                  value={misto}
                  onChange={(e) => setMisto(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Např. Maršovice"
                />
              </label>

              <label className={labelCls}>
                Poznámka (nepovinné)
                <input
                  value={poznamka}
                  onChange={(e) => setPoznamka(e.target.value)}
                  className={inputCls}
                  placeholder="Např. sokolovna, 1. patro"
                />
              </label>

              <p className="text-xs text-muted">
                Lekce se na webu samy seřadí podle dne v týdnu — pořadí nemusíš nikde nastavovat.
              </p>
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
                {saving ? "Ukládám…" : "Uložit lekci"}
              </button>
              <Link
                href="/admin"
                className="rounded-full border border-line px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Zrušit
              </Link>
            </div>
          </form>

          {/* ── Živý náhled — stejná karta jako na /lekce ── */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              Náhled — takhle to uvidí návštěvnice webu
            </p>
            <div className="rounded-3xl border border-line bg-cream p-6">
              <div className="flex flex-col items-center rounded-[20px] bg-sand/75 px-6 py-8 text-center shadow-[0_2px_12px_rgba(140,95,71,0.045)] ring-1 ring-white/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70">
                  <IconPin size={20} />
                </span>
                <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-accent">
                  {den || "Den"}
                </p>
                <p className="mt-1 font-serif text-3xl leading-tight text-ink">
                  {nbsp(misto || "Místo")}
                </p>
                <p className="mt-3 text-sm text-muted">{cas || "00:00 – 00:00"}</p>
                {poznamka && <p className="mt-1 text-xs text-muted/80">{nbsp(poznamka)}</p>}
              </div>
            </div>
            {!zverejneno && (
              <p className="mt-3 text-xs text-accent-d">
                Lekce je označená jako skrytá — na webu se nezobrazí, dokud nezaškrtneš „Zobrazit
                na webu“.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
