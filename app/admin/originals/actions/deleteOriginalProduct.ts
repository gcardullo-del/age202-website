"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
  deleteArtifactImage as deleteStoredImage,
} from "@/lib/services/artifactStorage.service";

export async function deleteOriginalProduct(
  formData: FormData,
): Promise<void> {
  const productId =
    formData.get("productId");

  if (
    typeof productId !==
      "string" ||
    !productId.trim()
  ) {
    throw new Error(
      "productId is required.",
    );
  }

  const product =
    await prisma.originalProduct.findUnique(
      {
        where: {
          id: productId,
        },
        include: {
          images: true,
        },
      },
    );

  if (!product) {
    return;
  }

  await prisma.originalProduct.delete(
    {
      where: {
        id: productId,
      },
    },
  );

  await Promise.allSettled(
    product.images.map((image) =>
      deleteStoredImage(
        image.url,
      ),
    ),
  );

  revalidatePath(
    "/admin/originals",
  );
  revalidatePath(
    "/age202-originals",
  );
}
