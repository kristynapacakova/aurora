import type { Metadata } from "next";
import { Roboto, Jost, Corinthia } from "next/font/google";
import "./globals.css";

const corinthia = Corinthia({
  variable: "--font-corinthia",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
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
      className={`${roboto.variable} ${jost.variable} ${corinthia.variable} scroll-smooth antialiased`}
    >
      <body className="bg-cream text-ink font-sans">{children}</body>
    </html>
  );
}
