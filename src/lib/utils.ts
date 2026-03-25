export function getScoreColor(score: number): string {
  if (score >= 75) return "text-score-high";
  if (score >= 50) return "text-score-mid";
  return "text-score-low";
}

export function getScoreBg(score: number): string {
  if (score >= 75) return "bg-score-high/10 border-score-high/20";
  if (score >= 50) return "bg-score-mid/10 border-score-mid/20";
  return "bg-score-low/10 border-score-low/20";
}

export function getScoreDot(score: number): string {
  if (score >= 75) return "bg-score-high";
  if (score >= 50) return "bg-score-mid";
  return "bg-score-low";
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
