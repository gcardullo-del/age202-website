import "dotenv/config";

import {
  searchInPostPoints,
} from "@/lib/services/inpost.service";

type CountryTest = {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
};

const COUNTRIES: CountryTest[] = [
  {
    code: "IT",
    name: "Italia",
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    code: "FR",
    name: "Francia",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    code: "ES",
    name: "Spagna",
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    code: "PT",
    name: "Portogallo",
    latitude: 38.7223,
    longitude: -9.1393,
  },
  {
    code: "BE",
    name: "Belgio",
    latitude: 50.8503,
    longitude: 4.3517,
  },
  {
    code: "NL",
    name: "Paesi Bassi",
    latitude: 52.3676,
    longitude: 4.9041,
  },
  {
    code: "LU",
    name: "Lussemburgo",
    latitude: 49.6116,
    longitude: 6.1319,
  },
  {
    code: "DE",
    name: "Germania",
    latitude: 52.52,
    longitude: 13.405,
  },
];

async function main() {
  console.log("🌍 Test disponibilità punti InPost per Paese");
  console.log("");

  for (const country of COUNTRIES) {
    try {
      const result =
        await searchInPostPoints({
          latitude:
            country.latitude,
          longitude:
            country.longitude,
          country:
            country.code,
          maxDistance:
            25_000,
          limit:
            5,
        });

      console.log(
        `✅ ${country.code} - ${country.name}`,
      );

      console.log(
        `   Punti restituiti: ${result.items.length}`,
      );

      console.log(
        `   Totale indicato da InPost: ${result.count}`,
      );

      if (
        result.items.length > 0
      ) {
        const first =
          result.items[0];

        console.log(
          `   Primo punto: ${
            first.name ??
            first.id ??
            "n/d"
          }`,
        );

        console.log(
          `   Tipo: ${
            first.type ??
            "n/d"
          }`,
        );

        console.log(
          `   ID: ${
            first.id ??
            "n/d"
          }`,
        );
      }

      console.log("");
    } catch (error) {
      console.log(
        `❌ ${country.code} - ${country.name}`,
      );

      console.log(
        `   ${
          error instanceof Error
            ? error.message
            : String(error)
        }`,
      );

      console.log("");
    }
  }
}

void main();