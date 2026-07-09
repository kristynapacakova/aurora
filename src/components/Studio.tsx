import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";
import { IconSparkle, IconSun, IconLeafBranch, IconHeart, IconWave } from "./BrandIcons";

const SERVICES = [
  {
    id: "lekce",
    bg: "bg-[#FCF4F1]",          /* krémová */
    icon: <IconSun size={30} />,
    title: "Lekce",
    body: "Pravidelné hotelové lekce, skupinová i individuální jóga. Jemný prostor, kde se můžeš zastavit a vrátit se sama k sobě.",
    cta: "Zjistit více",
    href: "#kontakt",
    photo: "/lekce.jpeg",
    alt: "Lekce jógy",
    photoLeft: true,
  },
  {
    id: "studio",
    bg: "bg-[#FBE9DE]",          /* slonová kost */
    icon: <IconSparkle size={30} className="text-accent" />,
    title: "Online studio",
    body: "Cvič kdykoliv, když to tvoje tělo potřebuje. Online lekce a programy, které tě provedou domovem stejně jemně jako živá praxe.",
    cta: "Vstoupit do studia",
    href: USCREEN.signup,
    external: true,
    photo: "/studio.png",
    alt: "Online studio",
    photoLeft: false,
  },
  {
    id: "retreaty",
    bg: "bg-[#FDF6F0]",          /* světlá meruňková */
    icon: <IconLeafBranch size={30} />,
    title: "Retreaty",
    body: "Zastav se. Nadechni se. Buď. Víkendové pobyty v přírodě, kde si dovolíš zpomalit a načerpat novou energii.",
    cta: "Objevit retreaty",
    href: "#kontakt",
    photo: "/retreaty.png",
    alt: "Retreaty v přírodě",
    photoLeft: true,
  },
  {
    id: "akce",
    bg: "bg-[#FAF0E8]",          /* teplá béžová */
    icon: <IconHeart size={30} />,
    title: "Akce pro ženy",
    body: "Setkání, která pohladí duši. Jednodenní akce, ženské kruhy a workshopy plné inspirace, sdílení a klidu.",
    cta: "Aktuální akce",
    href: "#kontakt",
    photo: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=900&q=80",
    alt: "Akce pro ženy",
    photoLeft: false,
  },
];

export default function Studio() {
  return (
    <>
      {/* ── Nadpis ── */}
      <div className="bg-[#FCF4F1] pb-6 pt-10 text-center sm:pt-12">
        <FadeUp>
          <div className="mb-3 flex items-center justify-center gap-3">
            <IconSparkle size={11} />
            <span className="text-xs uppercase tracking-[0.3em] text-accent">Co tě čeká</span>
            <IconSparkle size={11} />
          </div>
          <h2 className="font-allura text-3xl text-ink sm:text-4xl">
            Vyber si cestu, která tě právě volá.
          </h2>
          <div className="mt-4 flex justify-center">
            <IconWave width={160} height={22} className="text-accent/50" />
          </div>
        </FadeUp>
      </div>

      {/* ── Střídající se sekce ── */}
      {SERVICES.map((s) => (
        <section key={s.id} id={s.id} className={`${s.bg} py-7 sm:py-9`}>
          <div className="mx-auto max-w-6xl px-6">
            <FadeUp>
              <div
                className={`grid grid-cols-1 items-center gap-6 md:gap-10 ${
                  s.photoLeft
                    ? "md:grid-cols-[3fr_2fr]"
                    : "md:grid-cols-[2fr_3fr] md:[&>*:first-child]:order-last"
                }`}
              >
                {/* Foto */}
                <div
                  className={`relative h-[180px] w-full overflow-hidden sm:h-[220px] md:h-[280px] ${
                    s.photoLeft
                      ? "rounded-tl-[2rem] rounded-br-[0.75rem]"
                      : "rounded-tr-[2rem] rounded-bl-[0.75rem]"
                  }`}
                >
                  <Image
                    src={s.photo}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  {/* Ikona + nadpis na jednom řádku */}
                  <div className="mb-4 flex items-center gap-3">
                    {s.icon}
                    <h3 className="font-serif text-[20px] uppercase tracking-[0.12em] text-ink sm:text-[24px]">
                      {s.title}
                    </h3>
                  </div>

                  <p className="mb-5 max-w-xs text-xs leading-relaxed text-muted">
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
            </FadeUp>
          </div>
        </section>
      ))}
    </>
  );
}
