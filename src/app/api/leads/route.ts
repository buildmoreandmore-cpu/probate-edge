import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServiceClient();
  const { searchParams } = new URL(request.url);

  const county = searchParams.get("county");
  const minScore = searchParams.get("min_score");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "deal_score";
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("leads")
    .select("*", { count: "exact" });

  if (county) query = query.eq("county", county);
  if (status) query = query.eq("status", status);
  if (minScore) query = query.gte("deal_score", parseInt(minScore));

  if (sort === "deal_score") {
    query = query.order("deal_score", { ascending: false, nullsFirst: false });
  } else if (sort === "filing_date") {
    query = query.order("filing_date", { ascending: false });
  } else if (sort === "estimated_equity") {
    query = query.order("estimated_equity", { ascending: false, nullsFirst: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data, total: count });
}
