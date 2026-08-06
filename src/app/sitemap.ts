import type { MetadataRoute } from "next";
import { getPobyty, getClanky } from "@/lib/db";
import { SITE_URL } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pobyty, clanky] = await Promise.all([getPobyty(true), getClanky(true)]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pobyty`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/darkovy-poukaz`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/obchodni-podminky`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/ochrana-osobnich-udaju`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const pobytyPages: MetadataRoute.Sitemap = pobyty.map((p) => ({
    url: `${SITE_URL}/pobyty/${p.id}`,
    lastModified: p.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const clankyPages: MetadataRoute.Sitemap = clanky.map((c) => ({
    url: `${SITE_URL}/blog/${c.slug}`,
    lastModified: c.created_at,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...pobytyPages, ...clankyPages];
}
