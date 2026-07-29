import { createIndianWellsTournament } from "./indian-wells";
import type { TournamentRegistry } from "./types";

export const tournamentRegistry: TournamentRegistry = {
  "indian-wells": createIndianWellsTournament,
};

export type {
  TournamentConfig,
  TournamentConfigFactory,
  TournamentRegistry,
  TournamentSections,
} from "./types";
