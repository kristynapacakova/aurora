# Spuštění webu — co zbývá

Spuštění: **1. listopadu 2026**. Seznam je živý, odškrtává se průběžně.

---

## Čeká na klientku

### 1. Napojit Stripe v Uscreenu — a hned potom nastavit měnu

**Na kom:** klientka (je to její podnikání — na Stripe jdou peníze, takže
tam patří její účet, IČO a bankovní spojení; nejde to udělat za ni).

**Proč to spěchá:** základní měnu obchodu jde v Uscreenu změnit **jen dokud
nemá studio žádnou aktivní předplatitelku**. Jakmile první žena zaplatí,
výběr měny zešedne a odemkne se až zrušením jejího předplatného. Navíc si
Stripe každou zákaznici zamkne na měnu jejího prvního nákupu — kdo jednou
zaplatí v dolarech, platí v dolarech napořád.

**Souvislost:** `Settings → Checkout → Localized Pricing` se v administraci
vůbec nenabízí. Skoro jistě proto, že není napojený Stripe — dokud nemá
Uscreen přes co vybírat, nemá co nabízet v měnách. Po napojení by se volba
měla objevit.

**Postup, až bude klientka u toho:**

1. Napojit Stripe (účet klientky).
2. Přepnout základní měnu obchodu na **CZK**.
3. Nastavit plány tak, aby seděly s webem: **399 Kč / měsíc** a
   **299 Kč / měsíc při roční platbě**. Čísla ověřit v administraci Aurory
   → Nastavení → Ceník, web a Uscreen musí říkat totéž.
4. Zkušební platba na skutečné kartě, ne jen v testovacím režimu.
5. **Přetestovat adresy** `/sign_up` a `/plans` (viz Otevřené otázky níž) —
   po vytvoření plánů by měly začít fungovat. Pokud ano, vrátit je
   v administraci Aurory → Nastavení → Uscreen zpět z hlavní stránky
   na `…/sign_up` a `…/plans`.

**Pozor:** dokud tohle není hotové, nesmí studio dostat první platící členku.
Web na Uscreen odkazuje už teď, ale je zatím za bránou `/vstup`.

### 2. Doplnit právní texty

**Na kom:** klientka. **Kde:** administrace → Nastavení → Právní texty.

V obchodních podmínkách a v ochraně osobních údajů je **7 míst označených
`[DOPLNIT]`** — jméno nebo název firmy, adresa, zápis v rejstříku, plátcovství
DPH a účetní. U každé stránky je v administraci odznak s počtem.

**Dokud tam zůstanou, vidí je i návštěvnice webu.** Musí být hotové dřív, než
spadne brána, ne potom.

---

## Na nás, k 1. listopadu

### 3. Sundat bránu `/vstup`

Celý web je zatím schovaný za přístupovým kódem. Přesměrování je
v `src/proxy.ts`. Při sundávání zvážit i to, jestli rovnou neodstranit
`/vstup`, `src/lib/siteAuth.ts`, `/api/site-login` a proměnné
`SITE_ACCESS_CODE` a `SITE_COOKIE_SECRET`; `robots.ts` zakazuje `/vstup`.

Až brána spadne, web je okamžitě k nalezení ve vyhledávačích — `robots.ts`
povoluje celý web a sitemapa obsahuje jen existující stránky, takže tady
není co dořešovat.

---

## Hotovo

- Online studio běží na `aurorayoga.uscreen.io`, certifikát nainstalovaný.
- `aurorayoga.cz/studio` přesměruje do studia (ověřeno naživo).
- Odkazy na studio vedou správně; schéma `https://` se doplňuje samo, takže
  se nerozbijí, když se adresa napíše bez něj.
- Vlastní doména `studio.aurorayoga.cz` se neřeší — u Uscreenu je zamčená za
  tarifem Growth (~150 $/měsíc navíc) a kvůli samotné adrese se nevyplatí.
  DNS záznam ve WEDOSu je smazaný. Kdyby se na Growth někdy přešlo, stačí
  přepsat `USCREEN_DOMENA` v `src/lib/config.ts`.
- Číslo účtu pro dárkové poukazy vyplněné.
- Recenze na webu, včetně formuláře pro nové a schvalování v administraci.

---

## Zbytek Uscreenu — až po penězích

Pořadí záměrné: jazyk se musí přepnout dřív, než někdo začne ručně upravovat
e-mailové šablony, protože ty se při změně jazyka **nepřekládají** (systémové
e-maily ano).

1. ~~Jazyk na češtinu.~~ **Hotovo** (26. 10.) — ověřeno tím, že i chybové
   stránky studia chodí česky. Administrace Uscreenu zůstává anglicky, to
   přepnout nejde.
2. Katalog viditelný i bez přihlášení.
3. Náhledové obrázky u videí.
4. Texty na hlavní stránce studia.

Body 2–4 jdou ladit i po spuštění.

---

## Otevřené otázky

- **`/sign_up` a `/plans` nefungují, `/sign_in` funguje.** (Ověřeno
  proklikáním, 26. 10.) Podezření: obě padají proto, že zatím nejsou
  vytvořené žádné plány — není k čemu se registrovat ani co vypsat.
  Přihlášení existuje nezávisle, proto jediné funguje. Je to domněnka;
  rozhodne, jestli adresy vracejí tvrdou 404, nebo jen přesměrují na
  hlavní stránku.

  **Dočasné řešení:** obě pole v administraci Aurory → Nastavení → Uscreen
  míří na hlavní stránku studia, aby na nich nikdo neskončil na chybové
  stránce. Po vytvoření plánů přetestovat a případně vrátit zpět.

- **Nevyjasněné a blokující: vrací 404 i samotná hlavní stránka studia?**
  Screenshot chybové stránky přišel ze Safari, které v adresním řádku
  schovává cestu, takže z něj nejde poznat, která adresa ji vyhodila.
  Pokud `aurorayoga.uscreen.io` bez cesty **funguje**, řešíme jen dvě cesty.
  Pokud **nefunguje**, je mrtvé celé studio včetně `aurorayoga.cz/studio` a
  dočasné řešení výš situaci zhoršuje (tři mrtvé odkazy místo dvou).

  **Teorie:** storefront není publikovaný. Stránky storefrontu (hlavní
  stránka, registrace, ceník) do publikování neexistují, kdežto `/sign_in`
  je systémová stránka platformy a funguje vždycky — což přesně odpovídá
  tomu, co se zatím naměřilo. Zkontrolovat ve `Website` editoru tlačítko
  **Publish** nebo režim „coming soon“.

  Ze zdejšího prostředí to ověřit nejde, uscreen.io není dostupné ani přes
  DNS. Musí se proklikat v prohlížeči.
- Upozornění ohledně **Bundles** u nahraného videa — vyřešené, nebo tam video
  pořád visí nezveřejněné?
