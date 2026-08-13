"use server";

import { revalidatePath } from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";

import { prisma } from "@/lib/prisma";
import { deleteArtifact as deleteArtifactRepository } from "@/lib/repositories/artifact.repository";
import { deleteArtifactImage as deleteStoredArtifactImage } from "@/lib/services/artifactStorage.service";

export type DeleteArtifactResult =
  | { ok: true; storageCleanupFailed: boolean }
  | { ok: false; message: string };

export async function deleteArtifactAction(
  artifactId: string,
): Promise<DeleteArtifactResult> {
  try {
    await requireAdmin();

    const normalizedArtifactId = artifactId.trim();

    if (!normalizedArtifactId) {
      return {
        ok: false,
        message: "Artifact identifier is missing.",
      };
    }

    const artifact = await prisma.artifact.findUnique({
      where: { id: normalizedArtifactId },
      select: {
        id: true,
        slug: true,
        images: {
          select: { url: true },
        },
      },
    });

    if (!artifact) {
      return {
        ok: false,
        message: "This artifact no longer exists.",
      };
    }

    await deleteArtifactRepository(artifact.id);

    const cleanupResults = await Promise.allSettled(
      artifact.images.map((image) => deleteStoredArtifactImage(image.url)),
    );

    const storageCleanupFailed = cleanupResults.some(
      (result) => result.status === "rejected",
    );

    revalidatePath("/admin");
    revalidatePath("/admin/artifacts");
    revalidatePath("/archive");
    revalidatePath(`/archive/${artifact.slug}`);

    return {
      ok: true,
      storageCleanupFailed,
    };
  } catch (error) {
    console.error("Unable to delete artifact", error);

    return {
      ok: false,
      message: "The artifact could not be deleted. Please try again.",
    };
  }
}