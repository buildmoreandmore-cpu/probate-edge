"use client";

import Link from "next/link";
import { Lead } from "@/lib/types";
import { getScoreColor, getScoreDot, formatCurrency, formatDate } from "@/lib/utils";

export default function LeadCard({ lead }: { lead: Lead }) {
  const scoreColor = getScoreColor(lead.deal_score ?? 0);
  const dotColor = getScoreDot(lead.deal_score ?? 0);

  return (
    <Link href={`/leads/${lead.id}`}>
      <div className="bg-bg-surface border border-border rounded-lg p-4 hover:border-accent/30 transition-colors cursor-pointer group">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              {lead.deal_score !== null && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-bg font-mono text-sm font-bold ${scoreColor}`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  {lead.deal_score}
                </span>
              )}
              <span className="font-mono text-sm text-text-primary truncate group-hover:text-accent transition-colors">
                {lead.property_address || "Address pending"}
              </span>
            </div>
            <div className="text-text-muted text-xs font-mono">
              {lead.county} County &middot; Filed {formatDate(lead.filing_date)}
              {lead.case_number && ` \u00b7 ${lead.case_number}`}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-text-muted">
              {lead.estimated_equity !== null && (
                <span>
                  Equity:{" "}
                  <span className="text-accent font-bold">
                    {formatCurrency(lead.estimated_equity)}
                  </span>
                </span>
              )}
              {lead.assessed_value !== null && (
                <span>Assessed: {formatCurrency(lead.assessed_value)}</span>
              )}
              {lead.estimated_market_value !== null && (
                <span>Market: {formatCurrency(lead.estimated_market_value)}</span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <span
              className={`text-xs font-mono px-2 py-1 rounded border ${
                lead.status === "new"
                  ? "border-accent/20 text-accent bg-accent/5"
                  : lead.status === "contacted"
                  ? "border-score-mid/20 text-score-mid bg-score-mid/5"
                  : lead.status === "saved"
                  ? "border-blue-500/20 text-blue-400 bg-blue-500/5"
                  : "border-border text-text-muted"
              }`}
            >
              {lead.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
