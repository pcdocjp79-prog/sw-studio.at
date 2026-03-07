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
        leistungen: resolve(__dirname, "leistungen.html"),
        projekte: resolve(__dirname, "projekte.html"),
        caseStudy: resolve(__dirname, "case-study.html"),
        ablauf: resolve(__dirname, "ablauf.html"),
        preise: resolve(__dirname, "preise.html"),
        ueberMich: resolve(__dirname, "ueber-mich.html"),
        insights: resolve(__dirname, "insights.html"),
        kontakt: resolve(__dirname, "kontakt.html"),
        danke: resolve(__dirname, "danke.html"),
        impressum: resolve(__dirname, "impressum.html"),
        datenschutz: resolve(__dirname, "datenschutz.html"),
        cookies: resolve(__dirname, "cookies.html"),
        branding: resolve(__dirname, "branding.html"),
        webentwicklung: resolve(__dirname, "webentwicklung.html"),
        marketing: resolve(__dirname, "marketing.html"),
        social: resolve(__dirname, "social.html"),
        growth: resolve(__dirname, "growth.html"),
      },
    },
  },
});

