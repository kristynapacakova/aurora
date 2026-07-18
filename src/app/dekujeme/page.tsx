import Link from "next/link";

export const metadata = {
  title: "Děkujeme za objednávku | AURORA jóga",
};

type Props = {
  searchParams: Promise<{ email?: string }>;
};

export default async function DekujemePage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-6 py-24">
      <div className="w-full max-w-xl rounded-2xl bg-cream p-8 text-center shadow-sm ring-1 ring-line sm:p-12">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-accent-d">
          Děkujeme
        </p>
        <h1 className="font-serif text-4xl text-ink sm:text-5xl">
          Vaše objednávka byla přijata
        </h1>

        <p className="mt-6 text-muted leading-relaxed">
          Pro dokončení rezervace prosím uhraďte platbu pomocí QR kódu níže.
          Lekce vám bude přiřazena po přijetí platby.
        </p>

        {/* Placeholder pro QR kód platby */}
        <div className="mx-auto mt-8 flex aspect-square w-48 items-center justify-center rounded-2xl border-2 border-dashed border-line text-sm text-muted">
          QR kód platby
          {/* Nahraďte tímto obrázkem, např.:
          <Image src="/qr-platba.png" alt="QR platba" width={200} height={200} />
          */}
        </div>

        <div className="mx-auto mt-8 max-w-md rounded-xl border border-line p-5 text-left text-sm leading-relaxed text-ink">
          <p className="mb-2 font-medium uppercase tracking-widest text-accent-d">
            Důležité upozornění
          </p>
          <p>
            Do poznámky pro příjemce u platby uveďte prosím váš{" "}
            <strong>e-mail</strong>
            {email ? (
              <>
                {" "}
                (<span className="font-mono">{email}</span>)
              </>
            ) : null}
            , se kterým jste se objednávali. Díky tomu vám budeme moct snadno
            přiřadit platbu k vaší rezervaci.
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block rounded-full border border-accent-d px-8 py-3 text-sm uppercase tracking-widest text-accent-d transition-colors hover:bg-accent-d/10"
        >
          Zpět na hlavní stránku
        </Link>
      </div>
    </main>
  );
}
