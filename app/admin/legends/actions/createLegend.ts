"use server";

import {
  revalidatePath,
} from "next/cache";
import {
  redirect,
} from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createLegend as createLegendRecord,
  replaceLegendImages,
} from "@/lib/repositories/legend.repository";

import {
  createMedia,
} from "@/lib/repositories/media.repository";

import {
  uploadArtifactImage,
} from "@/lib/services/artifactStorage.service";

function readString(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function readNullableString(
  formData: FormData,
  name: string,
): string | null {
  const value =
    readString(
      formData,
      name,
    );

  return value.length > 0
    ? value
    : null;
}

function readInteger(
  formData: FormData,
  name: string,
  fallback = 0,
): number {
  const raw =
    readString(
      formData,
      name,
    );

  if (!raw) {
    return fallback;
  }

  const value =
    Number.parseInt(
      raw,
      10,
    );

  return Number.isFinite(value)
    ? value
    : fallback;
}

function readNullableInteger(
  formData: FormData,
  name: string,
): number | null {
  const raw =
    readString(
      formData,
      name,
    );

  if (!raw) {
    return null;
  }

  const value =
    Number.parseInt(
      raw,
      10,
    );

  return Number.isFinite(value)
    ? value
    : null;
}

function readBoolean(
  formData: FormData,
  name: string,
): boolean {
  const value =
    formData.get(name);

  return (
    value === "on" ||
    value === "true" ||
    value === "1"
  );
}

function readDate(
  formData: FormData,
  name: string,
): Date | null {
  const raw =
    readString(
      formData,
      name,
    );

  if (!raw) {
    return null;
  }

  const date =
    new Date(
      `${raw}T00:00:00.000Z`,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date;
}

function readFile(
  formData: FormData,
  name: string,
): File | null {
  const value =
    formData.get(name);

  if (
    !(value instanceof File) ||
    value.size <= 0
  ) {
    return null;
  }

  return value;
}

function extensionFromFile(
  file: File,
): string {
  return (
    file.name
      .split(".")
      .pop()
      ?.trim()
      .toLowerCase() ||
    "bin"
  );
}

function readGender(
  formData: FormData,
): "MALE" | "FEMALE" {
  return readString(
    formData,
    "gender",
  ) === "FEMALE"
    ? "FEMALE"
    : "MALE";
}

function readStatus(
  formData: FormData,
):
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED" {
  const status =
    readString(
      formData,
      "status",
    );

  if (
    status === "PUBLISHED" ||
    status === "ARCHIVED"
  ) {
    return status;
  }

  return "DRAFT";
}

async function uploadLegendMedia({
  slug,
  legendName,
  file,
  storagePath,
  title,
  alt,
  tags,
}: {
  slug: string;
  legendName: string;
  file: File;
  storagePath: string;
  title: string;
  alt: string;
  tags: string[];
}) {
  if (
    !file.type.startsWith(
      "image/",
    )
  ) {
    throw new Error(
      `${title} must be an image.`,
    );
  }

  const uploadedUrl =
    await uploadArtifactImage(
      storagePath,
      file,
    );

  await createMedia({
    title,
    alt,
    originalName:
      file.name,
    url:
      uploadedUrl,
    mimeType:
      file.type ||
      "application/octet-stream",
    extension:
      extensionFromFile(
        file,
      ),
    size:
      file.size,
    width:
      null,
    height:
      null,
    tags: [
      "Legend",
      slug,
      ...tags,
    ],
    folderId:
      null,
    isUsed:
      true,
  });

  return uploadedUrl;
}

export async function createLegend(
  formData: FormData,
) {
  await requireAdmin();

  const name =
    readString(
      formData,
      "name",
    );

  const slug =
    readString(
      formData,
      "slug",
    );

  if (!name) {
    throw new Error(
      "Legend name is required.",
    );
  }

  if (!slug) {
    throw new Error(
      "Legend slug is required.",
    );
  }

  const status =
    readStatus(formData);

  let heroImage =
    readNullableString(
      formData,
      "heroImage",
    );

  let portraitImage =
    readNullableString(
      formData,
      "portraitImage",
    );

  const heroFile =
    readFile(
      formData,
      "heroFile",
    );

  const portraitFile =
    readFile(
      formData,
      "portraitFile",
    );

  if (heroFile) {
    heroImage =
      await uploadLegendMedia({
        slug,
        legendName: name,
        file: heroFile,
        storagePath:
          `legends/${slug}/hero`,
        title:
          `${name} · Hero`,
        alt:
          `${name} legend hero`,
        tags: [
          "Hero",
        ],
      });
  }

  if (portraitFile) {
    portraitImage =
      await uploadLegendMedia({
        slug,
        legendName: name,
        file: portraitFile,
        storagePath:
          `legends/${slug}/portrait`,
        title:
          `${name} · Portrait`,
        alt:
          `${name} legend portrait`,
        tags: [
          "Portrait",
        ],
      });
  }

  const gallery = [];

  for (
    let position = 1;
    position <= 7;
    position += 1
  ) {
    const galleryFile =
      readFile(
        formData,
        `galleryFile${position}`,
      );

    let galleryUrl =
      readString(
        formData,
        `galleryImage${position}`,
      );

    if (galleryFile) {
      galleryUrl =
        await uploadLegendMedia({
          slug,
          legendName: name,
          file: galleryFile,
          storagePath:
            `legends/${slug}/gallery/${position}`,
          title:
            `${name} · Gallery ${position}`,
          alt:
            readNullableString(
              formData,
              `galleryAlt${position}`,
            ) ??
            `${name} gallery image ${position}`,
          tags: [
            "Gallery",
            `Photo-${position}`,
          ],
        });
    }

    if (!galleryUrl) {
      continue;
    }

    gallery.push({
      url:
        galleryUrl,
      alt:
        readNullableString(
          formData,
          `galleryAlt${position}`,
        ),
      caption:
        readNullableString(
          formData,
          `galleryCaption${position}`,
        ),
      sortOrder:
        position - 1,
    });
  }

  const legend =
    await createLegendRecord({
      name,
      slug,
      gender:
        readGender(formData),
      status,

      firstName:
        readNullableString(
          formData,
          "firstName",
        ),
      lastName:
        readNullableString(
          formData,
          "lastName",
        ),
      nickname:
        readNullableString(
          formData,
          "nickname",
        ),
      nationality:
        readNullableString(
          formData,
          "nationality",
        ),
      countryCode:
        readNullableString(
          formData,
          "countryCode",
        ),
      birthDate:
        readDate(
          formData,
          "birthDate",
        ),
      birthPlace:
        readNullableString(
          formData,
          "birthPlace",
        ),
      deathDate:
        readDate(
          formData,
          "deathDate",
        ),
      era:
        readNullableString(
          formData,
          "era",
        ),
      turnedPro:
        readNullableInteger(
          formData,
          "turnedPro",
        ),
      retiredYear:
        readNullableInteger(
          formData,
          "retiredYear",
        ),
      plays:
        readNullableString(
          formData,
          "plays",
        ),
      backhand:
        readNullableString(
          formData,
          "backhand",
        ),

      heroImage,
      portraitImage,

      quote:
        readNullableString(
          formData,
          "quote",
        ),
      biographyShort:
        readNullableString(
          formData,
          "biographyShort",
        ),
      biographyLong:
        readNullableString(
          formData,
          "biographyLong",
        ),
      legacy:
        readNullableString(
          formData,
          "legacy",
        ),

      careerHigh:
        readNullableInteger(
          formData,
          "careerHigh",
        ),
      careerTitles:
        readInteger(
          formData,
          "careerTitles",
        ),
      grandSlams:
        readInteger(
          formData,
          "grandSlams",
        ),
      australianOpen:
        readInteger(
          formData,
          "australianOpen",
        ),
      rolandGarros:
        readInteger(
          formData,
          "rolandGarros",
        ),
      wimbledon:
        readInteger(
          formData,
          "wimbledon",
        ),
      usOpen:
        readInteger(
          formData,
          "usOpen",
        ),
      weeksAtNo1:
        readInteger(
          formData,
          "weeksAtNo1",
        ),
      yearEndNo1:
        readInteger(
          formData,
          "yearEndNo1",
        ),
      olympicGold:
        readInteger(
          formData,
          "olympicGold",
        ),

      displayOrder:
        readInteger(
          formData,
          "displayOrder",
        ),
      featured:
        readBoolean(
          formData,
          "featured",
        ),
      publishedAt:
        status === "PUBLISHED"
          ? new Date()
          : null,

      metaTitle:
        readNullableString(
          formData,
          "metaTitle",
        ),
      metaDescription:
        readNullableString(
          formData,
          "metaDescription",
        ),
      canonicalUrl:
        readNullableString(
          formData,
          "canonicalUrl",
        ),
      openGraphImage:
        readNullableString(
          formData,
          "openGraphImage",
        ),
      robotsIndex:
        formData.has(
          "robotsIndex",
        )
          ? readBoolean(
              formData,
              "robotsIndex",
            )
          : true,
      robotsFollow:
        formData.has(
          "robotsFollow",
        )
          ? readBoolean(
              formData,
              "robotsFollow",
            )
          : true,
    });

  if (gallery.length > 0) {
    await replaceLegendImages(
      legend.id,
      gallery,
    );
  }

  revalidatePath(
    "/admin/legends",
  );

  redirect(
    `/admin/legends/${legend.id}`,
  );
}