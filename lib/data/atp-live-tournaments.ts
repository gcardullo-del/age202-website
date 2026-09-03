export type AtpLiveTournament = {
  cmsSlug: string;
  atpSlug: string;
  atpTournamentId: string;
  name: string;
  category: "MASTERS_1000";
  startDate: string;
  endDate: string;
};


export const atpMasters1000LiveRegistry: AtpLiveTournament[] = [
  {
    cmsSlug: "indian-wells",
    atpSlug: "indian-wells",
    atpTournamentId: "404",
    name: "BNP Paribas Open",
    category: "MASTERS_1000",
    startDate: "2026-03-04",
    endDate: "2026-03-15",
  },
  {
    cmsSlug: "miami-open",
    atpSlug: "miami",
    atpTournamentId: "403",
    name: "Miami Open",
    category: "MASTERS_1000",
    startDate: "2026-03-18",
    endDate: "2026-03-29",
  },
  {
    cmsSlug: "monte-carlo",
    atpSlug: "monte-carlo",
    atpTournamentId: "410",
    name: "Rolex Monte-Carlo Masters",
    category: "MASTERS_1000",
    startDate: "2026-04-05",
    endDate: "2026-04-12",
  },
  {
    cmsSlug: "madrid",
    atpSlug: "madrid",
    atpTournamentId: "1536",
    name: "Mutua Madrid Open",
    category: "MASTERS_1000",
    startDate: "2026-04-22",
    endDate: "2026-05-03",
  },
  {
    cmsSlug: "rome",
    atpSlug: "rome",
    atpTournamentId: "416",
    name: "Internazionali BNL d'Italia",
    category: "MASTERS_1000",
    startDate: "2026-05-06",
    endDate: "2026-05-17",
  },
  {
    cmsSlug: "canada",
    atpSlug: "montreal",
    atpTournamentId: "421",
    name: "National Bank Open",
    category: "MASTERS_1000",
    startDate: "2026-08-02",
    endDate: "2026-08-13",
  },
  {
    cmsSlug: "cincinnati",
    atpSlug: "cincinnati",
    atpTournamentId: "422",
    name: "Cincinnati Open",
    category: "MASTERS_1000",
    startDate: "2026-08-13",
    endDate: "2026-08-23",
  },
  {
    cmsSlug: "shanghai",
    atpSlug: "shanghai",
    atpTournamentId: "5014",
    name: "Rolex Shanghai Masters",
    category: "MASTERS_1000",
    startDate: "2026-10-07",
    endDate: "2026-10-18",
  },
  {
    cmsSlug: "paris",
    atpSlug: "paris",
    atpTournamentId: "352",
    name: "Rolex Paris Masters",
    category: "MASTERS_1000",
    startDate: "2026-11-02",
    endDate: "2026-11-08",
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
  tournament: AtpLiveTournament,
): Date {
  return new Date(
    `${tournament.startDate}T00:00:00.000Z`,
  );
}


function getTournamentEndDate(
  tournament: AtpLiveTournament,
): Date {
  return new Date(
    `${tournament.endDate}T23:59:59.999Z`,
  );
}


export function getActiveMasters1000(
  now = new Date(),
): AtpLiveTournament[] {
  const today =
    getUtcDayStart(
      now,
    );

  return atpMasters1000LiveRegistry.filter(
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


export function getCompletedMasters1000(
  now = new Date(),
): AtpLiveTournament[] {
  const today =
    getUtcDayStart(
      now,
    );

  return atpMasters1000LiveRegistry.filter(
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


export function getUpcomingMasters1000(
  now = new Date(),
): AtpLiveTournament[] {
  const today =
    getUtcDayStart(
      now,
    );

  return atpMasters1000LiveRegistry.filter(
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