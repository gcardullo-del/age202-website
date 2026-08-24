import Stripe from "stripe";

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY?.trim();

export const isStripeConfigured =
  Boolean(stripeSecretKey);

/**
 * Durante la fase in cui il checkout AGE202 è disabilitato
 * permettiamo all'applicazione di compilare anche senza
 * STRIPE_SECRET_KEY configurata.
 *
 * Nessun pagamento può partire dal checkout pubblico perché
 * /api/stripe/checkout è già protetto da CHECKOUT_ENABLED.
 */
export const stripe = new Stripe(
  stripeSecretKey ??
    "sk_test_age202_checkout_temporarily_disabled",
);