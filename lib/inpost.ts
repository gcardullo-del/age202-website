type InPostEnvironment =
  | "stage"
  | "production";

type InPostAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type CachedInPostToken = {
  accessToken: string;
  expiresAt: number;
};

const inpostEnvironment =
  (process.env.INPOST_ENVIRONMENT ??
    "stage") as InPostEnvironment;

const clientId =
  process.env.INPOST_CLIENT_ID;

const clientSecret =
  process.env.INPOST_CLIENT_SECRET;

const organizationId =
  process.env.INPOST_ORGANIZATION_ID;

const scope =
  process.env.INPOST_SCOPE ??
  [
    "openid",
    "api:points:read",
    "api:shipments:read",
    "api:shipments:write",
    "api:tracking:read",
  ].join(" ");

const baseUrl =
  inpostEnvironment === "production"
    ? "https://api.inpost-group.com"
    : "https://stage-api.inpost-group.com";

let cachedToken: CachedInPostToken | null =
  null;

function ensureServerConfiguration() {
  if (!clientId) {
    throw new Error(
      "INPOST_CLIENT_ID non configurato nel file .env",
    );
  }

  if (!clientSecret) {
    throw new Error(
      "INPOST_CLIENT_SECRET non configurato nel file .env",
    );
  }

  if (!organizationId) {
    throw new Error(
      "INPOST_ORGANIZATION_ID non configurato nel file .env",
    );
  }
}

export function getInPostOrganizationId() {
  ensureServerConfiguration();

  return organizationId as string;
}

export function getInPostBaseUrl() {
  return baseUrl;
}

export async function getInPostAccessToken() {
  ensureServerConfiguration();

  const now = Date.now();

  /*
   * Manteniamo il token in memoria e lo rinnoviamo
   * circa 30 secondi prima della scadenza.
   */
  if (
    cachedToken &&
    cachedToken.expiresAt > now + 30_000
  ) {
    return cachedToken.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope,
    client_id: clientId as string,
    client_secret: clientSecret as string,
  });

  const response = await fetch(
    `${baseUrl}/oauth2/token`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body,

      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      [
        "Impossibile ottenere il token InPost.",
        `HTTP ${response.status}`,
        errorText,
      ].join(" "),
    );
  }

  const data =
    (await response.json()) as InPostAccessTokenResponse;

  if (!data.access_token) {
    throw new Error(
      "InPost non ha restituito access_token.",
    );
  }

  cachedToken = {
    accessToken: data.access_token,

    expiresAt:
      Date.now() +
      data.expires_in * 1000,
  };

  return data.access_token;
}

export async function inpostFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken =
    await getInPostAccessToken();

  const response = await fetch(
    `${baseUrl}${path}`,
    {
      ...init,

      headers: {
        Accept: "application/json",

        Authorization:
          `Bearer ${accessToken}`,

        ...init.headers,
      },

      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      [
        `Errore API InPost su ${path}.`,
        `HTTP ${response.status}`,
        errorText,
      ].join(" "),
    );
  }

  if (
    response.status === 204
  ) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}