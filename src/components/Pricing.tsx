import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";
import { getNastaveni } from "@/lib/db";

export default async function Pricing() {
  const { uscreen_signup, cena_lekce, cena_mesicni, cena_rocni, kontakt_email } = await getNastaveni();

  const PLANS = [
    {
      name: "Za lekci",
      price: cena_lekce,
      period: "/ lekce",
      description: "Ideální na jednorázové vyzkoušení.",
      featured: false,
      shape: "arch-left",
      features: [
        "Přístup k vybrané lekci na 3 dny",
        "Možnost pustit si ji opakovaně",
        "Bez měsíčního členství",
      ],
      ctaLabel: "Aktuální lekce",
      ctaHref: "#lekce",
      ctaExternal: false,
    },
    {
      name: "Měsíční",
      price: cena_mesicni,
      period: "/ měsíc",
      description: "Ideální pro vyzkoušení studia.",
      featured: false,
      shape: "plain",
      features: [
        "Okamžitý přístup ke všem lekcím",
        "Každý týden nová lekce",
        "Možnost cvičit kdykoliv a odkudkoliv",
        "Lekce různých délek a zaměření",
      ],
      ctaLabel: "Aktivovat členství",
      ctaHref: uscreen_signup,
      ctaExternal: true,
    },
    {
      name: "Roční",
      price: cena_rocni,
      period: "/ měsíc",
      description: "Ušetříš 2 měsíce. Nejoblíbenější volba.",
      featured: true,
      shape: "arch-right",
      features: [
        "Vše z Měsíčního plánu",
        "Prioritní přístup k novinkám",
        "Exkluzivní výzvy a programy",
        "Osobní lekce se slevou 20 %",
      ],
      ctaLabel: "Aktivovat členství",
      ctaHref: uscreen_signup,
      ctaExternal: true,
    },
  ];

  return (
    <section id="cenik" className="bg-cream relative pt-14 pb-16 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-6">
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

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const shapeClass =
              plan.shape === "arch-left"
                ? "photo-arch-left pb-5 pl-8 pr-6 pt-9 sm:pb-6 sm:pl-10 sm:pr-7 sm:pt-11"
                : plan.shape === "arch-right"
                  ? "photo-arch-right pb-5 pl-6 pr-8 pt-9 sm:pb-6 sm:pl-7 sm:pr-10 sm:pt-11"
                  : "rounded-3xl p-6 pt-9 sm:p-7 sm:pt-11";
            const badgeSideClass =
              plan.shape === "arch-right" ? "left-5 sm:left-7" : "right-5 sm:right-7";

            return (
              <FadeUp key={plan.name} delay={i * 0.1} className="h-full">
                <div
                  className={`relative flex h-full flex-col items-center justify-center bg-cream text-ink ${shapeClass} ${
                    plan.featured
                      ? "border-2 border-accent shadow-lg"
                      : "border border-line"
                  }`}
                >
                  {plan.featured && (
                    <span className={`bg-gradient-aurora absolute -top-3 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink sm:-top-3.5 ${badgeSideClass}`}>
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

                  {plan.description && (
                    <p className="mt-2 text-sm text-ink/70">{nbsp(plan.description)}</p>
                  )}

                  <ul className="mt-4 flex flex-col gap-1.5">
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
                    href={plan.ctaHref}
                    target={plan.ctaExternal ? "_blank" : undefined}
                    rel={plan.ctaExternal ? "noopener noreferrer" : undefined}
                    className={`mt-6 block w-fit rounded-full px-8 py-2.5 text-center text-xs uppercase tracking-[0.2em] transition-all duration-200 ${
                      plan.featured
                        ? "bg-gradient-aurora text-ink hover:opacity-90"
                        : "border border-ink/30 text-ink hover:border-accent hover:text-accent"
                    }`}
                  >
                    {nbsp(plan.ctaLabel)}
                  </a>
                </div>
              </FadeUp>
            );
          })}
        </div>

        <FadeUp delay={0.2}>
          <p className="mt-10 text-center text-xs text-muted">
            Máš otázky k členství?{" "}
            <a
              href={`mailto:${kontakt_email}`}
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
