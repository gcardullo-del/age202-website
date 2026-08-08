import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import ArtifactDashboard from "@/components/admin/dashboard/ArtifactDashboard";

import { mapArtifactToDashboardData } from "@/lib/mappers/artifact-dashboard.mapper";

import {
  getArtifactById,
  getRelatedArtifacts,
} from "@/lib/repositories/artifact.repository";

import type {
  ArtifactCardData,
} from "@/components/artifacts/ArtifactCard";

export const dynamic = "force-dynamic";

type ArtifactDashboardPageProps = {
  params: Promise<{
    artifactId: string;
  }>;
};

export default async function ArtifactDashboardPage({
  params,
}: ArtifactDashboardPageProps) {
  const {
    artifactId,
  } = await params;

  const artifact =
    await getArtifactById(
      artifactId,
    );

  if (!artifact) {
    notFound();
  }

  const related =
    await getRelatedArtifacts({
      artifactId:
        artifact.id,

      playerId:
        artifact.playerId,

      limit: 3,
    });

  const dashboardArtifact =
    mapArtifactToDashboardData(
      artifact,
    );

  const relatedArtifacts:
    ArtifactCardData[] =
    related.map(
      (item) => {
        const coverImage =
          item.images.find(
            (image) =>
              image.isCover,
          ) ??
          item.images[0] ??
          null;

        return {
          title:
            item.title,

          subtitle:
            item.subtitle,

          archiveNumber:
            item.archiveNumber,

          year:
            item.year,

          tournament:
            item.tournament,

          collection:
            item.collection,

          playerName:
            item.player.name,

          brandName:
            item.brand.name,

          category:
            item.category,

          rarity:
            item.rarity,

          condition:
            item.condition,

          availability:
            item.availability,

          price:
            item.price?.toString() ??
            null,

          currency:
            item.currency,

          authentic:
            item.authentic,

          vintage:
            item.vintage,

          featured:
            item.featured,

          status:
            item.status,

          coverImage:
            coverImage?.url ??
            null,
        };
      },
    );

  return (
    <AdminShell
      title={`${artifact.title} Dashboard`}
      description="Review the complete AGE202 museum record, authenticity, media and publication status."
    >
      <ArtifactDashboard
        artifact={
          dashboardArtifact
        }
        relatedArtifacts={
          relatedArtifacts
        }
      />
    </AdminShell>
  );
}