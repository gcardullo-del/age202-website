"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CircleCheck,
  Crown,
  Eye,
  ImageIcon,
  Loader2,
  Save,
  Sparkles,
  Swords,
  Timeline,
  Trash2,
  Undo2,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import MediaPicker, {
  type MediaPickerAsset,
} from "@/components/admin/media/MediaPicker";


type EntryType =
  | "MILESTONE"
  | "LEGEND"
  | "RIVALRY"
  | "GENERATION";


type EntryEra =
  | "ORIGINS"
  | "CLASSIC_ERA"
  | "OPEN_ERA"
  | "MODERN_ERA";


type EntryGender =
  | ""
  | "MEN"
  | "WOMEN"
  | "MIXED";


type EntryStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";


type TennisHistoryEntryResponse = {
  id: string;
  type: EntryType;
  slug: string;
  year: number;
  month: number | null;
  day: number | null;
  sortOrder: number;
  era: EntryEra;
  gender:
    | "MEN"
    | "WOMEN"
    | "MIXED"
    | null;

  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  quote: string | null;
  achievement: string | null;
  period: string | null;

  country: string | null;
  countryCode: string | null;

  playerOne: string | null;
  playerTwo: string | null;
  players: string[];

  href: string | null;

  imageUrl: string | null;
  mediaId: string | null;

  featured: boolean;
  status: EntryStatus;
  publishedAt: string | null;

  media?: {
    id: string;
    url: string;
    title: string;
    alt: string | null;
  } | null;
};


type FormState = {
  type: EntryType;
  slug: string;
  year: string;
  month: string;
  day: string;
  sortOrder: string;
  era: EntryEra;
  gender: EntryGender;

  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  achievement: string;
  period: string;

  country: string;
  countryCode: string;

  playerOne: string;
  playerTwo: string;
  playersText: string;

  href: string;

  imageUrl: string;
  mediaId: string;

  featured: boolean;
  status: EntryStatus;
};


const emptyForm: FormState = {
  type: "LEGEND",
  slug: "",
  year: "",
  month: "",
  day: "",
  sortOrder: "0",
  era: "OPEN_ERA",
  gender: "",

  eyebrow: "",
  title: "",
  subtitle: "",
  description: "",
  quote: "",
  achievement: "",
  period: "",

  country: "",
  countryCode: "",

  playerOne: "",
  playerTwo: "",
  playersText: "",

  href: "",

  imageUrl: "",
  mediaId: "",

  featured: false,
  status: "DRAFT",
};


function entryToForm(
  entry:
    TennisHistoryEntryResponse,
): FormState {
  return {
    type:
      entry.type,

    slug:
      entry.slug,

    year:
      String(
        entry.year,
      ),

    month:
      entry.month === null
        ? ""
        : String(entry.month),

    day:
      entry.day === null
        ? ""
        : String(entry.day),

    sortOrder:
      String(
        entry.sortOrder,
      ),

    era:
      entry.era,

    gender:
      entry.gender ??
      "",

    eyebrow:
      entry.eyebrow ??
      "",

    title:
      entry.title,

    subtitle:
      entry.subtitle ??
      "",

    description:
      entry.description ??
      "",

    quote:
      entry.quote ??
      "",

    achievement:
      entry.achievement ??
      "",

    period:
      entry.period ??
      "",

    country:
      entry.country ??
      "",

    countryCode:
      entry.countryCode ??
      "",

    playerOne:
      entry.playerOne ??
      "",

    playerTwo:
      entry.playerTwo ??
      "",

    playersText:
      entry.players.join(
        "\n",
      ),

    href:
      entry.href ??
      "",

    imageUrl:
      entry.imageUrl ??
      "",

    mediaId:
      entry.mediaId ??
      "",

    featured:
      entry.featured,

    status:
      entry.status,
  };
}


function splitPlayers(
  value: string,
): string[] {
  return value
    .split(/\r?\n|,/)
    .map(
      (player) =>
        player.trim(),
    )
    .filter(Boolean);
}


function typeLabel(
  type: EntryType,
) {
  switch (type) {
    case "MILESTONE":
      return "Historical Milestone";

    case "LEGEND":
      return "Legend of History";

    case "RIVALRY":
      return "Iconic Rivalry";

    case "GENERATION":
      return "Generation of History";
  }
}


function typeDescription(
  type: EntryType,
) {
  switch (type) {
    case "MILESTONE":
      return "Chronological event on the Tennis History timeline.";

    case "LEGEND":
      return "Museum profile dedicated to a champion who shaped an era.";

    case "RIVALRY":
      return "Two-player exhibit dedicated to an iconic tennis rivalry.";

    case "GENERATION":
      return "Era exhibit grouping several protagonists into one historical chapter.";
  }
}


function getTypeIcon(
  type: EntryType,
) {
  switch (type) {
    case "LEGEND":
      return Crown;

    case "RIVALRY":
      return Swords;

    case "GENERATION":
      return Sparkles;

    case "MILESTONE":
    default:
      return Timeline;
  }
}


export default function TennisHistoryEntryEditorPage() {
  const params =
    useParams<{
      id: string;
    }>();


  const router =
    useRouter();


  const entryId =
    params.id;


  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      emptyForm,
    );


  const [
    entry,
    setEntry,
  ] =
    useState<TennisHistoryEntryResponse | null>(
      null,
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    saving,
    setSaving,
  ] =
    useState(false);


  const [
    publishing,
    setPublishing,
  ] =
    useState(false);


  const [
    deleting,
    setDeleting,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  const [
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null,
    );


  const [
    mediaAssets,
    setMediaAssets,
  ] =
    useState<MediaPickerAsset[]>(
      [],
    );


  const [
    mediaLoading,
    setMediaLoading,
  ] =
    useState(true);


  const [
    mediaError,
    setMediaError,
  ] =
    useState<string | null>(
      null,
    );


  useEffect(
    () => {
      let cancelled =
        false;


      async function loadMediaAssets() {
        try {
          setMediaLoading(
            true,
          );

          setMediaError(
            null,
          );


          const response =
            await fetch(
              "/api/media",
              {
                cache:
                  "no-store",
              },
            );


          const payload =
            (await response.json()) as {
              assets?: MediaPickerAsset[];
              error?: string;
            };


          if (
            !response.ok
          ) {
            throw new Error(
              payload.error ||
                "Unable to load Media Library.",
            );
          }


          if (
            !cancelled
          ) {
            setMediaAssets(
              payload.assets ??
                [],
            );
          }
        } catch (
          loadError
        ) {
          if (
            !cancelled
          ) {
            setMediaError(
              loadError instanceof
              Error
                ? loadError.message
                : "Unable to load Media Library.",
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setMediaLoading(
              false,
            );
          }
        }
      }


      void loadMediaAssets();


      return () => {
        cancelled =
          true;
      };
    },
    [],
  );


  const playersPreview =
    useMemo(
      () =>
        splitPlayers(
          form.playersText,
        ),
      [
        form.playersText,
      ],
    );


  const resolvedImageUrl =
    useMemo(
      () => {
        const selectedAsset =
          mediaAssets.find(
            (
              asset,
            ) =>
              asset.id ===
              form.mediaId,
          );

        return (
          selectedAsset?.url ??
          form.imageUrl ??
          entry?.media?.url ??
          ""
        );
      },
      [
        entry?.media?.url,
        form.imageUrl,
        form.mediaId,
        mediaAssets,
      ],
    );


  useEffect(
    () => {
      let cancelled =
        false;


      async function loadEntry() {
        setLoading(
          true,
        );

        setError(
          null,
        );

        try {
          const response =
            await fetch(
              `/api/tennis-history/${entryId}`,
              {
                cache:
                  "no-store",
              },
            );


          const payload =
            (await response.json()) as {
              error?: string;

              entry?: TennisHistoryEntryResponse;
            };


          if (
            !response.ok ||
            !payload.entry
          ) {
            throw new Error(
              payload.error ||
                "Unable to load Tennis History entry.",
            );
          }


          if (
            cancelled
          ) {
            return;
          }


          setEntry(
            payload.entry,
          );

          setForm(
            entryToForm(
              payload.entry,
            ),
          );
        } catch (
          loadError
        ) {
          if (
            cancelled
          ) {
            return;
          }

          setError(
            loadError instanceof
            Error
              ? loadError.message
              : "Unable to load Tennis History entry.",
          );
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false,
            );
          }
        }
      }


      void loadEntry();


      return () => {
        cancelled =
          true;
      };
    },
    [
      entryId,
    ],
  );


  function updateText(
    key:
      | "slug"
      | "year"
      | "month"
      | "day"
      | "sortOrder"
      | "eyebrow"
      | "title"
      | "subtitle"
      | "description"
      | "quote"
      | "achievement"
      | "period"
      | "country"
      | "countryCode"
      | "playerOne"
      | "playerTwo"
      | "playersText"
      | "href"
      | "imageUrl"
      | "mediaId",
    value: string,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,
        [key]:
          value,
      }),
    );
  }


  async function saveEntry() {
    if (
      saving
    ) {
      return;
    }


    setError(
      null,
    );

    setSuccess(
      null,
    );

    setSaving(
      true,
    );


    try {
      const response =
        await fetch(
          `/api/tennis-history/${entryId}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                type:
                  form.type,

                slug:
                  form.slug,

                year:
                  form.year,

                month:
                  form.month || null,

                day:
                  form.day || null,

                sortOrder:
                  form.sortOrder,

                era:
                  form.era,

                gender:
                  form.gender ||
                  null,

                eyebrow:
                  form.eyebrow ||
                  null,

                title:
                  form.title,

                subtitle:
                  form.subtitle ||
                  null,

                description:
                  form.description ||
                  null,

                quote:
                  form.quote ||
                  null,

                achievement:
                  form.achievement ||
                  null,

                period:
                  form.period ||
                  null,

                country:
                  form.country ||
                  null,

                countryCode:
                  form.countryCode ||
                  null,

                playerOne:
                  form.type ===
                  "RIVALRY"
                    ? form.playerOne ||
                      null
                    : null,

                playerTwo:
                  form.type ===
                  "RIVALRY"
                    ? form.playerTwo ||
                      null
                    : null,

                players:
                  form.type ===
                  "GENERATION"
                    ? playersPreview
                    : [],

                href:
                  form.href ||
                  null,

                imageUrl:
                  form.imageUrl ||
                  null,

                mediaId:
                  form.mediaId ||
                  null,

                featured:
                  form.featured,

                status:
                  form.status,
              }),
          },
        );


      const payload =
        (await response.json()) as {
          error?: string;

          entry?: TennisHistoryEntryResponse;
        };


      if (
        !response.ok ||
        !payload.entry
      ) {
        throw new Error(
          payload.error ||
            "Unable to save Tennis History entry.",
        );
      }


      setEntry(
        payload.entry,
      );

      setForm(
        entryToForm(
          payload.entry,
        ),
      );

      setSuccess(
        "Changes saved.",
      );

      router.refresh();
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
        Error
          ? saveError.message
          : "Unable to save Tennis History entry.",
      );
    } finally {
      setSaving(
        false,
      );
    }
  }


  async function handlePublicationAction(
    action:
      | "publish"
      | "unpublish",
  ) {
    if (
      publishing
    ) {
      return;
    }


    setError(
      null,
    );

    setSuccess(
      null,
    );

    setPublishing(
      true,
    );


    try {
      const response =
        await fetch(
          `/api/tennis-history/${entryId}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                action,
              }),
          },
        );


      const payload =
        (await response.json()) as {
          error?: string;

          entry?: TennisHistoryEntryResponse;
        };


      if (
        !response.ok ||
        !payload.entry
      ) {
        throw new Error(
          payload.error ||
            "Unable to change publication status.",
        );
      }


      setEntry(
        payload.entry,
      );

      setForm(
        entryToForm(
          payload.entry,
        ),
      );

      setSuccess(
        action ===
          "publish"
          ? "Entry published."
          : "Entry returned to draft.",
      );

      router.refresh();
    } catch (
      publicationError
    ) {
      setError(
        publicationError instanceof
        Error
          ? publicationError.message
          : "Unable to change publication status.",
      );
    } finally {
      setPublishing(
        false,
      );
    }
  }


  async function handleDelete() {
    if (
      deleting
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this Tennis History entry? The linked Media Library asset will not be deleted.",
      );


    if (
      !confirmed
    ) {
      return;
    }


    setDeleting(
      true,
    );

    setError(
      null,
    );


    try {
      const response =
        await fetch(
          `/api/tennis-history/${entryId}`,
          {
            method:
              "DELETE",
          },
        );


      const payload =
        (await response.json()) as {
          error?: string;
        };


      if (
        !response.ok
      ) {
        throw new Error(
          payload.error ||
            "Unable to delete Tennis History entry.",
        );
      }


      router.push(
        "/admin/tennis-history",
      );

      router.refresh();
    } catch (
      deleteError
    ) {
      setError(
        deleteError instanceof
        Error
          ? deleteError.message
          : "Unable to delete Tennis History entry.",
      );

      setDeleting(
        false,
      );
    }
  }


  if (
    loading
  ) {
    return (
      <AdminShell
        title="Tennis History"
        description="Loading historical archive entry."
      >
        <AdminPanel className="p-12">
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-white/45">
            <Loader2 className="h-5 w-5 animate-spin text-lime-300" />

            Loading History Entry...
          </div>
        </AdminPanel>
      </AdminShell>
    );
  }


  if (
    !entry
  ) {
    return (
      <AdminShell
        title="Tennis History"
        description="Historical archive entry unavailable."
      >
        <div className="space-y-6">
          <button
            type="button"
            onClick={
              () =>
                router.push(
                  "/admin/tennis-history",
                )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/55"
          >
            <ArrowLeft className="h-4 w-4" />

            Tennis History
          </button>

          <AdminPanel className="p-8">
            <p className="text-sm font-semibold text-red-100">
              {error ||
                "Tennis History entry not found."}
            </p>
          </AdminPanel>
        </div>
      </AdminShell>
    );
  }


  const HeaderIcon =
    getTypeIcon(
      form.type,
    );


  return (
    <AdminShell
      title={entry.title}
      description="Edit the Tennis History archive record, media and publication state."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Heritage CMS · Edit"
          title={entry.title}
          description={`${typeLabel(form.type)} · ${entry.year} · ${entry.slug}`}
          icon={HeaderIcon}
        />


        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={
              () =>
                router.push(
                  "/admin/tennis-history",
                )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Tennis History
          </button>


          <div className="flex flex-wrap gap-2">
            {entry.status ===
            "PUBLISHED" ? (
              <>
                <a
                  href={`/tennis-history#${entry.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/60 transition hover:text-white"
                >
                  <Eye className="h-4 w-4" />

                  Public page
                </a>

                <button
                  type="button"
                  disabled={
                    publishing
                  }
                  onClick={
                    () =>
                      void handlePublicationAction(
                        "unpublish",
                      )
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15 disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" />

                  Return to Draft
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={
                  publishing
                }
                onClick={
                  () =>
                    void handlePublicationAction(
                      "publish",
                    )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-4 text-sm font-black text-[#050B18] transition hover:bg-lime-200 disabled:opacity-50"
              >
                <CircleCheck className="h-4 w-4" />

                Publish
              </button>
            )}
          </div>
        </div>


        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-100"
          >
            {error}
          </div>
        ) : null}


        {success ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100">
            {success}
          </div>
        ) : null}


        <AdminPanel className="overflow-hidden">
          <SectionHeader
            eyebrow="Step 01 · Format"
            title="Historical format"
            description={typeDescription(
              form.type,
            )}
          />

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
            <TypeCard
              type="MILESTONE"
              label="Milestone"
              description="Chronological event"
              selected={
                form.type ===
                "MILESTONE"
              }
              icon={Timeline}
              onSelect={
                (
                  type,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      type,
                    }),
                  )
              }
            />

            <TypeCard
              type="LEGEND"
              label="Legend"
              description="Champion profile"
              selected={
                form.type ===
                "LEGEND"
              }
              icon={Crown}
              onSelect={
                (
                  type,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      type,
                    }),
                  )
              }
            />

            <TypeCard
              type="RIVALRY"
              label="Rivalry"
              description="Two-player exhibit"
              selected={
                form.type ===
                "RIVALRY"
              }
              icon={Swords}
              onSelect={
                (
                  type,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      type,
                    }),
                  )
              }
            />

            <TypeCard
              type="GENERATION"
              label="Generation"
              description="Era / group exhibit"
              selected={
                form.type ===
                "GENERATION"
              }
              icon={Sparkles}
              onSelect={
                (
                  type,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      type,
                    }),
                  )
              }
            />
          </div>
        </AdminPanel>


        <AdminPanel className="overflow-hidden">
          <SectionHeader
            eyebrow="Step 02 · Identity"
            title="Timeline identity"
            description="Core metadata used to position this exhibit inside the historical archive."
          />

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <Field
              label="Title"
              value={
                form.title
              }
              required
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "title",
                    value,
                  )
              }
            />

            <Field
              label="Slug"
              value={
                form.slug
              }
              required
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "slug",
                    value,
                  )
              }
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Year"
                value={
                  form.year
                }
                required
                type="number"
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "year",
                      value,
                    )
                }
              />

              <Field
                label="Month"
                value={
                  form.month
                }
                type="number"
                placeholder="1–12"
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "month",
                      value,
                    )
                }
              />

              <Field
                label="Day"
                value={
                  form.day
                }
                type="number"
                placeholder="1–31"
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "day",
                      value,
                    )
                }
              />
            </div>

            <Field
              label="Sort order"
              value={
                form.sortOrder
              }
              type="number"
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "sortOrder",
                    value,
                  )
              }
            />

            <SelectField
              label="Era"
              value={
                form.era
              }
              options={[
                {
                  value:
                    "ORIGINS",
                  label:
                    "Origins",
                },
                {
                  value:
                    "CLASSIC_ERA",
                  label:
                    "Classic Era",
                },
                {
                  value:
                    "OPEN_ERA",
                  label:
                    "Open Era",
                },
                {
                  value:
                    "MODERN_ERA",
                  label:
                    "Modern Era",
                },
              ]}
              onChange={
                (
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      era:
                        value as EntryEra,
                    }),
                  )
              }
            />

            <SelectField
              label="Gender"
              value={
                form.gender
              }
              options={[
                {
                  value: "",
                  label:
                    "Not specified",
                },
                {
                  value:
                    "MEN",
                  label:
                    "Men",
                },
                {
                  value:
                    "WOMEN",
                  label:
                    "Women",
                },
                {
                  value:
                    "MIXED",
                  label:
                    "Mixed",
                },
              ]}
              onChange={
                (
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      gender:
                        value as EntryGender,
                    }),
                  )
              }
            />

            <Field
              label="Eyebrow"
              value={
                form.eyebrow
              }
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "eyebrow",
                    value,
                  )
              }
            />

            <Field
              label="Subtitle"
              value={
                form.subtitle
              }
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "subtitle",
                    value,
                  )
              }
            />
          </div>
        </AdminPanel>


        {form.type ===
        "LEGEND" ? (
          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 03 · Legend"
              title="Champion profile"
              description="Historical identity and signature achievement for the Legend of History card."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field
                label="Country"
                value={
                  form.country
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "country",
                      value,
                    )
                }
              />

              <Field
                label="Country code"
                value={
                  form.countryCode
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "countryCode",
                      value
                        .toUpperCase()
                        .slice(
                          0,
                          3,
                        ),
                    )
                }
              />

              <Field
                label="Historical period"
                value={
                  form.period
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "period",
                      value,
                    )
                }
              />

              <Field
                label="Signature achievement"
                value={
                  form.achievement
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "achievement",
                      value,
                    )
                }
              />
            </div>
          </AdminPanel>
        ) : null}


        {form.type ===
        "RIVALRY" ? (
          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 03 · Rivalry"
              title="The two protagonists"
              description="Both player names are required for an Iconic Rivalry exhibit."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field
                label="Player one"
                value={
                  form.playerOne
                }
                required
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "playerOne",
                      value,
                    )
                }
              />

              <Field
                label="Player two"
                value={
                  form.playerTwo
                }
                required
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "playerTwo",
                      value,
                    )
                }
              />

              <Field
                label="Historical period"
                value={
                  form.period
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "period",
                      value,
                    )
                }
              />

              <Field
                label="Achievement / label"
                value={
                  form.achievement
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "achievement",
                      value,
                    )
                }
              />
            </div>
          </AdminPanel>
        ) : null}


        {form.type ===
        "GENERATION" ? (
          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 03 · Generation"
              title="Era protagonists"
              description="One player per line, or separate names with commas."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <TextAreaField
                label="Players"
                value={
                  form.playersText
                }
                rows={8}
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "playersText",
                      value,
                    )
                }
              />

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
                  Generation preview
                </p>

                <div className="mt-4 space-y-2">
                  {playersPreview.length >
                  0 ? (
                    playersPreview.map(
                      (
                        player,
                        index,
                      ) => (
                        <div
                          key={`${player}-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#050B18] px-3 py-2"
                        >
                          <span className="grid h-7 w-7 place-items-center rounded-full border border-lime-300/20 bg-lime-300/[0.06] font-mono text-[8px] font-black text-lime-200">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span className="text-sm font-semibold text-white/70">
                            {player}
                          </span>
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-white/25">
                      No protagonists added.
                    </p>
                  )}
                </div>
              </div>

              <Field
                label="Historical period"
                value={
                  form.period
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "period",
                      value,
                    )
                }
              />

              <Field
                label="Achievement / label"
                value={
                  form.achievement
                }
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "achievement",
                      value,
                    )
                }
              />
            </div>
          </AdminPanel>
        ) : null}


        <AdminPanel className="overflow-hidden">
          <SectionHeader
            eyebrow="Step 04 · Editorial"
            title="Museum story"
            description="Public copy and optional archive link."
          />

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <TextAreaField
              label="Description"
              value={
                form.description
              }
              rows={6}
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "description",
                    value,
                  )
              }
            />

            <TextAreaField
              label="Quote"
              value={
                form.quote
              }
              rows={6}
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "quote",
                    value,
                  )
              }
            />

            {form.type ===
            "MILESTONE" ? (
              <>
                <Field
                  label="Historical period"
                  value={
                    form.period
                  }
                  onChange={
                    (
                      value,
                    ) =>
                      updateText(
                        "period",
                        value,
                      )
                  }
                />

                <Field
                  label="Achievement / label"
                  value={
                    form.achievement
                  }
                  onChange={
                    (
                      value,
                    ) =>
                      updateText(
                        "achievement",
                        value,
                      )
                  }
                />
              </>
            ) : null}

            <Field
              label="Public link"
              value={
                form.href
              }
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "href",
                    value,
                  )
              }
            />
          </div>
        </AdminPanel>


        <AdminPanel className="overflow-hidden">
          <SectionHeader
            eyebrow="Step 05 · Media"
            title="Museum imagery"
            description="Choose an AGE202 Media Library image visually. The selected asset is linked to this historical entry, while the fallback URL remains available when needed."
          />

          <div className="grid gap-5 p-5 sm:p-6">
            {mediaLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm text-white/35">
                Loading Media Library...
              </div>
            ) : (
              <MediaPicker
                assets={
                  mediaAssets
                }
                selectedId={
                  form.mediaId ||
                  null
                }
                onSelect={
                  (
                    asset,
                  ) => {
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        mediaId:
                          asset.id,
                        imageUrl:
                          asset.url,
                      }),
                    );

                    setMediaError(
                      null,
                    );
                  }
                }
                onClear={
                  () =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        mediaId:
                          "",
                      }),
                    )
                }
                triggerLabel="Choose Portrait"
              />
            )}

            {mediaError ? (
              <div
                role="alert"
                className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100"
              >
                {mediaError}
              </div>
            ) : null}

            <Field
              label="Fallback image URL"
              value={
                form.imageUrl
              }
              placeholder="/history/legends/rod-laver.webp"
              onChange={
                (
                  value,
                ) =>
                  updateText(
                    "imageUrl",
                    value,
                  )
              }
            />

            <MediaPreview
              imageUrl={
                resolvedImageUrl
              }
              mediaId={
                form.mediaId
              }
            />
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-3">
            <ToggleCard
              checked={
                form.featured
              }
              title="Featured"
              description="Highlight this exhibit inside curated archive views."
              onChange={
                (
                  checked,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      featured:
                        checked,
                    }),
                  )
              }
            />

            <SelectField
              label="Publication status"
              value={
                form.status
              }
              options={[
                {
                  value:
                    "DRAFT",
                  label:
                    "Draft",
                },
                {
                  value:
                    "PUBLISHED",
                  label:
                    "Published",
                },
                {
                  value:
                    "ARCHIVED",
                  label:
                    "Archived",
                },
              ]}
              onChange={
                (
                  value,
                ) =>
                  setForm(
                    (
                      current,
                    ) => ({
                      ...current,
                      status:
                        value as EntryStatus,
                    }),
                  )
              }
            />

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
                Current record
              </p>

              <p className="mt-3 text-sm font-semibold text-white/75">
                {typeLabel(
                  form.type,
                )}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/30">
                {form.year} ·{" "}
                {form.status}
              </p>
            </div>
          </div>


          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={
                deleting
              }
              onClick={
                () =>
                  void handleDelete()
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 text-sm font-semibold text-red-100 transition hover:bg-red-400/15 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />

              {deleting
                ? "Deleting..."
                : "Delete Entry"}
            </button>


            <button
              type="button"
              disabled={
                saving
              }
              onClick={
                () =>
                  void saveEntry()
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-6 text-sm font-black text-[#050B18] transition hover:bg-lime-200 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}


function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-white/10 px-5 py-5 sm:px-6">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  );
}


function TypeCard({
  type,
  label,
  description,
  selected,
  icon: Icon,
  onSelect,
}: {
  type: EntryType;
  label: string;
  description: string;
  selected: boolean;
  icon: typeof Timeline;
  onSelect: (
    type: EntryType,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={
        () =>
          onSelect(
            type,
          )
      }
      className={[
        "rounded-2xl border p-4 text-left transition",
        selected
          ? "border-lime-300/35 bg-lime-300/[0.08]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20",
      ].join(
        " ",
      )}
    >
      <Icon
        className={[
          "h-5 w-5",
          selected
            ? "text-lime-300"
            : "text-white/30",
        ].join(
          " ",
        )}
      />

      <p className="mt-4 text-sm font-semibold text-white">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-white/30">
        {description}
      </p>
    </button>
  );
}


type FieldProps = {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  required?: boolean;
  type?:
    | "text"
    | "number";
};


function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
        {required
          ? " *"
          : ""}
      </span>

      <input
        type={type}
        value={
          value
        }
        required={
          required
        }
        placeholder={
          placeholder
        }
        onChange={
          (
            event,
          ) =>
            onChange(
              event.target.value,
            )
        }
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35"
      />
    </label>
  );
}


function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </span>

      <select
        value={
          value
        }
        onChange={
          (
            event,
          ) =>
            onChange(
              event.target.value,
            )
        }
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#050B18] px-4 text-sm text-white outline-none transition focus:border-lime-300/35"
      >
        {options.map(
          (
            option,
          ) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>
    </label>
  );
}


function TextAreaField({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <label className="block">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-white/30">
        {label}
      </span>

      <textarea
        value={
          value
        }
        rows={
          rows
        }
        onChange={
          (
            event,
          ) =>
            onChange(
              event.target.value,
            )
        }
        className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-[#050B18] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-lime-300/35"
      />
    </label>
  );
}


function ToggleCard({
  checked,
  title,
  description,
  onChange,
}: {
  checked: boolean;
  title: string;
  description: string;
  onChange: (
    checked: boolean,
  ) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-white/15">
      <input
        type="checkbox"
        checked={
          checked
        }
        onChange={
          (
            event,
          ) =>
            onChange(
              event.target.checked,
            )
        }
        className="mt-1 h-4 w-4 accent-lime-300"
      />

      <span>
        <span className="block text-sm font-semibold text-white/75">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-white/30">
          {description}
        </span>
      </span>
    </label>
  );
}


function MediaPreview({
  imageUrl,
  mediaId,
}: {
  imageUrl: string;
  mediaId: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex min-h-40 items-center justify-center bg-[#050B18] p-6">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              imageUrl
            }
            alt=""
            className="max-h-72 max-w-full rounded-xl object-contain"
          />
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-lime-300/35" />

            <p className="mt-3 text-sm font-semibold text-white/45">
              Media preview
            </p>

            <p className="mt-1 text-xs text-white/25">
              {mediaId
                ? "Media Library asset connected."
                : "No image selected yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}