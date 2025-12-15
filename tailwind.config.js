import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
       keyframes: {
    fadeIn: {
      "0%": { opacity: 0, transform: "translateY(10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },
  animation: {
    fadeIn: "fadeIn 0.5s ease-out",
  },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Light
        light: {
          bg: "#f8fafc",
          sidebar: "#e2e8f0",
          card: "#ffffff",
          text: "#0f172a",
          text2: "#64748b",
        },
        // Dark
        dark: {
          bg: "#0f172a",
          sidebar: "#1e293b",
          card: "#334155",
          text: "#f8fafc",
          text2: "#94a3b8",
        },
        // Primary theme
        primary: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#1E3A8A",
        },

        // App theme
        app: {
          bg: "#F5F7FA",
          sidebar: "#1E3A8A",
          chatUser: "#3B82F6",
          chatAI: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};
