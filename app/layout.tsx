import type {
  Metadata,
  Viewport,
} from "next";

import type {
  ReactNode,
} from "react";

import {
  Analytics,
} from "@vercel/analytics/next";

import {
  Toaster,
} from "sonner";

import SiteChrome from "@/components/layout/SiteChrome";

import "./globals.css";

const siteUrl =
  "https://www.age202.com";

const siteName =
  "AGE202";

const defaultTitle =
  "AGE202 | The Digital Tennis Museum";

const defaultDescription =
  "AGE202 is a digital tennis museum preserving authentic apparel, iconic champions, historic tournaments and the stories behind every artifact.";

export const metadata: Metadata = {
  metadataBase:
    new URL(siteUrl),

  applicationName:
    siteName,

  category:
    "sports",

  creator:
    siteName,

  publisher:
    siteName,

  referrer:
    "origin-when-cross-origin",

  title: {
    default:
      defaultTitle,

    template:
      `%s | ${siteName}`,
  },

  description:
    defaultDescription,

  keywords: [
    "AGE202",
    "digital tennis museum",
    "tennis museum",
    "tennis history",
    "tennis apparel archive",
    "vintage tennis apparel",
    "tennis heritage",
    "tennis memorabilia",
    "tennis collectibles",
    "Roger Federer",
    "Rafael Nadal",
    "Novak Djokovic",
    "Jannik Sinner",
    "Carlos Alcaraz",
    "ATP Tour",
    "Grand Slam",
    "Wimbledon",
    "Australian Open",
    "Roland Garros",
    "US Open",
    "Nike Tennis",
    "Adidas Tennis",
    "On Running Tennis",
    "Lacoste Tennis",
  ],

  authors: [
    {
      name:
        siteName,

      url:
        siteUrl,
    },
  ],

  formatDetection: {
    address:
      false,

    email:
      false,

    telephone:
      false,
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  openGraph: {
    type:
      "website",

    locale:
      "en_US",

    siteName,

    title:
      defaultTitle,

    description:
      defaultDescription,

    images: [
      {
        url:
          "/opengraph-image.png",

        width:
          1200,

        height:
          630,

        alt:
          "AGE202 — The Digital Tennis Museum",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      defaultTitle,

    description:
      defaultDescription,

    images: [
      "/opengraph-image.png",
    ],
  },

  icons: {
    icon: [
      {
        url:
          "/favicon.ico",

        sizes:
          "any",
      },
      {
        url:
          "/icon.png",

        type:
          "image/png",

        sizes:
          "512x512",
      },
    ],

    apple: [
      {
        url:
          "/apple-icon.png",

        type:
          "image/png",

        sizes:
          "180x180",
      },
    ],
  },
};

export const viewport: Viewport = {
  width:
    "device-width",

  initialScale:
    1,

  themeColor:
    "#050B18",

  colorScheme:
    "dark",
};

type RootLayoutProps =
  Readonly<{
    children:
      ReactNode;
  }>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden bg-[#050B18] text-white antialiased">
        <SiteChrome>
          {children}
        </SiteChrome>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3500}
          theme="dark"
        />

        <Analytics />
      </body>
    </html>
  );
}