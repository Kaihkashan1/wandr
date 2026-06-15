import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(248, 104, 0, 0.35)",
        card: "0 4px 24px -4px rgba(9, 29, 34, 0.08)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(248, 104, 0, 0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(255, 140, 66, 0.12), transparent)",
      },
      colors: {
        wandr: {
          50: "#fff4ed",
          100: "#ffe8d5",
          200: "#ffcaaa",
          400: "#ff8c42",
          500: "#f86800",
          600: "#dd5500",
          700: "#b84400",
          900: "#5c2000",
        },
        navy: {
          50: "#e8eef1",
          100: "#c4d2da",
          500: "#1a3240",
          700: "#0d1f28",
          900: "#091d22",
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
