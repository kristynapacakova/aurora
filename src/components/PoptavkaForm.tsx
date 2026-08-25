"use client";

import Image from "next/image";
import { useState, useEffect, type FormEvent } from "react";
import { HONEYPOT_FIELD, FORM_LOADED_FIELD } from "@/lib/honeypot";
import { NEWSLETTER_FIELD, NEWSLETTER_LABEL } from "@/lib/newsletterOptIn";
import { formatKc, type ZpusobPlatby } from "@/lib/castky";

type Mode = "closed" | "objednavka" | "dotaz" | "cekaci";

export default function PoptavkaForm({
  pobytId,
  pobytNadpis,
  cena,
  qrDataUrl,
  qrZalohaDataUrl,
  castkaCelkem,
  zaloha,
  doplatek,
  zalohaProcento,
  cisloUctu,
  variabilniSymbol,
  platebniPokyny,
  vyprodano,
  pripravujeSe,
}: {
  pobytId: number;
  pobytNadpis: string;
  cena?: string;
  qrDataUrl?: string;
  qrZalohaDataUrl?: string;
  castkaCelkem?: number | null;
  zaloha?: number | null;
  doplatek?: number | null;
  zalohaProcento?: number;
  cisloUctu?: string;
  variabilniSymbol?: string;
  platebniPokyny?: string;
  vyprodano?: boolean;
  pripravujeSe?: boolean;
}) {
  const [mode, setMode] = useState<Mode>("closed");
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zprava, setZprava] = useState("");
  const [potvrzenoPlatba, setPotvrzenoPlatba] = useState(false);
  const [zpusobPlatby, setZpusobPlatby] = useState<ZpusobPlatby>("cela");
  const [souhlasGdpr, setSouhlasGdpr] = useState(false);
  const [chceNovinky, setChceNovinky] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "closed") setFormLoadedAt(Date.now());
  }, [mode]);

  const hasPaymentInfo = Boolean(cisloUctu);
  // Zálohu nabízíme jen tehdy, když ji administrace umí spočítat z ceny.
  const lzeZaloha = Boolean(zaloha && zalohaProcento);
  const platiZalohu = lzeZaloha && zpusobPlatby === "zaloha";
  const aktualniQr = platiZalohu ? qrZalohaDataUrl : qrDataUrl;
  const aktualniCastka = platiZalohu ? zaloha : castkaCelkem;

  function reset() {
    setMode("closed");
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res =
      mode === "cekaci"
        ? await fetch("/api/cekaci-listina", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pobyt_id: pobytId,
              jmeno,
              email,
              telefon,
              zprava,
              [HONEYPOT_FIELD]: honeypot,
              [FORM_LOADED_FIELD]: formLoadedAt,
              [NEWSLETTER_FIELD]: chceNovinky,
            }),
          })
        : await fetch("/api/poptavka", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pobyt_id: pobytId,
              typ: mode === "objednavka" ? "objednavka" : "dotaz",
              zaplaceno: mode === "objednavka" ? potvrzenoPlatba : false,
              zpusob_platby: mode === "objednavka" ? (platiZalohu ? "zaloha" : "cela") : "",
              jmeno,
              email,
              telefon,
              zprava,
              [HONEYPOT_FIELD]: honeypot,
              [FORM_LOADED_FIELD]: formLoadedAt,
              [NEWSLETTER_FIELD]: chceNovinky,
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
        <p className="mt-2 text-sm text-muted">
          {mode === "objednavka"
            ? platiZalohu && doplatek != null
              ? `Tvoje objednávka je na cestě. Jakmile zálohu uvidíme na účtu, máš místo závazně rezervované. Doplatek ${formatKc(doplatek)} pošleš 14 dnů před pobytem. 🌿`
              : "Tvoje objednávka je na cestě. Brzy se ti ozveme s potvrzením. 🌿"
            : mode === "cekaci"
              ? "Jsi na čekací listině. Ozveme se, jakmile se uvolní místo. 🌿"
              : "Tvůj dotaz je na cestě. Ozveme se ti co nejdřív. 🌿"}
        </p>
      </div>
    );
  }

  if (mode === "closed") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {vyprodano ? (
          <button
            onClick={() => setMode("cekaci")}
            className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
          >
            Přidat se na čekací listinu →
          </button>
        ) : pripravujeSe ? (
          <p className="text-sm text-muted">
            Tenhle pobyt se připravuje — termín i objednávky budou brzy.
          </p>
        ) : (
          <button
            onClick={() => setMode("objednavka")}
            className="rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
          >
            Závazně objednat →
          </button>
        )}
        <button
          onClick={() => setMode("dotaz")}
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
      className="flex flex-col gap-4 rounded-2xl bg-white/70 p-6 ring-1 ring-line"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-accent">
        {mode === "objednavka" ? "Závazná objednávka" : mode === "cekaci" ? "Čekací listina" : "Dotaz"} — {pobytNadpis}
      </p>

      {mode === "cekaci" && (
        <p className="text-sm text-muted">
          Pobyt je momentálně vyprodaný. Necháme ti vzkaz a ozveme se, jakmile se uvolní místo.
        </p>
      )}

      {mode === "objednavka" && (
        <>
          {cena && (
            <p className="text-sm text-ink">
              Cena: <strong className="font-medium">{cena}</strong>
            </p>
          )}

          {/* Volba platby — buď celá částka hned, nebo záloha a doplatek
              14 dnů před pobytem. QR kód i částka se přepnou podle volby. */}
          {lzeZaloha && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium text-ink">Jak chceš zaplatit?</legend>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm transition-colors ${
                  zpusobPlatby === "cela" ? "border-accent bg-sand/50" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="zpusob-platby"
                  checked={zpusobPlatby === "cela"}
                  onChange={() => setZpusobPlatby("cela")}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
                />
                <span className="text-ink">
                  Celou částku najednou
                  {castkaCelkem != null && (
                    <span className="block text-muted">{formatKc(castkaCelkem)}</span>
                  )}
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm transition-colors ${
                  zpusobPlatby === "zaloha" ? "border-accent bg-sand/50" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="zpusob-platby"
                  checked={zpusobPlatby === "zaloha"}
                  onChange={() => setZpusobPlatby("zaloha")}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
                />
                <span className="text-ink">
                  Zálohu {zalohaProcento} % teď, zbytek před pobytem
                  <span className="block text-muted">Záloha {formatKc(zaloha ?? 0)}</span>
                  {doplatek != null && (
                    <span className="block text-muted">
                      Doplatek {formatKc(doplatek)} 14 dnů před pobytem
                    </span>
                  )}
                </span>
              </label>
            </fieldset>
          )}

          {hasPaymentInfo && (
            <div className="flex flex-col gap-3 rounded-xl bg-sand/60 p-4 sm:flex-row sm:items-start">
              {aktualniQr && (
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image
                    src={aktualniQr}
                    alt={platiZalohu ? "QR kód pro platbu zálohy" : "QR kód pro platbu"}
                    fill
                    className="object-contain p-2"
                    sizes="128px"
                    unoptimized
                  />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-ink">Platební údaje</p>
                {aktualniCastka != null && (
                  <p className="mt-1 text-muted">
                    {platiZalohu ? "Záloha k úhradě" : "Částka k úhradě"}:{" "}
                    <span className="text-ink">{formatKc(aktualniCastka)}</span>
                  </p>
                )}
                <p className="mt-1 text-muted">
                  Číslo účtu: <span className="text-ink">{cisloUctu}</span>
                  {variabilniSymbol && (
                    <>
                      <br />
                      Variabilní symbol: <span className="text-ink">{variabilniSymbol}</span>
                    </>
                  )}
                </p>
                {platiZalohu && doplatek != null && (
                  <p className="mt-2 text-muted">
                    Doplatek <span className="text-ink">{formatKc(doplatek)}</span> pošleš na stejný účet
                    nejpozději 14 dnů před začátkem pobytu.
                  </p>
                )}
                {platebniPokyny && (
                  <p className="mt-2 whitespace-pre-line text-muted">{platebniPokyny}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

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
      <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefon" className={inputCls} />
      <textarea
        value={zprava}
        onChange={(e) => setZprava(e.target.value)}
        rows={3}
        placeholder={
          mode === "objednavka"
            ? "Poznámka (nepovinné)"
            : mode === "cekaci"
              ? "Vzkaz (nepovinné)"
              : "Tvůj dotaz"
        }
        required={mode === "dotaz"}
        className={inputCls}
      />

      {mode === "objednavka" && hasPaymentInfo && (
        <label className="flex items-start gap-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={potvrzenoPlatba}
            onChange={(e) => setPotvrzenoPlatba(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
          />
          {platiZalohu
            ? "Potvrzuji, že jsem zálohu uhradila podle uvedených údajů."
            : "Potvrzuji, že jsem platbu provedla podle uvedených údajů."}
        </label>
      )}

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

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
        >
          {sending
            ? "Odesílám…"
            : mode === "objednavka"
              ? "Odeslat závaznou objednávku"
              : mode === "cekaci"
                ? "Přidat se na čekací listinu"
                : "Odeslat dotaz"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
