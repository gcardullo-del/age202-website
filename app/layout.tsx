import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Toaster } from "sonner";

import SiteChrome from "@/components/layout/SiteChrome";

import "./globals.css";

const siteUrl = "https://www.age202.com";
const siteName = "AGE202";

const defaultTitle =
  "AGE202 | The Digital Museum of Tennis Apparel";

const defaultDescription =
  "AGE202 è il museo digitale dell’abbigliamento da tennis: collezioni autentiche, capi iconici e storie dedicate ai più grandi campioni.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: siteName,
  category: "sports",
  creator: siteName,
  publisher: siteName,
  referrer: "origin-when-cross-origin",

  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },

  description: defaultDescription,

  keywords: [
    "AGE202",
    "museo digitale tennis",
    "abbigliamento tennis vintage",
    "tennis apparel archive",
    "tennis heritage",
    "tennis collectibles",
    "Roger Federer",
    "Rafael Nadal",
    "Novak Djokovic",
    "Jannik Sinner",
    "Carlos Alcaraz",
    "Nike Tennis",
    "Adidas Tennis",
    "On Running Tennis",
  ],

  authors: [
    {
      name: siteName,
      url: siteUrl,
    },
  ],

  alternates: {
    canonical: "/",
  },

  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,

    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "AGE202 — The Digital Museum of Tennis Apparel",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050B18",
  colorScheme: "dark",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="it"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-[#050B18] text-white antialiased">
        <SiteChrome>{children}</SiteChrome>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3500}
          theme="dark"
        />
      </body>
    </html>
  );
}