import { notFound } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import ArtifactDashboard from "@/components/admin/dashboard/ArtifactDashboard";

import { mapArtifactToDashboardData } from "@/lib/mappers/artifact-dashboard.mapper";
import { getArtifactById } from "@/lib/repositories/artifact.repository";

export const dynamic = "force-dynamic";

type ArtifactDashboardPageProps = {
  params: Promise<{
    artifactId: string;
  }>;
};

export default async function ArtifactDashboardPage({
  params,
}: ArtifactDashboardPageProps) {
  const { artifactId } = await params;

  const artifact = await getArtifactById(artifactId);

  if (!artifact) {
    notFound();
  }

  const dashboardArtifact =
    mapArtifactToDashboardData(artifact);

  return (
    <AdminShell
      title={`${artifact.title} Dashboard`}
      description="Review the complete AGE202 museum record, authenticity, media and publication status."
    >
      <ArtifactDashboard
        artifact={dashboardArtifact}
      />
    </AdminShell>
  );
}