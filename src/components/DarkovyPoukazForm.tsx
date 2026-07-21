"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { nbsp } from "@/lib/typo";

const HODNOTY = ["500 Kč", "1000 Kč", "2000 Kč", "5000 Kč"];

type Vysledek = {
  kod: string;
  variabilniSymbol: string;
  cisloUctu: string;
  qrDataUrl: string | null;
};

export default function DarkovyPoukazForm() {
  const [hodnota, setHodnota] = useState(HODNOTY[1]);
  const [vlastniHodnota, setVlastniHodnota] = useState("");
  const [pouzitVlastni, setPouzitVlastni] = useState(false);
  const [jmenoKupujici, setJmenoKupujici] = useState("");
  const [emailKupujici, setEmailKupujici] = useState("");
  const [telefonKupujici, setTelefonKupujici] = useState("");
  const [jmenoObdarovane, setJmenoObdarovane] = useState("");
  const [vzkaz, setVzkaz] = useState("");
  const [souhlasGdpr, setSouhlasGdpr] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vysledek, setVysledek] = useState<Vysledek | null>(null);

  const vybranaHodnota = pouzitVlastni ? vlastniHodnota.trim() : hodnota;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/darkovy-poukaz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hodnota: vybranaHodnota,
        jmeno_kupujici: jmenoKupujici,
        email_kupujici: emailKupujici,
        telefon_kupujici: telefonKupujici,
        jmeno_obdarovane: jmenoObdarovane,
        vzkaz,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setVysledek({
        kod: data.kod,
        variabilniSymbol: data.variabilniSymbol,
        cisloUctu: data.cisloUctu,
        qrDataUrl: data.qrDataUrl ?? null,
      });
    } else {
      setError(data.error ?? "Odeslání se nepovedlo, zkus to prosím znovu.");
    }
    setSending(false);
  }

  if (vysledek) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-white/70 p-6 ring-1 ring-line">
        <p className="font-allura text-2xl text-ink">Děkujeme!</p>
        <p className="text-sm text-muted">
          {nbsp(`Tvůj poukaz v hodnotě ${vybranaHodnota} čeká na platbu. Jakmile ji přijmeme, pošleme ti poukaz e-mailem.`)}
        </p>

        <div className="flex flex-col gap-3 rounded-xl bg-sand/60 p-4 sm:flex-row sm:items-start">
          {vysledek.qrDataUrl && (
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image src={vysledek.qrDataUrl} alt="QR kód pro platbu" fill className="object-contain p-2" sizes="128px" unoptimized />
            </div>
          )}
          <div className="text-sm">
            <p className="font-medium text-ink">Platební údaje</p>
            <p className="mt-1 text-muted">
              Číslo účtu: <span className="text-ink">{vysledek.cisloUctu}</span>
              <br />
              Variabilní symbol: <span className="text-ink">{vysledek.variabilniSymbol}</span>
              <br />
              Částka: <span className="text-ink">{vybranaHodnota}</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-ink">
          Kód poukazu: <strong className="font-medium">{vysledek.kod}</strong>
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white/70 p-6 ring-1 ring-line">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">Hodnota poukazu</p>
        <div className="flex flex-wrap gap-2">
          {HODNOTY.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setHodnota(h);
                setPouzitVlastni(false);
              }}
              className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
                !pouzitVlastni && hodnota === h
                  ? "bg-gradient-aurora text-ink"
                  : "border border-line text-ink hover:border-accent"
              }`}
            >
              {h}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPouzitVlastni(true)}
            className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
              pouzitVlastni ? "bg-gradient-aurora text-ink" : "border border-line text-ink hover:border-accent"
            }`}
          >
            Vlastní částka
          </button>
        </div>
        {pouzitVlastni && (
          <input
            value={vlastniHodnota}
            onChange={(e) => setVlastniHodnota(e.target.value)}
            required
            placeholder="Např. 1500 Kč"
            className={`${inputCls} mt-3`}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={jmenoKupujici} onChange={(e) => setJmenoKupujici(e.target.value)} required placeholder="Tvoje jméno *" className={inputCls} />
        <input value={emailKupujici} onChange={(e) => setEmailKupujici(e.target.value)} required type="email" placeholder="Tvůj e-mail *" className={inputCls} />
      </div>
      <input value={telefonKupujici} onChange={(e) => setTelefonKupujici(e.target.value)} placeholder="Telefon (nepovinné)" className={inputCls} />

      <input value={jmenoObdarovane} onChange={(e) => setJmenoObdarovane(e.target.value)} placeholder="Jméno obdarované (nepovinné)" className={inputCls} />
      <textarea
        value={vzkaz}
        onChange={(e) => setVzkaz(e.target.value)}
        rows={3}
        placeholder="Vzkaz pro obdarovanou (nepovinné)"
        className={inputCls}
      />

      <label className="flex items-start gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={souhlasGdpr}
          onChange={(e) => setSouhlasGdpr(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 accent-[#F28D76]"
        />
        Souhlasím se zpracováním osobních údajů dle{" "}
        <a href="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent-d">
          zásad ochrany osobních údajů
        </a>
        .
      </label>

      {error && <p className="text-sm text-accent-d">{error}</p>}

      <button
        type="submit"
        disabled={sending || !vybranaHodnota}
        className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
      >
        {sending ? "Odesílám…" : "Chci darovat"}
      </button>
    </form>
  );
}
