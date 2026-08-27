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


export async function generateMetadata():
  Promise<Metadata> {
  const settings =
    await getPublicContributeSettings();

  return {
    title:
      settings.metaTitle,

    description:
      settings.metaDescription,

    alternates: {
      canonical:
        "/contribute",
    },
  };
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

  return (
    <ContributeExperience
      settings={
        settings
      }
    />
  );
}
