"use client";

import { useState, type FormEvent } from "react";

export default function PoptavkaForm({
  pobytId,
  pobytNadpis,
}: {
  pobytId: number;
  pobytNadpis: string;
}) {
  const [open, setOpen] = useState(false);
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zprava, setZprava] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/poptavka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pobyt_id: pobytId, jmeno, email, telefon, zprava }),
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
          Tvoje poptávka je na cestě. Ozveme se ti co nejdřív. 🌿
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
      >
        Mám zájem
      </button>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl bg-white/70 p-6 ring-1 ring-line"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-accent">
        Nezávazná poptávka — {pobytNadpis}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={jmeno} onChange={(e) => setJmeno(e.target.value)} required placeholder="Jméno *" className={inputCls} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="E-mail *" className={inputCls} />
      </div>
      <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefon" className={inputCls} />
      <textarea value={zprava} onChange={(e) => setZprava(e.target.value)} rows={3} placeholder="Zpráva (nepovinné)" className={inputCls} />
      {error && <p className="text-sm text-accent-d">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Odesílám…" : "Odeslat poptávku"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
