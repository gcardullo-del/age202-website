"use client";

import {
  ChevronLeft,
  ChevronRight,
  Images,
  ImageIcon,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  MediaAssetWithFolder,
} from "@/lib/repositories/media.repository";

import DropZone from "./DropZone";
import ImageCard, {
  type ImageCardData,
} from "./ImageCard";
import MediaLibraryPicker, {
  type SelectedLibraryImage,
} from "./MediaLibraryPicker";

const MAX_IMAGES = 10;

export type ExistingMediaImage = {
  id: string;
  url: string;
  alt?: string | null;
  isCover: boolean;
  sortOrder: number;
};

type ExistingImage =
  ImageCardData & {
    type: "existing";
    existingId: string;
  };

type NewImage =
  ImageCardData & {
    type: "new";
    file: File;
  };

type LibraryImage =
  ImageCardData & {
    type: "library";
    mediaAssetId: string;
  };

type MediaImage =
  | ExistingImage
  | NewImage
  | LibraryImage;

type MediaUploaderProps = {
  existingImages?: ExistingMediaImage[];
  libraryAssets?: MediaAssetWithFolder[];
};

function createFileKey(
  file: File,
): string {
  return [
    file.name,
    file.size,
    file.lastModified,
    file.type,
  ].join("-");
}

function createExistingImages(
  existingImages: ExistingMediaImage[],
): ExistingImage[] {
  const normalized = [
    ...existingImages,
  ]
    .sort(
      (first, second) =>
        first.sortOrder -
        second.sortOrder,
    )
    .map(
      (image, index) => ({
        id: image.id,
        existingId: image.id,
        type:
          "existing" as const,
        src: image.url,
        name:
          image.alt?.trim() ||
          `Artifact image ${
            index + 1
          }`,
        isCover: image.isCover,
        isExisting: true,
      }),
    );

  if (
    normalized.length > 0 &&
    !normalized.some(
      (image) =>
        image.isCover,
    )
  ) {
    normalized[0] = {
      ...normalized[0],
      isCover: true,
    };
  }

  return normalized;
}

function revokeNewPreview(
  image: MediaImage,
): void {
  if (image.type === "new") {
    URL.revokeObjectURL(
      image.src,
    );
  }
}

function createLibraryImage(
  image: SelectedLibraryImage,
  isCover: boolean,
): LibraryImage {
  return {
    id: `library-${image.id}`,
    type: "library",
    mediaAssetId: image.id,
    src: image.url,
    name:
      image.alt?.trim() ||
      image.title,
    isCover,
    isExisting: true,
  };
}

export default function MediaUploader({
  existingImages = [],
  libraryAssets = [],
}: MediaUploaderProps) {
  const initialRef = useRef(
    createExistingImages(
      existingImages,
    ),
  );

  const [images, setImages] =
    useState<MediaImage[]>(
      () => initialRef.current,
    );

  const [
    removedExistingImageIds,
    setRemovedExistingImageIds,
  ] = useState<string[]>([]);

  const [
    previewId,
    setPreviewId,
  ] = useState<
    string | null
  >(null);

  const [
    draggedId,
    setDraggedId,
  ] = useState<
    string | null
  >(null);

  const [
    libraryOpen,
    setLibraryOpen,
  ] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const imagesRef =
    useRef(images);

  const syncFileInput =
    useCallback(
      (
        nextImages: MediaImage[],
      ) => {
        const input =
          fileInputRef.current;

        if (!input) {
          return;
        }

        const transfer =
          new DataTransfer();

        nextImages.forEach(
          (image) => {
            if (
              image.type ===
              "new"
            ) {
              transfer.items.add(
                image.file,
              );
            }
          },
        );

        input.files =
          transfer.files;
      },
      [],
    );

  const updateImages =
    useCallback(
      (
        updater: (
          current: MediaImage[],
        ) => MediaImage[],
      ) => {
        setImages(
          (current) => {
            const next =
              updater(current);

            imagesRef.current =
              next;

            syncFileInput(next);

            return next;
          },
        );
      },
      [syncFileInput],
    );

  const addFiles =
    useCallback(
      (files: File[]) => {
        updateImages(
          (current) => {
            const keys =
              new Set(
                current
                  .filter(
                    (
                      image,
                    ): image is NewImage =>
                      image.type ===
                      "new",
                  )
                  .map((image) =>
                    createFileKey(
                      image.file,
                    ),
                  ),
              );

            const slots =
              MAX_IMAGES -
              current.length;

            const accepted =
              files
                .filter(
                  (file) =>
                    !keys.has(
                      createFileKey(
                        file,
                      ),
                    ),
                )
                .slice(
                  0,
                  slots,
                );

            if (
              accepted.length ===
              0
            ) {
              if (slots <= 0) {
                window.alert(
                  `Puoi caricare al massimo ${MAX_IMAGES} immagini.`,
                );
              }

              return current;
            }

            const alreadyHasCover =
              current.some(
                (image) =>
                  image.isCover,
              );

            const additions:
              NewImage[] =
              accepted.map(
                (
                  file,
                  index,
                ) => ({
                  id:
                    crypto.randomUUID(),
                  type: "new",
                  file,
                  src:
                    URL.createObjectURL(
                      file,
                    ),
                  name: file.name,
                  size: file.size,
                  isCover:
                    !alreadyHasCover &&
                    index === 0,
                  isExisting: false,
                }),
              );

            if (
              files.length >
              accepted.length
            ) {
              window.alert(
                `Alcune immagini non sono state aggiunte. Il limite totale è ${MAX_IMAGES}.`,
              );
            }

            return [
              ...current,
              ...additions,
            ];
          },
        );
      },
      [updateImages],
    );

  const addLibraryImages =
    useCallback(
      (
        selected:
          SelectedLibraryImage[],
      ) => {
        updateImages(
          (current) => {
            const existingAssetIds =
              new Set(
                current
                  .filter(
                    (
                      image,
                    ): image is LibraryImage =>
                      image.type ===
                      "library",
                  )
                  .map(
                    (image) =>
                      image.mediaAssetId,
                  ),
              );

            const slots =
              MAX_IMAGES -
              current.length;

            const accepted =
              selected
                .filter(
                  (image) =>
                    !existingAssetIds.has(
                      image.id,
                    ),
                )
                .slice(
                  0,
                  slots,
                );

            if (
              accepted.length ===
              0
            ) {
              if (slots <= 0) {
                window.alert(
                  `Puoi selezionare al massimo ${MAX_IMAGES} immagini.`,
                );
              }

              return current;
            }

            const alreadyHasCover =
              current.some(
                (image) =>
                  image.isCover,
              );

            const additions =
              accepted.map(
                (
                  image,
                  index,
                ) =>
                  createLibraryImage(
                    image,
                    !alreadyHasCover &&
                      index === 0,
                  ),
              );

            return [
              ...current,
              ...additions,
            ];
          },
        );
      },
      [updateImages],
    );

  const removeImage =
    useCallback(
      (id: string) => {
        updateImages(
          (current) => {
            const target =
              current.find(
                (image) =>
                  image.id === id,
              );

            if (!target) {
              return current;
            }

            if (
              target.type ===
              "existing"
            ) {
              setRemovedExistingImageIds(
                (ids) =>
                  ids.includes(
                    target.existingId,
                  )
                    ? ids
                    : [
                        ...ids,
                        target.existingId,
                      ],
              );
            } else if (
              target.type ===
              "new"
            ) {
              revokeNewPreview(
                target,
              );
            }

            const remaining =
              current.filter(
                (image) =>
                  image.id !== id,
              );

            if (
              previewId === id
            ) {
              setPreviewId(
                null,
              );
            }

            if (
              remaining.length >
                0 &&
              !remaining.some(
                (image) =>
                  image.isCover,
              )
            ) {
              return remaining.map(
                (
                  image,
                  index,
                ) => ({
                  ...image,
                  isCover:
                    index === 0,
                }),
              );
            }

            return remaining;
          },
        );
      },
      [
        previewId,
        updateImages,
      ],
    );

  const selectCover =
    useCallback(
      (id: string) => {
        updateImages(
          (current) =>
            current.map(
              (image) => ({
                ...image,
                isCover:
                  image.id === id,
              }),
            ),
        );
      },
      [updateImages],
    );

  const moveDraggedImage =
    useCallback(
      (targetId: string) => {
        if (
          !draggedId ||
          draggedId ===
            targetId
        ) {
          return;
        }

        updateImages(
          (current) => {
            const from =
              current.findIndex(
                (image) =>
                  image.id ===
                  draggedId,
              );

            const to =
              current.findIndex(
                (image) =>
                  image.id ===
                  targetId,
              );

            if (
              from < 0 ||
              to < 0
            ) {
              return current;
            }

            const next = [
              ...current,
            ];

            const [moved] =
              next.splice(
                from,
                1,
              );

            next.splice(
              to,
              0,
              moved,
            );

            return next;
          },
        );
      },
      [
        draggedId,
        updateImages,
      ],
    );

  useEffect(() => {
    const form =
      fileInputRef.current?.closest(
        "form",
      );

    if (!form) {
      return;
    }

    const handleReset =
      () => {
        imagesRef.current.forEach(
          revokeNewPreview,
        );

        const reset =
          initialRef.current.map(
            (image) => ({
              ...image,
            }),
          );

        imagesRef.current =
          reset;

        setImages(reset);
        setRemovedExistingImageIds(
          [],
        );
        setPreviewId(null);
        setLibraryOpen(false);

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            "";
        }
      };

    form.addEventListener(
      "reset",
      handleReset,
    );

    return () =>
      form.removeEventListener(
        "reset",
        handleReset,
      );
  }, []);

  useEffect(
    () => () =>
      imagesRef.current.forEach(
        revokeNewPreview,
      ),
    [],
  );

  const selectedCover =
    images.find(
      (image) =>
        image.isCover,
    );

  const newImages =
    images.filter(
      (
        image,
      ): image is NewImage =>
        image.type ===
        "new",
    );

  const libraryImages =
    images.filter(
      (
        image,
      ): image is LibraryImage =>
        image.type ===
        "library",
    );

  const newCoverIndex =
    selectedCover?.type ===
    "new"
      ? newImages.findIndex(
          (image) =>
            image.id ===
            selectedCover.id,
        )
      : -1;

  const existingCoverImageId =
    selectedCover?.type ===
    "existing"
      ? selectedCover.existingId
      : "";

  const libraryCoverMediaAssetId =
    selectedCover?.type ===
    "library"
      ? selectedCover.mediaAssetId
      : "";

  const mediaOrder =
    images
      .map((image) => {
        if (
          image.type ===
          "existing"
        ) {
          return `existing:${image.existingId}`;
        }

        if (
          image.type ===
          "library"
        ) {
          return `library:${image.mediaAssetId}`;
        }

        return `new:${image.id}`;
      })
      .join(",");

  const previewIndex =
    previewId
      ? images.findIndex(
          (image) =>
            image.id ===
            previewId,
        )
      : -1;

  const previewImage =
    previewIndex >= 0
      ? images[previewIndex]
      : null;

  const remainingSlots =
    MAX_IMAGES -
    images.length;

  const selectedLibraryIds =
    libraryImages.map(
      (image) =>
        image.mediaAssetId,
    );

  const summary = useMemo(
    () =>
      images.length === 1
        ? "1 immagine selezionata"
        : `${images.length} immagini selezionate`,
    [images.length],
  );

  const navigatePreview =
    useCallback(
      (
        direction: number,
      ) => {
        if (
          images.length < 2 ||
          previewIndex < 0
        ) {
          return;
        }

        const nextIndex =
          (previewIndex +
            direction +
            images.length) %
          images.length;

        setPreviewId(
          images[nextIndex].id,
        );
      },
      [
        images,
        previewIndex,
      ],
    );

  useEffect(() => {
    if (!previewId) {
      return;
    }

    const onKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setPreviewId(null);
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        navigatePreview(-1);
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        navigatePreview(1);
      }
    };

    window.addEventListener(
      "keydown",
      onKeyDown,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKeyDown,
      );
  }, [
    navigatePreview,
    previewId,
  ]);

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        name="images"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="sr-only"
      />

      <input
        type="hidden"
        name="existingCoverImageId"
        value={
          existingCoverImageId
        }
      />

      <input
        type="hidden"
        name="coverImageIndex"
        value={
          newCoverIndex >= 0
            ? String(
                newCoverIndex,
              )
            : ""
        }
      />

      <input
        type="hidden"
        name="libraryCoverMediaAssetId"
        value={
          libraryCoverMediaAssetId
        }
      />

      <input
        type="hidden"
        name="mediaOrder"
        value={mediaOrder}
      />

      {libraryImages.map(
        (image) => (
          <input
            key={
              image.mediaAssetId
            }
            type="hidden"
            name="selectedMediaAssetIds"
            value={
              image.mediaAssetId
            }
          />
        ),
      )}

      {removedExistingImageIds.map(
        (imageId) => (
          <input
            key={imageId}
            type="hidden"
            name="removedImageIds"
            value={imageId}
          />
        ),
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <DropZone
          onFilesAccepted={
            addFiles
          }
          disabled={
            remainingSlots <= 0
          }
          remainingSlots={
            remainingSlots
          }
        />

        <button
          type="button"
          onClick={() =>
            setLibraryOpen(true)
          }
          disabled={
            remainingSlots <=
              0 ||
            libraryAssets.length ===
              0
          }
          className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-lime-300/25 bg-lime-300/[0.035] px-6 text-center transition hover:border-lime-300/45 hover:bg-lime-300/[0.06] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:opacity-45"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-lime-300/10 text-lime-200">
            <Images className="h-6 w-6" />
          </span>

          <span className="mt-4 text-sm font-semibold text-white">
            Choose from Media Library
          </span>

          <span className="mt-2 text-xs leading-5 text-white/35">
            {libraryAssets.length >
            0
              ? `${libraryAssets.length} reusable assets available`
              : "No reusable assets available yet"}
          </span>
        </button>
      </div>

      {images.length > 0 ? (
        <section className="rounded-3xl border border-white/10 bg-[#07101D] p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white">
                <ImageIcon
                  size={18}
                  className="text-lime-300"
                />

                <h3 className="font-semibold">
                  Galleria del reperto
                </h3>
              </div>

              <p className="mt-1 text-sm text-white/45">
                {summary} su{" "}
                {MAX_IMAGES}.
                Trascina le card per
                riordinarle.
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.16em] text-white/35">
              La prima posizione non
              cambia automaticamente
              la copertina
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map(
              (
                image,
                index,
              ) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onSelectCover={
                    selectCover
                  }
                  onRemove={
                    removeImage
                  }
                  onPreview={
                    setPreviewId
                  }
                  onDragStart={
                    setDraggedId
                  }
                  onDragEnter={
                    moveDraggedImage
                  }
                  onDragEnd={() =>
                    setDraggedId(
                      null,
                    )
                  }
                  isDragging={
                    draggedId ===
                    image.id
                  }
                />
              ),
            )}
          </div>
        </section>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#07101D] px-6 py-10 text-center">
          <ImageIcon
            className="mx-auto text-white/20"
            size={30}
          />

          <p className="mt-3 text-sm text-white/45">
            Nessuna immagine
            selezionata.
          </p>
        </div>
      )}

      {previewImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Anteprima immagine"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setPreviewId(
                null,
              );
            }
          }}
        >
          <button
            type="button"
            onClick={() =>
              setPreviewId(null)
            }
            className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Chiudi anteprima"
          >
            <X size={22} />
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() =>
                navigatePreview(
                  -1,
                )
              }
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              aria-label="Immagine precedente"
            >
              <ChevronLeft
                size={28}
              />
            </button>
          ) : null}

          <div className="max-h-[88vh] max-w-[88vw] text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                previewImage.src
              }
              alt={
                previewImage.name
              }
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <p className="mt-4 text-sm text-white/70">
              {
                previewImage.name
              }{" "}
              · {previewIndex + 1}{" "}
              / {images.length}
            </p>
          </div>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={() =>
                navigatePreview(
                  1,
                )
              }
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              aria-label="Immagine successiva"
            >
              <ChevronRight
                size={28}
              />
            </button>
          ) : null}
        </div>
      ) : null}

      <MediaLibraryPicker
        open={libraryOpen}
        assets={libraryAssets}
        initialSelectedIds={
          selectedLibraryIds
        }
        maxSelection={
          remainingSlots +
          selectedLibraryIds.length
        }
        onClose={() =>
          setLibraryOpen(false)
        }
        onConfirm={
          addLibraryImages
        }
      />
    </div>
  );
}