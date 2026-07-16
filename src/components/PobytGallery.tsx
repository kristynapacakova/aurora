"use client";

import Image from "next/image";
import { useState } from "react";

export default function PobytGallery({ fotky, alt }: { fotky: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (fotky.length === 0) {
    return (
      <div className="photo-arch-left flex h-[320px] w-full items-center justify-center bg-sand sm:h-[420px]">
        <span className="font-allura text-4xl text-accent/60">Aurora</span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpenIndex(0)}
        className="photo-arch-left group relative block h-[320px] w-full overflow-hidden sm:h-[460px]"
      >
        <Image
          src={fotky[0]}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 700px"
          priority
        />
      </button>

      {fotky.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {fotky.slice(1).map((url, i) => (
            <button
              key={url}
              onClick={() => setOpenIndex(i + 1)}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={url}
                alt={`${alt} — fotka ${i + 2}`}
                fill
                className="object-cover transition-transform duration-200 hover:scale-105"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex(null);
            }}
            className="absolute right-5 top-5 text-3xl text-cream/90 hover:text-cream"
            aria-label="Zavřít"
          >
            ✕
          </button>

          {fotky.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => (i === null ? 0 : (i - 1 + fotky.length) % fotky.length));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-4xl text-cream/70 hover:text-cream sm:left-6"
                aria-label="Předchozí fotka"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => (i === null ? 0 : (i + 1) % fotky.length));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-4xl text-cream/70 hover:text-cream sm:right-6"
                aria-label="Další fotka"
              >
                ›
              </button>
            </>
          )}

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={fotky[openIndex]}
              alt={`${alt} — fotka ${openIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
