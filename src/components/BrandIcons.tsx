/* ─────────────────────────────────────────────────────────────
   Brand ikony Aurora Yoga
   Tenká linie (~1.3 px stroke), korálová/zlatá barva dle brand manuálu.
   ───────────────────────────────────────────────────────────── */

/** ✦ Dekorativní hvězdička / jiskra (brand accent) */
export function IconSparkle({ size = 16, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 0 C8 0 7.2 3.5 5.5 5.5 3.5 7.2 0 8 0 8 0 8 3.5 8.8 5.5 10.5 7.2 12.5 8 16 8 16 8 16 8.8 12.5 10.5 10.5 12.5 8.8 16 8 16 8 16 12.5 7.2 10.5 5.5 8.8 3.5 8 0Z" />
    </svg>
  );
}

/** ☀ Malé sluníčko s paprsky (brand dekorativní prvek) */
export function IconSun({ size = 20, className = "text-[#F4A36C]" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className={className}>
      <circle cx="12" cy="12" r="3.5" />
      <line x1="12" y1="2"   x2="12" y2="5"   />
      <line x1="12" y1="19"  x2="12" y2="22"  />
      <line x1="2"  y1="12"  x2="5"  y2="12"  />
      <line x1="19" y1="12"  x2="22" y2="12"  />
      <line x1="4.9" y1="4.9"   x2="7"    y2="7"    />
      <line x1="17"  y1="17"    x2="19.1"  y2="19.1" />
      <line x1="19.1" y1="4.9"  x2="17"    y2="7"    />
      <line x1="7"    y1="17"   x2="4.9"   y2="19.1" />
    </svg>
  );
}

/** ♡ Srdce (brand dekorativní prvek) */
export function IconHeart({ size = 16, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21C12 21 3 14.5 3 8.5A4.5 4.5 0 0 1 12 6.1 4.5 4.5 0 0 1 21 8.5C21 14.5 12 21 12 21Z" />
    </svg>
  );
}

/** 🌿 Větvička / botanický prvek */
export function IconLeafBranch({ size = 28, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 28 C16 28 16 10 16 6" />
      <path d="M16 20 C12 18 8 14 9 9 C11 8 15 10 16 14" />
      <path d="M16 14 C20 12 24 8 23 3 C21 2 17 4 16 8" />
    </svg>
  );
}

/* ─── Servisní ikony (web concept PDF) ─── */

/** Lekce — figura v meditační pozici */
export function IconLekce({ size = 38, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Hlava */}
      <circle cx="20" cy="7" r="3.5" />
      {/* Trup */}
      <path d="M20 10.5 L20 20" />
      {/* Zkřížené nohy (lotus) */}
      <path d="M20 20 C17 20 11 22 9 26" />
      <path d="M20 20 C23 20 29 22 31 26" />
      <path d="M9 26 C12 24 17 24 20 26 C23 24 28 24 31 26" />
      {/* Paže v namaste / rozložené */}
      <path d="M20 13 C16 11 12 12 10 15" />
      <path d="M20 13 C24 11 28 12 30 15" />
    </svg>
  );
}

/** Online studio — laptop */
export function IconStudio({ size = 38, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Obrazovka */}
      <rect x="6" y="7" width="28" height="19" rx="2" />
      {/* Figurka na obrazovce — jóga */}
      <circle cx="20" cy="13" r="2" />
      <path d="M20 15 L20 20 M17 17 C18.5 16 21.5 16 23 17 M20 20 C18 20 16 22 15 23 M20 20 C22 20 24 22 25 23" />
      {/* Podstavec */}
      <path d="M14 30 L26 30 M12 33 L28 33" />
      <path d="M6 26 L34 26" />
    </svg>
  );
}

/** Retreaty — lotosový květ / příroda */
export function IconRetreaty({ size = 38, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Prostřední lupínek */}
      <path d="M20 30 C20 30 20 18 20 14 C20 10 23 7 26 8 C26 12 24 17 20 20" />
      <path d="M20 30 C20 30 20 18 20 14 C20 10 17 7 14 8 C14 12 16 17 20 20" />
      {/* Boční lupínky */}
      <path d="M20 26 C16 25 11 22 10 17 C13 15 17 17 20 20" />
      <path d="M20 26 C24 25 29 22 30 17 C27 15 23 17 20 20" />
      {/* Stonek */}
      <path d="M20 30 L20 35" />
      <path d="M20 33 C18 32 16 31 15 30" />
    </svg>
  );
}

/** Akce pro ženy — skupina žen */
export function IconAkce({ size = 38, className = "text-accent" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Prostřední figura */}
      <circle cx="20" cy="9" r="3" />
      <path d="M20 12 L20 22 M16 15 C17.5 14 22.5 14 24 15 M20 22 L17 30 M20 22 L23 30" />
      {/* Levá figura */}
      <circle cx="10" cy="11" r="2.5" />
      <path d="M10 13.5 L10 22 M7 16 C8 15 12 15 13 16 M10 22 L8 29 M10 22 L12 29" />
      {/* Pravá figura */}
      <circle cx="30" cy="11" r="2.5" />
      <path d="M30 13.5 L30 22 M27 16 C28 15 32 15 33 16 M30 22 L28 29 M30 22 L32 29" />
    </svg>
  );
}
