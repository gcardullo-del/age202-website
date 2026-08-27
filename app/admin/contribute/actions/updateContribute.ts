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
  type UpdateContributeSettingsInput,
  updateContributeSettings,
} from "@/lib/repositories/contribute.repository";


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
): string | null {
  const value =
    formData.get(name);

  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const normalized =
    value.trim();

  return normalized
    ? normalized
    : null;
}


function getBoolean(
  formData: FormData,
  name: string,
): boolean {
  return (
    formData.get(name) ===
    "on"
  );
}


function validateEmail(
  value: string,
): string {
  const normalized =
    value.trim();

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailPattern.test(
      normalized,
    )
  ) {
    throw new Error(
      "contactEmail must be a valid email address.",
    );
  }

  return normalized;
}


export async function updateContribute(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const settings:
    UpdateContributeSettingsInput = {
    active:
      getBoolean(
        formData,
        "active",
      ),

    published:
      getBoolean(
        formData,
        "published",
      ),

    eyebrow:
      getRequiredString(
        formData,
        "eyebrow",
      ),

    title:
      getRequiredString(
        formData,
        "title",
      ),

    intro:
      getOptionalString(
        formData,
        "intro",
      ),

    contactEmail:
      validateEmail(
        getRequiredString(
          formData,
          "contactEmail",
        ),
      ),

    videoGreetingTitle:
      getRequiredString(
        formData,
        "videoGreetingTitle",
      ),

    videoGreetingDescription:
      getOptionalString(
        formData,
        "videoGreetingDescription",
      ),

    videoGreetingEnabled:
      getBoolean(
        formData,
        "videoGreetingEnabled",
      ),

    dedicationTitle:
      getRequiredString(
        formData,
        "dedicationTitle",
      ),

    dedicationDescription:
      getOptionalString(
        formData,
        "dedicationDescription",
      ),

    dedicationEnabled:
      getBoolean(
        formData,
        "dedicationEnabled",
      ),

    memorabiliaTitle:
      getRequiredString(
        formData,
        "memorabiliaTitle",
      ),

    memorabiliaDescription:
      getOptionalString(
        formData,
        "memorabiliaDescription",
      ),

    memorabiliaEnabled:
      getBoolean(
        formData,
        "memorabiliaEnabled",
      ),

    provenanceTitle:
      getRequiredString(
        formData,
        "provenanceTitle",
      ),

    provenanceText:
      getOptionalString(
        formData,
        "provenanceText",
      ),

    closingText:
      getOptionalString(
        formData,
        "closingText",
      ),

    metaTitle:
      getOptionalString(
        formData,
        "metaTitle",
      ),

    metaDescription:
      getOptionalString(
        formData,
        "metaDescription",
      ),
  };

  await updateContributeSettings(
    settings,
  );

  revalidatePath(
    "/admin/contribute",
  );

  revalidatePath(
    "/contribute",
  );

  redirect(
    "/admin/contribute?saved=1",
  );
}
