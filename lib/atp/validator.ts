export type AtpRankingSourcePlayer = {
  rank: number;
  previousRank?: number | null;

  name: string;
  firstName?: string | null;
  lastName?: string | null;
  slug: string;

  country: string;
  countryCode: string;

  points: number;
  age?: number | null;

  imageUrl?: string | null;
};

export type AtpRankingSourceFile = {
  rankingDate: string;
  source: string;
  players: AtpRankingSourcePlayer[];
};

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function validateOptionalString(
  value: unknown,
  fieldName: string,
  playerName: string,
) {
  if (
    value !== undefined &&
    value !== null &&
    typeof value !== "string"
  ) {
    throw new Error(
      `Il campo "${fieldName}" di ${playerName} deve essere una stringa.`,
    );
  }
}

function validatePlayer(
  value: unknown,
  index: number,
): asserts value is AtpRankingSourcePlayer {
  const row = index + 1;

  if (!isObject(value)) {
    throw new Error(
      `Il giocatore alla riga ${row} non è un oggetto valido.`,
    );
  }

  if (
    !Number.isInteger(value.rank) ||
    Number(value.rank) < 1
  ) {
    throw new Error(
      `Posizione ATP non valida alla riga ${row}.`,
    );
  }

  if (
    value.previousRank !== undefined &&
    value.previousRank !== null &&
    (
      !Number.isInteger(value.previousRank) ||
      Number(value.previousRank) < 1
    )
  ) {
    throw new Error(
      `Posizione precedente non valida alla riga ${row}.`,
    );
  }

  if (
    typeof value.name !== "string" ||
    value.name.trim().length === 0
  ) {
    throw new Error(
      `Nome mancante alla riga ${row}.`,
    );
  }

  const playerName = value.name.trim();

  if (
    typeof value.slug !== "string" ||
    value.slug.trim().length === 0
  ) {
    throw new Error(
      `Slug mancante per ${playerName}.`,
    );
  }

  if (
    typeof value.country !== "string" ||
    value.country.trim().length === 0
  ) {
    throw new Error(
      `Nazione mancante per ${playerName}.`,
    );
  }

  if (
    typeof value.countryCode !== "string" ||
    value.countryCode.trim().length !== 3
  ) {
    throw new Error(
      `Codice nazione non valido per ${playerName}. Deve avere 3 caratteri.`,
    );
  }

  if (
    !Number.isInteger(value.points) ||
    Number(value.points) < 0
  ) {
    throw new Error(
      `Punti ATP non validi per ${playerName}.`,
    );
  }

  if (
    value.age !== undefined &&
    value.age !== null &&
    (
      !Number.isInteger(value.age) ||
      Number(value.age) < 14 ||
      Number(value.age) > 60
    )
  ) {
    throw new Error(
      `Età non valida per ${playerName}.`,
    );
  }

  validateOptionalString(
    value.firstName,
    "firstName",
    playerName,
  );

  validateOptionalString(
    value.lastName,
    "lastName",
    playerName,
  );

  validateOptionalString(
    value.imageUrl,
    "imageUrl",
    playerName,
  );
}

export function validateAtpRankingSource(
  value: unknown,
): asserts value is AtpRankingSourceFile {
  if (!isObject(value)) {
    throw new Error(
      "Il file della classifica ATP deve contenere un oggetto JSON.",
    );
  }

  if (
    typeof value.rankingDate !== "string" ||
    Number.isNaN(Date.parse(value.rankingDate))
  ) {
    throw new Error(
      'Il campo "rankingDate" è assente oppure non contiene una data valida.',
    );
  }

  if (
    typeof value.source !== "string" ||
    value.source.trim().length === 0
  ) {
    throw new Error(
      'Il campo "source" è obbligatorio.',
    );
  }

  if (
    !Array.isArray(value.players) ||
    value.players.length === 0
  ) {
    throw new Error(
      "Il file non contiene giocatori ATP.",
    );
  }

  const ranks = new Set<number>();
  const slugs = new Set<string>();

  value.players.forEach((player, index) => {
    validatePlayer(player, index);

    if (ranks.has(player.rank)) {
      throw new Error(
        `Posizione ATP duplicata: ${player.rank}.`,
      );
    }

    ranks.add(player.rank);

    const normalizedSlug = player.slug
      .trim()
      .toLowerCase();

    if (slugs.has(normalizedSlug)) {
      throw new Error(
        `Slug duplicato: ${normalizedSlug}.`,
      );
    }

    slugs.add(normalizedSlug);
  });
}