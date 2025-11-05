import Stripe from "stripe";

const DEFAULT_VERSION: Stripe.StripeConfig["apiVersion"] = "2023-08-16";
const apiVersion =
  (process.env.STRIPE_API_VERSION as Stripe.StripeConfig["apiVersion"] | undefined)
  ?? DEFAULT_VERSION;

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not set.");

  stripeClient = new Stripe(secretKey, { apiVersion });
  return stripeClient;
}
