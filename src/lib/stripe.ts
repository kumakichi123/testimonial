import Stripe from "stripe";

const apiVersion: Stripe.LatestApiVersion = "2024-06-20";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }

  stripeClient = new Stripe(secretKey, { apiVersion });
  return stripeClient;
}
