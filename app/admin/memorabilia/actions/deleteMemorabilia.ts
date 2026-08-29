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
  prisma,
} from "@/lib/prisma";

import {
  deleteMemorabiliaImage as deleteStoredMemorabiliaImage,
} from "@/lib/services/memorabiliaStorage.service";

export async function deleteMemorabilia(
  formData: FormData,
): Promise<never> {
  await requireAdmin();

  const rawMemorabiliaId =
    formData.get(
      "memorabiliaId",
    );

  const memorabiliaId =
    typeof rawMemorabiliaId ===
      "string"
      ? rawMemorabiliaId.trim()
      : "";

  if (!memorabiliaId) {
    throw new Error(
      "memorabiliaId is required.",
    );
  }

  const memorabilia =
    await prisma.memorabilia.findUnique({
      where: {
        id: memorabiliaId,
      },

      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });

  if (!memorabilia) {
    throw new Error(
      "Memorabilia item not found.",
    );
  }

  const imageUrls =
    memorabilia.images
      .map(
        (image) =>
          image.url,
      )
      .filter(Boolean);

  await prisma.memorabilia.delete({
    where: {
      id: memorabiliaId,
    },
  });

  await Promise.allSettled(
    imageUrls.map(
      (url) =>
        deleteStoredMemorabiliaImage(
          url,
        ),
    ),
  );

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/memorabilia",
  );

  revalidatePath(
    "/memorabilia",
  );

  revalidatePath(
    `/memorabilia/${memorabilia.slug}`,
  );

  redirect(
    "/admin/memorabilia",
  );
}