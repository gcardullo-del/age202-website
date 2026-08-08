"use client";

import ArtifactCard, {
  type ArtifactCardData,
} from "@/components/artifacts/ArtifactCard";

export type ArtifactPreviewData =
  ArtifactCardData;

type ArtifactPreviewCardProps = {
  artifact: ArtifactPreviewData;
};

export default function ArtifactPreviewCard({
  artifact,
}: ArtifactPreviewCardProps) {
  return (
    <ArtifactCard
      artifact={artifact}
    />
  );
}