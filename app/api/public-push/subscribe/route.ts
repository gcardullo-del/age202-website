import { NextResponse } from "next/server";


import { prisma } from "@/lib/prisma";

type PublicPushSubscriptionBody = {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
  followAllArtifacts?: boolean;
  playerIds?: string[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const endpoint =
      searchParams.get("endpoint")?.trim();

    if (!endpoint) {
      return NextResponse.json({
        active: false,
        followAllArtifacts: false,
        followsPlayer: false,
      });
    }

    const subscription =
      await prisma.publicPushSubscription.findUnique({
        where: {
          endpoint,
        },
        select: {
          enabled: true,
          followAllArtifacts: true,
        },
      });

    if (
      !subscription ||
      !subscription.enabled
    ) {
      return NextResponse.json({
        active: false,
        followAllArtifacts: false,
        followsPlayer: false,
      });
    }

    return NextResponse.json({
      active: true,
      followAllArtifacts:
        subscription.followAllArtifacts,
      followsPlayer: false,
    });
  } catch (error) {
    console.error(
      "Errore lettura push pubbliche AGE202:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile leggere lo stato delle notifiche.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as PublicPushSubscriptionBody;

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
      await prisma.$transaction(
        async (transaction) => {
          const savedSubscription =
            await transaction.publicPushSubscription.upsert(
              {
                where: {
                  endpoint,
                },
                update: {
                  p256dh,
                  auth,
                  userAgent,
                  enabled: true,
                  followAllArtifacts: true,
                },
                create: {
                  endpoint,
                  p256dh,
                  auth,
                  userAgent,
                  enabled: true,
                  followAllArtifacts: true,
                },
                select: {
                  id: true,
                  enabled: true,
                  followAllArtifacts: true,
                  createdAt: true,
                },
              },
            );

          /*
           * FOLLOW ARTIFACTS sostituisce le vecchie
           * preferenze per singolo giocatore.
           *
           * Da questo momento la subscription riceve
           * le notifiche per qualsiasi nuovo Artifact
           * pubblicato nell'Archive.
           */
          await transaction.publicPushPlayerFollow.deleteMany(
            {
              where: {
                subscriptionId:
                  savedSubscription.id,
              },
            },
          );

          return savedSubscription;
        },
      );

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error(
      "Errore registrazione push pubbliche AGE202:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile registrare le notifiche.",
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
  try {
    const body =
      (await request.json()) as PublicPushSubscriptionBody;

    const endpoint =
      body.endpoint?.trim();

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

    await prisma.$transaction(
      async (transaction) => {
        const subscription =
          await transaction.publicPushSubscription.findUnique(
            {
              where: {
                endpoint,
              },
              select: {
                id: true,
              },
            },
          );

        if (!subscription) {
          return;
        }

        await transaction.publicPushPlayerFollow.deleteMany(
          {
            where: {
              subscriptionId:
                subscription.id,
            },
          },
        );

        await transaction.publicPushSubscription.update({
          where: {
            endpoint,
          },
          data: {
            enabled: false,
            followAllArtifacts: false,
          },
        });
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Errore disattivazione push pubbliche AGE202:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile disattivare le notifiche.",
      },
      {
        status: 500,
      },
    );
  }
}
