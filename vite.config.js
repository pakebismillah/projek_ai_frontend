import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  preview: {
    host: true,
    port: 8080,
    allowedHosts: [
      "projekaifrontend-production.up.railway.app",
    ],
  },
});
