"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SABLONY, type SablonaPopis } from "@/lib/emailSablony";
import type { EmailSablonaRadek } from "@/lib/db";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";
const labelCls = "flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted";

function Sablona({
  popis,
  ulozena,
}: {
  popis: SablonaPopis;
  ulozena: EmailSablonaRadek | undefined;
}) {
  const router = useRouter();
  // Prázdné pole znamená „ber původní text" — proto se do formuláře
  // předvyplní výchozí znění, ať klientka upravuje to, co opravdu chodí.
  const [predmet, setPredmet] = useState(ulozena?.predmet || popis.predmet);
  const [odstavce, setOdstavce] = useState(ulozena?.odstavce || popis.odstavce.join("\n\n"));
  const [zaver, setZaver] = useState(ulozena?.zaver || popis.zaver.join("\n\n"));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upraveno = Boolean(ulozena);

  async function ulozit() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/email-sablony", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klic: popis.klic, predmet, odstavce, zaver }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Uložení se nepovedlo.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  async function vratitPuvodni() {
    setSaving(true);
    await fetch("/api/admin/email-sablony", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klic: popis.klic }),
    });
    setPredmet(popis.predmet);
    setOdstavce(popis.odstavce.join("\n\n"));
    setZaver(popis.zaver.join("\n\n"));
    setSaving(false);
    setSaved(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div>
        <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
          {popis.nazev}
          {upraveno && (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
              Upraveno
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-muted">{popis.kdyChodi}</p>
      </div>

      <label className={labelCls}>
        Předmět
        <input
          value={predmet}
          onChange={(e) => {
            setPredmet(e.target.value);
            setSaved(false);
          }}
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        Úvodní text
        <textarea
          value={odstavce}
          onChange={(e) => {
            setOdstavce(e.target.value);
            setSaved(false);
          }}
          rows={4}
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        Závěr
        <textarea
          value={zaver}
          onChange={(e) => {
            setZaver(e.target.value);
            setSaved(false);
          }}
          rows={3}
          className={inputCls}
        />
      </label>

      <div className="rounded-xl bg-sand/50 p-4 text-xs leading-relaxed text-muted">
        <p className="font-medium text-ink">Co můžeš do textu vložit</p>
        <ul className="mt-2 flex flex-col gap-1">
          {popis.znacky.map((z) => (
            <li key={z.znacka}>
              <span className="text-ink">{z.znacka}</span> — {z.popis}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Odstavce oddělíš prázdným řádkem. Údaje jako termín, číslo účtu, variabilní symbol nebo
          QR kód se do e-mailu doplňují samy — v textu je psát nemusíš.
        </p>
      </div>

      {error && <p className="text-sm text-accent-d">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={ulozit}
          disabled={saving}
          className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Ukládám…" : "Uložit"}
        </button>
        {upraveno && (
          <button
            type="button"
            onClick={vratitPuvodni}
            disabled={saving}
            className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
          >
            Vrátit původní znění
          </button>
        )}
        {saved && <span className="text-xs text-accent-d">Uloženo</span>}
      </div>
    </div>
  );
}

export default function EmailSablony({ ulozene }: { ulozene: EmailSablonaRadek[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-serif text-xl text-ink">Automatické e-maily</p>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">
          Tyhle e-maily odcházejí zákaznicím samy. Upravit jde předmět a texty; tabulka s údaji,
          QR kód a patička se skládají samy z toho, co se opravdu stalo. Notifikace, které chodí
          tobě, tady nejsou — ty se needitují.
        </p>
      </div>

      {SABLONY.map((popis) => (
        <Sablona
          key={popis.klic}
          popis={popis}
          ulozena={ulozene.find((u) => u.klic === popis.klic)}
        />
      ))}
    </div>
  );
}
