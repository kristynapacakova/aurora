import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { getClanky } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | AURORA jóga",
  description: "Články o józe, dechu a klidu mysli.",
};

function perex(text: string, max = 180): string {
  const plain = text.replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export default async function BlogPage() {
  const clanky = await getClanky(true);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <section className="px-6 pb-10 pt-32 text-center sm:pt-36">
          <FadeUp>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">Blog</p>
            <h1 className="font-allura text-4xl text-ink sm:text-5xl">
              Ze světa jógy a klidu
            </h1>
          </FadeUp>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-24">
          {clanky.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">
              {nbsp("Zatím tu žádný článek není — ale už brzy bude. 🌿")}
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {clanky.map((c) => (
                <FadeUp key={c.id}>
                  <Link
                    href={`/blog/${c.slug}`}
                    className="group block rounded-2xl border border-line bg-white/50 p-7 transition-all duration-200 hover:border-accent/60 hover:bg-white/80"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">
                      {new Date(c.created_at).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h2 className="mt-2 font-sans text-2xl font-medium text-ink">{nbsp(c.nadpis)}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{nbsp(perex(c.text))}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink transition-colors group-hover:text-accent">
                      Číst dál
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </FadeUp>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
