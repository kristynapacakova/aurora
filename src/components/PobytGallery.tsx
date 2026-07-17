"use client";

import Image from "next/image";
import { useState } from "react";

export default function PobytGallery({
  fotky,
  alt,
  arch = "left",
  heightClass = "h-[320px] sm:h-[460px]",
}: {
  fotky: string[];
  alt: string;
  arch?: "left" | "right";
  heightClass?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const archClass = arch === "left" ? "photo-arch-left" : "photo-arch-right";

  if (fotky.length === 0) {
    return (
      <div className={`${archClass} flex w-full items-center justify-center bg-sand ${heightClass}`}>
        <span className="font-allura text-4xl text-accent/60">Aurora</span>
      </div>
    );
  }

  return (
    <div>
      {/* Hlavní fotka — po kliknutí na miniaturu se zde vymění */}
      <div className={`${archClass} relative w-full overflow-hidden bg-sand ${heightClass}`}>
        <Image
          key={fotky[activeIndex]}
          src={fotky[activeIndex]}
          alt={`${alt}${activeIndex > 0 ? ` — fotka ${activeIndex + 1}` : ""}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
          priority
        />
      </div>

      {fotky.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {fotky.map((url, i) => (
            <button
              key={url}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-xl ring-2 transition-all duration-200 ${
                i === activeIndex ? "ring-accent" : "ring-transparent hover:ring-accent/40"
              }`}
              aria-label={`Zobrazit fotku ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <Image
                src={url}
                alt={`${alt} — náhled ${i + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
