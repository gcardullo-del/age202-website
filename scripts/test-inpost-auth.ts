import "dotenv/config";

import {
  getInPostAccessToken,
} from "@/lib/services/inpost.service";


async function main() {
  try {
    await getInPostAccessToken();

    console.log("✅ InPost authentication successful");
  } catch (error) {
    console.error("❌ InPost authentication failed");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  }
}


void main();