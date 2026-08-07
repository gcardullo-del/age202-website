export type TennisHistoryEntry = {
  month: number;
  day: number;
  year: number;
  title: string;
  description: string;
  category:
    | "Grand Slam"
    | "Ranking"
    | "Milestone"
    | "Rivalry"
    | "History";
};

/*
 * Archivio iniziale.
 *
 * Aggiungeremo progressivamente eventi verificati fino
 * a coprire l'intero calendario. Se per una determinata
 * data non esiste ancora una voce, la Home mostra uno
 * stato "archive entry in preparation".
 */
export const todayInTennisHistory: TennisHistoryEntry[] = [
  {
    month: 7,
    day: 16,
    year: 2023,
    title:
      "Alcaraz wins Wimbledon",
    description:
      "Carlos Alcaraz defeats Novak Djokovic in the Wimbledon final and claims his first title at the All England Club.",
    category:
      "Grand Slam",
  },
  {
    month: 9,
    day: 11,
    year: 2022,
    title:
      "Alcaraz wins the US Open",
    description:
      "Carlos Alcaraz captures his first Grand Slam title in New York and completes a historic breakthrough season.",
    category:
      "Grand Slam",
  },
  {
    month: 1,
    day: 28,
    year: 2024,
    title:
      "Sinner wins his first Grand Slam",
    description:
      "Jannik Sinner completes a two-set comeback in the Australian Open final to win his first major championship.",
    category:
      "Grand Slam",
  },
];

export function getTodayInTennisHistory(
  date = new Date(),
) {
  const month =
    date.getMonth() + 1;

  const day =
    date.getDate();

  return (
    todayInTennisHistory.find(
      (entry) =>
        entry.month === month &&
        entry.day === day,
    ) ?? null
  );
}
