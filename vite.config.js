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
        impressum: resolve(__dirname, "impressum.html"),
        datenschutz: resolve(__dirname, "datenschutz.html"),
        branding: resolve(__dirname, "branding.html"),
        webentwicklung: resolve(__dirname, "webentwicklung.html"),
        marketing: resolve(__dirname, "marketing.html"),
      },
    },
  },
});

