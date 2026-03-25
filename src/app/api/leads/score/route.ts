import { createServiceClient } from "@/lib/supabase/server";
import { scoreLead } from "@/lib/scoring";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .is("deal_score", null)
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!leads || leads.length === 0) {
    return NextResponse.json({ message: "No leads to score", scored: 0 });
  }

  let scored = 0;
  for (const lead of leads) {
    try {
      const result = await scoreLead(lead);
      await supabase
        .from("leads")
        .update({
          deal_score: result.score,
          deal_score_reason: result.reason,
        })
        .eq("id", lead.id);
      scored++;
    } catch (err) {
      console.error(`Failed to score lead ${lead.id}:`, err);
    }
  }

  return NextResponse.json({ message: `Scored ${scored} leads`, scored });
}
