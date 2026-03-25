"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { DEMO_LEADS } from "@/lib/demo-data";
import { COUNTIES } from "@/lib/types";
import LeadCard from "@/components/LeadCard";

type SortField = "deal_score" | "filing_date" | "estimated_equity";

export default function DashboardPage() {
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortField>("deal_score");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = useMemo(() => {
    let leads = [...DEMO_LEADS];

    if (countyFilter !== "all") {
      leads = leads.filter((l) => l.county === countyFilter);
    }
    if (statusFilter !== "all") {
      leads = leads.filter((l) => l.status === statusFilter);
    }
    if (minScore > 0) {
      leads = leads.filter((l) => (l.deal_score ?? 0) >= minScore);
    }

    leads.sort((a, b) => {
      if (sortBy === "deal_score") return (b.deal_score ?? 0) - (a.deal_score ?? 0);
      if (sortBy === "estimated_equity")
        return (b.estimated_equity ?? 0) - (a.estimated_equity ?? 0);
      return new Date(b.filing_date).getTime() - new Date(a.filing_date).getTime();
    });

    return leads;
  }, [countyFilter, minScore, sortBy, statusFilter]);

  const stats = useMemo(() => {
    const total = DEMO_LEADS.length;
    const avgScore =
      DEMO_LEADS.reduce((sum, l) => sum + (l.deal_score ?? 0), 0) / total;
    const highScore = DEMO_LEADS.filter((l) => (l.deal_score ?? 0) >= 75).length;
    const totalEquity = DEMO_LEADS.reduce(
      (sum, l) => sum + (l.estimated_equity ?? 0),
      0
    );
    return { total, avgScore: Math.round(avgScore), highScore, totalEquity };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "TOTAL LEADS", value: stats.total, accent: false },
          { label: "AVG SCORE", value: stats.avgScore, accent: false },
          { label: "HIGH SCORE (75+)", value: stats.highScore, accent: true },
          {
            label: "TOTAL EQUITY",
            value: `$${(stats.totalEquity / 1000000).toFixed(1)}M`,
            accent: true,
          },
        ].map((stat, i) => (
          <div key={i} className="bg-bg-surface border border-border rounded-lg p-4">
            <div className="text-text-muted text-xs font-mono mb-1">{stat.label}</div>
            <div
              className={`font-mono font-bold text-xl ${
                stat.accent ? "text-accent" : "text-text-primary"
              }`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={countyFilter}
          onChange={(e) => setCountyFilter(e.target.value)}
          className="bg-bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value="all">ALL COUNTIES</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value="all">ALL STATUS</option>
          <option value="new">NEW</option>
          <option value="contacted">CONTACTED</option>
          <option value="saved">SAVED</option>
          <option value="skipped">SKIPPED</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortField)}
          className="bg-bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value="deal_score">SORT: SCORE</option>
          <option value="filing_date">SORT: NEWEST</option>
          <option value="estimated_equity">SORT: EQUITY</option>
        </select>

        <div className="flex items-center gap-2">
          <span className="text-text-muted text-xs font-mono">MIN SCORE:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-24 accent-accent"
          />
          <span className="text-accent text-xs font-mono font-bold w-6">{minScore}</span>
        </div>

        <div className="ml-auto text-text-muted text-xs font-mono">
          {filteredLeads.length} leads
        </div>
      </div>

      {/* Lead Feed */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 text-text-muted font-mono text-sm">
            No leads match your filters. Try adjusting the criteria.
          </div>
        ) : (
          filteredLeads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
}
