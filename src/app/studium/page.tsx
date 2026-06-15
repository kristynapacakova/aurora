"use client";

import { useState, type FormEvent } from "react";

// Přístupový kód pro členskou sekci.
// POZOR: Jedná se o jednoduchou ochranu na straně klienta (vhodnou např. pro
// neveřejný odkaz pro členy kurzu). Kód je viditelný ve zdrojovém kódu
// aplikace a NENAHRAZUJE skutečné přihlášení / autorizaci na serveru.
const ACCESS_CODE =
  process.env.NEXT_PUBLIC_STUDIO_ACCESS_CODE ?? "Namaste2026";

const STORAGE_KEY = "studio-unlocked";

export default function StudioPage() {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(STORAGE_KEY) === "true";
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      setError(false);
      setUnlocked(true);
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
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
              className="rounded-full bg-accent-dark px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-accent"
            >
              Vstoupit
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-sand px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-center text-sm uppercase tracking-[0.3em] text-accent-dark">
          Členská sekce
        </p>
        <h1 className="text-center font-serif text-4xl sm:text-5xl">
          Lekce: Ranní jóga pro probuzení těla
        </h1>

        <div className="mt-10 overflow-hidden rounded-2xl shadow-sm ring-1 ring-line">
          <div className="aspect-video w-full">
            {/* Placeholder pro video z Vimeo / YouTube.
                Nahraďte "src" odkazem na konkrétní video, např.:
                https://player.vimeo.com/video/XXXXXXXXX
                https://www.youtube.com/embed/XXXXXXXXX */}
            <iframe
              className="h-full w-full"
              src="https://player.vimeo.com/video/000000000"
              title="Lekce jógy"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-background p-6 shadow-sm ring-1 ring-line sm:p-8">
          <h2 className="font-serif text-2xl">O lekci</h2>
          <p className="mt-3 text-foreground/70 leading-relaxed">
            Tato 30minutová lekce vás provede sérií jemných protažení a
            dechových cvičení, které vás příjemně probudí a nastartují vaše
            tělo i mysl na nový den. Vhodné pro všechny úrovně.
          </p>
          <ul className="mt-4 list-inside list-disc text-foreground/70">
            <li>Délka: 30 minut</li>
            <li>Úroveň: vhodné pro začátečníky i pokročilé</li>
            <li>Pomůcky: podložka, případně deka</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
