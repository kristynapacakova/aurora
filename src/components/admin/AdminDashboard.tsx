"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactElement } from "react";
import type { Pobyt, Clanek, Poptavka, NewsletterSignup, Nastaveni } from "@/lib/db";
import NastaveniForm from "./NastaveniForm";

type EditorTab = "pobyty" | "clanky";
type Section = "overview" | "editor" | "objednavky" | "newsletter" | "statistiky" | "nastaveni";
type PoptavkaFilter = "vse" | "nezaplacene" | "objednavky" | "dotazy";
type PendingDelete = { kind: "pobyty" | "clanky" | "poptavky" | "newsletter"; id: number; label: string };

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
  { key: "statistiky", label: "Statistiky", icon: IconChart },
  { key: "nastaveni", label: "Nastavení", icon: IconGear },
];

export default function AdminDashboard({
  configured,
  pobyty,
  clanky,
  poptavky,
  newsletter,
  nastaveni,
}: {
  configured: boolean;
  pobyty: Pobyt[];
  clanky: Clanek[];
  poptavky: Poptavka[];
  newsletter: NewsletterSignup[];
  nastaveni: Nastaveni;
}) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [editorTab, setEditorTab] = useState<EditorTab>("pobyty");
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [poptavkaFilter, setPoptavkaFilter] = useState<PoptavkaFilter>("vse");
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
    const hlavicky = ["Datum", "Typ", "Jméno", "E-mail", "Telefon", "Pobyt", "Zaplaceno", "Přečteno", "Zpráva"];
    const radky = poptavkyFiltrovane.map((q) => [
      new Date(q.created_at).toLocaleString("cs-CZ"),
      q.typ === "objednavka" ? "Objednávka" : "Dotaz",
      q.jmeno,
      q.email,
      q.telefon,
      q.pobyt_nadpis ?? "",
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

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const editorTabs: { key: EditorTab; label: string; count: number }[] = [
    { key: "pobyty", label: "Pobyty", count: pobyty.length },
    { key: "clanky", label: "Články", count: clanky.length },
  ];

  const pobytyZverejnene = pobyty.filter((p) => p.zverejneno).length;
  const clankyZverejnene = clanky.filter((c) => c.zverejneno).length;
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <NastaveniForm initial={nastaveni} />
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
