import type { Product } from "@/data/product.types";
import type {
  getPublishedArtifacts,
} from "@/lib/repositories/artifact.repository";

type PublishedArtifact = Awaited<
  ReturnType<typeof getPublishedArtifacts>
>[number];

const FALLBACK_PRODUCT_IMAGE =
  "/images/placeholders/artifact-placeholder.webp";

const categoryMap: Record<
  NonNullable<PublishedArtifact["category"]>,
  Product["category"]
> = {
  SHIRT: "shirt",
  POLO: "polo",
  JACKET: "jacket",
  SHORTS: "shorts",
  SHOES: "shoes",
  CAP: "cap",
  ACCESSORY: "accessory",
};

const rarityMap: Record<
  PublishedArtifact["rarity"],
  Product["rarity"]
> = {
  COMMON: "common",
  RARE: "rare",
  VERY_RARE: "very-rare",
  LEGENDARY: "legendary",
};

const availabilityMap: Record<
  PublishedArtifact["availability"],
  Product["status"]
> = {
  AVAILABLE: "available",
  SOLD: "sold",
  COMING_SOON: "coming-soon",
  NOT_FOR_SALE: "coming-soon",
};

function getImageUrls(
  artifact: PublishedArtifact,
): string[] {
  return artifact.images
    .map((image) => image.url.trim())
    .filter(Boolean);
}

function getPrimaryImage(
  artifact: PublishedArtifact,
  imageUrls: string[],
): string {
  const coverImage = artifact.images.find(
    (image) => image.isCover,
  );

  return (
    coverImage?.url.trim() ||
    imageUrls[0] ||
    FALLBACK_PRODUCT_IMAGE
  );
}

function getCardImage(
  artifact: PublishedArtifact,
  fallbackImage: string,
): string {
  const coverImage = artifact.images.find(
    (image) => image.isCover,
  );

  return (
    coverImage?.cardUrl?.trim() ||
    coverImage?.url.trim() ||
    fallbackImage
  );
}

function getHeroImage(
  artifact: PublishedArtifact,
  fallbackImage: string,
): string {
  const coverImage = artifact.images.find(
    (image) => image.isCover,
  );

  return (
    coverImage?.heroUrl?.trim() ||
    coverImage?.galleryUrl?.trim() ||
    coverImage?.url.trim() ||
    fallbackImage
  );
}

function getText(
  value: string | null | undefined,
  fallback: string,
): string {
  const normalized = value?.trim();

  return normalized || fallback;
}

export function mapArtifactToProduct(
  artifact: PublishedArtifact,
): Product {
  const imageUrls =
    getImageUrls(artifact);

  const primaryImage =
    getPrimaryImage(
      artifact,
      imageUrls,
    );

  const cardImage =
    getCardImage(
      artifact,
      primaryImage,
    );

  const heroImage =
    getHeroImage(
      artifact,
      primaryImage,
    );

  const description = getText(
    artifact.description,
    artifact.subtitle?.trim() ||
      `${artifact.title}, preserved in the AGE202 digital tennis archive.`,
  );

  const museumStory = getText(
    artifact.museumStory,
    description,
  );

  const year =
    artifact.year ??
    artifact.publishedAt?.getFullYear() ??
    artifact.createdAt.getFullYear();

  return {
    id:
      artifact.id,

    slug:
      artifact.slug,

    title:
      artifact.title,

    player:
      artifact.player.name,

    tournament:
      getText(
        artifact.tournament,
        "AGE202 Archive",
      ),

    year,

    brand:
      artifact.brand.name,

    category:
      artifact.category
        ? categoryMap[
            artifact.category
          ]
        : "accessory",

    collection:
      getText(
        artifact.collection,
        "AGE202 Digital Museum",
      ),

    description,

    museumStory,

    story:
      museumStory,

    historicalContext:
      getText(
        artifact.historicalContext,
        `A collectible tennis artifact connected to ${artifact.player.name}.`,
      ),

    curatorNote:
      getText(
        artifact.curatorNote,
        "Catalogued by AGE202 as part of the digital tennis apparel museum.",
      ),

    size:
      getText(
        artifact.size,
        "Not specified",
      ),

    color:
      getText(
        artifact.colour,
        "Not specified",
      ),

    condition:
      artifact.condition
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase(),
        ),

    status:
      availabilityMap[
        artifact.availability
      ],

    available:
      artifact.availability ===
      "AVAILABLE",

    authentic:
      artifact.authentic,

    featured:
      artifact.featured,

    vintage:
      artifact.vintage,

    rarity:
      rarityMap[
        artifact.rarity
      ],

    archiveNumber:
      artifact.archiveNumber,

    authenticityCode:
      artifact.authenticityCode ??
      artifact.certificate?.code ??
      "",

    price:
      artifact.price === null
        ? null
        : Number(
            artifact.price,
          ),

    vintedUrl:
      artifact.vintedUrl,

    image:
      primaryImage,

    cardImage,

    heroImage,

    images:
      imageUrls.length > 0
        ? imageUrls
        : [
            FALLBACK_PRODUCT_IMAGE,
          ],

    gallery:
      imageUrls.length > 0
        ? imageUrls
        : [
            FALLBACK_PRODUCT_IMAGE,
          ],

    tags:
      artifact.tags,
  };
}

export function mapArtifactsToProducts(
  artifacts: PublishedArtifact[],
): Product[] {
  return artifacts.map(
    mapArtifactToProduct,
  );
}