import {
  NextResponse,
} from "next/server";

import {
  MuseumPageStatus,
} from "@/generated/prisma/client";

import {
  listTennisHistoryEntries,
} from "@/lib/services/tennis-history.service";


export const dynamic =
  "force-dynamic";


function getTodayParts() {
  const today =
    new Date();

  return {
    month:
      today.getMonth() + 1,

    day:
      today.getDate(),
  };
}


/**
 * Returns the published Tennis History
 * entry selected for today's calendar date.
 *
 * Priority:
 * 1. featured entries
 * 2. lower sortOrder
 * 3. most recent historical year
 */
export async function GET() {
  try {
    const {
      month,
      day,
    } =
      getTodayParts();

    const entries =
      await listTennisHistoryEntries(
        {
          status:
            MuseumPageStatus.PUBLISHED,

          month,

          day,
        },
      );


    const orderedEntries =
      [...entries].sort(
        (
          first,
          second,
        ) => {
          if (
            first.featured !==
            second.featured
          ) {
            return first.featured
              ? -1
              : 1;
          }

          if (
            first.sortOrder !==
            second.sortOrder
          ) {
            return (
              first.sortOrder -
              second.sortOrder
            );
          }

          return (
            second.year -
            first.year
          );
        },
      );


    return NextResponse.json(
      {
        date: {
          month,
          day,
        },

        entry:
          orderedEntries[0] ??
          null,

        entries:
          orderedEntries,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load today's Tennis History entry.";

    return NextResponse.json(
      {
        error:
          message,
      },
      {
        status: 500,
      },
    );
  }
}