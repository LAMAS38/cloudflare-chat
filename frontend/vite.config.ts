import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/health": "http://127.0.0.1:8787",
      "/r": {
        target: "http://127.0.0.1:8787",
        ws: true,
        bypass(req) {
          const url = req.url ?? "";
          // WebSocket only — page routes (/r/salon) stay on Vite (SPA)
          if (/^\/r\/[^/?]+\/ws(?:\?|$)/.test(url)) {
            return;
          }
          return false;
        },
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
