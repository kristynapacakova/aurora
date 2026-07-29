import Link from "next/link";
import { getNastaveni } from "@/lib/db";

export default async function Footer() {
  const { kontakt_email } = await getNastaveni();

  return (
    <footer id="kontakt" className="bg-cream border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <p className="mb-3 flex items-center justify-center gap-4 text-xs text-muted/70">
          <Link href="/obchodni-podminky" className="underline-offset-4 hover:text-ink hover:underline">
            Obchodní podmínky
          </Link>
          <Link href="/ochrana-osobnich-udaju" className="underline-offset-4 hover:text-ink hover:underline">
            Ochrana osobních údajů
          </Link>
          {kontakt_email && (
            <a href={`mailto:${kontakt_email}`} className="underline-offset-4 hover:text-ink hover:underline">
              Kontakt
            </a>
          )}
        </p>
        <p className="text-xs text-muted/70">
          © {new Date().getFullYear()} AURORA jóga, všechna práva vyhrazena.
        </p>
      </div>
    </footer>
  );
}
