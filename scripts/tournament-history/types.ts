export type TournamentHistoryPlayerRef = {
  slugCandidates: readonly string[];
};

export type TournamentHistoryEditionInput = {
  year: number;

  editionKey?: string;
  editionLabel?: string | null;

  startDate?: string | null;
  endDate?: string | null;

  drawSize?: number | null;

  championName?: string | null;
  runnerUpName?: string | null;

  championCountryCode?: string | null;
  runnerUpCountryCode?: string | null;

  championPlayer?: TournamentHistoryPlayerRef | null;
  runnerUpPlayer?: TournamentHistoryPlayerRef | null;

  score?: string | null;

  cancelled?: boolean;
};

export type TournamentProfileInput = {
  name?: string;
  shortName?: string | null;

  category?: string;
  surface?: string;

  city?: string | null;
  country?: string;
  countryCode?: string | null;
  venue?: string | null;

  foundedYear?: number | null;

  description?: string | null;
  history?: string | null;

  websiteUrl?: string | null;

  active?: boolean;
  featured?: boolean;
  displayOrder?: number | null;

  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type TournamentMilestoneInput = {
  year?: number | null;

  title: string;
  subtitle?: string | null;
  description?: string | null;

  featured?: boolean;
  sortOrder?: number;
};

export type TournamentChapterInput = {
  eyebrow?: string | null;

  title: string;
  subtitle?: string | null;
  description?: string | null;
  yearLabel?: string | null;

  featured?: boolean;
  sortOrder?: number;
};

export type TournamentIconicMomentInput = {
  year?: number | null;
  momentDate?: string | null;

  title: string;
  subtitle?: string | null;
  description?: string | null;

  featured?: boolean;
  sortOrder?: number;
};

export type TournamentLegendInput = {
  player?: TournamentHistoryPlayerRef | null;

  name: string;

  country?: string | null;
  countryCode?: string | null;

  recordLabel?: string | null;
  quote?: string | null;

  legend?: boolean;
  featured?: boolean;
  sortOrder?: number;
};

export type TournamentHistoryDataset = {
  tournamentSlug: string;

  tournament?: TournamentProfileInput;

  milestones?: readonly TournamentMilestoneInput[];
  chapters?: readonly TournamentChapterInput[];
  iconicMoments?: readonly TournamentIconicMomentInput[];
  legends?: readonly TournamentLegendInput[];

  editions: readonly TournamentHistoryEditionInput[];
};

export type ResolvedTournamentHistoryEdition = {
  year: number;

  editionKey: string;
  editionLabel: string | null;

  startDate: Date | null;
  endDate: Date | null;

  drawSize: number | null;

  championName: string | null;
  runnerUpName: string | null;

  championCountryCode: string | null;
  runnerUpCountryCode: string | null;

  championPlayerId: string | null;
  runnerUpPlayerId: string | null;

  score: string | null;

  cancelled: boolean;
};

export type TournamentChampionSummary = {
  identityKey: string;

  playerId: string | null;

  name: string;
  countryCode: string | null;

  titles: number;
  firstTitleYear: number;
  lastTitleYear: number;
  titleYears: number[];
};