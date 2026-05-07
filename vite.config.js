import { defineConfig } from "vite";
import { resolve } from "node:path";
import { beasties } from "vite-plugin-beasties";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    beasties({
      options: {
        preload: "swap",
        pruneSource: false,
        reduceInlineStyles: false,
        mergeStylesheets: false,
        inlineFonts: false,
        logLevel: "info",
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        leistungen: resolve(__dirname, "leistungen.html"),
        ablauf: resolve(__dirname, "ablauf.html"),
        kontakt: resolve(__dirname, "kontakt.html"),
        danke: resolve(__dirname, "danke.html"),
        impressum: resolve(__dirname, "impressum.html"),
        datenschutz: resolve(__dirname, "datenschutz.html"),
        cookies: resolve(__dirname, "cookies.html"),
        branding: resolve(__dirname, "branding.html"),
        webentwicklung: resolve(__dirname, "webentwicklung.html"),
        seoMarketing: resolve(__dirname, "seo-marketing.html"),
        marketing: resolve(__dirname, "marketing.html"),
        social: resolve(__dirname, "social.html"),
        growth: resolve(__dirname, "growth.html"),
        kiBeratung: resolve(__dirname, "ki-beratung.html"),
      },
    },
  },
});

