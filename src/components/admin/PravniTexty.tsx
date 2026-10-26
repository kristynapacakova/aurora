"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRAVNI_TEXTY, type PravniStranka } from "@/lib/pravniTexty";
import type { PravniTextRadek } from "@/lib/db";
import { Zalozky } from "./ui";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";
const labelCls = "flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted";

function Stranka({
  popis,
  ulozena,
}: {
  popis: PravniStranka;
  ulozena: PravniTextRadek | undefined;
}) {
  const router = useRouter();
  // Do pole se předvyplní to, co je na webu — ať klientka upravuje text,
  // který lidé opravdu čtou.
  const [platneOd, setPlatneOd] = useState(ulozena?.platne_od || popis.platneOd);
  const [text, setText] = useState(ulozena?.text || popis.text);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upraveno = Boolean(ulozena);

  async function ulozit() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/pravni-texty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klic: popis.klic, platne_od: platneOd, text }),
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
    await fetch("/api/admin/pravni-texty", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ klic: popis.klic }),
    });
    setPlatneOd(popis.platneOd);
    setText(popis.text);
    setSaving(false);
    setSaved(false);
    router.refresh();
  }

  const doplnit = (text.match(/\[DOPLNIT/g) ?? []).length;

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-ink">{popis.nazev}</h3>
          <p className="mt-1 text-xs text-muted">
            Na webu na adrese{" "}
            <a
              href={popis.cesta}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-accent-d"
            >
              {popis.cesta}
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {doplnit > 0 && (
            <span className="rounded-full bg-accent-d/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
              {doplnit}× nevyplněno
            </span>
          )}
          {upraveno && (
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
              Upraveno
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className={labelCls}>
          Platné od
          <input
            value={platneOd}
            onChange={(e) => {
              setPlatneOd(e.target.value);
              setSaved(false);
            }}
            placeholder="Např. 1. listopadu 2026 — nech prázdné a datum se neukáže"
            className={inputCls}
          />
        </label>

        <label className={labelCls}>
          Text stránky
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setSaved(false);
            }}
            rows={26}
            className={`${inputCls} font-mono text-[13px] leading-relaxed`}
          />
        </label>

        {error && <p className="text-sm text-accent-d">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={ulozit}
            disabled={saving}
            className="rounded-full bg-gradient-aurora px-7 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Ukládám…" : saved ? "Uloženo ✓" : "Uložit"}
          </button>
          {upraveno && (
            <button
              type="button"
              onClick={vratitPuvodni}
              disabled={saving}
              className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent-d"
            >
              Vrátit původní znění
            </button>
          )}
          <a
            href={popis.cesta}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent-d"
          >
            Zobrazit na webu
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PravniTexty({ ulozene }: { ulozene: PravniTextRadek[] }) {
  const [zalozka, setZalozka] = useState<string>(PRAVNI_TEXTY[0].klic);

  return (
    <section className="flex flex-col gap-6">
      {/* Záložky stejné jako jinde v administraci. Karty se schovávají,
          ne odpojují — rozepsaný text přežije přepnutí stránky. */}
      <Zalozky
        className="sticky top-0 z-10 bg-cream/95 backdrop-blur"
        zalozky={PRAVNI_TEXTY.map((p) => ({ key: p.klic, label: p.kratky }))}
        aktivni={zalozka}
        onChange={setZalozka}
      />

      {PRAVNI_TEXTY.map((popis) => (
        <div key={popis.klic} className={zalozka === popis.klic ? "" : "hidden"}>
          <Stranka popis={popis} ulozena={ulozene.find((u) => u.klic === popis.klic)} />
        </div>
      ))}

      <div className="rounded-2xl bg-sand/60 p-6 text-sm leading-relaxed text-muted">
        <p className="mb-2 font-medium text-ink">Jak se text píše</p>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          <li>
            <code className="text-ink">## Nadpis</code> — nadpis části (např. „5. Pobyty
            a dárkové poukazy“)
          </li>
          <li>Prázdný řádek odděluje odstavce</li>
          <li>
            <code className="text-ink">- položka</code> — odrážka
          </li>
          <li>
            <code className="text-ink">**tučně**</code> — zvýraznění
          </li>
          <li>
            <code className="text-ink">{"[text](/adresa)"}</code> — odkaz na jinou stránku
          </li>
          <li>
            <code className="text-ink">{"{email}"}</code> — doplní se kontaktní e-mail
            z Nastavení
          </li>
        </ul>
        <p className="mt-3">
          Místa označená <code className="text-ink">[DOPLNIT…]</code> čekají na tvoje
          údaje — jméno, IČO, adresu a podobně. Dokud tam zůstanou, vidí je
          i návštěvnice webu.
        </p>
      </div>
    </section>
  );
}
