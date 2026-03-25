import Anthropic from "@anthropic-ai/sdk";
import { Lead } from "./types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function scoreLead(
  lead: Partial<Lead>
): Promise<{ score: number; reason: string }> {
  const prompt = `You are a real estate investment analyst. Score this probate lead from 0–100 based on deal attractiveness.

Consider:
- Estimated equity (higher = better)
- Days since filing (fresher = better)
- Property type (SFR preferred)
- Assessed value vs market value gap
- Any red flags

Lead data:
- County: ${lead.county}
- Decedent: ${lead.decedent_name}
- Filing Date: ${lead.filing_date}
- Property Address: ${lead.property_address || "Unknown"}
- Assessed Value: ${lead.assessed_value ? `$${lead.assessed_value.toLocaleString()}` : "Unknown"}
- Estimated Market Value: ${lead.estimated_market_value ? `$${lead.estimated_market_value.toLocaleString()}` : "Unknown"}
- Mortgage Balance Estimate: ${lead.mortgage_balance_estimate ? `$${lead.mortgage_balance_estimate.toLocaleString()}` : "Unknown"}
- Estimated Equity: ${lead.estimated_equity ? `$${lead.estimated_equity.toLocaleString()}` : "Unknown"}

Return ONLY valid JSON: { "score": number, "reason": "string (1 sentence)" }`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const json = JSON.parse(text);
  return { score: json.score, reason: json.reason };
}
