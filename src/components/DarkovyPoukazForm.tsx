"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { nbsp } from "@/lib/typo";
import { HONEYPOT_FIELD, FORM_LOADED_FIELD } from "@/lib/honeypot";
import { NEWSLETTER_FIELD, NEWSLETTER_LABEL } from "@/lib/newsletterOptIn";
import { formatKc } from "@/lib/castky";
import type { PoukazCastka } from "@/lib/db";

// Stejný postup jako u objednávky pobytu: zavřený stav se dvěma tlačítky,
// po kliknutí se rozbalí formulář i s platebními údaji.
type Mode = "closed" | "darovat" | "dotaz";

export default function DarkovyPoukazForm({
  nabidkaId,
  nadpis,
  castky,
  hodnotaKc,
  onZmenaCastky,
  qrKody,
  cisloUctu,
}: {
  nabidkaId: number;
  nadpis: string;
  castky: PoukazCastka[];
  // Vybranou částku drží nadřazená sekce — mění se podle ní i grafika
  // vedle formuláře.
  hodnotaKc: number;
  onZmenaCastky: (hodnota: number) => void;
  // QR kód pro každou nabízenou částku. Generuje se na serveru, ať se do
  // prohlížeče nemusí posílat celá knihovna na QR kódy.
  qrKody: Record<number, string | null>;
  cisloUctu: string;
}) {
  const [mode, setMode] = useState<Mode>("closed");
  const [jmenoKupujici, setJmenoKupujici] = useState("");
  const [emailKupujici, setEmailKupujici] = useState("");
  const [telefonKupujici, setTelefonKupujici] = useState("");
  const [zprava, setZprava] = useState("");
  const [potvrzenoPlatba, setPotvrzenoPlatba] = useState(false);
  const [souhlasGdpr, setSouhlasGdpr] = useState(false);
  const [chceNovinky, setChceNovinky] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotovo, setHotovo] = useState<"darovat" | "dotaz" | null>(null);

  // Čas otevření formuláře slouží jako ochrana proti robotům (příliš rychlé
  // odeslání se zahodí). Nastavuje se při kliknutí, ne v efektu.
  function otevrit(novy: Exclude<Mode, "closed">) {
    setFormLoadedAt(Date.now());
    setMode(novy);
  }

  const vybranaHodnota = formatKc(hodnotaKc);
  const qr = qrKody[hodnotaKc] ?? null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res =
      mode === "dotaz"
        ? await fetch("/api/kontakt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jmeno: jmenoKupujici,
              email: emailKupujici,
              telefon: telefonKupujici,
              zprava: `Dotaz k dárkovému poukazu „${nadpis}“:\n\n${zprava}`,
              [HONEYPOT_FIELD]: honeypot,
              [FORM_LOADED_FIELD]: formLoadedAt,
            }),
          })
        : await fetch("/api/darkovy-poukaz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nabidka_id: nabidkaId,
              hodnota_kc: hodnotaKc,
              jmeno_kupujici: jmenoKupujici,
              email_kupujici: emailKupujici,
              telefon_kupujici: telefonKupujici,
              platba_potvrzena: potvrzenoPlatba,
              [HONEYPOT_FIELD]: honeypot,
              [FORM_LOADED_FIELD]: formLoadedAt,
              [NEWSLETTER_FIELD]: chceNovinky,
            }),
          });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setHotovo(mode === "dotaz" ? "dotaz" : "darovat");
    } else {
      setError(data.error ?? "Odeslání se nepovedlo, zkus to prosím znovu.");
    }
    setSending(false);
  }

  if (hotovo) {
    return (
      <div className="rounded-2xl bg-white/70 p-6 text-center ring-1 ring-line">
        <p className="font-allura text-2xl text-ink">Děkujeme!</p>
        <p className="mt-2 text-sm text-muted">
          {hotovo === "darovat"
            ? nbsp(
                `Jakmile platbu ${vybranaHodnota} uvidíme na účtu, pošleme ti kód poukazu e-mailem na ${emailKupujici}. 🌿`
              )
            : nbsp("Tvůj dotaz je na cestě. Ozveme se ti co nejdřív. 🌿")}
        </p>
      </div>
    );
  }

  if (mode === "closed") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => otevrit("darovat")}
          className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          Chci darovat →
        </button>
        <button
          onClick={() => otevrit("dotaz")}
          className="rounded-full border border-ink/30 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-ink"
        >
          Mám dotaz
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4 rounded-2xl bg-white/70 p-6 text-left ring-1 ring-line"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-accent">
        {mode === "darovat" ? "Objednávka poukazu" : "Dotaz k poukazu"}
      </p>

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

      {mode === "darovat" && (
        <>
          <div>
            <p className="mb-3 text-sm font-medium text-ink">Hodnota poukazu</p>
            <div className="flex flex-wrap gap-2">
              {castky.map((c) => (
                <button
                  key={`${c.popisek}-${c.hodnota_kc}`}
                  type="button"
                  onClick={() => onZmenaCastky(c.hodnota_kc)}
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

          {/* Platební údaje se přepínají podle zvolené částky. */}
          <div className="flex flex-col gap-3 rounded-xl bg-sand/60 p-4 sm:flex-row sm:items-start">
            {qr && (
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-white">
                <Image
                  src={qr}
                  alt="QR kód pro platbu"
                  fill
                  className="object-contain p-2"
                  sizes="128px"
                  unoptimized
                />
              </div>
            )}
            <div className="text-sm">
              <p className="font-medium text-ink">Platební údaje</p>
              <p className="mt-1 text-muted">
                Částka k úhradě: <span className="text-ink">{vybranaHodnota}</span>
                <br />
                Číslo účtu: <span className="text-ink">{cisloUctu}</span>
              </p>
              {/* Variabilní symbol vzniká až s poukazem, takže platbu
                  spárujeme podle jména v poznámce. */}
              <p className="mt-2 text-muted">
                Do poznámky pro příjemce napiš prosím své jméno — díky tomu platbu poznáme.
              </p>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={jmenoKupujici}
          onChange={(e) => setJmenoKupujici(e.target.value)}
          required
          placeholder="Tvoje jméno *"
          className={inputCls}
        />
        <input
          value={emailKupujici}
          onChange={(e) => setEmailKupujici(e.target.value)}
          required
          type="email"
          placeholder="Tvůj e-mail *"
          className={inputCls}
        />
      </div>
      <input
        value={telefonKupujici}
        onChange={(e) => setTelefonKupujici(e.target.value)}
        placeholder="Telefon (nepovinné)"
        className={inputCls}
      />

      {mode === "dotaz" && (
        <textarea
          value={zprava}
          onChange={(e) => setZprava(e.target.value)}
          rows={3}
          required
          placeholder="Tvůj dotaz"
          className={inputCls}
        />
      )}

      {mode === "darovat" && (
        <>
          <label className="flex items-start gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={potvrzenoPlatba}
              onChange={(e) => setPotvrzenoPlatba(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
            />
            {nbsp(`Potvrzuji, že jsem odeslala ${vybranaHodnota} podle uvedených údajů.`)}
          </label>

          <label className="flex items-start gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              checked={chceNovinky}
              onChange={(e) => setChceNovinky(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
            />
            <span>{NEWSLETTER_LABEL}</span>
          </label>
        </>
      )}

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
          <a
            href="/ochrana-osobnich-udaju"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent-d"
          >
            zásad ochrany osobních údajů
          </a>
          .
        </span>
      </label>

      {error && <p className="text-sm text-accent-d">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Odesílám…" : mode === "darovat" ? "Odeslat objednávku" : "Odeslat dotaz"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("closed");
            setError(null);
          }}
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
