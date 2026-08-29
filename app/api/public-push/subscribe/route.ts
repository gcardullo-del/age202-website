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

    const playerId =
      searchParams.get("playerId")?.trim();

    if (!endpoint) {
      return NextResponse.json(
        {
          active: false,
          followAllArtifacts: false,
          followsPlayer: false,
        },
      );
    }

    const subscription =
      await prisma.publicPushSubscription.findUnique(
        {
          where: {
            endpoint,
          },
          select: {
            enabled: true,
            followAllArtifacts: true,
            playerFollows: playerId
              ? {
                  where: {
                    playerId,
                  },
                  select: {
                    id: true,
                  },
                }
              : false,
          },
        },
      );

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

    const followsPlayer =
      playerId &&
      Array.isArray(
        subscription.playerFollows,
      )
        ? subscription.playerFollows.length >
          0
        : false;

    return NextResponse.json({
      active: true,
      followAllArtifacts:
        subscription.followAllArtifacts,
      followsPlayer,
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

    const followAllArtifacts =
      body.followAllArtifacts === true;

    const playerIds = Array.from(
      new Set(
        (body.playerIds ?? [])
          .map((playerId) =>
            playerId.trim(),
          )
          .filter(Boolean),
      ),
    );

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

    if (
      !followAllArtifacts &&
      playerIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Seleziona almeno un giocatore oppure tutti gli Artifact.",
        },
        {
          status: 400,
        },
      );
    }

    if (playerIds.length > 100) {
      return NextResponse.json(
        {
          error:
            "Sono stati selezionati troppi giocatori.",
        },
        {
          status: 400,
        },
      );
    }

    if (playerIds.length > 0) {
      const players =
        await prisma.player.findMany({
          where: {
            id: {
              in: playerIds,
            },
            active: true,
          },
          select: {
            id: true,
          },
        });

      const validPlayerIds =
        new Set(
          players.map(
            (player) => player.id,
          ),
        );

      const hasInvalidPlayer =
        playerIds.some(
          (playerId) =>
            !validPlayerIds.has(
              playerId,
            ),
        );

      if (hasInvalidPlayer) {
        return NextResponse.json(
          {
            error:
              "Uno o più giocatori selezionati non sono validi.",
          },
          {
            status: 400,
          },
        );
      }
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
                  followAllArtifacts,
                },
                create: {
                  endpoint,
                  p256dh,
                  auth,
                  userAgent,
                  enabled: true,
                  followAllArtifacts,
                },
                select: {
                  id: true,
                  enabled: true,
                  followAllArtifacts: true,
                  createdAt: true,
                },
              },
            );

          await transaction.publicPushPlayerFollow.deleteMany(
            {
              where: {
                subscriptionId:
                  savedSubscription.id,
              },
            },
          );

          if (
            !followAllArtifacts &&
            playerIds.length > 0
          ) {
            await transaction.publicPushPlayerFollow.createMany(
              {
                data: playerIds.map(
                  (playerId) => ({
                    subscriptionId:
                      savedSubscription.id,
                    playerId,
                  }),
                ),
                skipDuplicates: true,
              },
            );
          }

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

    await prisma.publicPushSubscription.updateMany(
      {
        where: {
          endpoint,
        },
        data: {
          enabled: false,
        },
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