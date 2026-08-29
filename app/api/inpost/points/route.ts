import { NextRequest, NextResponse } from "next/server";

import {
  searchInPostPoints,
} from "@/lib/services/inpost.service";


function parseNumber(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}


export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const latitude =
      parseNumber(
        searchParams.get("latitude"),
      );

    const longitude =
      parseNumber(
        searchParams.get("longitude"),
      );

    const country =
      searchParams
        .get("country")
        ?.trim()
        .toUpperCase() || "IT";

    const maxDistance =
      parseNumber(
        searchParams.get("maxDistance"),
      ) ?? 10_000;

    const limit =
      parseNumber(
        searchParams.get("limit"),
      ) ?? 10;

    const type =
      searchParams
        .get("type")
        ?.trim()
        .toUpperCase();

    if (
      latitude === null ||
      longitude === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "latitude e longitude sono obbligatori.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      type &&
      type !== "APM" &&
      type !== "PUDO"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'type deve essere "APM" oppure "PUDO".',
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await searchInPostPoints({
        latitude,
        longitude,
        country,
        maxDistance,
        limit: Math.trunc(limit),
        type:
          type === "APM" ||
          type === "PUDO"
            ? type
            : undefined,
      });

    return NextResponse.json({
      success: true,
      count: result.count,
      points: result.items,
    });
  } catch (error) {
    console.error(
      "Errore ricerca punti InPost:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Errore InPost sconosciuto.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}