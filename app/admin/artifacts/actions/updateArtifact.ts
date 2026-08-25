"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

import {
  deleteArtifactImage as deleteStoredArtifactImage,
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

import {
  syncArtifactWithStripe,
} from "@/lib/services/stripeCatalog.service";

import {
  MAX_ARTIFACT_IMAGES,
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
  getStringArray,
  slugify,
} from "./utils/artifactForm.utils";

const CHECKOUT_ENABLED =
  process.env.CHECKOUT_ENABLED === "true";

type BrowserUploadedImage = {
  id: string;
  url: string;
  path: string;
  alt: string;
  size: number | null;
  mimeType: string;
  originalName: string;
};

type OrderedMediaItem =
  | {
      type: "existing";
      id: string;
    }
  | {
      type: "browser";
      id: string;
    }
  | {
      type: "legacy";
      index: number;
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
          typeof value !== "object"
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
          typeof record.id === "string"
            ? record.id.trim()
            : "";

        const url =
          typeof record.url === "string"
            ? record.url.trim()
            : "";

        const path =
          typeof record.path === "string"
            ? record.path.trim()
            : "";

        const alt =
          typeof record.alt === "string"
            ? record.alt.trim()
            : "";

        const mimeType =
          typeof record.mimeType === "string"
            ? record.mimeType.trim()
            : "";

        const originalName =
          typeof record.originalName === "string"
            ? record.originalName.trim()
            : "";

        const size =
          typeof record.size === "number" &&
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

  const ids =
    new Set(
      images.map(
        (image) =>
          image.id,
      ),
    );

  if (
    ids.size !==
    images.length
  ) {
    throw new Error(
      "Sono presenti immagini duplicate nel caricamento.",
    );
  }

  return images;
}

function getSubmittedMediaOrder(
  formData: FormData,
  remainingImageIds: string[],
  browserUploadedImages: BrowserUploadedImage[],
  legacyNewImageCount: number,
): OrderedMediaItem[] {
  const rawOrder =
    getOptionalString(
      formData,
      "mediaOrder",
    );

  const remainingSet =
    new Set(
      remainingImageIds,
    );

  const browserIds =
    new Set(
      browserUploadedImages.map(
        (image) =>
          image.id,
      ),
    );

  const usedExisting =
    new Set<string>();

  const usedBrowser =
    new Set<string>();

  let nextLegacyIndex =
    0;

  const ordered:
    OrderedMediaItem[] = [];

  if (rawOrder) {
    for (
      const token of rawOrder.split(
        ",",
      )
    ) {
      const [
        type,
        value,
      ] = token.split(
        ":",
        2,
      );

      if (
        type === "existing" &&
        value &&
        remainingSet.has(
          value,
        ) &&
        !usedExisting.has(
          value,
        )
      ) {
        ordered.push({
          type:
            "existing",
          id:
            value,
        });

        usedExisting.add(
          value,
        );

        continue;
      }

      /*
       * Il nuovo MediaUploader usa "new:<uploadId>"
       * per le immagini già caricate dal browser su Supabase.
       */
      if (
        type === "new" &&
        value &&
        browserIds.has(
          value,
        ) &&
        !usedBrowser.has(
          value,
        )
      ) {
        ordered.push({
          type:
            "browser",
          id:
            value,
        });

        usedBrowser.add(
          value,
        );

        continue;
      }

      /*
       * Compatibilità con eventuali vecchi form che inviano
       * ancora File reali dentro FormData.
       */
      if (
        type === "new" &&
        nextLegacyIndex <
          legacyNewImageCount
      ) {
        ordered.push({
          type:
            "legacy",
          index:
            nextLegacyIndex,
        });

        nextLegacyIndex +=
          1;
      }
    }
  }

  for (
    const id of remainingImageIds
  ) {
    if (
      !usedExisting.has(
        id,
      )
    ) {
      ordered.push({
        type:
          "existing",
        id,
      });
    }
  }

  for (
    const image of browserUploadedImages
  ) {
    if (
      !usedBrowser.has(
        image.id,
      )
    ) {
      ordered.push({
        type:
          "browser",
        id:
          image.id,
      });
    }
  }

  while (
    nextLegacyIndex <
    legacyNewImageCount
  ) {
    ordered.push({
      type:
        "legacy",
      index:
        nextLegacyIndex,
    });

    nextLegacyIndex +=
      1;
  }

  return ordered;
}

async function createAvailableSlug(
  requestedValue: string,
  artifactId: string,
): Promise<string> {
  const baseSlug =
    slugify(
      requestedValue,
    );

  if (!baseSlug) {
    throw new Error(
      "Unable to generate a valid slug.",
    );
  }

  const existingArtifact =
    await prisma.artifact.findFirst(
      {
        where: {
          slug:
            baseSlug,
          id: {
            not:
              artifactId,
          },
        },
        select: {
          id:
            true,
        },
      },
    );

  return existingArtifact
    ? `${baseSlug}-${Date.now()}`
    : baseSlug;
}

export async function updateArtifact(
  formData: FormData,
): Promise<never> {
  await requireAdmin();

  const artifactId =
    getRequiredString(
      formData,
      "artifactId",
    );

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

  const currentArtifact =
    await prisma.artifact.findUnique(
      {
        where: {
          id:
            artifactId,
        },
        include: {
          images: {
            orderBy: {
              sortOrder:
                "asc",
            },
          },
        },
      },
    );

  if (!currentArtifact) {
    throw new Error(
      "The artifact could not be found.",
    );
  }

  /*
   * Relazione Tournament.
   *
   * Il form invia tournamentId dal dropdown.
   * Recuperiamo il record reale per verificare che esista,
   * mantenere sincronizzato il vecchio campo testuale `tournament`
   * e revalidare correttamente le pagine torneo coinvolte.
   */
  const requestedTournamentId =
    getOptionalString(
      formData,
      "tournamentId",
    );

  const selectedTournament =
    requestedTournamentId
      ? await prisma.tournament.findUnique({
          where: {
            id:
              requestedTournamentId,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        })
      : null;

  if (
    requestedTournamentId &&
    !selectedTournament
  ) {
    throw new Error(
      "Il torneo selezionato non esiste più nell'archivio AGE202.",
    );
  }

  const previousTournament =
    currentArtifact.tournamentId
      ? await prisma.tournament.findUnique({
          where: {
            id:
              currentArtifact.tournamentId,
          },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        })
      : currentArtifact.tournament
        ? await prisma.tournament.findFirst({
            where: {
              OR: [
                {
                  name: {
                    equals:
                      currentArtifact.tournament,
                    mode:
                      "insensitive",
                  },
                },
                {
                  shortName: {
                    equals:
                      currentArtifact.tournament,
                    mode:
                      "insensitive",
                  },
                },
              ],
            },
            select: {
              id: true,
              name: true,
              slug: true,
            },
          })
        : null;

  /*
   * Vecchio flusso File, mantenuto solo per compatibilità.
   * Con il nuovo MediaUploader normalmente sarà vuoto.
   */
  const legacyNewImages =
    getImageFiles(
      formData,
    );

  /*
   * Nuovo flusso:
   * le immagini sono già state caricate dal browser
   * su Supabase Storage e qui arrivano solo URL + riferimenti.
   */
  const browserUploadedImages =
    getBrowserUploadedImages(
      formData,
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
      "La copertina selezionata non appartiene alle immagini appena caricate.",
    );
  }

  const requestedRemovedImageIds =
    getStringArray(
      formData,
      "removedImageIds",
    );

  const currentImageIds =
    new Set(
      currentArtifact.images.map(
        (image) =>
          image.id,
      ),
    );

  const removedImageIds =
    Array.from(
      new Set(
        requestedRemovedImageIds,
      ),
    );

  const invalidRemovedImage =
    removedImageIds.find(
      (id) =>
        !currentImageIds.has(
          id,
        ),
    );

  if (
    invalidRemovedImage
  ) {
    throw new Error(
      "One or more selected images do not belong to this artifact.",
    );
  }

  const removedImageIdSet =
    new Set(
      removedImageIds,
    );

  const remainingImages =
    currentArtifact.images.filter(
      (image) =>
        !removedImageIdSet.has(
          image.id,
        ),
    );

  const finalImageCount =
    remainingImages.length +
    browserUploadedImages.length +
    legacyNewImages.length;

  if (
    finalImageCount >
    MAX_ARTIFACT_IMAGES
  ) {
    throw new Error(
      `An artifact can contain a maximum of ${MAX_ARTIFACT_IMAGES} images.`,
    );
  }

  const requestedExistingCoverImageId =
    getOptionalString(
      formData,
      "existingCoverImageId",
    );

  if (
    requestedExistingCoverImageId &&
    !remainingImages.some(
      (image) =>
        image.id ===
        requestedExistingCoverImageId,
    )
  ) {
    throw new Error(
      "The selected cover image is not available.",
    );
  }

  const submittedLegacyCoverIndex =
    legacyNewImages.length >
    0
      ? getCoverImageIndex(
          formData,
          legacyNewImages.length,
        )
      : -1;

  const slug =
    await createAvailableSlug(
      getOptionalString(
        formData,
        "slug",
      ) ??
        title,
      artifactId,
    );

  const uploadedLegacyImages:
    Array<{
      url: string;
      file: File;
    }> = [];

  try {
    for (
      const file of legacyNewImages
    ) {
      const url =
        await uploadArtifactImage(
          artifactId,
          file,
        );

      uploadedLegacyImages.push({
        url,
        file,
      });
    }
  } catch (error) {
    await Promise.allSettled(
      uploadedLegacyImages.map(
        ({
          url,
        }) =>
          deleteStoredArtifactImage(
            url,
          ),
      ),
    );

    throw error;
  }

  const removedImages =
    currentArtifact.images.filter(
      (image) =>
        removedImageIdSet.has(
          image.id,
        ),
    );

  const submittedOrder =
    getSubmittedMediaOrder(
      formData,
      remainingImages.map(
        (image) =>
          image.id,
      ),
      browserUploadedImages,
      uploadedLegacyImages.length,
    );

  try {
    await prisma.$transaction(
      async (
        transaction,
      ) => {
        await transaction.artifact.update(
          {
            where: {
              id:
                artifactId,
            },
            data: {
              archiveNumber:
                getOptionalString(
                  formData,
                  "archiveNumber",
                ) ??
                currentArtifact.archiveNumber,

              title,

              subtitle:
                getOptionalString(
                  formData,
                  "subtitle",
                ) ??
                null,

              slug,

              description:
                getOptionalString(
                  formData,
                  "description",
                ) ??
                null,

              museumStory:
                getOptionalString(
                  formData,
                  "museumStory",
                ) ??
                null,

              historicalContext:
                getOptionalString(
                  formData,
                  "historicalContext",
                ) ??
                null,

              curatorNote:
                getOptionalString(
                  formData,
                  "curatorNote",
                ) ??
                null,

              year:
                getOptionalNumber(
                  formData,
                  "year",
                ) ??
                null,

              season:
                getOptionalString(
                  formData,
                  "season",
                ) ??
                null,

              /*
               * Manteniamo temporaneamente il nome testuale
               * insieme alla relazione Prisma vera.
               */
              tournament:
                selectedTournament?.name ??
                null,

              tournamentRecord:
                selectedTournament
                  ? {
                      connect: {
                        id:
                          selectedTournament.id,
                      },
                    }
                  : {
                      disconnect:
                        true,
                    },

              collection:
                getOptionalString(
                  formData,
                  "collection",
                ) ??
                null,

              edition:
                getOptionalString(
                  formData,
                  "edition",
                ) ??
                null,

              category:
                getArtifactCategory(
                  formData,
                ) ??
                null,

              rarity:
                getArtifactRarity(
                  formData,
                ),

              size:
                getOptionalString(
                  formData,
                  "size",
                ) ??
                null,

              colour:
                getOptionalString(
                  formData,
                  "colour",
                ) ??
                null,

              material:
                getOptionalString(
                  formData,
                  "material",
                ) ??
                null,

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
                ) ??
                null,

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
                ) ??
                null,

              authentic:
                getBoolean(
                  formData,
                  "authentic",
                ),

              authenticityCode:
                getOptionalString(
                  formData,
                  "authenticityCode",
                ) ??
                null,

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

              player: {
                connect: {
                  id:
                    playerId,
                },
              },

              brand: {
                connect: {
                  id:
                    brandId,
                },
              },
            },
          },
        );

        if (
          removedImageIds.length >
          0
        ) {
          await transaction.artifactImage.deleteMany(
            {
              where: {
                artifactId,
                id: {
                  in:
                    removedImageIds,
                },
              },
            },
          );
        }

        await transaction.artifactImage.updateMany(
          {
            where: {
              artifactId,
            },
            data: {
              isCover:
                false,
            },
          },
        );

        /*
         * Registra nel DB le nuove immagini che il browser
         * ha già caricato su Supabase Storage.
         */
        const createdBrowserImages:
          Array<{
            id: string;
            uploadId: string;
          }> = [];

        for (
          const image of browserUploadedImages
        ) {
          const created =
            await transaction.artifactImage.create(
              {
                data: {
                  artifactId,

                  url:
                    image.url,

                  alt:
                    image.alt ||
                    image.originalName ||
                    title,

                  sortOrder:
                    remainingImages.length +
                    createdBrowserImages.length,

                  isCover:
                    false,
                },
              },
            );

          createdBrowserImages.push({
            id:
              created.id,
            uploadId:
              image.id,
          });
        }

        /*
         * Compatibilità legacy con eventuali File ancora
         * inviati direttamente alla Server Action.
         */
        const createdLegacyImages:
          Array<{
            id: string;
            index: number;
          }> = [];

        for (
          const [
            index,
            uploadedImage,
          ] of uploadedLegacyImages.entries()
        ) {
          const created =
            await transaction.artifactImage.create(
              {
                data: {
                  artifactId,

                  url:
                    uploadedImage.url,

                  alt:
                    `${title} — image ${index + 1}`,

                  sortOrder:
                    remainingImages.length +
                    browserUploadedImages.length +
                    index,

                  isCover:
                    false,
                },
              },
            );

          createdLegacyImages.push({
            id:
              created.id,
            index,
          });
        }

        /*
         * Applica l'ordine visuale prodotto da MediaUploader.
         */
        for (
          const [
            sortOrder,
            item,
          ] of submittedOrder.entries()
        ) {
          let imageId:
            | string
            | undefined;

          if (
            item.type ===
            "existing"
          ) {
            imageId =
              item.id;
          } else if (
            item.type ===
            "browser"
          ) {
            imageId =
              createdBrowserImages.find(
                (image) =>
                  image.uploadId ===
                  item.id,
              )?.id;
          } else {
            imageId =
              createdLegacyImages.find(
                (image) =>
                  image.index ===
                  item.index,
              )?.id;
          }

          if (!imageId) {
            continue;
          }

          await transaction.artifactImage.update(
            {
              where: {
                id:
                  imageId,
              },
              data: {
                sortOrder,

                alt:
                  `${title} — image ${sortOrder + 1}`,
              },
            },
          );
        }

        let coverImageId:
          | string
          | undefined;

        if (
          requestedExistingCoverImageId
        ) {
          coverImageId =
            requestedExistingCoverImageId;
        } else if (
          browserUploadedCoverId
        ) {
          coverImageId =
            createdBrowserImages.find(
              (image) =>
                image.uploadId ===
                browserUploadedCoverId,
            )?.id;
        } else if (
          submittedLegacyCoverIndex >=
          0
        ) {
          coverImageId =
            createdLegacyImages.find(
              (image) =>
                image.index ===
                submittedLegacyCoverIndex,
            )?.id;
        } else {
          coverImageId =
            remainingImages.find(
              (image) =>
                image.isCover,
            )?.id;
        }

        /*
         * Fallback: se nessuna cover è stata esplicitamente scelta,
         * usa la prima immagine nell'ordine corrente.
         */
        if (
          !coverImageId &&
          submittedOrder.length >
          0
        ) {
          const first =
            submittedOrder[0];

          if (
            first.type ===
            "existing"
          ) {
            coverImageId =
              first.id;
          } else if (
            first.type ===
            "browser"
          ) {
            coverImageId =
              createdBrowserImages.find(
                (image) =>
                  image.uploadId ===
                  first.id,
              )?.id;
          } else {
            coverImageId =
              createdLegacyImages.find(
                (image) =>
                  image.index ===
                  first.index,
              )?.id;
          }
        }

        if (coverImageId) {
          await transaction.artifactImage.update(
            {
              where: {
                id:
                  coverImageId,
              },
              data: {
                isCover:
                  true,
              },
            },
          );
        }
      },
    );
  } catch (error) {
    await Promise.allSettled(
      uploadedLegacyImages.map(
        ({
          url,
        }) =>
          deleteStoredArtifactImage(
            url,
          ),
      ),
    );

    /*
     * Se il DB non riesce a salvare le immagini browser,
     * eliminiamo i file temporanei già caricati su Supabase.
     */
    await Promise.allSettled(
      browserUploadedImages.map(
        (image) =>
          deleteStoredArtifactImage(
            image.url,
          ),
      ),
    );

    throw error;
  }

  /*
   * Elimina dallo Storage le immagini rimosse dall'Artifact.
   */
  await Promise.allSettled(
    removedImages.map(
      (image) =>
        deleteStoredArtifactImage(
          image.url,
        ),
    ),
  );

  /*
   * Stripe rimane sospeso finché CHECKOUT_ENABLED non sarà true.
   */
  if (CHECKOUT_ENABLED) {
    try {
      await syncArtifactWithStripe(
        artifactId,
      );
    } catch (error) {
      console.error(
        `Sincronizzazione Stripe automatica fallita per Artifact ${artifactId}:`,
        error,
      );
    }
  } else {
    console.info(
      `Stripe sync saltata per Artifact ${artifactId}: checkout temporaneamente disabilitato.`,
    );
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/artifacts",
  );

  revalidatePath(
    `/admin/artifacts/${artifactId}`,
  );

  revalidatePath(
    "/artifacts",
  );

  revalidatePath(
    `/artifacts/${currentArtifact.slug}`,
  );

  revalidatePath(
    `/artifacts/${slug}`,
  );

  revalidatePath(
    "/archive",
  );

  revalidatePath(
    `/archive/${currentArtifact.slug}`,
  );

  revalidatePath(
    `/archive/${slug}`,
  );

  /*
   * Se il torneo è cambiato, aggiorniamo sia la vecchia
   * sia la nuova pagina pubblica. In questo modo un Artifact
   * sparisce subito dal vecchio Tournament e compare nel nuovo.
   */
  if (previousTournament) {
    revalidatePath(
      `/tournaments/${previousTournament.slug}`,
    );
  }

  if (
    selectedTournament &&
    selectedTournament.slug !==
      previousTournament?.slug
  ) {
    revalidatePath(
      `/tournaments/${selectedTournament.slug}`,
    );
  }

  redirect(
    "/admin/artifacts",
  );
}