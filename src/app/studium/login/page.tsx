"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function StudioLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const response = await fetch("/api/studium-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      router.push("/studium");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-sand px-6 py-24">
      <div className="w-full max-w-md rounded-2xl bg-background p-8 text-center shadow-sm ring-1 ring-line sm:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-dark">
          Členská sekce
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">Studio</h1>
        <p className="mt-4 text-sm text-foreground/70">
          Tato stránka je dostupná pouze pro členy. Zadejte prosím přístupový
          kód, který jste obdrželi e-mailem.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Přístupový kód"
            autoFocus
            className="w-full rounded-lg border border-line bg-background px-4 py-2 text-center outline-none focus:border-accent-dark"
          />

          {error && (
            <p className="text-sm text-red-600">
              Nesprávný přístupový kód, zkuste to znovu.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent-dark px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-accent disabled:opacity-60"
          >
            {loading ? "Ověřuji…" : "Vstoupit"}
          </button>
        </form>
      </div>
    </main>
  );
}
