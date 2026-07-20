import Image from "next/image";
import Script from "next/script";
import FadeUp from "./FadeUp";
import { nbsp } from "@/lib/typo";
import { INSTAGRAM_WIDGET_URL } from "@/lib/config";
import { getNastaveni } from "@/lib/db";

const GRID_PHOTOS = [
  { src: "/ig-1.jpg" },
  { src: "/ig-2.jpg" },
  { src: "/ig-3.jpg" },
  { src: "/ig-4.jpg" },
  { src: "/ig-5.jpg" },
];

export default async function InstagramFeed() {
  const { instagram_url, instagram_handle } = await getNastaveni();

  return (
    <section className="bg-cream relative pt-14 pb-14 sm:pt-16 sm:pb-16">
      <FadeUp>
        <p className="font-allura mb-8 text-center text-2xl text-ink sm:text-3xl">
          {nbsp("Sleduj nás na Instagramu")}{" "}
          <a
            href={instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent-d"
          >
            {instagram_handle}
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
          <div className="grid w-full grid-cols-5">
            {GRID_PHOTOS.map((photo, i) => (
              <a
                key={photo.src}
                href={instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={photo.src}
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
