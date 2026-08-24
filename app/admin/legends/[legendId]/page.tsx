import {
  notFound,
} from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import LegendStudioForm from "@/components/admin/legend-studio/LegendStudioForm";
import BiographySection from "@/components/admin/legend-studio/sections/BiographySection";
import CareerSection from "@/components/admin/legend-studio/sections/CareerSection";
import GallerySection from "@/components/admin/legend-studio/sections/GallerySection";
import GrandSlamsSection from "@/components/admin/legend-studio/sections/GrandSlamsSection";
import IdentitySection from "@/components/admin/legend-studio/sections/IdentitySection";
import LegacySection from "@/components/admin/legend-studio/sections/LegacySection";
import MediaSection from "@/components/admin/legend-studio/sections/MediaSection";
import PublishingSection from "@/components/admin/legend-studio/sections/PublishingSection";
import SeoSection from "@/components/admin/legend-studio/sections/SeoSection";
import TimelineSection from "@/components/admin/legend-studio/sections/TimelineSection";

import {
  getLegendById,
} from "@/lib/repositories/legend.repository";

import {
  updateLegend,
} from "../actions/updateLegend";

export const dynamic =
  "force-dynamic";

type EditLegendPageProps = {
  params: Promise<{
    legendId: string;
  }>;
};

function dateInputValue(
  value: Date | string | null,
): string {
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 10);
}

export default async function EditLegendPage({
  params,
}: EditLegendPageProps) {
  const {
    legendId,
  } = await params;

  const legend =
    await getLegendById(
      legendId,
    );

  if (!legend) {
    notFound();
  }

  const updateLegendAction =
    updateLegend.bind(
      null,
      legend.id,
    );

  return (
    <AdminShell
      title="Edit Legend"
      description={`Edit ${legend.name} and manage the complete AGE202 historical profile.`}
    >
      <LegendStudioForm
        mode="edit"
        legendId={legend.id}
        formAction={
          updateLegendAction
        }
        initialSection="identity"
        previewHref={
          `/legends/${legend.slug}`
        }
        submitLabel="Save changes"
        backHref="/admin/legends"
        initialPreview={{
          name:
            legend.name,
          nickname:
            legend.nickname,
          nationality:
            legend.nationality,
          gender:
            legend.gender,
          heroImage:
            legend.heroImage,
          portraitImage:
            legend.portraitImage,
          era:
            legend.era,
          careerTitles:
            legend.careerTitles,
          grandSlams:
            legend.grandSlams,
          weeksAtNo1:
            legend.weeksAtNo1,
          status:
            legend.status,
          featured:
            legend.featured,
        }}
        sections={{
          identity: (
            <>
              <IdentitySection
                initialSlug={
                  legend.slug
                }
                initialFirstName={
                  legend.firstName
                }
                initialLastName={
                  legend.lastName
                }
                initialCountryCode={
                  legend.countryCode
                }
                initialBirthPlace={
                  legend.birthPlace
                }
                initialBirthDate={
                  legend.birthDate
                }
              />

              <input
                type="hidden"
                name="deathDate"
                value={dateInputValue(
                  legend.deathDate,
                )}
                readOnly
              />
            </>
          ),

          media: (
            <MediaSection
              initialHeroImage={
                legend.heroImage
              }
              initialPortraitImage={
                legend.portraitImage
              }
            />
          ),

          biography: (
            <BiographySection
              initialBiographyShort={
                legend.biographyShort
              }
              initialBiographyLong={
                legend.biographyLong
              }
              initialQuote={
                legend.quote
              }
            />
          ),

          career: (
            <CareerSection
              initialTurnedPro={
                legend.turnedPro
              }
              initialRetiredYear={
                legend.retiredYear
              }
              initialPlays={
                legend.plays
              }
              initialBackhand={
                legend.backhand
              }
              initialCareerHigh={
                legend.careerHigh
              }
              initialCareerTitles={
                legend.careerTitles
              }
              initialWeeksAtNo1={
                legend.weeksAtNo1
              }
              initialYearEndNo1={
                legend.yearEndNo1
              }
              initialOlympicGold={
                legend.olympicGold
              }
              initialGrandSlams={
                legend.grandSlams
              }
            />
          ),

          grandSlams: (
            <GrandSlamsSection
              initialAustralianOpen={
                legend.australianOpen
              }
              initialRolandGarros={
                legend.rolandGarros
              }
              initialWimbledon={
                legend.wimbledon
              }
              initialUsOpen={
                legend.usOpen
              }
            />
          ),

          timeline: (
            <TimelineSection
              initialMilestones={
                legend.milestones
              }
            />
          ),

          gallery: (
            <GallerySection
              initialImages={
                legend.images
              }
            />
          ),

          legacy: (
            <LegacySection
              initialLegacy={
                legend.legacy
              }
            />
          ),

          seo: (
            <SeoSection
              initialMetaTitle={
                legend.metaTitle
              }
              initialMetaDescription={
                legend.metaDescription
              }
              initialCanonicalUrl={
                legend.canonicalUrl
              }
              initialOpenGraphImage={
                legend.openGraphImage
              }
              initialRobotsIndex={
                legend.robotsIndex
              }
              initialRobotsFollow={
                legend.robotsFollow
              }
            />
          ),

          publishing: (
            <PublishingSection
              initialDisplayOrder={
                legend.displayOrder
              }
            />
          ),
        }}
      />
    </AdminShell>
  );
}