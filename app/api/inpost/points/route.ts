import { NextRequest, NextResponse } from "next/server";

import { inpostFetch } from "@/lib/inpost";

type InPostPointCoordinates = {
  latitude?: number;
  longitude?: number;
};

type InPostPointAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  postalCode?: string;
  countryCode?: string;
};

type InPostPoint = {
  id: string;
  type?: string;
  country?: string;
  locationType?: string;
  name?: string;
  description?: string;
  imageUrl?: string;

  coordinates?: InPostPointCoordinates;

  address?: InPostPointAddress;

  openingHours?: string[];
};

type InPostPointsResponse = {
  count?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
  items?: InPostPoint[];
};

export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const country =
      searchParams
        .get("country")
        ?.trim()
        .toUpperCase() || "IT";

    const city =
      searchParams
        .get("city")
        ?.trim();

    const postalCode =
      searchParams
        .get("postalCode")
        ?.trim();

    const latitude =
      searchParams
        .get("latitude")
        ?.trim();

    const longitude =
      searchParams
        .get("longitude")
        ?.trim();

    const page =
      searchParams
        .get("page")
        ?.trim() || "1";

    const perPage =
      searchParams
        .get("perPage")
        ?.trim() || "25";

    const query =
      new URLSearchParams();

    query.set(
      "country",
      country,
    );

    query.set(
      "page",
      page,
    );

    query.set(
      "perPage",
      perPage,
    );

    if (city) {
      query.set(
        "city",
        city,
      );
    }

    if (postalCode) {
      query.set(
        "postalCode",
        postalCode,
      );
    }

    if (
      latitude &&
      longitude
    ) {
      query.set(
        "latitude",
        latitude,
      );

      query.set(
        "longitude",
        longitude,
      );
    }

    const data =
      await inpostFetch<InPostPointsResponse>(
        `/location/v1/points?${query.toString()}`,
        {
          method: "GET",
        },
      );

    return NextResponse.json({
      success: true,

      points:
        data.items ?? [],

      pagination: {
        count:
          data.count ?? 0,

        page:
          data.page ??
          Number(page),

        perPage:
          data.perPage ??
          Number(perPage),

        totalPages:
          data.totalPages ?? 0,
      },
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