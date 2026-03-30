"use client";

import { useParams, useRouter } from "next/navigation";
import { DEMO_LEADS } from "@/lib/demo-data";
import { getScoreColor, getScoreDot, formatCurrency, formatDate } from "@/lib/utils";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lead = DEMO_LEADS.find((l) => l.id === params.id);

  if (!lead) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-text-muted font-mono">Lead not found.</p>
      </div>
    );
  }

  const scoreColor = getScoreColor(lead.deal_score ?? 0);
  const dotColor = getScoreDot(lead.deal_score ?? 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <button
        onClick={() => router.back()}
        className="text-text-muted text-xs font-mono hover:text-accent transition-colors mb-6"
      >
        &larr; BACK TO LEADS
      </button>

      {/* Header */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-mono font-bold text-xl mb-1">
              {lead.property_address || "Address pending"}
            </h1>
            <p className="text-text-muted text-sm font-mono">
              {lead.county} County &middot; Case {lead.case_number} &middot; Filed{" "}
              {formatDate(lead.filing_date)}
            </p>
          </div>
          {lead.deal_score !== null && (
            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-hover font-mono text-2xl font-bold ${scoreColor}`}
              >
                <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                {lead.deal_score}
              </div>
              <div className="text-text-muted text-xs font-mono mt-1">DEAL SCORE</div>
            </div>
          )}
        </div>

        {lead.deal_score_reason && (
          <div className="bg-bg-hover border border-border rounded p-3">
            <div className="text-text-muted text-xs font-mono mb-1">AI ANALYSIS</div>
            <p className="text-text-primary text-sm">{lead.deal_score_reason}</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Property Data */}
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h2 className="font-mono font-bold text-sm text-text-muted mb-4">PROPERTY DATA</h2>
          <div className="space-y-3">
            {[
              { label: "Assessed Value", value: lead.assessed_value ? formatCurrency(lead.assessed_value) : "—" },
              {
                label: "Est. Market Value",
                value: lead.estimated_market_value ? formatCurrency(lead.estimated_market_value) : "—",
              },
              {
                label: "Mortgage Balance",
                value: lead.mortgage_balance_estimate !== null
                  ? lead.mortgage_balance_estimate === 0
                    ? "Free & Clear"
                    : formatCurrency(lead.mortgage_balance_estimate)
                  : "—",
              },
              {
                label: "Estimated Equity",
                value: lead.estimated_equity ? formatCurrency(lead.estimated_equity) : "—",
                accent: true,
              },
              { label: "Parcel ID", value: lead.parcel_id || "—" },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-text-muted text-xs font-mono">{row.label}</span>
                <span
                  className={`font-mono text-sm font-bold ${
                    row.accent ? "text-accent" : "text-text-primary"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Executor Info */}
        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h2 className="font-mono font-bold text-sm text-text-muted mb-4">CASE INFO</h2>
          <div className="space-y-3">
            {[
              { label: "Decedent", value: lead.decedent_name },
              { label: "Executor", value: lead.executor_name || "—" },
              { label: "Executor Address", value: lead.executor_address || "—" },
              { label: "Case Number", value: lead.case_number },
              { label: "Filing Date", value: new Date(lead.filing_date).toLocaleDateString() },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-start gap-4">
                <span className="text-text-muted text-xs font-mono shrink-0">{row.label}</span>
                <span className="font-mono text-sm text-text-primary text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="bg-accent text-bg font-mono font-bold px-6 py-2.5 rounded hover:bg-accent-dim transition-colors text-sm">
          MARK CONTACTED
        </button>
        <button className="border border-border text-text-primary font-mono px-6 py-2.5 rounded hover:border-accent/30 transition-colors text-sm">
          SAVE LEAD
        </button>
        <button className="border border-border text-text-muted font-mono px-6 py-2.5 rounded hover:border-score-low/30 hover:text-score-low transition-colors text-sm">
          SKIP
        </button>
      </div>
    </div>
  );
}
