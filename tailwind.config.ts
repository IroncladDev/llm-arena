import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

export const colors = {
  root: "var(--root)",
  default: "var(--default)",
  higher: "var(--higher)",
  highest: "var(--highest)",
  overlay: "var(--overlay)",

  foreground: {
    DEFAULT: "var(--foreground-default)",
    default: "var(--foreground-default)",
    dimmer: "var(--foreground-dimmer)",
    dimmest: "var(--foreground-dimmest)",
  },

  outline: {
    DEFAULT: "var(--outline-default)",
    default: "var(--outline-default)",
    dimmer: "var(--outline-dimmer)",
    dimmest: "var(--outline-dimmest)",
  },

  accent: {
    DEFAULT: "var(--accent-default)",
    default: "var(--accent-default)",
    dimmer: "var(--accent-dimmer)",
    dimmest: "var(--accent-dimmest)",
  },

  clear: "var(--clear)",
};

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors,
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export const tokens = resolveConfig(config).theme;

export default config;
