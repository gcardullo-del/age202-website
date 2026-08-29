import "dotenv/config";

import {
  stripe,
} from "@/lib/stripe";


async function main() {
  console.log("");
  console.log(
    "======================================",
  );

  console.log(
    " AGE202 STRIPE MODE SAFETY CHECK",
  );

  console.log(
    "======================================",
  );

  console.log("");

  console.log(
    `CHECKOUT_ENABLED = ${
      process.env.CHECKOUT_ENABLED ??
      "(non impostato)"
    }`,
  );

  console.log(
    `INPOST_SHIPPING_ENABLED = ${
      process.env.INPOST_SHIPPING_ENABLED ??
      "(non impostato)"
    }`,
  );

  console.log("");

  console.log(
    "🔎 Verifica modalità Stripe...",
  );

  /*
   * balance.retrieve() è una richiesta
   * esclusivamente in lettura.
   *
   * NON crea pagamenti.
   * NON crea Checkout Session.
   * NON modifica l'account.
   */
  const balance =
    await stripe.balance.retrieve();

  console.log("");

  console.log(
    `Stripe livemode: ${
      balance.livemode
        ? "TRUE"
        : "FALSE"
    }`,
  );

  if (
    balance.livemode
  ) {
    console.error("");
    console.error(
      "❌ ATTENZIONE: il progetto sta utilizzando Stripe LIVE.",
    );

    console.error(
      "Non eseguiremo alcun test Checkout finché non passeremo alle credenziali TEST.",
    );

    process.exitCode =
      1;

    return;
  }

  console.log("");
  console.log(
    "✅ STRIPE TEST MODE CONFERMATO",
  );

  console.log(
    "✅ Nessun pagamento effettuato.",
  );

  console.log(
    "✅ Nessuna Checkout Session creata.",
  );

  console.log(
    "✅ Nessuna modifica effettuata su Stripe.",
  );

  console.log("");

  if (
    process.env
      .INPOST_SHIPPING_ENABLED ===
    "true"
  ) {
    console.error(
      "❌ INPOST_SHIPPING_ENABLED è TRUE.",
    );

    console.error(
      "Rimettilo a false prima di continuare.",
    );

    process.exitCode =
      1;

    return;
  }

  console.log(
    "🔐 InPost Shipping resta disabilitato.",
  );

  console.log("");
  console.log(
    "🎉 Ambiente sicuro per il prossimo test Stripe.",
  );
}


void main().catch(
  (
    error,
  ) => {
    console.error("");
    console.error(
      "❌ STRIPE SAFETY CHECK FALLITO",
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode =
      1;
  },
);