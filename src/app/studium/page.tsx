import LogoutButton from "./LogoutButton";

// Tato stránka je chráněná middlewarem (src/middleware.ts) - bez platné
// session cookie sem uživatel nemá přístup a je přesměrován na
// /studium/login.

export const metadata = {
  title: "Studio | AURORA jóga",
};

export default function StudioPage() {
  return (
    <main className="flex-1 bg-sand px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-end">
          <LogoutButton />
        </div>

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
