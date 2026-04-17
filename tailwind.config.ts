import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2D2A26",
        cream: "#F5F0E8",
        tomato: "#D94F30",
        forest: "#3A5A40",
        honey: "#DAA520"
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', '"Book Antiqua"', "serif"],
        body: ['"Avenir Next"', '"Trebuchet MS"', '"Segoe UI"', "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 40px rgba(45, 42, 38, 0.12)"
      },
      keyframes: {
        peek: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-4px) scale(1.04)" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" }
        },
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        peek: "peek 420ms ease-out",
        wiggle: "wiggle 480ms ease-in-out",
        pop: "pop 280ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
