# Changelog

## 2026-04-30 — Hero-Sektion: Mobile-Layout, Lade-Verhalten, sichtbare Kante entfernt

### Mobile (Home)
- Hero-Kachel auf kleinen Geräten näher unter den Header gezogen: Top-Padding der `.hero-stage__viewport` von ~6.4rem auf ~2.2rem reduziert, `min-height` von max. 520px auf max. 440px verkleinert, `align-items: flex-start` ergänzt damit die Kachel nicht mehr vertikal zentriert wird.
  - `src/css/style.css` (`@media (max-width: 900px)` Block, `body.has-fixed-hero-bg #hero-stage .hero-stage__viewport`)

### Lade-Verhalten
- Verzögerung der Hero-Intro-Animation von 1100ms auf 150ms gesenkt. Das Dunkel-Fenster vor dem Erscheinen der Kachel ist dadurch kaum noch wahrnehmbar.
  - `src/js/main.js` — `setTimeout(startIntro, …)`

### Sichtbare horizontale Kante zwischen Hero und nachfolgender Sektion entfernt
- Hintergrund-Gradient der Hero-Viewport (Home) läuft nach unten sanft in Transparenz aus, statt mit einer dunklen Volldeckung zu enden.
- `::after`-Overlay der Hero-Viewport (Home): das untere Darkening-Layer entfernt.
  - `src/css/style.css` — `body[data-page="home"] .hero-stage__viewport` und `…::after`

### Schatten der Hero-Kachel entfernt (alle Zustände)
- Statischer Schatten der Kachel (Home): `box-shadow: none`.
- Hover-Schatten (`.hero-stage.is-interactive .hero-stage__frame`): `box-shadow: none`.
- Schatten-Anteile aus den Keyframes der Intro-Animation entfernt (`heroStageCardIntro` 0% und 100%).
- `transition` der Kachel auf `border-color` reduziert (Tilt- und Border-Hover-Animationen bleiben smooth).
  - `src/css/style.css` — `body[data-page="home"] .hero-stage__frame`, `.hero-stage.is-interactive .hero-stage__frame`, `@keyframes heroStageCardIntro`

### Was unverändert blieb
- Tilt-Effekt der Kachel (3D-Rotation auf Mausbewegung).
- Border-Highlight beim Hover.
- Innerer `::after`-Glow (cyan) und Surface-Gradient.
- Intro-Animation (Blur + Translate + Opacity), nur ohne Schatten-Anteil.
- WebGL-Orb-Hintergrund und Fallback-Logik.
