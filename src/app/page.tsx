import Link from "next/link";
import { PLANS } from "@/lib/types";

function ScoreBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const color = score >= 75 ? "text-score-high" : score >= 50 ? "text-score-mid" : "text-score-low";
  const bg = score >= 75 ? "bg-score-high/10" : score >= 50 ? "bg-score-mid/10" : "bg-score-low/10";
  const dot = score >= 75 ? "bg-score-high" : score >= 50 ? "bg-score-mid" : "bg-score-low";
  const textSize = size === "lg" ? "text-lg" : "text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${bg} ${color} font-mono ${textSize} font-bold`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {score}
    </span>
  );
}

function LeadCardDemo() {
  const leads = [
    { score: 96, address: "1289 Whitlock Ave NW, Marietta GA", county: "Cobb", days: 1, equity: 475000, assessed: 385000, market: 475000 },
    { score: 93, address: "872 Highway 85 S, Fayetteville GA", county: "Fayette", days: 6, equity: 355000, assessed: 290000, market: 355000 },
    { score: 87, address: "456 Oak Dr, Marietta GA", county: "Cobb", days: 2, equity: 230000, assessed: 245000, market: 310000 },
    { score: 64, address: "2156 Lawrenceville Hwy, Lawrenceville GA", county: "Gwinnett", days: 5, equity: 120000, assessed: 195000, market: 240000 },
  ];

  return (
    <div className="space-y-3 max-w-xl mx-auto">
      {leads.map((lead, i) => (
        <div
          key={i}
          className="bg-bg-surface border border-border rounded-lg p-4 hover:border-accent/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ScoreBadge score={lead.score} />
                <span className="font-mono text-sm text-text-primary truncate">
                  {lead.address}
                </span>
              </div>
              <div className="text-text-muted text-xs font-mono">
                {lead.county} County &middot; Filed {lead.days === 1 ? "yesterday" : `${lead.days} days ago`}
              </div>
              <div className="text-text-muted text-xs font-mono mt-1">
                Est. Equity:{" "}
                <span className="text-accent">${(lead.equity / 1000).toFixed(0)}K</span>
                {" "}&middot; Assessed: ${(lead.assessed / 1000).toFixed(0)}K &middot; Market: ${(lead.market / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-xl font-bold text-accent">
            PROBATE<span className="text-text-primary">EDGE</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-text-muted hover:text-text-primary text-sm transition-colors">
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-sm bg-accent text-bg font-semibold px-4 py-2 rounded hover:bg-accent-dim transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block mb-6 px-3 py-1 border border-accent/20 rounded-full bg-accent/5">
          <span className="text-accent text-xs font-mono">METRO ATLANTA &middot; 7 COUNTIES &middot; UPDATED DAILY</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold font-mono leading-tight mb-6">
          Probate Leads.<br />
          <span className="text-accent">Delivered Daily.</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto mb-10">
          AI-scored probate court filings with property data, equity estimates, and deal intelligence.
          Stop chasing cold lists. Start closing motivated sellers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-accent text-bg font-bold px-8 py-3 rounded font-mono hover:bg-accent-dim transition-colors text-lg"
          >
            START FREE TRIAL
          </Link>
          <Link
            href="/login"
            className="border border-accent/30 text-accent px-8 py-3 rounded font-mono hover:bg-accent/10 transition-colors text-lg"
          >
            TRY DEMO
          </Link>
        </div>
      </section>

      {/* Live Feed Preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-8">
          <span className="text-text-muted text-xs font-mono uppercase tracking-widest">
            Live Lead Feed Preview
          </span>
        </div>
        <LeadCardDemo />
        <p className="text-center text-text-muted text-xs font-mono mt-4">
          Sample data &middot; Real leads update daily from county court filings
        </p>
      </section>

      {/* Value Props */}
      <section className="border-t border-border bg-bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fresh Court Filings",
                desc: "Probate cases scraped daily from Cobb, Fulton, DeKalb, Gwinnett, Fayette, Newton, and Douglas county courts.",
                icon: "//",
              },
              {
                title: "AI Deal Scoring",
                desc: "Every lead scored 0-100 by AI analyzing equity, filing recency, property type, and market conditions.",
                icon: ">>",
              },
              {
                title: "Property Intelligence",
                desc: "Assessed values, market estimates, mortgage balances, and equity calculations pulled from qPublic records.",
                icon: "$$",
              },
            ].map((prop, i) => (
              <div key={i} className="p-6 border border-border rounded-lg">
                <div className="text-accent font-mono text-2xl mb-4">{prop.icon}</div>
                <h3 className="font-mono font-bold text-lg mb-2">{prop.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20" id="pricing">
        <h2 className="text-3xl font-mono font-bold text-center mb-4">Pricing</h2>
        <p className="text-text-muted text-center mb-12 max-w-lg mx-auto">
          Start with a 7-day free trial. Cancel anytime. All plans include AI deal scoring.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`border rounded-lg p-6 ${
                  key === "investor"
                    ? "border-accent bg-accent/5"
                    : "border-border bg-bg-surface"
                }`}
              >
                {key === "investor" && (
                  <div className="text-accent text-xs font-mono mb-4 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="font-mono font-bold text-xl mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-mono font-bold">${plan.price}</span>
                  <span className="text-text-muted text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-accent mt-0.5">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-2.5 rounded font-mono font-semibold text-sm transition-colors ${
                    key === "investor"
                      ? "bg-accent text-bg hover:bg-accent-dim"
                      : "border border-border text-text-primary hover:border-accent/30"
                  }`}
                >
                  START FREE TRIAL
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-text-muted text-xs font-mono">
          <span>PROBATEEDGE &copy; 2026</span>
          <span>martin.builds</span>
        </div>
      </footer>
    </div>
  );
}
