export type PlayerArtifactRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  archiveNumber: string;
  availability: string;
  vintedUrl: string | null;

  price: {
    toString(): string;
  } | null;

  currency: string;

  brand: {
    name: string;
  };
images: Array<{
  url: string;
  cardUrl: string | null;
  alt: string | null;
  isCover: boolean;
}>;
};

export type PlayerArtifactsProps = {
  player: {
    name: string;
    accent: string;
    artifacts: PlayerArtifactRecord[];
  };
};

export type ArtifactCardProps = {
  artifact: PlayerArtifactRecord;
  accent: string;
};

export type EmptyCollectionProps = {
  playerName: string;
  accent: string;
};
