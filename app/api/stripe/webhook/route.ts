import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

const relevantEvents = new Set<Stripe.Event["type"]>([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase service credentials are not configured.");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

async function updateCompany(companyId: string, updates: Record<string, any>) {
  const supabaseAdmin = getAdminClient();
  const { error } = await supabaseAdmin.from("companies").update(updates).eq("id", companyId);
  if (error) {
    throw new Error(`Failed to update company ${companyId}: ${error.message}`);
  }
}

async function getCompanyIdFromSubscription(subscription: Stripe.Subscription) {
  if (subscription.metadata?.company_id) {
    return subscription.metadata.company_id;
  }

  if (subscription.customer) {
    const supabaseAdmin = getAdminClient();
    const { data, error } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("stripe_customer_id", subscription.customer as string)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to look up company for customer ${subscription.customer}: ${error.message}`);
    }

    if (data?.id) {
      return data.id as string;
    }
  }

  return null;
}

function unixToIso(timestamp: number | null | undefined) {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set." },
      { status: 500 }
    );
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe] webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const companyId = session.metadata?.company_id;
        if (!companyId) {
          throw new Error("checkout.session.completed missing company_id metadata.");
        }

        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

        if (!subscriptionId || !customerId) {
          throw new Error("checkout.session.completed missing subscription or customer id.");
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id ?? null;

        await updateCompany(companyId, {
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          subscription_price_id: priceId,
          subscription_status: subscription.status,
          trial_ends_at: unixToIso(subscription.trial_end),
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const companyId = await getCompanyIdFromSubscription(subscription);
        if (!companyId) {
          throw new Error("customer.subscription.updated missing company mapping.");
        }

        const priceId = subscription.items.data[0]?.price.id ?? null;

        await updateCompany(companyId, {
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_price_id: priceId,
          trial_ends_at: unixToIso(subscription.trial_end),
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const companyId = await getCompanyIdFromSubscription(subscription);
        if (!companyId) {
          throw new Error("customer.subscription.deleted missing company mapping.");
        }

        await updateCompany(companyId, {
          subscription_status: "canceled",
          stripe_subscription_id: null,
          trial_ends_at: null,
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
        if (!subscriptionId) {
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const companyId = await getCompanyIdFromSubscription(subscription);
        if (!companyId) {
          throw new Error("invoice.payment_failed missing company mapping.");
        }

        await updateCompany(companyId, {
          subscription_status: "past_due",
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[stripe] webhook handler failed for ${event.type}`, error);
    return NextResponse.json({ error: "Webhook handler error." }, { status: 500 });
  }
}
