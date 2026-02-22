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
- `index.html`: Loads Vite module entry (`/src/main.js`)

## Notes

- `js/main.js` and `css/style.css` are kept as legacy snapshot files and are no longer wired in `index.html`.

