import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getClanekBySlug } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const clanek = await getClanekBySlug(slug);
  return {
    title: clanek ? `${clanek.nadpis} | AURORA jóga` : "Článek | AURORA jóga",
  };
}

export default async function ClanekPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const clanek = await getClanekBySlug(slug);
  if (!clanek || !clanek.zverejneno) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <article className="mx-auto max-w-2xl px-6 pb-24 pt-32 sm:pt-36">
          <Link href="/blog" className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
            ← Všechny články
          </Link>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-accent">
            {new Date(clanek.created_at).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.15] text-ink sm:text-5xl">
            {nbsp(clanek.nadpis)}
          </h1>

          <div className="mt-8 flex flex-col gap-5">
            {clanek.text.split(/\n\s*\n/).map((odst, i) => (
              <p key={i} className="text-base leading-relaxed text-muted">
                {nbsp(odst)}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
