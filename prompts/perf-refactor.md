# Auftrag: Performance-Refactor & Animations-Strategie für sw-studio.at

## Kontext
Das Projekt ist eine statische Marketing-Website (Smart Web Studio, https://www.sw-studio.at).
Aktueller Stack laut Live-Analyse:
- HTML/CSS/JS, gebaut mit einem Vite-artigen Build (`assets/main-*.js`, `style-*.css`).
- **Tailwind CSS aktuell über das Play-CDN** (`https://cdn.tailwindcss.com/`) eingebunden — also Laufzeit-Kompilierung im Browser. Das ist laut Tailwind-Doku ausdrücklich nicht für Produktion gedacht.
- **Three.js r160** wird über `unpkg` als ungebundeltes Script geladen und rendert auf einem `<canvas class="orb-parallax__canvas">` die animierten Hintergrund-Orbs/Bubbles.
- Eine `<section class="hero-stage">` mit `animate-enter`-Klassen, mehrere `scroll-focus-section`-Bereiche.
- Sprache: `lang="de"`.
- Kein Service Worker, `prefers-reduced-motion` wird **nicht** respektiert.
- Bilder ohne `loading="lazy"`, Logo als PNG (377x345).

## Ziel
Die Seite soll deutlich performanter werden (vor allem auf Mobile), ohne dass die visuelle Qualität, das Look & Feel oder die bestehenden Animationen verloren gehen. Im Gegenteil: das Animations-System soll erweiterbar werden, damit ich später weitere Animationen hinzufügen kann, **ohne dass die Performance leidet**.

## Harte Constraints
- **Keine Migration auf ein anderes Framework** (kein Astro, Next, Nuxt). Wir bleiben beim aktuellen Build-System und verbessern es.
- **Tailwind bleibt als Styling-Lösung**, aber als ordentlicher Build-Step, nicht über CDN.
- **Kein visueller Bruch**: Layout, Typografie, Farben, Hero-Animation und alle bestehenden Effekte müssen optisch identisch oder besser wirken.
- **Keine Breaking Changes** an Routen, IDs für Anker-Links (Start, Leistungen, Projekte, Ablauf, Über mich, Preise, Insights, Kontakt) oder am Markup, das für SEO relevant ist.
- **Sprache und Texte nicht verändern** (deutsch, bestehende Inhalte).
- Vor jeder Änderung: in einem eigenen Git-Branch arbeiten und logisch getrennte Commits machen.

## Performance-Ziele (messbar)
- Lighthouse Performance Score ≥ 95 auf Mobile.
- LCP < 2.0 s, CLS < 0.05, INP < 200 ms (Mobile, Slow 4G).
- JavaScript-Transfer-Größe für die Landing Page: < 100 KB gzipped (aktuell deutlich höher wegen Three.js + Tailwind-CDN).
- Hero-Animation läuft stabil mit ≥ 60 FPS auf Mid-Range-Mobile.
- Auf `prefers-reduced-motion: reduce` werden alle nicht-essentiellen Animationen abgeschaltet.

## Vorgehen — bitte in dieser Reihenfolge

### Phase 0 — Analyse & Plan (KEIN Code ändern)
1. Repo-Struktur einlesen, Build-Config finden (vite.config.*, package.json, postcss/tailwind config falls vorhanden).
2. Aktuelle Bundle-Größen messen und in einer kurzen Tabelle dokumentieren (`docs/perf-baseline.md`).
3. Konkreten Umsetzungsplan in `docs/perf-plan.md` schreiben, bevor du Code änderst.
4. Mir den Plan im Chat zusammenfassen und auf mein Go warten.

### Phase 1 — Tailwind richtig integrieren
- Play-CDN entfernen.
- Tailwind als devDependency installieren, `tailwind.config.js` + `postcss.config.js` anlegen.
- `content`-Pfade so setzen, dass alle genutzten Klassen erfasst werden (HTML, JS).
- Bestehende Custom-Klassen (z. B. `hero-stage`, `orb-parallax__canvas`, `scroll-focus-section`, `animate-enter`) in `@layer components` konsolidieren.
- Sicherstellen, dass die Selection-Styles und alle Body-Klassen (`antialiased`, `selection:bg-zinc-200`, `has-fixed-hero-bg`, `has-mobile-sticky-cta`) erhalten bleiben.
- CSS purgen und mit cssnano minifizieren.

### Phase 2 — Three.js zähmen
- Three.js lokal installieren und mit Tree-Shaking nur die benötigten Module importieren (statt `three.min.js` komplett).
- Den Hero-Renderer dynamisch importieren (`import()`), erst wenn:
  - der Hero im Viewport ist (IntersectionObserver), **und**
  - `requestIdleCallback` (Fallback `setTimeout`) bereit ist, **und**
  - `matchMedia('(prefers-reduced-motion: reduce)')` **nicht** matcht, **und**
  - `navigator.connection?.saveData !== true` und `effectiveType` nicht `slow-2g`/`2g`.
- Bei `prefers-reduced-motion` oder Low-End-Devices: **statisches Fallback** anzeigen (CSS-Gradient + ein einziges leichtes SVG/`background-image`), das optisch nahe am Three.js-Look ist.
- Render-Loop mit `requestAnimationFrame` an Sichtbarkeit koppeln (pausieren, wenn `document.hidden` oder Hero out-of-view).
- DPR auf `Math.min(devicePixelRatio, 1.5)` cappen, Resize per `ResizeObserver` mit Debounce.
- WebGLRenderer-Optionen: `antialias: false` (stattdessen FXAA/SMAA nur wenn nötig), `powerPreference: 'high-performance'`, `alpha: true`.

### Phase 3 — Erweiterbares Animations-System
Lege ein kleines, zentrales Modul `src/anim/` an, das es mir erlaubt, neue Animationen einfach hinzuzufügen, ohne die Performance zu gefährden:
- `motion.ts/js` mit Helpers: `onReveal(el, opts)` (IntersectionObserver-basiert, einmalig), `onScrollProgress(el, cb)` (rAF-throttled), `prefersReducedMotion()`.
- Bevorzugt **CSS-Animationen + Web Animations API** statt JS-Libraries. Nur wenn nötig: GSAP lokal gebündelt und lazy nachladen.
- Alle Scroll-/Mousemove-Handler über `requestAnimationFrame` gebatcht, niemals direkt im Event.
- `will-change` nur temporär setzen, danach entfernen.
- Animationen ausschließlich auf `transform` und `opacity` (keine Layout-Properties animieren).
- Globaler `prefers-reduced-motion`-Switch: Setzt eine Klasse `reduced-motion` an `<html>`, alle Animationen haben dazu einen reduzierten Fallback in CSS.
- Dokumentation in `docs/anim-guide.md`: „So fügst du eine neue Animation performant hinzu" mit 2 Beispielen.

### Phase 4 — Asset- & Loading-Optimierung
- Alle Bilder: `loading="lazy"` (außer LCP-Bild), `decoding="async"`, sinnvolle `width`/`height`, `<picture>` mit AVIF/WebP-Fallback.
- Logo PNG → optimiertes SVG oder WebP, falls SVG nicht möglich.
- Schriften: `font-display: swap`, nur benötigte Subsets/Weights, `preload` für die Hero-Schrift.
- `<link rel="preload">` für das LCP-Asset, `preconnect` für externe Origins (falls noch welche bleiben).
- Cookie-Banner-Code lazy laden, nicht im kritischen Pfad.
- Vite-Build: Code-Splitting pro Section, `build.target: 'es2020'`, Brotli/Gzip im Deployment dokumentieren.

### Phase 5 — Accessibility & SEO Sanity-Check
- Kontraste prüfen (besonders Hero-Text auf animiertem Hintergrund).
- Fokus-States für alle Buttons (`Erstgespräch buchen`, `Mini-Audit anfordern`).
- Skip-Link, korrekte Heading-Hierarchie.
- `<meta name="description">`, OpenGraph, JSON-LD für `LocalBusiness`/`ProfessionalService` falls noch nicht vorhanden — nicht erfinden, nur prüfen und mich fragen, falls Daten fehlen.

### Phase 6 — Verifikation
- Lighthouse-Run (Mobile + Desktop) vor/nach in `docs/perf-baseline.md` dokumentieren.
- Bundle-Analyzer-Output committen.
- Visual-Regression: Screenshots von Hero, Approach, Pillars, Packages, Footer vor/nach vergleichen und in `docs/visual-diff.md` ablegen.

## Arbeitsweise mit mir
- Bei jeder Phase: **erst kurzer Plan im Chat, dann auf Freigabe warten**, dann umsetzen.
- Wenn du eine Annahme treffen musst, frag nach — keine erfundenen Inhalte, keine erfundenen Markenfarben.
- Keine Dependencies hinzufügen ohne Begründung.
- Jede neue Datei kurz im Kopf-Kommentar erklären.
- Am Ende jeder Phase: 1-Satz-Changelog für `CHANGELOG.md`.

## Definition of Done
- Alle Performance-Ziele erreicht und in `docs/perf-baseline.md` belegt.
- Visuell deckungsgleich oder besser als vorher.
- `prefers-reduced-motion` und Save-Data respektiert.
- Neue Animationen können in <30 Zeilen Code über das `src/anim/`-System hinzugefügt werden, dokumentiert in `docs/anim-guide.md`.
- README aktualisiert: lokale Entwicklung, Build, Deploy, Performance-Budget.

Bitte starte mit **Phase 0** und melde dich mit dem Plan, bevor du Code änderst.