"use client";

import { useState, type FormEvent } from "react";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Přihlášení se nepovedlo, zkus to prosím znovu.");
      setSending(false);
    }
  }

  return (
    <section className="bg-sand relative py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <FadeUp>
          <div className="mb-4 flex items-center justify-center gap-3">
            <IconSparkle size={12} />
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Newsletter</p>
            <IconSparkle size={12} />
          </div>
          <h2 className="font-allura text-4xl text-ink sm:text-5xl">
            {nbsp("Zůstaňme v spojení")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            {nbsp("Jednou za čas ti pošlu pozvánku na nový pobyt, tip na dechové cvičení nebo pár slov na povzbuzení. Žádný spam, jen věci, které mají smysl.")}
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          {sent ? (
            <div className="mt-8 rounded-2xl bg-white/70 p-6 ring-1 ring-line">
              <p className="font-allura text-2xl text-ink">Děkujeme!</p>
              <p className="mt-2 text-sm text-muted">{nbsp("Brzy se ti ozvu. 🌿")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="Tvůj e-mail"
                className="w-full max-w-xs rounded-full border border-line bg-white px-5 py-3 text-sm text-ink outline-none focus:border-accent sm:w-72"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-gradient-aurora w-full shrink-0 rounded-full px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md disabled:opacity-50 sm:w-auto"
              >
                {sending ? "Odesílám…" : "Přihlásit se"}
              </button>
            </form>
          )}
          {error && <p className="mt-3 text-sm text-accent-d">{error}</p>}
        </FadeUp>
      </div>
    </section>
  );
}
