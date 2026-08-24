import "server-only";

import webpush from "web-push";

import { prisma } from "@/lib/prisma";

type SalePushNotificationInput = {
  orderId: string;
  orderNumber: string;
  productName: string;
  total: number;
  currency: string;
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

export async function sendSalePushNotification(
  input: SalePushNotificationInput,
) {
  configureWebPush();

  const subscriptions =
    await prisma.pushSubscription.findMany({
      where: {
        enabled: true,
      },
    });

  if (subscriptions.length === 0) {
    console.log(
      "Nessun dispositivo push AGE202 registrato.",
    );
    return;
  }

  const formattedTotal =
    new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: input.currency,
    }).format(input.total);

  const payload = JSON.stringify({
    title: "🎾 Nuova vendita AGE202",
    body: `${input.productName} · ${formattedTotal}`,
    tag: `age202-order-${input.orderId}`,
    url: `/admin/orders/${input.orderId}`,
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
          await prisma.pushSubscription.update({
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
      `Invio push AGE202: ${failures.length} errore/i.`,
      failures,
    );
  }
}
