import { Mail } from "lucide-react";
import { CONTACT, USCREEN } from "@/lib/config";

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-full border border-cream/20 p-2.5 text-cream/60 transition-colors hover:border-cream/60 hover:text-cream"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer id="kontakt" className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-serif text-3xl tracking-[0.1em]">AURORA</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              Online jógové studio pro každý den.
            </p>
          </div>

          {/* Navigace */}
          <div className="flex flex-col gap-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cream/40">
              Navigace
            </p>
            {[
              { href: "#o-mne", label: "O mně" },
              { href: "#studio", label: "Lekce" },
              { href: "#cenik", label: "Ceník" },
              {
                href: USCREEN.login,
                label: "Vstoupit do studia",
                external: true,
              },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="font-serif text-sm text-cream/70 transition-colors hover:text-cream"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Kontakt + sociální sítě */}
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-cream/40">
              Kontakt
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 text-sm text-cream/70 transition-colors hover:text-cream"
            >
              <Mail size={14} />
              {CONTACT.email}
            </a>

            <div className="mt-6 flex gap-3">
              {/* Instagram */}
              <SocialLink href={CONTACT.instagram} label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </SocialLink>

              {/* Facebook */}
              <SocialLink href={CONTACT.facebook} label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialLink>

              {/* YouTube */}
              <SocialLink href={CONTACT.youtube} label="YouTube">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-cream/10 pt-8 text-center text-xs text-cream/30">
          © {new Date().getFullYear()} AURORA jóga. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
