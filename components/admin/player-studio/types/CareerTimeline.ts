import type {
  CareerEventCategory,
} from "@/generated/prisma/client";

export type CareerTimelineItem = {
  id: string;
  year: number;
  month: number | null;
  day: number | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  category: CareerEventCategory;
  imageUrl: string | null;
  location: string | null;
  tournament: string | null;
  featured: boolean;
  sortOrder: number;
};

export type CareerTimelineDraft = {
  clientId: string;
  year: string;
  month: string;
  day: string;
  title: string;
  subtitle: string;
  description: string;
  category: CareerEventCategory;
  imageUrl: string;
  location: string;
  tournament: string;
  featured: boolean;
  sortOrder: number;
};

export const CAREER_EVENT_CATEGORIES: Array<{
  value: CareerEventCategory;
  label: string;
  description: string;
}> = [
  {
    value: "DEBUT",
    label: "Debut",
    description:
      "Professional debut or first major appearance.",
  },
  {
    value: "RANKING",
    label: "Ranking",
    description:
      "World ranking milestone or career-high achievement.",
  },
  {
    value: "TITLE",
    label: "Title",
    description:
      "ATP, WTA or professional tournament victory.",
  },
  {
    value: "GRAND_SLAM",
    label: "Grand Slam",
    description:
      "Australian Open, Roland Garros, Wimbledon or US Open.",
  },
  {
    value: "MASTERS_1000",
    label: "Masters 1000",
    description:
      "Masters 1000 title, final or defining tournament moment.",
  },
  {
    value: "ATP_FINALS",
    label: "ATP Finals",
    description:
      "Year-end championship milestone.",
  },
  {
    value: "OLYMPICS",
    label: "Olympics",
    description:
      "Olympic medal or significant Olympic appearance.",
  },
  {
    value: "DAVIS_CUP",
    label: "Davis Cup",
    description:
      "National-team achievement or memorable tie.",
  },
  {
    value: "RIVALRY",
    label: "Rivalry",
    description:
      "Defining match or chapter in a major rivalry.",
  },
  {
    value: "COMEBACK",
    label: "Comeback",
    description:
      "Return from injury, absence or a difficult period.",
  },
  {
    value: "RETIREMENT",
    label: "Retirement",
    description:
      "Retirement announcement, farewell or final match.",
  },
  {
    value: "MILESTONE",
    label: "Milestone",
    description:
      "Career record, historic achievement or key turning point.",
  },
  {
    value: "OTHER",
    label: "Other",
    description:
      "Any relevant event not covered by the other categories.",
  },
];

export const DEFAULT_CAREER_EVENT_CATEGORY: CareerEventCategory =
  "MILESTONE";

export function createEmptyCareerTimelineDraft(
  sortOrder = 0,
): CareerTimelineDraft {
  return {
    clientId: createCareerTimelineClientId(),
    year: "",
    month: "",
    day: "",
    title: "",
    subtitle: "",
    description: "",
    category:
      DEFAULT_CAREER_EVENT_CATEGORY,
    imageUrl: "",
    location: "",
    tournament: "",
    featured: false,
    sortOrder,
  };
}

export function createCareerTimelineClientId(): string {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `career-event-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function getCareerEventCategoryLabel(
  category: CareerEventCategory,
): string {
  return (
    CAREER_EVENT_CATEGORIES.find(
      (option) =>
        option.value === category,
    )?.label ?? "Other"
  );
}

export function normalizeCareerTimelineDraft(
  draft: CareerTimelineDraft,
): CareerTimelineDraft {
  return {
    ...draft,
    year: draft.year.trim(),
    month: draft.month.trim(),
    day: draft.day.trim(),
    title: draft.title.trim(),
    subtitle: draft.subtitle.trim(),
    description: draft.description.trim(),
    imageUrl: draft.imageUrl.trim(),
    location: draft.location.trim(),
    tournament: draft.tournament.trim(),
    sortOrder: Math.max(
      0,
      Math.trunc(draft.sortOrder),
    ),
  };
}

export function validateCareerTimelineDraft(
  draft: CareerTimelineDraft,
): string[] {
  const errors: string[] = [];

  const year =
    Number.parseInt(
      draft.year,
      10,
    );

  if (
    !Number.isInteger(year) ||
    year < 1800 ||
    year > 2100
  ) {
    errors.push(
      "Year must be between 1800 and 2100.",
    );
  }

  if (!draft.title.trim()) {
    errors.push(
      "Event title is required.",
    );
  }

  const month =
    draft.month.trim()
      ? Number.parseInt(
          draft.month,
          10,
        )
      : null;

  if (
    month !== null &&
    (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    )
  ) {
    errors.push(
      "Month must be between 1 and 12.",
    );
  }

  const day =
    draft.day.trim()
      ? Number.parseInt(
          draft.day,
          10,
        )
      : null;

  if (
    day !== null &&
    (
      !Number.isInteger(day) ||
      day < 1 ||
      day > 31
    )
  ) {
    errors.push(
      "Day must be between 1 and 31.",
    );
  }

  return errors;
}

export function sortCareerTimelineItems<
  T extends {
    year: number;
    month: number | null;
    day: number | null;
    sortOrder: number;
  },
>(
  items: T[],
): T[] {
  return [...items].sort(
    (first, second) => {
      if (
        first.year !== second.year
      ) {
        return (
          first.year -
          second.year
        );
      }

      const firstMonth =
        first.month ?? 0;

      const secondMonth =
        second.month ?? 0;

      if (
        firstMonth !== secondMonth
      ) {
        return (
          firstMonth -
          secondMonth
        );
      }

      const firstDay =
        first.day ?? 0;

      const secondDay =
        second.day ?? 0;

      if (
        firstDay !== secondDay
      ) {
        return (
          firstDay -
          secondDay
        );
      }

      return (
        first.sortOrder -
        second.sortOrder
      );
    },
  );
}