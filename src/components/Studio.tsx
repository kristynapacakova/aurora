import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";

/* ─── Ikony (tenká linie, korálová) ─── */
function IconLekce() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <circle cx="16" cy="8" r="3"/>
      <path d="M8 20c0-4 3.5-6 8-6s8 2 8 6"/>
      <path d="M10 26c0-2 2.5-3.5 6-3.5s6 1.5 6 3.5"/>
      <path d="M6 18c-2 0-4-1.5-4-3.5 0-1.5 1-2.5 2.5-2.5"/>
      <path d="M26 18c2 0 4-1.5 4-3.5 0-1.5-1-2.5-2.5-2.5"/>
    </svg>
  );
}
function IconStudio() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <rect x="3" y="6" width="26" height="17" rx="2"/>
      <path d="M10 28h12M16 23v5"/>
    </svg>
  );
}
function IconRetreaty() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <path d="M16 4c0 0-10 8-10 16a10 10 0 0 0 20 0C26 12 16 4 16 4z"/>
      <path d="M16 14v10M12 18c1.5-1 2.5-1.5 4-1.5s2.5.5 4 1.5"/>
    </svg>
  );
}
function IconAkce() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
      <circle cx="11" cy="9" r="3"/>
      <circle cx="21" cy="9" r="3"/>
      <path d="M4 26c0-4 3-6.5 7-6.5s5 1.5 5 1.5 1-1.5 5-1.5 7 2.5 7 6.5"/>
    </svg>
  );
}

const SERVICES = [
  {
    id: "lekce",
    icon: <IconLekce />,
    title: "Lekce",
    body: "Pravidelné hotelové lekce, skupinová i individuální jóga. Jemný prostor, kde se můžeš zastavit a vrátit se sama k sobě.",
    cta: "Zjistit více",
    href: "#kontakt",
    photo: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=900&q=85",
    alt: "Lekce jógy",
    photoLeft: true,
  },
  {
    id: "studio",
    icon: <IconStudio />,
    title: "Online studio",
    body: "Cvič kdykoliv, když to tvoje tělo potřebuje. Online lekce a programy, které tě provedou domovem stejně jemně jako živá praxe.",
    cta: "Vstoupit do studia",
    href: USCREEN.signup,
    external: true,
    photo: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=85",
    alt: "Online studio",
    photoLeft: false,
  },
  {
    id: "retreaty",
    icon: <IconRetreaty />,
    title: "Retreaty",
    body: "Zastav se. Nadechni se. Buď. Víkendové pobyty v přírodě, kde si dovolíš zpomalit a načerpat novou energii.",
    cta: "Objevit retreaty",
    href: "#kontakt",
    photo: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=900&q=85",
    alt: "Retreaty v přírodě",
    photoLeft: true,
  },
  {
    id: "akce",
    icon: <IconAkce />,
    title: "Akce pro ženy",
    body: "Setkání, která pohladí duši. Jednodenní akce, ženské kruhy a workshopy plné inspirace, sdílení a klidu.",
    cta: "Aktuální akce",
    href: "#kontakt",
    photo: "https://images.unsplash.com/photo-1573497620159-c5e6f5a3b9ad?w=900&q=85",
    alt: "Akce pro ženy",
    photoLeft: false,
  },
];

export default function Studio() {
  return (
    <section id="studio" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">

        {/* Nadpis sekce */}
        <FadeUp>
          <div className="mb-20 text-center">
            <h2 className="font-serif text-4xl text-ink sm:text-5xl">
              Vyber si cestu,
              <br />
              <em className="font-allura not-italic text-accent text-3xl sm:text-4xl">
                která tě právě volá.
              </em>
            </h2>
          </div>
        </FadeUp>

        {/* Střídající se bloky */}
        <div className="flex flex-col gap-0">
          {SERVICES.map((s, i) => (
            <FadeUp key={s.id} delay={0.05}>
              <div
                id={s.id}
                className={`grid grid-cols-1 items-center gap-0 md:grid-cols-[3fr_2fr] ${
                  !s.photoLeft ? "md:[&>*:first-child]:order-last" : ""
                }`}
              >
                {/* Fotka */}
                <div className="relative h-[300px] w-full overflow-hidden sm:h-[420px] md:h-[480px]">
                  <Image
                    src={s.photo}
                    alt={s.alt}
                    fill
                    className={`object-cover ${
                      s.photoLeft
                        ? "rounded-tr-[3.5rem] rounded-bl-[3.5rem]"
                        : "rounded-tl-[3.5rem] rounded-br-[3.5rem]"
                    }`}
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>

                {/* Text */}
                <div
                  className={`flex flex-col justify-center py-12 ${
                    s.photoLeft ? "md:pl-16 md:pr-6" : "md:pl-6 md:pr-16"
                  }`}
                >
                  <div className="mb-4">{s.icon}</div>
                  <h3 className="mb-4 font-serif text-3xl text-ink sm:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mb-8 max-w-xs text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                  <a
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noopener noreferrer" : undefined}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/40 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-ink hover:bg-ink/5"
                  >
                    {s.cta} →
                  </a>
                </div>
              </div>

              {/* Oddělovač (kromě posledního) */}
              {i < SERVICES.length - 1 && (
                <div className="my-12 h-px bg-line md:my-16" />
              )}
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
