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

const CHECKOUT_ENABLED =
  process.env.CHECKOUT_ENABLED ===
  "true";

type BrowserUploadedImage = {
  id: string;
  url: string;
  path: string;
  alt: string;
  size: number | null;
  mimeType: string;
  originalName: string;
};

function getBrowserUploadedImages(
  formData: FormData,
): BrowserUploadedImage[] {
  const raw =
    getOptionalString(
      formData,
      "browserUploadedImages",
    );

  if (!raw) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed =
      JSON.parse(raw);
  } catch {
    throw new Error(
      "I riferimenti delle immagini caricate non sono validi.",
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Il formato delle immagini caricate non è valido.",
    );
  }

  const images =
    parsed.map(
      (
        value,
        index,
      ): BrowserUploadedImage => {
        if (
          !value ||
          typeof value !==
            "object"
        ) {
          throw new Error(
            `Immagine caricata ${index + 1} non valida.`,
          );
        }

        const record =
          value as Record<
            string,
            unknown
          >;

        const id =
          typeof record.id ===
          "string"
            ? record.id.trim()
            : "";

        const url =
          typeof record.url ===
          "string"
            ? record.url.trim()
            : "";

        const path =
          typeof record.path ===
          "string"
            ? record.path.trim()
            : "";

        const alt =
          typeof record.alt ===
          "string"
            ? record.alt.trim()
            : "";

        const mimeType =
          typeof record.mimeType ===
          "string"
            ? record.mimeType.trim()
            : "";

        const originalName =
          typeof record.originalName ===
          "string"
            ? record.originalName.trim()
            : "";

        const size =
          typeof record.size ===
            "number" &&
          Number.isFinite(
            record.size,
          )
            ? record.size
            : null;

        if (
          !id ||
          !url ||
          !path
        ) {
          throw new Error(
            `Immagine caricata ${index + 1} incompleta.`,
          );
        }

        if (
          !path.startsWith(
            "pending/",
          )
        ) {
          throw new Error(
            `Percorso immagine ${index + 1} non valido.`,
          );
        }

        return {
          id,
          url,
          path,
          alt,
          size,
          mimeType,
          originalName,
        };
      },
    );

  const uniqueIds =
    new Set(
      images.map(
        (image) =>
          image.id,
      ),
    );

  if (
    uniqueIds.size !==
    images.length
  ) {
    throw new Error(
      "Sono presenti immagini duplicate nel caricamento.",
    );
  }

  return images;
}

function getBrowserUploadedImageOrder(
  formData: FormData,
  images: BrowserUploadedImage[],
): BrowserUploadedImage[] {
  const rawOrder =
    getOptionalString(
      formData,
      "mediaOrder",
    );

  if (!rawOrder) {
    return images;
  }

  const byId =
    new Map(
      images.map(
        (image) => [
          image.id,
          image,
        ],
      ),
    );

  const ordered:
    BrowserUploadedImage[] = [];

  const used =
    new Set<string>();

  for (
    const token of rawOrder.split(
      ",",
    )
  ) {
    const [
      type,
      id,
    ] = token.split(
      ":",
      2,
    );

    if (
      type !== "new" ||
      !id ||
      used.has(id)
    ) {
      continue;
    }

    const image =
      byId.get(id);

    if (!image) {
      continue;
    }

    ordered.push(
      image,
    );

    used.add(
      id,
    );
  }

  for (
    const image of images
  ) {
    if (
      !used.has(
        image.id,
      )
    ) {
      ordered.push(
        image,
      );
    }
  }

  return ordered;
}

export async function createArtifact(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const title =
    getRequiredString(
      formData,
      "title",
    );

  const playerId =
    getRequiredString(
      formData,
      "playerId",
    );

  const brandId =
    getRequiredString(
      formData,
      "brandId",
    );

  const authentic =
    getBoolean(
      formData,
      "authentic",
    );

  /*
   * Nuovo flusso:
   * le immagini selezionate dal PC vengono caricate
   * direttamente su Supabase dal browser.
   *
   * Manteniamo getImageFiles() solo come compatibilità
   * con eventuali form legacy che inviano ancora File.
   */
  const legacyImages =
    getImageFiles(
      formData,
    );

  const browserUploadedImages =
    getBrowserUploadedImages(
      formData,
    );

  const orderedBrowserImages =
    getBrowserUploadedImageOrder(
      formData,
      browserUploadedImages,
    );

  const browserUploadedCoverId =
    getOptionalString(
      formData,
      "browserUploadedCoverId",
    );

  if (
    browserUploadedCoverId &&
    !browserUploadedImages.some(
      (image) =>
        image.id ===
        browserUploadedCoverId,
    )
  ) {
    throw new Error(
      "La copertina selezionata non appartiene alle immagini caricate.",
    );
  }

  const legacyCoverImageIndex =
    legacyImages.length > 0
      ? getCoverImageIndex(
          formData,
          legacyImages.length,
        )
      : -1;

  const artifact =
    await createArtifactRepository({
      archiveNumber:
        getOptionalString(
          formData,
          "archiveNumber",
        ) ??
        `AGE202-${Date.now()}`,

      title,

      subtitle:
        getOptionalString(
          formData,
          "subtitle",
        ),

      slug:
        createUniqueSlug(
          getOptionalString(
            formData,
            "slug",
          ) ??
            title,
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
        getArtifactCategory(
          formData,
        ),

      rarity:
        getArtifactRarity(
          formData,
        ),

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
        getArtifactCondition(
          formData,
        ),

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
        ) ??
        "EUR",

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
        getArtifactTags(
          formData,
        ),

      status:
        getArtifactStatus(
          formData,
        ),

      featured:
        getBoolean(
          formData,
          "featured",
        ),

      playerId,
      brandId,
    });

  const uploadedUrls:
    string[] = [];

  const createdImageIds:
    string[] = [];

  try {
    /*
     * 1. Registra nel database le immagini già caricate
     *    direttamente dal browser su Supabase.
     */
    for (
      const [
        index,
        image,
      ] of orderedBrowserImages.entries()
    ) {
      const artifactImage =
        await createArtifactImage({
          artifactId:
            artifact.id,

          url:
            image.url,

          alt:
            image.alt ||
            image.originalName ||
            `${title} — image ${index + 1}`,

          sortOrder:
            index,

          isCover:
            browserUploadedCoverId
              ? image.id ===
                browserUploadedCoverId
              : index === 0,
        });

      createdImageIds.push(
        artifactImage.id,
      );
    }

    /*
     * 2. Compatibilità legacy:
     *    se qualche vecchio form invia ancora File reali,
     *    continuiamo a supportarlo.
     */
    for (
      const [
        index,
        file,
      ] of legacyImages.entries()
    ) {
      const publicUrl =
        await uploadArtifactImage(
          artifact.id,
          file,
        );

      uploadedUrls.push(
        publicUrl,
      );

      const sortOrder =
        orderedBrowserImages.length +
        index;

      const artifactImage =
        await createArtifactImage({
          artifactId:
            artifact.id,

          url:
            publicUrl,

          alt:
            `${title} — image ${sortOrder + 1}`,

          sortOrder,

          isCover:
            orderedBrowserImages.length ===
              0 &&
            index ===
              legacyCoverImageIndex,
        });

      createdImageIds.push(
        artifactImage.id,
      );
    }

    if (authentic) {
      await createCertificate({
        artifactId:
          artifact.id,

        curator:
          "AGE202 Museum",

        verified:
          true,

        notes:
          getOptionalString(
            formData,
            "curatorNote",
          ) ??
          undefined,
      });
    }
  } catch (error) {
    await Promise.allSettled(
      createdImageIds.map(
        (id) =>
          deleteArtifactImageRepository(
            id,
          ),
      ),
    );

    /*
     * Elimina gli upload legacy effettuati dal server.
     */
    await Promise.allSettled(
      uploadedUrls.map(
        (url) =>
          deleteStoredArtifactImage(
            url,
          ),
      ),
    );

    /*
     * Elimina anche gli upload browser temporanei
     * se la creazione dell'Artifact non viene completata.
     */
    await Promise.allSettled(
      browserUploadedImages.map(
        (image) =>
          deleteStoredArtifactImage(
            image.url,
          ),
      ),
    );

    /*
     * Certificate e ArtifactImage vengono rimossi dal database
     * automaticamente tramite onDelete: Cascade.
     */
    await deleteArtifactRepository(
      artifact.id,
    ).catch(
      () =>
        undefined,
    );

    throw error;
  }

  if (CHECKOUT_ENABLED) {
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
  } else {
    console.info(
      `Stripe sync saltata per Artifact ${artifact.id}: checkout temporaneamente disabilitato.`,
    );
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/artifacts",
  );

  revalidatePath(
    `/admin/artifacts/${artifact.id}`,
  );

  revalidatePath(
    "/admin/certificates",
  );

  revalidatePath(
    "/artifacts",
  );

  revalidatePath(
    `/artifacts/${artifact.slug}`,
  );

  revalidatePath(
    "/archive",
  );

  revalidatePath(
    `/archive/${artifact.slug}`,
  );

  redirect(
    "/admin/artifacts",
  );
}