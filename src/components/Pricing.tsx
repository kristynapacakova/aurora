import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";

const PLANS = [
  {
    name: "Měsíční",
    price: "399",
    period: "/ měsíc",
    description: "Ideální pro vyzkoušení studia.",
    featured: false,
    features: [
      "Neomezený přístup ke všem nahrávkám",
      "Živé lekce každý týden",
      "Nová videa každý měsíc",
      "Komunitní podpora",
    ],
  },
  {
    name: "Roční",
    price: "299",
    period: "/ měsíc",
    description: "Ušetříš 2 měsíce. Nejoblíbenější volba.",
    featured: true,
    features: [
      "Vše z Měsíčního plánu",
      "Prioritní přístup k novinkám",
      "Exkluzivní výzvy a programy",
      "Osobní lekce se slevou 20 %",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="cenik" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <FadeUp>
          <div className="mb-16 text-center">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">
              Ceník členství
            </p>
            <h2 className="font-allura text-5xl text-ink sm:text-6xl">
              Vyber si svůj plán
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-muted">
              Bez závazků. Kdykoli zruš. První 7 dní zdarma.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.12}>
              <div
                className={`relative flex h-full flex-col rounded-3xl p-8 text-ink sm:p-10 ${
                  plan.featured
                    ? "bg-gradient-aurora"
                    : "border border-line bg-cream"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-8 top-8 rounded-full bg-ink px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-cream">
                    Nejoblíbenější
                  </span>
                )}

                <p className="text-xs uppercase tracking-[0.25em] text-ink/70">
                  {plan.name}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-serif text-5xl">{plan.price} Kč</span>
                  <span className="text-sm text-ink/60">{plan.period}</span>
                </div>

                <p className="mt-3 text-sm text-ink/70">{plan.description}</p>

                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 text-base leading-none text-ink">
                        ✓
                      </span>
                      <span className="text-ink/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={USCREEN.signup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 block rounded-full bg-peach py-3.5 text-center text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:bg-peach-d"
                >
                  Aktivovat členství
                </a>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2}>
          <p className="mt-10 text-center text-xs text-muted">
            Máš otázky k členství?{" "}
            <a
              href="mailto:ahoj@aurorajoga.cz"
              className="underline underline-offset-4 hover:text-ink"
            >
              Napiš mi
            </a>
            .
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
