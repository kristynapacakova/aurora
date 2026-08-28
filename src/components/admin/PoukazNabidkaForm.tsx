"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import type { PoukazNabidka, PoukazCastka } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { formatKc } from "@/lib/castky";
import { resizeImageFile } from "@/lib/imageResize";

// Cesta v úložišti musí být unikátní, ať se stejně pojmenované soubory
// nepřepisují. Schválně mimo komponentu — Date.now() v jejím těle hlídá
// lint jako nečistou funkci.
function cestaProFotku(jmenoSouboru: string): string {
  const bezpecne = jmenoSouboru.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `poukazy/${Date.now()}-${bezpecne}`;
}

const VYCHOZI_CASTKY: PoukazCastka[] = [
  { popisek: "", hodnota_kc: 500 },
  { popisek: "", hodnota_kc: 1000 },
  { popisek: "", hodnota_kc: 1500 },
];

export default function PoukazNabidkaForm({ initial }: { initial: PoukazNabidka | null }) {
  const router = useRouter();
  const [nadpis, setNadpis] = useState(initial?.nadpis ?? "");
  const [popis, setPopis] = useState(initial?.popis ?? "");
  const [fotka, setFotka] = useState(initial?.fotka ?? "");
  const [castky, setCastky] = useState<PoukazCastka[]>(
    initial?.castky?.length ? initial.castky : VYCHOZI_CASTKY
  );
  const [zverejneno, setZverejneno] = useState(initial?.zverejneno ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function nastavCastku(index: number, zmena: Partial<PoukazCastka>) {
    setCastky((c) => c.map((castka, i) => (i === index ? { ...castka, ...zmena } : castka)));
  }

  async function nahratFotku(e: ChangeEvent<HTMLInputElement>) {
    const soubor = e.target.files?.[0];
    e.target.value = "";
    if (!soubor) return;
    setUploading(true);
    setError(null);
    try {
      const zmenseny = await resizeImageFile(soubor);
      const blob = await upload(cestaProFotku(zmenseny.name), zmenseny, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setFotka(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nahrání grafiky se nepovedlo.");
    }
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/poukazy-nabidka", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: initial?.id, nadpis, popis, fotka, castky, zverejneno }),
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
  const cardCls = "flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm";
  const labelCls = "flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted";

  const platneCastky = castky.filter((c) => c.hodnota_kc > 0);

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
          {initial ? "Upravit poukaz" : "Nový dárkový poukaz"}
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className={cardCls}>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Základní údaje</p>
                <p className="mt-2 text-xs text-muted">
                  Takhle poukaz uvidí návštěvnice na stránce s dárkovými poukazy. Kód dostane
                  e-mailem, jakmile potvrdíš platbu.
                </p>
              </div>

              <label className={labelCls}>
                Nadpis *
                <input
                  value={nadpis}
                  onChange={(e) => setNadpis(e.target.value)}
                  required
                  className={inputCls}
                  placeholder="Např. Dárkový poukaz Aurora"
                />
              </label>

              <label className={labelCls}>
                Text
                <textarea
                  value={popis}
                  onChange={(e) => setPopis(e.target.value)}
                  rows={5}
                  className={inputCls}
                  placeholder="Pro koho se hodí, co si za něj může dopřát, jak dlouho platí…"
                />
              </label>
            </div>

            {/* Částky — z nich si zákaznice vybírá. */}
            <div className={cardCls}>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Nabídka částek *</p>
                <p className="mt-2 text-xs text-muted">
                  Popisek je nepovinný — hodí se u částky jako „na 1 lekci“. Hodnota musí být mezi
                  100 a 100 000 Kč.
                </p>
              </div>

              {castky.map((castka, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <input
                    value={castka.hodnota_kc || ""}
                    onChange={(e) =>
                      nastavCastku(i, {
                        hodnota_kc: Number(e.target.value.replace(/[^0-9]/g, "")) || 0,
                      })
                    }
                    inputMode="numeric"
                    placeholder="Kč"
                    className={`${inputCls} w-28`}
                  />
                  <input
                    value={castka.popisek}
                    onChange={(e) => nastavCastku(i, { popisek: e.target.value })}
                    placeholder="Popisek, např. na 1 lekci (nepovinné)"
                    className={`${inputCls} min-w-[13rem] flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => setCastky((c) => c.filter((_, j) => j !== i))}
                    className="text-xs uppercase tracking-[0.15em] text-accent-d hover:underline"
                  >
                    Odebrat
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setCastky((c) => [...c, { popisek: "", hodnota_kc: 0 }])}
                className="w-fit rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
              >
                + Přidat částku
              </button>
            </div>

            {/* Grafika */}
            <div className={cardCls}>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Grafika poukazu</p>
                <p className="mt-2 text-xs text-muted">
                  Ukáže se na webu i v e-mailu s kódem. Bez ní se na webu zobrazí krémový podklad
                  s nápisem Aurora.
                </p>
              </div>
              {fotka && (
                <div className="relative h-44 w-full overflow-hidden rounded-xl sm:w-80">
                  <Image src={fotka} alt="Grafika poukazu" fill className="object-cover" sizes="320px" />
                  <button
                    type="button"
                    onClick={() => setFotka("")}
                    className="absolute right-2 top-2 rounded-full bg-ink/70 px-2.5 py-1 text-xs text-cream"
                    aria-label="Odebrat grafiku"
                  >
                    ✕
                  </button>
                </div>
              )}
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent">
                {uploading ? "Nahrávám…" : fotka ? "Změnit grafiku" : "+ Nahrát grafiku"}
                <input type="file" accept="image/*" onChange={nahratFotku} disabled={uploading} className="hidden" />
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
                disabled={saving || uploading}
                className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Ukládám…" : "Uložit poukaz"}
              </button>
              <Link
                href="/admin"
                className="rounded-full border border-line px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Zrušit
              </Link>
            </div>
          </form>

          {/* ── Živý náhled — jak to uvidí návštěvnice ── */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              Náhled — takhle to uvidí návštěvnice webu
            </p>
            <div className="rounded-3xl border border-line bg-cream p-6 text-center">
              <div className="relative mx-auto aspect-[3/2] w-full max-w-sm overflow-hidden rounded-3xl">
                {fotka ? (
                  <Image src={fotka} alt="Náhled" fill className="object-cover" sizes="384px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sand">
                    <span className="font-allura text-4xl text-accent/60">Aurora</span>
                  </div>
                )}
              </div>

              <h2 className="mt-6 font-allura text-3xl text-ink">
                {nbsp(nadpis || "Nadpis poukazu")}
              </h2>
              {popis && (
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                  {nbsp(popis)}
                </p>
              )}

              <div className="mt-6 rounded-2xl bg-white/70 p-5 text-left ring-1 ring-line">
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
                  Hodnota poukazu
                </p>
                <div className="flex flex-wrap gap-2">
                  {platneCastky.length === 0 ? (
                    <p className="text-sm text-muted">Zatím žádná částka.</p>
                  ) : (
                    platneCastky.map((c, i) => (
                      <span
                        key={i}
                        className={`rounded-full px-5 py-2.5 text-sm ${
                          i === 0 ? "bg-gradient-aurora text-ink" : "border border-line text-ink"
                        }`}
                      >
                        {c.popisek ? `${c.popisek} — ${formatKc(c.hodnota_kc)}` : formatKc(c.hodnota_kc)}
                      </span>
                    ))
                  )}
                </div>
                <p className="mt-4 text-xs text-muted">
                  Pod tím vyplní jméno, e-mail a telefon a odešle objednávku.
                </p>
              </div>
            </div>
            {!zverejneno && (
              <p className="mt-3 text-xs text-accent-d">
                Poukaz je označený jako skrytý — na webu se nezobrazí, dokud nezaškrtneš „Zobrazit na
                webu“.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
