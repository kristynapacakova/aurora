import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/config";

export const metadata = {
  title: "Ochrana osobních údajů | AURORA jóga",
};

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-accent">
            Právní informace
          </p>
          <h1 className="text-center font-serif text-4xl text-ink sm:text-5xl">
            Ochrana osobních údajů
          </h1>
          <p className="mt-4 text-center text-sm text-muted">
            Platné od [DOPLNIT DATUM]
          </p>

          <div className="mt-12 flex flex-col gap-10 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">1. Správce osobních údajů</h2>
              <p>
                Správcem osobních údajů je{" "}
                <strong className="text-ink">[DOPLNIT jméno a příjmení / název firmy]</strong>,
                IČO: <strong className="text-ink">[DOPLNIT]</strong>, se sídlem{" "}
                <strong className="text-ink">[DOPLNIT adresa]</strong> (dále jen
                „správce“). Ve věcech ochrany osobních údajů nás můžete
                kontaktovat na e-mailu{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-ink underline underline-offset-4 hover:text-accent-d">
                  {CONTACT.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">2. Jaké osobní údaje zpracováváme</h2>
              <ul className="list-inside list-disc space-y-1">
                <li>jméno a příjmení</li>
                <li>e-mailová adresa</li>
                <li>telefonní číslo (je-li vyplněno)</li>
                <li>obsah zprávy nebo poznámky k objednávce</li>
                <li>údaje o objednaném členství, lekci nebo pobytu</li>
              </ul>
              <p className="mt-3">
                Platební údaje při platbě přes platformu Uscreen zpracovává přímo
                tato platforma — správce k nim nemá přístup ani je neukládá.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">3. Účel a právní základ zpracování</h2>
              <ul className="list-inside list-disc space-y-1">
                <li>vyřízení objednávky a komunikace se zákazníkem — plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)</li>
                <li>vyřízení případné reklamace — plnění právní povinnosti</li>
                <li>zasílání informací o pobytech a novinkách, pokud si o ně zákazník řekne — souhlas (čl. 6 odst. 1 písm. a) GDPR)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">4. Doba uchování</h2>
              <p>
                Osobní údaje uchováváme po dobu nezbytně nutnou k vyřízení
                objednávky a dále po dobu vyžadovanou právními předpisy
                (např. účetní a daňové doklady po dobu [DOPLNIT, typicky 10 let]).
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">5. Příjemci osobních údajů</h2>
              <p>
                Osobní údaje mohou být předány těmto zpracovatelům:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>platforma Uscreen — poskytovatel online studia a členství</li>
                <li>[DOPLNIT — např. e-mailový nástroj, hosting, účetní]</li>
              </ul>
              <p className="mt-3">
                Osobní údaje nepředáváme třetím stranám za účelem marketingu bez
                výslovného souhlasu.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">6. Vaše práva</h2>
              <p>V souvislosti se zpracováním osobních údajů máte právo:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>na přístup ke svým osobním údajům</li>
                <li>na opravu nepřesných údajů</li>
                <li>na výmaz („právo být zapomenut“)</li>
                <li>na omezení zpracování</li>
                <li>na přenositelnost údajů</li>
                <li>vznést námitku proti zpracování</li>
                <li>podat stížnost u Úřadu pro ochranu osobních údajů (uoou.cz)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">7. Cookies</h2>
              <p>
                Web aktuálně používá pouze technické (nezbytné) soubory cookie,
                které jsou potřeba pro jeho základní fungování — přihlášení do
                chráněné sekce webu a ochranu obsahu heslem. Tyto cookies nelze
                vypnout, protože bez nich web nefunguje správně, a nevyžadují
                souhlas návštěvníka.
              </p>
              <p className="mt-3">
                Web aktuálně nepoužívá žádné analytické ani marketingové cookies
                (např. Google Analytics, Meta Pixel). Pokud se to v budoucnu
                změní, tato stránka bude aktualizována a na webu přibude
                možnost cookies odsouhlasit nebo odmítnout.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">8. Kontakt</h2>
              <p>
                V případě dotazů ke zpracování osobních údajů nás kontaktujte na{" "}
                <a href={`mailto:${CONTACT.email}`} className="text-ink underline underline-offset-4 hover:text-accent-d">
                  {CONTACT.email}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
