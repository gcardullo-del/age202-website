import "server-only";

import webpush from "web-push";

import { prisma } from "@/lib/prisma";

type PublicArtifactNotificationInput = {
  artifactId: string;
};

function configureWebPush() {
  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey =
    process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    throw new Error(
      "Configurazione VAPID incompleta.",
    );
  }

  webpush.setVapidDetails(
    subject,
    publicKey,
    privateKey,
  );
}

export async function sendPublicArtifactNotification(
  input: PublicArtifactNotificationInput,
) {
  configureWebPush();

  const artifact = await prisma.artifact.findUnique({
    where: {
      id: input.artifactId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      playerId: true,
      player: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!artifact) {
    console.warn(
      `Push pubblico AGE202: Artifact ${input.artifactId} non trovato.`,
    );
    return;
  }

  if (artifact.status !== "PUBLISHED") {
    console.log(
      `Push pubblico AGE202 ignorato: Artifact ${artifact.id} non pubblicato.`,
    );
    return;
  }

  const subscriptions =
    await prisma.publicPushSubscription.findMany({
      where: {
        enabled: true,
        OR: [
          {
            followAllArtifacts: true,
          },
          {
            playerFollows: {
              some: {
                playerId: artifact.playerId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        endpoint: true,
        p256dh: true,
        auth: true,
      },
    });

  if (subscriptions.length === 0) {
    console.log(
      `Push pubblico AGE202: nessun follower per ${artifact.player.name}.`,
    );
    return;
  }

  const payload = JSON.stringify({
    title: `New Artifact — ${artifact.player.name} 🎾`,
    body: `${artifact.title} has entered the AGE202 Archive.`,
    tag: `age202-artifact-${artifact.id}`,
    url: `/artifacts/${artifact.slug}`,
  });

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          payload,
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" &&
          error !== null &&
          "statusCode" in error
            ? Number(
                (
                  error as {
                    statusCode?: unknown;
                  }
                ).statusCode,
              )
            : null;

        if (
          statusCode === 404 ||
          statusCode === 410
        ) {
          await prisma.publicPushSubscription.update({
            where: {
              id: subscription.id,
            },
            data: {
              enabled: false,
            },
          });

          return;
        }

        throw error;
      }
    }),
  );

  const failures = results.filter(
    (result) => result.status === "rejected",
  );

  if (failures.length > 0) {
    console.error(
      `Push pubblico AGE202: ${failures.length} errore/i durante l'invio.`,
      failures,
    );
  }
}