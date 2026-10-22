import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PravniText from "@/components/PravniText";
import { getNastaveni } from "@/lib/db";
import { nactiPravniText } from "@/lib/pravniTextyServer";

export const metadata = {
  title: "Obchodní podmínky | AURORA jóga",
};

// Text si klientka upravuje v administraci, takže se stránka musí občas
// přegenerovat — jinak by zůstala taková, jaká byla při nasazení.
export const revalidate = 60;

export default async function ObchodniPodminkyPage() {
  const [{ kontakt_email }, stranka] = await Promise.all([
    getNastaveni(),
    nactiPravniText("obchodni-podminky"),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-accent">
            Právní informace
          </p>
          <h1 className="text-center font-serif text-4xl text-ink sm:text-5xl">
            {stranka.nazev}
          </h1>
          {stranka.platneOd && (
            <p className="mt-4 text-center text-sm text-muted">
              Platné od {stranka.platneOd}
            </p>
          )}

          <PravniText text={stranka.text} email={kontakt_email} />
        </div>
      </main>
      <Footer />
    </>
  );
}
