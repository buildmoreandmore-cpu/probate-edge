"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { PLANS, PlanKey } from "@/lib/types";

function SignupForm() {
  const searchParams = useSearchParams();
  const defaultPlan = (searchParams.get("plan") as PlanKey) || "solo";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          plan: selectedPlan,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Check your email to confirm your account.");
      setTimeout(() => router.push("/login"), 3000);
    }
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6">
      <h1 className="font-mono font-bold text-lg mb-6">Create Account</h1>

      <form onSubmit={handleSignup}>
        <div className="space-y-4">
          <div>
            <label className="text-text-muted text-xs font-mono block mb-1.5">FULL NAME</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label className="text-text-muted text-xs font-mono block mb-1.5">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              required
            />
          </div>

          <div>
            <label className="text-text-muted text-xs font-mono block mb-1.5">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="text-text-muted text-xs font-mono block mb-2">PLAN</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(
                ([key, plan]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlan(key)}
                    className={`py-2 px-2 rounded text-center transition-colors ${
                      selectedPlan === key
                        ? "bg-accent/10 border border-accent/30 text-accent"
                        : "border border-border text-text-muted hover:border-accent/20"
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">{plan.name}</div>
                    <div className="font-mono text-xs">${plan.price}/mo</div>
                  </button>
                )
              )}
            </div>
          </div>

          {error && <p className="text-score-low text-xs font-mono">{error}</p>}
          {message && <p className="text-accent text-xs font-mono">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg font-mono font-bold py-2.5 rounded hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "START 7-DAY FREE TRIAL"}
          </button>
        </div>
      </form>

      <p className="text-text-muted text-xs font-mono text-center mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-mono text-2xl font-bold text-accent mb-8">
          PROBATE<span className="text-text-primary">EDGE</span>
        </Link>
        <Suspense fallback={<div className="text-text-muted text-center font-mono text-sm">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
