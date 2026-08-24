import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY non trovata nel file .env");
}

export const stripe = new Stripe(stripeSecretKey);