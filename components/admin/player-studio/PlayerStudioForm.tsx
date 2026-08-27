"use client";
import { useSearchParams } from "next/navigation";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";

import PlayerPreviewCard, {
  type PlayerPreviewData,
} from "./PlayerPreviewCard";

import PlayerStudioHeader from "./PlayerStudioHeader";

import PlayerStudioSidebar, {
  type PlayerStudioSectionId,
  type PlayerStudioSectionItem,
  type PlayerStudioSectionStatus,
} from "./PlayerStudioSidebar";

export type PlayerStudioMode =
  | "create"
  | "edit";

export type PlayerStudioSectionMap =
  Partial<
    Record<
      PlayerStudioSectionId,
      ReactNode
    >
  >;

type PlayerStudioContextValue = {
  mode: PlayerStudioMode;
  playerId?: string;
  preview: PlayerPreviewData;
  setPreview: Dispatch<
    SetStateAction<PlayerPreviewData>
  >;
  updatePreview: (
    values: Partial<PlayerPreviewData>,
  ) => void;
};

type FormSnapshot = Record<
  string,
  string | boolean
>;

const PlayerStudioContext =
  createContext<
    PlayerStudioContextValue | undefined
  >(undefined);

export function usePlayerStudio() {
  const context =
    useContext(PlayerStudioContext);

  if (!context) {
    throw new Error(
      "usePlayerStudio must be used inside PlayerStudioForm.",
    );
  }

  return context;
}

type PlayerStudioFormProps = {
  mode?: PlayerStudioMode;
  playerId?: string;
  formAction: (
    formData: FormData,
  ) => void | Promise<void>;
  initialPreview?: PlayerPreviewData;
  sections: PlayerStudioSectionMap;
  initialSection?: PlayerStudioSectionId;
  previewHref?: string | null;
  playerStatus?: string | null;
  submitLabel?: string;
  backHref?: string;
};

const defaultPreview: PlayerPreviewData = {
  name: "",
  nickname: null,
  country: null,
  heroImage: null,
  portraitImage: null,
  accent: "#C8FF00",
  collectionType: "ARCHIVE",
  ranking: null,
  points: null,
  artifactCount: 0,
  collectionCount: 0,
  atpTitles: 0,
  grandSlams: 0,
  active: true,
};

const sectionDefinitions: Array<
  Pick<
    PlayerStudioSectionItem,
    "id" | "label" | "description"
  >
> = [
  {
    id: "identity",
    label: "Identity",
    description:
      "Name, slug and archive identity",
  },
  {
    id: "atp",
    label: "Tour & Ranking",
    description:
      "ATP or WTA ranking connection",
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
      "Quote and editorial story",
  },
  {
    id: "career",
    label: "Career",
    description:
      "Profile, titles and achievements",
  },
  {
    id: "trophies",
    label: "Trophy Cabinet",
    description:
      "Grand Slams and WTA 1000 victories",
  },
  {
    id: "collections",
    label: "Collections",
    description:
      "Museum relationships",
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
      "Visibility and archive state",
  },
];

function readString(
  snapshot: FormSnapshot,
  name: string,
): string {
  const value =
    snapshot[name];

  return typeof value === "string"
    ? value.trim()
    : "";
}

function readBoolean(
  snapshot: FormSnapshot,
  name: string,
  fallback = false,
): boolean {
  const value =
    snapshot[name];

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
  id: PlayerStudioSectionId;
  preview: PlayerPreviewData;
  snapshot: FormSnapshot;
  implemented: boolean;
}): {
  status: PlayerStudioSectionStatus;
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

      const hasCountry =
        Boolean(
          preview.country?.trim(),
        );

      const hasClassification =
        Boolean(
          preview.collectionType,
        );

      if (
        hasName &&
        hasCountry &&
        hasClassification
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

    case "atp": {
      const linked =
        Boolean(
          preview.ranking,
        ) ||
        Boolean(
          readString(
            snapshot,
            "atpPlayerId",
          ),
        ) ||
        Boolean(
          readString(
            snapshot,
            "wtaPlayerId",
          ),
        );

      return linked
        ? {
            status: "complete",
            statusLabel: "Linked",
          }
        : {
            status: "warning",
            statusLabel: "Not linked",
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
      const hasMainBiography =
        hasText(
          snapshot,
          "biography",
          "biographyLong",
        );

      const hasEditorialSupport =
        hasText(
          snapshot,
          "quote",
          "biographyShort",
          "playingStyle",
        );

      if (
        hasMainBiography &&
        hasEditorialSupport
      ) {
        return {
          status: "complete",
          statusLabel: "Complete",
        };
      }

      if (
        hasMainBiography ||
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
          "residence",
          "plays",
          "backhand",
          "coach",
          "favouriteSurface",
        );

      const hasCareerNumbers =
        hasPositiveNumber(
          snapshot,
          "careerHigh",
          "atpTitles",
          "grandSlams",
          "masters1000",
          "atpFinals",
          "olympicGold",
          "davisCup",
        ) ||
        (preview.atpTitles ?? 0) > 0 ||
        (preview.grandSlams ?? 0) > 0;

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

    case "trophies": {
      const trophyCount =
        Number(
          readString(
            snapshot,
            "trophyWinCount",
          ),
        );

      if (
        Number.isFinite(
          trophyCount,
        ) &&
        trophyCount > 0
      ) {
        return {
          status: "complete",
          statusLabel:
            `${trophyCount} wins`,
        };
      }

      return {
        status: "neutral",
        statusLabel: "Synced",
      };
    }

    case "collections": {
      const count =
        preview.collectionCount ??
        0;

      return count > 0
        ? {
            status: "complete",
            statusLabel: `${count} linked`,
          }
        : {
            status: "warning",
            statusLabel: "None linked",
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
      const active =
        readBoolean(
          snapshot,
          "active",
          preview.active !== false,
        );

      return active
        ? {
            status: "complete",
            statusLabel: "Active",
          }
        : {
            status: "warning",
            statusLabel: "Inactive",
          };
    }
  }
}

function buildSections({
  preview,
  snapshot,
  sections,
}: {
  preview: PlayerPreviewData;
  snapshot: FormSnapshot;
  sections: PlayerStudioSectionMap;
}): PlayerStudioSectionItem[] {
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
  sections: PlayerStudioSectionItem[],
  implementedSections: PlayerStudioSectionMap,
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
  preview: PlayerPreviewData;
  snapshot: FormSnapshot;
  sections: PlayerStudioSectionMap;
}): string[] {
  const warnings: string[] = [];

  if (
    sections.identity &&
    !preview.name.trim()
  ) {
    warnings.push(
      "Add the player name.",
    );
  }

  if (
    sections.identity &&
    !preview.country?.trim()
  ) {
    warnings.push(
      "Add the player country.",
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
    sections.atp &&
    !preview.ranking &&
    !readString(
      snapshot,
      "atpPlayerId",
    ) &&
    !readString(
      snapshot,
      "wtaPlayerId",
    )
  ) {
    warnings.push(
      "Connect an ATP or WTA ranking record when available.",
    );
  }

  if (
    sections.biography &&
    !hasText(
      snapshot,
      "biography",
      "biographyLong",
    )
  ) {
    warnings.push(
      "Add the main player biography.",
    );
  }

  if (
    sections.biography &&
    !hasText(
      snapshot,
      "quote",
      "biographyShort",
      "playingStyle",
    )
  ) {
    warnings.push(
      "Add a quote, short biography or playing style.",
    );
  }

  if (
    sections.career &&
    !hasPositiveNumber(
      snapshot,
      "careerHigh",
      "atpTitles",
      "grandSlams",
    ) &&
    (preview.atpTitles ?? 0) ===
      0 &&
    (preview.grandSlams ?? 0) ===
      0
  ) {
    warnings.push(
      "Add career ranking or title data.",
    );
  }

  if (
    sections.collections &&
    (preview.collectionCount ??
      0) === 0
  ) {
    warnings.push(
      "No museum collections are connected.",
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
    !readBoolean(
      snapshot,
      "active",
      preview.active !== false,
    )
  ) {
    warnings.push(
      "The public player profile is inactive.",
    );
  }

  return warnings;
}
function isPlayerStudioSectionId(
  value: string | null,
): value is PlayerStudioSectionId {
  if (!value) {
    return false;
  }

  return sectionDefinitions.some(
    (section) =>
      section.id === value,
  );
}
export default function PlayerStudioForm({
  mode = "create",
  playerId,
  formAction,
  initialPreview,
  sections,
  initialSection = "identity",
  previewHref,
  playerStatus,
  submitLabel,
  backHref,
}: PlayerStudioFormProps) {
    const searchParams =
    useSearchParams();

  const requestedSection =
    searchParams.get("section");

  const resolvedInitialSection:
    PlayerStudioSectionId =
    isPlayerStudioSectionId(
      requestedSection,
    )
      ? requestedSection
      : initialSection;
  const [
  activeSection,
  setActiveSection,
] =
  useState<PlayerStudioSectionId>(
    resolvedInitialSection,
  );

  const [preview, setPreview] =
    useState<PlayerPreviewData>({
      ...defaultPreview,
      ...initialPreview,
    });

  const [
    formSnapshot,
    setFormSnapshot,
  ] = useState<FormSnapshot>({});

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
    useMemo<PlayerStudioContextValue>(
      () => ({
        mode,
        playerId,
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
        playerId,
        preview,
      ],
    );

  return (
    <PlayerStudioContext.Provider
      value={contextValue}
    >
      <form
        action={formAction}
        onInput={
          syncFormSnapshot
        }
        onChange={
          syncFormSnapshot
        }
        className="pb-8"
      >
        {playerId ? (
          <input
            type="hidden"
            name="playerId"
            value={playerId}
          />
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
          <PlayerStudioHeader
            mode={mode}
            playerName={preview.name}
            playerStatus={
              playerStatus
            }
            previewHref={
              previewHref
            }
            submitLabel={
              submitLabel
            }
            backHref={
              backHref
            }
          />

          <div className="grid xl:grid-cols-[280px_minmax(0,1fr)_350px]">
            <PlayerStudioSidebar
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
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200/70">
                            Player Studio
                          </p>

                          <h2 className="mt-3 text-2xl font-semibold text-white">
                            Section coming next
                          </h2>

                          <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                            This workspace is ready for the next modular Player Studio section.
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

            <PlayerPreviewCard
              player={preview}
            />
          </div>
        </div>
      </form>
    </PlayerStudioContext.Provider>
  );
}