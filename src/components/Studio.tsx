import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";
import { IconSparkle, IconLekce, IconStudio, IconRetreaty, IconAkce } from "./BrandIcons";

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
            <div className="mb-4 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Co tě čeká</p>
              <IconSparkle size={12} />
            </div>
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
                  <div className="mb-5">{s.icon}</div>
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
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/30 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-accent hover:text-accent"
                  >
                    {s.cta} →
                  </a>
                </div>
              </div>

              {/* Oddělovač */}
              {i < SERVICES.length - 1 && (
                <div className="my-14 flex items-center gap-4 md:my-16">
                  <div className="flex-1 h-px bg-line" />
                  <IconSparkle size={10} className="text-line" />
                  <div className="flex-1 h-px bg-line" />
                </div>
              )}
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
