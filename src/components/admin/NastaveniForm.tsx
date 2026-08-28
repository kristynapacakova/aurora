"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Nastaveni, PoukazCastka } from "@/lib/db";
import { upload } from "@vercel/blob/client";
import { resizeImageFile } from "@/lib/imageResize";
import { formatKc } from "@/lib/castky";
import { czechAccountToIban } from "@/lib/platba";
import type { StavOdesilani } from "@/lib/email";

// Cesta v úložišti musí být unikátní, ať se stejně pojmenované soubory
// nepřepisují. Schválně mimo komponentu — Date.now() v jejím těle hlídá
// lint jako nečistou funkci.
function cestaProFotku(jmenoSouboru: string): string {
  const bezpecne = jmenoSouboru.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `poukaz/${Date.now()}-${bezpecne}`;
}

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

  const [nahravam, setNahravam] = useState(false);

  function nastavCastku(index: number, zmena: Partial<PoukazCastka>) {
    set(
      "poukaz_castky",
      form.poukaz_castky.map((c, i) => (i === index ? { ...c, ...zmena } : c))
    );
  }

  async function nahratFotkuPoukazu(soubor: File) {
    setNahravam(true);
    try {
      const zmenseny = await resizeImageFile(soubor);
      const blob = await upload(cestaProFotku(zmenseny.name), zmenseny, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      set("poukaz_fotka", blob.url);
    } catch {
      setError("Nahrání fotky se nepovedlo.");
    }
    setNahravam(false);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className={cardCls}>
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

        <div className={cardCls}>
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
        <div className={cardCls}>
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

        <div className={cardCls}>
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

          <div className="border-t border-line pt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Jak vypadá na webu</p>
            <p className="mt-2 text-xs text-muted">
              Poukaz je jeden — zákaznice si u něj jen vybere částku.
            </p>
          </div>

          <label className={labelCls}>
            Nadpis
            <input
              value={form.poukaz_nadpis}
              onChange={(e) => set("poukaz_nadpis", e.target.value)}
              className={inputCls}
              placeholder="Např. Dárkový poukaz Aurora"
            />
          </label>

          <label className={labelCls}>
            Popis
            <textarea
              value={form.poukaz_popis}
              onChange={(e) => set("poukaz_popis", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            {form.poukaz_fotka && (
              <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl">
                <Image src={form.poukaz_fotka} alt="Fotka poukazu" fill className="object-cover" sizes="144px" />
                <button
                  type="button"
                  onClick={() => set("poukaz_fotka", "")}
                  className="absolute right-1.5 top-1.5 rounded-full bg-ink/70 px-2 py-0.5 text-xs text-cream"
                  aria-label="Odebrat fotku"
                >
                  ✕
                </button>
              </div>
            )}
            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent">
              {nahravam ? "Nahrávám…" : form.poukaz_fotka ? "Změnit fotku" : "+ Nahrát fotku"}
              <input
                type="file"
                accept="image/*"
                disabled={nahravam}
                onChange={(e) => {
                  const soubor = e.target.files?.[0];
                  e.target.value = "";
                  if (soubor) nahratFotkuPoukazu(soubor);
                }}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted">Ukáže se u poukazu na webu i v e-mailu s kódem.</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className={labelCls}>Částky k výběru</p>
            {form.poukaz_castky.map((castka, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input
                  value={castka.hodnota_kc || ""}
                  onChange={(e) =>
                    nastavCastku(i, { hodnota_kc: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })
                  }
                  inputMode="numeric"
                  placeholder="Kč"
                  className={`${inputCls} w-28`}
                />
                <input
                  value={castka.popisek}
                  onChange={(e) => nastavCastku(i, { popisek: e.target.value })}
                  placeholder="Popisek, např. na 1 lekci (nepovinné)"
                  className={`${inputCls} min-w-[14rem] flex-1`}
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "poukaz_castky",
                      form.poukaz_castky.filter((_, j) => j !== i)
                    )
                  }
                  className="text-xs uppercase tracking-[0.15em] text-accent-d hover:underline"
                >
                  Odebrat
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("poukaz_castky", [...form.poukaz_castky, { popisek: "", hodnota_kc: 0 }])}
              className="w-fit rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              + Přidat částku
            </button>
            <p className="text-xs text-muted">
              Hodnota musí být mezi 100 a 100 000 Kč — částky mimo rozsah se při uložení zahodí.
              Zákaznice uvidí například{" "}
              <span className="text-ink">
                {form.poukaz_castky[0]?.hodnota_kc
                  ? `${form.poukaz_castky[0].popisek || ""} ${formatKc(form.poukaz_castky[0].hodnota_kc)}`.trim()
                  : "—"}
              </span>
              .
            </p>
          </div>
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
