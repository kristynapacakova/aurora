"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { upload } from "@vercel/blob/client";
import QRCode from "qrcode";
import type { Pobyt } from "@/lib/db";
import { nbsp } from "@/lib/typo";
import { czechAccountToIban } from "@/lib/platba";
import { rozpadPlatby, formatKc } from "@/lib/castky";
import { resizeImageFile } from "@/lib/imageResize";

export default function PobytForm({ initial }: { initial: Pobyt | null }) {
  const router = useRouter();
  const [nadpis, setNadpis] = useState(initial?.nadpis ?? "");
  const [misto, setMisto] = useState(initial?.misto ?? "");
  const [termin, setTermin] = useState(initial?.termin ?? "");
  const [cena, setCena] = useState(initial?.cena ?? "");
  const [popis, setPopis] = useState(initial?.popis ?? "");
  const [fotky, setFotky] = useState<string[]>(initial?.fotky ?? []);
  const [cisloUctu, setCisloUctu] = useState(initial?.cislo_uctu ?? "");
  const [variabilniSymbol, setVariabilniSymbol] = useState(initial?.variabilni_symbol ?? "");
  const [platebniPokyny, setPlatebniPokyny] = useState(initial?.platebni_pokyny ?? "");
  // Prázdný řetězec = zálohu nenabízíme (v databázi 0).
  const [zalohaProcento, setZalohaProcento] = useState(
    initial?.zaloha_procento ? String(initial.zaloha_procento) : ""
  );
  const [zverejneno, setZverejneno] = useState(initial?.zverejneno ?? true);
  const [vyprodano, setVyprodano] = useState(initial?.vyprodano ?? false);
  const [pripravujeSe, setPripravujeSe] = useState(initial?.pripravuje_se ?? false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ index: number; total: number; percent: number; faze: "zmensuji" | "nahravam" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [qrZalohaPreview, setQrZalohaPreview] = useState<string | null>(null);

  const iban = cisloUctu ? czechAccountToIban(cisloUctu) : null;
  const cisloUctuNeplatne = cisloUctu.length > 0 && !iban;

  const rozpad = rozpadPlatby({ cena, zalohaProcento: Number(zalohaProcento) || 0 });
  // Procento je vyplněné, ale z ceny nejde vyčíst číslo — pak zálohu nabídnout
  // neumíme a je fér to klientce rovnou říct.
  const zalohaBezCeny = Number(zalohaProcento) > 0 && rozpad.zaloha === null;

  // Živý náhled QR kódu — přegeneruje se při každé změně účtu/ceny/VS/zálohy.
  useEffect(() => {
    let cancelled = false;

    async function qr(amount: number | null): Promise<string | null> {
      if (!iban) return null;
      const vsDigits = variabilniSymbol.replace(/\D/g, "").slice(0, 10);
      const parts = ["SPD*1.0", `ACC:${iban}`];
      if (amount) parts.push(`AM:${amount.toFixed(2)}`);
      parts.push("CC:CZK");
      if (vsDigits) parts.push(`X-VS:${vsDigits}`);
      try {
        return await QRCode.toDataURL(parts.join("*"), { margin: 1, width: 240 });
      } catch {
        return null;
      }
    }

    async function updatePreview() {
      const [cely, zalohovy] = await Promise.all([qr(rozpad.celkem), qr(rozpad.zaloha)]);
      if (cancelled) return;
      setQrPreview(cely);
      setQrZalohaPreview(rozpad.zaloha ? zalohovy : null);
    }

    updatePreview();
    return () => {
      cancelled = true;
    };
  }, [iban, variabilniSymbol, rozpad.celkem, rozpad.zaloha]);

  async function uploadPhotos(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ index: i + 1, total: files.length, percent: 0, faze: "zmensuji" });
      const file = await resizeImageFile(files[i]);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      try {
        const blob = await upload(`pobyty/${Date.now()}-${safeName}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          onUploadProgress: ({ percentage }) =>
            setUploadProgress({ index: i + 1, total: files.length, percent: Math.round(percentage), faze: "nahravam" }),
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fotky.length === 0) {
      setError("Přidej aspoň jednu fotku.");
      return;
    }
    if (cisloUctuNeplatne) {
      setError("Číslo účtu nemá platný tvar (např. 123456789/0800).");
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
      cislo_uctu: cisloUctu,
      variabilni_symbol: variabilniSymbol,
      platebni_pokyny: platebniPokyny,
      zaloha_procento: Number(zalohaProcento) || 0,
      zverejneno,
      vyprodano,
      pripravuje_se: pripravujeSe,
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
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";
  const cardCls = "flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm";

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
          {initial ? "Upravit pobyt" : "Nový pobyt"}
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Formulář ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className={cardCls}>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Základní údaje</p>
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
            </div>

            {/* Fotky */}
            <div className={cardCls}>
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Fotky *</p>
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
              <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent">
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
                    {uploadProgress.faze === "zmensuji"
                      ? `Zmenšuji fotku ${uploadProgress.index} z ${uploadProgress.total}… (u velkých fotek to může chvíli trvat)`
                      : `Nahrávám fotku ${uploadProgress.index} z ${uploadProgress.total} — ${uploadProgress.percent}%`}
                  </p>
                  <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full bg-gradient-aurora transition-all duration-200 ${
                        uploadProgress.faze === "zmensuji" ? "w-1/6 animate-pulse" : ""
                      }`}
                      style={uploadProgress.faze === "nahravam" ? { width: `${uploadProgress.percent}%` } : undefined}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Platba */}
            <div className={cardCls}>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Platba (nepovinné)</p>
                <p className="mt-2 text-xs text-muted">
                  Vyplň číslo účtu a QR kód se vygeneruje sám. Zákaznice po kliknutí na „Závazně objednat“ uvidí
                  QR kód i vypsané platební údaje.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                  Číslo účtu
                  <input
                    value={cisloUctu}
                    onChange={(e) => setCisloUctu(e.target.value)}
                    className={inputCls}
                    placeholder="Např. 123456789/0800"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                  Variabilní symbol
                  <input
                    value={variabilniSymbol}
                    onChange={(e) => setVariabilniSymbol(e.target.value)}
                    className={inputCls}
                    placeholder="Nepovinné — jen číslice"
                  />
                </label>
              </div>
              {cisloUctuNeplatne && (
                <p className="text-xs text-accent-d">Číslo účtu nemá platný tvar (např. 123456789/0800).</p>
              )}

              {/* Záloha — když je pole prázdné nebo 0, zákaznice uvidí jen
                  jednu možnost: zaplatit celou částku. */}
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Záloha (% z ceny)
                <input
                  value={zalohaProcento}
                  onChange={(e) => setZalohaProcento(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  inputMode="numeric"
                  className={inputCls}
                  placeholder="Např. 30 — nech prázdné, když se platí jen celá částka"
                />
              </label>
              {rozpad.zaloha !== null && rozpad.celkem !== null && (
                <p className="text-xs text-muted">
                  Zákaznice si vybere: celá částka{" "}
                  <span className="text-ink">{formatKc(rozpad.celkem)}</span>, nebo záloha{" "}
                  <span className="text-ink">{formatKc(rozpad.zaloha)}</span> a doplatek{" "}
                  <span className="text-ink">{formatKc(rozpad.doplatek ?? 0)}</span> 14 dnů před pobytem.
                </p>
              )}
              {zalohaBezCeny && (
                <p className="text-xs text-accent-d">
                  Z ceny nejde vyčíst částka, takže zálohu spočítat neumíme — zákaznici se nabídne jen platba
                  celé částky. Napiš cenu třeba jako „4 900 Kč“.
                </p>
              )}

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                Platební pokyny (nepovinné)
                <textarea
                  value={platebniPokyny}
                  onChange={(e) => setPlatebniPokyny(e.target.value)}
                  rows={3}
                  className={inputCls}
                  placeholder="Např. Do poznámky pro příjemce napiš prosím své jméno a termín pobytu."
                />
              </label>

              {qrPreview && (
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                      <Image src={qrPreview} alt="Náhled QR kódu na celou částku" fill className="object-contain p-1.5" sizes="80px" unoptimized />
                    </div>
                    <p className="text-xs text-muted">
                      QR kód na celou částku
                      {rozpad.celkem !== null && <><br />{formatKc(rozpad.celkem)}</>}
                    </p>
                  </div>
                  {qrZalohaPreview && rozpad.zaloha !== null && (
                    <div className="flex items-center gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                        <Image src={qrZalohaPreview} alt="Náhled QR kódu na zálohu" fill className="object-contain p-1.5" sizes="80px" unoptimized />
                      </div>
                      <p className="text-xs text-muted">
                        QR kód na zálohu
                        <br />
                        {formatKc(rozpad.zaloha)}
                      </p>
                    </div>
                  )}
                </div>
              )}
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

            <label className="flex items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={vyprodano}
                onChange={(e) => setVyprodano(e.target.checked)}
                className="h-4 w-4 accent-[#F28D76]"
              />
              Vyprodáno — místo objednávky nabídnout čekací listinu
            </label>

            <label className="flex items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={pripravujeSe}
                onChange={(e) => setPripravujeSe(e.target.checked)}
                className="h-4 w-4 accent-[#F28D76]"
              />
              Připravujeme — zatím nejde objednat, jen se ukáže štítek
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
                className="rounded-full border border-line px-8 py-3 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
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
                  <h2 className="font-serif text-3xl text-ink sm:text-4xl">
                    {nbsp(nadpis || "Nadpis pobytu")}
                  </h2>

                  {(termin || misto || cena) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-accent">
                      {termin && <span>📅 {termin}</span>}
                      {misto && <span>📍 {misto}</span>}
                      {cena && <span>🏷️ {cena}</span>}
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

                  <span className="mt-6 inline-block w-fit cursor-default rounded-full bg-gradient-aurora px-7 py-3 text-xs uppercase tracking-[0.2em] text-ink opacity-90 shadow-sm">
                    Zjistit více →
                  </span>

                  <p className="mt-4 text-xs text-muted">
                    Takhle vypadá karta ve výpisu. Po kliknutí na „Zjistit více“ se zákaznici otevře detail
                    pobytu s celou galerií a tlačítky „Závazně objednat“ a „Mám dotaz“.
                  </p>

                  {(qrPreview || cisloUctu) && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-white/60 p-3 text-xs text-muted">
                      {qrPreview && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                          <Image src={qrPreview} alt="QR kód" fill className="object-contain p-1" sizes="56px" unoptimized />
                        </div>
                      )}
                      <div>
                        <p>Na detailu pobytu po kliknutí na „Závazně objednat“ uvidí zákaznice QR kód a tyto údaje:</p>
                        <p className="mt-1 text-ink">
                          Účet: {cisloUctu || "—"}
                          {variabilniSymbol && <> · VS: {variabilniSymbol}</>}
                        </p>
                        {rozpad.zaloha !== null && rozpad.celkem !== null && (
                          <p className="mt-1">
                            A vybere si, jestli pošle celou částku {formatKc(rozpad.celkem)}, nebo zálohu{" "}
                            {formatKc(rozpad.zaloha)}.
                          </p>
                        )}
                      </div>
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
