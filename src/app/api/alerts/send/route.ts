import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  // Get all alert settings with email enabled
  const { data: alertSettings, error: alertError } = await supabase
    .from("alert_settings")
    .select("*, profiles(email)")
    .eq("email_enabled", true);

  if (alertError || !alertSettings) {
    return NextResponse.json({ error: "Failed to fetch alert settings" }, { status: 500 });
  }

  // Get leads from today that haven't been alerted
  const today = new Date().toISOString().split("T")[0];
  const { data: newLeads } = await supabase
    .from("leads")
    .select("*")
    .gte("created_at", `${today}T00:00:00`)
    .not("deal_score", "is", null)
    .order("deal_score", { ascending: false });

  if (!newLeads || newLeads.length === 0) {
    return NextResponse.json({ message: "No new leads to alert on", sent: 0 });
  }

  let sent = 0;

  for (const settings of alertSettings) {
    const matchingLeads = newLeads.filter((lead) => {
      const matchesScore = lead.deal_score >= settings.min_deal_score;
      const matchesCounty =
        settings.counties.length === 0 || settings.counties.includes(lead.county);
      return matchesScore && matchesCounty;
    });

    if (matchingLeads.length === 0) continue;

    const userEmail = (settings as Record<string, unknown>).profiles as { email: string } | null;
    if (!userEmail?.email) continue;

    const leadSummary = matchingLeads
      .slice(0, 10)
      .map(
        (l) =>
          `Score: ${l.deal_score} | ${l.property_address || "Address TBD"} | ${l.county} County | Equity: $${(l.estimated_equity || 0).toLocaleString()}`
      )
      .join("\n");

    try {
      await resend.emails.send({
        from: "ProbateEdge <alerts@probateedge.com>",
        to: userEmail.email,
        subject: `${matchingLeads.length} New Probate Lead${matchingLeads.length > 1 ? "s" : ""} - ProbateEdge`,
        text: `You have ${matchingLeads.length} new probate lead${matchingLeads.length > 1 ? "s" : ""} matching your criteria:\n\n${leadSummary}\n\nView all leads: https://probateedge.com/dashboard`,
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send alert to ${userEmail.email}:`, err);
    }
  }

  return NextResponse.json({ message: `Sent ${sent} alerts`, sent });
}
