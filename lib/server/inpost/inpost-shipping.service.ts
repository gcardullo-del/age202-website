import {
  prisma,
} from "@/lib/prisma";

import {
  buildInPostShipmentPayload,
  type Age202ShippingMethod,
  type InPostOriginMethod,
  type InPostParcelInput,
} from "@/lib/services/inpost-shipment.mapper";

import {
  createInPostShipment,
  type CreateInPostShipmentPayload,
  type InPostShipmentResponse,
} from "@/lib/services/inpost.service";


export type PrepareInPostShipmentInput = {
  orderId: string;

  parcel?: InPostParcelInput;

  originMethod?: InPostOriginMethod;
};


export type PreparedInPostShipment = {
  order: {
    id: string;
    orderNumber: string;

    isTest: boolean;

    paymentStatus: string;
    shippingStatus: string;

    shippingProvider: string | null;
    shippingMethod: string | null;

    inpostPointId: string;
    inpostPointName: string | null;
    inpostPointAddress: string | null;
  };

  parcel: InPostParcelInput;

  originMethod: InPostOriginMethod;

  payload: CreateInPostShipmentPayload;
};


export type CreateInPostShipmentForOrderInput = {
  orderId: string;

  parcel?: InPostParcelInput;

  originMethod?: InPostOriginMethod;
};


export type CreatedInPostShipmentForOrder = {
  orderId: string;

  orderNumber: string;

  trackingNumber: string;

  response: InPostShipmentResponse;
};


const DEFAULT_PARCEL: InPostParcelInput = {
  lengthCm:
    30,

  widthCm:
    20,

  heightCm:
    5,

  weightKg:
    1,
};


export function isInPostShippingEnabled(): boolean {
  return (
    process.env
      .INPOST_SHIPPING_ENABLED ===
    "true"
  );
}


export async function prepareInPostShipment({
  orderId,
  parcel = DEFAULT_PARCEL,
  originMethod = "PUDO",
}: PrepareInPostShipmentInput): Promise<PreparedInPostShipment> {
  const normalizedOrderId =
    orderId.trim();

  if (!normalizedOrderId) {
    throw new Error(
      "orderId mancante.",
    );
  }

  const order =
    await prisma.order.findUnique({
      where: {
        id:
          normalizedOrderId,
      },

      select: {
        id:
          true,

        orderNumber:
          true,

        status:
          true,

        paymentStatus:
          true,

        isTest:
          true,

        customerEmail:
          true,

        customerName:
          true,

        customerPhone:
          true,

        shippingName:
          true,

        shippingLine1:
          true,

        shippingLine2:
          true,

        shippingCity:
          true,

        shippingPostalCode:
          true,

        shippingState:
          true,

        shippingCountry:
          true,

        shippingProvider:
          true,

        shippingMethod:
          true,

        shippingStatus:
          true,

        inpostPointId:
          true,

        inpostPointName:
          true,

        inpostPointAddress:
          true,

        inpostShipmentId:
          true,

        inpostTrackingNumber:
          true,

        createdAt:
          true,

        paidAt:
          true,
      },
    });

  if (!order) {
    throw new Error(
      `Ordine AGE202 non trovato: ${normalizedOrderId}`,
    );
  }

  /*
   * BLOCCO ASSOLUTO PER GLI ORDINI TEST.
   *
   * Un ordine Stripe TEST non deve mai
   * poter generare una spedizione reale,
   * anche quando INPOST_SHIPPING_ENABLED
   * verrà attivato in produzione.
   */
  if (order.isTest) {
    throw new Error(
      `Ordine TEST ${order.orderNumber}: creazione spedizione InPost vietata.`,
    );
  }

  /*
   * Una spedizione può essere preparata
   * soltanto per un ordine già pagato.
   */
  if (
    order.paymentStatus !==
    "PAID"
  ) {
    throw new Error(
      `Ordine ${order.orderNumber} non pagato. paymentStatus=${order.paymentStatus}`,
    );
  }

  /*
   * Deve essere un ordine InPost.
   */
  if (
    order.shippingProvider !==
    "INPOST"
  ) {
    throw new Error(
      `Ordine ${order.orderNumber} non configurato per InPost.`,
    );
  }

  /*
   * Per ora AGE202 supporta soltanto
   * Locker e Pickup Point.
   */
  const shippingMethod =
    normalizeShippingMethod(
      order.shippingMethod,
    );

  /*
   * Questo stato viene impostato
   * dal webhook Stripe dopo il pagamento.
   */
  if (
    order.shippingStatus !==
    "READY_TO_CREATE"
  ) {
    throw new Error(
      [
        `Ordine ${order.orderNumber} non pronto per creare una spedizione InPost.`,
        `shippingStatus=${order.shippingStatus}`,
      ].join(
        " ",
      ),
    );
  }

  /*
   * Non prepariamo una seconda spedizione
   * se il DB contiene già riferimenti InPost.
   */
  if (
    order.inpostShipmentId ||
    order.inpostTrackingNumber
  ) {
    throw new Error(
      `L'ordine ${order.orderNumber} possiede già una spedizione InPost.`,
    );
  }

  const inpostPointId =
    order.inpostPointId
      ?.trim();

  if (!inpostPointId) {
    throw new Error(
      `Punto InPost mancante per ordine ${order.orderNumber}.`,
    );
  }

  if (
    !order.customerEmail
      ?.trim()
  ) {
    throw new Error(
      `Email cliente mancante per ordine ${order.orderNumber}.`,
    );
  }

  if (
    !order.customerPhone
      ?.trim()
  ) {
    throw new Error(
      `Telefono cliente mancante per ordine ${order.orderNumber}.`,
    );
  }

  if (
    !(
      order.shippingName
        ?.trim() ||
      order.customerName
        ?.trim()
    )
  ) {
    throw new Error(
      `Nome destinatario mancante per ordine ${order.orderNumber}.`,
    );
  }

  if (
    !order.shippingCountry
      ?.trim()
  ) {
    throw new Error(
      `Paese destinatario mancante per ordine ${order.orderNumber}.`,
    );
  }

  const payload =
    buildInPostShipmentPayload({
      order: {
        orderNumber:
          order.orderNumber,

        customerEmail:
          order.customerEmail,

        customerName:
          order.customerName,

        customerPhone:
          order.customerPhone,

        shippingName:
          order.shippingName,

        shippingCountry:
          order.shippingCountry,

        shippingMethod,

        inpostPointId,

        inpostPointName:
          order.inpostPointName,

        inpostPointAddress:
          order.inpostPointAddress,
      },

      parcel,

      originMethod,
    });

  return {
    order: {
      id:
        order.id,

      orderNumber:
        order.orderNumber,

      isTest:
        order.isTest,

      paymentStatus:
        order.paymentStatus,

      shippingStatus:
        order.shippingStatus,

      shippingProvider:
        order.shippingProvider,

      shippingMethod:
        order.shippingMethod,

      inpostPointId,

      inpostPointName:
        order.inpostPointName,

      inpostPointAddress:
        order.inpostPointAddress,
    },

    parcel,

    originMethod,

    payload,
  };
}


/**
 * ATTENZIONE:
 *
 * QUESTA FUNZIONE CREA REALMENTE
 * UNA SPEDIZIONE INPOST.
 *
 * È impossibile utilizzarla se:
 *
 * INPOST_SHIPPING_ENABLED !== "true"
 */
export async function createInPostShipmentForOrder({
  orderId,
  parcel = DEFAULT_PARCEL,
  originMethod = "PUDO",
}: CreateInPostShipmentForOrderInput): Promise<CreatedInPostShipmentForOrder> {
  /*
   * PRIMO BLOCCO DI SICUREZZA.
   */
  if (
    !isInPostShippingEnabled()
  ) {
    throw new Error(
      [
        "Creazione spedizioni InPost disabilitata.",
        'Imposta INPOST_SHIPPING_ENABLED="true" soltanto quando AGE202 sarà pronto per le spedizioni reali.',
      ].join(
        " ",
      ),
    );
  }

  /*
   * Riutilizziamo tutta la validazione
   * già testata in modalità dry-run.
   */
  const prepared =
    await prepareInPostShipment({
      orderId,

      parcel,

      originMethod,
    });

  /*
   * SECONDO CONTROLLO:
   *
   * immediatamente prima della POST
   * ricontrolliamo il DB.
   */
  const currentOrder =
    await prisma.order.findUnique({
      where: {
        id:
          prepared.order.id,
      },

      select: {
        id:
          true,

        orderNumber:
          true,

        isTest:
          true,

        paymentStatus:
          true,

        shippingProvider:
          true,

        shippingStatus:
          true,

        inpostShipmentId:
          true,

        inpostTrackingNumber:
          true,
      },
    });

  if (!currentOrder) {
    throw new Error(
      `Ordine ${prepared.order.id} non più presente nel database.`,
    );
  }

  /*
   * BLOCCO TEST RIPETUTO SUBITO PRIMA
   * DELLA CHIAMATA REALE A INPOST.
   *
   * Questo secondo controllo protegge anche
   * da eventuali modifiche concorrenti del DB
   * tra prepareInPostShipment() e la POST.
   */
  if (currentOrder.isTest) {
    throw new Error(
      `Ordine TEST ${currentOrder.orderNumber}: spedizione reale InPost bloccata.`,
    );
  }

  if (
    currentOrder.paymentStatus !==
    "PAID"
  ) {
    throw new Error(
      `Ordine ${currentOrder.orderNumber} non più PAID.`,
    );
  }

  if (
    currentOrder.shippingProvider !==
    "INPOST"
  ) {
    throw new Error(
      `Ordine ${currentOrder.orderNumber} non più configurato per InPost.`,
    );
  }

  if (
    currentOrder.shippingStatus !==
    "READY_TO_CREATE"
  ) {
    throw new Error(
      `Ordine ${currentOrder.orderNumber} non più READY_TO_CREATE.`,
    );
  }

  if (
    currentOrder.inpostShipmentId ||
    currentOrder.inpostTrackingNumber
  ) {
    throw new Error(
      `Ordine ${currentOrder.orderNumber} possiede già una spedizione InPost.`,
    );
  }

  /*
   * SOLO DA QUI IN POI
   * può partire la vera POST InPost.
   */
  const response =
    await createInPostShipment(
      prepared.payload,
    );

  const trackingNumber =
    response.trackingNumber
      ?.trim();

  if (!trackingNumber) {
    throw new Error(
      `InPost non ha restituito il tracking number per ordine ${currentOrder.orderNumber}.`,
    );
  }

  /*
   * Salviamo immediatamente il tracking
   * e lo stato della spedizione.
   */
  await prisma.order.update({
    where: {
      id:
        currentOrder.id,
    },

    data: {
      inpostTrackingNumber:
        trackingNumber,

      inpostStatus:
        "CREATED",

      shippingStatus:
        "CREATED",

      shippingCreatedAt:
        new Date(),
    },
  });

  return {
    orderId:
      currentOrder.id,

    orderNumber:
      currentOrder.orderNumber,

    trackingNumber,

    response,
  };
}


function normalizeShippingMethod(
  value:
    | string
    | null,
): Age202ShippingMethod {
  if (
    value ===
    "INPOST_LOCKER"
  ) {
    return "INPOST_LOCKER";
  }

  if (
    value ===
    "INPOST_POINT"
  ) {
    return "INPOST_POINT";
  }

  if (
    value ===
    "HOME_DELIVERY"
  ) {
    throw new Error(
      "HOME_DELIVERY non è ancora supportato dall'integrazione InPost AGE202.",
    );
  }

  throw new Error(
    `Metodo di spedizione AGE202 non valido: ${value ?? "null"}`,
  );
}