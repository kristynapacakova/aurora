import Image from "next/image";
import Script from "next/script";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { CONTACT, INSTAGRAM_WIDGET_URL } from "@/lib/config";

const GRID_PHOTOS = [
  { src: "/ig-1.jpg", position: "50% 15%" },
  { src: "/ig-2.jpg", position: "50% 50%" },
  { src: "/ig-3.jpg", position: "50% 20%" },
  { src: "/ig-4.jpg", position: "50% 50%" },
  { src: "/ig-5.jpg", position: "50% 12%" },
];

export default function InstagramFeed() {
  return (
    <section className="bg-cream relative pt-14 pb-14 sm:pt-16 sm:pb-16">
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
            {GRID_PHOTOS.map((photo, i) => (
              <a
                key={photo.src}
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={photo.src}
                  alt="Instagram"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  style={{ objectPosition: photo.position }}
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
