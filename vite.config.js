import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/caller-analytics-graph/",
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
