import type {
  Metadata,
} from "next";

import {
  notFound,
} from "next/navigation";

import ContributeExperience from "@/components/contribute/ContributeExperience";

import {
  getPublicContributeSettings,
} from "@/lib/repositories/contribute.repository";


export const dynamic =
  "force-dynamic";


const SITE_URL =
  "https://www.age202.com";

const PAGE_URL =
  `${SITE_URL}/contribute`;


export async function generateMetadata():
  Promise<Metadata> {
  const settings =
    await getPublicContributeSettings();

  const title =
    settings.metaTitle ??
    "Contribute to AGE202: Tennis Stories, Objects & Museum Records";

  const description =
    settings.metaDescription ??
    "Contribute to AGE202 by sharing tennis stories, memorabilia, historical material and museum records for consideration in the digital tennis museum.";

  return {
    title,

    description,

    alternates: {
      canonical:
        "/contribute",
    },

    keywords: [
      "contribute to AGE202",
      "tennis memorabilia contribution",
      "tennis museum contribution",
      "submit tennis memorabilia",
      "tennis history contribution",
      "digital tennis museum",
      "AGE202",
    ],

    openGraph: {
      type:
        "website",

      url:
        PAGE_URL,

      title,

      description,

      siteName:
        "AGE202",

      locale:
        "en_US",
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,
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
      "Tennis museum contributions",
  };
}


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


export default async function ContributePage() {
  const settings =
    await getPublicContributeSettings();

  if (
    !settings.active ||
    !settings.published
  ) {
    notFound();
  }

  const title =
    settings.metaTitle ??
    "Contribute to AGE202: Tennis Stories, Objects & Museum Records";

  const description =
    settings.metaDescription ??
    "Contribute to AGE202 by sharing tennis stories, memorabilia, historical material and museum records for consideration in the digital tennis museum.";

  const structuredData = {
    "@context":
      "https://schema.org",

    "@graph": [
      {
        "@type":
          "WebPage",

        "@id":
          `${PAGE_URL}#webpage`,

        url:
          PAGE_URL,

        name:
          title,

        headline:
          title,

        description,

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
              "Contribute",

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

      <ContributeExperience
        settings={
          settings
        }
      />
    </>
  );
}
