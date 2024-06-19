import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./Container/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        "default":"#a7a9ae",
        "white-25":"rgba(255,255,255,0.25)",
        "white-50":"rgba(255,255,255,0.50)",
        "black-50":"rgba(0,0,0,0.5)"
      }
    },
  },
  plugins: [],
};
export default config;
