import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="cs" className="scroll-smooth antialiased">
      <body className="bg-cream text-ink font-sans">{children}</body>
    </html>
  );
}
