"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import type { Pobyt } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export default function PobytForm({ initial }: { initial: Pobyt | null }) {
  const router = useRouter();
  const [nadpis, setNadpis] = useState(initial?.nadpis ?? "");
  const [misto, setMisto] = useState(initial?.misto ?? "");
  const [termin, setTermin] = useState(initial?.termin ?? "");
  const [cena, setCena] = useState(initial?.cena ?? "");
  const [popis, setPopis] = useState(initial?.popis ?? "");
  const [fotky, setFotky] = useState<string[]>(initial?.fotky ?? []);
  const [qrKod, setQrKod] = useState(initial?.qr_kod ?? "");
  const [platebniPokyny, setPlatebniPokyny] = useState(initial?.platebni_pokyny ?? "");
  const [zverejneno, setZverejneno] = useState(initial?.zverejneno ?? true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ index: number; total: number; percent: number } | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadPhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress({ index: i + 1, total: files.length, percent: 0 });
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      try {
        const blob = await upload(`pobyty/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          onUploadProgress: ({ percentage }) =>
            setUploadProgress({ index: i + 1, total: files.length, percent: Math.round(percentage) }),
        });
        setFotky((prev) => [...prev, blob.url]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nahrání fotky se nepovedlo.");
        break;
      }
    }
    setUploading(false);
    setUploadProgress(null);
    e.target.value = "";
  }

  async function uploadQrCode(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingQr(true);
    setError(null);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    try {
      const blob = await upload(`qr-kody/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setQrKod(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nahrání QR kódu se nepovedlo.");
    }
    setUploadingQr(false);
    e.target.value = "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fotky.length === 0) {
      setError("Přidej aspoň jednu fotku.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      id: initial?.id,
      nadpis,
      misto,
      termin,
      cena,
      popis,
      fotky,
      qr_kod: qrKod,
      platebni_pokyny: platebniPokyny,
      zverejneno,
    };
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
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/admin" className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
          ← Zpět na přehled
        </Link>
        <h1 className="mt-4 mb-8 font-allura text-4xl text-ink">
          {initial ? "Upravit pobyt" : "Nový pobyt"}
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Formulář ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Nadpis *
              <input value={nadpis} onChange={(e) => setNadpis(e.target.value)} required className={inputCls} placeholder="Např. Jarní pobyt pro ženy" />
            </label>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Místo *
                <input value={misto} onChange={(e) => setMisto(e.target.value)} required className={inputCls} placeholder="Např. Šumava, penzion U Lesa" />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Termín *
                <input value={termin} onChange={(e) => setTermin(e.target.value)} required className={inputCls} placeholder="Např. 12.–14. června 2026" />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Cena *
              <input value={cena} onChange={(e) => setCena(e.target.value)} required className={inputCls} placeholder="Např. 4 900 Kč" />
            </label>

            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              Popis *
              <textarea
                value={popis}
                onChange={(e) => setPopis(e.target.value)}
                required
                rows={8}
                className={inputCls}
                placeholder="Co ženy na pobytu čeká… (odstavce odděl prázdným řádkem)"
              />
            </label>

            {/* Fotky */}
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted">Fotky *</span>
              {fotky.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {fotky.map((url, i) => (
                    <div key={url} className="group relative aspect-square overflow-hidden rounded-xl">
                      <Image src={url} alt={`Fotka ${i + 1}`} fill className="object-cover" sizes="150px" />
                      {i === 0 && (
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream">
                          úvodní
                        </span>
                      )}
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
              {fotky.length > 1 && (
                <p className="text-xs text-muted">
                  První fotka je úvodní (zobrazí se v seznamu pobytů). Ostatní uvidí návštěvnice v galerii po
                  rozkliknutí pobytu.
                </p>
              )}
              {uploadProgress && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-muted">
                    Nahrávám fotku {uploadProgress.index} z {uploadProgress.total} — {uploadProgress.percent}%
                  </p>
                  <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-gradient-aurora transition-all duration-200"
                      style={{ width: `${uploadProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Platba */}
            <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white/50 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Platba (nepovinné)</p>
                <p className="mt-1 text-xs text-muted">
                  Když sem nahraješ QR kód a napíšeš pokyny, zákaznice je uvidí po kliknutí na „Závazně objednat“.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-muted">QR kód pro platbu</span>
                {qrKod && (
                  <div className="group relative h-32 w-32 overflow-hidden rounded-xl border border-line bg-white">
                    <Image src={qrKod} alt="QR kód pro platbu" fill className="object-contain p-2" sizes="128px" />
                    <button
                      type="button"
                      onClick={() => setQrKod("")}
                      className="absolute right-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Odebrat QR kód"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:border-ink">
                  {uploadingQr ? "Nahrávám…" : qrKod ? "Nahradit QR kód" : "+ Nahrát QR kód"}
                  <input type="file" accept="image/*" onChange={uploadQrCode} disabled={uploadingQr} className="hidden" />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Platební pokyny
                <textarea
                  value={platebniPokyny}
                  onChange={(e) => setPlatebniPokyny(e.target.value)}
                  rows={3}
                  className={inputCls}
                  placeholder="Např. Jako variabilní symbol uveď své telefonní číslo. Číslo účtu: 123456789/0800."
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

          {/* ── Živý náhled — stejná karta jako na /pobyty ── */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              Náhled — takhle to uvidí návštěvnice webu
            </p>
            <div className="rounded-3xl border border-line bg-cream p-6">
              <article className="flex flex-col gap-6">
                {/* Fotky */}
                <div className="w-full">
                  {fotky.length > 0 ? (
                    <>
                      <div className="photo-arch-left relative h-[240px] w-full overflow-hidden sm:h-[280px]">
                        <Image src={fotky[0]} alt="Náhled" fill className="object-cover" sizes="500px" />
                      </div>
                      {fotky.length > 1 && (
                        <div className="mt-3 grid grid-cols-4 gap-3">
                          {fotky.slice(1, 5).map((url, j) => (
                            <div key={url} className="relative aspect-square overflow-hidden rounded-xl">
                              <Image src={url} alt={`Náhled fotky ${j + 2}`} fill className="object-cover" sizes="120px" />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="photo-arch-left flex h-[240px] w-full items-center justify-center bg-sand sm:h-[280px]">
                      <span className="font-allura text-3xl text-accent/60">Aurora</span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <h2 className="font-allura text-3xl text-ink">
                    {nbsp(nadpis || "Nadpis pobytu")}
                  </h2>

                  {(termin || misto || cena) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs uppercase tracking-[0.2em] text-accent">
                      {termin && <span>📅 {termin}</span>}
                      {misto && <span>📍 {misto}</span>}
                      {cena && (
                        <span className="text-sm normal-case tracking-normal text-ink">
                          <strong className="font-medium">{cena}</strong>
                        </span>
                      )}
                    </div>
                  )}

                  {popis && (
                    <div className="mt-5 flex flex-col gap-3">
                      {popis.split(/\n\s*\n/).map((odst, j) => (
                        <p key={j} className="text-sm leading-relaxed text-muted">
                          {nbsp(odst)}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-block cursor-default rounded-full bg-accent px-7 py-3 text-xs uppercase tracking-[0.2em] text-white opacity-90">
                      Závazně objednat →
                    </span>
                    <span className="inline-block cursor-default rounded-full border border-ink/30 px-7 py-3 text-xs uppercase tracking-[0.2em] text-ink opacity-90">
                      Mám dotaz
                    </span>
                  </div>

                  {(qrKod || platebniPokyny) && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/60 p-3 text-xs text-muted">
                      {qrKod && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                          <Image src={qrKod} alt="QR kód" fill className="object-contain p-1" sizes="56px" />
                        </div>
                      )}
                      <p>
                        Po kliknutí na „Závazně objednat“ se toto zobrazí zákaznici k platbě.
                        {platebniPokyny && <> Pokyny: „{platebniPokyny}“</>}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            </div>
            {!zverejneno && (
              <p className="mt-3 text-xs text-accent-d">
                Pobyt je označený jako skrytý — na webu se nezobrazí, dokud nezaškrtneš „Zobrazit na webu“.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
