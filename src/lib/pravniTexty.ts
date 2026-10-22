// ─────────────────────────────────────────────────────────────────────────────
// Právní texty webu — obchodní podmínky a ochrana osobních údajů.
//
// Celý dokument je jeden text, který si klientka může v administraci přepsat
// podle sebe. Tady zůstává výchozí znění: použije se, dokud si klientka
// neuloží vlastní, a dá se k němu kdykoliv vrátit.
//
// Formátování je záměrně skoro žádné, ať se to dá psát v obyčejném poli:
//   ## Nadpis            — nadpis části
//   prázdný řádek        — nový odstavec
//   - položka            — odrážka
//   **tučně**            — zvýraznění
//   [text](/adresa)      — odkaz
//   {email}              — doplní se kontaktní e-mail z Nastavení
// ─────────────────────────────────────────────────────────────────────────────

export type PravniKlic = "obchodni-podminky" | "ochrana-osobnich-udaju";

export type PravniStranka = {
  klic: PravniKlic;
  nazev: string;
  // Krátký popisek do menu v administraci.
  kratky: string;
  cesta: string;
  platneOd: string;
  text: string;
};

const OBCHODNI_PODMINKY = `## 1. Úvodní ustanovení

Tyto obchodní podmínky upravují vzájemná práva a povinnosti mezi poskytovatelem a zákazníkem (spotřebitelem) vznikající v souvislosti nebo na základě smlouvy o poskytování online jógového členství, jednotlivých lekcí a pobytů uzavírané přes webové stránky aurorayoga.cz.

Poskytovatel: **[DOPLNIT jméno a příjmení / název firmy]**
IČO: **17650593** (DIČ: **[DOPLNIT, je-li plátce DPH]**)
Se sídlem: **[DOPLNIT adresa]**
Zapsaná: **[DOPLNIT — např. v živnostenském rejstříku, spisová značka]**
Kontaktní e-mail: {email}

## 2. Objednávka a uzavření smlouvy

Zákazník si vybere požadované členství, jednotlivou lekci nebo pobyt a odešle objednávku prostřednictvím formuláře na webu nebo přes platformu Uscreen. Smlouva mezi poskytovatelem a zákazníkem je uzavřena okamžikem přijetí platby poskytovatelem.

## 3. Cena a platební podmínky

Ceny členství, jednotlivých lekcí a pobytů jsou uvedeny na webu včetně všech poplatků a jsou platné po celou dobu jejich zobrazení. Platbu za online členství a jednotlivé lekce lze provést platební kartou přímo přes platformu Uscreen. Platbu za pobyt nebo dárkový poukaz lze provést bankovním převodem podle platebních údajů a QR kódu uvedených v objednávce. U pobytů si zákazník v objednávkovém formuláři volí mezi úhradou celé částky a úhradou zálohy s pozdějším doplatkem.

## 4. Online členství a jednotlivé lekce

Přístup k zakoupenému členství nebo jednotlivé lekci je zákazníkovi zpřístupněn ihned po přijetí platby. Jelikož jde o poskytování digitálního obsahu, zákazník bere odesláním objednávky a udělením souhlasu s okamžitým zahájením plnění na vědomí, že tímto ztrácí právo na odstoupení od smlouvy do 14 dnů podle § 1837 písm. l) občanského zákoníku, jakmile je mu obsah zpřístupněn v plném rozsahu.

## 5. Pobyty a dárkové poukazy

Cenu pobytu lze uhradit buď celou najednou, nebo formou zálohy, jejíž výše je uvedena u konkrétního pobytu v objednávkovém formuláři. Objednávka pobytu se stává závaznou okamžikem uhrazení celé částky, případně zálohy, dle platebních údajů uvedených u pobytu. Zbývající doplatek je splatný nejpozději 14 dnů před začátkem pobytu.

Stejným způsobem funguje i nákup dárkového poukazu — poukaz je platný po přijetí platby na účet poskytovatele. Dárkový poukaz lze uplatnit na pobyty a na lekce vedené osobně; na online členství a jednotlivé online lekce, které se hradí přes platformu Uscreen, jej uplatnit nelze. Poukaz lze čerpat i po částech, nevyčerpaný zůstatek zůstává na poukazu. Platnost poukazu je 6 měsíců od přijetí platby; po jejím uplynutí poukaz zaniká a nevyčerpaný zůstatek se nevrací. Poukaz nelze směnit za hotovost.

V souladu s § 1837 písm. j) občanského zákoníku se na smlouvu o poskytnutí ubytování, dopravy, stravování nebo využití volného času poskytovaného v určeném termínu nevztahuje právo spotřebitele na odstoupení od smlouvy do 14 dnů.

**Stornopodmínky.** Zrušit účast je možné kdykoliv, a to e-mailem na adresu uvedenou v kontaktech; rozhodující je datum doručení e-mailu. Vrací se:

- více než **30 dnů** před začátkem pobytu — celá uhrazená částka snížená o zálohu, která propadá jako storno poplatek,
- **30 až 15 dnů** před začátkem pobytu — 50 % uhrazené částky,
- **14 dnů a méně** před začátkem pobytu — uhrazená částka se nevrací.

Pokud za sebe zajistíte náhradnici, která pobyt uhradí, vrací se vám celá zaplacená částka bez ohledu na termín zrušení. Zruší-li pobyt poskytovatel, vrací se celá uhrazená částka do 14 dnů; poskytovatel v takovém případě neodpovídá za náklady, které zákaznici vznikly v souvislosti s pobytem jinde (doprava a podobně).

## 6. Reklamace

Případné reklamace zasílejte na e-mail {email}. Reklamace bude vyřízena bez zbytečného odkladu, nejpozději do 30 dnů ode dne jejího uplatnění, pokud se strany nedohodnou na delší lhůtě.

## 7. Ochrana osobních údajů

Zpracování osobních údajů zákazníků se řídí zásadami popsanými na stránce [Ochrana osobních údajů](/ochrana-osobnich-udaju).

## 8. Závěrečná ustanovení

Poskytovatel si vyhrazuje právo tyto obchodní podmínky v přiměřeném rozsahu měnit. Vztahy těmito podmínkami neupravené se řídí občanským zákoníkem a zákonem o ochraně spotřebitele.`;

const OCHRANA_UDAJU = `## 1. Správce osobních údajů

Správcem osobních údajů je **[DOPLNIT jméno a příjmení / název firmy]**, IČO: **17650593**, se sídlem **[DOPLNIT adresa]** (dále jen „správce"). Ve věcech ochrany osobních údajů nás můžete kontaktovat na e-mailu {email}.

## 2. Jaké osobní údaje zpracováváme

- jméno a příjmení
- e-mailová adresa
- telefonní číslo (je-li vyplněno)
- obsah zprávy nebo poznámky k objednávce
- údaje o objednaném členství, lekci nebo pobytu

Platební údaje při platbě přes platformu Uscreen zpracovává přímo tato platforma — správce k nim nemá přístup ani je neukládá.

## 3. Účel a právní základ zpracování

- vyřízení objednávky a komunikace se zákazníkem — plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)
- vyřízení případné reklamace — plnění právní povinnosti
- zasílání informací o pobytech a novinkách, pokud si o ně zákazník řekne — souhlas (čl. 6 odst. 1 písm. a) GDPR)

## 4. Doba uchování

Osobní údaje uchováváme po dobu nezbytně nutnou k vyřízení objednávky a dále po dobu vyžadovanou právními předpisy — účetní a daňové doklady po dobu 10 let od konce zdaňovacího období, v souladu se zákonem o dani z přidané hodnoty.

## 5. Příjemci osobních údajů

Osobní údaje mohou být předány těmto zpracovatelům:

- platforma Uscreen — poskytovatel online studia a členství
- Vercel Inc. — hosting webu, databáze a úložiště fotografií
- Resend — odesílání transakčních e-mailů (potvrzení objednávek a upozornění)
- [DOPLNIT — např. účetní, pokud si údaje pro fakturaci předáváte]

Osobní údaje nepředáváme třetím stranám za účelem marketingu bez výslovného souhlasu.

## 6. Vaše práva

V souvislosti se zpracováním osobních údajů máte právo:

- na přístup ke svým osobním údajům
- na opravu nepřesných údajů
- na výmaz („právo být zapomenut")
- na omezení zpracování
- na přenositelnost údajů
- vznést námitku proti zpracování
- podat stížnost u Úřadu pro ochranu osobních údajů (uoou.cz)

## 7. Cookies

Web aktuálně používá pouze technické (nezbytné) soubory cookie, které jsou potřeba pro jeho základní fungování — přihlášení do chráněné sekce webu a ochranu obsahu heslem. Tyto cookies nelze vypnout, protože bez nich web nefunguje správně, a nevyžadují souhlas návštěvníka.

Web aktuálně nepoužívá žádné analytické ani marketingové cookies (např. Google Analytics, Meta Pixel). Pokud se to v budoucnu změní, tato stránka bude aktualizována a na webu přibude možnost cookies odsouhlasit nebo odmítnout.

## 8. Kontakt

V případě dotazů ke zpracování osobních údajů nás kontaktujte na {email}.`;

export const PRAVNI_TEXTY: PravniStranka[] = [
  {
    klic: "obchodni-podminky",
    nazev: "Obchodní podmínky",
    kratky: "Obchodní podmínky",
    cesta: "/obchodni-podminky",
    platneOd: "",
    text: OBCHODNI_PODMINKY,
  },
  {
    klic: "ochrana-osobnich-udaju",
    nazev: "Ochrana osobních údajů",
    kratky: "Osobní údaje",
    cesta: "/ochrana-osobnich-udaju",
    platneOd: "",
    text: OCHRANA_UDAJU,
  },
];

export function vychoziPravniText(klic: PravniKlic): PravniStranka {
  const s = PRAVNI_TEXTY.find((s) => s.klic === klic);
  if (!s) throw new Error(`Neznámý právní text: ${klic}`);
  return s;
}
