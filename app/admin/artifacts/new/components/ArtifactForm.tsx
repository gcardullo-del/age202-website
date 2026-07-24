"use client";

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

export default function ArtifactForm({
  players,
  brands,
  mode = "create",
  artifactId,
  initialValues,
  action,
}: ArtifactFormProps) {
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

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {artifactId && (
        <input
          type="hidden"
          name="artifactId"
          value={artifactId}
        />
      )}

      <GeneralInfoCard
        players={players}
        brands={brands}
        initialValues={{
          title:
            initialValues?.title ?? "",

          subtitle:
            initialValues?.subtitle ?? "",

          archiveNumber:
            initialValues?.archiveNumber ??
            "",

          year:
            initialValues?.year ??
            undefined,

          season:
            initialValues?.season ?? "",

          tournament:
            initialValues?.tournament ?? "",

          collection:
            initialValues?.collection ?? "",

          edition:
            initialValues?.edition ?? "",

          playerId:
            initialValues?.playerId ?? "",

          brandId:
            initialValues?.brandId ?? "",

          category:
            initialValues?.category ??
            undefined,

          rarity:
            initialValues?.rarity ??
            "COMMON",

          size:
            initialValues?.size ?? "",

          condition:
            initialValues?.condition ??
            "EXCELLENT",

          colour:
            initialValues?.colour ?? "",

          material:
            initialValues?.material ?? "",
        }}
      />

      <MediaCard
        existingImages={
          initialValues?.images ?? []
        }
      />

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

      <MarketplaceCard
        initialValues={{
          availability:
            initialValues?.availability ??
            "COMING_SOON",

          price:
            initialValues?.price ?? null,

          currency:
            initialValues?.currency ??
            "EUR",

          vintedUrl:
            initialValues?.vintedUrl ??
            "",
        }}
      />

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

      <PublicationCard
        initialValues={{
          status:
            initialValues?.status ??
            "DRAFT",

          slug:
            initialValues?.slug ?? "",

          featured:
            initialValues?.featured ??
            false,
        }}
      />

      <div className="sticky bottom-6 z-30 flex flex-col-reverse gap-3 rounded-3xl border border-white/10 bg-[#08111F]/95 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/35">
          {isEditing
            ? "Update the catalog information for this artifact."
            : "Create a new entry in the AGE202 digital archive."}
        </p>

        <div className="flex items-center justify-end gap-4">
          <button
            type="reset"
            className="rounded-2xl border border-white/10 px-6 py-3 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            {isEditing
              ? "Reset Changes"
              : "Reset"}
          </button>

          <button
            type="submit"
            className="rounded-2xl bg-lime-300 px-7 py-3 font-semibold text-[#050B18] transition hover:bg-lime-200"
          >
            {isEditing
              ? "Save Changes"
              : "Save Artifact"}
          </button>
        </div>
      </div>
    </form>
  );
}