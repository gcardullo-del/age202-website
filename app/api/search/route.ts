import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  searchMuseum,
} from "@/lib/services/museum/search.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_QUERY_LENGTH = 2;
const DEFAULT_LIMIT_PER_TYPE = 6;
const DEFAULT_TOTAL_LIMIT = 15;

function parsePositiveInteger(
  value: string | null,
  fallback: number,
  maximum: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return fallback;
  }

  return Math.max(
    1,
    Math.min(
      Math.trunc(parsedValue),
      maximum,
    ),
  );
}

export async function GET(
  request: NextRequest,
) {
  const query =
    request.nextUrl.searchParams
      .get("q")
      ?.trim() ?? "";

  const limitPerType =
    parsePositiveInteger(
      request.nextUrl.searchParams.get(
        "limitPerType",
      ),
      DEFAULT_LIMIT_PER_TYPE,
      12,
    );

  const totalLimit =
    parsePositiveInteger(
      request.nextUrl.searchParams.get(
        "limit",
      ),
      DEFAULT_TOTAL_LIMIT,
      30,
    );

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json(
      {
        query,
        results: [],
        total: 0,
        metadata: {
          minQueryLength:
            MIN_QUERY_LENGTH,
          limitPerType,
          totalLimit,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  }

  try {
    const response =
      await searchMuseum(
        query,
        {
          limitPerType,
          totalLimit,
        },
      );

    return NextResponse.json(
      {
        ...response,
        metadata: {
          minQueryLength:
            MIN_QUERY_LENGTH,
          limitPerType,
          totalLimit,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "[API /api/search]",
      error,
    );

    return NextResponse.json(
      {
        query,
        results: [],
        total: 0,
        metadata: {
          minQueryLength:
            MIN_QUERY_LENGTH,
          limitPerType,
          totalLimit,
        },
        error:
          "Impossibile completare la ricerca nel museo.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  }
}