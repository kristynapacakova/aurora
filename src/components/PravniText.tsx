import Link from "next/link";
import type { ReactNode } from "react";

// Vykreslí právní text z administrace. Formátování je úmyslně minimální, ať
// se dá psát v obyčejném poli — viz poznámka v lib/pravniTexty.ts.
//
// Pozn.: text pochází z administrace, kam má přístup jen klientka. Nejde
// o veřejný vstup, ale vykresluje se stejně jako kterýkoliv jiný obsah:
// nikdy ne jako HTML, vždy jen jako text s povoleným formátováním níž.

type Props = {
  text: string;
  // Kontaktní e-mail z Nastavení — doplní se za značku {email}.
  email: string;
};

// Rozloží řádek na tučné úseky, odkazy a e-mail.
function inline(radek: string, email: string, klic: string): ReactNode[] {
  const casti: ReactNode[] = [];
  const vzor = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\{email\})/g;
  const kusy = radek.split(vzor);

  kusy.forEach((kus, i) => {
    if (!kus) return;
    const id = `${klic}-${i}`;

    if (kus === "{email}") {
      casti.push(
        <a
          key={id}
          href={`mailto:${email}`}
          className="text-ink underline underline-offset-4 hover:text-accent-d"
        >
          {email}
        </a>
      );
      return;
    }

    if (kus.startsWith("**") && kus.endsWith("**")) {
      casti.push(
        <strong key={id} className="font-medium text-ink">
          {kus.slice(2, -2)}
        </strong>
      );
      return;
    }

    const odkaz = kus.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (odkaz) {
      const [, popis, kam] = odkaz;
      casti.push(
        <Link
          key={id}
          href={kam}
          className="text-ink underline underline-offset-4 hover:text-accent-d"
        >
          {popis}
        </Link>
      );
      return;
    }

    casti.push(<span key={id}>{kus}</span>);
  });

  return casti;
}

export default function PravniText({ text, email }: Props) {
  // Dokument se dělí na bloky prázdným řádkem. Každý blok je buď nadpis,
  // seznam odrážek, nebo odstavec.
  const bloky = text.split(/\n\s*\n/).filter((b) => b.trim().length > 0);

  const sekce: { nadpis: string | null; bloky: string[] }[] = [];
  for (const blok of bloky) {
    const t = blok.trim();
    if (t.startsWith("## ")) {
      sekce.push({ nadpis: t.slice(3).trim(), bloky: [] });
    } else {
      if (sekce.length === 0) sekce.push({ nadpis: null, bloky: [] });
      sekce[sekce.length - 1].bloky.push(t);
    }
  }

  return (
    <div className="mt-12 flex flex-col gap-10 text-sm leading-relaxed text-muted">
      {sekce.map((s, i) => (
        <section key={i}>
          {s.nadpis && (
            <h2 className="mb-3 font-serif text-xl text-ink">{s.nadpis}</h2>
          )}
          <div className="flex flex-col gap-3">
            {s.bloky.map((blok, j) => {
              const radky = blok.split("\n");
              const jeSeznam = radky.every((r) => r.trim().startsWith("- "));

              if (jeSeznam) {
                return (
                  <ul key={j} className="list-disc space-y-1 pl-5">
                    {radky.map((r, k) => (
                      <li key={k}>{inline(r.trim().slice(2), email, `${i}-${j}-${k}`)}</li>
                    ))}
                  </ul>
                );
              }

              // Jednotlivé řádky uvnitř odstavce se zalomí — adresa
              // poskytovatele se tak dá napsat pod sebe.
              return (
                <p key={j}>
                  {radky.map((r, k) => (
                    <span key={k}>
                      {k > 0 && <br />}
                      {inline(r, email, `${i}-${j}-${k}`)}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
