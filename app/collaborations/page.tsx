import type {
  Metadata,
} from "next";

import CollaborationsExperience from "@/components/collaborations/CollaborationsExperience";


export const dynamic =
  "force-dynamic";


const SITE_URL =
  "https://www.age202.com";

const PAGE_URL =
  `${SITE_URL}/collaborations`;

const PAGE_TITLE =
  "AGE202 Collaborations: Tennis, Culture, Design & Collecting";

const PAGE_DESCRIPTION =
  "Discover AGE202 collaborations and partnerships across tennis, design, photography, collecting and culture, connecting the digital tennis museum with people, brands and creative projects.";


export const metadata: Metadata = {
  title:
    PAGE_TITLE,

  description:
    PAGE_DESCRIPTION,

  alternates: {
    canonical:
      "/collaborations",
  },

  keywords: [
    "AGE202 collaborations",
    "tennis collaborations",
    "tennis partnerships",
    "tennis culture",
    "tennis design",
    "tennis photography",
    "tennis collecting",
    "digital tennis museum",
    "AGE202",
  ],

  openGraph: {
    type:
      "website",

    url:
      PAGE_URL,

    title:
      `${PAGE_TITLE} | AGE202`,

    description:
      PAGE_DESCRIPTION,

    siteName:
      "AGE202",

    locale:
      "en_US",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      `${PAGE_TITLE} | AGE202`,

    description:
      PAGE_DESCRIPTION,
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

  category:
    "Tennis collaborations",
};


function serializeJsonLd(
  value: unknown,
) {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}


export default function CollaborationsPage() {
  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "CollectionPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          PAGE_TITLE,

        headline:
          PAGE_TITLE,

        description:
          PAGE_DESCRIPTION,

        isPartOf: {
          "@type":
            "WebSite",

          "@id":
            `${SITE_URL}/#website`,

          name:
            "AGE202",

          url:
            SITE_URL,
        },

        breadcrumb: {
          "@id":
            `${PAGE_URL}#breadcrumb`,
        },
      },

      {
        "@type":
          "BreadcrumbList",

        "@id":
          `${PAGE_URL}#breadcrumb`,

        itemListElement: [
          {
            "@type":
              "ListItem",

            position:
              1,

            name:
              "AGE202",

            item:
              SITE_URL,
          },

          {
            "@type":
              "ListItem",

            position:
              2,

            name:
              "Collaborations",

            item:
              PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              structuredData,
            ),
        }}
      />

      <CollaborationsExperience />
    </>
  );
}
