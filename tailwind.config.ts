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
          DEFAULT: "#FFFFFF",
          surface: "#F8FAFC",
          hover: "#F1F5F9",
        },
        border: {
          DEFAULT: "#E2E8F0",
        },
        accent: {
          DEFAULT: "#4F46E5",
          dim: "#4338CA",
        },
        score: {
          high: "#059669",
          mid: "#D97706",
          low: "#DC2626",
        },
        text: {
          primary: "#0F172A",
          muted: "#64748B",
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
