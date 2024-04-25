import type { Config } from "tailwindcss"
import resolveConfig from "tailwindcss/resolveConfig"

export const colors = {
  root: "#09090b",
  default: "#18181b",
  higher: "#27272a",
  highest: "#303033",
  overlay: "#18181b75",

  foreground: {
    DEFAULT: "#fafafa",
    default: "#fafafa",
    dimmer: "#a1a1aa",
    dimmest: "#70707e",
  },

  outline: {
    DEFAULT: "#53535c",
    default: "#53535c",
    dimmer: "#3f3f46",
    dimmest: "#27272a",
  },

  accent: {
    DEFAULT: "#f87171",
    default: "#f87171",
    dimmer: "#b53e3e",
    dimmest: "#8c2a2a",
  },

  clear: "transparent",
}

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
} satisfies Config

export const tokens = resolveConfig(config).theme

export default config
