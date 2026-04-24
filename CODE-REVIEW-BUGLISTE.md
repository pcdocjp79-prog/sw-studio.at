# Code Review Bugliste

Erstellt am: 2026-04-23

Diese Datei enthaelt die Ergebnisse der letzten vollstaendigen Code-Analyse.
Sie ist absichtlich klar benannt, damit sie spaeter leicht wiedergefunden werden kann.

## Wichtige Findings

### Hoch

1. Kontaktformular lokal nicht voll funktionsfaehig

- Das Formular ist fest auf `/api/contact` eingestellt.
- Das Projekt nutzt lokal nur `vite`, aber keine erkennbare API-Emulation oder Proxy-Konfiguration fuer diesen Endpoint.
- Dadurch ist der wichtigste Formular-Flow unter `npm run dev` bzw. einfachem statischem Serving sehr wahrscheinlich nicht voll nutzbar.
- Relevante Stellen:
  - `kontakt.html:185`
  - `src/js/main.js:505`
  - `vite.config.js:4`
  - `README.md:34`

### Mittel

2. API behandelt Netzwerkfehler beim Mailversand nicht sauber

- In `api/contact.js` wird nur `!resendResponse.ok` behandelt.
- Wenn `fetch()` selbst fehlschlaegt, zum Beispiel bei DNS-, TLS- oder Timeout-Problemen, gibt es keinen sauber abgefangenen JSON-Fehlerpfad.
- Das kann zu unklaren Fehlern im Frontend oder unsauberen Serverantworten fuehren.
- Relevante Stelle:
  - `api/contact.js:116`

3. Hero-Sphere laeuft weiter, obwohl sie mobil per CSS verborgen ist

- Die WebGL-Sphere wird unter `1024px` per CSS ausgeblendet.
- Das zugehoerige JavaScript laeuft aber weiter und verarbeitet weiterhin Pointer- und Render-Logik.
- Das ist unnoetige Last fuer CPU/GPU und kann bei `0`-Breite oder `0`-Hoehe zu ungueltigen Koordinaten fuehren.
- Relevante Stellen:
  - `src/css/hero-sphere.css:47`
  - `src/js/water-sphere.js:236`
  - `src/js/water-sphere.js:261`

### Niedrig

4. Exportskript decodiert HTML-Entities nur teilweise

- Die generierte Textdokumentation enthaelt bereits Zeichenfolgen wie `&uuml;` statt echte Umlaute.
- Ursache ist eine unvollstaendige Entity-Decodierung im Skript.
- Relevante Stellen:
  - `scripts/generate-site-text-doc.mjs:161`
  - `website-texte-komplett.md:252`

## Unnoetiger oder vermutlich toter Code

1. Unbenutzter Active-Section-Observer in der Navigation

- `initActiveSectionObserver()` sucht nach `[data-nav-section]`.
- Fuer diese Verwendung wurden in den Quell-HTML-Dateien keine aktiven Treffer gefunden.
- Relevante Stelle:
  - `src/scripts/modules/navigation.js:612`

2. Deaktiviertes 3D-Background-Feature bleibt im Runtime-Code enthalten

- `animatedBackgroundModelPath` ist leer.
- Dadurch beendet sich die Funktion sofort, aber der Codepfad und der Platzhalter `#animated-background` bleiben im Projekt.
- Relevante Stellen:
  - `src/js/main.js:7`
  - `src/js/main.js:12`
  - `index.html:42`

3. Doppelte bzw. wahrscheinlich ungenutzte Tailwind-Konfigurationsdateien

- Die aktive Tailwind-Konfiguration wird inline in den HTML-Dateien gesetzt.
- Zusaetzlich existieren `tailwind.config.js` und `tailwind-config.js`.
- Beide wirken derzeit redundant oder ungenutzt.
- Relevante Stellen:
  - `tailwind.config.js:1`
  - `tailwind-config.js:1`
  - `index.html:19`

4. `sass` als Dependency ohne `.scss`-Dateien im Projekt

- In `package.json` ist `sass` eingetragen.
- Im Projekt wurden keine `.scss`-Dateien gefunden.
- Relevante Stelle:
  - `package.json:13`

5. Wahrscheinlich ungenutzte CSS-Pfade

- `.js .scroll-focus-section.is-visible.is-in-focus`
- `.jump-nav--inline`
- Fuer diese Selektoren wurden ausserhalb von `style.css` keine aktiven Verwendungen gefunden.
- Relevante Stellen:
  - `src/css/style.css:1000`
  - `src/css/style.css:3909`

## Verifikation

- `npm run check`: erfolgreich
- `npm run build`: erfolgreich

## Hinweis

Am Projektcode selbst wurde waehrend dieser Analyse nichts geaendert.
Diese Datei dient nur als gespeicherte Review-Notiz.
