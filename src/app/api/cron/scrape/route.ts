import { NextRequest, NextResponse } from "next/server";
import { COUNTIES } from "@/lib/types";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];

  for (const county of COUNTIES) {
    try {
      const res = await fetch(new URL("/api/scrape", request.url).toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ county }),
      });
      const data = await res.json();
      results.push({ county, ...data });
    } catch (err) {
      results.push({ county, error: String(err) });
    }
  }

  return NextResponse.json({ results });
}
