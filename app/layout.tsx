import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "AGE202 | Second Hand. First Set.",
  description:
    "Curated Tennis Heritage. Collezioni dedicate ai più grandi campioni del tennis con capi autentici e da collezione.",

  keywords: [
    "Roger Federer",
    "Rafael Nadal",
    "Novak Djokovic",
    "Jannik Sinner",
    "Carlos Alcaraz",
    "Vintage Tennis",
    "Tennis Collection",
    "Nike Tennis",
    "Adidas Tennis",
    "On Running",
    "AGE202",
  ],

  authors: [{ name: "AGE202" }],

  openGraph: {
    title: "AGE202",
    description: "Second Hand. First Set.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
  <Navbar />
  {children}
</body>
    </html>
  );
}