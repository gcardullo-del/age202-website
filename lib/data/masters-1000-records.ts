export type Masters1000RecordIcon =
  | "titles"
  | "finals"
  | "streak"
  | "youngest"
  | "oldest"
  | "italy"
  | "latest"
  | "era";

export type Masters1000Record = {
  label: string;
  player: string;
  value: string;
  detail: string;
  icon: Masters1000RecordIcon;
  href?: string;
  accent?: string;
};

export type Masters1000RecordsData = {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  records: Masters1000Record[];
};

const recordsBySlug: Record<string, Masters1000RecordsData> = {
  "indian-wells": {
    eyebrow: "Tournament records",
    title: "The numbers behind the desert",
    description:
      "A premium snapshot of the champions, streaks and age records that define the men's singles history of Indian Wells.",
    note:
      "AGE202 will expand this module with match-duration records and complete edition-level statistics when the full results archive is connected.",
    records: [
      {
        label: "Most titles",
        player: "Roger Federer & Novak Djokovic",
        value: "5 titles",
        detail: "The two modern icons share the all-time men's singles record.",
        icon: "titles",
        href: "/archives/federer",
      },
      {
        label: "Most finals",
        player: "Roger Federer",
        value: "9 finals",
        detail: "A record span from his first title in 2004 to the 2019 final.",
        icon: "finals",
        href: "/archives/federer",
      },
      {
        label: "Consecutive titles",
        player: "Federer & Djokovic",
        value: "3 in a row",
        detail: "Federer won from 2004–06; Djokovic matched the streak from 2014–16.",
        icon: "streak",
      },
      {
        label: "Youngest champion",
        player: "Boris Becker",
        value: "19y 86d",
        detail: "The German lifted the trophy in 1987 before turning twenty.",
        icon: "youngest",
      },
      {
        label: "Oldest champion",
        player: "Roger Federer",
        value: "35y 210d",
        detail: "Federer set the age record with his 2017 triumph.",
        icon: "oldest",
        href: "/archives/federer",
      },
      {
        label: "Best Italian result",
        player: "Jannik Sinner",
        value: "Champion · 2026",
        detail: "Sinner became the first Italian men's singles champion at Indian Wells.",
        icon: "italy",
        href: "/archives/sinner",
      },
      {
        label: "Latest champion",
        player: "Jannik Sinner",
        value: "2026",
        detail: "Defeated Daniil Medvedev in two tie-break sets in the final.",
        icon: "latest",
        href: "/archives/sinner",
      },
      {
        label: "Three-title club",
        player: "Five champions",
        value: "3+ trophies",
        detail: "Connors, Chang, Nadal, Federer and Djokovic reached at least three titles.",
        icon: "era",
      },
    ],
  },
};

export function getMasters1000Records(slug: string): Masters1000RecordsData | null {
  return recordsBySlug[slug] ?? null;
}
