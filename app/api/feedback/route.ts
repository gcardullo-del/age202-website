import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type FeedbackRequestBody = {
  rating?: unknown;
  category?: unknown;
  message?: unknown;
  sourcePath?: unknown;
};

const ALLOWED_CATEGORIES = [
  "LIKE",
  "MISSING_SOMETHING",
  "IDEA",
] as const;

type FeedbackCategory =
  (typeof ALLOWED_CATEGORIES)[number];

function isFeedbackCategory(
  value: unknown,
): value is FeedbackCategory {
  return (
    typeof value === "string" &&
    ALLOWED_CATEGORIES.includes(
      value as FeedbackCategory,
    )
  );
}

function normalizeMessage(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const message = value.trim();

  if (!message) {
    return null;
  }

  return message.slice(0, 2000);
}

function normalizeSourcePath(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return "/";
  }

  const sourcePath = value.trim();

  if (
    !sourcePath ||
    !sourcePath.startsWith("/")
  ) {
    return "/";
  }

  return sourcePath.slice(0, 500);
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as FeedbackRequestBody;

    const rating =
      typeof body.rating === "number"
        ? body.rating
        : Number(body.rating);

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          error:
            "La valutazione deve essere compresa tra 1 e 5.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isFeedbackCategory(
        body.category,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Categoria feedback non valida.",
        },
        {
          status: 400,
        },
      );
    }

    const message =
      normalizeMessage(
        body.message,
      );

    const sourcePath =
      normalizeSourcePath(
        body.sourcePath,
      );

    const feedback =
      await prisma.feedback.create({
        data: {
          rating,
          category:
            body.category,
          message,
          sourcePath,
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        feedback,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "[feedback] Unable to save feedback:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossibile salvare il feedback.",
      },
      {
        status: 500,
      },
    );
  }
}