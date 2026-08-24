"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createArtifact as createArtifactRepository,
  deleteArtifact as deleteArtifactRepository,
} from "@/lib/repositories/artifact.repository";

import {
  createArtifactImage,
  deleteArtifactImage as deleteArtifactImageRepository,
} from "@/lib/repositories/artifactImage.repository";

import {
  createCertificate,
} from "@/lib/repositories/certificate.repository";

import {
  deleteArtifactImage as deleteStoredArtifactImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
  syncArtifactWithStripe,
} from "@/lib/services/stripeCatalog.service";

import {
  createUniqueSlug,
  getArtifactAvailability,
  getArtifactCategory,
  getArtifactCondition,
  getArtifactRarity,
  getArtifactStatus,
  getArtifactTags,
  getBoolean,
  getCoverImageIndex,
  getImageFiles,
  getOptionalNumber,
  getOptionalString,
  getRequiredString,
} from "./utils/artifactForm.utils";

export async function createArtifact(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const title = getRequiredString(
    formData,
    "title",
  );

  const playerId = getRequiredString(
    formData,
    "playerId",
  );

  const brandId = getRequiredString(
    formData,
    "brandId",
  );

  const authentic = getBoolean(
    formData,
    "authentic",
  );

  const images = getImageFiles(formData);

  const coverImageIndex =
    getCoverImageIndex(
      formData,
      images.length,
    );

  const artifact =
    await createArtifactRepository({
      archiveNumber:
        getOptionalString(
          formData,
          "archiveNumber",
        ) ?? `AGE202-${Date.now()}`,

      title,

      subtitle:
        getOptionalString(
          formData,
          "subtitle",
        ),

      slug: createUniqueSlug(
        getOptionalString(
          formData,
          "slug",
        ) ?? title,
      ),

      description:
        getOptionalString(
          formData,
          "description",
        ),

      museumStory:
        getOptionalString(
          formData,
          "museumStory",
        ),

      historicalContext:
        getOptionalString(
          formData,
          "historicalContext",
        ),

      curatorNote:
        getOptionalString(
          formData,
          "curatorNote",
        ),

      year:
        getOptionalNumber(
          formData,
          "year",
        ),

      season:
        getOptionalString(
          formData,
          "season",
        ),

      tournament:
        getOptionalString(
          formData,
          "tournament",
        ),

      collection:
        getOptionalString(
          formData,
          "collection",
        ),

      edition:
        getOptionalString(
          formData,
          "edition",
        ),

      category:
        getArtifactCategory(formData),

      rarity:
        getArtifactRarity(formData),

      size:
        getOptionalString(
          formData,
          "size",
        ),

      colour:
        getOptionalString(
          formData,
          "colour",
        ),

      material:
        getOptionalString(
          formData,
          "material",
        ),

      condition:
        getArtifactCondition(formData),

      availability:
        getArtifactAvailability(
          formData,
        ),

      price:
        getOptionalNumber(
          formData,
          "price",
        ),

      currency:
        getOptionalString(
          formData,
          "currency",
        ) ?? "EUR",

      vintedUrl:
        getOptionalString(
          formData,
          "vintedUrl",
        ),

      authentic,

      authenticityCode:
        getOptionalString(
          formData,
          "authenticityCode",
        ),

      vintage:
        getBoolean(
          formData,
          "vintage",
        ),

      tags:
        getArtifactTags(formData),

      status:
        getArtifactStatus(formData),

      featured:
        getBoolean(
          formData,
          "featured",
        ),

      playerId,
      brandId,
    });

  const uploadedUrls: string[] = [];
  const createdImageIds: string[] = [];

  try {
    for (const [index, file] of images.entries()) {
      const publicUrl =
        await uploadArtifactImage(
          artifact.id,
          file,
        );

      uploadedUrls.push(publicUrl);

      const artifactImage =
        await createArtifactImage({
          artifactId: artifact.id,
          url: publicUrl,
          alt: `${title} — image ${index + 1}`,
          sortOrder: index,
          isCover:
            index === coverImageIndex,
        });

      createdImageIds.push(
        artifactImage.id,
      );
    }

    if (authentic) {
      await createCertificate({
        artifactId: artifact.id,
        curator: "AGE202 Museum",
        verified: true,
        notes:
          getOptionalString(
            formData,
            "curatorNote",
          ) ?? undefined,
      });
    }
  } catch (error) {
    await Promise.allSettled(
      createdImageIds.map((id) =>
        deleteArtifactImageRepository(id),
      ),
    );

    await Promise.allSettled(
      uploadedUrls.map((url) =>
        deleteStoredArtifactImage(url),
      ),
    );

    /*
     * Certificate e ArtifactImage vengono rimossi dal database
     * automaticamente tramite onDelete: Cascade.
     */
    await deleteArtifactRepository(
      artifact.id,
    ).catch(() => undefined);

    throw error;
  }

  try {
    await syncArtifactWithStripe(
      artifact.id,
    );
  } catch (error) {
    console.error(
      `Sincronizzazione Stripe automatica fallita per Artifact ${artifact.id}:`,
      error,
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/artifacts");
  revalidatePath("/admin/certificates");

  revalidatePath("/archive");
  revalidatePath(`/archive/${artifact.slug}`);

  revalidatePath(`/products/${artifact.id}`);
  revalidatePath(`/products/${artifact.slug}`);

  redirect("/admin/artifacts");
}