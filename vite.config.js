import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        impressum: resolve(__dirname, "impressum/index.html"),
        datenschutz: resolve(__dirname, "datenschutz/index.html"),
        brandingPositionierung: resolve(__dirname, "leistungen/branding-positionierung/index.html"),
        webentwicklung: resolve(__dirname, "leistungen/webentwicklung/index.html"),
        marketingGrowth: resolve(__dirname, "leistungen/marketing-growth/index.html"),
      },
    },
  },
});

