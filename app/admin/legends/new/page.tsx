import AdminShell from "@/components/admin/AdminShell";

import LegendStudioForm from "@/components/admin/legend-studio/LegendStudioForm";
import BiographySection from "@/components/admin/legend-studio/sections/BiographySection";
import CareerSection from "@/components/admin/legend-studio/sections/CareerSection";
import GallerySection from "@/components/admin/legend-studio/sections/GallerySection";
import GrandSlamsSection from "@/components/admin/legend-studio/sections/GrandSlamsSection";
import LegacySection from "@/components/admin/legend-studio/sections/LegacySection";
import IdentitySection from "@/components/admin/legend-studio/sections/IdentitySection";
import MediaSection from "@/components/admin/legend-studio/sections/MediaSection";
import SeoSection from "@/components/admin/legend-studio/sections/SeoSection";
import PublishingSection from "@/components/admin/legend-studio/sections/PublishingSection";

import { createLegend } from "../actions/createLegend";

export const dynamic =
  "force-dynamic";

export default async function NewLegendPage() {
  return (
    <AdminShell
      title="New Legend"
      description="Create a new AGE202 tennis legend profile for the historical archive."
    >
      <LegendStudioForm
        mode="create"
        formAction={createLegend}
        initialSection="identity"
        initialPreview={{
          name: "",
          nickname: null,
          nationality: null,
          gender: "MALE",
          heroImage: null,
          portraitImage: null,
          era: null,
          careerTitles: 0,
          grandSlams: 0,
          weeksAtNo1: 0,
          status: "DRAFT",
          featured: false,
        }}
        sections={{
          identity: (
            <IdentitySection />
          ),

          media: (
            <MediaSection />
          ),

          biography: (
            <BiographySection />
          ),

          career: (
            <CareerSection />
          ),

          grandSlams: (
            <GrandSlamsSection />
          ),

          gallery: (
            <GallerySection />
          ),

          legacy: (
            <LegacySection />
          ),

          seo: (
            <SeoSection />
          ),

          publishing: (
            <PublishingSection />
          ),
        }}
      />
    </AdminShell>
  );
}