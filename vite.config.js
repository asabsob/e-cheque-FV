import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic", // 👈 VERY IMPORTANT
      babel: {
        plugins: [],
      },
    }),
  ],
});