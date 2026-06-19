import type { Metadata } from "next";
import { Roboto, Jost } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const serenity = localFont({
  src: [
    { path: "../../public/fonts/serenity/Serenity-Thin.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/serenity/Serenity-ExtraLight.otf", weight: "200", style: "normal" },
    { path: "../../public/fonts/serenity/Serenity-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/serenity/Serenity-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/serenity/Serenity-DemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/serenity/Serenity-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/serenity/Serenity-Heavy.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-serenity",
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURORA jóga | Online jógové studio",
  description:
    "Prémiové online jógové studio. Živé streamy, knihovna nahrávek, cvičení na doma — kdykoli a kdekoli chceš.",
  openGraph: {
    title: "AURORA jóga | Online jógové studio",
    description:
      "Prémiové online jógové studio s živými lekce a knihovnou nahrávek.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${roboto.variable} ${jost.variable} ${serenity.variable} scroll-smooth antialiased`}
    >
      <body className="bg-cream text-ink font-sans">{children}</body>
    </html>
  );
}
