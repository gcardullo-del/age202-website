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

export async function archiveNextGenPlayer(
  playerKey: string,
): Promise<void> {
  await requireAdmin();

  const player =
    await prisma.nextGenPlayer.findUnique({
      where: {
        playerKey,
      },
      select: {
        id: true,
      },
    });

  if (!player) {
    throw new Error(
      "NEXT GEN player non trovato.",
    );
  }

  await prisma.$transaction(
    async (transaction) => {
      await transaction.nextGenPlayer.update({
        where: {
          playerKey,
        },
        data: {
          status:
            "ARCHIVED",
          publishedAt:
            null,
        },
      });

      await transaction.nextGenRanking.updateMany({
        where: {
          playerKey,
        },
        data: {
          active:
            false,
        },
      });
    },
  );

  revalidatePath(
    "/admin/next-gen",
  );

  revalidatePath(
    "/next-gen",
  );

  redirect(
    "/admin/next-gen",
  );
}
