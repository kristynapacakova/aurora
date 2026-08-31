"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Nastaveni } from "@/lib/db";
import { czechAccountToIban } from "@/lib/platba";
import type { StavOdesilani } from "@/lib/email";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30";
const cardCls = "flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm";
const labelCls = "flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted";

export default function NastaveniForm({
  initial,
  email,
}: {
  initial: Nastaveni;
  email: StavOdesilani;
}) {
  const router = useRouter();
  const [form, setForm] = useState<Nastaveni>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zkušební e-mail
  const [testEmail, setTestEmail] = useState(email.notifikace);
  const [testStav, setTestStav] = useState<"idle" | "posilam" | "ok">("idle");
  const [testChyba, setTestChyba] = useState<string | null>(null);

  async function posliTest() {
    setTestStav("posilam");
    setTestChyba(null);
    const res = await fetch("/api/admin/test-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setTestStav("ok");
    } else {
      setTestStav("idle");
      setTestChyba(data.error ?? "Odeslání se nepovedlo.");
    }
  }

  function set<K extends keyof Nastaveni>(key: K, value: Nastaveni[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  const uctuDarkyNeplatne = form.cislo_uctu_darky.length > 0 && !czechAccountToIban(form.cislo_uctu_darky);

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
      {/* Nastavení je dlouhé a není z něj poznat, co všechno obsahuje.
          Odkazy skáčou na jednotlivé karty; scroll-mt drží nadpis pod
          lepící se lištou. */}
      <nav className="sticky top-0 z-10 flex flex-wrap gap-2 rounded-2xl bg-cream/95 py-3 backdrop-blur">
        {[
          ["nastaveni-kontakt", "Kontakt"],
          ["nastaveni-cenik", "Ceník"],
          ["nastaveni-uscreen", "Uscreen odkazy"],
          ["nastaveni-domena", "Doména"],
          ["nastaveni-odesilani", "Odesílání e-mailů"],
          ["nastaveni-poukazy", "Dárkové poukazy"],
          ["nastaveni-heslo", "Heslo"],
        ].map(([id, popisek]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border border-line bg-white px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {popisek}
          </a>
        ))}
      </nav>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div id="nastaveni-kontakt" className={`${cardCls} scroll-mt-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Kontakt</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className={labelCls}>
              Kontaktní e-mail
              <input type="email" value={form.kontakt_email} onChange={(e) => set("kontakt_email", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Telefon
              <input value={form.telefon} onChange={(e) => set("telefon", e.target.value)} className={inputCls} placeholder="Např. 776 892 955" />
            </label>
            <label className={labelCls}>
              Instagram — popisek (@handle)
              <input value={form.instagram_handle} onChange={(e) => set("instagram_handle", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Instagram — odkaz
              <input value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} className={inputCls} />
            </label>
            <label className={labelCls}>
              Facebook — popisek
              <input value={form.facebook_handle} onChange={(e) => set("facebook_handle", e.target.value)} className={inputCls} placeholder="Např. Aurora Yoga" />
            </label>
            <label className={labelCls}>
              Facebook — odkaz
              <input value={form.facebook_url} onChange={(e) => set("facebook_url", e.target.value)} className={inputCls} />
            </label>
          </div>
          <p className="text-xs text-muted">
            Telefon a odkazy na sítě se ukazují na stránce Lekce v bloku „Rezervace“.
          </p>
        </div>

        <div id="nastaveni-cenik" className={`${cardCls} scroll-mt-4`}>
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

        <div id="nastaveni-uscreen" className={`${cardCls} scroll-mt-4`}>
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

        <div id="nastaveni-domena" className={`${cardCls} scroll-mt-4`}>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Doména</p>
          <label className={labelCls}>
            Doména platí do
            <input
              type="date"
              value={form.domena_expiruje}
              onChange={(e) => set("domena_expiruje", e.target.value)}
              className={`${inputCls} max-w-xs`}
            />
          </label>
          <p className="text-xs text-muted">
            Až bude zbývat 30 dní nebo míň, zobrazí se upozornění na Overview a u ikony Nastavení.
          </p>
        </div>

        {/* Odesílání e-mailů — do Vercelu z administrace nevidíme, tak si
            aspoň řekneme, co k nám z proměnných dorazilo. Klíč se schválně
            jen potvrzuje, nikdy nevypisuje. */}
        <div id="nastaveni-odesilani" className={`${cardCls} scroll-mt-4`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Odesílání e-mailů</p>
            <p className="mt-2 text-xs text-muted">
              Potvrzení objednávek a kódy poukazů chodí přes Resend. Nastavuje se ve Vercelu
              (Settings → Environment Variables); po změně je potřeba web znovu nasadit.
            </p>
          </div>

          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex flex-wrap items-baseline gap-2">
              <span className={email.klic ? "text-ink" : "text-accent-d"}>
                {email.klic ? "✓" : "✕"}
              </span>
              <span className="text-muted">RESEND_API_KEY</span>
              <span className="text-ink">{email.klic ? "nastaveno" : "chybí"}</span>
            </li>
            <li className="flex flex-wrap items-baseline gap-2">
              <span className={email.odesilatel ? "text-ink" : "text-accent-d"}>
                {email.odesilatel ? "✓" : "✕"}
              </span>
              <span className="text-muted">RESEND_FROM_EMAIL</span>
              <span className="text-ink">{email.odesilatel || "chybí"}</span>
            </li>
            <li className="flex flex-wrap items-baseline gap-2">
              <span className={email.notifikace ? "text-ink" : "text-accent-d"}>
                {email.notifikace ? "✓" : "✕"}
              </span>
              <span className="text-muted">RESEND_TO_EMAIL</span>
              <span className="text-ink">{email.notifikace || "chybí"}</span>
            </li>
          </ul>

          {email.odesilatel && !email.odesilatelNaVlastniDomene && (
            <p className="rounded-xl bg-sand/60 p-3 text-xs leading-relaxed text-accent-d">
              Odesílatel není na doméně aurorayoga.cz. Resend umí posílat jen z ověřené domény,
              takže zákaznicím nic nedorazí. Nastav třeba{" "}
              <span className="text-ink">Aurora jóga &lt;ahoj@aurorayoga.cz&gt;</span> — ta schránka
              nemusí existovat, stačí ověřená doména. Odpovědi chodí na adresu z RESEND_TO_EMAIL.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label className={labelCls}>
              Poslat zkušební e-mail na
              <div className="flex flex-wrap gap-2">
                <input
                  value={testEmail}
                  onChange={(e) => {
                    setTestEmail(e.target.value);
                    setTestStav("idle");
                    setTestChyba(null);
                  }}
                  placeholder="tvuj@email.cz"
                  className={`${inputCls} max-w-xs`}
                />
                <button
                  type="button"
                  onClick={posliTest}
                  disabled={testStav === "posilam" || !testEmail.trim()}
                  className="rounded-full border border-line px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                >
                  {testStav === "posilam" ? "Posílám…" : "Poslat"}
                </button>
              </div>
            </label>
            <p className="text-xs text-muted">
              Vyzkoušej i jinou adresu, než je ta pro notifikace — teprve tím se pozná, jestli pošta
              projde i zákaznicím.
            </p>
            {testStav === "ok" && (
              <p className="text-xs text-ink">Odesláno. Když nedorazí, mrkni i do spamu.</p>
            )}
            {testChyba && <p className="text-xs text-accent-d">{testChyba}</p>}
          </div>
        </div>

        <div id="nastaveni-poukazy" className={`${cardCls} scroll-mt-4`}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Dárkové poukazy</p>
            <p className="mt-2 text-xs text-muted">
              Číslo účtu, na které budou chodit platby za dárkové poukazy. Dokud není vyplněné,
              stránka s poukazy na webu zůstane skrytá.
            </p>
          </div>
          <label className={labelCls}>
            Číslo účtu
            <input
              value={form.cislo_uctu_darky}
              onChange={(e) => set("cislo_uctu_darky", e.target.value)}
              className={`${inputCls} max-w-xs`}
              placeholder="Např. 123456789/0800"
            />
          </label>
          {uctuDarkyNeplatne && (
            <p className="text-xs text-accent-d">Číslo účtu nemá platný tvar (např. 123456789/0800).</p>
          )}

        </div>

        {error && <p className="text-sm text-accent-d">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || uctuDarkyNeplatne}
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
    <form onSubmit={handleSubmit} id="nastaveni-heslo" className={`${cardCls} scroll-mt-4`}>
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
