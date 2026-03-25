"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { COUNTIES } from "@/lib/types";

export default function AlertsPage() {
  const [minScore, setMinScore] = useState(75);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([...COUNTIES]);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  function toggleCounty(county: string) {
    setSelectedCounties((prev) =>
      prev.includes(county) ? prev.filter((c) => c !== county) : [...prev, county]
    );
  }

  function handleSave() {
    // In production, save to Supabase alert_settings table
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-mono font-bold text-2xl mb-2">Alert Settings</h1>
      <p className="text-text-muted text-sm mb-8">
        Configure when and how you receive new lead notifications.
      </p>

      {/* Min Score */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="font-mono font-bold text-sm text-text-muted mb-4">
          MINIMUM DEAL SCORE
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="flex-1 accent-accent"
          />
          <span className="font-mono font-bold text-xl text-accent w-10 text-right">
            {minScore}
          </span>
        </div>
        <p className="text-text-muted text-xs font-mono mt-2">
          Only alert on leads scoring {minScore} or above
        </p>
      </div>

      {/* Counties */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="font-mono font-bold text-sm text-text-muted mb-4">COUNTIES</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COUNTIES.map((county) => (
            <button
              key={county}
              onClick={() => toggleCounty(county)}
              className={`px-3 py-2 rounded text-xs font-mono transition-colors ${
                selectedCounties.includes(county)
                  ? "bg-accent/10 border border-accent/30 text-accent"
                  : "border border-border text-text-muted hover:border-accent/20"
              }`}
            >
              {county.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Method */}
      <div className="bg-bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 className="font-mono font-bold text-sm text-text-muted mb-4">
          NOTIFICATION METHOD
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="accent-accent w-4 h-4"
            />
            <span className="text-sm font-mono text-text-primary">Email alerts</span>
          </label>
          <label className="flex items-center gap-3 cursor-not-allowed opacity-50">
            <input type="checkbox" disabled className="w-4 h-4" />
            <span className="text-sm font-mono text-text-muted">
              SMS alerts (coming soon)
            </span>
          </label>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="bg-accent text-bg font-mono font-bold px-8 py-3 rounded hover:bg-accent-dim transition-colors"
      >
        {saved ? "SAVED" : "SAVE SETTINGS"}
      </button>
    </div>
  );
}
