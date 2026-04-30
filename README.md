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
- `ki-beratung.html`: Leistungsseite KI Beratung
- `marketing.html`: Legacy-Redirect auf `seo-marketing.html`
- `webentwicklung.html`: Leistungsseite Webentwicklung
- `impressum.html`: Impressum
- `datenschutz.html`: Datenschutz
- `src/js/main.js`: Aktives Frontend-Script
- `src/js/water-sphere.js`: Home-Hero-WebGL-Sphere, aktuell via Three.js-CDN auf `index.html`
- `src/css/style.css`: Aktives Hauptstylesheet
- `src/css/tailwind.css`: Lokaler Tailwind/PostCSS-Entry; wird in HTML nach `style.css` geladen, damit Utilities die erwartete Cascade behalten
- `assets/`: Lokale statische Bilder (Logo, Portrait)
- `scripts/check-repo.mjs`: Repo-Basischeck fuer Entrypoints, Links, Assets und aktive Hooks

## Notes

- The active runtime path is `*.html` + `src/js/main.js` + `src/css/style.css` + `src/css/tailwind.css`.
- Tailwind is built locally through PostCSS/Vite; there is no Tailwind Play-CDN or inline Tailwind config in runtime HTML.
- `kontakt.html` posts to `/api/contact`, which is served by Vercel. The plain Vite dev server does not emulate that API route.
- Internal page links point to `*.html` files for reliable local navigation, while canonicals and host redirects may still use clean URLs.

