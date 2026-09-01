// ─────────────────────────────────────────────────────────────────────────────
// Volná místa na pobytu.
//
// Kapacita 0 znamená, že se počet nehlídá — pobyt se pak sám nevyprodá
// a na webu se o místech nic nepíše. Přepínač „vyprodáno" v administraci
// zůstává jako ruční přebití: klientka jím pobyt zavře, i když by podle
// čísel ještě místo bylo.
//
// Bez závislostí schválně, ať to jde použít i v komponentách v prohlížeči.
// ─────────────────────────────────────────────────────────────────────────────

export type StavMist = {
  // Hlídá se vůbec počet míst?
  sledujeSe: boolean;
  kapacita: number;
  obsazeno: number;
  volno: number;
  vyprodano: boolean;
};

export function stavMist({
  kapacita,
  obsazenoRucne,
  objednavky,
  vyprodano,
}: {
  kapacita?: number;
  obsazenoRucne?: number;
  // Počet objednávek z webu.
  objednavky?: number;
  // Ruční přepínač „vyprodáno" z administrace.
  vyprodano?: boolean;
}): StavMist {
  const celkem = Math.max(0, Math.round(kapacita ?? 0));
  const obsazeno = Math.max(0, Math.round(obsazenoRucne ?? 0)) + Math.max(0, objednavky ?? 0);
  const sledujeSe = celkem > 0;
  const volno = sledujeSe ? Math.max(0, celkem - obsazeno) : 0;
  return {
    sledujeSe,
    kapacita: celkem,
    obsazeno,
    volno,
    vyprodano: vyprodano === true || (sledujeSe && volno <= 0),
  };
}

// „Zbývá poslední místo" zní líp než „zbývá 1 místo" a čeština si u dvou až
// čtyř žádá jiný tvar než u pěti a víc.
export function popisVolnychMist(volno: number): string {
  if (volno <= 0) return "Vyprodáno";
  if (volno === 1) return "Zbývá poslední místo";
  if (volno < 5) return `Zbývají ${volno} místa`;
  return `Zbývá ${volno} míst`;
}
