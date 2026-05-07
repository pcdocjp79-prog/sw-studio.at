# CLAUDE.md — Smart Web Studio (sw-studio.at)

## Projekt-Überblick

Dies ist die Website von **Smart Web Studio**, einer Solo-Agentur aus Vorarlberg (DACH-Raum).
Angebot: High-End Websites, Branding und SEO.
Die Firma befindet sich im Aufbau — es gibt noch keine Kundenprojekte.

**Ziel:** Die Website auf Award-Winner-Niveau bringen (Awwwards/SOTD).
**Referenz-Ästhetik:** linear.app, resend.com, basement.studio, stripe.com, framer.com

## Tech-Stack

- **Typ:** Statische Multi-Page Website (kein SPA, kein Framework)
- **HTML:** 15 Seiten (alle in der Projekt-Wurzel)
- **CSS:** `src/css/style.css` (Hauptstylesheet) + `src/css/tailwind.css` via lokalem PostCSS/Tailwind-Build
- **JS:** `src/js/main.js` (globale Logik) + `src/scripts/modules/` (Navigation, Cookies etc.)
- **Build:** Vite + `vite-plugin-beasties` (Critical-CSS-Inlining beim Production-Build)
- **Fonts:** Inter, Geist, JetBrains Mono — lokal in `assets/fonts/` (DSGVO-konform, kein Google CDN)
- **Deployment:** Vercel
- **API:** `api/contact.js` (Kontaktformular via Resend)

## Projektstruktur

```
DRAFT-MAIN/
├── index.html                  # Startseite
├── leistungen.html             # Leistungsübersicht
├── webentwicklung.html         # Service-Detail
├── branding.html               # Service-Detail
├── seo-marketing.html          # Service-Detail
├── social.html                 # Service-Detail
├── growth.html                 # Service-Detail
├── ki-beratung.html            # Service-Detail
├── ablauf.html                 # Projektablauf
├── kontakt.html
├── danke.html                  # Bestätigungsseite nach Formular
├── impressum.html
├── datenschutz.html
├── cookies.html
├── marketing.html              # Legacy-Redirect → seo-marketing.html
├── src/
│   ├── css/
│   │   ├── style.css           # ← Haupt-Stylesheet
│   │   ├── tailwind.css        # @tailwind-Direktiven (Build-Eingang)
│   │   ├── typography.css      # via @import in style.css
│   │   ├── grain-overlay.css   # via @import in style.css
│   │   ├── hero-sphere.css     # nur in index.html
│   │   ├── hero-text-reveal.css # nur in index.html
│   │   ├── word-rotator.css    # nur in index.html
│   │   └── feature-chip.css    # nur in index.html
│   ├── js/
│   │   ├── main.js             # ← Globale Interaktionslogik (auf allen Seiten)
│   │   ├── water-sphere.js     # WebGL-Hero-Sphere (nur index.html, Three.js via CDN)
│   │   ├── word-rotator.js     # Hero-Textrotation (nur index.html)
│   │   └── configurator.js     # Lazy via dynamic import (nur webentwicklung.html)
│   └── scripts/
│       └── modules/
│           ├── navigation.js   # Nav, Footer, Sticky-CTA, Link-Normalisierung
│           └── cookieConsent.js # Cookie-Banner + Panel
├── assets/
│   ├── fonts/                  # Inter, Geist, JetBrains Mono (.woff2)
│   └── images/                 # Logo, Hero-Branchenbilder, Portraits
├── api/
│   └── contact.js              # Formular-Backend (Resend)
├── docs/
│   └── upgrade-plan.md         # ← Der Upgrade-Plan (lies diesen!)
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js              # inkl. Beasties-Plugin
└── CLAUDE.md                   # ← Diese Datei
```

## Wichtige Konventionen

- Jede HTML-Seite hat ein `data-page`-Attribut (z.B. `data-page="home"`)
- Navigation und Footer werden via `navigation.js` per JavaScript gerendert
- Tailwind wird lokal über `tailwind.config.js`, `postcss.config.js` und `src/css/tailwind.css` gebaut
- `tailwind.css` wird nach `style.css` geladen, damit Utilities die erwartete Cascade behalten
- Im Production-Build extrahiert Beasties pro Seite das Critical CSS automatisch und inlined es in den `<head>`. Restliches CSS wird via `preload` + `onload`-Swap async nachgeladen. Im Dev-Server (`npm run dev`) ist Beasties NICHT aktiv — CSS bleibt dort render-blocking

---

## ARBEITSREGELN — UNBEDINGT EINHALTEN

### 1. Ein Schritt nach dem anderen
- Immer nur EINEN Upgrade-Schritt gleichzeitig umsetzen
- Nie mehrere Änderungen auf einmal
- Jeder Schritt muss eigenständig testbar und deploybar sein
- Der Nutzer sagt dir welcher Schritt als nächstes dran ist

### 2. Kein Breaking Change
- Bestehende Funktionalität darf nie kaputtgehen
- Jede Änderung muss rückgängig machbar sein
- Teste gedanklich: "Funktioniert die Seite noch wenn ich diese Änderung entferne?"

### 3. Modularer Aufbau
- Neue Features als eigenständige Dateien wenn möglich (eigene .js oder .css)
- Beispiel: `src/js/cursor.js`, `src/css/grain-overlay.css`
- In der HTML-Datei einfach per `<script>` oder `<link>` einbinden

### 4. Performance
- Kein unnötiges JavaScript
- CSS-Animationen bevorzugen wo möglich (statt JS)
- Alle Animationen müssen `prefers-reduced-motion` respektieren:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

### 5. Kein Framework-Wechsel
- Die bestehende Struktur bleibt: HTML + CSS + Vanilla JS
- Kein React, Vue, Svelte etc.
- Tailwind bleibt lokal gebaut; kein Play-CDN und keine Inline-Tailwind-Konfiguration in den HTML-Dateien

### 6. Design-Qualität
- Präzise Typografie, subtile Bewegung, viel Whitespace
- Starke visuelle Hierarchie — kein Overdesign
- Wenn unsicher: weniger ist mehr

---

## UPGRADE-PLAN — Reihenfolge

Der vollständige Plan mit Code-Beispielen liegt in `docs/upgrade-plan.md`.
Hier die Kurzübersicht der Schritte:

| # | Was | Aufwand | Impact |
|---|-----|---------|--------|
| 1 | Typografie-System (Clash Display + Inter) | Klein | Hoch |
| 2 | Grain/Noise Overlay | Sehr klein | Mittel |
| 3 | Scroll Reveal Animationen | Klein | Hoch |
| 4 | Hero Marquee Band | Klein | Hoch |
| 5 | Custom Cursor | Mittel | Mittel |
| 6 | Texte überarbeiten (informieren statt überzeugen) | Groß | Sehr hoch |
| 7 | Navigation straffen (8→5 Punkte) | Mittel | Hoch |
| 8 | Card Tilt Effekt | Klein | Mittel |
| 9 | FAQ Sektionen | Klein | Hoch |
| 10 | Visuelles Projektgrid | Groß | Sehr hoch |
| 11 | Stack & Tools Section | Klein | Mittel |
| 12 | Testimonials | Klein | Sehr hoch |
| 13 | Performance & Meta Tags | Mittel | SEO-wichtig |

**Wichtig:** Der Nutzer gibt dir den Schritt vor. Lies dann die Details in `docs/upgrade-plan.md`.

---

## WIE DU ARBEITEN SOLLST

Wenn der Nutzer sagt z.B. "Mach Schritt 2":

1. Lies die Details zu Schritt 2 in `docs/upgrade-plan.md`
2. Erkläre kurz was du machen wirst (2-3 Sätze)
3. Erstelle die nötigen Dateien / Änderungen
4. Sage was danach zu testen ist
5. Warte auf Bestätigung bevor du weitermachst

## WAS DU NICHT TUN SOLLST

- Nie eigenständig den nächsten Schritt starten
- Nie mehrere Schritte zusammenfassen
- Nie die Projektstruktur grundlegend ändern
- Nie Abhängigkeiten installieren ohne zu fragen
- Nie bestehende Dateien komplett überschreiben — nur gezielt ändern
