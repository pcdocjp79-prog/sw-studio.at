# Code Review Bugliste

Aktualisiert am: 2026-04-30

Diese Datei fasst die zuletzt geprueften Findings zusammen. Behobene Punkte bleiben kurz sichtbar, damit spaeter nachvollziehbar ist, warum Code und Dokumentation geaendert wurden.

## Behoben im sicheren Cleanup

1. Repo-Check erwartete noch Tailwind-CDN

- `scripts/check-repo.mjs` prueft jetzt die lokale Tailwind/PostCSS-Architektur.
- Erwartet werden `src/css/style.css` und `src/css/tailwind.css`; `tailwind.css` muss wegen der Utility-Cascade das letzte Stylesheet sein.
- Tailwind Play-CDN und `window.tailwind.config` werden als entfernte Runtime-Altlasten gemeldet.

2. API behandelte Resend-Netzwerkfehler nicht sauber

- `api/contact.js` faengt `fetch()`-Fehler beim Resend-Aufruf ab und antwortet weiter mit dem bestehenden JSON-Fehlertext.
- Methode, Payload, ENV-Variablen und Erfolgsantworten bleiben unveraendert.

3. Toter Navigations- und CSS-Code

- `initActiveSectionObserver()` wurde entfernt, weil im Projekt kein `[data-nav-section]`-Markup existiert.
- Ungenutzte CSS-Zweige fuer `.scroll-focus-section.is-visible.is-in-focus` und `.jump-nav--inline` wurden entfernt.
- Die aktive Jump-Nav ueber `.jump-nav--section` bleibt unveraendert.

4. Tailwind-/Sass-Altlasten

- `tailwind-config.js` und abgeschlossene One-shot-Migrationsscripts wurden entfernt.
- `sass` wurde aus `package.json`/`package-lock.json` entfernt; es gibt keine `.scss`/`.sass`-Quellen im Projekt.

5. Textdoku-Entity-Decoding

- `scripts/generate-site-text-doc.mjs` decodiert nun deutsche HTML-Entities wie `&uuml;`, `&auml;`, `&ouml;` und `&szlig;`.
- `website-texte-komplett.md` wurde neu generiert.

## Bewusst offen

1. Kontaktformular im reinen Vite-Dev-Server

- `kontakt.html` sendet an `/api/contact`, was in der Produktion von Vercel bereitgestellt wird.
- Der reine Vite-Dev-Server emuliert diese API-Route nicht. Fuer lokale End-to-End-Formulartests braucht es Vercel Dev oder eine eigene API-Proxy-Loesung.

2. Three.js-Performance-Refactor

- `index.html` laedt Three.js weiterhin per CDN und `src/js/water-sphere.js?v=5`.
- Der groessere Refactor auf Vite-Bundling/Dynamic Import ist weiterhin ein separater Performance-Schritt.

3. Grosse ungenutzte Assets

- Die grossen Asset-Kandidaten bleiben im Repo und werden in diesem Cleanup nicht geloescht.
- Vor dem Loeschen sollten Nutzung, Historie und ggf. Backup-Wert separat bestaetigt werden.

## Verifikation

- `npm run check`
- `npm run build`
- `npm ls --depth=0`
