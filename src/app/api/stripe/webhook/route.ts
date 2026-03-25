import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();

      if (profile) {
        const status = subscription.status;
        if (status === "canceled" || status === "unpaid") {
          await supabase
            .from("profiles")
            .update({ plan: "free" })
            .eq("id", profile.id);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ plan: "free", stripe_subscription_id: null })
          .eq("id", profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
