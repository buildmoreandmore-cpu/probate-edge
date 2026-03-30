"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for a magic link.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-mono text-2xl font-bold text-accent mb-8">
          PROBATE<span className="text-text-primary">EDGE</span>
        </Link>

        <div className="bg-bg-surface border border-border rounded-lg p-6">
          <h1 className="font-mono font-bold text-lg mb-6">Sign In</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("password")}
              className={`flex-1 py-2 text-xs font-mono rounded transition-colors ${
                mode === "password"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-muted border border-border hover:border-accent/20"
              }`}
            >
              PASSWORD
            </button>
            <button
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 text-xs font-mono rounded transition-colors ${
                mode === "magic"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-muted border border-border hover:border-accent/20"
              }`}
            >
              MAGIC LINK
            </button>
          </div>

          <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}>
            <div className="space-y-4">
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

              {mode === "password" && (
                <div>
                  <label className="text-text-muted text-xs font-mono block mb-1.5">PASSWORD</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg border border-border rounded px-3 py-2 text-sm font-mono text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                    required
                  />
                </div>
              )}

              {error && <p className="text-score-low text-xs font-mono">{error}</p>}
              {message && <p className="text-accent text-xs font-mono">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-bg font-mono font-bold py-2.5 rounded hover:bg-accent-dim transition-colors disabled:opacity-50"
              >
                {loading ? "..." : mode === "password" ? "SIGN IN" : "SEND MAGIC LINK"}
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-bg-surface px-2 text-text-muted font-mono">OR</span>
            </div>
          </div>

          <button
            onClick={() => {
              document.cookie = "demo_mode=true; path=/; max-age=86400";
              router.push("/dashboard");
            }}
            className="w-full border border-accent/30 text-accent font-mono font-bold py-2.5 rounded hover:bg-accent/10 transition-colors"
          >
            TRY DEMO
          </button>
          <p className="text-text-muted text-[10px] font-mono text-center mt-2">
            Explore the dashboard with sample Metro Atlanta leads
          </p>

          <p className="text-text-muted text-xs font-mono text-center mt-6">
            No account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
