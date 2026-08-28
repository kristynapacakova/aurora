"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { nbsp } from "@/lib/typo";
import { HONEYPOT_FIELD, FORM_LOADED_FIELD } from "@/lib/honeypot";
import { NEWSLETTER_FIELD, NEWSLETTER_LABEL } from "@/lib/newsletterOptIn";
import { formatKc } from "@/lib/castky";
import type { PoukazCastka } from "@/lib/db";

type Vysledek = {
  kod: string;
  variabilniSymbol: string;
  cisloUctu: string;
  qrDataUrl: string | null;
};

export default function DarkovyPoukazForm({
  nabidkaId,
  castky,
}: {
  nabidkaId: number;
  castky: PoukazCastka[];
}) {
  const [hodnotaKc, setHodnotaKc] = useState(castky[0]?.hodnota_kc ?? 0);
  const [jmenoKupujici, setJmenoKupujici] = useState("");
  const [emailKupujici, setEmailKupujici] = useState("");
  const [telefonKupujici, setTelefonKupujici] = useState("");
  const [souhlasGdpr, setSouhlasGdpr] = useState(false);
  const [chceNovinky, setChceNovinky] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt] = useState(() => Date.now());
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vysledek, setVysledek] = useState<Vysledek | null>(null);
  const [ohlasuji, setOhlasuji] = useState(false);
  const [platbaOhlasena, setPlatbaOhlasena] = useState(false);

  const vybranaHodnota = formatKc(hodnotaKc);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/darkovy-poukaz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nabidka_id: nabidkaId,
        hodnota_kc: hodnotaKc,
        jmeno_kupujici: jmenoKupujici,
        email_kupujici: emailKupujici,
        telefon_kupujici: telefonKupujici,
        [HONEYPOT_FIELD]: honeypot,
        [FORM_LOADED_FIELD]: formLoadedAt,
        [NEWSLETTER_FIELD]: chceNovinky,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setVysledek({
        kod: data.kod,
        variabilniSymbol: data.variabilniSymbol,
        cisloUctu: data.cisloUctu,
        qrDataUrl: data.qrDataUrl ?? null,
      });
    } else {
      setError(data.error ?? "Odeslání se nepovedlo, zkus to prosím znovu.");
    }
    setSending(false);
  }

  async function ohlasitPlatbu() {
    if (!vysledek) return;
    setOhlasuji(true);
    await fetch("/api/poukaz/platba", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kod: vysledek.kod }),
    }).catch(() => {});
    setOhlasuji(false);
    setPlatbaOhlasena(true);
  }

  if (vysledek) {
    return (
      <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Zbývá poslední krok</p>
          <h3 className="mt-2 font-allura text-3xl text-ink">Zaplať a poukaz je tvůj</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {nbsp(`Objednávku máme. Jakmile platbu ${vybranaHodnota} uvidíme na účtu, pošleme ti kód poukazu e-mailem.`)}
          </p>
        </div>

        {/* Platba — to hlavní, proto je to vizuálně nejsilnější blok. */}
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-sand/60 p-5 sm:flex-row sm:items-start">
          {vysledek.qrDataUrl && (
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-white">
              <Image
                src={vysledek.qrDataUrl}
                alt="QR kód pro platbu"
                fill
                className="object-contain p-2"
                sizes="160px"
                unoptimized
              />
            </div>
          )}
          <div className="text-center text-sm sm:text-left">
            <p className="font-medium text-ink">Naskenuj QR kód v bankovní aplikaci</p>
            <p className="mt-1 text-muted">nebo zaplať převodem na:</p>
            <p className="mt-3 text-muted">
              Číslo účtu: <span className="text-ink">{vysledek.cisloUctu}</span>
              <br />
              Variabilní symbol: <span className="text-ink">{vysledek.variabilniSymbol}</span>
              <br />
              Částka: <span className="font-medium text-ink">{vybranaHodnota}</span>
            </p>
          </div>
        </div>

        {/* Potvrzení odeslané platby — klientce tím dorazí upozornění, ať ví,
            na co se na účtu dívat. */}
        {platbaOhlasena ? (
          <div className="rounded-2xl bg-sand/40 p-4 text-sm">
            <p className="font-medium text-ink">Díky, máme to. 🌿</p>
            <p className="mt-1 text-muted">
              Kód poukazu ti pošleme e-mailem na{" "}
              <span className="text-ink">{emailKupujici}</span>, jakmile platbu uvidíme na účtu.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={ohlasitPlatbu}
              disabled={ohlasuji}
              className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
            >
              {ohlasuji ? "Odesílám…" : "Platbu jsem odeslala"}
            </button>
            <p className="text-xs text-muted">Dáš nám tím vědět, že se máme na účet podívat.</p>
          </div>
        )}

        <p className="border-t border-line pt-4 text-xs leading-relaxed text-muted">
          Číslo tvého poukazu je{" "}
          <strong className="font-medium text-ink">{vysledek.kod}</strong>. Uplatnit ho půjde,
          jakmile platbu potvrdíme — do té doby ho nikdo použít nemůže.
        </p>
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
      {/* Částky si klientka nastavuje v administraci. */}
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">Hodnota poukazu</p>
        <div className="flex flex-wrap gap-2">
          {castky.map((c) => (
            <button
              key={`${c.popisek}-${c.hodnota_kc}`}
              type="button"
              onClick={() => setHodnotaKc(c.hodnota_kc)}
              className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
                hodnotaKc === c.hodnota_kc
                  ? "bg-gradient-aurora text-ink"
                  : "border border-line text-ink hover:border-accent"
              }`}
            >
              {c.popisek ? `${c.popisek} — ${formatKc(c.hodnota_kc)}` : formatKc(c.hodnota_kc)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={jmenoKupujici} onChange={(e) => setJmenoKupujici(e.target.value)} required placeholder="Tvoje jméno *" className={inputCls} />
        <input value={emailKupujici} onChange={(e) => setEmailKupujici(e.target.value)} required type="email" placeholder="Tvůj e-mail *" className={inputCls} />
      </div>
      <input value={telefonKupujici} onChange={(e) => setTelefonKupujici(e.target.value)} placeholder="Telefon (nepovinné)" className={inputCls} />

      <label className="flex items-start gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={chceNovinky}
          onChange={(e) => setChceNovinky(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
        />
        <span>{NEWSLETTER_LABEL}</span>
      </label>

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
        disabled={sending || !vybranaHodnota}
        className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
      >
        {sending ? "Odesílám…" : "Chci darovat"}
      </button>
    </form>
  );
}
