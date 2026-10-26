"use client";

// Sdílené prvky administrace.
//
// Dřív měla každá sekce vlastní způsob přepínání — editor podtržené
// záložky, objednávky plné pilulky, nastavení a šablony řádek obtažených
// odkazů. Vypadalo to jako tři různé aplikace vedle sebe. Tady je jeden
// styl pro všechno, co přepíná pohled, a jeden pro tlačítka.

export type Zalozka = { key: string; label: string; count?: number };

export function Zalozky({
  zalozky,
  aktivni,
  onChange,
  className = "",
}: {
  zalozky: Zalozka[];
  aktivni: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  // Záložky leží ve vlastním bílém bloku, aby nad kartou nevisely volně.
  // Vybraná se značí broskvovou dlaždicí — stejně jako v levém sloupci
  // navigace, ať má „tohle je vybrané" v celé administraci jeden tvar.
  return (
    <div
      className={`flex w-fit max-w-full flex-wrap gap-1 rounded-2xl border border-line bg-white p-1.5 ${className}`}
    >
      {zalozky.map((z) => {
        const active = z.key === aktivni;
        return (
          <button
            key={z.key}
            type="button"
            onClick={() => onChange(z.key)}
            aria-current={active ? "page" : undefined}
            className={`rounded-xl px-4 py-2.5 text-xs uppercase tracking-[0.18em] transition-colors ${
              active ? "bg-sand text-ink" : "text-muted hover:bg-sand/50 hover:text-ink"
            }`}
          >
            {z.label}
            {z.count !== undefined && (
              <span className={`ml-1.5 ${active ? "text-accent-d" : "text-muted/70"}`}>{z.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Tlačítka v kartách. Dřív se tenhle dlouhý řetězec tříd opakoval přes
// dvacetkrát a pokaždé o kousek jinak (tracking-wider vs. tracking-[0.2em]).
export const tlacitko =
  "rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent hover:text-accent";

// Totéž pro mazání a jiné nevratné kroky.
export const tlacitkoNebezpeci =
  "rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5";
