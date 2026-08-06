"use client";

import { useState, type FormEvent } from "react";
import { nbsp } from "@/lib/typo";
import { HONEYPOT_FIELD, FORM_LOADED_FIELD } from "@/lib/honeypot";

export default function KontaktForm() {
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zprava, setZprava] = useState("");
  const [souhlasGdpr, setSouhlasGdpr] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt] = useState(() => Date.now());
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/kontakt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jmeno,
        email,
        telefon,
        zprava,
        [HONEYPOT_FIELD]: honeypot,
        [FORM_LOADED_FIELD]: formLoadedAt,
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
        <p className="mt-2 text-sm text-muted">{nbsp("Tvoje zpráva dorazila. Ozvu se ti co nejdřív. 🌿")}</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white/70 p-6 ring-1 ring-line">
      <input
        type="text"
        name={HONEYPOT_FIELD}
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={jmeno} onChange={(e) => setJmeno(e.target.value)} required placeholder="Jméno *" className={inputCls} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="E-mail *" className={inputCls} />
      </div>
      <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefon (nepovinné)" className={inputCls} />
      <textarea
        value={zprava}
        onChange={(e) => setZprava(e.target.value)}
        required
        rows={5}
        placeholder="Tvoje zpráva *"
        className={inputCls}
      />

      <label className="flex items-start gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={souhlasGdpr}
          onChange={(e) => setSouhlasGdpr(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
        />
        <span>
          Souhlasím se zpracováním osobních údajů dle{" "}
          <a href="/ochrana-osobnich-udaju" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent-d">
            zásad ochrany osobních údajů
          </a>
          .
        </span>
      </label>

      {error && <p className="text-sm text-accent-d">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-fit rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50"
      >
        {sending ? "Odesílám…" : "Odeslat zprávu"}
      </button>
    </form>
  );
}
