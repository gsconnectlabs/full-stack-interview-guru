import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep teal — FIG's primary brand environment (anchored on the real logo:
        // sampled disc ≈ #00424e, sampled letters ≈ #eec353). See DECISIONS #036.
        brand: {
          50: "#eefaf7",
          100: "#d3f2ea",
          200: "#a6e4d6",
          300: "#6fd0bf",
          400: "#3bb6a3",
          500: "#149487",
          600: "#0d7a70",
          700: "#0a615a",
          800: "#0a4c48",
          900: "#083a38",
          950: "#042726",
        },
        // Teal-tinted dark neutrals (was flat navy/indigo-black).
        ink: {
          950: "#0a1412",
          900: "#0f1c19",
          850: "#14251f",
          800: "#1a2f2a",
          700: "#254038",
          600: "#345650",
        },
        // Gold — signature accent only (wordmark, one hero moment). Never a body-text
        // or large-surface color; never used for the Store "Free" badge.
        gold: {
          50: "#fdf8ea",
          100: "#faedc4",
          200: "#f5dea0",
          300: "#f0cd7c",
          400: "#e6b84f",
          500: "#d19d2f",
          600: "#a97a1f",
          700: "#7d5817",
          800: "#5c4212",
          900: "#3d2c0c",
        },
        // Warm neutrals for readable long-form content (replaces cool default `slate`
        // site-wide via this override — every existing text-slate-*/bg-slate-* class
        // inherits the warm tone with no per-component edits needed).
        slate: {
          50: "#faf9f7",
          100: "#f5f3f0",
          200: "#e7e3de",
          300: "#d6d1ca",
          400: "#a89f95",
          500: "#79716a",
          600: "#57514c",
          700: "#443f3b",
          800: "#292624",
          900: "#1c1a18",
          950: "#0c0b0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        // Editorial serif for question H1s + major section headings only — a system
        // stack, no webfont/next-font dependency (DECISIONS #036).
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
