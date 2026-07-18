"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-24">
      <div className="w-full max-w-md rounded-2xl bg-cream p-8 text-center shadow-sm ring-1 ring-line sm:p-10">
        <Image src="/logo.png" alt="AURORA jóga" width={140} height={110} className="mx-auto h-20 w-auto" priority />
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-accent">
          Administrace
        </p>
        <p className="mt-3 text-sm text-muted">
          Přihlas se heslem pro správu pobytů a článků.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            autoFocus
            className="rounded-full border border-line bg-white px-5 py-3 text-sm text-ink outline-none focus:border-accent"
          />
          {error && (
            <p className="text-xs text-accent-d">Nesprávné heslo, zkus to znovu.</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Přihlašuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </main>
  );
}
