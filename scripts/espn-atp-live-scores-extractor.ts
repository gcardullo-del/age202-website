import type { ExtractedAtpLiveScoreMatch } from "./atp-live-scores-extractor";

type Competitor = {
  type?: string;
  athlete?: {
    shortName?: string;
    displayName?: string;
  };
  linescores?: { value?: number }[];
};

type Competition = {
  id?: string;
  status?: {
    type?: {
      state?: string;
      completed?: boolean;
    };
  };
  type?: { slug?: string };
  round?: { displayName?: string };
  venue?: {
    fullName?: string;
    court?: string;
  };
  competitors?: Competitor[];
  wasSuspended?: boolean;
};

type EspnEvent = {
  id?: string;
  name?: string;
  groupings?: {
    grouping?: { slug?: string };
    competitions?: Competition[];
  }[];
};

type Scoreboard = {
  events: EspnEvent[];
};

// Gli ID ESPN sono diversi dagli ID ATP.
// Questi due abbinamenti sono stati verificati.
const ESPN_IDS: Record<string, string> = {
  "329": "5",
  "747": "959",
};

const requests = new Map<string, Promise<Scoreboard>>();

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function singles(event: EspnEvent): Competition[] {
  if (!Array.isArray(event.groupings)) {
    throw new Error("ESPN: invalid tournament groupings.");
  }

  const group = event.groupings.find(
    item => item.grouping?.slug === "mens-singles",
  );

  if (!group || !Array.isArray(group.competitions)) {
    throw new Error("ESPN: men's singles data unavailable.");
  }

  return group.competitions;
}

async function fetchScoreboard(date: string): Promise<Scoreboard> {
  const url =
    `https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard?dates=${date}`;

  const response = await fetch(url, {
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`ESPN scoreboard HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (
    !data ||
    typeof data !== "object" ||
    !("events" in data) ||
    !Array.isArray(data.events)
  ) {
    throw new Error("ESPN: invalid scoreboard response.");
  }

  return data as Scoreboard;
}

function scores(player: Competitor): string[] {
  if (
    !Array.isArray(player.linescores) ||
    player.linescores.length === 0 ||
    player.linescores.length > 5
  ) {
    throw new Error("ESPN: missing or invalid live set scores.");
  }

  return player.linescores.map(set => {
    if (
      typeof set.value !== "number" ||
      !Number.isInteger(set.value) ||
      set.value < 0 ||
      set.value > 100
    ) {
      throw new Error("ESPN: invalid set score value.");
    }

    return String(set.value);
  });
}

function name(player: Competitor): string {
  const value =
    player.athlete?.shortName ??
    player.athlete?.displayName;

  if (
    player.type !== "athlete" ||
    typeof value !== "string" ||
    value.trim().length < 2 ||
    value.trim().toUpperCase() === "TBD"
  ) {
    throw new Error("ESPN: invalid singles player.");
  }

  return value.trim();
}

function roundLabel(value: string | undefined): string | null {
  if (!value) return null;

  if (/^quarterfinals?$/i.test(value)) return "Quarterfinals";
  if (/^semifinals?$/i.test(value)) return "Semifinals";
  if (/^final$/i.test(value)) return "Final";

  const match = value.match(/^Round of (128|64|32|16)$/i);

  // "Round 2" dipende dalla dimensione del tabellone:
  // non inventiamo un turno ATP.
  return match ? `Round of ${match[1]}` : null;
}

export async function extractEspnAtpLiveScores(params: {
  tournamentSlug: string;
  tournamentId: string;
}): Promise<ExtractedAtpLiveScoreMatch[]> {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (type: string) =>
    parts.find(item => item.type === type)?.value;

  const year = part("year");
  const date = `${year}${part("month")}${part("day")}`;

  let request = requests.get(date);

  if (!request) {
    request = fetchScoreboard(date);
    requests.set(date, request);
  }

  const data = await request;
  const espnId = ESPN_IDS[params.tournamentId];

  const candidates = data.events.filter(event => {
    if (espnId) {
      return event.id === `${espnId}-${year}`;
    }

    // Per altri tornei accettiamo solo una città identica.
    // Nessun abbinamento approssimativo tra nomi di tornei.
    const city = normalize(params.tournamentSlug);

    return event.groupings?.some(group =>
      group.grouping?.slug === "mens-singles" &&
      group.competitions?.some(match =>
        normalize(
          match.venue?.fullName?.split(",")[0] ?? "",
        ) === city,
      ),
    );
  });

  if (candidates.length !== 1) {
    throw new Error(
      `ESPN: cannot uniquely identify ${params.tournamentSlug} (${candidates.length} tournaments).`,
    );
  }

  const event = candidates[0]!;

  console.log(`ESPN fallback: ${event.name ?? event.id}`);

  const matches: ExtractedAtpLiveScoreMatch[] = [];
  const seen = new Set<string>();

  for (const match of singles(event)) {
    if (
      match.status?.type?.state !== "in" ||
      match.status.type.completed ||
      match.wasSuspended ||
      /qualif/i.test(match.round?.displayName ?? "")
    ) {
      continue;
    }

    if (
      match.type?.slug !== "mens-singles" ||
      !Array.isArray(match.competitors) ||
      match.competitors.length !== 2
    ) {
      throw new Error("ESPN: invalid live singles competition.");
    }

    const [one, two] = match.competitors;

    const playerOne = name(one!);
    const playerTwo = name(two!);
    const oneScores = scores(one!);
    const twoScores = scores(two!);

    if (oneScores.length !== twoScores.length) {
      throw new Error("ESPN: inconsistent set score rows.");
    }

    const key = [playerOne, playerTwo].sort().join("|");

    if (seen.has(key)) continue;

    seen.add(key);

    matches.push({
      roundLabel: roundLabel(match.round?.displayName),
      court: match.venue?.court?.trim() || null,
      status: "LIVE",
      playerOne: { name: playerOne },
      playerTwo: { name: playerTwo },
      playerOneCurrentGame: null,
      playerTwoCurrentGame: null,
      playerOneSetScores: oneScores,
      playerTwoSetScores: twoScores,
      sourceText: `ESPN ${match.id}: ${playerOne} vs ${playerTwo}`,
    });
  }

  return matches;
}