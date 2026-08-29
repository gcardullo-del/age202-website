import type {
  CreateInPostShipmentPayload,
} from "@/lib/services/inpost.service";


export type InPostOriginMethod =
  | "APM"
  | "PUDO";

export type Age202ShippingMethod =
  | "INPOST_LOCKER"
  | "INPOST_POINT"
  | "HOME_DELIVERY";

export type InPostShipmentOrder = {
  orderNumber: string;

  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;

  shippingName: string | null;
  shippingCountry: string | null;

  shippingMethod: Age202ShippingMethod | null;

  inpostPointId: string | null;
  inpostPointName: string | null;
  inpostPointAddress: string | null;
};

export type InPostParcelInput = {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
};

export type BuildInPostShipmentPayloadInput = {
  order: InPostShipmentOrder;

  parcel: InPostParcelInput;

  originMethod:
    InPostOriginMethod;
};


type InPostSender = {
  companyName: string;
  email: string;
  phone: string;
  countryCode: string;
};


function getRequiredEnv(
  key: string,
): string {
  const value =
    process.env[key]?.trim();

  if (!value) {
    throw new Error(
      `Missing ${key} environment variable.`,
    );
  }

  return value;
}


function getSender(): InPostSender {
  return {
    companyName:
      getRequiredEnv(
        "INPOST_SENDER_NAME",
      ),

    email:
      getRequiredEnv(
        "INPOST_SENDER_EMAIL",
      ),

    phone:
      getRequiredEnv(
        "INPOST_SENDER_PHONE",
      ),

    countryCode:
      getRequiredEnv(
        "INPOST_SENDER_COUNTRY",
      ).toUpperCase(),
  };
}


function splitRecipientName(
  fullName: string,
): {
  firstName: string;
  lastName: string;
} {
  const normalized =
    fullName
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  const parts =
    normalized.split(" ");

  if (
    parts.length < 2
  ) {
    throw new Error(
      "Il destinatario deve avere nome e cognome.",
    );
  }

  const lastName =
    parts.pop();

  if (!lastName) {
    throw new Error(
      "Cognome destinatario mancante.",
    );
  }

  return {
    firstName:
      parts.join(" "),

    lastName,
  };
}


function assertPositiveNumber(
  value: number,
  field: string,
): void {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(
      `Invalid ${field}.`,
    );
  }
}


function validateParcel(
  parcel: InPostParcelInput,
): void {
  assertPositiveNumber(
    parcel.lengthCm,
    "parcel.lengthCm",
  );

  assertPositiveNumber(
    parcel.widthCm,
    "parcel.widthCm",
  );

  assertPositiveNumber(
    parcel.heightCm,
    "parcel.heightCm",
  );

  assertPositiveNumber(
    parcel.weightKg,
    "parcel.weightKg",
  );
}


function getDestinationMethod(
  shippingMethod:
    Age202ShippingMethod | null,
): "APM" | "PUDO" {
  if (
    shippingMethod ===
    "INPOST_LOCKER"
  ) {
    return "APM";
  }

  if (
    shippingMethod ===
    "INPOST_POINT"
  ) {
    return "PUDO";
  }

  throw new Error(
    "L'ordine non utilizza un metodo InPost point/locker valido.",
  );
}


export function buildInPostShipmentPayload({
  order,
  parcel,
  originMethod,
}: BuildInPostShipmentPayloadInput): CreateInPostShipmentPayload {
  validateParcel(
    parcel,
  );

  const sender =
    getSender();

  const recipientName =
    order.shippingName ??
    order.customerName;

  if (!recipientName) {
    throw new Error(
      "Nome destinatario mancante nell'ordine.",
    );
  }

  const {
    firstName,
    lastName,
  } =
    splitRecipientName(
      recipientName,
    );

  if (
    !order.customerEmail
      ?.trim()
  ) {
    throw new Error(
      "Email destinatario mancante nell'ordine.",
    );
  }

  if (
    !order.customerPhone
      ?.trim()
  ) {
    throw new Error(
      "Telefono destinatario mancante nell'ordine.",
    );
  }

  if (
    !order.shippingCountry
      ?.trim()
  ) {
    throw new Error(
      "Paese di spedizione mancante nell'ordine.",
    );
  }

  if (
    !order.inpostPointId
      ?.trim()
  ) {
    throw new Error(
      "Punto InPost mancante nell'ordine.",
    );
  }

  const destinationMethod =
    getDestinationMethod(
      order.shippingMethod,
    );

  /*
   * ATTENZIONE:
   * questa funzione costruisce soltanto il payload.
   * Non effettua alcuna chiamata POST verso InPost.
   */
  return {
    sender: {
      companyName:
        sender.companyName,

      email:
        sender.email,

      phone:
        sender.phone,
    },

    recipient: {
      firstName,
      lastName,

      email:
        order.customerEmail.trim(),

      phone:
        order.customerPhone.trim(),
    },

    origin: {
      countryCode:
        sender.countryCode,

      shippingMethod:
        originMethod,
    },

    destination: {
      countryCode:
        order.shippingCountry
          .trim()
          .toUpperCase(),

      shippingMethod:
        destinationMethod,

      pointId:
        order.inpostPointId.trim(),
    },

    parcels: [
      {
        type:
          "STANDARD",

        dimensions: {
          length:
            String(
              parcel.lengthCm,
            ),

          width:
            String(
              parcel.widthCm,
            ),

          height:
            String(
              parcel.heightCm,
            ),

          unit:
            "cm",
        },

        weight: {
          amount:
            String(
              parcel.weightKg,
            ),

          unit:
            "kg",
        },
      },
    ],
  };
}