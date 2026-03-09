# Smart Web Studio

## Development

1. Install dependencies:
   `npm install`
2. Run the repo check:
   `npm run check`
3. Start dev server:
   `npm run dev`
4. Build production bundle:
   `npm run build`
5. Preview production build:
   `npm run preview`

## Structure

- `index.html`: Startseite
- `branding.html`: Leistungsseite Branding
- `marketing.html`: Legacy-Redirect auf `seo-marketing.html`
- `webentwicklung.html`: Leistungsseite Webentwicklung
- `impressum.html`: Impressum
- `datenschutz.html`: Datenschutz
- `tailwind-config.js`: Root-served Tailwind-CDN-Konfiguration fuer HTML-Static-Serving und Vite
- `src/js/main.js`: Aktives Frontend-Script
- `src/css/style.css`: Aktives Stylesheet
- `assets/`: Lokale statische Bilder (Logo, Portrait)
- `scripts/check-repo.mjs`: Repo-Basischeck fuer Entrypoints, Links, Assets und aktive Hooks

## Notes

- The active runtime path is `*.html` + `src/js/main.js` + `src/css/style.css`.
- The project works with `npm run dev` and also with simple static local serving of the root HTML files.
- Internal page links point to `*.html` files for reliable local navigation, while canonicals and host redirects may still use clean URLs.

