import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "background-gray": "#f0f2f5",
        "background-gray-hover": "#d5d6d9",
        "green-xs": "#07f9a2",
        "green-s": "#09c184",
        "green-m": "#0a8967",
        "green-l": "#0c5149",
        "blue-l": "#0d192b",
      },
      spacing: {
        "128": "32rem",
      },
    },
  },
  plugins: [],
};
export default config;
