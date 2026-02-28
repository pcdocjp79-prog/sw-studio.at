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

- `src/main.js`: App entry point (Vite)
- `src/scripts/modules`: Modular JS features
- `src/scripts/modules/effects/hero3dScrollEffects.js`: Isolated 3D + scroll effects
- `src/styles/main.scss`: SCSS entry
- `src/styles/modules/*.scss`: Style modules
- `index.html`: Current production page entry
- `impressum/index.html`: Separate legal page (`/impressum/`)
- `datenschutz/index.html`: Separate legal page (`/datenschutz/`)
- `js/main.js` and `css/style.css`: Active legacy runtime/style for the current page

## Notes

- `src/main.js` is prepared for the Vite-driven modular bundle path.
- `index.html` currently references `js/main.js` and `css/style.css` directly for runtime stability.

