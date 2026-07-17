"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function VstupPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const response = await fetch("/api/site-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6 py-24">
      <div className="w-full max-w-md rounded-2xl bg-cream p-8 text-center shadow-sm ring-1 ring-line sm:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">
          Připravujeme se pro tebe
        </p>
        <h1 className="font-allura text-4xl text-ink">AURORA jóga</h1>
        <p className="mt-4 text-sm text-muted">
          Web zatím není veřejně dostupný. Pokud máš přístupový kód, zadej ho níže.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Přístupový kód"
            autoFocus
            className="w-full rounded-full border border-line bg-white px-5 py-3 text-center text-sm text-ink outline-none focus:border-accent"
          />

          {error && (
            <p className="text-xs text-accent-d">Nesprávný kód, zkus to prosím znovu.</p>
          )}

          <button
            type="submit"
            disabled={loading || !code}
            className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Ověřuji…" : "Vstoupit"}
          </button>
        </form>
      </div>
    </main>
  );
}
