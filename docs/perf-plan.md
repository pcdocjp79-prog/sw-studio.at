# Performance-Refactor — Umsetzungsplan (Phase 1–6)

> Stand: 2026-04-25 (Phase 0 abgeschlossen)
> Basisanalyse: [perf-baseline.md](./perf-baseline.md)
> Auftrag: [prompts/perf-refactor.md](../prompts/perf-refactor.md)

## Leitprinzipien für den gesamten Refactor

1. **Ein Schritt nach dem anderen** — pro Phase ein eigener Branch, getrennte Commits, Freigabe vor der nächsten Phase. ([CLAUDE.md](../CLAUDE.md))
2. **Kein visueller Bruch** — Layout, Typografie, Farben, Hero-Animation bleiben pixelgleich oder besser.
3. **Keine Breaking Changes** — Routen, Anker-IDs, SEO-relevantes Markup bleiben unverändert.
4. **Sprache & Texte unverändert** (deutsch, bestehender Inhalt).
5. **Vor jeder Phase**: Plan kurz im Chat, auf Go warten, dann umsetzen. Am Ende: 1-Satz-Eintrag in `CHANGELOG.md`.
6. **Dependencies** nur mit Begründung. Tailwind, PostCSS, Three sind explizit vom Auftrag abgedeckt.

---

## Phase 1 — Tailwind als ordentlicher Build-Step

**Branch:** `perf/phase-1-tailwind`
**Risiko:** mittel — viele HTML-Dateien betroffen, visuelle Regression möglich.
**Erwarteter Gewinn:** −93 KB gz JS-Transfer pro Page-Load, kein Runtime-JIT mehr.

### Tasks
1. `npm install -D tailwindcss@^3.4 postcss autoprefixer cssnano`
2. `postcss.config.js` anlegen (tailwindcss + autoprefixer; cssnano nur in `process.env.NODE_ENV === 'production'`)
3. [tailwind.config.js](../tailwind.config.js) erweitern:
   ```js
   content: ['./*.html', './projekte/**/*.html', './src/**/*.{js,css}']
   ```
   (Custom-Theme bleibt; Inline-Configs aus HTML migrieren)
4. `src/css/tailwind.css` neu anlegen mit `@tailwind base; @tailwind components; @tailwind utilities;`
5. In Vite ([vite.config.js](../vite.config.js)) wird PostCSS automatisch aufgerufen — keine extra Config nötig.
6. Inline-`<script>tailwind.config = {...}</script>`-Block aus jeder HTML-Datei entfernen (24 Dateien).
7. `<script src="https://cdn.tailwindcss.com"></script>` aus 23 HTML-Dateien entfernen.
8. `<link rel="stylesheet" href="src/css/tailwind.css" />` in jeder HTML-Datei vor `style.css` einfügen.
9. Custom-Klassen, die wie Tailwind-Komponenten wirken (z. B. `hero-stage`, `scroll-focus-section`, `animate-enter`), in `@layer components` von `src/css/tailwind.css` migrieren — **bestehende `style.css` bleibt** als Quelle für Nicht-Tailwind-Styles (Keyframes, Variables, Reset).
10. `npm run build` lokal — alle 24 Seiten visuell sichten (Hero, Sticky-CTA, Cookie-Banner, Footer).

### Verifikation
- `npm run build` ohne Fehler
- DevTools-Network: kein Request an `cdn.tailwindcss.com`
- Visueller Vergleich Vorher/Nachher (Screenshots Hero, Pakete, Footer)
- `selection:bg-zinc-200`, `antialiased`, `has-fixed-hero-bg`, `has-mobile-sticky-cta` funktionieren weiter

### Open Risk
- Falls Custom-Klassen mit Tailwind-Utilities kollidieren (Reihenfolge), `style.css` nach Tailwind laden.

---

## Phase 2 — Three.js zähmen

**Branch:** `perf/phase-2-three`
**Risiko:** mittel-hoch — Hero-Animation ist die visuelle Signatur der Seite.
**Erwarteter Gewinn:** Three.js wird **nur** geladen, wenn der Hero sichtbar ist, der Browser idle, kein Reduced-Motion und keine Save-Data-Bedingung. Spart auf Mid-Range-Mobile bis zu 155 KB gz.

### Tasks
1. `npm install three@0.160.0`
2. `<script src="https://unpkg.com/three@0.160.0/build/three.min.js" defer>` aus [index.html](../index.html#L36) entfernen.
3. [src/js/water-sphere.js](../src/js/water-sphere.js) refactoren:
   - Top of file: `import { WebGLRenderer, Scene, PerspectiveCamera, IcosahedronGeometry, ShaderMaterial, Mesh, ... } from 'three';` (nur was tatsächlich verwendet wird)
   - Globaler `THREE`-Zugriff durch named imports ersetzen
4. **Neuer Wrapper** `src/js/hero-bootstrap.js`:
   - Prüft beim DOMContentLoaded:
     - `matchMedia('(prefers-reduced-motion: reduce)')` → Fallback aktivieren, abbrechen
     - `navigator.connection?.saveData === true` → Fallback, abbrechen
     - `navigator.connection?.effectiveType` ∈ {`'slow-2g'`, `'2g'`} → Fallback, abbrechen
   - IntersectionObserver auf `[data-hero-stage]`:
     - Bei `isIntersecting`: `requestIdleCallback(() => import('./water-sphere.js').then(m => m.initWaterSphere()))`
     - Fallback: `setTimeout(..., 200)` falls `requestIdleCallback` fehlt
5. **Statisches Fallback** in CSS:
   - Klasse `body.hero-fallback` mit Gradient + leichtem SVG/`background-image`
   - Optisch nahe am WebGL-Look (Farbpalette aus den bestehenden Orbs)
6. **Render-Loop pausieren**:
   - `document.visibilitychange` → `cancelAnimationFrame` bei `hidden`, `requestAnimationFrame` bei `visible`
   - Hero-IO `isIntersecting === false` → pausieren
7. **DPR-Cap**: `Math.min(devicePixelRatio, 1.5)` (ist evtl. schon drin — prüfen)
8. **ResizeObserver** mit Debounce (rAF + 150 ms) statt `window.resize`
9. **WebGLRenderer-Optionen**: `{ antialias: false, powerPreference: 'high-performance', alpha: true }`. Falls Aliasing-Artefakte sichtbar, FXAA als optionalen Pass (gated hinter Device-Check).

### Verifikation
- `npm run build`: `three.js`-Modul taucht im Bundle-Analyzer als **separate Chunk** auf
- DevTools-Network mit `prefers-reduced-motion: reduce` (DevTools-Rendering-Tab) → Three.js wird **nicht** geladen, Fallback sichtbar
- DevTools-Network mit Throttling "Slow 4G" + Save-Data → Three.js wird nicht geladen
- FPS-Counter (DevTools-Performance) ≥ 60 fps stabil im Hero
- Tab-Wechsel pausiert die rAF (im Performance-Tab sichtbar)

---

## Phase 3 — Erweiterbares Animations-System (`src/anim/`)

**Branch:** `perf/phase-3-anim-system`
**Risiko:** niedrig — reine Refactor-Phase, keine neue Funktionalität.
**Erwarteter Gewinn:** wartbares Fundament, damit künftige Animationen die Performance-Budgets nicht sprengen.

### Tasks
1. Verzeichnis `src/anim/` anlegen
2. `src/anim/motion.js`:
   - `prefersReducedMotion()` → boolean (cached + `change`-Listener)
   - `onReveal(el, { threshold = 0.12, once = true } = {})` → IO-basiert, Promise/Callback
   - `onScrollProgress(el, cb, { rafThrottle = true })` → einzelner globaler rAF-Loop, multiplexed über alle registrierten Elemente
   - `withWillChange(el, prop, fn)` → setzt `will-change` vor, entfernt nach
3. **Konsolidierung Reduced-Motion-Switch**:
   - Klasse `reduced-motion` an `<html>` setzen, sobald `prefersReducedMotion()` true
   - Bestehende Media-Queries in [src/css/style.css](../src/css/style.css) zusätzlich auf `.reduced-motion &` triggern (für JS-getriggerten Switch in Tests/Settings)
4. **Refactor**:
   - `initRevealOnScroll` in [main.js](../src/js/main.js) → nutzt `onReveal()`
   - `initScrollFocusEffect` in [main.js](../src/js/main.js) → nutzt `onScrollProgress()`
   - `initHeroStageInteraction` (Mousemove) → rAF-batched über `motion.js`-Helper
5. **`docs/anim-guide.md`** mit 2 voll ausgearbeiteten Beispielen:
   - "Fade-In auf Reveal"
   - "Scroll-Parallax-Layer"
   - Plus: Checkliste "Animation-Performance-Budget" (transform/opacity only, will-change-Lifecycle, RM-Fallback)

### Verifikation
- Verhalten **identisch** zu vorher (manueller Vergleich)
- Performance-Tab: nur **ein** rAF-Loop für alle Scroll-Animationen
- `<html class="reduced-motion">` wird korrekt gesetzt bei OS-Setting-Wechsel

---

## Phase 4 — Asset- & Loading-Optimierung

**Branch:** `perf/phase-4-assets`
**Risiko:** niedrig — additive Änderungen an HTML.
**Erwarteter Gewinn:** weniger Eager-Requests, schnellerer LCP.

### Tasks
1. **Bilder**:
   - `loading="lazy"` + `decoding="async"` + `width`/`height` auf alle `<img>` außer LCP — 23 HTML-Dateien
   - `<picture>`-Wrapper mit AVIF + WebP-Fallback für Hero-Bild
   - LCP-Bild: `fetchpriority="high"` + `<link rel="preload" as="image">`
2. **Logo**: `sw-studio_logo.png` (113 KB) → SVG-Konvertierung. **Vor Umsetzung User fragen**, ob SVG-Quelle existiert; falls nicht, optimiertes WebP (≤ 10 KB).
3. **Fonts**:
   - Self-hosting (Geist, Inter, JetBrains Mono) via `@fontsource/*` oder direkt `.woff2`
   - `font-display: swap`
   - `<link rel="preload" as="font" crossorigin>` für Hero-Schrift (wahrscheinlich Geist 600)
   - Google-Fonts-CSS und `preconnect` zu `fonts.gstatic.com` entfernen
4. **Cookie-Banner lazy laden**:
   - [src/scripts/modules/cookieConsent.js](../src/scripts/modules/cookieConsent.js) → dynamic `import()` aus `main.js`, getriggert per `requestIdleCallback`
   - LocalStorage-Check für bestehenden Consent **vorher** synchron, damit kein Banner-Flash
5. **Vite-Build**:
   - `build.target: 'es2020'` in [vite.config.js](../vite.config.js)
   - Manueller Code-Split: `manualChunks` für `hero-bootstrap`, `cookie-consent`
   - Doku im README: Brotli-/Gzip-Setup für Vercel ist standardmäßig aktiv (`vercel.json` evtl. erwähnen)
6. **Asset-Cleanup** (nach User-Bestätigung):
   - `assets/hero-cube-iridescent-v1.png` (2 087 KB)
   - `assets/smart web stidio Logo T.png` (1 535 KB, Tippfehler "stidio")
   - `assets/uebermich.webP` (2 459 KB)
   - **Vorher** in [git log](#) prüfen, ob diese Dateien in jüngsten Commits referenziert werden.

### Verifikation
- DevTools-Network: nur LCP-Bild lädt eager, alle anderen lazy
- Cookie-Banner-JS lädt erst nach `idle` (sichtbar im Network-Initiator)
- `npm run build`: separate Chunks für hero-bootstrap und cookie-consent
- Lighthouse "Properly size images", "Serve images in next-gen formats", "Defer offscreen images" → bestanden

---

## Phase 5 — A11y & SEO Sanity-Check

**Branch:** `perf/phase-5-a11y-seo`
**Risiko:** niedrig.
**Erwarteter Gewinn:** Lighthouse-A11y/SEO-Score ≥ 95.

### Tasks
1. **Kontraste** prüfen (Hero-Text auf animiertem Hintergrund) — DevTools-Color-Picker oder Pa11y
2. **Fokus-States** für Buttons "Erstgespräch buchen", "Mini-Audit anfordern" sichtbar machen (`:focus-visible`)
3. **Skip-Link** `<a href="#main">` ganz oben in jedem `<body>`
4. **Heading-Hierarchie**: nur ein `<h1>` pro Seite, keine Sprünge (`h2`→`h4`)
5. **Meta-Tags**:
   - `<meta name="description">` pro Seite (prüfen, nicht erfinden)
   - OpenGraph-Set (og:title, og:description, og:image, og:url)
   - JSON-LD `LocalBusiness` / `ProfessionalService` für [index.html](../index.html), [kontakt.html](../kontakt.html), [impressum.html](../impressum.html)
   - **Bei fehlenden Daten (Adresse, Telefon, Öffnungszeiten): User fragen, nicht erfinden.**

### Verifikation
- Lighthouse A11y ≥ 95, SEO ≥ 95
- Tab-Navigation durch alle interaktiven Elemente sichtbar
- `https://search.google.com/test/rich-results` validiert das JSON-LD

---

## Phase 6 — Verifikation & Dokumentation

**Branch:** `perf/phase-6-verify`
**Risiko:** keine.

### Tasks
1. Lighthouse-Run **Mobile + Desktop** (Chrome DevTools Lighthouse, "Mobile, Slow 4G, 4× CPU throttling")
2. Werte in [docs/perf-baseline.md](./perf-baseline.md) Tabelle § 7 als **Vorher** (vor Phase 1) und **Nachher** (nach Phase 5) eintragen
3. Bundle-Analyzer (`npx vite-bundle-visualizer`) Output als `docs/bundle-analysis.html` speichern (gitignore-Ausnahme)
4. **Visual-Regression**: Screenshots der Hauptsektionen (Hero, Approach, Pillars, Packages, Footer) **vorher** (vor Phase 1, aus Backup-Branch) und **nachher** in `docs/visual-diff.md` nebeneinander
5. **README aktualisieren**: lokale Entwicklung (`npm run dev`), Build (`npm run build`), Deploy (Vercel), Performance-Budget

### Definition of Done (Gesamt)
- ✅ Lighthouse Performance ≥ 95 Mobile
- ✅ LCP < 2.0 s, CLS < 0.05, INP < 200 ms (Mobile, Slow 4G)
- ✅ JS-Transfer Landing Page < 100 KB gz
- ✅ Hero-Animation ≥ 60 fps Mid-Range-Mobile
- ✅ `prefers-reduced-motion` und Save-Data respektiert
- ✅ Neue Animation kann in < 30 Zeilen via [src/anim/motion.js](../src/anim/motion.js) hinzugefügt werden — dokumentiert in `docs/anim-guide.md`
- ✅ README aktualisiert

---

## Offene Punkte (User-Entscheidung vor Start Phase 1)

| # | Frage | Vorschlag |
|---|---|---|
| Q1 | Lighthouse-Baseline jetzt messen oder kurz vor Phase 1? | **Kurz vor Phase 1**, dann ist der Vergleichswert frisch und nicht durch zwischenzeitliche Edits verfälscht. |
| Q2 | 3 Asset-Löschkandidaten (~ 6 MB) — wirklich ungenutzt oder Reserven? | Vor Löschung in Phase 4 explizit User-Bestätigung pro Datei einholen. |
| Q3 | Tailwind-Version: 3.x (stabil) oder 4.x (neu, andere CSS-Engine)? | **3.4** (nur Patch-Updates, keine Migration nötig — sicherer für die enge Custom-Theme-Konfig). |
| Q4 | SVG-Quelle für Logo verfügbar? | Falls nein → optimiertes WebP statt SVG, weniger ideal aber praktikabel. |
| Q5 | Self-hosted Fonts: `@fontsource/*` (npm) oder manueller WOFF2-Download? | `@fontsource/*` — automatische Updates, schmaler Build. |

---

## Branching-Strategie

```
main
├─ perf/phase-1-tailwind     ← merge nach Phase 1 abgeschlossen + grünes Lighthouse
├─ perf/phase-2-three        ← startet von main nach Phase-1-Merge
├─ perf/phase-3-anim-system
├─ perf/phase-4-assets
├─ perf/phase-5-a11y-seo
└─ perf/phase-6-verify
```

Innerhalb jeder Phase: logisch getrennte Commits (z. B. Phase 1: "build: add postcss + tailwind config" → "html: remove tailwind cdn from N pages" → "css: migrate custom classes to @layer components").
