import {
  prisma,
} from "../../lib/prisma";

import type {
  TournamentChapterInput,
  TournamentHistoryDataset,
  TournamentIconicMomentInput,
  TournamentMilestoneInput,
} from "./types";

type EditorialSectionResult = {
  created: number;
  updated: number;
  deleted: number;
};

type EditorialImportResult = {
  tournamentId: string;
  tournamentName: string;

  milestones: EditorialSectionResult;
  chapters: EditorialSectionResult;
  iconicMoments: EditorialSectionResult;
};

type SyncResult = {
  id: string;
  action: "created" | "updated";
};

function parseOptionalDate(
  value: string | null | undefined,
  label: string,
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || !value.trim()) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `${label} non valida: "${value}". Usa una data ISO valida.`,
    );
  }

  return date;
}

function getSortOrder(
  value: number | undefined,
  index: number,
): number {
  return value ?? (index + 1) * 10;
}

function createSectionResult(): EditorialSectionResult {
  return {
    created: 0,
    updated: 0,
    deleted: 0,
  };
}

async function syncMilestone(
  tournamentId: string,
  milestone: TournamentMilestoneInput,
  index: number,
): Promise<SyncResult> {
  const sortOrder = getSortOrder(
    milestone.sortOrder,
    index,
  );

  const existing =
    await prisma.tournamentMilestone.findFirst({
      where: {
        tournamentId,
        sortOrder,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

  const data = {
    year: milestone.year ?? null,
    title: milestone.title,
    subtitle: milestone.subtitle ?? null,
    description:
      milestone.description ?? null,
    featured: milestone.featured ?? false,
    sortOrder,
  };

  /*
   * imageUrl NON viene mai incluso nell'update.
   * Se la foto è stata aggiunta dal CMS, resta intatta.
   */
  if (existing) {
    await prisma.tournamentMilestone.update({
      where: {
        id: existing.id,
      },
      data,
    });

    return {
      id: existing.id,
      action: "updated",
    };
  }

  const created =
    await prisma.tournamentMilestone.create({
      data: {
        tournamentId,
        ...data,
      },
      select: {
        id: true,
      },
    });

  return {
    id: created.id,
    action: "created",
  };
}

async function syncChapter(
  tournamentId: string,
  chapter: TournamentChapterInput,
  index: number,
): Promise<SyncResult> {
  const sortOrder = getSortOrder(
    chapter.sortOrder,
    index,
  );

  const existing =
    await prisma.tournamentChapter.findFirst({
      where: {
        tournamentId,
        sortOrder,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

  const data = {
    eyebrow: chapter.eyebrow ?? null,
    title: chapter.title,
    subtitle: chapter.subtitle ?? null,
    description:
      chapter.description ?? null,
    yearLabel: chapter.yearLabel ?? null,
    featured: chapter.featured ?? false,
    sortOrder,
  };

  /*
   * imageUrl NON viene mai incluso nell'update.
   * Se la foto è stata aggiunta dal CMS, resta intatta.
   */
  if (existing) {
    await prisma.tournamentChapter.update({
      where: {
        id: existing.id,
      },
      data,
    });

    return {
      id: existing.id,
      action: "updated",
    };
  }

  const created =
    await prisma.tournamentChapter.create({
      data: {
        tournamentId,
        ...data,
      },
      select: {
        id: true,
      },
    });

  return {
    id: created.id,
    action: "created",
  };
}

async function syncIconicMoment(
  tournamentId: string,
  moment: TournamentIconicMomentInput,
  index: number,
): Promise<SyncResult> {
  const sortOrder = getSortOrder(
    moment.sortOrder,
    index,
  );

  const existing =
    await prisma.tournamentIconicMoment.findFirst({
      where: {
        tournamentId,
        sortOrder,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    });

  const data = {
    year: moment.year ?? null,
    momentDate:
      parseOptionalDate(
        moment.momentDate,
        "momentDate",
      ) ?? null,
    title: moment.title,
    subtitle: moment.subtitle ?? null,
    description:
      moment.description ?? null,
    featured: moment.featured ?? false,
    sortOrder,
  };

  /*
   * imageUrl NON viene mai incluso nell'update.
   * Se la foto è stata aggiunta dal CMS, resta intatta.
   */
  if (existing) {
    await prisma.tournamentIconicMoment.update({
      where: {
        id: existing.id,
      },
      data,
    });

    return {
      id: existing.id,
      action: "updated",
    };
  }

  const created =
    await prisma.tournamentIconicMoment.create({
      data: {
        tournamentId,
        ...data,
      },
      select: {
        id: true,
      },
    });

  return {
    id: created.id,
    action: "created",
  };
}

async function syncMilestones(
  tournamentId: string,
  milestones:
    | readonly TournamentMilestoneInput[]
    | undefined,
): Promise<EditorialSectionResult> {
  const result =
    createSectionResult();

  /*
   * undefined = il dataset non gestisce questa sezione.
   * Non tocchiamo nulla nel CMS/database.
   *
   * [] = il dataset gestisce la sezione e la vuole vuota.
   * In quel caso eliminiamo tutti i record esistenti.
   */
  if (milestones === undefined) {
    return result;
  }

  const keptIds: string[] = [];

  for (
    const [index, milestone] of
    milestones.entries()
  ) {
    const synced =
      await syncMilestone(
        tournamentId,
        milestone,
        index,
      );

    keptIds.push(
      synced.id,
    );

    result[synced.action] += 1;
  }

  const deleteResult =
    await prisma.tournamentMilestone.deleteMany({
      where: {
        tournamentId,

        ...(keptIds.length > 0
          ? {
              id: {
                notIn: keptIds,
              },
            }
          : {}),
      },
    });

  result.deleted =
    deleteResult.count;

  return result;
}

async function syncChapters(
  tournamentId: string,
  chapters:
    | readonly TournamentChapterInput[]
    | undefined,
): Promise<EditorialSectionResult> {
  const result =
    createSectionResult();

  if (chapters === undefined) {
    return result;
  }

  const keptIds: string[] = [];

  for (
    const [index, chapter] of
    chapters.entries()
  ) {
    const synced =
      await syncChapter(
        tournamentId,
        chapter,
        index,
      );

    keptIds.push(
      synced.id,
    );

    result[synced.action] += 1;
  }

  const deleteResult =
    await prisma.tournamentChapter.deleteMany({
      where: {
        tournamentId,

        ...(keptIds.length > 0
          ? {
              id: {
                notIn: keptIds,
              },
            }
          : {}),
      },
    });

  result.deleted =
    deleteResult.count;

  return result;
}

async function syncIconicMoments(
  tournamentId: string,
  iconicMoments:
    | readonly TournamentIconicMomentInput[]
    | undefined,
): Promise<EditorialSectionResult> {
  const result =
    createSectionResult();

  if (iconicMoments === undefined) {
    return result;
  }

  const keptIds: string[] = [];

  for (
    const [index, moment] of
    iconicMoments.entries()
  ) {
    const synced =
      await syncIconicMoment(
        tournamentId,
        moment,
        index,
      );

    keptIds.push(
      synced.id,
    );

    result[synced.action] += 1;
  }

  const deleteResult =
    await prisma.tournamentIconicMoment.deleteMany({
      where: {
        tournamentId,

        ...(keptIds.length > 0
          ? {
              id: {
                notIn: keptIds,
              },
            }
          : {}),
      },
    });

  result.deleted =
    deleteResult.count;

  return result;
}

export async function importTournamentEditorialContent(
  dataset: TournamentHistoryDataset,
): Promise<EditorialImportResult> {
  const tournament =
    await prisma.tournament.findUnique({
      where: {
        slug: dataset.tournamentSlug,
      },
      select: {
        id: true,
        name: true,
      },
    });

  if (!tournament) {
    throw new Error(
      `Torneo non trovato per slug "${dataset.tournamentSlug}".`,
    );
  }

  const milestones =
    await syncMilestones(
      tournament.id,
      dataset.milestones,
    );

  const chapters =
    await syncChapters(
      tournament.id,
      dataset.chapters,
    );

  const iconicMoments =
    await syncIconicMoments(
      tournament.id,
      dataset.iconicMoments,
    );

  return {
    tournamentId:
      tournament.id,
    tournamentName:
      tournament.name,
    milestones,
    chapters,
    iconicMoments,
  };
}