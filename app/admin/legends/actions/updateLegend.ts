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
  createMedia,
} from "@/lib/repositories/media.repository";

import {
  getLegendById,
  replaceLegendImages,
  replaceLegendMilestones,
  updateLegend as updateLegendRecord,
} from "@/lib/repositories/legend.repository";

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

  return value
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

async function uploadLegendImage({
  slug,
  name,
  file,
  storagePath,
  title,
  alt,
  tags,
}: {
  slug: string;
  name: string;
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

export async function updateLegend(
  legendId: string,
  formData: FormData,
) {
  await requireAdmin();

  const current =
    await getLegendById(
      legendId,
    );

  if (!current) {
    throw new Error(
      "Legend not found.",
    );
  }

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
      await uploadLegendImage({
        slug,
        name,
        file: heroFile,
        storagePath:
          `legends/${slug}/hero`,
        title:
          `${name} · Hero`,
        alt:
          `${name} legend hero`,
        tags: ["Hero"],
      });
  }

  if (portraitFile) {
    portraitImage =
      await uploadLegendImage({
        slug,
        name,
        file: portraitFile,
        storagePath:
          `legends/${slug}/portrait`,
        title:
          `${name} · Portrait`,
        alt:
          `${name} legend portrait`,
        tags: ["Portrait"],
      });
  }

  await updateLegendRecord(
    legendId,
    {
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
          ? current.publishedAt ??
            new Date()
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
          : current.robotsIndex,
      robotsFollow:
        formData.has(
          "robotsFollow",
        )
          ? readBoolean(
              formData,
              "robotsFollow",
            )
          : current.robotsFollow,
    },
  );

  const galleryWasSubmitted =
    Array.from(
      {
        length: 7,
      },
      (
        _,
        index,
      ) => index + 1,
    ).some(
      (position) =>
        formData.has(
          `galleryImage${position}`,
        ) ||
        formData.has(
          `galleryFile${position}`,
        ) ||
        formData.has(
          `galleryAlt${position}`,
        ) ||
        formData.has(
          `galleryCaption${position}`,
        ),
    );

  if (galleryWasSubmitted) {
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
          await uploadLegendImage({
            slug,
            name,
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

    await replaceLegendImages(
      legendId,
      gallery,
    );
  }


  const timelineWasSubmitted =
    Array.from(
      {
        length: 7,
      },
      (
        _,
        index,
      ) => index + 1,
    ).some(
      (position) =>
        formData.has(
          `timelineYear${position}`,
        ) ||
        formData.has(
          `timelineTitle${position}`,
        ) ||
        formData.has(
          `timelineSubtitle${position}`,
        ) ||
        formData.has(
          `timelineDescription${position}`,
        ) ||
        formData.has(
          `timelineImage${position}`,
        ) ||
        formData.has(
          `timelineFile${position}`,
        ) ||
        formData.has(
          `timelineFeatured${position}`,
        ) ||
        formData.has(
          `timelineSortOrder${position}`,
        ),
    );

  if (timelineWasSubmitted) {
    const milestones = [];

    for (
      let position = 1;
      position <= 7;
      position += 1
    ) {
      const year =
        readNullableInteger(
          formData,
          `timelineYear${position}`,
        );

      const title =
        readString(
          formData,
          `timelineTitle${position}`,
        );

      const subtitle =
        readNullableString(
          formData,
          `timelineSubtitle${position}`,
        );

      const description =
        readNullableString(
          formData,
          `timelineDescription${position}`,
        );

      let imageUrl =
        readNullableString(
          formData,
          `timelineImage${position}`,
        );

      const timelineFile =
        readFile(
          formData,
          `timelineFile${position}`,
        );

      if (timelineFile) {
        imageUrl =
          await uploadLegendImage({
            slug,
            name,
            file: timelineFile,
            storagePath:
              `legends/${slug}/timeline/${position}`,
            title:
              `${name} · Timeline ${position}`,
            alt:
              title ||
              `${name} timeline milestone ${position}`,
            tags: [
              "Timeline",
              `Milestone-${position}`,
            ],
          });
      }

      if (
        year === null &&
        !title &&
        !subtitle &&
        !description &&
        !imageUrl
      ) {
        continue;
      }

      if (
        year === null ||
        !title
      ) {
        throw new Error(
          `Timeline milestone ${position} requires both year and title.`,
        );
      }

      milestones.push({
        year,
        title,
        subtitle,
        description,
        imageUrl,
        featured:
          readBoolean(
            formData,
            `timelineFeatured${position}`,
          ),
        sortOrder:
          readInteger(
            formData,
            `timelineSortOrder${position}`,
            position - 1,
          ),
      });
    }

    await replaceLegendMilestones(
      legendId,
      milestones,
    );
  }

  revalidatePath(
    "/admin/legends",
  );

  revalidatePath(
    `/admin/legends/${legendId}`,
  );

  revalidatePath(
    `/legends/${slug}`,
  );

  redirect(
    `/admin/legends/${legendId}?saved=1`,
  );
}