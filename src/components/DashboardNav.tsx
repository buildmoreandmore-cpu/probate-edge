"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "LEADS" },
  { href: "/alerts", label: "ALERTS" },
  { href: "/account", label: "ACCOUNT" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="font-mono text-lg font-bold text-accent">
            PROBATE<span className="text-text-primary">EDGE</span>
          </Link>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                  pathname.startsWith(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="text-text-muted text-xs font-mono hover:text-text-primary transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    </nav>
  );
}
