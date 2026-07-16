"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";

type Mode = "closed" | "objednavka" | "dotaz";

export default function PoptavkaForm({
  pobytId,
  pobytNadpis,
  cena,
  qrDataUrl,
  cisloUctu,
  variabilniSymbol,
  platebniPokyny,
}: {
  pobytId: number;
  pobytNadpis: string;
  cena?: string;
  qrDataUrl?: string;
  cisloUctu?: string;
  variabilniSymbol?: string;
  platebniPokyny?: string;
}) {
  const [mode, setMode] = useState<Mode>("closed");
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zprava, setZprava] = useState("");
  const [potvrzenoPlatba, setPotvrzenoPlatba] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPaymentInfo = Boolean(cisloUctu);

  function reset() {
    setMode("closed");
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/poptavka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pobyt_id: pobytId,
        typ: mode === "objednavka" ? "objednavka" : "dotaz",
        zaplaceno: mode === "objednavka" ? potvrzenoPlatba : false,
        jmeno,
        email,
        telefon,
        zprava,
      }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Odeslání se nepovedlo, zkus to prosím znovu.");
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-white/70 p-6 text-center ring-1 ring-line">
        <p className="font-allura text-2xl text-ink">Děkujeme!</p>
        <p className="mt-2 text-sm text-muted">
          {mode === "objednavka"
            ? "Tvoje objednávka je na cestě. Brzy se ti ozveme s potvrzením. 🌿"
            : "Tvůj dotaz je na cestě. Ozveme se ti co nejdřív. 🌿"}
        </p>
      </div>
    );
  }

  if (mode === "closed") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setMode("objednavka")}
          className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          Závazně objednat →
        </button>
        <button
          onClick={() => setMode("dotaz")}
          className="rounded-full border border-ink/30 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-ink"
        >
          Mám dotaz
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl bg-white/70 p-6 ring-1 ring-line"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-accent">
        {mode === "objednavka" ? "Závazná objednávka" : "Dotaz"} — {pobytNadpis}
      </p>

      {mode === "objednavka" && (
        <>
          {cena && (
            <p className="text-sm text-ink">
              Cena: <strong className="font-medium">{cena}</strong>
            </p>
          )}

          {hasPaymentInfo && (
            <div className="flex flex-col gap-3 rounded-xl bg-sand/60 p-4 sm:flex-row sm:items-start">
              {qrDataUrl && (
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image src={qrDataUrl} alt="QR kód pro platbu" fill className="object-contain p-2" sizes="128px" unoptimized />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-ink">Platební údaje</p>
                <p className="mt-1 text-muted">
                  Číslo účtu: <span className="text-ink">{cisloUctu}</span>
                  {variabilniSymbol && (
                    <>
                      <br />
                      Variabilní symbol: <span className="text-ink">{variabilniSymbol}</span>
                    </>
                  )}
                </p>
                {platebniPokyny && (
                  <p className="mt-2 whitespace-pre-line text-muted">{platebniPokyny}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={jmeno} onChange={(e) => setJmeno(e.target.value)} required placeholder="Jméno *" className={inputCls} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="E-mail *" className={inputCls} />
      </div>
      <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefon" className={inputCls} />
      <textarea
        value={zprava}
        onChange={(e) => setZprava(e.target.value)}
        rows={3}
        placeholder={mode === "objednavka" ? "Poznámka (nepovinné)" : "Tvůj dotaz"}
        required={mode === "dotaz"}
        className={inputCls}
      />

      {mode === "objednavka" && hasPaymentInfo && (
        <label className="flex items-start gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={potvrzenoPlatba}
            onChange={(e) => setPotvrzenoPlatba(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 accent-[#F28D76]"
          />
          Potvrzuji, že jsem platbu provedla podle uvedených údajů.
        </label>
      )}

      {error && <p className="text-sm text-accent-d">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
        >
          {sending
            ? "Odesílám…"
            : mode === "objednavka"
              ? "Odeslat závaznou objednávku"
              : "Odeslat dotaz"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
