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
  Building2,
  CircleCheck,
  ImageIcon,
  Palette,
  Plus,
  Save,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import AdminShell from "@/components/admin/AdminShell";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminPanel from "@/components/admin/ui/AdminPanel";
import MediaPicker, {
  type MediaPickerAsset,
} from "@/components/admin/media/MediaPicker";


type PartnerType =
  | "TENNIS_BRAND"
  | "CLUB_EVENT"
  | "CREATIVE_STUDIO"
  | "COLLECTOR"
  | "OTHER";

type ProjectType =
  | ""
  | "ARCHIVE_STORY"
  | "LIMITED_CAPSULE"
  | "EXHIBITION_POPUP"
  | "CAMPAIGN_CONTENT"
  | "OTHER";

type EntryStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";

type FormState = {
  slug: string;
  sortOrder: string;

  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  story: string;

  partnerName: string;
  partnerType: PartnerType;
  location: string;
  year: string;
  period: string;

  projectTitle: string;
  projectType: ProjectType;
  outcome: string;

  websiteUrl: string;
  href: string;

  imageUrl: string;
  mediaId: string;

  featured: boolean;
  status: EntryStatus;
};


const initialState: FormState = {
  slug: "",
  sortOrder: "0",

  eyebrow: "AGE202 Collaboration",
  title: "",
  subtitle: "",
  description: "",
  story: "",

  partnerName: "",
  partnerType: "TENNIS_BRAND",
  location: "",
  year: "",
  period: "",

  projectTitle: "",
  projectType: "",
  outcome: "",

  websiteUrl: "",
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


function partnerTypeLabel(
  type: PartnerType,
) {
  switch (type) {
    case "TENNIS_BRAND":
      return "Tennis Brand";

    case "CLUB_EVENT":
      return "Club / Event";

    case "CREATIVE_STUDIO":
      return "Creative Studio";

    case "COLLECTOR":
      return "Collector";

    case "OTHER":
      return "Other";
  }
}


function partnerTypeDescription(
  type: PartnerType,
) {
  switch (type) {
    case "TENNIS_BRAND":
      return "Partnership with a tennis, apparel or equipment brand.";

    case "CLUB_EVENT":
      return "Collaboration with a tennis club, tournament, event or institution.";

    case "CREATIVE_STUDIO":
      return "Creative work developed with photographers, designers, studios or agencies.";

    case "COLLECTOR":
      return "A project built with a private collector or tennis memorabilia archive.";

    case "OTHER":
      return "A collaboration that does not belong to the main AGE202 partnership categories.";
  }
}


export default function NewCollaborationPage() {
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

          if (!response.ok) {
            throw new Error(
              payload.error ||
                "Unable to load Media Library.",
            );
          }

          if (!cancelled) {
            setMediaAssets(
              payload.assets ??
                [],
            );
          }
        } catch (
          loadError
        ) {
          if (!cancelled) {
            setMediaError(
              loadError instanceof
                Error
                ? loadError.message
                : "Unable to load Media Library.",
            );
          }
        } finally {
          if (!cancelled) {
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
        if (!form.slug) {
          return "Collaboration available after creation";
        }

        return `/collaborations#${form.slug}`;
      },
      [
        form.slug,
      ],
    );


  function updateText(
    key:
      | "slug"
      | "sortOrder"
      | "eyebrow"
      | "title"
      | "subtitle"
      | "description"
      | "story"
      | "partnerName"
      | "location"
      | "year"
      | "period"
      | "projectTitle"
      | "outcome"
      | "websiteUrl"
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


  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitting) {
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
          "/api/collaborations",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                slug:
                  form.slug,

                sortOrder:
                  form.sortOrder ||
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

                story:
                  form.story ||
                  null,

                partnerName:
                  form.partnerName,

                partnerType:
                  form.partnerType,

                location:
                  form.location ||
                  null,

                year:
                  form.year ||
                  null,

                period:
                  form.period ||
                  null,

                projectTitle:
                  form.projectTitle ||
                  null,

                projectType:
                  form.projectType ||
                  null,

                outcome:
                  form.outcome ||
                  null,

                websiteUrl:
                  form.websiteUrl ||
                  null,

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

          collaboration?: {
            id: string;
          };
        };

      if (
        !response.ok ||
        !payload.collaboration
      ) {
        throw new Error(
          payload.error ||
            "Unable to create collaboration.",
        );
      }

      setSuccess(
        true,
      );

      router.push(
        `/admin/collaborations/${payload.collaboration.id}`,
      );

      router.refresh();
    } catch (
      submissionError
    ) {
      setError(
        submissionError instanceof
          Error
          ? submissionError.message
          : "Unable to create collaboration.",
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }


  return (
    <AdminShell
      title="New Collaboration"
      description="Create a new AGE202 partnership, creative project or cultural collaboration."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Partnership CMS · Create"
          title="New Collaboration"
          description="Create the partnership record first. Editorial content, imagery, links and publication status can be refined after creation."
          icon={Sparkles}
        />


        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={
              () =>
                router.push(
                  "/admin/collaborations",
                )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            Collaborations
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
            Collaboration created successfully.
          </div>
        ) : null}


        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-7"
        >
          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 01 · Partner type"
              title="Collaboration category"
              description="Choose the category that best represents the partner. This classification is also used by the Collaborations dashboard."
            />

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-5">
              <PartnerTypeCard
                type="TENNIS_BRAND"
                label="Tennis Brand"
                description="Apparel / equipment"
                selected={
                  form.partnerType ===
                  "TENNIS_BRAND"
                }
                icon={Trophy}
                onSelect={
                  (
                    partnerType,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        partnerType,
                      }),
                    )
                }
              />

              <PartnerTypeCard
                type="CLUB_EVENT"
                label="Club / Event"
                description="Tournament / venue"
                selected={
                  form.partnerType ===
                  "CLUB_EVENT"
                }
                icon={Building2}
                onSelect={
                  (
                    partnerType,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        partnerType,
                      }),
                    )
                }
              />

              <PartnerTypeCard
                type="CREATIVE_STUDIO"
                label="Creative Studio"
                description="Design / photography"
                selected={
                  form.partnerType ===
                  "CREATIVE_STUDIO"
                }
                icon={Palette}
                onSelect={
                  (
                    partnerType,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        partnerType,
                      }),
                    )
                }
              />

              <PartnerTypeCard
                type="COLLECTOR"
                label="Collector"
                description="Archive / memorabilia"
                selected={
                  form.partnerType ===
                  "COLLECTOR"
                }
                icon={Users}
                onSelect={
                  (
                    partnerType,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        partnerType,
                      }),
                    )
                }
              />

              <PartnerTypeCard
                type="OTHER"
                label="Other"
                description="Other partnership"
                selected={
                  form.partnerType ===
                  "OTHER"
                }
                icon={Sparkles}
                onSelect={
                  (
                    partnerType,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        partnerType,
                      }),
                    )
                }
              />
            </div>

            <div className="border-t border-white/10 px-5 py-4 sm:px-6">
              <p className="text-xs leading-6 text-white/35">
                <span className="font-semibold text-white/65">
                  {partnerTypeLabel(
                    form.partnerType,
                  )}
                </span>
                {" · "}
                {partnerTypeDescription(
                  form.partnerType,
                )}
              </p>
            </div>
          </AdminPanel>


          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 02 · Partnership identity"
              title="Partner & project"
              description="Define the partner, project identity, period and ordering inside the AGE202 collaborations archive."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <Field
                label="Partner name"
                value={
                  form.partnerName
                }
                required
                placeholder="Nike Tennis"
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "partnerName",
                      value,
                    )
                }
              />

              <Field
                label="Title"
                value={
                  form.title
                }
                required
                placeholder="AGE202 × Nike Tennis"
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
                placeholder="age202-nike-tennis"
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
                label="Sort order"
                value={
                  form.sortOrder
                }
                type="number"
                placeholder="0"
                hint="Controls the order of collaborations in the archive."
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

              <Field
                label="Project title"
                value={
                  form.projectTitle
                }
                placeholder="Archive Editorial Project"
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "projectTitle",
                      value,
                    )
                }
              />

              <SelectField
                label="Project type"
                value={
                  form.projectType
                }
                options={[
                  {
                    value: "",
                    label:
                      "Not specified",
                  },
                  {
                    value:
                      "ARCHIVE_STORY",
                    label:
                      "Archive Story",
                  },
                  {
                    value:
                      "LIMITED_CAPSULE",
                    label:
                      "Limited Capsule",
                  },
                  {
                    value:
                      "EXHIBITION_POPUP",
                    label:
                      "Exhibition / Pop-Up",
                  },
                  {
                    value:
                      "CAMPAIGN_CONTENT",
                    label:
                      "Campaign Content",
                  },
                  {
                    value:
                      "OTHER",
                    label:
                      "Other",
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
                        projectType:
                          value as ProjectType,
                      }),
                    )
                }
              />

              <Field
                label="Year"
                value={
                  form.year
                }
                type="number"
                placeholder="2026"
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
                label="Period"
                value={
                  form.period
                }
                placeholder="2026 · Summer"
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
                label="Location"
                value={
                  form.location
                }
                placeholder="Rome, Italy"
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "location",
                      value,
                    )
                }
              />

              <Field
                label="Eyebrow"
                value={
                  form.eyebrow
                }
                placeholder="AGE202 Collaboration"
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
                placeholder="Tennis culture meets archival storytelling"
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


          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 03 · Editorial"
              title="Collaboration story"
              description="Write the public-facing story, project outcome and links connected to this collaboration."
            />

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              <TextAreaField
                label="Description"
                value={
                  form.description
                }
                rows={6}
                placeholder="Introduce the collaboration and explain why it belongs in the AGE202 archive..."
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
                label="Story"
                value={
                  form.story
                }
                rows={6}
                placeholder="Tell the deeper story behind the partnership..."
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "story",
                      value,
                    )
                }
              />

              <TextAreaField
                label="Outcome"
                value={
                  form.outcome
                }
                rows={5}
                placeholder="Describe the result, exhibition, editorial piece, collection or cultural impact..."
                onChange={
                  (
                    value,
                  ) =>
                    updateText(
                      "outcome",
                      value,
                    )
                }
              />

              <div className="grid content-start gap-5">
                <Field
                  label="Partner website"
                  value={
                    form.websiteUrl
                  }
                  placeholder="https://..."
                  hint="Optional external website for the partner."
                  onChange={
                    (
                      value,
                    ) =>
                      updateText(
                        "websiteUrl",
                        value,
                      )
                  }
                />

                <Field
                  label="AGE202 public link"
                  value={
                    form.href
                  }
                  placeholder="/collaborations/example"
                  hint="Optional internal AGE202 destination."
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
            </div>
          </AdminPanel>


          <AdminPanel className="overflow-hidden">
            <SectionHeader
              eyebrow="Step 04 · Media"
              title="Collaboration imagery"
              description="Choose an existing AGE202 Media Library image. A fallback image URL remains available when needed."
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
                placeholder="/collaborations/example.webp"
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
                description="Highlight this collaboration in curated AGE202 partnership views."
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
                  Selected partnership
                </p>

                <p className="mt-3 text-sm font-semibold text-white/75">
                  {partnerTypeLabel(
                    form.partnerType,
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
                  After creation you will be redirected to the Collaboration editor.
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

                    Create Collaboration
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


function PartnerTypeCard({
  type,
  label,
  description,
  selected,
  icon: Icon,
  onSelect,
}: {
  type: PartnerType;
  label: string;
  description: string;
  selected: boolean;
  icon: typeof Trophy;
  onSelect: (
    type: PartnerType,
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