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

## Block-Builder-Erweiterung (2026-05-02)

Strategischer Pivot: Statt statischer Preview-Sektionen verwaltet der Konfigurator jetzt einen modularen Block-Builder mit vordefinierten Layout-Templates. Das schuetzt das Designniveau und gibt dem Nutzer trotzdem strukturelle Kontrolle.

- [Done] State-Refactoring: `internal.form` (globale Auswahl) + `internal.sections` Array (`{ id, type, theme, content, edited }`). Top-Level Proxy triggert rAF-gebatchtes `renderAll()` bei Strukturmutationen.
- [Done] Modulare Templates als Vanilla-JS-Funktionen: `renderHero`, `renderText`, `renderFeature` mit Tailwind-Klassen; `wrapSection` injiziert Hover-Controls (`group-hover:opacity-100`).
- [Done] Sortier- und Theme-Logik: `moveSectionUp/Down`, `deleteSection` (mit Mindest-1-Section-Schutz), `toggleSectionTheme` (Light/Dark via `bg-white text-black` vs `bg-zinc-900 text-white`).
- [Done] UI-Controls: Sektion-04-Bereich in der Form mit Buttons `+ Text-Modul` und `+ Feature-Modul`. Hero-Sektion ist initial gesetzt und nicht entfernbar.
- [Done] Briefing-Payload: `buildBriefingMessage` listet nun alle Sektionen mit Index, Typ, Theme und Headline (`1. Hero (Dark) - "..."`).
- [Done] Editable-Felder: Event-Delegation auf `[data-editable]` mit `data-section-id` + `data-field`-Pfaden (auch verschachtelt fuer Feature-Items wie `items.0.title`). Re-Render erhaelt fokussierte Sektion (Survivor-Pattern), damit Tipp-Cursor nicht verloren geht.
- [Done] HTML aktualisiert: `[data-sections-root]` ersetzt statisches `__hero`/`__grid`. Add-Buttons unter `[data-add-section-controls]`.
- [Done] CSS ergaenzt: `.configurator-block`, `.configurator-block__ctrl` (rounded Pills mit Accent-Hover), `.configurator-editable:focus` Outline.
- [Done] Validierung: `node --check src/js/configurator.js`, `npm run check`, `npm run build` (Konfigurator-Chunk 10.91 kB).

## Strategisches Refactoring: Premium-Presets & Reaktivitaets-Fixes (2026-05-02)

- [Done] Bugfix Append-Order: `addSection` nutzt explizit `arr.push(factory())` und kommentiert die Garantie. Neue Module landen unten.
- [Done] Bugfix Theme-Toggle-Reaktivitaet: Survivor-Pattern beim Re-Render greift jetzt nur, wenn das aktive Element ein `[data-editable]` ist. Klicks auf die Control-Buttons fuehren zum vollstaendigen Re-Render und damit zum sofortigen Klassen-Update. Theme zykliert `brand -> light -> dark -> brand` und schreibt das Array via `state.sections = next` zurueck (Proxy-Setter triggert `queueRender`).
- [Done] Feature Typografie: `Ziel` wurde durch `Typografie` ersetzt (`name="typography"` mit `inter`/`geist`/`mono`). State-Feld `typography` setzt `--preview-font` auf dem Preview-Root, das Screen-CSS uebernimmt die Schrift global.
- [Done] Feature Brand Identity: Akzent-Color-Picker entfernt. Neuer Fieldset-Block mit fuenf kuratierten Presets (`monochrome-dark`, `clean-studio`, `deep-blue`, `neon-cyber`, `soft-editorial`). Jedes Preset liefert `bg`/`text`/`accent` und schreibt `--preview-bg`, `--preview-text`, `--preview-accent` sowie `--cfg-accent` aufs Preview-Board. Color-Swatches in den Radio-Labels ueber `inline-block` Tailwind-Pills.
- [Done] Sektions-Theme-Modell auf `brand`/`light`/`dark` erweitert: `brand` = transparent (zeigt das Preset durch), `light` = `bg-white text-black`, `dark` = `bg-zinc-900 text-white`. Standard fuer neue Module ist `brand`, damit das Preset wirkt.
- [Done] UX-Klaerung Metadaten: Helper-Text `Dient zur Kalkulation deines Briefings.` unter dem Zielgruppe/Umfang-Grid (`text-xs text-white/50 italic`).
- [Done] Briefing-Payload aktualisiert: Felder Typografie, Brand (Label + Hex-Werte), Stil, Umfang, Zielgruppe, Ton, Dichte, Sektionsliste mit `Brand`/`Light`/`Dark` Theme-Markern.
- [Done] Summary-`<dl>` umgestellt: `Typografie` / `Brand` / `Umfang` mit `data-summary-typography`, `data-summary-brand`, `data-summary-scope`.
- [Done] CSS: Preview-Screen verwendet `var(--preview-bg)` und `var(--preview-text)` mit Fallback auf bisherigen Gradient; Akzent-Glow wurde leicht reduziert, damit Brand-Presets sauber durchziehen.
- [Done] Validierung: `node --check src/js/configurator.js`, `npm run check`, `npm run build` (Konfigurator-Chunk 11.06 kB, gzip 4.55 kB).

## Branchen-Hero mit dynamischem Bild & Overlay (2026-05-02)

- [Done] Branchen-Logik: Neuer Fieldset-Block `Branche` in Sektion 01 mit drei Radio-Buttons (`consulting` als Default, `tourismus`, `gastronomie`). State-Feld `industry` an `FORM_FIELD_NAMES` und `DEFAULT_FORM_STATE` angebunden.
- [Done] `INDUSTRY_OPTIONS` Map in `configurator.js` haelt Label und Bildpfad pro Branche.
- [Done] Hero-Render erweitert: drei gestapelte Layer im `relative`-Wrapper - (1) absolutes Bild-Layer mit `bg-cover bg-center bg-no-repeat` und `transition-[background-image]`, (2) Overlay-Layer `bg-gradient-to-t from-gray-900/90 to-gray-900/40`, (3) Content-Layer mit `relative z-10 text-white`. Die Controls liegen auf `z-20`, damit Hover-Aktionen nicht unter dem Overlay verschwinden.
- [Done] Hero-Wrapper-Spezialfall: `renderSection` setzt fuer Hero-Sektionen `min-h-[18rem] overflow-hidden` und unterdrueckt die Theme-Klassen (Hero ist immer image-driven). Theme-Button wird auf Hero-Sektionen ausgeblendet (`hideTheme`-Flag).
- [Done] Flackerfreies Bildwechseln: Drei `<link rel="preload" as="image" data-industry="...">` Tags in `webentwicklung.html` laden die Bilder bereits beim HTML-Parsing. Vorteil ueber blossen `Image()`-Preload: Vite fingerprintet die URLs beim Build (Cache-Busting via `hero-consulting-B2zqWrK2.webp` etc.) und kopiert sie sauber nach `dist/assets/`. Beim Init liest der Konfigurator die finalen URLs aus den `link.href`-Werten und ueberschreibt `INDUSTRY_OPTIONS[key].image`. Defensive `new Image()`-Schleife bleibt als Fallback.
- [Done] Briefing-Payload um `Branche: <Label>` ergaenzt.
- [Done] Validierung: `node --check src/js/configurator.js`, `npm run check`, `npm run build`. Build kopiert `hero-consulting-*.webp`, `hero-gastronomie-*.webp`, `hero-tourismus-*.webp` in `dist/assets/` (Konfigurator-Chunk 12.14 kB, gzip 4.97 kB).

## Architektur-Fix: Hero als fester Anker, Full-Width-Preview (2026-05-02)

Strategischer Pivot: Die Preview soll nach Browser-Window aussehen, nicht nach Baukasten. Hero wird aus dem sortierbaren Array herausgeloest und full-bleed gerendert, Module verlieren ihre Karten-Optik.

- [Done] Hero-Anker: `internal.hero = { edited, content }` lebt jetzt OUTSIDE `internal.sections`. `createInitialHero` ersetzt `createInitialHeroSection`. Sections-Array startet leer.
- [Done] Render-Pipeline: `renderSections()` rendert ZUERST `renderHero(internal.hero, globals)` und konkateniert danach die Modul-HTMLs. Hero ist somit hartcodiert oben, immer sichtbar, nicht verschiebbar/loeschbar.
- [Done] Hero-Template full-bleed: `<section class="relative w-full min-h-[60vh] rounded-none m-0 border-0 overflow-hidden">` mit drei sauber gestapelten Layern - Image-Layer (`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat`), Overlay-Layer (`absolute inset-0 z-0 bg-gradient-to-t from-gray-900/90 to-gray-900/40`, exakt selbe Maße), Content-Layer (`relative z-10 flex flex-col items-start justify-center h-full min-h-[60vh] px-12 py-16 text-white max-w-3xl`).
- [Done] Hero-Editing: separate `data-section-id="hero"` Sentinel-ID. Input-Handler prueft `id === HERO_SECTION_ID` und schreibt direkt in `internal.hero.content` (mit `edited`-Flag). Survivor-Pattern beim Re-Render funktioniert weiterhin, weil Hero ebenfalls ein `[data-section-id]`-Attribut hat.
- [Done] Modul-Templates ohne Margins/Borders/Rounded: `<section class="w-full m-0 border-0 rounded-none px-12 py-14 ${themeClasses}">`. Inneres Centering ueber `mx-auto w-full max-w-3xl` (Text) bzw. `max-w-5xl` (Feature). Feature-Items haben statt `rounded-xl border` jetzt nur `border-t border-current/20 pt-4` als editorial-stripe.
- [Done] Theme-Klassen entkernt: `themeClasses` liefert nur noch `bg-white text-black` / `bg-zinc-900 text-white` / `bg-transparent` ohne Border, da Module jetzt grundsaetzlich kein border haben.
- [Done] Preview-Container nahtlos: HTML-Klassen am Sections-Container `flex flex-col w-full h-full overflow-y-auto bg-transparent gap-0 p-0`. Topbar bekommt eigenes `px-4 py-3`. CSS-Regel `.configurator-preview__screen` umgestellt von `display: grid; padding: clamp(...); gap: var(--cfg-density)` auf `display: flex; flex-direction: column; padding: 0; gap: 0` (Border + Border-Radius + Hintergrund + `overflow:hidden` bleiben fuer den Browser-Frame-Look). Min-Height auf `clamp(28rem, 60vh, 44rem)` angehoben.
- [Done] CSS aufgeraeumt: `.configurator-preview__sections` ist jetzt `flex: 1 1 auto; min-height: 0`. Hover-Border-Effekt am `.configurator-block` entfernt (passt nicht mehr zum borderless Layout).
- [Done] Briefing-Payload: `buildBriefingMessage` nimmt `hero` als drittes Argument und listet Hero als fixe Position 1 (`1. Hero (fix) - "..."`), gefolgt von den Modulen ab Position 2.
- [Done] Validierung: `node --check src/js/configurator.js`, `npm run check`, `npm run build` (Konfigurator-Chunk 12.65 kB, gzip 5.11 kB; Hero-Bilder weiterhin via `<link rel="preload">` fingerprintiert in `dist/assets/`).

## Nächster Schritt

Browser-Review: pruefen, dass die Hero-Sektion oben Kante an Kante anliegt, das Hintergrundbild die volle Hero-Hoehe (60vh) ausfuellt, das Overlay den Bildbereich exakt deckt und Headline/Subline lesbar im Vordergrund sitzen. Module hinzufuegen und sehen, dass sie nahtlos unter dem Hero stapeln (kein sichtbarer Spalt, keine Card-Optik). Briefing-Uebergabe an `kontakt.html` final verifizieren (Hero als Position 1, Module ab Position 2).
