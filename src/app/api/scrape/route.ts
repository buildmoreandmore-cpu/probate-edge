import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const county = body.county || "Cobb";

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) {
    return NextResponse.json(
      { error: "FIRECRAWL_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    // Firecrawl extract endpoint for probate court scraping
    const response = await fetch("https://api.firecrawl.dev/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url: "https://probateonline.cobbcounty.org/BenchmarkWeb/Home.aspx/Search",
        prompt: `Search the ${county} County probate court filing index for all new estate cases filed in the last 7 days. For each case extract: decedent_name, case_number, filing_date (YYYY-MM-DD), executor_name, executor_address, and any associated property_address. Return as a JSON array of objects.`,
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              decedent_name: { type: "string" },
              case_number: { type: "string" },
              filing_date: { type: "string" },
              executor_name: { type: "string" },
              executor_address: { type: "string" },
              property_address: { type: "string" },
            },
          },
        },
      }),
    });

    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
      return NextResponse.json({
        message: "No cases extracted",
        raw: result,
        inserted: 0,
      });
    }

    const supabase = await createServiceClient();
    let inserted = 0;

    for (const record of result.data) {
      // Check for duplicate by case number
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("case_number", record.case_number)
        .maybeSingle();

      if (existing) continue;

      const { error } = await supabase.from("leads").insert({
        county,
        decedent_name: record.decedent_name,
        case_number: record.case_number,
        filing_date: record.filing_date,
        executor_name: record.executor_name || null,
        executor_address: record.executor_address || null,
        property_address: record.property_address || null,
        status: "new",
      });

      if (!error) inserted++;
    }

    return NextResponse.json({
      message: `Scraped ${county} County`,
      extracted: result.data.length,
      inserted,
    });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: "Scrape failed", details: String(err) },
      { status: 500 }
    );
  }
}
