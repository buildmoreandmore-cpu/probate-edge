import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { PLANS, PlanKey } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as PlanKey;

  if (!plan || !PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.create({
    customer_email: user.email,
    mode: "subscription",
    line_items: [
      {
        price: PLANS[plan].stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: `${request.headers.get("origin")}/dashboard?upgraded=true`,
    cancel_url: `${request.headers.get("origin")}/pricing`,
    metadata: {
      user_id: user.id,
      plan,
    },
    subscription_data: {
      trial_period_days: 7,
    },
  });

  return NextResponse.json({ url: session.url });
}
