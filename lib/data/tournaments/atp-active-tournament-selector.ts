import {
  getActiveGrandSlams,
  type AtpGrandSlamLiveTournament,
} from "./atp-grand-slam-live-tournaments";

import {
  getActiveMasters1000,
  type AtpLiveTournament,
} from "../atp-live-tournaments";

import {
  getActiveAtp500,
  type Atp500LiveTournament,
} from "../atp-500-live-tournaments";


export type ActiveAtpTournament =
  | AtpGrandSlamLiveTournament
  | AtpLiveTournament
  | Atp500LiveTournament;


export type ActiveAtpTournamentSelection = {
  category:
    | "GRAND_SLAM"
    | "MASTERS_1000"
    | "ATP_500"
    | null;

  tournaments:
    ActiveAtpTournament[];
};


/**
 * AGE202 live priority:
 *
 * 1. Grand Slam
 * 2. Masters 1000
 * 3. ATP 500
 *
 * ATP 250 are intentionally excluded.
 *
 * Grand Slams and Masters 1000 take precedence
 * over ATP 500 events.
 *
 * ATP 500 events may run concurrently, therefore
 * all active ATP 500 tournaments are returned.
 */
export function getActiveAtpTournaments(
  now = new Date(),
): ActiveAtpTournamentSelection {
  const activeGrandSlams =
    getActiveGrandSlams(
      now,
    );

  if (
    activeGrandSlams.length >
    0
  ) {
    return {
      category:
        "GRAND_SLAM",

      tournaments:
        activeGrandSlams,
    };
  }


  const activeMasters1000 =
    getActiveMasters1000(
      now,
    );

  if (
    activeMasters1000.length >
    0
  ) {
    return {
      category:
        "MASTERS_1000",

      tournaments:
        activeMasters1000,
    };
  }


  const activeAtp500 =
    getActiveAtp500(
      now,
    );

  if (
    activeAtp500.length >
    0
  ) {
    return {
      category:
        "ATP_500",

      tournaments:
        activeAtp500,
    };
  }


  return {
    category:
      null,

    tournaments:
      [],
  };
}


export function hasActiveAtpTournament(
  now = new Date(),
): boolean {
  return (
    getActiveAtpTournaments(
      now,
    ).tournaments.length >
    0
  );
}