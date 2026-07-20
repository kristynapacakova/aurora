import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getNastaveni } from "@/lib/db";

export const metadata = {
  title: "Obchodní podmínky | AURORA jóga",
};

export default async function ObchodniPodminkyPage() {
  const { kontakt_email } = await getNastaveni();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-accent">
            Právní informace
          </p>
          <h1 className="text-center font-serif text-4xl text-ink sm:text-5xl">
            Obchodní podmínky
          </h1>
          <p className="mt-4 text-center text-sm text-muted">
            Platné od [DOPLNIT DATUM]
          </p>

          <div className="mt-12 flex flex-col gap-10 text-sm leading-relaxed text-muted">
            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">1. Úvodní ustanovení</h2>
              <p>
                Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi
                poskytovatelem a zákazníkem (spotřebitelem) vznikající v souvislosti
                nebo na základě smlouvy o poskytování online jógového členství,
                jednotlivých lekcí a pobytů uzavírané přes webové stránky
                aurorajoga.cz.
              </p>
              <p className="mt-3">
                Poskytovatel: <strong className="text-ink">[DOPLNIT jméno a příjmení / název firmy]</strong>
                <br />
                IČO: <strong className="text-ink">17650593</strong>
                {" "}(DIČ: <strong className="text-ink">[DOPLNIT, je-li plátce DPH]</strong>)
                <br />
                Se sídlem: <strong className="text-ink">[DOPLNIT adresa]</strong>
                <br />
                Zapsaná: <strong className="text-ink">[DOPLNIT — např. v živnostenském rejstříku / obchodním rejstříku, spisová značka]</strong>
                <br />
                Kontaktní e-mail:{" "}
                <a href={`mailto:${kontakt_email}`} className="text-ink underline underline-offset-4 hover:text-accent-d">
                  {kontakt_email}
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">2. Objednávka a uzavření smlouvy</h2>
              <p>
                Zákazník si vybere požadované členství, jednotlivou lekci nebo pobyt a
                odešle objednávku prostřednictvím formuláře na webu nebo přes
                platformu Uscreen. Smlouva mezi poskytovatelem a zákazníkem je
                uzavřena okamžikem [DOPLNIT — potvrzení objednávky poskytovatelem /
                přijetí platby].
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">3. Cena a platební podmínky</h2>
              <p>
                Ceny členství, jednotlivých lekcí a pobytů jsou uvedeny na webu
                včetně všech poplatků a jsou platné po celou dobu jejich zobrazení.
                Platbu lze provést [DOPLNIT — platební kartou přes Uscreen /
                bankovním převodem dle pokynů uvedených v objednávce].
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">
                4. Online členství a jednotlivé lekce
              </h2>
              <p>
                Přístup k zakoupenému členství nebo jednotlivé lekci je zákazníkovi
                zpřístupněn ihned po přijetí platby. Jelikož jde o poskytování
                digitálního obsahu, zákazník bere odesláním objednávky a udělením
                souhlasu s okamžitým zahájením plnění na vědomí, že tímto ztrácí
                právo na odstoupení od smlouvy do 14 dnů podle § 1837 písm. l)
                občanského zákoníku, jakmile je mu obsah zpřístupněn v plném rozsahu.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">5. Pobyty</h2>
              <p>
                Objednávka pobytu se stává závaznou okamžikem [DOPLNIT — potvrzení
                objednávky poskytovatelem / uhrazení zálohy či celé částky].
                V souladu s § 1837 písm. j) občanského zákoníku se na smlouvu o
                poskytnutí ubytování, dopravy, stravování nebo využití volného
                času poskytovaného v určeném termínu nevztahuje právo spotřebitele
                na odstoupení od smlouvy do 14 dnů.
              </p>
              <p className="mt-3">
                Stornopodmínky: <strong className="text-ink">[DOPLNIT — např. výše vratky v % ceny podle počtu dní před začátkem pobytu]</strong>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">6. Reklamace</h2>
              <p>
                Případné reklamace zasílejte na e-mail{" "}
                <a href={`mailto:${kontakt_email}`} className="text-ink underline underline-offset-4 hover:text-accent-d">
                  {kontakt_email}
                </a>
                . Reklamace bude vyřízena bez zbytečného odkladu, nejpozději do 30
                dnů ode dne jejího uplatnění, pokud se strany nedohodnou na delší
                lhůtě.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">7. Ochrana osobních údajů</h2>
              <p>
                Zpracování osobních údajů zákazníků se řídí zásadami popsanými na
                stránce{" "}
                <a href="/ochrana-osobnich-udaju" className="text-ink underline underline-offset-4 hover:text-accent-d">
                  Ochrana osobních údajů
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-xl text-ink">8. Závěrečná ustanovení</h2>
              <p>
                Poskytovatel si vyhrazuje právo tyto obchodní podmínky v přiměřeném
                rozsahu měnit. Vztahy těmito podmínkami neupravené se řídí
                občanským zákoníkem a zákonem o ochraně spotřebitele.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
