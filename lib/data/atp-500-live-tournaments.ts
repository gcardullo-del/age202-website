export type Atp500LiveTournament = {
  cmsSlug: string;
  atpSlug: string;
  atpTournamentId: string;
  name: string;
  category: "ATP_500";
  startDate: string;
  endDate: string;
};

export const atp500LiveRegistry: Atp500LiveTournament[] = [
  {
    cmsSlug: "dallas",
    atpSlug: "dallas",
    atpTournamentId: "424",
    name: "Nexo Dallas Open",
    category: "ATP_500",
    startDate: "2026-02-09",
    endDate: "2026-02-15",
  },
  {
    cmsSlug: "rotterdam",
    atpSlug: "rotterdam",
    atpTournamentId: "407",
    name: "ABN AMRO Open",
    category: "ATP_500",
    startDate: "2026-02-09",
    endDate: "2026-02-15",
  },
  {
    cmsSlug: "doha",
    atpSlug: "doha",
    atpTournamentId: "451",
    name: "Qatar ExxonMobil Open",
    category: "ATP_500",
    startDate: "2026-02-16",
    endDate: "2026-02-21",
  },
  {
    cmsSlug: "rio",
atpSlug: "rio-de-janeiro",
atpTournamentId: "6932",
    name: "Rio Open presented by Claro",
    category: "ATP_500",
    startDate: "2026-02-16",
    endDate: "2026-02-22",
  },
  {
    cmsSlug: "acapulco",
    atpSlug: "acapulco",
    atpTournamentId: "807",
    name: "Abierto Mexicano Telcel presentado por HSBC",
    category: "ATP_500",
    startDate: "2026-02-23",
    endDate: "2026-02-28",
  },
  {
    cmsSlug: "dubai",
    atpSlug: "dubai",
    atpTournamentId: "495",
    name: "Dubai Duty Free Tennis Championships",
    category: "ATP_500",
    startDate: "2026-02-23",
    endDate: "2026-02-28",
  },
  {
    cmsSlug: "barcelona",
    atpSlug: "barcelona",
    atpTournamentId: "425",
    name: "Barcelona Open Banc Sabadell",
    category: "ATP_500",
    startDate: "2026-04-13",
    endDate: "2026-04-19",
  },
  {
    cmsSlug: "munich",
    atpSlug: "munich",
    atpTournamentId: "308",
    name: "BMW Open by Bitpanda",
    category: "ATP_500",
    startDate: "2026-04-13",
    endDate: "2026-04-19",
  },
  {
    cmsSlug: "hamburg",
    atpSlug: "hamburg",
    atpTournamentId: "414",
    name: "Bitpanda Hamburg Open",
    category: "ATP_500",
    startDate: "2026-05-17",
    endDate: "2026-05-23",
  },
  {
    cmsSlug: "halle",
    atpSlug: "halle",
    atpTournamentId: "500",
    name: "Terra Wortmann Open",
    category: "ATP_500",
    startDate: "2026-06-15",
    endDate: "2026-06-21",
  },
  {
    cmsSlug: "queens",
atpSlug: "london",
atpTournamentId: "311",
    name: "HSBC Championships",
    category: "ATP_500",
    startDate: "2026-06-15",
    endDate: "2026-06-21",
  },
  {
    cmsSlug: "washington",
    atpSlug: "washington",
    atpTournamentId: "418",
    name: "Mubadala DC Open",
    category: "ATP_500",
    startDate: "2026-07-27",
    endDate: "2026-08-02",
  },
  {
    cmsSlug: "tokyo",
    atpSlug: "tokyo",
    atpTournamentId: "329",
    name: "Kinoshita Group Japan Open Tennis Championships",
    category: "ATP_500",
    startDate: "2026-09-30",
    endDate: "2026-10-06",
  },
  {
    cmsSlug: "beijing",
    atpSlug: "beijing",
    atpTournamentId: "747",
    name: "China Open",
    category: "ATP_500",
    startDate: "2026-09-30",
    endDate: "2026-10-06",
  },
  {
    cmsSlug: "basel",
    atpSlug: "basel",
    atpTournamentId: "328",
    name: "Swiss Indoors Basel",
    category: "ATP_500",
    startDate: "2026-10-26",
    endDate: "2026-11-01",
  },
  {
    cmsSlug: "vienna",
    atpSlug: "vienna",
    atpTournamentId: "337",
    name: "Erste Bank Open",
    category: "ATP_500",
    startDate: "2026-10-26",
    endDate: "2026-11-01",
  },
];

export function getCompletedAtp500(
  now = new Date(),
): Atp500LiveTournament[] {
  const today = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ),
  );

  return atp500LiveRegistry.filter(
    (tournament) => {
      const endDate = new Date(
        `${tournament.endDate}T23:59:59.999Z`,
      );

      return endDate < today;
    },
  );
}
