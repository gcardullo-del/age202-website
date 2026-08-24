import { NextResponse } from "next/server";

import {
  requireAdmin,
} from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";

type PushSubscriptionBody = {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

export async function POST(request: Request) {
  await requireAdmin();

  try {
    const body =
      (await request.json()) as PushSubscriptionBody;

    const endpoint = body.endpoint?.trim();
    const p256dh = body.keys?.p256dh?.trim();
    const auth = body.keys?.auth?.trim();

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        {
          error:
            "Subscription push non valida.",
        },
        {
          status: 400,
        },
      );
    }

    const userAgent =
      request.headers.get("user-agent");

    const subscription =
      await prisma.pushSubscription.upsert({
        where: {
          endpoint,
        },
        update: {
          p256dh,
          auth,
          userAgent,
          enabled: true,
        },
        create: {
          endpoint,
          p256dh,
          auth,
          userAgent,
          enabled: true,
        },
        select: {
          id: true,
          enabled: true,
          createdAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error(
      "Errore registrazione push AGE202:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile registrare le notifiche push.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  await requireAdmin();

  try {
    const body =
      (await request.json()) as PushSubscriptionBody;

    const endpoint = body.endpoint?.trim();

    if (!endpoint) {
      return NextResponse.json(
        {
          error:
            "Endpoint push mancante.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.pushSubscription.updateMany({
      where: {
        endpoint,
      },
      data: {
        enabled: false,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Errore disattivazione push AGE202:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile disattivare le notifiche push.",
      },
      {
        status: 500,
      },
    );
  }
}
