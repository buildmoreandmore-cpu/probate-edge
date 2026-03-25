import Link from "next/link";
import { PLANS } from "@/lib/types";

export const metadata = {
  title: "Pricing - ProbateEdge",
  description: "Choose your ProbateEdge plan. AI-scored probate leads for Metro Atlanta real estate investors.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-xl font-bold text-accent">
            PROBATE<span className="text-text-primary">EDGE</span>
          </Link>
          <Link
            href="/login"
            className="text-sm bg-accent text-bg font-semibold px-4 py-2 rounded hover:bg-accent-dim transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-mono font-bold text-center mb-4">
          Choose Your <span className="text-accent">Edge</span>
        </h1>
        <p className="text-text-muted text-center mb-16 max-w-lg mx-auto">
          7-day free trial on all plans. No credit card required to start. Cancel anytime.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(
            ([key, plan]) => (
              <div
                key={key}
                className={`border rounded-lg p-8 relative ${
                  key === "investor"
                    ? "border-accent bg-accent/5 scale-105"
                    : "border-border bg-bg-surface"
                }`}
              >
                {key === "investor" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-bg text-xs font-mono font-bold px-3 py-1 rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="font-mono font-bold text-2xl mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-mono font-bold">${plan.price}</span>
                  <span className="text-text-muted">/mo</span>
                </div>
                <p className="text-text-muted text-sm mb-6">
                  {plan.counties} {plan.counties === 7 ? "Metro Atlanta" : ""} counties
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent mt-0.5 shrink-0">+</span>
                      <span className="text-text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${key}`}
                  className={`block text-center py-3 rounded font-mono font-bold text-sm transition-colors ${
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

        <div className="mt-20 border border-border rounded-lg p-8 bg-bg-surface">
          <h3 className="font-mono font-bold text-lg mb-4">What&apos;s included in every plan</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-text-muted">
            {[
              "Daily probate court filings from county records",
              "AI deal scoring (0-100) with reasoning",
              "Property assessed value & market estimates",
              "Equity calculations & mortgage estimates",
              "Executor name and contact address",
              "Email alerts for high-score leads",
              "Case number & court filing links",
              "Mobile-friendly dashboard",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">+</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
