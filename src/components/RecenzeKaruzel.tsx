"use client";

import { useState, type FormEvent } from "react";
import { nbsp } from "@/lib/typo";
import { IconLotus } from "./BrandIcons";
import { HONEYPOT_FIELD, FORM_LOADED_FIELD } from "@/lib/honeypot";
import type { Recenze } from "@/lib/db";

// Listování mezi recenzemi a formulář, kterým může žena přidat svoji.
// Odeslaná recenze čeká na schválení v administraci — sama se nezveřejní.
export default function RecenzeKaruzel({ recenze }: { recenze: Recenze[] }) {
  const [aktivni, setAktivni] = useState(0);
  const [formOtevren, setFormOtevren] = useState(false);
  const [jmeno, setJmeno] = useState("");
  const [misto, setMisto] = useState("");
  const [triSlova, setTriSlova] = useState("");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [souhlas, setSouhlas] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const r = recenze[aktivni];
  const posun = (o: number) =>
    setAktivni((i) => (i + o + recenze.length) % recenze.length);

  function otevrit() {
    setFormLoadedAt(Date.now());
    setFormOtevren(true);
  }

  async function odeslat(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);

    const res = await fetch("/api/recenze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jmeno,
        misto,
        text,
        tri_slova: triSlova,
        email,
        souhlas,
        [HONEYPOT_FIELD]: honeypot,
        [FORM_LOADED_FIELD]: formLoadedAt,
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

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent";

  return (
    <>
      {r && (
        <>
          <article className="rounded-[24px] bg-sand/60 px-6 py-8 sm:px-10 sm:py-9">
            <div className="flex flex-col gap-3">
              {r.text.split(/\n\s*\n/).map((odst, j) => (
                <p key={j} className="whitespace-pre-line text-sm leading-relaxed text-muted">
                  {nbsp(odst)}
                </p>
              ))}
            </div>

            {/* Předěl s lotosem nad podpisem — stejný jako na grafikách,
                které ženy dostaly zpátky z dotazníku. */}
            <div className="mt-7 flex items-center justify-center gap-4" aria-hidden="true">
              <span className="h-px w-14 bg-line" />
              <IconLotus size={22} className="text-accent/80" />
              <span className="h-px w-14 bg-line" />
            </div>

            <div className="mt-4 text-center">
              {r.tri_slova && (
                <p className="mb-1.5 text-[11px] uppercase tracking-[0.25em] text-accent">
                  {r.tri_slova}
                </p>
              )}
              <p className="font-serif text-xl leading-tight text-ink">{r.jmeno}</p>
              {r.misto && (
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-muted">
                  {r.misto}
                </p>
              )}
            </div>
          </article>

          {recenze.length > 1 && (
            <div className="mt-5 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => posun(-1)}
                aria-label="Předchozí recenze"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-2.5">
                {recenze.map((polozka, i) => (
                  <button
                    key={polozka.id}
                    type="button"
                    onClick={() => setAktivni(i)}
                    aria-label={`Recenze ${i + 1} z ${recenze.length} — ${polozka.jmeno}`}
                    aria-current={i === aktivni}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === aktivni ? "w-6 bg-accent" : "w-1.5 bg-line hover:bg-accent/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => posun(1)}
                aria-label="Další recenze"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* Přidání vlastní recenze */}
      <div className="mt-8 text-center">
        {sent ? (
          <div className="rounded-2xl bg-sand/60 px-6 py-7">
            <p className="font-allura text-2xl text-ink">Děkujeme!</p>
            <p className="mt-2 text-sm text-muted">
              {nbsp("Tvoje recenze dorazila. Než se objeví na webu, ještě si ji přečtu. 🌿")}
            </p>
          </div>
        ) : !formOtevren ? (
          <button
            type="button"
            onClick={otevrit}
            className="rounded-full border border-ink/30 px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:border-ink"
          >
            Přidat svou recenzi
          </button>
        ) : (
          <form
            onSubmit={odeslat}
            className="flex flex-col gap-4 rounded-2xl bg-sand/60 px-6 py-7 text-left sm:px-8"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Tvá recenze</p>

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
              <input
                value={jmeno}
                onChange={(e) => setJmeno(e.target.value)}
                required
                placeholder="Jméno *"
                className={inputCls}
              />
              <input
                value={misto}
                onChange={(e) => setMisto(e.target.value)}
                placeholder="Odkud jsi"
                className={inputCls}
              />
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              required
              placeholder="Co ti lekce přinášejí? Jak se cítíš před lekcí a po ní? Co bys řekla ženě, která váhá? *"
              className={inputCls}
            />

            <input
              value={triSlova}
              onChange={(e) => setTriSlova(e.target.value)}
              placeholder="Tři slova, kterými bys lekce shrnula"
              className={inputCls}
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-mail (nezveřejňuje se)"
              className={inputCls}
            />

            <label className="flex items-start gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                checked={souhlas}
                onChange={(e) => setSouhlas(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#F28D76]"
              />
              <span>
                Souhlasím, aby se moje recenze i s křestním jménem zveřejnila na webu.
              </span>
            </label>

            {error && <p className="text-sm text-accent-d">{error}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
              >
                {sending ? "Odesílám…" : "Odeslat recenzi"}
              </button>
              <button
                type="button"
                onClick={() => setFormOtevren(false)}
                className="text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
              >
                Zavřít
              </button>
            </div>

            <p className="text-xs leading-relaxed text-muted">
              {nbsp(
                "Recenze se na webu neobjeví hned — nejdřív si ji přečtu. E-mail zůstává jen mně, kdybych se potřebovala ozvat."
              )}
            </p>
          </form>
        )}
      </div>
    </>
  );
}
