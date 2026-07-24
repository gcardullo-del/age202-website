"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImageIcon } from "lucide-react";

import DropZone from "./DropZone";
import ImageCard, {
  type ImageCardData,
} from "./ImageCard";

const MAX_IMAGES = 10;

export type ExistingMediaImage = {
  id: string;
  url: string;
  alt?: string | null;
  isCover: boolean;
  sortOrder: number;
};

type ExistingImage = ImageCardData & {
  type: "existing";
  existingId: string;
};

type NewImage = ImageCardData & {
  type: "new";
  file: File;
};

type MediaImage =
  | ExistingImage
  | NewImage;

type MediaUploaderProps = {
  existingImages?: ExistingMediaImage[];
};

function createFileKey(file: File): string {
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
  const sortedImages = [...existingImages].sort(
    (firstImage, secondImage) =>
      firstImage.sortOrder -
      secondImage.sortOrder,
  );

  const normalizedImages =
    sortedImages.map((image, index) => ({
      id: image.id,
      existingId: image.id,
      type: "existing" as const,
      src: image.url,
      name:
        image.alt?.trim() ||
        `Artifact image ${index + 1}`,
      isCover: image.isCover,
      isExisting: true,
    }));

  if (
    normalizedImages.length > 0 &&
    !normalizedImages.some(
      (image) => image.isCover,
    )
  ) {
    normalizedImages[0] = {
      ...normalizedImages[0],
      isCover: true,
    };
  }

  return normalizedImages;
}

function revokeNewImagePreview(
  image: MediaImage,
): void {
  if (image.type === "new") {
    URL.revokeObjectURL(image.src);
  }
}

export default function MediaUploader({
  existingImages = [],
}: MediaUploaderProps) {
  const initialExistingImagesRef =
    useRef<ExistingImage[]>(
      createExistingImages(existingImages),
    );

  const [images, setImages] = useState<
    MediaImage[]
  >(() => initialExistingImagesRef.current);

  const [
    removedExistingImageIds,
    setRemovedExistingImageIds,
  ] = useState<string[]>([]);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const imagesRef = useRef<MediaImage[]>(
    initialExistingImagesRef.current,
  );

  const syncFileInput = useCallback(
    (nextImages: MediaImage[]) => {
      const input = fileInputRef.current;

      if (!input) {
        return;
      }

      const dataTransfer =
        new DataTransfer();

      nextImages.forEach((image) => {
        if (image.type === "new") {
          dataTransfer.items.add(
            image.file,
          );
        }
      });

      input.files = dataTransfer.files;
    },
    [],
  );

  const updateImages = useCallback(
    (
      updater: (
        currentImages: MediaImage[],
      ) => MediaImage[],
    ) => {
      setImages((currentImages) => {
        const nextImages =
          updater(currentImages);

        imagesRef.current = nextImages;
        syncFileInput(nextImages);

        return nextImages;
      });
    },
    [syncFileInput],
  );

  const addFiles = useCallback(
    (files: File[]) => {
      updateImages((currentImages) => {
        const currentNewFileKeys =
          new Set(
            currentImages
              .filter(
                (
                  image,
                ): image is NewImage =>
                  image.type === "new",
              )
              .map((image) =>
                createFileKey(image.file),
              ),
          );

        const availableSlots =
          MAX_IMAGES -
          currentImages.length;

        const acceptedFiles = files
          .filter(
            (file) =>
              !currentNewFileKeys.has(
                createFileKey(file),
              ),
          )
          .slice(0, availableSlots);

        if (
          acceptedFiles.length === 0
        ) {
          if (availableSlots <= 0) {
            window.alert(
              `You can upload a maximum of ${MAX_IMAGES} images.`,
            );
          }

          return currentImages;
        }

        const hasCurrentCover =
          currentImages.some(
            (image) => image.isCover,
          );

        const newImages: NewImage[] =
          acceptedFiles.map(
            (file, index) => ({
              id: crypto.randomUUID(),
              type: "new",
              file,
              src: URL.createObjectURL(
                file,
              ),
              name: file.name,
              size: file.size,
              isCover:
                !hasCurrentCover &&
                index === 0,
              isExisting: false,
            }),
          );

        if (
          files.length >
          acceptedFiles.length
        ) {
          window.alert(
            `Some images were not added. You can upload up to ${MAX_IMAGES} unique images in total.`,
          );
        }

        return [
          ...currentImages,
          ...newImages,
        ];
      });
    },
    [updateImages],
  );

  const removeImage = useCallback(
    (id: string) => {
      updateImages((currentImages) => {
        const imageToRemove =
          currentImages.find(
            (image) => image.id === id,
          );

        if (!imageToRemove) {
          return currentImages;
        }

        if (
          imageToRemove.type ===
          "existing"
        ) {
          setRemovedExistingImageIds(
            (currentIds) =>
              currentIds.includes(
                imageToRemove.existingId,
              )
                ? currentIds
                : [
                    ...currentIds,
                    imageToRemove.existingId,
                  ],
          );
        } else {
          revokeNewImagePreview(
            imageToRemove,
          );
        }

        const remainingImages =
          currentImages.filter(
            (image) => image.id !== id,
          );

        if (
          remainingImages.length > 0 &&
          !remainingImages.some(
            (image) => image.isCover,
          )
        ) {
          return remainingImages.map(
            (image, index) => ({
              ...image,
              isCover: index === 0,
            }),
          );
        }

        return remainingImages;
      });
    },
    [updateImages],
  );

  const selectCover = useCallback(
    (id: string) => {
      updateImages((currentImages) =>
        currentImages.map((image) => ({
          ...image,
          isCover: image.id === id,
        })),
      );
    },
    [updateImages],
  );

  useEffect(() => {
    const form =
      fileInputRef.current?.closest(
        "form",
      );

    if (!form) {
      return;
    }

    function handleReset() {
      imagesRef.current.forEach(
        revokeNewImagePreview,
      );

      const resetImages =
        initialExistingImagesRef.current.map(
          (image) => ({ ...image }),
        );

      imagesRef.current = resetImages;
      setImages(resetImages);
      setRemovedExistingImageIds([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    form.addEventListener(
      "reset",
      handleReset,
    );

    return () => {
      form.removeEventListener(
        "reset",
        handleReset,
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(
        revokeNewImagePreview,
      );
    };
  }, []);

  const selectedCover =
    images.find(
      (image) => image.isCover,
    );

  const newImages = images.filter(
    (image): image is NewImage =>
      image.type === "new",
  );

  const newCoverIndex =
    selectedCover?.type === "new"
      ? newImages.findIndex(
          (image) =>
            image.id ===
            selectedCover.id,
        )
      : -1;

  const existingCoverImageId =
    selectedCover?.type === "existing"
      ? selectedCover.existingId
      : "";

  return (
    <div className="space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        name="images"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <input
        type="hidden"
        name="existingCoverImageId"
        value={existingCoverImageId}
      />

      <input
        type="hidden"
        name="coverImageIndex"
        value={
          newCoverIndex >= 0
            ? String(newCoverIndex)
            : ""
        }
      />

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

      <DropZone
        onFilesAccepted={addFiles}
        disabled={
          images.length >= MAX_IMAGES
        }
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">
                Artifact images
              </h3>

              <p className="mt-1 text-sm text-white/40">
                {images.length} of{" "}
                {MAX_IMAGES} images selected
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/50">
              Select one image as the
              cover
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {images.map(
              (image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onSelectCover={
                    selectCover
                  }
                  onRemove={removeImage}
                />
              ),
            )}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm text-white/40">
          <ImageIcon
            size={18}
            className="shrink-0"
          />

          No artifact images are currently
          selected.
        </div>
      )}
    </div>
  );
}