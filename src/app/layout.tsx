import type { Metadata } from "next";
import { Roboto, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
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
      className={`${roboto.variable} ${cormorant.variable} scroll-smooth antialiased`}
    >
      <body className="bg-cream text-ink font-sans">{children}</body>
    </html>
  );
}
