import type { Masters1000Slug } from "@/lib/data/masters-1000";

export type Masters1000GalleryImage = {
  src: string;
  title: string;
  description: string;
  label: string;
  position?: string;
};

export type Masters1000GalleryData = {
  eyebrow: string;
  title: string;
  description: string;
  images: Masters1000GalleryImage[];
};

const EMPTY_GALLERY: Masters1000GalleryData = {
  eyebrow: "Tournament gallery",
  title: "Experience the tournament",
  description: "A visual journey through the courts, atmosphere and defining spaces of the event.",
  images: [],
};

const galleries: Partial<Record<Masters1000Slug, Masters1000GalleryData>> = {
  "indian-wells": {
    eyebrow: "Tournament gallery",
    title: "Experience Indian Wells",
    description:
      "From the vast Stadium 1 to the desert light, discover the spaces and atmosphere that make Indian Wells one of the most distinctive events on the tennis calendar.",
    images: [
      {
        src: "/tournaments/indian-wells/gallery/stadium-1.jpg",
        title: "Stadium 1",
        description: "The monumental centre court of the Indian Wells Tennis Garden.",
        label: "Main arena",
        position: "center",
      },
      {
        src: "/tournaments/indian-wells/gallery/practice-courts.jpg",
        title: "Practice Courts",
        description: "Where players prepare beneath the California desert sun.",
        label: "Behind the scenes",
        position: "center",
      },
      {
        src: "/tournaments/indian-wells/gallery/night-session.jpg",
        title: "Night Session",
        description: "Stadium lights and evening tennis in the Coachella Valley.",
        label: "After sunset",
        position: "center",
      },
      {
        src: "/tournaments/indian-wells/gallery/tennis-garden.jpg",
        title: "Tennis Garden",
        description: "The palm-lined grounds and distinctive desert setting of the tournament.",
        label: "Tournament grounds",
        position: "center",
      },
      {
        src: "/tournaments/indian-wells/gallery/trophy-ceremony.jpg",
        title: "Trophy Ceremony",
        description: "The final celebration on one of the biggest stages outside the Grand Slams.",
        label: "Championship moment",
        position: "center 25%",
      },
    ],
  },
};

export function getMasters1000Gallery(
  slug: Masters1000Slug,
): Masters1000GalleryData {
  return galleries[slug] ?? EMPTY_GALLERY;
}
