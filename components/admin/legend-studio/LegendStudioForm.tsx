"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  ExternalLink,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";

import LegendStudioSidebar, {
  type LegendStudioSectionId,
  type LegendStudioSectionItem,
  type LegendStudioSectionStatus,
} from "./LegendStudioSidebar";

export type LegendStudioMode =
  | "create"
  | "edit";

export type LegendPreviewData = {
  name: string;
  nickname: string | null;
  nationality: string | null;
  gender: "MALE" | "FEMALE";
  heroImage: string | null;
  portraitImage: string | null;
  era: string | null;
  careerTitles: number;
  grandSlams: number;
  weeksAtNo1: number;
  status:
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
  featured: boolean;
};

export type LegendStudioSectionMap =
  Partial<
    Record<
      LegendStudioSectionId,
      ReactNode
    >
  >;

type LegendStudioContextValue = {
  mode: LegendStudioMode;
  legendId?: string;
  preview: LegendPreviewData;
  setPreview: Dispatch<
    SetStateAction<LegendPreviewData>
  >;
  updatePreview: (
    values: Partial<LegendPreviewData>,
  ) => void;
};

type LegendStudioFormProps = {
  mode?: LegendStudioMode;
  legendId?: string;
  formAction: (
    formData: FormData,
  ) => void | Promise<void>;
  initialPreview?: Partial<LegendPreviewData>;
  sections: LegendStudioSectionMap;
  initialSection?: LegendStudioSectionId;
  previewHref?: string | null;
  submitLabel?: string;
  backHref?: string;
};

type FormSnapshot = Record<
  string,
  string | boolean
>;

const LegendStudioContext =
  createContext<
    LegendStudioContextValue | undefined
  >(undefined);

export function useLegendStudio() {
  const context =
    useContext(LegendStudioContext);

  if (!context) {
    throw new Error(
      "useLegendStudio must be used inside LegendStudioForm.",
    );
  }

  return context;
}

const defaultPreview: LegendPreviewData = {
  name: "",
  nickname: null,
  nationality: null,
  gender: "MALE",
  heroImage: null,
  portraitImage: null,
  era: null,
  careerTitles: 0,
  grandSlams: 0,
  weeksAtNo1: 0,
  status: "DRAFT",
  featured: false,
};

const sectionDefinitions: Array<
  Pick<
    LegendStudioSectionItem,
    "id" | "label" | "description"
  >
> = [
  {
    id: "identity",
    label: "Identity",
    description:
      "Name, nation and legend classification",
  },
  {
    id: "media",
    label: "Media",
    description:
      "Hero and portrait imagery",
  },
  {
    id: "biography",
    label: "Biography",
    description:
      "Story, quote and historical profile",
  },
  {
    id: "career",
    label: "Career",
    description:
      "Career profile and achievements",
  },
  {
    id: "grandSlams",
    label: "Grand Slams",
    description:
      "Major titles and championship record",
  },
  {
    id: "timeline",
    label: "Timeline",
    description:
      "Defining milestones and career chronology",
  },
  {
    id: "gallery",
    label: "Gallery",
    description:
      "Six or seven defining career images",
  },
  {
    id: "legacy",
    label: "Legacy",
    description:
      "Impact, records and tennis heritage",
  },
  {
    id: "seo",
    label: "SEO",
    description:
      "Search and social metadata",
  },
  {
    id: "publishing",
    label: "Publishing",
    description:
      "Visibility and legend archive state",
  },
];

function readString(
  snapshot: FormSnapshot,
  name: string,
): string {
  const value = snapshot[name];

  return typeof value === "string"
    ? value.trim()
    : "";
}

function readBoolean(
  snapshot: FormSnapshot,
  name: string,
  fallback = false,
): boolean {
  const value = snapshot[name];

  return typeof value === "boolean"
    ? value
    : fallback;
}

function hasText(
  snapshot: FormSnapshot,
  ...names: string[]
): boolean {
  return names.some(
    (name) =>
      readString(
        snapshot,
        name,
      ).length > 0,
  );
}

function hasPositiveNumber(
  snapshot: FormSnapshot,
  ...names: string[]
): boolean {
  return names.some((name) => {
    const value = Number(
      readString(
        snapshot,
        name,
      ),
    );

    return (
      Number.isFinite(value) &&
      value > 0
    );
  });
}

function snapshotForm(
  form: HTMLFormElement,
): FormSnapshot {
  const formData =
    new FormData(form);

  const snapshot: FormSnapshot = {};

  for (const [
    name,
    value,
  ] of formData.entries()) {
    if (
      typeof value === "string"
    ) {
      snapshot[name] = value;
    }
  }

  const checkboxes =
    form.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"][name]',
    );

  for (const checkbox of checkboxes) {
    snapshot[checkbox.name] =
      checkbox.checked;
  }

  return snapshot;
}

function getSectionStatus({
  id,
  preview,
  snapshot,
  implemented,
}: {
  id: LegendStudioSectionId;
  preview: LegendPreviewData;
  snapshot: FormSnapshot;
  implemented: boolean;
}): {
  status: LegendStudioSectionStatus;
  statusLabel: string;
} {
  if (!implemented) {
    return {
      status: "neutral",
      statusLabel: "Coming next",
    };
  }

  switch (id) {
    case "identity": {
      const hasName =
        preview.name.trim().length > 0;

      const hasNation =
        Boolean(
          preview.nationality?.trim(),
        );

      const hasGender =
        Boolean(preview.gender);

      if (
        hasName &&
        hasNation &&
        hasGender
      ) {
        return {
          status: "complete",
          statusLabel: "Complete",
        };
      }

      if (hasName) {
        return {
          status: "warning",
          statusLabel: "Needs details",
        };
      }

      return {
        status: "empty",
        statusLabel: "Missing name",
      };
    }

    case "media": {
      if (
        preview.heroImage &&
        preview.portraitImage
      ) {
        return {
          status: "complete",
          statusLabel: "Complete",
        };
      }

      if (
        preview.heroImage ||
        preview.portraitImage
      ) {
        return {
          status: "warning",
          statusLabel: "One image",
        };
      }

      return {
        status: "empty",
        statusLabel: "No media",
      };
    }

    case "biography": {
      const hasMainStory =
        hasText(
          snapshot,
          "biographyLong",
        );

      const hasEditorialSupport =
        hasText(
          snapshot,
          "quote",
          "biographyShort",
        );

      if (
        hasMainStory &&
        hasEditorialSupport
      ) {
        return {
          status: "complete",
          statusLabel: "Complete",
        };
      }

      if (
        hasMainStory ||
        hasEditorialSupport
      ) {
        return {
          status: "warning",
          statusLabel: "In progress",
        };
      }

      return {
        status: "empty",
        statusLabel: "No story",
      };
    }

    case "career": {
      const hasProfileDetails =
        hasText(
          snapshot,
          "birthPlace",
          "era",
          "plays",
          "backhand",
        );

      const hasCareerNumbers =
        hasPositiveNumber(
          snapshot,
          "careerHigh",
          "careerTitles",
          "weeksAtNo1",
          "yearEndNo1",
          "olympicGold",
        ) ||
        preview.careerTitles > 0 ||
        preview.weeksAtNo1 > 0;

      if (
        hasProfileDetails &&
        hasCareerNumbers
      ) {
        return {
          status: "complete",
          statusLabel: "Complete",
        };
      }

      if (
        hasProfileDetails ||
        hasCareerNumbers
      ) {
        return {
          status: "warning",
          statusLabel: "In progress",
        };
      }

      return {
        status: "empty",
        statusLabel: "No career data",
      };
    }

    case "grandSlams": {
      const hasMajorData =
        hasPositiveNumber(
          snapshot,
          "grandSlams",
          "australianOpen",
          "rolandGarros",
          "wimbledon",
          "usOpen",
        ) ||
        preview.grandSlams > 0;

      return hasMajorData
        ? {
            status: "complete",
            statusLabel: "Recorded",
          }
        : {
            status: "warning",
            statusLabel: "No Slam data",
          };
    }

    case "timeline": {
      const milestoneCount =
        Array.from(
          {
            length: 7,
          },
          (
            _,
            index,
          ) => index + 1,
        ).filter(
          (position) =>
            hasText(
              snapshot,
              `timelineYear${position}`,
            ) &&
            hasText(
              snapshot,
              `timelineTitle${position}`,
            ),
        ).length;

      if (milestoneCount >= 7) {
        return {
          status: "complete",
          statusLabel: `${milestoneCount} milestones`,
        };
      }

      if (milestoneCount > 0) {
        return {
          status: "warning",
          statusLabel: `${milestoneCount}/7 milestones`,
        };
      }

      return {
        status: "empty",
        statusLabel: "No timeline",
      };
    }

    case "gallery": {
      const galleryCount = [
        "galleryImage1",
        "galleryImage2",
        "galleryImage3",
        "galleryImage4",
        "galleryImage5",
        "galleryImage6",
        "galleryImage7",
      ].filter(
        (name) =>
          readString(
            snapshot,
            name,
          ).length > 0,
      ).length;

      if (galleryCount >= 6) {
        return {
          status: "complete",
          statusLabel: `${galleryCount} images`,
        };
      }

      if (galleryCount > 0) {
        return {
          status: "warning",
          statusLabel: `${galleryCount}/6 minimum`,
        };
      }

      return {
        status: "empty",
        statusLabel: "No gallery",
      };
    }

    case "legacy": {
      const hasLegacy =
        hasText(
          snapshot,
          "legacy",
        );

      return hasLegacy
        ? {
            status: "complete",
            statusLabel: "Complete",
          }
        : {
            status: "warning",
            statusLabel: "Add legacy",
          };
    }

    case "seo": {
      const hasSlug =
        hasText(
          snapshot,
          "slug",
        );

      const hasMetadata =
        hasText(
          snapshot,
          "metaTitle",
          "metaDescription",
        );

      if (
        hasSlug &&
        hasMetadata
      ) {
        return {
          status: "complete",
          statusLabel: "Complete",
        };
      }

      if (
        hasSlug ||
        hasMetadata
      ) {
        return {
          status: "warning",
          statusLabel: "In progress",
        };
      }

      return {
        status: "empty",
        statusLabel: "No metadata",
      };
    }

    case "publishing": {
      return preview.status ===
        "PUBLISHED"
        ? {
            status: "complete",
            statusLabel: "Published",
          }
        : {
            status: "warning",
            statusLabel:
              preview.status ===
              "ARCHIVED"
                ? "Archived"
                : "Draft",
          };
    }

    default: {
      return {
        status: "neutral",
        statusLabel: "Coming next",
      };
    }
  }
}

function buildSections({
  preview,
  snapshot,
  sections,
}: {
  preview: LegendPreviewData;
  snapshot: FormSnapshot;
  sections: LegendStudioSectionMap;
}): LegendStudioSectionItem[] {
  return sectionDefinitions.map(
    (section) => {
      const health =
        getSectionStatus({
          id: section.id,
          preview,
          snapshot,
          implemented:
            Boolean(
              sections[
                section.id
              ],
            ),
        });

      return {
        ...section,
        ...health,
      };
    },
  );
}

function calculateCompletion(
  sections: LegendStudioSectionItem[],
  implementedSections: LegendStudioSectionMap,
): number {
  const activeSections =
    sections.filter(
      (section) =>
        Boolean(
          implementedSections[
            section.id
          ],
        ),
    );

  if (
    activeSections.length === 0
  ) {
    return 0;
  }

  const score =
    activeSections.reduce<number>(
      (total, section) => {
        switch (section.status) {
          case "complete":
            return total + 1;

          case "warning":
            return total + 0.5;

          case "neutral":
            return total + 0.25;

          case "empty":
          default:
            return total;
        }
      },
      0,
    );

  return Math.round(
    (score /
      activeSections.length) *
      100,
  );
}

function buildWarnings({
  preview,
  snapshot,
  sections,
}: {
  preview: LegendPreviewData;
  snapshot: FormSnapshot;
  sections: LegendStudioSectionMap;
}): string[] {
  const warnings: string[] = [];

  if (
    sections.identity &&
    !preview.name.trim()
  ) {
    warnings.push(
      "Add the legend name.",
    );
  }

  if (
    sections.identity &&
    !preview.nationality?.trim()
  ) {
    warnings.push(
      "Add the legend nationality.",
    );
  }

  if (
    sections.media &&
    !preview.heroImage
  ) {
    warnings.push(
      "Add a dedicated Hero image.",
    );
  }

  if (
    sections.media &&
    !preview.portraitImage
  ) {
    warnings.push(
      "Add a Portrait image.",
    );
  }

  if (
    sections.biography &&
    !hasText(
      snapshot,
      "biographyLong",
    )
  ) {
    warnings.push(
      "Add the main legend biography.",
    );
  }

  if (
    sections.career &&
    !hasPositiveNumber(
      snapshot,
      "careerHigh",
      "careerTitles",
      "weeksAtNo1",
    ) &&
    preview.careerTitles === 0 &&
    preview.weeksAtNo1 === 0
  ) {
    warnings.push(
      "Add career ranking or title data.",
    );
  }

  if (
    sections.grandSlams &&
    !hasPositiveNumber(
      snapshot,
      "grandSlams",
      "australianOpen",
      "rolandGarros",
      "wimbledon",
      "usOpen",
    ) &&
    preview.grandSlams === 0
  ) {
    warnings.push(
      "Add Grand Slam title data.",
    );
  }

  if (sections.timeline) {
    const milestoneCount =
      Array.from(
        {
          length: 7,
        },
        (
          _,
          index,
        ) => index + 1,
      ).filter(
        (position) =>
          hasText(
            snapshot,
            `timelineYear${position}`,
          ) &&
          hasText(
            snapshot,
            `timelineTitle${position}`,
          ),
      ).length;

    if (milestoneCount === 0) {
      warnings.push(
        "Add career timeline milestones.",
      );
    } else if (milestoneCount < 7) {
      warnings.push(
        `Complete the career timeline (${milestoneCount}/7 milestones).`,
      );
    }
  }

  if (sections.gallery) {
    const galleryCount = [
      "galleryImage1",
      "galleryImage2",
      "galleryImage3",
      "galleryImage4",
      "galleryImage5",
      "galleryImage6",
      "galleryImage7",
    ].filter(
      (name) =>
        readString(
          snapshot,
          name,
        ).length > 0,
    ).length;

    if (galleryCount < 6) {
      warnings.push(
        "Add at least 6 gallery images.",
      );
    }
  }

  if (
    sections.legacy &&
    !hasText(
      snapshot,
      "legacy",
    )
  ) {
    warnings.push(
      "Add the legend legacy.",
    );
  }

  if (
    sections.seo &&
    !hasText(
      snapshot,
      "metaTitle",
      "metaDescription",
    )
  ) {
    warnings.push(
      "Complete the SEO metadata.",
    );
  }

  if (
    sections.publishing &&
    preview.status !== "PUBLISHED"
  ) {
    warnings.push(
      "The public legend profile is not published.",
    );
  }

  return warnings;
}

function LegendPreviewCard({
  legend,
}: {
  legend: LegendPreviewData;
}) {
  return (
    <aside className="border-t border-white/10 bg-[#07101D]/45 xl:border-l xl:border-t-0">
      <div className="p-4 xl:sticky xl:top-20">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#050B18]">
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent">
            {legend.portraitImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={legend.portraitImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center">
                <Crown className="size-16 text-lime-300/20" />
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/70 to-transparent px-5 pb-5 pt-20">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300">
                AGE202 Legend
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                {legend.name ||
                  "New Legend"}
              </h3>

              <p className="mt-1 text-sm text-white/45">
                {legend.nationality ||
                  "Nationality"}
                {legend.era
                  ? ` · ${legend.era}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            <PreviewStat
              label="Slams"
              value={legend.grandSlams}
            />
            <PreviewStat
              label="Titles"
              value={legend.careerTitles}
            />
            <PreviewStat
              label="No.1"
              value={legend.weeksAtNo1}
            />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <span
                className={[
                  "rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em]",
                  legend.status === "PUBLISHED"
                    ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-200"
                    : legend.status === "ARCHIVED"
                      ? "border-white/10 bg-white/[0.04] text-white/35"
                      : "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
                ].join(" ")}
              >
                {legend.status}
              </span>

              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                {legend.gender === "MALE"
                  ? "Men's Legends"
                  : "Women's Legends"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PreviewStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="p-4 text-center">
      <p className="text-lg font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 font-mono text-[7px] font-black uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>
    </div>
  );
}

function LegendStudioHeader({
  mode,
  name,
  status,
  previewHref,
  submitLabel,
  backHref,
}: {
  mode: LegendStudioMode;
  name: string;
  status: LegendPreviewData["status"];
  previewHref?: string | null;
  submitLabel?: string;
  backHref?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <Link
          href={backHref ?? "/admin/legends"}
          className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300">
              Legend Studio
            </p>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/35">
              {status}
            </span>
          </div>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] text-white">
            {mode === "create"
              ? "Create Legend"
              : name || "Edit Legend"}
          </h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {previewHref ? (
          <Link
            href={previewHref}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ExternalLink className="size-4" />
            Preview
          </Link>
        ) : null}

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-2.5 text-sm font-black text-[#050B18] transition hover:bg-lime-200"
        >
          <Save className="size-4" />
          {submitLabel ??
            (mode === "create"
              ? "Create Legend"
              : "Save changes")}
        </button>
      </div>
    </div>
  );
}

export default function LegendStudioForm({
  mode = "create",
  legendId,
  formAction,
  initialPreview,
  sections,
  initialSection = "identity",
  previewHref,
  submitLabel,
  backHref,
}: LegendStudioFormProps) {
  const [
    activeSection,
    setActiveSection,
  ] =
    useState<LegendStudioSectionId>(
      initialSection,
    );

  const [preview, setPreview] =
    useState<LegendPreviewData>({
      ...defaultPreview,
      ...initialPreview,
    });

  const [
    formSnapshot,
    setFormSnapshot,
  ] = useState<FormSnapshot>({});

  const formRef =
    useRef<HTMLFormElement>(
      null,
    );

  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    setFormSnapshot(
      snapshotForm(
        formRef.current,
      ),
    );
  }, []);

  const syncFormSnapshot =
    useCallback(
      (
        event: FormEvent<HTMLFormElement>,
      ) => {
        setFormSnapshot(
          snapshotForm(
            event.currentTarget,
          ),
        );
      },
      [],
    );

  const sidebarSections =
    useMemo(
      () =>
        buildSections({
          preview,
          snapshot:
            formSnapshot,
          sections,
        }),
      [
        preview,
        formSnapshot,
        sections,
      ],
    );

  const completion =
    useMemo(
      () =>
        calculateCompletion(
          sidebarSections,
          sections,
        ),
      [
        sidebarSections,
        sections,
      ],
    );

  const warnings =
    useMemo(
      () =>
        buildWarnings({
          preview,
          snapshot:
            formSnapshot,
          sections,
        }),
      [
        preview,
        formSnapshot,
        sections,
      ],
    );

  const contextValue =
    useMemo<LegendStudioContextValue>(
      () => ({
        mode,
        legendId,
        preview,
        setPreview,
        updatePreview: (
          values,
        ) =>
          setPreview(
            (current) => ({
              ...current,
              ...values,
            }),
          ),
      }),
      [
        mode,
        legendId,
        preview,
      ],
    );

  return (
    <LegendStudioContext.Provider
      value={contextValue}
    >
      <form
        ref={formRef}
        action={formAction}
        onInput={
          syncFormSnapshot
        }
        onChange={
          syncFormSnapshot
        }
        className="pb-8"
      >
        {legendId ? (
          <input
            type="hidden"
            name="legendId"
            value={legendId}
          />
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <LegendStudioHeader
            mode={mode}
            name={preview.name}
            status={preview.status}
            previewHref={previewHref}
            submitLabel={submitLabel}
            backHref={backHref}
          />

          <div className="grid xl:grid-cols-[280px_minmax(0,1fr)_350px]">
            <LegendStudioSidebar
              activeSection={
                activeSection
              }
              onSectionChange={
                setActiveSection
              }
              sections={
                sidebarSections
              }
              completion={
                completion
              }
              warnings={
                warnings
              }
            />

            <div className="min-w-0 p-4 sm:p-6 lg:p-8">
              {sectionDefinitions.map(
                (section) => {
                  const content =
                    sections[
                      section.id
                    ];

                  if (!content) {
                    if (
                      section.id !==
                      activeSection
                    ) {
                      return null;
                    }

                    return (
                      <div
                        key={
                          section.id
                        }
                        className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center"
                      >
                        <div>
                          <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.05]">
                            <ShieldCheck className="size-5 text-lime-300" />
                          </div>

                          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                            Legend Studio
                          </p>

                          <h2 className="mt-3 text-2xl font-semibold text-white">
                            Section coming next
                          </h2>

                          <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                            This workspace is ready for the next modular Legend Studio section.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={
                        section.id
                      }
                      hidden={
                        section.id !==
                        activeSection
                      }
                    >
                      {content}
                    </div>
                  );
                },
              )}
            </div>

            <LegendPreviewCard
              legend={preview}
            />
          </div>
        </div>
      </form>
    </LegendStudioContext.Provider>
  );
}