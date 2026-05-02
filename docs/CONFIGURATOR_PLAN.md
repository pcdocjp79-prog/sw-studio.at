# Design-Konfigurator Plan

## Projekt-Vision & Architektur

Der Design-Konfigurator wird als performanter Lead-Magnet ausschliesslich auf `webentwicklung.html` integriert. Das Projekt bleibt eine statische Vite-MPA mit HTML5, Vanilla JavaScript als ES Modules, lokal gebautem Tailwind/PostCSS und page-scoped Styling ueber `body[data-page="webentwicklung"]`.

Die Integration besteht aus einer eigenen Section `#design-konfigurator`, einem lazy geladenen Modul `src/js/configurator.js` und isolierten `.configurator-*` Styles in `src/css/style.css`. Der Konfigurator nutzt einen flachen Proxy-State, aktualisiert die Preview rAF-gebatcht ueber CSS-Variablen am Preview-Root und uebergibt den Entwurf ueber den bestehenden Session-Storage-Prefill an `kontakt.html#kontaktformular`.

## Aktueller Status

- [Done] Workspace-Check abgeschlossen: `webentwicklung.html`, `src/js/main.js`, `src/css/style.css`, `src/css/tailwind.css`, `api/contact.js` und Vite-Konfiguration wurden validiert.
- [Done] Architekturentscheidung getroffen: page-gated Dynamic Import aus `src/js/main.js` statt globalem Bundle-Zuwachs.
- [Done] Setup-Implementierung erstellt: Markup, Lazy-Bootstrap, Proxy-State, Preview, Styles und API-Erweiterung sind integriert.
- [Done] `npm run check` bestanden: HTML-Einstiege, Anker, Formular-Hooks und lokale Targets sind valide.
- [Done] `npm run build` bestanden: Vite/Rollup baut den Konfigurator als separaten Chunk.
- [Done] Dev-Server gestartet: `http://127.0.0.1:4173/webentwicklung.html#design-konfigurator`.
- [Done] HTTP-Smoke-Check bestanden: Seite liefert 200 und enthaelt `[data-configurator]`; `src/js/configurator.js` liefert 200.
- [Done] API-Syntaxcheck bestanden: `node --check api/contact.js`.
- [Done] Interaktivitaets-Update umgesetzt: freie Akzentfarbe per Color-Picker, editierbare Preview-Headline und aktualisierte Briefing-Uebergabe.
- [Done] Validierung nach Interaktivitaets-Update bestanden: `node --check src/js/configurator.js`, `node --check api/contact.js`, `npm run check`, `npm run build`, HTTP-Smoke-Check.
- [Done] Lead-Strategie umgestellt: kein separates Konfigurator-Formular mehr; CTA speichert `messageValue` unter `sessionStorage["sws-contact-prefill"]` und leitet zur bestehenden Kontaktseite.
- [Done] `api/contact.js` wieder als zentraler Kontaktformular-Endpunkt ohne Konfigurator-Sonderpayload belassen.

## Roadmap / Meilensteine

- [Done] Single Source of Truth anlegen
- [Done] UI-Integration in `webentwicklung.html`
- [Done] Jump-Nav um `#design-konfigurator` erweitert
- [Done] Lazy Bootstrap in `src/js/main.js` ergaenzt
- [Done] `src/js/configurator.js` mit Proxy-State, Event Delegation und rAF-Preview erstellt
- [Done] Preview-Logik mit CSS-Variablen `--cfg-accent`, `--cfg-radius`, `--cfg-density`, `--cfg-contrast`, `--cfg-motion`
- [Done] Lead-Uebergabe auf bestehende Kontaktseite umgestellt
- [Done] Session-Storage-Vertrag aus `src/js/main.js` genutzt: Key `sws-contact-prefill`, Felder `projectValue`, `timelineValue`, `messageValue`
- [Done] Page-scoped Konfigurator-Styles in `src/css/style.css`
- [Done] Tests: `npm run check`, `npm run build`, HTTP-Smoke-Check, API-Syntaxcheck
  - [Done] `npm run check`
  - [Done] `npm run build`
  - [Done] HTTP 200 fuer `webentwicklung.html#design-konfigurator`
  - [Done] HTTP 200 fuer `src/js/configurator.js`
  - [Done] `node --check api/contact.js`
- [Done] Interaktivitaet erweitern
  - [Done] Dropdown-Akzent durch nativen Color-Picker ersetzt
  - [Done] Hex-Farbwert in Proxy-State und Preview-CSS-Variablen `--preview-accent` / `--cfg-accent` angebunden
  - [Done] Preview-Headline per `contenteditable` direkt editierbar gemacht
  - [Done] Individuelle Headline im lesbaren Konfigurator-Text fuer `messageValue` enthalten
  - [Done] Checks nach Update: `node --check src/js/configurator.js`, `node --check api/contact.js`, `npm run check`, `npm run build`
- [Done] Redundanten Submit-Pfad entfernen
  - [Done] Kontaktfelder aus Sektion 03 entfernt
  - [Done] Prominenter CTA `Konfiguration uebernehmen & besprechen` eingebaut
  - [Done] Direkter `fetch` aus `src/js/configurator.js` entfernt
  - [Done] Redirect auf `kontakt.html#kontaktformular` implementiert
  - [Done] HTTP-Smoke-Check: Konfigurator-Seite enthaelt neuen CTA, keine alten Kontaktfelder; `configurator.js` enthaelt Prefill-Key und keinen `fetch(`

## Nächster Schritt

Naechste Programmieraufgabe: Browser-Review der Uebergabe durchfuehren: CTA klicken, Kontaktseite pruefen, ob Projektart `Webentwicklung`, Zeitplan `Noch offen` und der formatierte Konfigurator-Entwurf im Nachrichtenfeld sichtbar sind.
