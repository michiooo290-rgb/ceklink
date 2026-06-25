/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "var(--color-paper)",
          surface: "var(--color-paper-2)",
          border: "var(--color-border)",
          green: "var(--color-accent)",
          "green-dim": "var(--color-accent-dim)",
          red: "var(--color-danger)",
          yellow: "var(--color-warn)",
          muted: "var(--color-text-muted)",
          text: "var(--color-text)",
        },
      },
      fontFamily: {
        heading: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        "glow-green": "0 0 20px var(--color-accent-glow)",
        "glow-red": "0 0 20px var(--color-danger-glow)",
        "glow-yellow": "0 0 20px var(--color-warn-glow)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px var(--color-accent-glow)" },
          "50%": { boxShadow: "0 0 40px oklch(75% 0.18 155 / 50%)" },
        },
        "aurora": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "counter": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        aurora: "aurora 8s ease infinite",
        "scan-line": "scan-line 1.5s ease-in-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        counter: "counter 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};
