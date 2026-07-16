"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ChangeEvent } from "react";
import type { Pobyt } from "@/lib/db";

export default function PobytForm({ initial }: { initial: Pobyt | null }) {
  const router = useRouter();
  const [nadpis, setNadpis] = useState(initial?.nadpis ?? "");
  const [misto, setMisto] = useState(initial?.misto ?? "");
  const [termin, setTermin] = useState(initial?.termin ?? "");
  const [cena, setCena] = useState(initial?.cena ?? "");
  const [popis, setPopis] = useState(initial?.popis ?? "");
  const [fotky, setFotky] = useState<string[]>(initial?.fotky ?? []);
  const [zverejneno, setZverejneno] = useState(initial?.zverejneno ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadPhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setFotky((prev) => [...prev, data.url]);
      } else {
        setError(data.error ?? "Nahrání fotky se nepovedlo.");
        break;
      }
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { id: initial?.id, nadpis, misto, termin, cena, popis, fotky, zverejneno };
    const res = await fetch("/api/admin/pobyty", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link href="/admin" className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
          ← Zpět na přehled
        </Link>
        <h1 className="mt-4 mb-8 font-allura text-4xl text-ink">
          {initial ? "Upravit pobyt" : "Nový pobyt"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Nadpis *
            <input value={nadpis} onChange={(e) => setNadpis(e.target.value)} required className={inputCls} placeholder="Např. Jarní pobyt pro ženy" />
          </label>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Místo
              <input value={misto} onChange={(e) => setMisto(e.target.value)} className={inputCls} placeholder="Např. Šumava, penzion U Lesa" />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Termín
              <input value={termin} onChange={(e) => setTermin(e.target.value)} className={inputCls} placeholder="Např. 12.–14. června 2026" />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Cena
            <input value={cena} onChange={(e) => setCena(e.target.value)} className={inputCls} placeholder="Např. 4 900 Kč" />
          </label>

          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
            Popis
            <textarea
              value={popis}
              onChange={(e) => setPopis(e.target.value)}
              rows={8}
              className={inputCls}
              placeholder="Co ženy na pobytu čeká… (odstavce odděl prázdným řádkem)"
            />
          </label>

          {/* Fotky */}
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-muted">Fotky</span>
            {fotky.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {fotky.map((url, i) => (
                  <div key={url} className="group relative aspect-square overflow-hidden rounded-xl">
                    <Image src={url} alt={`Fotka ${i + 1}`} fill className="object-cover" sizes="150px" />
                    <button
                      type="button"
                      onClick={() => setFotky((prev) => prev.filter((u) => u !== url))}
                      className="absolute right-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Odebrat fotku"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:border-ink">
              {uploading ? "Nahrávám…" : "+ Nahrát fotky"}
              <input type="file" accept="image/*" multiple onChange={uploadPhotos} disabled={uploading} className="hidden" />
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
              {saving ? "Ukládám…" : "Uložit pobyt"}
            </button>
            <Link
              href="/admin"
              className="rounded-full border border-line px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted hover:border-ink hover:text-ink"
            >
              Zrušit
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
