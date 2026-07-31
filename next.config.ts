import type { NextConfig } from "next";

// Content-Security-Policy — omezuje, odkud smí web načítat skripty, obrázky,
// styly apod. 'unsafe-inline' u script/style zůstává, protože web používá
// inline style atributy (přechody v Hero sekci) a Next.js sám vkládá malé
// hydratační skripty do stránky — bez toho by web přestal fungovat. I tak
// CSP smysluplně omezí, na jaké cizí domény by mohl útočník something
// poslat, kdyby se mu podařilo prosadit vlastní skript.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://snapwidget.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.public.blob.vercel-storage.com https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://snapwidget.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Administrace a API vrací osobní údaje zákaznic (jména, e-maily, telefony,
// kódy poukazů…) — nesmí je ukládat do mezipaměti prohlížeče ani žádné
// mezilehlé proxy a nesmí skončit ve výsledcích vyhledávačů.
const NO_STORE_HEADERS = [
  { key: "Cache-Control", value: "no-store, must-revalidate" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/admin/:path*",
        headers: NO_STORE_HEADERS,
      },
      {
        source: "/api/:path*",
        headers: NO_STORE_HEADERS,
      },
    ];
  },
};

export default nextConfig;
