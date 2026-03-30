import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B1120",
          surface: "#111827",
          hover: "#1F2937",
        },
        border: {
          DEFAULT: "#1E2A3F",
        },
        accent: {
          DEFAULT: "#F5A623",
          dim: "#D4901E",
        },
        score: {
          high: "#10B981",
          mid: "#FBBF24",
          low: "#EF4444",
        },
        text: {
          primary: "#F1F3F8",
          muted: "#6B7A99",
        },
      },
      fontFamily: {
        mono: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
