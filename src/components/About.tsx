import Image from "next/image";
import FadeUp from "./FadeUp";
import { USCREEN } from "@/lib/config";
import { IconSparkle, IconLeafBranch } from "./BrandIcons";

export default function About() {
  return (
    <section id="o-mne" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* ── Intro: fotky + nadpis + první část příběhu ── */}
        <div className="grid grid-cols-1 items-start gap-16 md:grid-cols-2 md:gap-24">
          {/* Fotky */}
          <FadeUp delay={0.05}>
            <div className="relative mx-auto max-w-sm pb-24">
              <div className="relative h-[440px] w-full overflow-hidden rounded-t-full rounded-bl-none rounded-br-[5rem]">
                <Image
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=85"
                  alt="Anežka — lektorka jógy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="absolute bottom-0 right-0 z-10 h-[300px] w-[78%] overflow-hidden rounded-tl-[5rem] rounded-tr-none rounded-br-none rounded-bl-[5rem] shadow-xl ring-8 ring-sand">
                <Image
                  src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&q=85"
                  alt="Jóga — detail praxe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 35vw"
                />
              </div>
            </div>
          </FadeUp>

          {/* Text */}
          <div>
            <FadeUp delay={0}>
              <div className="mb-4 flex items-center gap-3">
                <IconLeafBranch size={22} />
                <p className="text-xs uppercase tracking-[0.3em] text-accent">Můj jógový příběh</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h2 className="font-allura text-4xl text-ink sm:text-5xl">
                Ahoj, jsem Anežka
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mt-6 leading-relaxed text-muted">
                To, že teď nevidíš nebo neznáš svoji cestu, ještě neznamená,
                že neexistuje.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Ani já bych si před pěti lety nepomyslela, že jednou budu ženy
                provázet jógou.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                K józe jsem se nedostala přes studia ani skupinové lekce.
                Naopak. Začínala jsem sama doma, prostřednictvím online lekcí.
                Hledala jsem způsob, jak se cítit lépe ve svém těle, uvolnit
                napětí a dopřát si chvíli jen pro sebe.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <a
                href={USCREEN.signup}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-gradient-aurora px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-all duration-200 hover:opacity-90"
              >
                Vyzkoušet studio
              </a>
            </FadeUp>
          </div>
        </div>

        {/* ── Zbytek příběhu — plná šířka ── */}
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-16">
          <FadeUp delay={0.05}>
            <div className="space-y-4 leading-relaxed text-muted">
              <p>Zpočátku pro mě byla jóga především o pohybu.</p>
              <p>Postupem času jsem ale začala zjišťovat, že mi přináší mnohem víc.</p>
              <p>
                Učila mě zastavit se. Naslouchat sama sobě. Vnímat své tělo.
                A důvěřovat tomu, co cítím.
              </p>
              <p>
                Přestože si tehdy mnoho lidí kolem mě myslelo, že je bláznivé
                chtít se stát lektorkou jógy, něco uvnitř mě mě vedlo dál.
              </p>
              <p>
                Nevěděla jsem, kam mě tato cesta zavede. Jen jsem cítila, že
                ji chci následovat.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="space-y-4 leading-relaxed text-muted">
              <p>
                Dnes, po více než pěti letech, provázím ženy na skupinových
                lekcích, online lekcích, ženských setkáních a víkendových
                akcích. A s pokorou sleduji, jak si každá žena nachází svou
                vlastní cestu zpět k sobě.
              </p>
              <p>
                Aurora Yoga vznikla z lásky k józe, ale především z touhy
                vytvořit bezpečný prostor.
              </p>
              <p className="font-medium text-ink">
                Prostor, kde nemusíš podávat výkon.
                <br />
                Nemusíš být dokonalá.
                <br />
                Nemusíš nic dokazovat.
                <br />
                Stačí přijít taková, jaká právě jsi.
              </p>
            </div>
          </FadeUp>
        </div>

      </div>
    </section>
  );
}
