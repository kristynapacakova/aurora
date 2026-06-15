# Jóga s Klárou — One-page web

Minimalistický jednostránkový web pro lektorku jógy. Postaveno na **Next.js
(App Router)**, **Tailwind CSS** a **Framer Motion**, hostováno na **Vercelu**.

## Struktura

- `/` — hlavní stránka (Hero, O mně, Lekce, Ceník + objednávkový formulář)
- `/dekujeme` — děkovná stránka s instrukcemi k QR platbě
- `/studium` — chráněná členská sekce (přístupový kód, server-side middleware + cookie)
- `/studium/login` — přihlašovací stránka do členské sekce
- `src/proxy.ts` — middleware (proxy) ověřující session cookie pro `/studium`
- `src/app/api/objednavka/route.ts` — API route pro odeslání objednávky e-mailem přes Resend (alternativa k Formspree)

## 1. Spuštění projektu lokálně

### Požadavky

- [Node.js](https://nodejs.org/) verze 20 nebo novější
- npm (přichází s Node.js)

### Instalace

```bash
# 1. Naklonujte si repozitář
git clone <URL_VAŠEHO_REPOZITÁŘE>
cd aurora

# 2. Nainstalujte závislosti
npm install

# 3. Zkopírujte ukázkový .env soubor a vyplňte hodnoty
cp .env.example .env.local
```

### Konfigurace `.env.local`

Otevřete `.env.local` a vyplňte podle toho, jakou variantu odesílání
formuláře chcete použít:

**Varianta A — Formspree (doporučeno, nejjednodušší):**

1. Zaregistrujte se na [formspree.io](https://formspree.io)
2. Vytvořte nový formulář a zkopírujte jeho endpoint (např.
   `https://formspree.io/f/abcd1234`)
3. Vložte ho do `.env.local`:
   ```
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/abcd1234
   ```

**Varianta B — Resend (vlastní e-maily):**

Pokud `NEXT_PUBLIC_FORMSPREE_ENDPOINT` necháte prázdné, formulář automaticky
použije vlastní API route `/api/objednavka`, která odešle e-mail přes
[Resend](https://resend.com):

```
RESEND_API_KEY=re_xxxxxxxx
RESEND_TO_EMAIL=vas@email.cz
RESEND_FROM_EMAIL=objednavky@vasedomena.cz
```

(`RESEND_FROM_EMAIL` musí být na doméně ověřené v Resendu.)

**Členská sekce `/studium`:**

```
STUDIO_ACCESS_CODE=Namaste2026
STUDIO_COOKIE_SECRET=nahodny-tajny-retezec
```

- `STUDIO_ACCESS_CODE` je přístupový kód, který se ověřuje na serveru
  (výchozí `Namaste2026`, pokud proměnnou nevyplníte).
- `STUDIO_COOKIE_SECRET` je tajný klíč pro podepisování přihlašovací cookie.
  Vygenerujte si vlastní náhodný řetězec, např. příkazem `openssl rand -hex 32`.

Přístup je řešen přes `src/proxy.ts`: stránka `/studium` je chráněná a
bez platné přihlašovací cookie přesměruje na `/studium/login`. Po zadání
správného kódu API route `/api/studium-login` nastaví podepsanou `httpOnly`
cookie platnou 30 dní. Odhlášení proběhne tlačítkem "Odhlásit se" (volá
`/api/studium-logout`).

### Spuštění vývojového serveru

```bash
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000).

## 2. Úpravy obsahu

- Texty a sekce hlavní stránky: `src/components/Hero.tsx`, `About.tsx`,
  `Services.tsx`, `PricingForm.tsx`, `Footer.tsx`
- Lekce a balíčky v ceníku: `src/lib/lessons.ts`
- QR kód platby: nahraďte placeholder v `src/app/dekujeme/page.tsx` vlastním
  obrázkem (např. vložte `qr-platba.png` do složky `public/` a použijte
  `<Image src="/qr-platba.png" ... />`)
- Video v členské sekci: v `src/app/studium/page.tsx` nahraďte `src` u
  `<iframe>` odkazem na Vimeo/YouTube embed

## 3. Nahrání na GitHub a nasazení na Vercel

### GitHub

```bash
git init   # pokud repozitář ještě není inicializovaný
git add .
git commit -m "Initial commit - web pro jógu"
git branch -M main
git remote add origin <URL_VAŠEHO_REPOZITÁŘE_NA_GITHUBU>
git push -u origin main
```

### Vercel

1. Přejděte na [vercel.com](https://vercel.com) a přihlaste se přes GitHub
2. Klikněte na **Add New → Project**
3. Vyberte repozitář s tímto webem a klikněte na **Import**
4. Framework Preset se nastaví automaticky na **Next.js** — nic neměňte
5. V sekci **Environment Variables** vložte stejné proměnné jako v
   `.env.local` (`NEXT_PUBLIC_FORMSPREE_ENDPOINT`, případně `RESEND_API_KEY`,
   `RESEND_TO_EMAIL`, `RESEND_FROM_EMAIL`, `STUDIO_ACCESS_CODE`,
   `STUDIO_COOKIE_SECRET`)
6. Klikněte na **Deploy**

Po dokončení nasazení získáte veřejnou URL (např. `https://aurora-joga.vercel.app`).
Při každém dalším `git push` do hlavní větve se web automaticky znovu nasadí.

## Užitečné příkazy

```bash
npm run dev     # vývojový server
npm run build   # produkční build
npm run start   # spuštění produkčního buildu lokálně
npm run lint    # kontrola kódu
```
