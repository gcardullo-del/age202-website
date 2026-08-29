import "dotenv/config";

import {
  createInPostAuthorizationHeaders,
  getInPostApiBaseUrl,
} from "@/lib/services/inpost.service";


type InPostOrganization = {
  id?: string;

  parent?: {
    id?: string;
    name?: string;
    status?: string;
  } | null;

  name?: string;
  type?: string;
  status?: string;
  operationalRegion?: string;
};


async function main() {
  try {
    const baseUrl =
      getInPostApiBaseUrl();

    const headers =
      await createInPostAuthorizationHeaders();

    const url =
      new URL(
        "/account/v1/organizations",
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
          `HTTP ${response.status} ${response.statusText}`,
          responseText,
        ]
          .filter(Boolean)
          .join(" "),
      );
    }

    const data =
      JSON.parse(
        responseText,
      ) as InPostOrganization[];

    console.log(
      "✅ InPost Account API successful",
    );

    console.log("");

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {
      console.log(
        "Nessuna organizzazione restituita da InPost.",
      );

      return;
    }

    console.log(
      `Organizzazioni trovate: ${data.length}`,
    );

    console.log("");

    for (
      const [
        index,
        organization,
      ] of data.entries()
    ) {
      console.log(
        `${index + 1}. ${organization.name ?? "Organizzazione InPost"}`,
      );

      console.log(
        `   ID: ${organization.id ?? "n/d"}`,
      );

      console.log(
        `   Tipo: ${organization.type ?? "n/d"}`,
      );

      console.log(
        `   Stato: ${organization.status ?? "n/d"}`,
      );

      console.log(
        `   Operational region: ${organization.operationalRegion ?? "n/d"}`,
      );

      if (organization.parent) {
        console.log(
          `   Parent: ${organization.parent.name ?? "n/d"}`,
        );

        console.log(
          `   Parent ID: ${organization.parent.id ?? "n/d"}`,
        );

        console.log(
          `   Parent status: ${organization.parent.status ?? "n/d"}`,
        );
      }

      console.log("");
    }
  } catch (error) {
    console.error(
      "❌ InPost Account API failed",
    );

    if (
      error instanceof Error
    ) {
      console.error(
        error.message,
      );
    } else {
      console.error(
        error,
      );
    }

    process.exitCode =
      1;
  }
}


void main();