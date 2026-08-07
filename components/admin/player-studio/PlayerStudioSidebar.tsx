"use client";

import {
  AlertTriangle,
  Check,
  Circle,
  FolderKanban,
  ImageIcon,
  Landmark,
  Search,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

export type PlayerStudioSectionId =
  | "identity"
  | "atp"
  | "media"
  | "biography"
  | "career"
  | "collections"
  | "seo"
  | "publishing";

export type PlayerStudioSectionStatus =
  | "complete"
  | "warning"
  | "empty"
  | "neutral";

export type PlayerStudioSectionItem = {
  id: PlayerStudioSectionId;
  label: string;
  description: string;
  status?: PlayerStudioSectionStatus;
  statusLabel?: string;
};

type PlayerStudioSidebarProps = {
  activeSection: PlayerStudioSectionId;
  onSectionChange: (
    sectionId: PlayerStudioSectionId,
  ) => void;
  sections?: PlayerStudioSectionItem[];
  completion?: number;
  warnings?: string[];
};

const defaultSections: PlayerStudioSectionItem[] = [
  {
    id: "identity",
    label: "Identity",
    description: "Name, slug and archive identity",
    status: "neutral",
  },
  {
    id: "atp",
    label: "ATP",
    description: "Ranking connection and tour data",
    status: "neutral",
  },
  {
    id: "media",
    label: "Media",
    description: "Hero and portrait imagery",
    status: "neutral",
  },
  {
    id: "biography",
    label: "Biography",
    description: "Quote and editorial story",
    status: "neutral",
  },
  {
    id: "career",
    label: "Career",
    description: "Profile, titles and achievements",
    status: "neutral",
  },
  {
    id: "collections",
    label: "Collections",
    description: "Museum relationships",
    status: "neutral",
  },
  {
    id: "seo",
    label: "SEO",
    description: "Search and social metadata",
    status: "neutral",
  },
  {
    id: "publishing",
    label: "Publishing",
    description: "Visibility and archive state",
    status: "neutral",
  },
];

const sectionIcons = {
  identity: UserRound,
  atp: Trophy,
  media: ImageIcon,
  biography: Landmark,
  career: Sparkles,
  collections: FolderKanban,
  seo: Search,
  publishing: Circle,
} satisfies Record<
  PlayerStudioSectionId,
  typeof UserRound
>;

function clampCompletion(
  value: number,
): number {
  return Math.min(
    Math.max(
      Math.round(value),
      0,
    ),
    100,
  );
}

function getQualityLabel(
  completion: number,
): string {
  if (completion >= 90) {
    return "Museum Ready";
  }

  if (completion >= 75) {
    return "Excellent";
  }

  if (completion >= 55) {
    return "Established";
  }

  if (completion >= 30) {
    return "Developing";
  }

  return "Draft";
}

function getStatusClasses(
  status: PlayerStudioSectionStatus,
): string {
  switch (status) {
    case "complete":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

    case "warning":
      return "border-amber-400/20 bg-amber-400/10 text-amber-200";

    case "empty":
      return "border-red-400/20 bg-red-400/10 text-red-200";

    case "neutral":
      return "border-white/10 bg-white/[0.04] text-white/35";
  }
}

function getStatusLabel(
  status: PlayerStudioSectionStatus,
): string {
  switch (status) {
    case "complete":
      return "Complete";

    case "warning":
      return "Needs work";

    case "empty":
      return "Missing";

    case "neutral":
      return "Not started";
  }
}

function SectionStatusIcon({
  status,
}: {
  status: PlayerStudioSectionStatus;
}) {
  if (status === "complete") {
    return (
      <Check
        className="h-3.5 w-3.5"
        aria-hidden="true"
      />
    );
  }

  if (
    status === "warning" ||
    status === "empty"
  ) {
    return (
      <AlertTriangle
        className="h-3.5 w-3.5"
        aria-hidden="true"
      />
    );
  }

  return (
    <Circle
      className="h-3 w-3"
      aria-hidden="true"
    />
  );
}

export default function PlayerStudioSidebar({
  activeSection,
  onSectionChange,
  sections = defaultSections,
  completion = 0,
  warnings = [],
}: PlayerStudioSidebarProps) {
  const safeCompletion =
    clampCompletion(completion);

  const qualityLabel =
    getQualityLabel(
      safeCompletion,
    );

  const statusCounts =
    sections.reduce(
      (counts, section) => {
        const status =
          section.status ??
          "neutral";

        counts[status] += 1;

        return counts;
      },
      {
        complete: 0,
        warning: 0,
        empty: 0,
        neutral: 0,
      } satisfies Record<
        PlayerStudioSectionStatus,
        number
      >,
    );

  const attentionCount =
    statusCounts.warning +
    statusCounts.empty;

  return (
    <aside className="border-b border-white/10 bg-[#07101D]/55 xl:border-b-0 xl:border-r">
      <div className="p-4 xl:sticky xl:top-20">
        <div className="rounded-2xl border border-white/10 bg-[#050B18]/75 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-lime-200/70">
                Archive quality
              </p>

              <p className="mt-2 text-2xl font-semibold text-white">
                {qualityLabel}
              </p>

              <p className="mt-1 font-mono text-[8px] font-black uppercase tracking-[0.14em] text-white/30">
                {safeCompletion}/100
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-full border border-lime-300/20 bg-lime-300/10 text-sm font-black text-lime-200">
              {safeCompletion}
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-lime-300 transition-[width] duration-500 motion-reduce:transition-none"
              style={{
                width: `${safeCompletion}%`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatusSummary
              label="Complete"
              value={
                statusCounts.complete
              }
              tone="success"
            />

            <StatusSummary
              label="Attention"
              value={
                attentionCount
              }
              tone="warning"
            />

            <StatusSummary
              label="Pending"
              value={
                statusCounts.neutral
              }
              tone="neutral"
            />
          </div>
        </div>

        <nav
          aria-label="Player Studio sections"
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-1">
            {sections.map((section) => {
              const Icon =
                sectionIcons[section.id];

              const isActive =
                activeSection ===
                section.id;

              const status =
                section.status ??
                "neutral";

              const statusLabel =
                section.statusLabel ??
                getStatusLabel(
                  status,
                );

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() =>
                    onSectionChange(
                      section.id,
                    )
                  }
                  aria-current={
                    isActive
                      ? "step"
                      : undefined
                  }
                  className={[
                    "group flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-lime-300/30",
                    isActive
                      ? "bg-lime-300 text-[#050B18]"
                      : "text-white/55 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                      isActive
                        ? "bg-black/10"
                        : "bg-white/[0.05]",
                    ].join(" ")}
                  >
                    <Icon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">
                        {section.label}
                      </span>

                      <span
                        className={[
                          "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border xl:hidden",
                          isActive
                            ? "border-black/10 bg-black/10 text-[#050B18]/70"
                            : getStatusClasses(
                                status,
                              ),
                        ].join(" ")}
                        title={statusLabel}
                      >
                        <SectionStatusIcon
                          status={status}
                        />
                      </span>
                    </span>

                    <span
                      className={[
                        "hidden truncate text-xs xl:block",
                        isActive
                          ? "text-[#050B18]/60"
                          : "text-white/28",
                      ].join(" ")}
                    >
                      {section.description}
                    </span>
                  </span>

                  <span
                    className={[
                      "hidden shrink-0 items-center gap-1 rounded-full border px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[0.12em] xl:inline-flex",
                      isActive
                        ? "border-black/10 bg-black/10 text-[#050B18]/70"
                        : getStatusClasses(
                            status,
                          ),
                    ].join(" ")}
                  >
                    <SectionStatusIcon
                      status={status}
                    />

                    {statusLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {warnings.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className="h-4 w-4 text-amber-200"
                  aria-hidden="true"
                />

                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">
                  Needs attention
                </p>
              </div>

              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 font-mono text-[7px] font-black text-amber-200">
                {warnings.length}
              </span>
            </div>

            <ul className="mt-3 space-y-2">
              {warnings
                .slice(0, 5)
                .map(
                  (
                    warning,
                    index,
                  ) => (
                    <li
                      key={`${warning}-${index}`}
                      className="flex gap-2 text-xs leading-5 text-white/40"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-300" />
                      {warning}
                    </li>
                  ),
                )}
            </ul>

            {warnings.length > 5 ? (
              <p className="mt-3 border-t border-amber-300/10 pt-3 text-[10px] text-white/30">
                +{warnings.length - 5} more items
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
            <div className="flex items-center gap-2">
              <Check
                className="h-4 w-4 text-emerald-200"
                aria-hidden="true"
              />

              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-200">
                No critical warnings
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-white/35">
              Continue completing the remaining sections to reach Museum Ready quality.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

type StatusSummaryProps = {
  label: string;
  value: number;
  tone:
    | "success"
    | "warning"
    | "neutral";
};

function StatusSummary({
  label,
  value,
  tone,
}: StatusSummaryProps) {
  const classes = {
    success:
      "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-200",
    warning:
      "border-amber-400/15 bg-amber-400/[0.06] text-amber-200",
    neutral:
      "border-white/10 bg-white/[0.025] text-white/45",
  } as const;

  return (
    <div
      className={[
        "rounded-xl border p-2.5 text-center",
        classes[tone],
      ].join(" ")}
    >
      <p className="text-base font-semibold">
        {value}
      </p>

      <p className="mt-1 font-mono text-[6px] font-black uppercase tracking-[0.12em] opacity-70">
        {label}
      </p>
    </div>
  );
}