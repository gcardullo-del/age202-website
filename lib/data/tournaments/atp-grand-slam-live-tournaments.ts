export type AtpGrandSlamLiveTournament = {
  cmsSlug:
    | "australian-open"
    | "roland-garros"
    | "wimbledon"
    | "us-open";

  atpSlug: string;
  atpTournamentId: string;
  name: string;
  category: "GRAND_SLAM";
  startDate: string;
  endDate: string;
};


export const atpGrandSlamLiveRegistry:
  AtpGrandSlamLiveTournament[] = [
    {
      cmsSlug: "australian-open",
      atpSlug: "australian-open",
      atpTournamentId: "580",
      name: "Australian Open",
      category: "GRAND_SLAM",
      startDate: "2026-01-18",
      endDate: "2026-02-01",
    },
    {
      cmsSlug: "roland-garros",
      atpSlug: "roland-garros",
      atpTournamentId: "520",
      name: "Roland Garros",
      category: "GRAND_SLAM",
      startDate: "2026-05-24",
      endDate: "2026-06-07",
    },
    {
      cmsSlug: "wimbledon",
      atpSlug: "wimbledon",
      atpTournamentId: "540",
      name: "Wimbledon",
      category: "GRAND_SLAM",
      startDate: "2026-06-29",
      endDate: "2026-07-12",
    },
    {
      cmsSlug: "us-open",
      atpSlug: "us-open",
      atpTournamentId: "560",
      name: "US Open",
      category: "GRAND_SLAM",
      startDate: "2026-08-30",
      endDate: "2026-09-13",
    },
  ];


function getUtcDayStart(
  value: Date,
): Date {
  return new Date(
    Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate(),
    ),
  );
}


function getTournamentStartDate(
  tournament: AtpGrandSlamLiveTournament,
): Date {
  return new Date(
    `${tournament.startDate}T00:00:00.000Z`,
  );
}


function getTournamentEndDate(
  tournament: AtpGrandSlamLiveTournament,
): Date {
  return new Date(
    `${tournament.endDate}T23:59:59.999Z`,
  );
}


export function getActiveGrandSlams(
  now = new Date(),
): AtpGrandSlamLiveTournament[] {
  const today =
    getUtcDayStart(
      now,
    );

  return atpGrandSlamLiveRegistry.filter(
    (tournament) => {
      const startDate =
        getTournamentStartDate(
          tournament,
        );

      const endDate =
        getTournamentEndDate(
          tournament,
        );

      return (
        today.getTime() >=
          startDate.getTime() &&
        today.getTime() <=
          endDate.getTime()
      );
    },
  );
}


export function getCompletedGrandSlams(
  now = new Date(),
): AtpGrandSlamLiveTournament[] {
  const today =
    getUtcDayStart(
      now,
    );

  return atpGrandSlamLiveRegistry.filter(
    (tournament) => {
      const endDate =
        getTournamentEndDate(
          tournament,
        );

      return (
        endDate.getTime() <
        today.getTime()
      );
    },
  );
}


export function getUpcomingGrandSlams(
  now = new Date(),
): AtpGrandSlamLiveTournament[] {
  const today =
    getUtcDayStart(
      now,
    );

  return atpGrandSlamLiveRegistry.filter(
    (tournament) => {
      const startDate =
        getTournamentStartDate(
          tournament,
        );

      return (
        startDate.getTime() >
        today.getTime()
      );
    },
  );
}