import {
  NextResponse,
} from "next/server";

import {
  getAllMedia,
} from "@/lib/repositories/media.repository";


export const dynamic =
  "force-dynamic";


/**
 * Lightweight Media Library endpoint used by
 * reusable CMS pickers such as Tennis History.
 *
 * Returns image assets only.
 */
export async function GET() {
  try {
    const assets =
      await getAllMedia({
        mimeType:
          "image/",
      });


    return NextResponse.json(
      {
        assets:
          assets.map(
            (
              asset,
            ) => ({
              id:
                asset.id,
              title:
                asset.title,
              url:
                asset.url,
              alt:
                asset.alt,
              originalName:
                asset.originalName,
              mimeType:
                asset.mimeType,
            }),
          ),
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load Media Library.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}