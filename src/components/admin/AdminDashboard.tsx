"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactElement } from "react";
import type { Pobyt, Clanek, Lekce, Poptavka, NewsletterSignup, CekaciListina, DarkovyPoukaz, PoukazCerpani, PoukazNabidka, Nastaveni } from "@/lib/db";
import NastaveniForm from "./NastaveniForm";
import type { StavOdesilani } from "@/lib/email";
import { formatKc } from "@/lib/castky";
import { upload } from "@vercel/blob/client";
import { resizeImageFile } from "@/lib/imageResize";

// Cesta v úložišti musí být unikátní, ať se stejně pojmenované soubory
// nepřepisují. Schválně mimo komponentu — volání Date.now() přímo v jejím
// těle hlídá lint jako nečistou funkci.
function cestaProFotku(jmenoSouboru: string): string {
  const bezpecne = jmenoSouboru.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `poukazy/${Date.now()}-${bezpecne}`;
}

type EditorTab = "pobyty" | "clanky" | "lekce";
type Section =
  | "overview"
  | "editor"
  | "objednavky"
  | "newsletter"
  | "cekaci-listina"
  | "darkove-poukazy"
  | "statistiky"
  | "nastaveni";
type PoptavkaFilter = "vse" | "nezaplacene" | "objednavky" | "dotazy";
type PendingDelete = {
  kind:
    | "pobyty"
    | "clanky"
    | "lekce"
    | "poptavky"
    | "newsletter"
    | "cekaci-listina"
    | "darkove-poukazy"
    | "poukazy-nabidka";
  id: number;
  label: string;
};

function IconGrid({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function IconEdit({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconInbox({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function IconGift({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </svg>
  );
}

function IconGear({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

const NAV: { key: Section; label: string; icon: (p: { className?: string }) => ReactElement }[] = [
  { key: "overview", label: "Overview", icon: IconGrid },
  { key: "editor", label: "Editor", icon: IconEdit },
  { key: "objednavky", label: "Objednávky", icon: IconInbox },
  { key: "newsletter", label: "Newsletter", icon: IconMail },
  { key: "cekaci-listina", label: "Čekací listina", icon: IconClock },
  { key: "darkove-poukazy", label: "Dárkové poukazy", icon: IconGift },
  { key: "statistiky", label: "Statistiky", icon: IconChart },
  { key: "nastaveni", label: "Nastavení", icon: IconGear },
];

export default function AdminDashboard({
  configured,
  pobyty,
  clanky,
  lekce,
  poptavky,
  newsletter,
  cekaciListina,
  darkovePoukazy,
  poukazyCerpani,
  poukazyNabidka,
  nastaveni,
  email,
}: {
  configured: boolean;
  pobyty: Pobyt[];
  clanky: Clanek[];
  lekce: Lekce[];
  poptavky: Poptavka[];
  newsletter: NewsletterSignup[];
  cekaciListina: CekaciListina[];
  darkovePoukazy: DarkovyPoukaz[];
  poukazyCerpani: PoukazCerpani[];
  poukazyNabidka: PoukazNabidka[];
  nastaveni: Nastaveni;
  email: StavOdesilani;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [editorTab, setEditorTab] = useState<EditorTab>("pobyty");
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [poptavkaFilter, setPoptavkaFilter] = useState<PoptavkaFilter>("vse");
  // Ruční odečet z poukazu — pole se drží zvlášť pro každý poukaz, ať se
  // rozepsaná částka neztratí při rozkliknutí jiného.
  const [castkaOdectu, setCastkaOdectu] = useState<Record<number, string>>({});
  const [popisOdectu, setPopisOdectu] = useState<Record<number, string>>({});
  const [chybaOdectu, setChybaOdectu] = useState<Record<number, string>>({});
  const [novaHodnota, setNovaHodnota] = useState<Record<number, string>>({});
  const [otevrenaHistorie, setOtevrenaHistorie] = useState<number | null>(null);
  // Vystavení poukazu z administrace — hotovost, dárek, výhra v soutěži.
  const [novyPoukazOtevren, setNovyPoukazOtevren] = useState(false);
  const [novyPoukaz, setNovyPoukaz] = useState({
    hodnota: "",
    jmeno_kupujici: "",
    email_kupujici: "",
    telefon_kupujici: "",
    jmeno_obdarovane: "",
    vzkaz: "",
    fotka: "",
    zaplaceno: true,
  });
  const [novyPoukazChyba, setNovyPoukazChyba] = useState<string | null>(null);
  const [nahravamFotku, setNahravamFotku] = useState(false);

  async function nahratFotkuPoukazu(soubor: File): Promise<string | null> {
    setNahravamFotku(true);
    try {
      const zmenseny = await resizeImageFile(soubor);
      const blob = await upload(cestaProFotku(zmenseny.name), zmenseny, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      return blob.url;
    } catch {
      return null;
    } finally {
      setNahravamFotku(false);
    }
  }

  async function zalozitPoukaz() {
    setNovyPoukazChyba(null);
    setBusy(true);
    const res = await fetch("/api/admin/darkove-poukazy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        akce: "zalozit",
        ...novyPoukaz,
        hodnota_kc: Number(novyPoukaz.hodnota.replace(/\s/g, "")) || 0,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setNovyPoukazChyba(data.error ?? "Poukaz se nepodařilo vystavit.");
      return;
    }
    setNovyPoukazOtevren(false);
    setNovyPoukaz({
      hodnota: "",
      jmeno_kupujici: "",
      email_kupujici: "",
      telefon_kupujici: "",
      jmeno_obdarovane: "",
      vzkaz: "",
      fotka: "",
      zaplaceno: true,
    });
    router.refresh();
  }

  // Doplnění grafiky k poukazu, který si někdo koupil přes web.
  // Oprava hodnoty, když se platba na účtu rozejde s tím, co zákaznice
  // v objednávce zaklikla.
  async function zmenitHodnotuPoukazu(poukazId: number) {
    const castka = Math.round(Number((novaHodnota[poukazId] ?? "").replace(/\s/g, "")));
    if (!castka) return;
    setBusy(true);
    const res = await fetch("/api/admin/darkove-poukazy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: poukazId, hodnota_kc: castka }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setChybaOdectu({ ...chybaOdectu, [poukazId]: data.error ?? "Změna se nepovedla." });
      return;
    }
    setNovaHodnota({ ...novaHodnota, [poukazId]: "" });
    router.refresh();
  }

  async function doplnitFotkuPoukazu(poukazId: number, soubor: File) {
    const url = await nahratFotkuPoukazu(soubor);
    if (!url) return;
    setBusy(true);
    await fetch("/api/admin/darkove-poukazy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: poukazId, fotka: url }),
    });
    setBusy(false);
    router.refresh();
  }

  const cerpaniPoukazu = (poukazId: number) =>
    poukazyCerpani.filter((c) => c.poukaz_id === poukazId);

  // Poukaz platí celý poslední den, proto se porovnává jen datum.
  function jePoukazPropadly(p: DarkovyPoukaz): boolean {
    if (!p.plati_do) return false;
    const dnes = new Date();
    return new Date(p.plati_do) < new Date(dnes.getFullYear(), dnes.getMonth(), dnes.getDate());
  }
  const [vybranePobyty, setVybranePobyty] = useState<Set<number>>(new Set());
  const [vybraneClanky, setVybraneClanky] = useState<Set<number>>(new Set());

  async function confirmRemove() {
    if (!pendingDelete) return;
    const { kind, id } = pendingDelete;
    setBusy(true);
    await fetch(`/api/admin/${kind}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    setPendingDelete(null);
    router.refresh();
  }

  async function togglePobyt(p: Pobyt) {
    setBusy(true);
    await fetch("/api/admin/pobyty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        nadpis: p.nadpis,
        misto: p.misto,
        termin: p.termin,
        popis: p.popis,
        cena: p.cena,
        fotky: p.fotky,
        cislo_uctu: p.cislo_uctu,
        variabilni_symbol: p.variabilni_symbol,
        platebni_pokyny: p.platebni_pokyny,
        zverejneno: !p.zverejneno,
        vyprodano: p.vyprodano,
        pripravuje_se: p.pripravuje_se,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  async function toggleVyprodano(p: Pobyt) {
    setBusy(true);
    await fetch("/api/admin/pobyty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        nadpis: p.nadpis,
        misto: p.misto,
        termin: p.termin,
        popis: p.popis,
        cena: p.cena,
        fotky: p.fotky,
        cislo_uctu: p.cislo_uctu,
        variabilni_symbol: p.variabilni_symbol,
        platebni_pokyny: p.platebni_pokyny,
        zverejneno: p.zverejneno,
        vyprodano: !p.vyprodano,
        pripravuje_se: p.pripravuje_se,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  async function togglePripravujeSe(p: Pobyt) {
    setBusy(true);
    await fetch("/api/admin/pobyty", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        nadpis: p.nadpis,
        misto: p.misto,
        termin: p.termin,
        popis: p.popis,
        cena: p.cena,
        fotky: p.fotky,
        cislo_uctu: p.cislo_uctu,
        variabilni_symbol: p.variabilni_symbol,
        platebni_pokyny: p.platebni_pokyny,
        zverejneno: p.zverejneno,
        vyprodano: p.vyprodano,
        pripravuje_se: !p.pripravuje_se,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  async function duplikovatPobyt(p: Pobyt) {
    setBusy(true);
    await fetch("/api/admin/pobyty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nadpis: `${p.nadpis} (kopie)`,
        misto: p.misto,
        termin: p.termin,
        popis: p.popis,
        cena: p.cena,
        fotky: p.fotky,
        cislo_uctu: p.cislo_uctu,
        variabilni_symbol: p.variabilni_symbol,
        platebni_pokyny: p.platebni_pokyny,
        zverejneno: false,
        vyprodano: p.vyprodano,
        pripravuje_se: p.pripravuje_se,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  async function toggleLekce(l: Lekce) {
    setBusy(true);
    await fetch("/api/admin/lekce", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: l.id,
        den: l.den,
        misto: l.misto,
        cas: l.cas,
        poznamka: l.poznamka,
        zverejneno: !l.zverejneno,
      }),
    });
    setBusy(false);
    router.refresh();
  }

  function toggleVyber(set: Set<number>, setSet: (s: Set<number>) => void, id: number) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSet(next);
  }

  async function hromadnaAkcePobyty(akce: "zverejnit" | "skryt" | "smazat") {
    setBusy(true);
    const cilove = pobyty.filter((p) => vybranePobyty.has(p.id));
    if (akce === "smazat") {
      await Promise.all(
        cilove.map((p) =>
          fetch("/api/admin/pobyty", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: p.id }),
          })
        )
      );
    } else {
      await Promise.all(
        cilove.map((p) =>
          fetch("/api/admin/pobyty", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: p.id,
              nadpis: p.nadpis,
              misto: p.misto,
              termin: p.termin,
              popis: p.popis,
              cena: p.cena,
              fotky: p.fotky,
              cislo_uctu: p.cislo_uctu,
              variabilni_symbol: p.variabilni_symbol,
              platebni_pokyny: p.platebni_pokyny,
              zverejneno: akce === "zverejnit",
              vyprodano: p.vyprodano,
              pripravuje_se: p.pripravuje_se,
            }),
          })
        )
      );
    }
    setBusy(false);
    setVybranePobyty(new Set());
    router.refresh();
  }

  async function hromadnaAkceClanky(akce: "zverejnit" | "skryt" | "smazat") {
    setBusy(true);
    const cilove = clanky.filter((c) => vybraneClanky.has(c.id));
    if (akce === "smazat") {
      await Promise.all(
        cilove.map((c) =>
          fetch("/api/admin/clanky", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: c.id }),
          })
        )
      );
    } else {
      await Promise.all(
        cilove.map((c) =>
          fetch("/api/admin/clanky", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: c.id,
              nadpis: c.nadpis,
              text: c.text,
              zverejneno: akce === "zverejnit",
            }),
          })
        )
      );
    }
    setBusy(false);
    setVybraneClanky(new Set());
    router.refresh();
  }

  function exportObjednavkyCsv() {
    const hlavicky = [
      "Datum",
      "Typ",
      "Jméno",
      "E-mail",
      "Telefon",
      "Pobyt",
      "Způsob platby",
      "Částka (Kč)",
      "Zaplaceno",
      "Přečteno",
      "Zpráva",
    ];
    const radky = poptavkyFiltrovane.map((q) => [
      new Date(q.created_at).toLocaleString("cs-CZ"),
      q.typ === "objednavka" ? "Objednávka" : "Dotaz",
      q.jmeno,
      q.email,
      q.telefon,
      q.pobyt_nadpis ?? "",
      q.zpusob_platby === "zaloha" ? "Záloha" : q.zpusob_platby === "cela" ? "Celá částka" : "",
      q.castka ? String(q.castka) : "",
      q.zaplaceno ? "Ano" : "Ne",
      q.precteno ? "Ano" : "Ne",
      q.zprava.replace(/\s+/g, " "),
    ]);
    const csv = [hlavicky, ...radky]
      .map((radek) => radek.map((bunka) => `"${String(bunka).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `objednavky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportNewsletterCsv() {
    const hlavicky = ["Datum přihlášení", "E-mail"];
    const radky = newsletter.map((n) => [new Date(n.created_at).toLocaleString("cs-CZ"), n.email]);
    const csv = [hlavicky, ...radky]
      .map((radek) => radek.map((bunka) => `"${String(bunka).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportCekaciListinaCsv() {
    const hlavicky = ["Datum", "Jméno", "E-mail", "Telefon", "Pobyt", "Zpráva"];
    const radky = cekaciListina.map((c) => [
      new Date(c.created_at).toLocaleString("cs-CZ"),
      c.jmeno,
      c.email,
      c.telefon,
      c.pobyt_nadpis ?? "",
      c.zprava.replace(/\s+/g, " "),
    ]);
    const csv = [hlavicky, ...radky]
      .map((radek) => radek.map((bunka) => `"${String(bunka).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cekaci-listina-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportDarkovePoukazyCsv() {
    const hlavicky = ["Datum", "Kód", "Hodnota", "Zůstatek (Kč)", "Platí do", "VS", "Kupující", "E-mail", "Telefon", "Obdarovaná", "Vzkaz", "Zaplaceno", "Vyčerpáno"];
    const radky = darkovePoukazy.map((p) => [
      new Date(p.created_at).toLocaleString("cs-CZ"),
      p.kod,
      p.hodnota,
      String(p.zustatek_kc),
      p.plati_do ? new Date(p.plati_do).toLocaleDateString("cs-CZ") : "",
      p.variabilni_symbol,
      p.jmeno_kupujici,
      p.email_kupujici,
      p.telefon_kupujici,
      p.jmeno_obdarovane,
      p.vzkaz.replace(/\s+/g, " "),
      p.zaplaceno ? "Ano" : "Ne",
      p.vyuzito ? "Ano" : "Ne",
    ]);
    const csv = [hlavicky, ...radky]
      .map((radek) => radek.map((bunka) => `"${String(bunka).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `darkove-poukazy-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function togglePoptavka(q: Poptavka) {
    setBusy(true);
    await fetch("/api/admin/poptavky", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: q.id, precteno: !q.precteno }),
    });
    setBusy(false);
    router.refresh();
  }

  async function odecistZPoukazu(p: DarkovyPoukaz) {
    const castka = Math.round(Number((castkaOdectu[p.id] ?? "").replace(/\s/g, "")));
    if (!castka || castka <= 0) return;
    setBusy(true);
    const res = await fetch("/api/admin/darkove-poukazy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        castka_kc: castka,
        popis: (popisOdectu[p.id] ?? "").trim(),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setChybaOdectu({ ...chybaOdectu, [p.id]: data.error ?? "Odečet se nepovedl." });
      setBusy(false);
      return;
    }
    setCastkaOdectu({ ...castkaOdectu, [p.id]: "" });
    setPopisOdectu({ ...popisOdectu, [p.id]: "" });
    setChybaOdectu({ ...chybaOdectu, [p.id]: "" });
    setBusy(false);
    router.refresh();
  }

  async function vratitCerpaniPoukazu(cerpaniId: number) {
    setBusy(true);
    await fetch("/api/admin/darkove-poukazy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cerpani_id: cerpaniId }),
    });
    setBusy(false);
    router.refresh();
  }

  async function togglePoukazZaplaceno(p: DarkovyPoukaz) {
    setBusy(true);
    await fetch("/api/admin/darkove-poukazy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, zaplaceno: !p.zaplaceno }),
    });
    setBusy(false);
    router.refresh();
  }

  async function togglePoukazVyuzito(p: DarkovyPoukaz) {
    setBusy(true);
    await fetch("/api/admin/darkove-poukazy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, vyuzito: !p.vyuzito }),
    });
    setBusy(false);
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const editorTabs: { key: EditorTab; label: string; count: number }[] = [
    { key: "pobyty", label: "Pobyty", count: pobyty.length },
    { key: "lekce", label: "Lekce", count: lekce.length },
    { key: "clanky", label: "Články", count: clanky.length },
  ];

  const pobytyZverejnene = pobyty.filter((p) => p.zverejneno).length;
  const clankyZverejnene = clanky.filter((c) => c.zverejneno).length;
  const lekceZverejnene = lekce.filter((l) => l.zverejneno).length;
  const objednavky = poptavky.filter((q) => q.typ === "objednavka");
  const zaplacene = objednavky.filter((q) => q.zaplaceno).length;
  const cekaNaPlatbu = objednavky.filter((q) => !q.zaplaceno).length;
  const dotazy = poptavky.filter((q) => q.typ === "dotaz").length;
  const nepreceteno = poptavky.filter((q) => !q.precteno).length;

  const stats: { section: Section; editorTab?: EditorTab; label: string; value: number; detail: string }[] = [
    {
      section: "editor",
      editorTab: "pobyty",
      label: "Pobyty",
      value: pobyty.length,
      detail: `${pobytyZverejnene} zveřejněných`,
    },
    {
      section: "editor",
      editorTab: "lekce",
      label: "Lekce",
      value: lekce.length,
      detail: `${lekceZverejnene} zveřejněných`,
    },
    {
      section: "editor",
      editorTab: "clanky",
      label: "Články",
      value: clanky.length,
      detail: `${clankyZverejnene} zveřejněných`,
    },
    {
      section: "objednavky",
      label: "Objednávky",
      value: poptavky.length,
      detail:
        nepreceteno > 0
          ? `${nepreceteno} nepřečtených`
          : cekaNaPlatbu > 0
            ? `${cekaNaPlatbu} čeká na platbu`
            : `${objednavky.length} objednávek · ${dotazy} dotazů`,
    },
    {
      section: "newsletter",
      label: "Newsletter",
      value: newsletter.length,
      detail: newsletter.length === 0 ? "zatím nikdo" : "přihlášených e-mailů",
    },
    {
      section: "cekaci-listina",
      label: "Čekací listina",
      value: cekaciListina.length,
      detail: cekaciListina.length === 0 ? "zatím nikdo" : "čeká na uvolněné místo",
    },
    {
      section: "darkove-poukazy",
      label: "Dárkové poukazy",
      value: darkovePoukazy.length,
      detail:
        darkovePoukazy.length === 0
          ? "zatím žádné"
          : `${darkovePoukazy.filter((p) => p.zaplaceno).length} zaplacených`,
    },
  ];

  const poptavkyFiltrovane = poptavky.filter((q) => {
    if (poptavkaFilter === "nezaplacene") return q.typ === "objednavka" && !q.zaplaceno;
    if (poptavkaFilter === "objednavky") return q.typ === "objednavka";
    if (poptavkaFilter === "dotazy") return q.typ === "dotaz";
    return true;
  });

  const poptavkaFiltry: { key: PoptavkaFilter; label: string; count: number }[] = [
    { key: "vse", label: "Vše", count: poptavky.length },
    { key: "nezaplacene", label: "Nezaplacené", count: cekaNaPlatbu },
    { key: "objednavky", label: "Objednávky", count: objednavky.length },
    { key: "dotazy", label: "Dotazy", count: dotazy },
  ];

  const nedavnaAktivita = poptavky.slice(0, 5);
  const sectionTitle = NAV.find((n) => n.key === section)?.label ?? "";

  const domenaDny = nastaveni.domena_expiruje
    ? Math.ceil(
        (new Date(nastaveni.domena_expiruje).getTime() - new Date().setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24)
      )
    : null;
  const domenaVyprsi = domenaDny !== null && domenaDny <= 30;

  return (
    <div className="flex min-h-screen bg-cream">
      {/* ── Postranní navigace ── */}
      <aside className="flex w-20 shrink-0 flex-col items-center justify-between border-r border-line bg-white py-6">
        <div className="flex flex-col items-center gap-8">
          <button onClick={() => setSection("overview")} className="relative h-11 w-16" aria-label="Overview">
            <Image src="/logo.png" alt="AURORA jóga" fill className="object-contain" priority />
          </button>
          <nav className="flex flex-col gap-2">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = section === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setSection(n.key)}
                  title={n.label}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    active ? "bg-gradient-aurora text-ink" : "text-muted hover:bg-sand hover:text-ink"
                  }`}
                >
                  <Icon />
                  {n.key === "nastaveni" && domenaVyprsi && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-d ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          onClick={logout}
          title="Odhlásit"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-sand hover:text-accent-d"
        >
          <IconLogout />
        </button>
      </aside>

      {/* ── Hlavní obsah ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Horní lišta */}
        <header className="border-b border-line bg-cream">
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Administrace</p>
              <h1 className="mt-1 font-serif text-2xl text-ink">{sectionTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
              >
                Zobrazit web
              </Link>
              <button
                onClick={() => setSection("objednavky")}
                title="Objednávky"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <IconBell />
                {nepreceteno > 0 && (
                  <span className="bg-gradient-aurora absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium text-ink ring-2 ring-cream">
                    {nepreceteno}
                  </span>
                )}
              </button>
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-line">
                <Image src="/logo.png" alt="AURORA jóga" fill className="object-contain p-1" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-8 py-8">
          {!configured && (
            <div className="mb-8 rounded-2xl border border-accent/40 bg-white p-6 text-sm text-ink shadow-sm">
              <p className="font-medium">Úložiště zatím není připojené — čísla níže proto ukazují 0.</p>
              <p className="mt-2 text-muted">
                Ve Vercelu otevři projekt → záložka <strong>Storage</strong> →{" "}
                <strong>Create Database → Postgres</strong> (texty) a{" "}
                <strong>Create → Blob</strong> (fotky). Potom se sem vrať — vše začne fungovat samo
                a uvidíš skutečné počty.
              </p>
            </div>
          )}

          {domenaVyprsi && domenaDny !== null && (
            <div className="mb-8 rounded-2xl border border-accent-d/40 bg-white p-6 text-sm text-ink shadow-sm">
              <p className="font-medium text-accent-d">
                {domenaDny < 0
                  ? `Doména vypršela před ${Math.abs(domenaDny)} dny.`
                  : domenaDny === 0
                    ? "Doména vyprší dnes."
                    : `Doména vyprší za ${domenaDny} ${domenaDny === 1 ? "den" : domenaDny < 5 ? "dny" : "dní"}.`}
              </p>
              <p className="mt-2 text-muted">
                Nezapomeň ji obnovit na WEDOSu, ať web nevypadne. Datum si můžeš upravit v{" "}
                <button onClick={() => setSection("nastaveni")} className="underline underline-offset-2 hover:text-ink">
                  Nastavení
                </button>
                .
              </p>
            </div>
          )}

          {/* ── Overview ── */}
          {section === "overview" && (
            <div className="flex flex-col gap-8">
              {/* Sedm dlaždic — na xl se vejdou do jedné řady, níž se lámou po čtyřech. */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {stats.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setSection(s.section);
                      if (s.editorTab) setEditorTab(s.editorTab);
                    }}
                    className="rounded-2xl border border-line bg-white p-5 text-left shadow-sm transition-all hover:border-accent hover:shadow-md"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{s.label}</p>
                    <p className="mt-2 font-serif text-3xl text-ink">{s.value}</p>
                    <p className="mt-1 text-xs text-accent-d">{s.detail}</p>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="mb-4 text-xs uppercase tracking-[0.25em] text-accent">Poslední aktivita</p>
                {nedavnaAktivita.length === 0 ? (
                  <p className="text-sm text-muted">Zatím žádné objednávky ani dotazy.</p>
                ) : (
                  <ul className="flex flex-col divide-y divide-line">
                    {nedavnaAktivita.map((q) => (
                      <li key={q.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-ink">
                            {!q.precteno && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />}
                            <span className="font-medium">{q.jmeno}</span>
                            {q.pobyt_nadpis && <span className="text-muted"> → {q.pobyt_nadpis}</span>}
                          </p>
                          <p className="text-xs text-muted">
                            {new Date(q.created_at).toLocaleString("cs-CZ")}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                          {q.typ === "objednavka" ? (q.zaplaceno ? "Zaplaceno" : "Objednávka") : "Dotaz"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── Statistiky ── */}
          {section === "statistiky" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Pobyty</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-ink">
                  <div className="flex justify-between"><span className="text-muted">Celkem</span><span>{pobyty.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Zveřejněných</span><span>{pobytyZverejnene}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Skrytých</span><span>{pobyty.length - pobytyZverejnene}</span></div>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Články</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-ink">
                  <div className="flex justify-between"><span className="text-muted">Celkem</span><span>{clanky.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Zveřejněných</span><span>{clankyZverejnene}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Skrytých</span><span>{clanky.length - clankyZverejnene}</span></div>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Lekce</p>
                <div className="mt-4 flex flex-col gap-2 text-sm text-ink">
                  <div className="flex justify-between"><span className="text-muted">Celkem</span><span>{lekce.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Zveřejněných</span><span>{lekceZverejnene}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Skrytých</span><span>{lekce.length - lekceZverejnene}</span></div>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.25em] text-accent">Objednávky a dotazy</p>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-ink sm:grid-cols-3">
                  <div className="flex justify-between"><span className="text-muted">Celkem</span><span>{poptavky.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Nepřečtených</span><span>{nepreceteno}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Dotazů</span><span>{dotazy}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Objednávek</span><span>{objednavky.length}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Zaplacených</span><span>{zaplacene}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Čeká na platbu</span><span>{cekaNaPlatbu}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ── Nastavení ── */}
          {section === "nastaveni" && (
            <div className="max-w-3xl">
              <NastaveniForm initial={nastaveni} email={email} />
            </div>
          )}

          {/* ── Editor ── */}
          {section === "editor" && (
            <div>
              <div className="mb-8 flex gap-2 border-b border-line pb-px">
                {editorTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setEditorTab(t.key)}
                    className={`relative px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
                      editorTab === t.key ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {t.label}
                    <span className={`ml-1.5 ${editorTab === t.key ? "text-accent" : "text-muted/70"}`}>
                      {t.count}
                    </span>
                    {editorTab === t.key && (
                      <span className="bg-gradient-aurora absolute inset-x-0 -bottom-px h-[2px] rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* ── Pobyty ── */}
              {editorTab === "pobyty" && (
                <section>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/admin/pobyt/novy"
                      className="bg-gradient-aurora inline-block rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      + Přidat pobyt
                    </Link>
                    {vybranePobyty.size > 0 && (
                      <div className="flex flex-wrap items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-4 pr-1.5">
                        <span className="text-xs text-muted">Vybráno: {vybranePobyty.size}</span>
                        <button
                          disabled={busy}
                          onClick={() => hromadnaAkcePobyty("zverejnit")}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-ink transition-colors hover:bg-sand"
                        >
                          Zveřejnit
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => hromadnaAkcePobyty("skryt")}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-ink transition-colors hover:bg-sand"
                        >
                          Skrýt
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => hromadnaAkcePobyty("smazat")}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-accent-d transition-colors hover:bg-accent-d/5"
                        >
                          Smazat
                        </button>
                        <button
                          onClick={() => setVybranePobyty(new Set())}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-muted transition-colors hover:bg-sand"
                        >
                          Zrušit výběr
                        </button>
                      </div>
                    )}
                  </div>
                  {pobyty.length === 0 ? (
                    <p className="text-sm text-muted">Zatím žádné pobyty. Přidej první!</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {pobyty.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <input
                              type="checkbox"
                              checked={vybranePobyty.has(p.id)}
                              onChange={() => toggleVyber(vybranePobyty, setVybranePobyty, p.id)}
                              className="h-4 w-4 shrink-0 accent-accent-d"
                              aria-label={`Vybrat ${p.nadpis}`}
                            />
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 truncate font-serif text-lg text-ink">
                                {p.nadpis}
                                {!p.zverejneno && (
                                  <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                                    Skrytý
                                  </span>
                                )}
                                {p.vyprodano && (
                                  <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
                                    Vyprodáno
                                  </span>
                                )}
                                {p.pripravuje_se && (
                                  <span className="shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
                                    Připravujeme
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted">
                                {[p.misto, p.termin, p.cena].filter(Boolean).join(" · ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              disabled={busy}
                              onClick={() => togglePobyt(p)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              {p.zverejneno ? "Skrýt" : "Zobrazit"}
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => toggleVyprodano(p)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              {p.vyprodano ? "Zrušit vyprodání" : "Označit vyprodáno"}
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => togglePripravujeSe(p)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              {p.pripravuje_se ? "Zrušit připravujeme" : "Označit připravujeme"}
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => duplikovatPobyt(p)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              Duplikovat
                            </button>
                            <Link
                              href={`/admin/pobyt/${p.id}`}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              Upravit
                            </Link>
                            <button
                              disabled={busy}
                              onClick={() => setPendingDelete({ kind: "pobyty", id: p.id, label: p.nadpis })}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                            >
                              Smazat
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {/* ── Lekce ── */}
              {editorTab === "lekce" && (
                <section>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/admin/lekce/nova"
                      className="bg-gradient-aurora inline-block rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      + Přidat lekci
                    </Link>
                    <p className="text-xs text-muted">
                      Lekce se na stránce řadí samy podle dne v týdnu.
                    </p>
                  </div>
                  {lekce.length === 0 ? (
                    <div className="rounded-2xl border border-line bg-white p-5 text-sm text-muted shadow-sm">
                      <p className="font-medium text-ink">
                        Zatím tu žádné lekce nejsou — na webu běží výchozí rozvrh.
                      </p>
                      <p className="mt-2">
                        Na stránce{" "}
                        <Link href="/lekce" className="underline underline-offset-2 hover:text-ink">
                          Lekce
                        </Link>{" "}
                        se teď ukazují termíny zapsané napevno v kódu (úterý Maršovice,
                        středa Svratka, čtvrtek Sněžné). Jakmile tady přidáš první lekci,
                        výchozí rozvrh se přestane používat a web se bude řídit jen tímhle
                        seznamem.
                      </p>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {lekce.map((l) => (
                        <li
                          key={l.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 truncate font-serif text-lg text-ink">
                              {l.den} — {l.misto}
                              {!l.zverejneno && (
                                <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                                  Skrytá
                                </span>
                              )}
                            </p>
                            <p className="mt-1 truncate text-xs text-muted">
                              {[l.cas, l.poznamka].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <button
                              disabled={busy}
                              onClick={() => toggleLekce(l)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              {l.zverejneno ? "Skrýt" : "Zobrazit"}
                            </button>
                            <Link
                              href={`/admin/lekce/${l.id}`}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              Upravit
                            </Link>
                            <button
                              disabled={busy}
                              onClick={() =>
                                setPendingDelete({
                                  kind: "lekce",
                                  id: l.id,
                                  label: `${l.den} — ${l.misto}`,
                                })
                              }
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                            >
                              Smazat
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {/* ── Články ── */}
              {editorTab === "clanky" && (
                <section>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/admin/clanek/novy"
                      className="bg-gradient-aurora inline-block rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em] text-ink shadow-sm transition-all hover:opacity-90 hover:shadow-md"
                    >
                      + Napsat článek
                    </Link>
                    {vybraneClanky.size > 0 && (
                      <div className="flex flex-wrap items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-4 pr-1.5">
                        <span className="text-xs text-muted">Vybráno: {vybraneClanky.size}</span>
                        <button
                          disabled={busy}
                          onClick={() => hromadnaAkceClanky("zverejnit")}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-ink transition-colors hover:bg-sand"
                        >
                          Zveřejnit
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => hromadnaAkceClanky("skryt")}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-ink transition-colors hover:bg-sand"
                        >
                          Skrýt
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => hromadnaAkceClanky("smazat")}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-accent-d transition-colors hover:bg-accent-d/5"
                        >
                          Smazat
                        </button>
                        <button
                          onClick={() => setVybraneClanky(new Set())}
                          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-muted transition-colors hover:bg-sand"
                        >
                          Zrušit výběr
                        </button>
                      </div>
                    )}
                  </div>
                  {clanky.length === 0 ? (
                    <p className="text-sm text-muted">Zatím žádné články. Napiš první!</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {clanky.map((c) => (
                        <li
                          key={c.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <input
                              type="checkbox"
                              checked={vybraneClanky.has(c.id)}
                              onChange={() => toggleVyber(vybraneClanky, setVybraneClanky, c.id)}
                              className="h-4 w-4 shrink-0 accent-accent-d"
                              aria-label={`Vybrat ${c.nadpis}`}
                            />
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 truncate font-serif text-lg text-ink">
                                {c.nadpis}
                                {!c.zverejneno && (
                                  <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                                    Skrytý
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {new Date(c.created_at).toLocaleDateString("cs-CZ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Link
                              href={`/admin/clanek/${c.id}`}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              Upravit
                            </Link>
                            <button
                              disabled={busy}
                              onClick={() => setPendingDelete({ kind: "clanky", id: c.id, label: c.nadpis })}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                            >
                              Smazat
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}
            </div>
          )}

          {/* ── Objednávky ── */}
          {section === "objednavky" && (
            <section>
              {poptavky.length === 0 ? (
                <p className="text-sm text-muted">
                  Zatím žádné objednávky ani dotazy. Jakmile někdo klikne na „Závazně objednat“
                  nebo „Mám dotaz“ u pobytu, objeví se tady (a přijde ti e-mail).
                </p>
              ) : (
                <>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {poptavkaFiltry.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setPoptavkaFilter(f.key)}
                          className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                            poptavkaFilter === f.key
                              ? "bg-gradient-aurora text-ink"
                              : "border border-line text-muted hover:border-accent hover:text-accent"
                          }`}
                        >
                          {f.label} ({f.count})
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={exportObjednavkyCsv}
                      className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      Export do CSV
                    </button>
                  </div>

                  {poptavkyFiltrovane.length === 0 ? (
                    <p className="text-sm text-muted">Žádné objednávky v tomto filtru.</p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {poptavkyFiltrovane.map((q) => (
                        <li
                          key={q.id}
                          className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
                            q.precteno ? "border-line" : "border-accent/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                                {!q.precteno && (
                                  <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Nepřečteno" />
                                )}
                                {q.jmeno}
                                {q.pobyt_nadpis && (
                                  <span className="text-xs text-accent">→ {q.pobyt_nadpis}</span>
                                )}
                                {q.typ === "objednavka" ? (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                                      q.zaplaceno
                                        ? "bg-accent/20 text-accent-d"
                                        : "bg-line text-muted"
                                    }`}
                                  >
                                    {q.zaplaceno ? "Zaplaceno" : "Objednávka"}
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                                    Dotaz
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {new Date(q.created_at).toLocaleString("cs-CZ")}
                              </p>
                              {/* Co si zákaznice zvolila — u zálohy je hned
                                  vidět, že se ještě čeká na doplatek. */}
                              {q.typ === "objednavka" && q.castka > 0 && (
                                <p className="mt-1 text-xs text-ink">
                                  {q.zpusob_platby === "zaloha" ? "Záloha" : "Celá částka"}:{" "}
                                  {formatKc(q.castka)}
                                </p>
                              )}
                              <p className="mt-2 text-sm text-ink">
                                <a href={`mailto:${q.email}`} className="underline underline-offset-2 hover:text-accent-d">
                                  {q.email}
                                </a>
                                {q.telefon && (
                                  <>
                                    {" · "}
                                    <a href={`tel:${q.telefon}`} className="underline underline-offset-2 hover:text-accent-d">
                                      {q.telefon}
                                    </a>
                                  </>
                                )}
                              </p>
                              {q.zprava && <p className="mt-2 text-sm text-muted">{q.zprava}</p>}
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <button
                                disabled={busy}
                                onClick={() => setPendingDelete({ kind: "poptavky", id: q.id, label: `objednávka od ${q.jmeno}` })}
                                className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                              >
                                Smazat
                              </button>
                              <button
                                disabled={busy}
                                onClick={() => togglePoptavka(q)}
                                className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                              >
                                {q.precteno ? "Označit jako nové" : "Označit jako přečtené"}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          )}

          {/* ── Newsletter ── */}
          {section === "newsletter" && (
            <section>
              {newsletter.length === 0 ? (
                <p className="text-sm text-muted">
                  Zatím žádné přihlášené e-maily. Jakmile se někdo přihlásí k odběru na webu,
                  objeví se tady.
                </p>
              ) : (
                <>
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={exportNewsletterCsv}
                      className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      Export do CSV
                    </button>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {newsletter.map((n) => (
                      <li
                        key={n.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="min-w-0">
                          <a href={`mailto:${n.email}`} className="text-sm text-ink underline underline-offset-2 hover:text-accent-d">
                            {n.email}
                          </a>
                          <p className="mt-1 text-xs text-muted">
                            {new Date(n.created_at).toLocaleString("cs-CZ")}
                          </p>
                        </div>
                        <button
                          disabled={busy}
                          onClick={() => setPendingDelete({ kind: "newsletter", id: n.id, label: n.email })}
                          className="shrink-0 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                        >
                          Smazat
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {/* ── Čekací listina ── */}
          {section === "cekaci-listina" && (
            <section>
              {cekaciListina.length === 0 ? (
                <p className="text-sm text-muted">
                  Zatím se nikdo nepřihlásil na čekací listinu. Objeví se tady, jakmile někdo
                  projeví zájem o vyprodaný pobyt.
                </p>
              ) : (
                <>
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={exportCekaciListinaCsv}
                      className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      Export do CSV
                    </button>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {cekaciListina.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                              {c.jmeno}
                              {c.pobyt_nadpis && <span className="text-xs text-accent">→ {c.pobyt_nadpis}</span>}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {new Date(c.created_at).toLocaleString("cs-CZ")}
                            </p>
                            <p className="mt-2 text-sm text-ink">
                              <a href={`mailto:${c.email}`} className="underline underline-offset-2 hover:text-accent-d">
                                {c.email}
                              </a>
                              {c.telefon && (
                                <>
                                  {" · "}
                                  <a href={`tel:${c.telefon}`} className="underline underline-offset-2 hover:text-accent-d">
                                    {c.telefon}
                                  </a>
                                </>
                              )}
                            </p>
                            {c.zprava && <p className="mt-2 text-sm text-muted">{c.zprava}</p>}
                          </div>
                          <button
                            disabled={busy}
                            onClick={() => setPendingDelete({ kind: "cekaci-listina", id: c.id, label: `${c.jmeno} (čekací listina)` })}
                            className="shrink-0 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                          >
                            Smazat
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {/* ── Dárkové poukazy ── */}
          {section === "darkove-poukazy" && (
            <section>
              {/* Poukazy vystavené na web — z nich si zákaznice vybírá. */}
              <div className="mb-10">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl text-ink">Poukazy na webu</p>
                    <p className="mt-1 text-xs text-muted">
                      Co si návštěvnice můžou koupit na stránce s dárkovými poukazy.
                    </p>
                  </div>
                  <Link
                    href="/admin/poukaz/novy"
                    className="rounded-full bg-gradient-aurora px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90"
                  >
                    + Přidat poukaz
                  </Link>
                </div>

                {poukazyNabidka.length === 0 ? (
                  <p className="rounded-2xl border border-line bg-white p-5 text-sm text-muted">
                    Zatím tu žádný poukaz není, takže se na webu nedá nic koupit. Přidej první
                    tlačítkem nahoře.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {poukazyNabidka.map((n) => (
                      <li
                        key={n.id}
                        className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm"
                      >
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                          {n.fotka ? (
                            <Image src={n.fotka} alt={n.nadpis} fill className="object-cover" sizes="96px" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center font-allura text-xl text-accent/60">
                              Aurora
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                            {n.nadpis}
                            {!n.zverejneno && (
                              <span className="rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                                Skryté
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {n.castky.map((c) => formatKc(c.hodnota_kc)).join(" · ") || "žádné částky"}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Link
                            href={`/admin/poukaz/${n.id}`}
                            className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                          >
                            Upravit
                          </Link>
                          <button
                            disabled={busy}
                            onClick={() =>
                              setPendingDelete({ kind: "poukazy-nabidka", id: n.id, label: n.nadpis })
                            }
                            className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                          >
                            Smazat
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-xl text-ink">Prodané poukazy</p>
                  <p className="mt-1 text-xs text-muted">
                    Konkrétní kódy, jejich zůstatek a platnost.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNovyPoukazOtevren(!novyPoukazOtevren);
                    setNovyPoukazChyba(null);
                  }}
                  className="rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {novyPoukazOtevren ? "Zavřít" : "Vystavit ručně"}
                </button>
              </div>

              {novyPoukazOtevren && (
                <div className="mb-8 flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-accent">
                      Vystavit poukaz ručně
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Pro poukazy, které neprošly webem — hotovost, dárek, výhra. Kód se vygeneruje
                      sám a poukaz se objeví v seznamu níž.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                      Hodnota v Kč *
                      <input
                        value={novyPoukaz.hodnota}
                        onChange={(e) =>
                          setNovyPoukaz({ ...novyPoukaz, hodnota: e.target.value.replace(/[^0-9]/g, "") })
                        }
                        inputMode="numeric"
                        placeholder="Např. 2000"
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                      E-mail, kam poslat kód *
                      <input
                        value={novyPoukaz.email_kupujici}
                        onChange={(e) => setNovyPoukaz({ ...novyPoukaz, email_kupujici: e.target.value })}
                        type="email"
                        placeholder="jana@email.cz"
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                      Komu poukaz patří
                      <input
                        value={novyPoukaz.jmeno_kupujici}
                        onChange={(e) => setNovyPoukaz({ ...novyPoukaz, jmeno_kupujici: e.target.value })}
                        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent"
                      />
                    </label>
                  </div>

                  <label className="flex items-center gap-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={novyPoukaz.zaplaceno}
                      onChange={(e) => setNovyPoukaz({ ...novyPoukaz, zaplaceno: e.target.checked })}
                      className="h-4 w-4 accent-[#F28D76]"
                    />
                    Poukaz je zaplacený — rovnou začne platit a kód odejde e-mailem
                  </label>

                  {novyPoukazChyba && <p className="text-sm text-accent-d">{novyPoukazChyba}</p>}

                  <div>
                    <button
                      onClick={zalozitPoukaz}
                      disabled={busy}
                      className="rounded-full bg-gradient-aurora px-8 py-3 text-xs uppercase tracking-[0.2em] text-ink transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      {busy ? "Vystavuji…" : "Vystavit poukaz"}
                    </button>
                  </div>
                </div>
              )}

              {darkovePoukazy.length === 0 ? (
                <p className="text-sm text-muted">
                  Zatím žádné dárkové poukazy. Objeví se tady, jakmile si někdo koupí poukaz na
                  webu — nebo jakmile nějaký vystavíš tlačítkem nahoře.
                </p>
              ) : (
                <>
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={exportDarkovePoukazyCsv}
                      className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      Export do CSV
                    </button>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {darkovePoukazy.map((p) => (
                      <li
                        key={p.id}
                        className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
                          p.zaplaceno ? "border-line" : "border-accent/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                              {p.kod}
                              <span className="text-xs text-accent">{p.hodnota}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                                  p.zaplaceno ? "bg-accent/20 text-accent-d" : "bg-line text-muted"
                                }`}
                              >
                                {p.zaplaceno ? "Zaplaceno" : "Čeká na platbu"}
                              </span>
                              {!p.zaplaceno && p.platba_ohlasena && (
                                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
                                  Zákaznice odeslala platbu
                                </span>
                              )}
                              {p.vyuzito && (
                                <span className="rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                                  Vyčerpáno
                                </span>
                              )}
                              {jePoukazPropadly(p) && (
                                <span className="rounded-full bg-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-d">
                                  Propadlý
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              {new Date(p.created_at).toLocaleString("cs-CZ")} · VS: {p.variabilni_symbol}
                            </p>
                            {/* Zůstatek a platnost — to hlavní, co klientka
                                potřebuje vidět, když se někdo ozve s kódem. */}
                            <p className="mt-2 text-sm text-ink">
                              Zůstatek:{" "}
                              <strong className="font-medium">{formatKc(p.zustatek_kc)}</strong>
                              {p.hodnota_kc > 0 && p.zustatek_kc !== p.hodnota_kc && (
                                <span className="text-muted"> z {formatKc(p.hodnota_kc)}</span>
                              )}
                              {p.plati_do && (
                                <span className="text-muted">
                                  {" · "}platí do {new Date(p.plati_do).toLocaleDateString("cs-CZ")}
                                </span>
                              )}
                              {!p.zaplaceno && (
                                <span className="text-muted">
                                  {" · "}platnost se rozeběhne po označení platby
                                </span>
                              )}
                            </p>
                            <p className="mt-2 text-sm text-ink">
                              Kupující: {p.jmeno_kupujici} ·{" "}
                              <a href={`mailto:${p.email_kupujici}`} className="underline underline-offset-2 hover:text-accent-d">
                                {p.email_kupujici}
                              </a>
                              {p.telefon_kupujici && (
                                <>
                                  {" · "}
                                  <a href={`tel:${p.telefon_kupujici}`} className="underline underline-offset-2 hover:text-accent-d">
                                    {p.telefon_kupujici}
                                  </a>
                                </>
                              )}
                            </p>
                            {p.jmeno_obdarovane && (
                              <p className="mt-1 text-sm text-muted">Pro: {p.jmeno_obdarovane}</p>
                            )}
                            {p.vzkaz && <p className="mt-2 text-sm text-muted">{p.vzkaz}</p>}

                            {/* Historie čerpání — kdy a na co poukaz šel. */}
                            {cerpaniPoukazu(p.id).length > 0 && (
                              <div className="mt-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOtevrenaHistorie(otevrenaHistorie === p.id ? null : p.id)
                                  }
                                  className="text-xs uppercase tracking-[0.15em] text-accent-d hover:underline"
                                >
                                  {otevrenaHistorie === p.id ? "Skrýt čerpání" : `Čerpání (${cerpaniPoukazu(p.id).length})`}
                                </button>
                                {otevrenaHistorie === p.id && (
                                  <ul className="mt-2 flex flex-col gap-1.5 border-l border-line pl-3">
                                    {cerpaniPoukazu(p.id).map((c) => (
                                      <li key={c.id} className="flex flex-wrap items-baseline gap-2 text-xs">
                                        <span className="text-muted">
                                          {new Date(c.created_at).toLocaleDateString("cs-CZ")}
                                        </span>
                                        <span className="text-ink">{formatKc(c.castka_kc)}</span>
                                        <span className="text-muted">{c.popis || "—"}</span>
                                        <button
                                          type="button"
                                          disabled={busy}
                                          onClick={() => vratitCerpaniPoukazu(c.id)}
                                          className="text-accent-d hover:underline"
                                        >
                                          vrátit
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}

                            {/* Dokud poukaz není zaplacený, jde hodnotu
                                opravit — platba na účtu se může rozejít
                                s tím, co zákaznice zaklikla. */}
                            {!p.zaplaceno && (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="text-xs uppercase tracking-[0.15em] text-muted">
                                  Opravit hodnotu
                                </span>
                                <input
                                  value={novaHodnota[p.id] ?? ""}
                                  onChange={(e) =>
                                    setNovaHodnota({
                                      ...novaHodnota,
                                      [p.id]: e.target.value.replace(/[^0-9]/g, ""),
                                    })
                                  }
                                  inputMode="numeric"
                                  placeholder={String(p.hodnota_kc)}
                                  className="w-28 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                                />
                                <button
                                  type="button"
                                  disabled={busy || !(novaHodnota[p.id] ?? "").trim()}
                                  onClick={() => zmenitHodnotuPoukazu(p.id)}
                                  className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                                >
                                  Uložit
                                </button>
                              </div>
                            )}

                            {/* Grafika poukazu — u koupených přes web ji jde
                                doplnit až tady. Do e-mailu s kódem se přiloží
                                při odeslání, takže má smysl doplnit ji dřív,
                                než poukaz označíš jako zaplacený. */}
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              {p.fotka ? (
                                <div className="relative h-16 w-24 overflow-hidden rounded-lg">
                                  <Image src={p.fotka} alt="Grafika poukazu" fill className="object-cover" sizes="96px" />
                                </div>
                              ) : null}
                              <label className="flex w-fit cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.15em] text-accent-d hover:underline">
                                {nahravamFotku
                                  ? "Nahrávám…"
                                  : p.fotka
                                    ? "Změnit grafiku"
                                    : "+ Přidat grafiku"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={busy || nahravamFotku}
                                  onChange={(e) => {
                                    const soubor = e.target.files?.[0];
                                    e.target.value = "";
                                    if (soubor) doplnitFotkuPoukazu(p.id, soubor);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Ruční odečet — pro to, co se neplatí přes web
                                (živá lekce a podobně). */}
                            {p.zaplaceno && p.zustatek_kc > 0 && (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <input
                                  value={castkaOdectu[p.id] ?? ""}
                                  onChange={(e) =>
                                    setCastkaOdectu({
                                      ...castkaOdectu,
                                      [p.id]: e.target.value.replace(/[^0-9]/g, ""),
                                    })
                                  }
                                  inputMode="numeric"
                                  placeholder="Odečíst Kč"
                                  className="w-28 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                                />
                                <input
                                  value={popisOdectu[p.id] ?? ""}
                                  onChange={(e) =>
                                    setPopisOdectu({ ...popisOdectu, [p.id]: e.target.value })
                                  }
                                  placeholder="Za co (např. lekce 4. 9.)"
                                  className="min-w-[12rem] flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                                />
                                <button
                                  type="button"
                                  disabled={busy || !(castkaOdectu[p.id] ?? "").trim()}
                                  onClick={() => odecistZPoukazu(p)}
                                  className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                                >
                                  Odečíst
                                </button>
                                {chybaOdectu[p.id] && (
                                  <p className="w-full text-xs text-accent-d">{chybaOdectu[p.id]}</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <button
                              disabled={busy}
                              onClick={() => setPendingDelete({ kind: "darkove-poukazy", id: p.id, label: p.kod })}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-accent-d transition-colors hover:border-accent-d hover:bg-accent-d/5"
                            >
                              Smazat
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => togglePoukazZaplaceno(p)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              {p.zaplaceno ? "Označit nezaplaceno" : "Označit zaplaceno"}
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => togglePoukazVyuzito(p)}
                              className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
                            >
                              {p.vyuzito ? "Zrušit využití" : "Označit využito"}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
        </div>
      </div>

      {/* ── Potvrzovací dialog ── */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="font-serif text-xl text-ink">Opravdu smazat?</p>
            <p className="mt-2 text-sm text-muted">
              Chystáš se smazat „{pendingDelete.label}“. Tuto akci nejde vzít zpět.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-line px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                Zrušit
              </button>
              <button
                disabled={busy}
                onClick={confirmRemove}
                className="rounded-full bg-accent-d px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Mažu…" : "Smazat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
