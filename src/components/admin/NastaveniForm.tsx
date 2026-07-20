"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Nastaveni } from "@/lib/db";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";
const cardCls = "flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm";
const labelCls = "flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted";

export default function NastaveniForm({ initial }: { initial: Nastaveni }) {
  const router = useRouter();
  const [form, setForm] = useState<Nastaveni>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Nastaveni>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch("/api/admin/nastaveni", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Uložení se nepovedlo.");
    }
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className={cardCls}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Kontakt</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className={labelCls}>
              Kontaktní e-mail
              <input type="email" value={form.kontakt_email} onChange={(e) => set("kontakt_email", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Instagram — popisek (@handle)
              <input value={form.instagram_handle} onChange={(e) => set("instagram_handle", e.target.value)} className={inputCls} />
            </label>
          </div>
          <label className={labelCls}>
            Instagram — odkaz
            <input value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} className={inputCls} />
          </label>
        </div>

        <div className={cardCls}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Ceník</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <label className={labelCls}>
              Za lekci (Kč)
              <input value={form.cena_lekce} onChange={(e) => set("cena_lekce", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Měsíční (Kč)
              <input value={form.cena_mesicni} onChange={(e) => set("cena_mesicni", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Roční (Kč / měsíc)
              <input value={form.cena_rocni} onChange={(e) => set("cena_rocni", e.target.value)} className={inputCls} />
            </label>
          </div>
        </div>

        <div className={cardCls}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Uscreen odkazy</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className={labelCls}>
              Hlavní stránka
              <input value={form.uscreen_home} onChange={(e) => set("uscreen_home", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Registrace
              <input value={form.uscreen_signup} onChange={(e) => set("uscreen_signup", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Přihlášení
              <input value={form.uscreen_login} onChange={(e) => set("uscreen_login", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Ceník na Uscreenu
              <input value={form.uscreen_plans} onChange={(e) => set("uscreen_plans", e.target.value)} className={inputCls} />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-accent-d">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-aurora rounded-full px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Ukládám…" : "Uložit nastavení"}
          </button>
          {saved && <p className="text-xs uppercase tracking-[0.2em] text-accent-d">Uloženo ✓</p>}
        </div>
      </form>

      <ZmenaHesla />
    </div>
  );
}

function ZmenaHesla() {
  const [heslo, setHeslo] = useState("");
  const [heslo2, setHeslo2] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (heslo.length < 6) {
      setError("Heslo musí mít aspoň 6 znaků.");
      return;
    }
    if (heslo !== heslo2) {
      setError("Hesla se neshodují.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/heslo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heslo }),
    });

    if (res.ok) {
      setSaved(true);
      setHeslo("");
      setHeslo2("");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Uložení se nepovedlo.");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className={cardCls}>
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Změnit heslo do administrace</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Nové heslo
          <input type="password" value={heslo} onChange={(e) => setHeslo(e.target.value)} className={inputCls} placeholder="Aspoň 6 znaků" />
        </label>
        <label className={labelCls}>
          Nové heslo znovu
          <input type="password" value={heslo2} onChange={(e) => setHeslo2(e.target.value)} className={inputCls} />
        </label>
      </div>
      {error && <p className="text-sm text-accent-d">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full border border-ink/30 px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {saving ? "Ukládám…" : "Změnit heslo"}
        </button>
        {saved && <p className="text-xs uppercase tracking-[0.2em] text-accent-d">Heslo změněno ✓</p>}
      </div>
    </form>
  );
}
