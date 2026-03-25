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
          DEFAULT: "#0A0A0F",
          surface: "#12121A",
          hover: "#1A1A28",
        },
        border: {
          DEFAULT: "#1E1E2E",
        },
        accent: {
          DEFAULT: "#00FF94",
          dim: "#00CC76",
        },
        score: {
          high: "#00FF94",
          mid: "#FFB800",
          low: "#FF4444",
        },
        text: {
          primary: "#F0F0F0",
          muted: "#6B6B80",
        },
      },
      fontFamily: {
        mono: ["Space Mono", "JetBrains Mono", "monospace"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
