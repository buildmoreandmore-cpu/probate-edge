"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { PLANS } from "@/lib/types";

export default function AccountPage() {
  const [loading, setLoading] = useState(false);

  // Demo state — in production, fetch from Supabase
  const currentPlan = "solo";
  const email = "investor@example.com";

  async function handleManageBilling() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Handle error
    }
    setLoading(false);
  }

  async function handleUpgrade(plan: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Handle error
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-mono font-bold text-2xl mb-2">Account</h1>
      <p className="text-text-muted text-sm mb-8">Manage your subscription and billing.</p>

      {/* Profile */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="font-mono font-bold text-sm text-text-muted mb-4">PROFILE</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted text-xs font-mono">Email</span>
            <span className="text-sm font-mono">{email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted text-xs font-mono">Current Plan</span>
            <span className="text-sm font-mono text-accent font-bold">
              {PLANS[currentPlan as keyof typeof PLANS]?.name || "Free"}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="font-mono font-bold text-sm text-text-muted mb-4">SUBSCRIPTION</h2>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(PLANS) as [string, (typeof PLANS)[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`border rounded-lg p-4 text-center ${
                  key === currentPlan
                    ? "border-accent bg-accent/5"
                    : "border-border"
                }`}
              >
                <div className="font-mono font-bold text-sm mb-1">{plan.name}</div>
                <div className="font-mono text-lg font-bold">
                  ${plan.price}
                  <span className="text-text-muted text-xs">/mo</span>
                </div>
                {key === currentPlan ? (
                  <div className="text-accent text-xs font-mono mt-2">CURRENT</div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={loading}
                    className="text-xs font-mono mt-2 text-text-muted hover:text-accent transition-colors"
                  >
                    UPGRADE
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Billing */}
      <button
        onClick={handleManageBilling}
        disabled={loading}
        className="border border-border text-text-primary font-mono px-6 py-2.5 rounded hover:border-accent/30 transition-colors text-sm disabled:opacity-50"
      >
        {loading ? "..." : "MANAGE BILLING"}
      </button>
    </div>
  );
}
