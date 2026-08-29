import {
  NextResponse,
} from "next/server";

import {
  AdminAuthError,
  requireAdmin,
} from "@/lib/auth/admin-auth";

import {
  createInPostShipmentForOrder,
} from "@/lib/server/inpost/inpost-shipping.service";


type CreateShipmentRequestBody = {
  orderId?: string;
};


export async function POST(
  request: Request,
) {
  try {
    /*
     * Questa route può creare una spedizione InPost reale.
     *
     * Prima di leggere il body o accedere al database
     * richiediamo quindi una sessione Admin AGE202 valida.
     */
    await requireAdmin();


    const body =
      (await request.json()) as CreateShipmentRequestBody;


    const orderId =
      body.orderId?.trim();


    if (!orderId) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "orderId mancante.",
        },
        {
          status:
            400,
        },
      );
    }


    const result =
      await createInPostShipmentForOrder({
        orderId,
      });


    return NextResponse.json({
      success:
        true,

      orderId:
        result.orderId,

      orderNumber:
        result.orderNumber,

      trackingNumber:
        result.trackingNumber,

      shipment:
        result.response,
    });
  } catch (error) {
    /*
     * Gli errori di autenticazione devono mantenere
     * il loro status HTTP corretto:
     *
     * 401 -> sessione mancante/non valida
     * 403 -> account autenticato ma non autorizzato
     */
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


    const message =
      error instanceof Error
        ? error.message
        : "Errore sconosciuto durante la creazione della spedizione InPost.";


    console.error(
      "Errore creazione spedizione InPost AGE202:",
      error,
    );


    /*
     * Le guard di sicurezza del service
     * arrivano qui come errori controllati.
     *
     * Esempi:
     * - spedizioni disabilitate
     * - ordine TEST
     * - ordine non PAID
     * - ordine non READY_TO_CREATE
     * - punto InPost mancante
     * - spedizione già esistente
     */
    const isControlledError =
      message.includes(
        "Creazione spedizioni InPost disabilitata",
      ) ||
      message.includes(
        "TEST",
      ) ||
      message.includes(
        "non pagato",
      ) ||
      message.includes(
        "non più PAID",
      ) ||
      message.includes(
        "non pronto",
      ) ||
      message.includes(
        "non più READY_TO_CREATE",
      ) ||
      message.includes(
        "non configurato per InPost",
      ) ||
      message.includes(
        "possiede già una spedizione InPost",
      ) ||
      message.includes(
        "Punto InPost mancante",
      ) ||
      message.includes(
        "Email cliente mancante",
      ) ||
      message.includes(
        "Telefono cliente mancante",
      ) ||
      message.includes(
        "Nome destinatario mancante",
      ) ||
      message.includes(
        "Paese destinatario mancante",
      ) ||
      message.includes(
        "HOME_DELIVERY non è ancora supportato",
      ) ||
      message.includes(
        "Metodo di spedizione AGE202 non valido",
      );


    return NextResponse.json(
      {
        success:
          false,

        error:
          message,
      },
      {
        status:
          isControlledError
            ? 400
            : 500,
      },
    );
  }
}