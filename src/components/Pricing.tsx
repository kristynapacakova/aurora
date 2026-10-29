import Link from "next/link";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { IconSparkle } from "./BrandIcons";
import { getNastaveni } from "@/lib/db";

export default async function Pricing() {
  const { uscreen_home, uscreen_signup, cena_lekce, cena_mesicni, cena_rocni, kontakt_email } =
    await getNastaveni();

  // Úspora u ročního se počítá, ať nemůže zastarat při změně cen v administraci.
  // Dřív tu bylo natvrdo „Ušetříš 2 měsíce", přitom při 399 a 299 Kč jsou to
  // tři měsíční platby (4 788 − 3 588 = 1 200 Kč).
  const mesicne = Number(cena_mesicni) || 0;
  const rocneZaMesic = Number(cena_rocni) || 0;
  const usporaKc = Math.max(0, mesicne * 12 - rocneZaMesic * 12);
  const usporaMesicu = mesicne > 0 ? Math.round(usporaKc / mesicne) : 0;

  // Tarify odpovídají tomu, co jde opravdu koupit ve studiu.
  const PLANS = [
    {
      name: "Za lekci",
      price: cena_lekce,
      period: "/ lekce",
      description: "Ideální na jednorázové vyzkoušení.",
      featured: false,
      shape: "arch-left",
      features: [
        "Přístup k vybrané lekci na jeden den",
        "Možnost pustit si ji opakovaně",
        "Bez měsíčního členství",
      ],
      // Vede do studia mezi lekce, ne na výběr členství: lekce se pronajímá
      // u konkrétního videa, kdežto /join nabízí jen měsíční a roční tarif.
      ctaLabel: "Prohlédnout lekce",
      ctaHref: uscreen_home,
      ctaExternal: true,
    },
    {
      name: "Měsíční",
      price: cena_mesicni,
      period: "/ měsíc",
      description: "Ideální, když chceš začít bez velkého rozhodování.",
      featured: false,
      shape: "plain",
      features: [
        "Celá knihovna lekcí",
        "Cvičíš kdykoliv a odkudkoliv",
        "Lekce různých délek a zaměření",
        "Bez závazku — zrušíš kdykoliv",
      ],
      ctaLabel: "Vybrat členství",
      ctaHref: uscreen_signup,
      ctaExternal: true,
    },
    {
      name: "Roční",
      price: cena_rocni,
      period: "/ měsíc",
      description:
        usporaMesicu > 0
          ? `Ušetříš ${usporaMesicu} měsíce oproti měsíčnímu členství.`
          : "Výhodnější varianta na celý rok.",
      featured: true,
      shape: "arch-right",
      features: [
        "Vše z měsíčního členství",
        usporaKc > 0 ? `Ušetříš ${usporaKc.toLocaleString("cs-CZ")} Kč za rok` : "Výhodnější cena",
        "Zaplatíš jednou a máš celý rok klid",
        "Cena ti zůstane stejná po celý rok",
      ],
      ctaLabel: "Vybrat členství",
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
            {/* max-w-2xl místo max-w-sm, ať se věta na počítači vejde na jeden
                řádek; na mobilu se přirozeně zalomí. */}
            <p className="mx-auto mt-5 max-w-2xl text-muted">
              {nbsp("Pobyt nebo společné lekce jako dárek? Mrkni na ")}
              <Link
                href="/darkovy-poukaz"
                className="text-ink underline underline-offset-4 transition-colors hover:text-accent-d"
              >
                {nbsp("Aurora dárkové poukazy")}
              </Link>
              .
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
                      Nejvýhodnější
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
          {/* E-mail schválně jako obyčejný text, ne odkaz — klientka nechce,
              aby se návštěvnicím otevíral poštovní program. */}
          <p className="mt-10 text-center text-xs text-muted">
            Máš otázky k členství? Napiš mi na{" "}
            <span className="text-ink">{kontakt_email}</span>.
          </p>
        </FadeUp>
      </div>

    </section>
  );
}
