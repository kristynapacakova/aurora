import { getPravniText } from "./db";
import { vychoziPravniText, type PravniKlic, type PravniStranka } from "./pravniTexty";

// Načte právní stránku: co má klientka uložené v administraci, jinak výchozí
// znění z kódu. Stejný postup jako u e-mailových šablon.
export async function nactiPravniText(klic: PravniKlic): Promise<PravniStranka> {
  const vychozi = vychoziPravniText(klic);
  const ulozene = await getPravniText(klic);
  return {
    ...vychozi,
    platneOd: ulozene?.platne_od?.trim() || vychozi.platneOd,
    text: ulozene?.text?.trim() || vychozi.text,
  };
}
