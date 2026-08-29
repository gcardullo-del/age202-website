import {
  NextResponse,
} from "next/server";

import {
  AdminAuthError,
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  prisma,
} from "@/lib/prisma";

import {
  getInPostShipmentLabel,
} from "@/lib/services/inpost.service";


export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";


type RouteContext = {
  params: Promise<{
    trackingNumber: string;
  }>;
};


export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    /*
     * L'etichetta può contenere dati logistici
     * e informazioni del destinatario.
     *
     * Nessuna operazione viene eseguita prima
     * di avere verificato l'Admin AGE202.
     */
    await requireAdmin();


    const {
      trackingNumber:
        rawTrackingNumber,
    } =
      await context.params;


    const trackingNumber =
      decodeURIComponent(
        rawTrackingNumber,
      ).trim();


    if (!trackingNumber) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Tracking number InPost mancante.",
        },
        {
          status:
            400,
        },
      );
    }


    /*
     * Non permettiamo di utilizzare questa route
     * come proxy generico verso InPost.
     *
     * Il tracking deve appartenere a una
     * spedizione realmente registrata in AGE202.
     */
    const order =
      await prisma.order.findFirst({
        where: {
          shippingProvider:
            "INPOST",

          inpostTrackingNumber:
            trackingNumber,
        },

        select: {
          id:
            true,

          orderNumber:
            true,

          isTest:
            true,
        },
      });


    if (!order) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Nessun ordine AGE202 associato a questo tracking InPost.",
        },
        {
          status:
            404,
        },
      );
    }


    /*
     * Normalmente gli ordini TEST non possiedono
     * tracking InPost reali.
     *
     * Manteniamo comunque una guard esplicita
     * per evitare qualsiasi chiamata Production.
     */
    if (order.isTest) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Ordine Stripe TEST: download etichetta InPost bloccato per sicurezza.",

          orderNumber:
            order.orderNumber,
        },
        {
          status:
            409,
        },
      );
    }


    const label =
      await getInPostShipmentLabel(
        trackingNumber,
      );


    /*
     * Creiamo un ArrayBuffer autonomo.
     *
     * Evita il problema TypeScript già incontrato
     * passando direttamente Uint8Array a Response.
     */
    const responseBytes =
      Uint8Array.from(
        label.bytes,
      );


    return new Response(
      responseBytes.buffer,
      {
        status:
          200,

        headers: {
          "Content-Type":
            label.contentType,

          "Content-Disposition":
            `attachment; filename="${label.fileName}"`,

          "Cache-Control":
            "private, no-store, no-cache, must-revalidate",

          Pragma:
            "no-cache",

          Expires:
            "0",
        },
      },
    );
  } catch (error) {
    if (
      error instanceof
      AdminAuthError
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            error.message,
        },
        {
          status:
            error.status,
        },
      );
    }


    console.error(
      "[AGE202][InPost label]",
      error,
    );


    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Errore imprevisto durante il recupero dell'etichetta InPost.",
      },
      {
        status:
          500,
      },
    );
  }
}