import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";

const PLANS = [
  {
    name: "Měsíční",
    price: "399",
    period: "/ měsíc",
    description: "Ideální pro vyzkoušení studia.",
    featured: false,
    features: [
      "Okamžitý přístup ke všem lekcím",
      "Každý týden nová lekce",
      "Možnost cvičit kdykoliv a odkudkoliv",
      "Lekce různých délek a zaměření",
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
      "Osobní lekce se slevou 20 %",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="cenik" className="bg-cream relative pt-14 pb-16 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <FadeUp>
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <IconSparkle size={12} />
              <p className="text-xs uppercase tracking-[0.3em] text-accent">Ceník členství</p>
              <IconSparkle size={12} />
            </div>
            <h2 className="font-allura text-4xl text-ink sm:text-5xl">
              Vyber si svůj plán
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-muted">
              {nbsp("Bez závazků. Kdykoli zruš.")}
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <FadeUp key={plan.name} delay={i * 0.12} className="h-full">
              <div
                className={`relative flex h-full flex-col border border-line bg-cream pb-5 pt-10 text-ink sm:pb-6 sm:pt-12 ${
                  i % 2 === 0
                    ? "photo-arch-left pl-10 pr-6 sm:pl-16 sm:pr-8"
                    : "photo-arch-right pl-6 pr-10 sm:pl-8 sm:pr-16"
                }`}
              >
                {plan.featured && (
                  <span
                    className={`bg-gradient-aurora absolute right-6 top-6 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink ${
                      i % 2 === 0 ? "sm:right-8 sm:top-8" : "sm:right-8 sm:top-12"
                    }`}
                  >
                    Nejoblíbenější
                  </span>
                )}

                <p className="text-xs uppercase tracking-[0.25em] text-accent">
                  {plan.name}
                </p>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-sans text-4xl font-semibold">{plan.price} Kč</span>
                  <span className="text-sm text-ink/60">{plan.period}</span>
                </div>

                <p className="mt-2 text-sm text-ink/70">{nbsp(plan.description)}</p>

                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-base leading-none text-ink">
                        ✓
                      </span>
                      <span className="text-ink/80">{nbsp(f)}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={USCREEN.signup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block w-fit rounded-full border border-ink/30 px-8 py-2.5 text-center text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:border-accent hover:text-accent"
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
