import "dotenv/config";

import {
  searchInPostPoints,
} from "@/lib/services/inpost.service";


async function main() {
  try {
    const result =
      await searchInPostPoints({
        latitude: 41.9028,
        longitude: 12.4964,
        country: "IT",
        maxDistance: 10_000,
        limit: 10,
      });

    console.log(
      "✅ InPost Location service successful",
    );

    console.log(
      `Totale indicato da InPost: ${result.count}`,
    );

    console.log(
      `Risultati ricevuti: ${result.items.length}`,
    );

    console.log("");

    for (
      const [
        index,
        point,
      ] of result.items.entries()
    ) {
      const address = [
        point.address?.street,
        point.address?.buildingNumber,
        point.address?.postalCode,
        point.address?.city,
      ]
        .filter(Boolean)
        .join(" ");

      console.log(
        `${index + 1}. ${
          point.name ??
          point.id ??
          "Punto InPost"
        }`,
      );

      if (point.type) {
        console.log(
          `   Tipo: ${point.type}`,
        );
      }

      if (address) {
        console.log(
          `   Indirizzo: ${address}`,
        );
      }

      if (
        typeof point.distance ===
        "number"
      ) {
        console.log(
          `   Distanza: ${point.distance} m`,
        );
      }

      if (point.id) {
        console.log(
          `   ID: ${point.id}`,
        );
      }

      console.log("");
    }
  } catch (error) {
    console.error(
      "❌ InPost Location service failed",
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

    process.exitCode = 1;
  }
}


void main();