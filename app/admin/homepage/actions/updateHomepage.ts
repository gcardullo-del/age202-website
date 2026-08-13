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
  type HomepageSettings,
  updateAdminHomepageSettings,
} from "@/lib/repositories/admin/admin-homepage.repository";

function getRequiredString(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `${name} is required.`,
    );
  }

  return value.trim();
}

function getOptionalString(
  formData: FormData,
  name: string,
): string {
  const value =
    formData.get(name);

  return typeof value === "string"
    ? value.trim()
    : "";
}

function getStringArray(
  formData: FormData,
  name: string,
): string[] {
  const value =
    getOptionalString(
      formData,
      name,
    );

  if (!value) {
    return [];
  }

  try {
    const parsed:
      unknown =
      JSON.parse(value);

    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (item) =>
          typeof item ===
          "string",
      )
    ) {
      return [];
    }

    return [
      ...new Set(parsed),
    ];
  } catch {
    return [];
  }
}

export async function updateHomepage(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const settings:
    HomepageSettings = {
    heroEyebrow:
      getRequiredString(
        formData,
        "heroEyebrow",
      ),

    heroTitle:
      getRequiredString(
        formData,
        "heroTitle",
      ),

    heroSubtitle:
      getRequiredString(
        formData,
        "heroSubtitle",
      ),

    heroDescription:
      getRequiredString(
        formData,
        "heroDescription",
      ),

    heroCtaLabel:
      getRequiredString(
        formData,
        "heroCtaLabel",
      ),

    heroCtaHref:
      getRequiredString(
        formData,
        "heroCtaHref",
      ),

    heroImage:
      getRequiredString(
        formData,
        "heroImage",
      ),

    museumTagline:
      getOptionalString(
        formData,
        "museumTagline",
      ),

    museumIntroduction:
      getOptionalString(
        formData,
        "museumIntroduction",
      ),

    featuredPlayers:
      getStringArray(
        formData,
        "featuredPlayers",
      ),
  };

  await updateAdminHomepageSettings(
    settings,
  );

  revalidatePath(
    "/admin/homepage",
  );

  revalidatePath("/");

  redirect(
    "/admin/homepage?saved=1",
  );
}