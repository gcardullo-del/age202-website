"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";

export async function deleteCollection(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const value =
    formData.get("collectionId");

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      "collectionId is required.",
    );
  }

  const collectionId = value.trim();

  const current =
    await prisma.museumCollection.findUnique(
      {
        where: {
          id: collectionId,
        },
        select: {
          slug: true,
        },
      },
    );

  if (!current) {
    throw new Error(
      "The collection could not be found.",
    );
  }

  await prisma.museumCollection.delete(
    {
      where: {
        id: collectionId,
      },
    },
  );

  revalidatePath(
    "/admin/collections",
  );
  revalidatePath(
    "/collections",
  );
  revalidatePath(
    `/collections/${current.slug}`,
  );

  redirect(
    "/admin/collections",
  );
}