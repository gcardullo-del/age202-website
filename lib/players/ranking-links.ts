type RankingPlayerLinkInput = {
  archiveUrl?: string | null;
  collectionUrl?: string | null;
};

type RankingPlayerLinkLabelInput = {
  archiveUrl?: string | null;
  collectionUrl?: string | null;
};

export function getRankingPlayerHref({
  archiveUrl,
  collectionUrl,
}: RankingPlayerLinkInput): string | null {
  return collectionUrl ?? archiveUrl ?? null;
}

export function getRankingPlayerLinkLabel({
  archiveUrl,
  collectionUrl,
}: RankingPlayerLinkLabelInput): string | null {
  if (collectionUrl) {
    return "AGE202";
  }

  if (archiveUrl) {
    return "ATP Archive";
  }

  return null;
}