type InPostEnvironment = "stage" | "production";

type InPostTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type CachedAccessToken = {
  accessToken: string;
  expiresAt: number;
};

export type InPostPointAddress = {
  country?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
};

export type InPostCoordinates = {
  latitude?: number;
  longitude?: number;
};

export type InPostPoint = {
  id?: string;
  name?: string;
  type?: string;
  distance?: number;
  address?: InPostPointAddress;
  coordinates?: InPostCoordinates;
};

type InPostPointsResponse = {
  count?: number;
  page?: number;
  perPage?: number;
  totalPages?: number;
  items?: InPostPoint[];
};

export type SearchInPostPointsInput = {
  latitude: number;
  longitude: number;
  country?: string;
  maxDistance?: number;
  limit?: number;
  capabilities?: string[];
  type?: "APM" | "PUDO";
};

export type SearchInPostPointsResult = {
  count: number;
  items: InPostPoint[];
};

/**
 * La Shipping API InPost accetta un payload articolato
 * e con varianti differenti a seconda del servizio/mercato.
 *
 * Per ora manteniamo il payload generico:
 * il mapping Order AGE202 -> payload InPost verrà costruito
 * separatamente e validato prima di creare spedizioni reali.
 */
export type CreateInPostShipmentPayload =
  Record<string, unknown>;

export type InPostShipmentResponse = {
  trackingNumber?: string;

  parcels?: Array<{
    references?: Record<
      string,
      unknown
    >;

    parcelNumbers?: Array<{
      carrier?: string;
      id?: string;
      value?: string;
    }>;
  }>;

  routing?: {
    deliveryArea?: string;
    deliveryDepotNumber?: string;
  };

  [key: string]: unknown;
};


export type InPostTrackingLocation = {
  id?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  name?: string | null;
  postalCode?: string | null;
  type?: string | null;
  description?: string | null;

  [key: string]:
    unknown;
};


export type InPostTrackingEvent = {
  eventTimestamp?: string | null;
  eventCode?: string | null;
  status?: string | null;
  eventId?: string | null;
  location?: InPostTrackingLocation | null;

  delivery?: Record<
    string,
    unknown
  > | null;

  shipment?: {
    type?: string | null;

    [key: string]:
      unknown;
  } | null;

  returnToSender?: {
    trackingNumber?: string | null;

    [key: string]:
      unknown;
  } | null;

  newDestination?: Record<
    string,
    unknown
  > | null;

  [key: string]:
    unknown;
};


export type InPostTrackedParcel = {
  trackingNumber?: string | null;
  status?: string | null;

  events?: InPostTrackingEvent[];

  origin?: Record<
    string,
    unknown
  > | null;

  destination?: Record<
    string,
    unknown
  > | null;

  delivery?: Record<
    string,
    unknown
  > | null;

  shipment?: {
    type?: string | null;

    [key: string]:
      unknown;
  } | null;

  returnToSender?: {
    trackingNumber?: string | null;

    [key: string]:
      unknown;
  } | null;

  [key: string]:
    unknown;
};


export type InPostTrackingResponse = {
  parcels?: InPostTrackedParcel[];

  [key: string]:
    unknown;
};

const INPOST_STAGE_API_URL =
  "https://stage-api.inpost-group.com";

const INPOST_PRODUCTION_API_URL =
  "https://api.inpost-group.com";

let cachedToken: CachedAccessToken | null =
  null;


function getInPostEnvironment(): InPostEnvironment {
  const value =
    process.env.INPOST_ENVIRONMENT
      ?.trim()
      .toLowerCase();

  if (!value) {
    return "stage";
  }

  if (
    value === "stage" ||
    value === "production"
  ) {
    return value;
  }

  throw new Error(
    `Invalid INPOST_ENVIRONMENT "${value}". Expected "stage" or "production".`,
  );
}


export function getInPostApiBaseUrl(): string {
  return getInPostEnvironment() ===
    "production"
    ? INPOST_PRODUCTION_API_URL
    : INPOST_STAGE_API_URL;
}


export function getInPostOrganizationId(): string {
  const organizationId =
    process.env
      .INPOST_ORGANIZATION_ID
      ?.trim();

  if (!organizationId) {
    throw new Error(
      "Missing INPOST_ORGANIZATION_ID environment variable.",
    );
  }

  return organizationId;
}


function getInPostClientId(): string {
  const clientId =
    process.env
      .INPOST_CLIENT_ID
      ?.trim();

  if (!clientId) {
    throw new Error(
      "Missing INPOST_CLIENT_ID environment variable.",
    );
  }

  return clientId;
}


function getInPostClientSecret(): string {
  const clientSecret =
    process.env
      .INPOST_CLIENT_SECRET
      ?.trim();

  if (!clientSecret) {
    throw new Error(
      "Missing INPOST_CLIENT_SECRET environment variable.",
    );
  }

  return clientSecret;
}


function isCachedTokenValid(): boolean {
  if (!cachedToken) {
    return false;
  }

  const safetyWindowMs =
    60_000;

  return (
    Date.now() <
    cachedToken.expiresAt -
      safetyWindowMs
  );
}


export async function getInPostAccessToken(): Promise<string> {
  if (
    isCachedTokenValid() &&
    cachedToken
  ) {
    return cachedToken.accessToken;
  }

  const clientId =
    getInPostClientId();

  const clientSecret =
    getInPostClientSecret();

  const tokenUrl =
    `${getInPostApiBaseUrl()}/oauth2/token`;

  const credentials =
    Buffer.from(
      `${clientId}:${clientSecret}`,
      "utf8",
    ).toString(
      "base64",
    );

  const body =
    new URLSearchParams({
      grant_type:
        "client_credentials",
    });

  const response =
    await fetch(
      tokenUrl,
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Basic ${credentials}`,

          "Content-Type":
            "application/x-www-form-urlencoded",

          Accept:
            "application/json",
        },

        body,

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    const responseText =
      await response.text();

    throw new Error(
      [
        "Unable to authenticate with InPost.",
        `HTTP ${response.status} ${response.statusText}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  const tokenResponse =
    (await response.json()) as InPostTokenResponse;

  if (
    !tokenResponse.access_token ||
    !tokenResponse.expires_in ||
    tokenResponse.token_type
      ?.toLowerCase() !==
      "bearer"
  ) {
    throw new Error(
      "InPost returned an invalid OAuth token response.",
    );
  }

  cachedToken = {
    accessToken:
      tokenResponse.access_token,

    expiresAt:
      Date.now() +
      tokenResponse.expires_in *
        1000,
  };

  return cachedToken.accessToken;
}


export async function createInPostAuthorizationHeaders(): Promise<
  Record<string, string>
> {
  const accessToken =
    await getInPostAccessToken();

  return {
    Authorization:
      `Bearer ${accessToken}`,

    Accept:
      "application/json",

    "Content-Type":
      "application/json",
  };
}


export function clearInPostAccessTokenCache(): void {
  cachedToken =
    null;
}


function assertValidCoordinates(
  latitude: number,
  longitude: number,
): void {
  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    throw new Error(
      "Invalid InPost latitude.",
    );
  }

  if (
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      "Invalid InPost longitude.",
    );
  }
}


export async function searchInPostPoints(
  input: SearchInPostPointsInput,
): Promise<SearchInPostPointsResult> {
  assertValidCoordinates(
    input.latitude,
    input.longitude,
  );

  const country =
    input.country
      ?.trim()
      .toUpperCase() ||
    "IT";

  const maxDistance =
    input.maxDistance ??
    10_000;

  const limit =
    input.limit ??
    10;

  if (
    !Number.isFinite(
      maxDistance,
    ) ||
    maxDistance <= 0
  ) {
    throw new Error(
      "Invalid InPost maxDistance.",
    );
  }

  if (
    !Number.isInteger(
      limit,
    ) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new Error(
      "Invalid InPost limit. Expected a value between 1 and 100.",
    );
  }

  const baseUrl =
    getInPostApiBaseUrl();

  const headers =
    await createInPostAuthorizationHeaders();

  const url =
    new URL(
      "/location/v1/points/search-by-location",
      baseUrl,
    );

  url.searchParams.set(
    "relativePoint",
    `${input.latitude},${input.longitude}`,
  );

  url.searchParams.set(
    "maxDistance",
    String(
      maxDistance,
    ),
  );

  url.searchParams.set(
    "limit",
    String(
      limit,
    ),
  );

  url.searchParams.set(
    "perPage",
    String(
      limit,
    ),
  );

  url.searchParams.set(
    "address.country",
    country,
  );

  if (input.type) {
    url.searchParams.set(
      "type",
      input.type,
    );
  }

  if (
    input.capabilities &&
    input.capabilities.length >
      0
  ) {
    url.searchParams.set(
      "capabilities",
      input.capabilities.join(
        ",",
      ),
    );
  }

  const response =
    await fetch(
      url,
      {
        method:
          "GET",

        headers,

        cache:
          "no-store",
      },
    );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      [
        "Unable to search InPost points.",
        `HTTP ${response.status} ${response.statusText}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  let data: InPostPointsResponse;

  try {
    data =
      JSON.parse(
        responseText,
      ) as InPostPointsResponse;
  } catch {
    throw new Error(
      "InPost returned an invalid Location API response.",
    );
  }

  const items =
    Array.isArray(
      data.items,
    )
      ? data.items
      : [];

  return {
    count:
      typeof data.count ===
      "number"
        ? data.count
        : items.length,

    items,
  };
}


/**
 * Recupera una spedizione esistente tramite tracking number.
 *
 * È una chiamata solamente in lettura.
 */
export async function getInPostShipmentByTrackingNumber(
  trackingNumber: string,
): Promise<InPostShipmentResponse> {
  const normalizedTrackingNumber =
    trackingNumber.trim();

  if (
    !normalizedTrackingNumber
  ) {
    throw new Error(
      "Missing InPost tracking number.",
    );
  }

  const organizationId =
    getInPostOrganizationId();

  const baseUrl =
    getInPostApiBaseUrl();

  const headers =
    await createInPostAuthorizationHeaders();

  const url =
    new URL(
      `/shipping/v2/organizations/${encodeURIComponent(
        organizationId,
      )}/shipments/${encodeURIComponent(
        normalizedTrackingNumber,
      )}`,
      baseUrl,
    );

  const response =
    await fetch(
      url,
      {
        method:
          "GET",

        headers,

        cache:
          "no-store",
      },
    );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      [
        "Unable to retrieve InPost shipment.",
        `HTTP ${response.status} ${response.statusText}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  try {
    return JSON.parse(
      responseText,
    ) as InPostShipmentResponse;
  } catch {
    throw new Error(
      "InPost returned an invalid Shipping API response.",
    );
  }
}



/**
 * Recupera lo storico Global Tracking InPost
 * per uno o più tracking number.
 *
 * Chiamata ESCLUSIVAMENTE in lettura.
 *
 * API ufficiale:
 * GET /tracking/v1/parcels
 *
 * Richiede lo scope OAuth:
 * api:tracking:read
 *
 * InPost consente fino a 10 tracking number
 * per singola richiesta.
 */
export async function getInPostTrackingHistory(
  trackingNumbers: string[],
): Promise<InPostTrackingResponse> {
  const normalizedTrackingNumbers =
    trackingNumbers
      .map(
        (trackingNumber) =>
          trackingNumber.trim(),
      )
      .filter(Boolean);

  if (
    normalizedTrackingNumbers.length ===
    0
  ) {
    throw new Error(
      "At least one InPost tracking number is required.",
    );
  }

  if (
    normalizedTrackingNumbers.length >
    10
  ) {
    throw new Error(
      "InPost Tracking API accepts a maximum of 10 tracking numbers per request.",
    );
  }

  const uniqueTrackingNumbers =
    Array.from(
      new Set(
        normalizedTrackingNumbers,
      ),
    );

  const baseUrl =
    getInPostApiBaseUrl();

  const headers =
    await createInPostAuthorizationHeaders();

  const url =
    new URL(
      "/tracking/v1/parcels",
      baseUrl,
    );

  /*
   * L'OpenAPI InPost definisce trackingNumbers
   * come array query parameter.
   * Con serializzazione form/explode, ogni valore
   * viene inviato come parametro ripetuto.
   */
  for (
    const trackingNumber of
    uniqueTrackingNumbers
  ) {
    url.searchParams.append(
      "trackingNumbers",
      trackingNumber,
    );
  }

  const response =
    await fetch(
      url,
      {
        method:
          "GET",

        headers: {
          ...headers,

          "x-inpost-event-version":
            "v1",
        },

        cache:
          "no-store",
      },
    );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      [
        "Unable to retrieve InPost tracking history.",
        `HTTP ${response.status} ${response.statusText}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  let data:
    InPostTrackingResponse;

  try {
    data =
      JSON.parse(
        responseText,
      ) as InPostTrackingResponse;
  } catch {
    throw new Error(
      "InPost returned an invalid Tracking API response.",
    );
  }

  if (
    data.parcels !==
      undefined &&
    !Array.isArray(
      data.parcels,
    )
  ) {
    throw new Error(
      "InPost returned an invalid parcels collection.",
    );
  }

  return data;
}


export type InPostShipmentLabel = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};


/**
 * Recupera l'etichetta PDF di una spedizione InPost già esistente.
 *
 * È una chiamata solamente in lettura:
 * non crea, modifica o cancella spedizioni.
 */
export async function getInPostShipmentLabel(
  trackingNumber: string,
): Promise<InPostShipmentLabel> {
  const normalizedTrackingNumber =
    trackingNumber.trim();

  if (
    !normalizedTrackingNumber
  ) {
    throw new Error(
      "Missing InPost tracking number.",
    );
  }

  const organizationId =
    getInPostOrganizationId();

  const baseUrl =
    getInPostApiBaseUrl();

  const accessToken =
    await getInPostAccessToken();

  const url =
    new URL(
      `/shipping/v2/organizations/${encodeURIComponent(
        organizationId,
      )}/shipments/${encodeURIComponent(
        normalizedTrackingNumber,
      )}/label`,
      baseUrl,
    );

  const response =
    await fetch(
      url,
      {
        method:
          "GET",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          Accept:
            "application/pdf",
        },

        cache:
          "no-store",
      },
    );

  if (!response.ok) {
    const responseText =
      await response.text();

    throw new Error(
      [
        "Unable to retrieve InPost shipment label.",
        `HTTP ${response.status} ${response.statusText}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  const contentType =
    response.headers
      .get(
        "content-type",
      )
      ?.split(
        ";",
      )[0]
      ?.trim()
      .toLowerCase() ||
    "application/pdf";

  if (
    contentType !==
      "application/pdf" &&
    contentType !==
      "application/octet-stream"
  ) {
    const responseText =
      await response.text();

    throw new Error(
      [
        "InPost returned an unexpected shipment label content type.",
        `Content-Type ${contentType}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  const arrayBuffer =
    await response.arrayBuffer();

  if (
    arrayBuffer.byteLength === 0
  ) {
    throw new Error(
      "InPost returned an empty shipment label.",
    );
  }

  return {
    bytes:
      new Uint8Array(
        arrayBuffer,
      ),

    contentType:
      "application/pdf",

    fileName:
      `inpost-${normalizedTrackingNumber}.pdf`,
  };
}


/**
 * CREA REALMENTE una spedizione InPost.
 *
 * IMPORTANTE:
 * questa funzione non deve essere richiamata da script di test casuali.
 *
 * La useremo soltanto quando:
 * - l'ordine AGE202 è pagato;
 * - il punto InPost è stato validato;
 * - mittente e destinatario sono completi;
 * - il pacco è stato determinato;
 * - il Paese è autorizzato.
 */
export async function createInPostShipment(
  payload: CreateInPostShipmentPayload,
): Promise<InPostShipmentResponse> {
  if (
    !payload ||
    typeof payload !==
      "object" ||
    Array.isArray(
      payload,
    )
  ) {
    throw new Error(
      "Invalid InPost shipment payload.",
    );
  }

  const organizationId =
    getInPostOrganizationId();

  const baseUrl =
    getInPostApiBaseUrl();

  const headers =
    await createInPostAuthorizationHeaders();

  const url =
    new URL(
      `/shipping/v2/organizations/${encodeURIComponent(
        organizationId,
      )}/shipments`,
      baseUrl,
    );

  const response =
    await fetch(
      url,
      {
        method:
          "POST",

        headers,

        body:
          JSON.stringify(
            payload,
          ),

        cache:
          "no-store",
      },
    );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      [
        "Unable to create InPost shipment.",
        `HTTP ${response.status} ${response.statusText}`,
        responseText,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  let data: InPostShipmentResponse;

  try {
    data =
      JSON.parse(
        responseText,
      ) as InPostShipmentResponse;
  } catch {
    throw new Error(
      "InPost returned an invalid shipment creation response.",
    );
  }

  if (
    !data.trackingNumber
  ) {
    throw new Error(
      "InPost created a shipment but did not return a tracking number.",
    );
  }

  return data;
}