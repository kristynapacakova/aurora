import FadeUp from "./FadeUp";

const CARDS = [
  {
    emoji: "✦",
    title: "Živé lekce",
    description:
      "Každý týden se sejdeme naživo přes stream. Budeš součástí komunity, zeptáš se na cokoli a já tě provedu lekcí v reálném čase.",
    tag: "Každý týden",
  },
  {
    emoji: "◎",
    title: "Knihovna nahrávek",
    description:
      "Stovky videí rozdělených podle stylu, délky i úrovně. Hatha, vinyasa, yin, meditace — kdykoliv a odkudkoliv chceš.",
    tag: "200+ videí",
  },
  {
    emoji: "◇",
    title: "Cvičení na doma",
    description:
      "Krátké lekce na 15–30 minut navržené pro cvičení bez nářadí, v obýváku, na zahradě nebo kdekoliv jinde.",
    tag: "Bez nářadí",
  },
];

export default function Studio() {
  return (
    <section id="studio" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hlavička */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
          <FadeUp>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">
              Co v online studiu najdeš
            </p>
            <h2 className="font-allura text-5xl text-ink sm:text-6xl">
              Jóga pro každý den i náladu
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="max-w-sm text-muted md:ml-auto md:text-right">
              Studio je navrženo tak, abys mohla cvičit tehdy a tak, jak ti to
              právě sedí — v každé životní situaci.
            </p>
          </FadeUp>
        </div>

        {/* Karty */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <FadeUp key={card.title} delay={i * 0.12}>
              <div className="group flex h-full flex-col rounded-none rounded-tr-[2.5rem] rounded-bl-[2.5rem] border border-line bg-cream p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)]">
                <span className="mb-6 text-2xl text-accent">{card.emoji}</span>
                <span className="mb-3 inline-block rounded-full bg-sand px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-muted">
                  {card.tag}
                </span>
                <h3 className="mb-3 font-serif text-2xl text-ink">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {card.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
