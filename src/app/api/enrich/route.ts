import { createServiceClient } from "@/lib/supabase/server";
import { COUNTY_URLS, County } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) {
    return NextResponse.json(
      { error: "FIRECRAWL_API_KEY not configured" },
      { status: 500 }
    );
  }

  const supabase = await createServiceClient();

  // Get leads that need enrichment (have address but no assessed value)
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .not("property_address", "is", null)
    .is("assessed_value", null)
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!leads || leads.length === 0) {
    return NextResponse.json({ message: "No leads to enrich", enriched: 0 });
  }

  let enriched = 0;

  for (const lead of leads) {
    try {
      const countyUrl = COUNTY_URLS[lead.county as County];
      if (!countyUrl) continue;

      const response = await fetch("https://api.firecrawl.dev/v1/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({
          url: countyUrl,
          prompt: `Search for property at ${lead.property_address}. Extract: assessed_value (number), estimated_market_value (number), owner_name, tax_status, property_class, acreage. Return as JSON object.`,
          schema: {
            type: "object",
            properties: {
              assessed_value: { type: "number" },
              estimated_market_value: { type: "number" },
              owner_name: { type: "string" },
              tax_status: { type: "string" },
              property_class: { type: "string" },
              acreage: { type: "number" },
            },
          },
        }),
      });

      const result = await response.json();

      if (result.data) {
        const assessedValue = result.data.assessed_value || null;
        const marketValue = result.data.estimated_market_value || null;
        const estimatedEquity =
          marketValue && lead.mortgage_balance_estimate !== null
            ? marketValue - (lead.mortgage_balance_estimate || 0)
            : null;

        await supabase
          .from("leads")
          .update({
            assessed_value: assessedValue,
            estimated_market_value: marketValue,
            estimated_equity: estimatedEquity,
            county_url: countyUrl,
          })
          .eq("id", lead.id);

        enriched++;
      }
    } catch (err) {
      console.error(`Failed to enrich lead ${lead.id}:`, err);
    }
  }

  return NextResponse.json({ message: `Enriched ${enriched} leads`, enriched });
}
