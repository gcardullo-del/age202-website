"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpenText,
  Eye,
  FileText,
  Images,
  Landmark,
  Save,
  ShoppingBag,
} from "lucide-react";

import type {
  ArtifactAvailability,
  ArtifactCategory,
  ArtifactCondition,
  ArtifactRarity,
  ArtifactStatus,
  Brand,
  Player,
} from "@/generated/prisma/client";

import type { ExistingMediaImage } from "@/components/media/MediaUploader";

import { createArtifact } from "../../actions/createArtifact";
import { updateArtifact } from "../../actions/updateArtifact";

import AuthenticityCard from "./AuthenticityCard";
import GeneralInfoCard from "./GeneralInfoCard";
import MarketplaceCard from "./MarketplaceCard";
import MediaCard from "./MediaCard";
import PublicationCard from "./PublicationCard";
import StoryCard from "./StoryCard";

type ArtifactFormMode = "create" | "edit";

type WorkspaceSection =
  | "general"
  | "media"
  | "story"
  | "marketplace"
  | "authenticity"
  | "publication";

type ArtifactFormAction = (
  formData: FormData,
) => void | Promise<void>;

export type ArtifactFormInitialValues = {
  title?: string;
  subtitle?: string | null;
  archiveNumber?: string;
  year?: number | null;
  season?: string | null;
  tournament?: string | null;
  collection?: string | null;
  edition?: string | null;
  playerId?: string;
  brandId?: string;
  category?: ArtifactCategory | null;
  rarity?: ArtifactRarity | null;
  size?: string | null;
  condition?: ArtifactCondition;
  colour?: string | null;
  material?: string | null;
  description?: string | null;
  museumStory?: string | null;
  historicalContext?: string | null;
  curatorNote?: string | null;
  availability?: ArtifactAvailability;
  price?: number | string | null;
  currency?: string | null;
  vintedUrl?: string | null;
  authentic?: boolean;
  authenticityCode?: string | null;
  vintage?: boolean;
  tags?: string[] | null;
  status?: ArtifactStatus;
  slug?: string;
  featured?: boolean;
  images?: ExistingMediaImage[];
};

type ArtifactFormProps = {
  players: Player[];
  brands: Brand[];
  mode?: ArtifactFormMode;
  artifactId?: string;
  initialValues?: ArtifactFormInitialValues;
  action?: ArtifactFormAction;
};

const sections = [
  {
    id: "general",
    label: "General",
    description: "Identity and classification",
    icon: Landmark,
  },
  {
    id: "media",
    label: "Media",
    description: "Cover and gallery",
    icon: Images,
  },
  {
    id: "story",
    label: "Story",
    description: "Museum narrative",
    icon: BookOpenText,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Availability and price",
    icon: ShoppingBag,
  },
  {
    id: "authenticity",
    label: "Authenticity",
    description: "Codes and attributes",
    icon: BadgeCheck,
  },
  {
    id: "publication",
    label: "Publication",
    description: "Status and visibility",
    icon: FileText,
  },
] as const;

function SectionPanel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={active ? "block" : "hidden"}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

export default function ArtifactForm({
  players,
  brands,
  mode = "create",
  artifactId,
  initialValues,
  action,
}: ArtifactFormProps) {
  const [activeSection, setActiveSection] =
    useState<WorkspaceSection>("general");

  const isEditing = mode === "edit";

  if (isEditing && !artifactId) {
    throw new Error(
      "artifactId is required when ArtifactForm is used in edit mode.",
    );
  }

  const formAction =
    action ??
    (isEditing
      ? updateArtifact
      : createArtifact);

  const previewSlug =
    initialValues?.slug?.trim() ?? "";

  const isPublished =
    initialValues?.status === "PUBLISHED";

  const canPreview =
    isEditing &&
    Boolean(previewSlug) &&
    isPublished;

  const previewHref = canPreview
    ? `/artifacts/${encodeURIComponent(
        previewSlug,
      )}`
    : null;

  return (
    <form
      action={formAction}
      className="pb-8"
    >
      {artifactId && (
        <input
          type="hidden"
          name="artifactId"
          value={artifactId}
        />
      )}

      <div className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]">
        <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">
                {isEditing
                  ? "Artifact workspace"
                  : "New catalog entry"}
              </span>

              {initialValues?.status && (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/55">
                  {initialValues.status}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-white">
              {initialValues?.title ||
                (isEditing
                  ? "Edit artifact"
                  : "Create artifact")}
            </h2>

            <p className="mt-2 text-sm text-white/40">
              {initialValues?.archiveNumber
                ? `Archive ${initialValues.archiveNumber}`
                : "Complete each section before saving the museum record."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {previewHref ? (
              <Link
                href={previewHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-white"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            ) : (
              <button
                type="button"
                disabled
                title={
                  !isEditing
                    ? "Save the artifact before opening the preview."
                    : !previewSlug
                      ? "Add and save a slug before opening the preview."
                      : "Publish the artifact before opening the public preview."
                }
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/5 px-4 py-2.5 text-sm font-medium text-white/25"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-5 py-2.5 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
            >
              <Save className="h-4 w-4" />
              {isEditing
                ? "Save changes"
                : "Save artifact"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <nav
            className="border-b border-white/10 p-3 lg:border-b-0 lg:border-r lg:p-4"
            aria-label="Artifact sections"
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive =
                  activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        section.id,
                      )
                    }
                    aria-current={
                      isActive
                        ? "step"
                        : undefined
                    }
                    className={`flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-lime-300 text-[#050B18]"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        isActive
                          ? "bg-black/10"
                          : "bg-white/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {section.label}
                      </span>

                      <span
                        className={`hidden truncate text-xs lg:block ${
                          isActive
                            ? "text-[#050B18]/60"
                            : "text-white/30"
                        }`}
                      >
                        {section.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <SectionPanel
              active={
                activeSection === "general"
              }
            >
              <GeneralInfoCard
                players={players}
                brands={brands}
                initialValues={{
                  title:
                    initialValues?.title ??
                    "",
                  subtitle:
                    initialValues?.subtitle ??
                    "",
                  archiveNumber:
                    initialValues?.archiveNumber ??
                    "",
                  year:
                    initialValues?.year ??
                    undefined,
                  season:
                    initialValues?.season ??
                    "",
                  tournament:
                    initialValues?.tournament ??
                    "",
                  collection:
                    initialValues?.collection ??
                    "",
                  edition:
                    initialValues?.edition ??
                    "",
                  playerId:
                    initialValues?.playerId ??
                    "",
                  brandId:
                    initialValues?.brandId ??
                    "",
                  category:
                    initialValues?.category ??
                    undefined,
                  rarity:
                    initialValues?.rarity ??
                    "COMMON",
                  size:
                    initialValues?.size ??
                    "",
                  condition:
                    initialValues?.condition ??
                    "EXCELLENT",
                  colour:
                    initialValues?.colour ??
                    "",
                  material:
                    initialValues?.material ??
                    "",
                }}
              />
            </SectionPanel>

            <SectionPanel
              active={
                activeSection === "media"
              }
            >
              <MediaCard
                existingImages={
                  initialValues?.images ?? []
                }
              />
            </SectionPanel>

            <SectionPanel
              active={
                activeSection === "story"
              }
            >
              <StoryCard
                initialValues={{
                  description:
                    initialValues?.description ??
                    "",
                  museumStory:
                    initialValues?.museumStory ??
                    "",
                  historicalContext:
                    initialValues?.historicalContext ??
                    "",
                  curatorNote:
                    initialValues?.curatorNote ??
                    "",
                }}
              />
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "marketplace"
              }
            >
              <MarketplaceCard
                initialValues={{
                  availability:
                    initialValues?.availability ??
                    "COMING_SOON",
                  price:
                    initialValues?.price ??
                    null,
                  currency:
                    initialValues?.currency ??
                    "EUR",
                  vintedUrl:
                    initialValues?.vintedUrl ??
                    "",
                }}
              />
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "authenticity"
              }
            >
              <AuthenticityCard
                authentic={
                  initialValues?.authentic ??
                  false
                }
                authenticityCode={
                  initialValues?.authenticityCode ??
                  ""
                }
                vintage={
                  initialValues?.vintage ??
                  false
                }
                tags={
                  initialValues?.tags ?? []
                }
              />
            </SectionPanel>

            <SectionPanel
              active={
                activeSection ===
                "publication"
              }
            >
              <PublicationCard
                initialValues={{
                  status:
                    initialValues?.status ??
                    "DRAFT",
                  slug:
                    initialValues?.slug ??
                    "",
                  featured:
                    initialValues?.featured ??
                    false,
                }}
              />
            </SectionPanel>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-3xl border border-white/10 bg-[#08111F] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/35">
          {isEditing
            ? "Review the active section, then save the complete artifact record."
            : "Create a new entry in the AGE202 digital archive."}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="reset"
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            {isEditing
              ? "Reset changes"
              : "Reset"}
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-6 py-3 text-sm font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            <Save className="h-4 w-4" />
            {isEditing
              ? "Save changes"
              : "Save artifact"}
          </button>
        </div>
      </div>
    </form>
  );
}