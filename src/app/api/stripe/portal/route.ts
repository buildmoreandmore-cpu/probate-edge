import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No billing account found" },
      { status: 400 }
    );
  }

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${request.headers.get("origin")}/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
