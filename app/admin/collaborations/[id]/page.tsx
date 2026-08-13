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
  Building2,
  CircleCheck,
  Eye,
  ImageIcon,
  Loader2,
  Palette,
  Save,
  Sparkles,
  Trash2,
  Trophy,
  Undo2,
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


type CollaborationResponse = {
  id: string;
  slug: string;
  sortOrder: number;

  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  story: string | null;

  partnerName: string;
  partnerType: PartnerType;
  location: string | null;
  year: number | null;
  period: string | null;

  projectTitle: string | null;
  projectType:
    | Exclude<ProjectType, "">
    | null;
  outcome: string | null;

  websiteUrl: string | null;
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


const emptyForm: FormState = {
  slug: "",
  sortOrder: "0",

  eyebrow: "",
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


function collaborationToForm(
  collaboration:
    CollaborationResponse,
): FormState {
  return {
    slug:
      collaboration.slug,

    sortOrder:
      String(
        collaboration.sortOrder,
      ),

    eyebrow:
      collaboration.eyebrow ??
      "",

    title:
      collaboration.title,

    subtitle:
      collaboration.subtitle ??
      "",

    description:
      collaboration.description ??
      "",

    story:
      collaboration.story ??
      "",

    partnerName:
      collaboration.partnerName,

    partnerType:
      collaboration.partnerType,

    location:
      collaboration.location ??
      "",

    year:
      collaboration.year ===
      null
        ? ""
        : String(
            collaboration.year,
          ),

    period:
      collaboration.period ??
      "",

    projectTitle:
      collaboration.projectTitle ??
      "",

    projectType:
      collaboration.projectType ??
      "",

    outcome:
      collaboration.outcome ??
      "",

    websiteUrl:
      collaboration.websiteUrl ??
      "",

    href:
      collaboration.href ??
      "",

    imageUrl:
      collaboration.imageUrl ??
      "",

    mediaId:
      collaboration.mediaId ??
      "",

    featured:
      collaboration.featured,

    status:
      collaboration.status,
  };
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
      return "A collaboration outside the main AGE202 partnership categories.";
  }
}


function getPartnerIcon(
  type: PartnerType,
) {
  switch (type) {
    case "TENNIS_BRAND":
      return Trophy;

    case "CLUB_EVENT":
      return Building2;

    case "CREATIVE_STUDIO":
      return Palette;

    case "COLLECTOR":
      return Users;

    case "OTHER":
    default:
      return Sparkles;
  }
}


export default function CollaborationEditorPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const router =
    useRouter();

  const collaborationId =
    params.id;

  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      emptyForm,
    );

  const [
    collaboration,
    setCollaboration,
  ] =
    useState<CollaborationResponse | null>(
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
          collaboration?.media?.url ??
          ""
        );
      },
      [
        collaboration?.media?.url,
        form.imageUrl,
        form.mediaId,
        mediaAssets,
      ],
    );


  useEffect(
    () => {
      let cancelled =
        false;

      async function loadCollaboration() {
        setLoading(
          true,
        );

        setError(
          null,
        );

        try {
          const response =
            await fetch(
              `/api/collaborations/${collaborationId}`,
              {
                cache:
                  "no-store",
              },
            );

          const payload =
            (await response.json()) as {
              error?: string;
              collaboration?: CollaborationResponse;
            };

          if (
            !response.ok ||
            !payload.collaboration
          ) {
            throw new Error(
              payload.error ||
                "Unable to load collaboration.",
            );
          }

          if (cancelled) {
            return;
          }

          setCollaboration(
            payload.collaboration,
          );

          setForm(
            collaborationToForm(
              payload.collaboration,
            ),
          );
        } catch (
          loadError
        ) {
          if (cancelled) {
            return;
          }

          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load collaboration.",
          );
        } finally {
          if (!cancelled) {
            setLoading(
              false,
            );
          }
        }
      }

      void loadCollaboration();

      return () => {
        cancelled =
          true;
      };
    },
    [
      collaborationId,
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


  async function saveCollaboration() {
    if (saving) {
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
          `/api/collaborations/${collaborationId}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                slug:
                  form.slug,

                sortOrder:
                  form.sortOrder,

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
                    ? collaboration?.publishedAt ??
                      new Date().toISOString()
                    : null,
              }),
          },
        );

      const payload =
        (await response.json()) as {
          error?: string;
          collaboration?: CollaborationResponse;
        };

      if (
        !response.ok ||
        !payload.collaboration
      ) {
        throw new Error(
          payload.error ||
            "Unable to save collaboration.",
        );
      }

      setCollaboration(
        payload.collaboration,
      );

      setForm(
        collaborationToForm(
          payload.collaboration,
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
          : "Unable to save collaboration.",
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
    if (publishing) {
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
          `/api/collaborations/${collaborationId}/${action}`,
          {
            method:
              "POST",
          },
        );

      const payload =
        (await response.json()) as {
          error?: string;
          collaboration?: CollaborationResponse;
        };

      if (
        !response.ok ||
        !payload.collaboration
      ) {
        throw new Error(
          payload.error ||
            "Unable to change publication status.",
        );
      }

      setCollaboration(
        payload.collaboration,
      );

      setForm(
        collaborationToForm(
          payload.collaboration,
        ),
      );

      setSuccess(
        action ===
          "publish"
          ? "Collaboration published."
          : "Collaboration returned to draft.",
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
    if (deleting) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this collaboration? The linked Media Library asset will not be deleted.",
      );

    if (!confirmed) {
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
          `/api/collaborations/${collaborationId}`,
          {
            method:
              "DELETE",
          },
        );

      const payload =
        (await response.json()) as {
          error?: string;
        };

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "Unable to delete collaboration.",
        );
      }

      router.push(
        "/admin/collaborations",
      );

      router.refresh();
    } catch (
      deleteError
    ) {
      setError(
        deleteError instanceof
          Error
          ? deleteError.message
          : "Unable to delete collaboration.",
      );

      setDeleting(
        false,
      );
    }
  }


  if (loading) {
    return (
      <AdminShell
        title="Collaborations"
        description="Loading partnership archive entry."
      >
        <AdminPanel className="p-12">
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-white/45">
            <Loader2 className="h-5 w-5 animate-spin text-lime-300" />

            Loading Collaboration...
          </div>
        </AdminPanel>
      </AdminShell>
    );
  }


  if (!collaboration) {
    return (
      <AdminShell
        title="Collaborations"
        description="Partnership archive entry unavailable."
      >
        <div className="space-y-6">
          <button
            type="button"
            onClick={
              () =>
                router.push(
                  "/admin/collaborations",
                )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/55"
          >
            <ArrowLeft className="h-4 w-4" />

            Collaborations
          </button>

          <AdminPanel className="p-8">
            <p className="text-sm font-semibold text-red-100">
              {error ||
                "Collaboration not found."}
            </p>
          </AdminPanel>
        </div>
      </AdminShell>
    );
  }


  const HeaderIcon =
    getPartnerIcon(
      form.partnerType,
    );


  return (
    <AdminShell
      title={collaboration.title}
      description="Edit the AGE202 collaboration record, media and publication state."
    >
      <div className="space-y-7">
        <AdminPageHeader
          eyebrow="Partnership CMS · Edit"
          title={collaboration.title}
          description={`${partnerTypeLabel(form.partnerType)} · ${form.year || "No year"} · ${collaboration.slug}`}
          icon={HeaderIcon}
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


          <div className="flex flex-wrap gap-2">
            {collaboration.status ===
            "PUBLISHED" ? (
              <>
                <a
                  href={`/collaborations#${collaboration.slug}`}
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
            eyebrow="Step 01 · Partner type"
            title="Collaboration category"
            description={partnerTypeDescription(
              form.partnerType,
            )}
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
        </AdminPanel>


        <AdminPanel className="overflow-hidden">
          <SectionHeader
            eyebrow="Step 02 · Partnership identity"
            title="Partner & project"
            description="Core metadata used to identify and position this collaboration inside the AGE202 partnership archive."
          />

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <Field
              label="Partner name"
              value={
                form.partnerName
              }
              required
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

            <Field
              label="Project title"
              value={
                form.projectTitle
              }
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


        <AdminPanel className="overflow-hidden">
          <SectionHeader
            eyebrow="Step 03 · Editorial"
            title="Collaboration story"
            description="Public copy, project outcome and links connected to this partnership."
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
              label="Story"
              value={
                form.story
              }
              rows={6}
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
            description="Choose an AGE202 Media Library image visually. The selected asset remains linked to this collaboration while the fallback URL stays available."
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
                triggerLabel="Choose Collaboration Image"
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
                Current record
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
                : "Delete Collaboration"}
            </button>


            <button
              type="button"
              disabled={
                saving
              }
              onClick={
                () =>
                  void saveCollaboration()
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
  required?: boolean;
  type?:
    | "text"
    | "number";
};


function Field({
  label,
  value,
  onChange,
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