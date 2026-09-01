import {
  NextResponse,
} from "next/server";

import {
  revalidatePath,
} from "next/cache";

import {
  prisma,
} from "@/lib/prisma";

type FeedbackStatus =
  | "NEW"
  | "REVIEWED"
  | "ARCHIVED";

type UpdateFeedbackRequestBody = {
  status?: unknown;
};

const ALLOWED_STATUSES: FeedbackStatus[] = [
  "NEW",
  "REVIEWED",
  "ARCHIVED",
];

function isFeedbackStatus(
  value: unknown,
): value is FeedbackStatus {
  return (
    typeof value === "string" &&
    ALLOWED_STATUSES.includes(
      value as FeedbackStatus,
    )
  );
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const {
      id,
    } = await context.params;

    const body =
      (await request.json()) as UpdateFeedbackRequestBody;

    if (
      !isFeedbackStatus(
        body.status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Stato feedback non valido.",
        },
        {
          status: 400,
        },
      );
    }

    const existingFeedback =
      await prisma.feedback.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
      });

    if (!existingFeedback) {
      return NextResponse.json(
        {
          error:
            "Feedback non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    const feedback =
      await prisma.feedback.update({
        where: {
          id,
        },

        data: {
          status:
            body.status,
        },

        select: {
          id: true,
          status: true,
          updatedAt: true,
        },
      });

    revalidatePath(
      "/admin/feedback",
    );

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(
      "[admin-feedback] Unable to update feedback:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile aggiornare il feedback.",
      },
      {
        status: 500,
      },
    );
  }
}
