import { prisma } from "../lib/prisma";
import type { ExtractedAtpDailyMatch, ExtractedAtpDailyPlayer } from "./atp-tournament-daily-matches-extractor";
import type { ExtractedAtpTournamentMatch } from "./atp-tournament-matches-extractor";

type SetScore = { value: number; tiebreak?: number };
type Competitor = {
  type?: string;
  winner?: boolean;
  athlete?: { displayName?: string; fullName?: string };
  linescores?: SetScore[];
};
type Competition = {
  id?: string;
  date?: string;
  timeValid?: boolean;
  type?: { slug?: string };
  round?: { displayName?: string };
  venue?: { fullName?: string; court?: string };
  status?: { type?: { state?: string; completed?: boolean; name?: string; detail?: string } };
  notes?: { text?: string }[];
  competitors?: Competitor[];
};
type Event = {
  id?: string;
  name?: string;
  groupings?: { grouping?: { slug?: string }; competitions?: Competition[] }[];
};
type Params = {
  cmsTournamentSlug: string;
  tournamentSlug: string;
  tournamentId: string;
  year: number;
  date: string;
};
type Round = ExtractedAtpTournamentMatch["round"];
const IDS: Record<string, string> = { "329": "5", "747": "959" };
const ORDER: Record<Round, number> = {
  ROUND_OF_128: 1, ROUND_OF_64: 2, ROUND_OF_32: 3,
  ROUND_OF_16: 4, QUARTERFINAL: 5, SEMIFINAL: 6, FINAL: 7,
};
const LABEL: Record<Round, string> = {
  ROUND_OF_128: "Round of 128", ROUND_OF_64: "Round of 64",
  ROUND_OF_32: "Round of 32", ROUND_OF_16: "Round of 16",
  QUARTERFINAL: "Quarterfinals", SEMIFINAL: "Semifinals", FINAL: "Final",
};
const requests = new Map<string, Promise<Event[]>>();
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function isAtpAccessBlocked(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /ATP security verification blocked automated access|ATP[^\n]*HTTP 403\b/i.test(message);
}

async function fetchEvents(date: string): Promise<Event[]> {
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard?dates=${date.replace(/-/g, "")}`,
    { signal: AbortSignal.timeout(25_000) },
  );
  if (!response.ok) throw new Error(`ESPN scoreboard HTTP ${response.status}.`);
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("events" in data) || !Array.isArray(data.events)) {
    throw new Error("ESPN: invalid scoreboard response.");
  }
  return data.events as Event[];
}

async function load(params: Params) {
  let request = requests.get(params.date);
  if (!request) {
    request = fetchEvents(params.date);
    requests.set(params.date, request);
  }
  const events = await request;
  const id = IDS[params.tournamentId];
  const candidates = events.filter(event => id
    ? event.id === `${id}-${params.year}`
    : event.id?.endsWith(`-${params.year}`) && event.groupings?.some(group =>
      group.grouping?.slug === "mens-singles" && group.competitions?.some(match =>
        normalize(match.venue?.fullName?.split(",")[0] ?? "") === normalize(params.tournamentSlug),
      ),
    ));
  if (candidates.length !== 1) throw new Error(`ESPN: tournament identification failed for ${params.tournamentSlug}.`);
  const event = candidates[0]!;
  const group = event.groupings?.find(item => item.grouping?.slug === "mens-singles");
  if (!Array.isArray(group?.competitions)) throw new Error("ESPN: men's singles unavailable.");
  const competitions = group.competitions.filter(match => !/qualif/i.test(match.round?.displayName ?? ""));
  if (!competitions.length || competitions.some(match => match.type?.slug !== "mens-singles")) {
    throw new Error("ESPN: invalid main singles draw.");
  }
  // Derive numbered rounds from the complete bracket, including future placeholders.
  const numbered = competitions.map(match => /^Round (\d+)$/i.exec(match.round?.displayName ?? ""))
    .filter((match): match is RegExpExecArray => match !== null).map(match => Number(match[1]));
  const maxRound = Math.max(0, ...numbered);
  const drawSize = 2 ** (maxRound + 3);
  if (maxRound < 1 || maxRound > 4 || competitions.filter(match => /^Round 1$/i.test(match.round?.displayName ?? "")).length !== drawSize / 2) {
    throw new Error("ESPN: incomplete or unsupported bracket; cannot safely infer rounds.");
  }
  const roundOf = (match: Competition): Round => {
    const value = match.round?.displayName ?? "";
    if (/^quarterfinals?$/i.test(value)) return "QUARTERFINAL";
    if (/^semifinals?$/i.test(value)) return "SEMIFINAL";
    if (/^final$/i.test(value)) return "FINAL";
    const n = /^Round (\d+)$/i.exec(value);
    const size = n ? drawSize / 2 ** (Number(n[1]) - 1) : 0;
    if (![16, 32, 64, 128].includes(size)) throw new Error(`ESPN: unsupported round ${value}.`);
    return `ROUND_OF_${size}` as Round;
  };
  const roundCounts = new Map<Round, number>();
  const ids = new Set<string>();
  for (const match of competitions) {
    if (!match.id || ids.has(match.id)) throw new Error("ESPN: missing or duplicate match ID.");
    ids.add(match.id);
    const round = roundOf(match);
    roundCounts.set(round, (roundCounts.get(round) ?? 0) + 1);
  }
  for (const [round, count] of roundCounts) {
    const slots = 2 ** (7 - ORDER[round]);
    if (count !== slots) throw new Error(`ESPN: incomplete ${round} bracket (${count}/${slots}).`);
  }
  // Read existing entry identities: ESPN athlete IDs must never become ATP IDs.
  const tournament = await prisma.tournament.findUnique({ where: { slug: params.cmsTournamentSlug }, select: { id: true } });
  if (!tournament) throw new Error(`Unknown AGE202 tournament: ${params.cmsTournamentSlug}.`);
  const edition = await prisma.tournamentEdition.findUnique({
    where: { tournamentId_year_editionKey_circuit: { tournamentId: tournament.id, year: params.year, editionKey: "main", circuit: "ATP" } },
    select: { id: true },
  });
  const entries = edition ? await prisma.tournamentEntry.findMany({
    where: { editionId: edition.id }, select: { name: true, externalId: true },
  }) : [];
  const player = (competitor: Competitor): ExtractedAtpDailyPlayer => {
    const name = (competitor.athlete?.fullName ?? competitor.athlete?.displayName ?? "").trim();
    if (competitor.type !== "athlete" || !name || /^TBD$/i.test(name)) throw new Error("ESPN: missing singles player.");
    const matching = entries.filter(entry => normalize(entry.name) === normalize(name));
    if (matching.length > 1) throw new Error(`AGE202: ambiguous entries for ${name}.`);
    const entry = matching[0];
    if (!entry) return { name, href: null, profileSlug: null, externalId: null };
    const key = entry.externalId ?? "";
    if (!/^(atp:|atp-slug:|atp-name:)/.test(key)) throw new Error(`AGE202: unsupported player key for ${name}.`);
    if (key.startsWith("atp-name:") && key !== `atp-name:${normalize(entry.name)}`) throw new Error(`AGE202: inconsistent name key for ${name}.`);
    return {
      name: entry.name, href: null,
      profileSlug: key.startsWith("atp-slug:") ? key.slice(9) : null,
      externalId: key.startsWith("atp:") ? key.slice(4) : null,
    };
  };
  console.log(`ESPN fallback: ${event.name ?? event.id}; bracket ${drawSize}.`);
  return { competitions, drawSize, roundOf, player };
}

function pair(match: Competition): [Competitor, Competitor] {
  if (!Array.isArray(match.competitors) || match.competitors.length !== 2) throw new Error(`ESPN: invalid players for ${match.id}.`);
  return [match.competitors[0]!, match.competitors[1]!];
}

function outcome(match: Competition): ExtractedAtpTournamentMatch["resultType"] {
  const text = [match.status?.type?.name, match.status?.type?.detail, ...(match.notes ?? []).map(note => note.text)].join(" ");
  if (/walkover|walk over|\bW\/?O\b/i.test(text)) return "WALKOVER";
  if (/retired|retirement|\bRET\b/i.test(text)) return "RETIREMENT";
  if (/default|disqualif/i.test(text)) return "DEFAULT";
  if (/abandon|cancel/i.test(text)) throw new Error(`ESPN: cancelled/abandoned match ${match.id} requires review.`);
  return "STANDARD";
}

function score(one: Competitor, two: Competitor, result: ReturnType<typeof outcome>): string | null {
  const a = one.linescores ?? [], b = two.linescores ?? [];
  if (a.length !== b.length || a.length > 5) throw new Error("ESPN: inconsistent set scores.");
  if (!a.length) {
    if (result === "WALKOVER") return "W/O";
    if (result === "DEFAULT") return "DEF";
    return null;
  }
  const sets = a.map((set, i) => {
    const other = b[i]!;
    if (![set.value, other.value].every(value => Number.isInteger(value) && value >= 0 && value <= 100)) throw new Error("ESPN: invalid set score.");
    const tie = set.value > other.value ? other.tiebreak : set.tiebreak;
    return `${set.value}-${other.value}${(set.value === 7 && other.value === 6 || set.value === 6 && other.value === 7) && Number.isInteger(tie) ? `(${tie})` : ""}`;
  }).join(" ");
  return `${sets}${result === "RETIREMENT" ? " RET" : result === "DEFAULT" ? " DEF" : result === "WALKOVER" ? " W/O" : ""}`;
}

export async function extractEspnAtpDailyMatches(params: Params) {
  const context = await load(params);
  const matches: ExtractedAtpDailyMatch[] = [];
  for (const match of context.competitions) {
    if (!match.date || match.date.slice(0, 10) !== params.date) continue;
    const [one, two] = pair(match);
    // Future bracket placeholders do not identify actual scheduled opponents.
    if ([one, two].some(p => /^TBD$/i.test(p.athlete?.displayName ?? p.athlete?.fullName ?? ""))) continue;
    const state = match.status?.type;
    if (!state || !["pre", "in", "post"].includes(state.state ?? "")) throw new Error(`ESPN: unknown status ${match.id}.`);
    const completed = state.state === "post" && state.completed === true;
    if (state.state === "post" && !completed) throw new Error(`ESPN: unresolved result ${match.id}.`);
    if (completed && Number(one.winner === true) + Number(two.winner === true) !== 1) throw new Error(`ESPN: ambiguous winner ${match.id}.`);
    const playerOne = context.player(one), playerTwo = context.player(two);
    const winner = completed ? (one.winner ? playerOne : playerTwo) : null;
    const result = completed ? outcome(match) : "STANDARD";
    const summary = completed && two.winner ? score(two, one, result) : score(one, two, result);
    if (completed && result === "STANDARD" && !summary) throw new Error(`ESPN: final score missing ${match.id}.`);
    const scheduledAt = match.timeValid ? new Date(match.date) : null;
    if (scheduledAt && Number.isNaN(scheduledAt.getTime())) throw new Error(`ESPN: invalid date ${match.id}.`);
    matches.push({
      externalId: `atp:daily:espn:${match.id}`,
      playerOne, playerTwo, winner,
      status: completed ? "COMPLETED" : state.state === "in" ? "LIVE" : "SCHEDULED",
      scheduledAt, court: match.venue?.court?.trim() || null,
      roundLabel: LABEL[context.roundOf(match)], score: summary,
      sourceText: `ESPN competition ${match.id}`,
    });
  }
  return { source: "ESPN" as const, scheduleLabel: params.date, extractedAt: new Date(), matches };
}

export async function extractEspnAtpCompletedResults(params: Params) {
  const context = await load(params);
  const matches: ExtractedAtpTournamentMatch[] = [];
  const players = new Map<string, ExtractedAtpDailyPlayer>();
  const counters = new Map<Round, number>();
  for (const match of context.competitions) {
    if (match.status?.type?.state !== "post" || !match.status.type.completed) continue;
    const [one, two] = pair(match);
    if (Number(one.winner === true) + Number(two.winner === true) !== 1) throw new Error(`ESPN: ambiguous winner ${match.id}.`);
    const playerOne = context.player(one), playerTwo = context.player(two);
    const winner = one.winner ? playerOne : playerTwo, loser = one.winner ? playerTwo : playerOne;
    const resultType = outcome(match);
    const summary = one.winner ? score(one, two, resultType) : score(two, one, resultType);
    if (resultType === "STANDARD" && !summary) throw new Error(`ESPN: final score missing ${match.id}.`);
    const round = context.roundOf(match);
    const number = (counters.get(round) ?? 0) + 1;
    counters.set(round, number);
    for (const p of [playerOne, playerTwo]) players.set(normalize(p.name), p);
    matches.push({
      externalId: `espn:result:${match.id}`, round, roundOrder: ORDER[round],
      // Progressive service preserves existing positions or assigns safe provisional numbers.
      matchNumber: number, bracketPosition: number,
      playerOne, playerTwo, winner, loser, score: summary,
      court: match.venue?.court?.trim() || null, resultType,
      sourceText: `ESPN competition ${match.id}`,
    });
  }
  return { source: "ESPN" as const, drawSize: context.drawSize, extractedAt: new Date(), players: [...players.values()], matches };
}
