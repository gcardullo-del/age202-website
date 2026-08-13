import {
  NextResponse,
} from "next/server";

import {
  AdminAuthError,
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  publishCollaborationEntry,
} from "@/lib/services/collaboration.service";


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


function errorStatus(
  message: string,
): number {
  const normalized =
    message.toLowerCase();

  if (
    normalized.includes(
      "record to update not found",
    ) ||
    normalized.includes(
      "not found",
    )
  ) {
    return 404;
  }

  return 400;
}


/**
 * Publishes one Collaboration CMS entry.
 */
export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requireAdmin();

    const {
      id,
    } = await context.params;

    const collaboration =
      await publishCollaborationEntry(
        id,
      );

    return NextResponse.json(
      {
        collaboration,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (
      error instanceof
      AdminAuthError
    ) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status:
            error.status,
        },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to publish collaboration.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: errorStatus(
          message,
        ),
      },
    );
  }
}