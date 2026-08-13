import {
  CourtSurface,
  TournamentCategory,
} from "../../generated/prisma/client";

import {
  prisma,
} from "../../lib/prisma";

import type {
  TournamentHistoryDataset,
  TournamentProfileInput,
} from "./types";

type TournamentProfileImportResult = {
  tournamentId: string;
  tournamentName: string;
  updated: boolean;
};

function parseTournamentCategory(
  value: string,
): TournamentCategory {
  if (
    !Object.values(TournamentCategory).includes(
      value as TournamentCategory,
    )
  ) {
    throw new Error(
      `Categoria torneo non valida: "${value}".`,
    );
  }

  return value as TournamentCategory;
}

function parseCourtSurface(
  value: string,
): CourtSurface {
  if (
    !Object.values(CourtSurface).includes(
      value as CourtSurface,
    )
  ) {
    throw new Error(
      `Superficie torneo non valida: "${value}".`,
    );
  }

  return value as CourtSurface;
}

function validateProfileText(
  profile: TournamentProfileInput,
) {
  if (
    profile.name !== undefined &&
    !profile.name.trim()
  ) {
    throw new Error(
      "Il nome del torneo non può essere vuoto.",
    );
  }

  if (
    profile.country !== undefined &&
    !profile.country.trim()
  ) {
    throw new Error(
      "Il paese del torneo non può essere vuoto.",
    );
  }
}

function buildTournamentUpdateData(
  profile: TournamentProfileInput,
) {
  return {
    ...(profile.name !== undefined
      ? {
          name: profile.name.trim(),
        }
      : {}),

    ...(profile.shortName !== undefined
      ? {
          shortName: profile.shortName,
        }
      : {}),

    ...(profile.category !== undefined
      ? {
          category: parseTournamentCategory(
            profile.category,
          ),
        }
      : {}),

    ...(profile.surface !== undefined
      ? {
          surface: parseCourtSurface(
            profile.surface,
          ),
        }
      : {}),

    ...(profile.city !== undefined
      ? {
          city: profile.city,
        }
      : {}),

    ...(profile.country !== undefined
      ? {
          country: profile.country.trim(),
        }
      : {}),

    ...(profile.countryCode !== undefined
      ? {
          countryCode: profile.countryCode,
        }
      : {}),

    ...(profile.venue !== undefined
      ? {
          venue: profile.venue,
        }
      : {}),

    ...(profile.foundedYear !== undefined
      ? {
          foundedYear: profile.foundedYear,
        }
      : {}),

    ...(profile.description !== undefined
      ? {
          description: profile.description,
        }
      : {}),

    ...(profile.history !== undefined
      ? {
          history: profile.history,
        }
      : {}),

    ...(profile.websiteUrl !== undefined
      ? {
          websiteUrl: profile.websiteUrl,
        }
      : {}),

    ...(profile.active !== undefined
      ? {
          active: profile.active,
        }
      : {}),

    ...(profile.featured !== undefined
      ? {
          featured: profile.featured,
        }
      : {}),

    ...(profile.displayOrder !== undefined
      ? {
          displayOrder: profile.displayOrder,
        }
      : {}),

    ...(profile.metaTitle !== undefined
      ? {
          metaTitle: profile.metaTitle,
        }
      : {}),

    ...(profile.metaDescription !== undefined
      ? {
          metaDescription:
            profile.metaDescription,
        }
      : {}),
  };
}

function buildTournamentCreateData(
  tournamentSlug: string,
  profile: TournamentProfileInput,
) {
  if (
    profile.name === undefined ||
    !profile.name.trim()
  ) {
    throw new Error(
      `Impossibile creare "${tournamentSlug}": manca tournament.name nel dataset.`,
    );
  }

  if (
    profile.category === undefined
  ) {
    throw new Error(
      `Impossibile creare "${tournamentSlug}": manca tournament.category nel dataset.`,
    );
  }

  if (
    profile.surface === undefined
  ) {
    throw new Error(
      `Impossibile creare "${tournamentSlug}": manca tournament.surface nel dataset.`,
    );
  }

  if (
    profile.country === undefined ||
    !profile.country.trim()
  ) {
    throw new Error(
      `Impossibile creare "${tournamentSlug}": manca tournament.country nel dataset.`,
    );
  }

  return {
    slug: tournamentSlug,
    name: profile.name.trim(),
    category:
      parseTournamentCategory(
        profile.category,
      ),
    surface:
      parseCourtSurface(
        profile.surface,
      ),
    country:
      profile.country.trim(),

    ...(profile.shortName !== undefined
      ? {
          shortName: profile.shortName,
        }
      : {}),

    ...(profile.city !== undefined
      ? {
          city: profile.city,
        }
      : {}),

    ...(profile.countryCode !== undefined
      ? {
          countryCode: profile.countryCode,
        }
      : {}),

    ...(profile.venue !== undefined
      ? {
          venue: profile.venue,
        }
      : {}),

    ...(profile.foundedYear !== undefined
      ? {
          foundedYear: profile.foundedYear,
        }
      : {}),

    ...(profile.description !== undefined
      ? {
          description: profile.description,
        }
      : {}),

    ...(profile.history !== undefined
      ? {
          history: profile.history,
        }
      : {}),

    ...(profile.websiteUrl !== undefined
      ? {
          websiteUrl: profile.websiteUrl,
        }
      : {}),

    ...(profile.active !== undefined
      ? {
          active: profile.active,
        }
      : {}),

    ...(profile.featured !== undefined
      ? {
          featured: profile.featured,
        }
      : {}),

    ...(profile.displayOrder !== undefined
      ? {
          displayOrder: profile.displayOrder,
        }
      : {}),

    ...(profile.metaTitle !== undefined
      ? {
          metaTitle: profile.metaTitle,
        }
      : {}),

    ...(profile.metaDescription !== undefined
      ? {
          metaDescription:
            profile.metaDescription,
        }
      : {}),
  };
}

export async function importTournamentProfile(
  dataset: TournamentHistoryDataset,
): Promise<TournamentProfileImportResult> {
  const profile =
    dataset.tournament;

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

  /*
   * Caso 1:
   * il torneo non esiste ancora.
   *
   * Se il dataset contiene tournament,
   * lo creiamo direttamente.
   */
  if (!tournament) {
    if (!profile) {
      throw new Error(
        [
          `Torneo non trovato per slug "${dataset.tournamentSlug}".`,
          "Il dataset non contiene la sezione tournament necessaria per crearlo.",
        ].join(" "),
      );
    }

    validateProfileText(
      profile,
    );

    const createdTournament =
      await prisma.tournament.create({
        data:
          buildTournamentCreateData(
            dataset.tournamentSlug,
            profile,
          ),

        select: {
          id: true,
          name: true,
        },
      });

    return {
      tournamentId:
        createdTournament.id,
      tournamentName:
        createdTournament.name,
      updated: true,
    };
  }

  /*
   * Caso 2:
   * il torneo esiste ma il dataset
   * non contiene un profilo.
   *
   * Manteniamo il record così com'è.
   */
  if (!profile) {
    return {
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      updated: false,
    };
  }

  validateProfileText(
    profile,
  );

  /*
   * Caso 3:
   * il torneo esiste e il dataset
   * contiene il profilo.
   *
   * Aggiorniamo solo i campi strutturali/editoriali.
   *
   * NON tocchiamo:
   * - heroImage
   * - logoUrl
   *
   * Le immagini restano sotto il controllo del CMS.
   */
  const data =
    buildTournamentUpdateData(
      profile,
    );

  const updatedTournament =
    await prisma.tournament.update({
      where: {
        id: tournament.id,
      },

      data,

      select: {
        id: true,
        name: true,
      },
    });

  return {
    tournamentId:
      updatedTournament.id,
    tournamentName:
      updatedTournament.name,
    updated: true,
  };
}