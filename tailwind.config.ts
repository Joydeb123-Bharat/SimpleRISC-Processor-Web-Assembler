import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        panel: "#161b22",
        primary: "#1f6feb",
        accent: "#8957e5",
        textMain: "#c9d1d9",
        textDim: "#8b949e",
        success: "#238636",
        warning: "#d29922",
        error: "#f85149",
        borderDark: "#30363d"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      fontFamily: {
        mono: ['"Fira Code"', '"Roboto Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif']
      }
    },
  },
  plugins: [],
};
export default config;
