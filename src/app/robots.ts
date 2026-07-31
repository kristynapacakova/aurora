import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

// Roboti, kteří web prochází kvůli sběru trénovacích dat pro AI modely —
// ne kvůli běžnému vyhledávání. Google-Extended je oddělený od Googlebota
// (ten pro normální vyhledávání zůstává povolený), stejně tak Applebot-
// Extended je oddělený od Applebota pro Siri/Spotlight.
const AI_TRAINING_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Bytespider",
  "Applebot-Extended",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "FacebookBot",
  "Amazonbot",
  "YouBot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/studium", "/vstup"],
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
