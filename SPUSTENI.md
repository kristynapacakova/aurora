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
2. ~~Sekce „O mně“ na hlavní stránce.~~ **Hotovo** (26. 10.) — dvousloupcová
   sekce s textem a vloženým videem. Uscreen ji z hotových bloků poskládat
   neumí, je to blok Custom HTML; podklad je v `uscreen-o-mne.html`. Text
   převzatý z webu, ať studio a web nemluví každý jinak.
3. ~~Fotka v heru až pod menu.~~ **Hotovo** (26. 10.) — Uscreen na to nemá
   nastavení, řeší to CSS v bloku Custom HTML; podklad je
   v `uscreen-hero-pres-menu.html`. Menu je průhledné, nelepí se (lepivost
   sedí na jeho obalu, ne na něm samotném) a fotka je vytažená o jeho výšku
   nahoru.

   Ve stejném bloku je i strop šířky obsahu (1152 px, stejně jako web
   Aurory) s výjimkou pro lištu menu, která zůstává přes celou šířku, a
   zprůhledněné pozadí tlačítka účtu.

   **Na barvu textu v menu se záměrně nesahá.** Obarvení položek na bílo
   kvůli čitelnosti nad fotkou opakovaně rozbíjelo rozbalovací panel účtu,
   kde bílý text na světlém pozadí mizel. Uscreen má hlavičku provázanou
   s barevným schématem, takže zásah zvenčí se dřív nebo později někde
   projeví. Místo toho je pod vycentrovanými položkami menu krémová skvrna
   v odstínu scheme color, která se vytrácí do stran — logo vlevo tak má
   pod sebou fotku a nebledne.
4. ~~Sekce s Instagramem.~~ **Hotovo** (28. 10.) — stejná jako na webu,
   podklad je v `uscreen-instagram.html`. Fotky se berou přímo z webu
   (`public/ig-1.jpg` až `-5.jpg`), takže se mění na jednom místě a propíšou
   se na web i do studia zároveň. Statické obrázky jsou z brány `/vstup`
   vyloučené, proto fungují i před spuštěním.
5. **Nadpis a cena v heru.** Zbývá. Proti Yogitch tam pořád chybí to, co se
   přečte za tři vteřiny — co to je a kolik to stojí. Text připravený:
   nadpis „Rozsviť své vnitřní světlo“ (stejný jako na webu), podnadpis
   „Online členství 399 Kč měsíčně“.

   **Cenu doplnit až po nastavení měny**, jinak by žena viděla v heru koruny
   a v pokladně dolary. Totéž platí pro slib zkušební doby.
6. **Zaoblení tlačítek a karet.** Uscreen na to má nastavení v `Edit website
   → Branding` (v kódu `button_border_radius` a `card_border_radius`, obojí
   zatím 0.125rem, tedy prakticky ostré rohy). Web Aurory má karty zaoblené
   kolem 20 px, takže tohle srovná vzhled víc než cokoliv kolem menu.
   Nastavit nativně, ne přes CSS — nativní nastavení přežije i přestavbu
   šablony.
7. Katalog viditelný i bez přihlášení.
8. Náhledové obrázky u videí.

Body 6–8 jdou ladit i po spuštění.

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

- ~~Vrací 404 i samotná hlavní stránka studia?~~ **Nevrací** — hlavní
  stránka `aurorayoga.uscreen.io` se načítá normálně (ověřeno 26. 10.).
  Mrtvé jsou opravdu jen cesty `/sign_up` a `/plans`, takže přesměrování
  obou polí na hlavní stránku je bezpečné.

  Dřívější teorie, že není publikovaný storefront, se **nepotvrdila**.
  Zbývá tedy ta druhá: obě cesty padají proto, že zatím nejsou vytvořené
  žádné plány. Rozhodne se po napojení Stripe.
- ~~Upozornění ohledně **Bundles** u nahraného videa.~~ **Vysvětleno** —
  není to samostatný problém, ale stejná příčina jako mrtvé cesty výš.
  Uscreen u každého videa chce ručně nastavit způsob přístupu (předplatné,
  jednorázová platba, nebo bundle); nic se nedědí automaticky. Video bez
  přiřazeného přístupu je nedostupné i pro platící členku, a přesně na to
  to upozornění je. Přiřadit ho k předplatnému ale nejde, dokud žádné
  předplatné neexistuje — a to neexistuje bez Stripe.

  Vyřeší se samo v kroku 3 nahoře (nastavení plánů).
