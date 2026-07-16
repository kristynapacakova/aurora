import Image from "next/image";
import Script from "next/script";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { CONTACT, INSTAGRAM_WIDGET_URL } from "@/lib/config";

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
  "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=500&q=80",
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
];

export default function InstagramFeed() {
  return (
    <section className="bg-cream relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      {/* Plynulé prolnutí z barvy předchozí sekce */}
      <div
        className="absolute inset-x-0 top-0 h-36"
        style={{ background: "linear-gradient(to bottom, #FBE9DE, transparent)" }}
      />
      <FadeUp>
        <p className="mb-8 text-center text-sm text-muted">
          {nbsp("Sleduj nás na Instagramu")}{" "}
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline underline-offset-4 hover:text-accent-d"
          >
            {CONTACT.instagramHandle}
          </a>
        </p>
      </FadeUp>

      <FadeUp delay={0.1}>
        {INSTAGRAM_WIDGET_URL ? (
          <>
            <iframe
              src={INSTAGRAM_WIDGET_URL}
              className="snapwidget-widget w-full border-none"
              style={{ overflow: "hidden" }}
              scrolling="no"
              title="Instagram feed"
            />
            <Script src="https://snapwidget.com/js/snapwidget.js" strategy="lazyOnload" />
          </>
        ) : (
          <div className="grid grid-cols-5">
            {FALLBACK_PHOTOS.map((src, i) => (
              <a
                key={src}
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={src}
                  alt="Instagram"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="20vw"
                  priority={i === 0}
                />
              </a>
            ))}
          </div>
        )}
      </FadeUp>

    </section>
  );
}
