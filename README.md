# Smart Web Studio

## Development

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`
3. Build production bundle:
   `npm run build`
4. Preview production build:
   `npm run preview`

## Structure

- `index.html`: Startseite
- `branding.html`: Leistungsseite Branding
- `marketing.html`: Leistungsseite Marketing
- `webentwicklung.html`: Leistungsseite Webentwicklung
- `impressum.html`: Impressum
- `datenschutz.html`: Datenschutz
- `src/js/main.js`: Aktives Frontend-Script
- `src/css/style.css`: Aktives Stylesheet
- `assets/`: Lokale statische Bilder (Logo, Portrait)
- `public/assets/`: Vite/Vercel public assets

## Notes

- The project works with `npm run dev` and also with simple static local serving of the root HTML files.
- Internal page links point to `*.html` files for reliable local navigation.

