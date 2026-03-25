import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProbateEdge - Metro Atlanta Probate Lead Intelligence",
  description:
    "AI-powered probate lead scoring for Metro Atlanta real estate investors. Fresh court filings, property data, and deal scores delivered daily.",
  keywords: [
    "probate leads",
    "atlanta real estate",
    "wholesaling",
    "deal scoring",
    "probate court filings",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}
