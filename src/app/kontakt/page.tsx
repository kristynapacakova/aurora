import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import KontaktForm from "@/components/KontaktForm";
import { IconSparkle } from "@/components/BrandIcons";
import { getNastaveni } from "@/lib/db";
import { nbsp } from "@/lib/typo";

export const metadata: Metadata = {
  title: "Kontakt | AURORA jóga",
  description: "Napiš mi — ráda zodpovím tvoje otázky k lekcím, členství i pobytům.",
};

export default async function KontaktPage() {
  const { kontakt_email, instagram_handle, instagram_url } = await getNastaveni();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream px-6 pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-2xl">
          <FadeUp>
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <IconSparkle size={12} />
                <p className="text-xs uppercase tracking-[0.3em] text-accent">Kontakt</p>
                <IconSparkle size={12} />
              </div>
              <h1 className="font-allura text-4xl text-ink sm:text-5xl">{nbsp("Ozvi se mi")}</h1>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
                {nbsp("Máš otázku k lekcím, členství nebo pobytům? Napiš mi přes formulář níž, nebo rovnou na e-mail — ozvu se ti co nejdřív.")}
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-sand/60 px-6 py-6 text-center text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">E-mail</p>
                <p className="mt-1 text-ink">{kontakt_email}</p>
              </div>
              {instagram_handle && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">Instagram</p>
                  <a
                    href={instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-ink underline underline-offset-4 hover:text-accent-d"
                  >
                    {instagram_handle}
                  </a>
                </div>
              )}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-8">
              <KontaktForm />
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
