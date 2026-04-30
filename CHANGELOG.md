# Changelog

Alle nennenswerten Änderungen am Projekt werden hier dokumentiert.
Format orientiert an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## [Unreleased]

### Added
- **Performance-Refactor Phase 0**: Bestandsaufnahme `docs/perf-baseline.md` und Umsetzungsplan `docs/perf-plan.md` für den geplanten Refactor von Tailwind-CDN, Three.js-Loading und Animations-System (vgl. `prompts/perf-refactor.md`).
- **Performance-Refactor Phase 1**: Tailwind als ordentlicher PostCSS-Build-Step integriert (Play-CDN aus 23 HTML-Seiten entfernt, JIT-Purging via `tailwind.config.js` content-Pfade, +`postcss.config.js`, +`src/css/tailwind.css`). Bundle-Transfer −123 KB, FCP −1.94 s, LCP −1.02 s, Speed Index −2.30 s.

### Fixed
- **Sicherer Cleanup & Doku-Abgleich**: Repo-Check auf lokale Tailwind/PostCSS-Architektur aktualisiert, Nav-Logos mit festen Bildmassen versehen, Resend-Netzwerkfehler sauber abgefangen, tote Tailwind-/Sass-/Navigation-/CSS-Altlasten entfernt und Dokumentation an den aktuellen Codezustand angepasst.
- **Phase 1 CSS-Cascade**: `tailwind.css` ans Ende von `<head>` verschoben, damit Tailwind-Utilities (z. B. `h-8 md:h-10` am Logo, `px-4 sm:px-6 lg:px-8` an Sektionen) wieder über `style.css`-Regeln (`img { height: auto }`, `.nav-link { padding: … }`) gewinnen — entspricht der ursprünglichen CDN-Semantik, in der das CDN-Script seinen `<style>`-Block ans Ende des `<head>` injizierte.
