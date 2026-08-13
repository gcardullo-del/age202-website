"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CircleCheck,
  Crown,
  ImageIcon,
  Plus,
  Save,
  Sparkles,
  Swords,
  Timeline,
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


type FormState = {
  type: EntryType;
  slug: string;
  year: string;
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


const initialState: FormState = {
  type: "LEGEND",
  slug: "",
  year: "",
  sortOrder: "0",
  era: "OPEN_ERA",
  gender: "",

  eyebrow: "Legend of History",
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


function makeSlug(
  value: string,
) {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
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
      return "A historical event placed on the chronological spine of the Tennis History page.";

    case "LEGEND":
      return "A museum profile dedicated to a champion who shaped a major era of tennis history.";

    case "RIVALRY":
      return "A shared exhibit dedicated to two players whose rivalry defined a period of the sport.";

    case "GENERATION":
      return "A broad era exhibit grouping several players into one historical chapter.";
  }
}


function defaultEyebrow(
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


export default function NewTennisHistoryEntryPage() {
  const router =
    useRouter();


  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      initialState,
    );


  const [
    slugEdited,
    setSlugEdited,
  ] =
    useState(false);


  const [
    submitting,
    setSubmitting,
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
    useState(false);


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


  const publicPreview =
    useMemo(
      () => {
        if (
          !form.slug
        ) {
          return "Entry available after creation";
        }

        return `/tennis-history#${form.slug}`;
      },
      [
        form.slug,
      ],
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


  function updateText(
    key:
      | "slug"
      | "year"
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


  function handleTypeChange(
    type: EntryType,
  ) {
    setForm(
      (
        current,
      ) => ({
        ...current,
        type,
        eyebrow:
          current.eyebrow ===
            defaultEyebrow(
              current.type,
            ) ||
          !current.eyebrow.trim()
            ? defaultEyebrow(
                type,
              )
            : current.eyebrow,
      }),
    );
  }


  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      submitting
    ) {
      return;
    }

    setError(
      null,
    );

    setSuccess(
      false,
    );

    setSubmitting(
      true,
    );

    try {
      const response =
        await fetch(
          "/api/tennis-history",
          {
            method:
              "POST",

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

                sortOrder:
                  form.sortOrder ||
                  null,

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

                publishedAt:
                  form.status ===
                  "PUBLISHED"
                    ? new Date().toISOString()
                    : null,
              }),
          },
        );


      const payload =
        (await response.json()) as {
          error?: string;

          entry?: {
            id: string;
          };
        };


      if (
        !response.ok ||
        !payload.entry
      ) {
        throw new Error(
          payload.error ||
            "Unable to create Tennis History entry.",
        );
      }


      setSuccess(
        true,
      );

      router.push(
        `/admin/tennis-history/${payload.entry.id}`,
      );

      router.refresh();
    } catch (
      submissionError
    ) {
      setError(
        submissionError instanceof
        Error
          ? submissionError.message
          : "Unable to create Tennis History entry.",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }


  return (
    <AdminShell
      title="New History Entry"
      description="Create a new milestone, legend, rivalry or generation exhibit for the AGE202 Tennis History archive."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Heritage CMS · Create"
          title="New History Entry"
          description="Create the historical record first. Media, editorial copy and publication status can be refined after creation."
          icon={BookOpen}
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


          <div className="rounded-2xl border border-lime-300/15 bg-lime-300/[0.06] px-4 py-3">
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-lime-200/60">
              Public reference
            </p>

            <p className="mt-1 text-xs font-semibold text-lime-100">
              {publicPreview}
            </p>
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
            History entry created successfully.
          </div>
        ) : null}


        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-7"
        >
          <AdminPanel className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Step 01 · Exhibit type
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Historical format
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
                The selected format controls which editorial fields are shown below.
              </p>
            </div>


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
                  handleTypeChange
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
                  handleTypeChange
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
                  handleTypeChange
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
                  handleTypeChange
                }
              />
            </div>


            <div className="border-t border-white/10 px-5 py-4 sm:px-6">
              <p className="text-xs leading-6 text-white/35">
                <span className="font-semibold text-white/65">
                  {typeLabel(
                    form.type,
                  )}
                </span>
                {" · "}
                {typeDescription(
                  form.type,
                )}
              </p>
            </div>
          </AdminPanel>


          <AdminPanel className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-300/70">
                Step 02 · Timeline identity
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Date, era & identity
              </h2>
            </div>


            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field
                label="Title"
                value={
                  form.title
                }
                required
                placeholder={
                  form.type ===
                  "LEGEND"
                    ? "Rod Laver"
                    : form.type ===
                        "RIVALRY"
                      ? "Fire Meets Ice"
                      : form.type ===
                          "GENERATION"
                        ? "The Big Three Era"
                        : "The Open Era Begins"
                }
                onChange={
                  (
                    value,
                  ) => {
                    updateText(
                      "title",
                      value,
                    );

                    if (
                      !slugEdited
                    ) {
                      updateText(
                        "slug",
                        makeSlug(
                          value,
                        ),
                      );
                    }
                  }
                }
              />


              <Field
                label="Slug"
                value={
                  form.slug
                }
                required
                placeholder="rod-laver"
                hint="Unique CMS identifier."
                onChange={
                  (
                    value,
                  ) => {
                    setSlugEdited(
                      true,
                    );

                    updateText(
                      "slug",
                      makeSlug(
                        value,
                      ),
                    );
                  }
                }
              />


              <Field
                label="Year"
                value={
                  form.year
                }
                required
                type="number"
                placeholder="1969"
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
                label="Sort order"
                value={
                  form.sortOrder
                }
                type="number"
                placeholder="0"
                hint="Controls ordering when several entries share the same year."
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
                placeholder="Legend of History"
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
                placeholder="The Complete Champion"
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
                eyebrow="Step 03 · Legend profile"
                title="Champion identity"
                description="Fields used by the Legend of History museum card."
              />

              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                <Field
                  label="Country"
                  value={
                    form.country
                  }
                  placeholder="Australia"
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
                  placeholder="AUS"
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
                  placeholder="1960s — 1970s"
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
                  placeholder="Calendar Grand Slam"
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
                description="Both players are required for an Iconic Rivalry entry."
              />

              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                <Field
                  label="Player one"
                  value={
                    form.playerOne
                  }
                  required
                  placeholder="Björn Borg"
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
                  placeholder="John McEnroe"
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
                  placeholder="1980 — 1981"
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
                  placeholder="Iconic rivalry"
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
                description="Add at least two player names, one per line or separated by commas."
              />

              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                <TextAreaField
                  label="Players"
                  value={
                    form.playersText
                  }
                  rows={8}
                  placeholder={"Roger Federer\nRafael Nadal\nNovak Djokovic"}
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
                      <p className="text-sm leading-6 text-white/25">
                        No protagonists added yet.
                      </p>
                    )}
                  </div>
                </div>

                <Field
                  label="Historical period"
                  value={
                    form.period
                  }
                  placeholder="2000s — 2020s"
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
                  placeholder="Defining era"
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
              eyebrow={
                form.type ===
                "MILESTONE"
                  ? "Step 03 · Editorial"
                  : "Step 04 · Editorial"
              }
              title="Museum story"
              description="Editorial copy shown in the public Tennis History experience."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <TextAreaField
                label="Description"
                value={
                  form.description
                }
                rows={6}
                placeholder="Write the historical context of this exhibit..."
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
                placeholder="Optional signature quote..."
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
                    placeholder="1968 · Open Era"
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
                    placeholder="A new professional age"
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
                placeholder="/archives/roger-federer"
                hint="Optional link from the exhibit to another AGE202 archive."
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
              eyebrow={
                form.type ===
                "MILESTONE"
                  ? "Step 04 · Media"
                  : "Step 05 · Media"
              }
              title="Museum imagery"
              description="Choose an existing AGE202 Media Library image visually. A fallback image URL remains available when needed."
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
                hint="Automatically filled when you choose a Media Library asset. You can also enter a fallback URL manually."
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
                  form.imageUrl
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
                description="Highlight this entry inside the Tennis History CMS and future curated archive views."
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
                  Selected exhibit
                </p>

                <p className="mt-3 text-sm font-semibold text-white/75">
                  {typeLabel(
                    form.type,
                  )}
                </p>

                <p className="mt-1 text-xs leading-5 text-white/30">
                  {form.year ||
                    "No year"}{" "}
                  ·{" "}
                  {form.status}
                </p>
              </div>
            </div>


            <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 text-sm text-white/35">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-300/60" />

                <p className="max-w-2xl leading-6">
                  After creation you will be redirected to the Tennis History entry editor.
                </p>
              </div>


              <button
                type="submit"
                disabled={
                  submitting
                }
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-lime-300 px-6 text-sm font-black text-[#050B18] transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Save className="h-4 w-4" />

                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />

                    Create History Entry
                  </>
                )}
              </button>
            </div>
          </AdminPanel>
        </form>
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
  hint?: string;
};


function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  hint,
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

      {hint ? (
        <span className="mt-2 block text-xs leading-5 text-white/25">
          {hint}
        </span>
      ) : null}
    </label>
  );
}


type SelectFieldProps = {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (
    value: string,
  ) => void;
};


function SelectField({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
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


type TextAreaFieldProps = {
  label: string;
  value: string;
  rows: number;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
};


function TextAreaField({
  label,
  value,
  rows,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
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
        className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-[#050B18] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-lime-300/35"
      />
    </label>
  );
}


type ToggleCardProps = {
  checked: boolean;
  title: string;
  description: string;
  onChange: (
    checked: boolean,
  ) => void;
};


function ToggleCard({
  checked,
  title,
  description,
  onChange,
}: ToggleCardProps) {
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
      <div className="flex min-h-36 items-center justify-center bg-[#050B18] p-6">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              imageUrl
            }
            alt=""
            className="max-h-64 max-w-full rounded-xl object-contain"
          />
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-lime-300/35" />

            <p className="mt-3 text-sm font-semibold text-white/45">
              Media preview
            </p>

            <p className="mt-1 text-xs text-white/25">
              {mediaId
                ? "Media Library asset connected by ID."
                : "No image selected yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}