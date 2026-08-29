"use client";



import Image, {
  type ImageProps,
} from "next/image";

type AgeImagePreset =
  | "hero"
  | "card"
  | "detail"
  | "gallery"
  | "thumbnail"
  | "avatar";

type AgeImageProps = Omit<
  ImageProps,
  "quality" | "sizes"
> & {
  preset?: AgeImagePreset;
  quality?: number;
  sizes?: string;
};

const PRESET_SIZES: Record<
  AgeImagePreset,
  string
> = {
  hero: "100vw",
  card: "(max-width: 640px) 100vw, 384px",
  detail:
    "(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 960px",
  gallery:
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px",
  thumbnail:
    "(max-width: 640px) 96px, 128px",
  avatar:
    "(max-width: 640px) 64px, 96px",
};

export default function AgeImage({
  preset = "card",
  quality = 85,
  sizes,
  priority = false,
  loading,
  ...props
}: AgeImageProps) {
  const resolvedLoading =
    priority
      ? undefined
      : loading ?? "lazy";

  return (
    <Image
      {...props}
      priority={priority}
      loading={resolvedLoading}
      quality={quality}
      sizes={
        sizes ??
        PRESET_SIZES[preset]
      }
    />
  );
}
