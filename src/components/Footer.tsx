import { IconHeart } from "./BrandIcons";

export default function Footer() {
  return (
    <footer id="kontakt" className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <p className="mb-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted">
          Jenmost · Klid · Ženskost · Autenticita · Světlo
          <IconHeart size={12} />
        </p>
        <p className="text-xs text-muted/70">
          © {new Date().getFullYear()} AURORA jóga, všechna práva vyhrazena.
        </p>
      </div>
    </footer>
  );
}
