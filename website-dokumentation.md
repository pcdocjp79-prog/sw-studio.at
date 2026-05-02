# Website-Dokumentation: Smart Web Studio

Erstellt am 2026-03-21. Diese Datei dokumentiert den aktuellen Stand der Website im Ordner `Draft-main` so, dass die Seite reproduzierbar nachgebaut werden kann. Grundlage sind die produktiven HTML-Seiten, die globale JavaScript-Logik und die API-/CSS-Dateien im Projekt.

## 1. Projektueberblick

- Website-Typ: statische Multi-Page-Website mit HTML-Entrypoints statt SPA-Routing.
- Aktiver Frontend-Runtime-Pfad: `*.html` + `src/js/main.js` + `src/css/style.css` + `src/css/tailwind.css`.
- Build/Dev: Vite ist vorhanden, die Seiten funktionieren aber auch direkt als statische HTML-Dateien.
- Gesamtumfang: 24 HTML-Seiten (20 Root-Seiten, 4 Projekt-Unterseiten).
- API-Endpunkt: `POST /api/contact` ueber `api/contact.js`.

## 2. Relevante Projektstruktur

- `index.html`: Startseite
- `leistungen.html`: Leistungsuebersicht
- `webentwicklung.html`, `branding.html`, `seo-marketing.html`, `social.html`, `growth.html`, `ki-beratung.html`: Service-Detailseiten
- `projekte.html`: Projektuebersicht mit Filterlogik
- `projekte/*.html`: vier Projekt-Unterseiten
- `case-study.html`: anonymisierte Case Study
- `ablauf.html`, `preise.html`, `ueber-mich.html`, `insights.html`, `kontakt.html`: Kernseiten
- `danke.html`: Erfolg-/Weiterleitungsseite nach Formularversand
- `impressum.html`, `datenschutz.html`, `cookies.html`: rechtliche Seiten
- `marketing.html`: Legacy-Redirect auf `seo-marketing.html`
- `src/js/main.js`: globale Interaktionslogik
- `src/scripts/modules/navigation.js`: Navigation, Footer, Sticky-CTA, Link-Normalisierung
- `src/scripts/modules/cookieConsent.js`: Cookie-Banner und Cookie-Settings-Panel
- `src/css/style.css`: gesamtes Styling
- `src/css/tailwind.css`: lokaler Tailwind/PostCSS-Entry
- `src/js/water-sphere.js`: Home-Hero-WebGL-Sphere
- `src/js/word-rotator.js`: Home-Hero-Textrotation
- `api/contact.js`: Formular-Backend via Resend
- `assets/`: Logo und Portraitbilder

## 3. Gemeinsame technische Basis

### 3.1 Head-Aufbau

- Fast alle Seiten laden Google Fonts mit `Inter`, `Geist` und `JetBrains Mono`.
- Tailwind wird lokal ueber PostCSS/Vite aus `src/css/tailwind.css` gebaut; die HTML-Dateien enthalten keine Tailwind-CDN- oder Inline-Tailwind-Konfiguration mehr.
- Das globale Styling besteht aus `src/css/style.css` und `src/css/tailwind.css`; auf Projekt-Unterseiten entsprechend `../src/css/style.css` und `../src/css/tailwind.css`.
- `tailwind.css` wird nach den projektspezifischen Stylesheets geladen, damit Utility-Klassen die erwartete Cascade behalten.
- Die Standardseiten laden am Ende `src/js/main.js`; Projekt-Unterseiten laden `../src/js/main.js`.
- `index.html` laedt zusaetzlich `src/js/water-sphere.js?v=5` und `src/js/word-rotator.js`.
- Die vier Projekt-Unterseiten setzen zusaetzlich `<base href="../" />`, damit Root-Links aus dem Unterordner korrekt funktionieren.

### 3.2 Body-/Runtime-Konventionen

- Jede Seite traegt ein `data-page`-Attribut; darueber identifiziert `navigation.js` die aktuelle Seite.
- Der Home-Body nutzt `data-page="home"`; Service- und Projektseiten haben eigene Keys wie `branding` oder `projekt-relaunch-seo`.
- `marketing.html` verwendet `data-page="marketing-legacy"` und enthaelt keinen regulaeren Frontend-Startup.
- Einige Seiten setzen zusaetzliche Runtime-Daten: `kontakt.html` traegt `data-contact-success-path="danke.html"`, mehrere Seiten setzen `data-mobile-sticky-cta="false"`.

### 3.3 Wiederkehrende UI-Texte (final gerendert via JavaScript)

#### Hauptnavigation

- Smart Web Studio
- Start
- Leistungen
- Projekte
- Ablauf
- Ueber mich
- Preise
- Insights
- Kontakt
- Erstgespraech buchen

#### Footer

- Smart Web Studio
- Marke. Website. Wachstum.
- Strategische Websites mit klarer Positionierung, sauberer Nutzerfuehrung und einer Conversion-Architektur, die Vertrauen in Anfragen uebersetzt.
- Direkter Ansprechpartner | Vorarlberg / DACH
- Direkte Zusammenarbeit, strukturierter Ablauf und Fokus auf passende Projekte. Erstgespraech buchen
- Leistungen: Webentwicklung, Branding, SEO & Marketing, Social Strategie, Growth Strategie, KI Beratung
- Navigation: Start, Leistungen, Projekte, Marken- & Website-Setup, Relaunch & SEO, Content- & Tracking-System, Funnel-Optimierung, Case Study, Ablauf, Ueber mich, Preise, Insights, Kontakt
- Rechtliches: Impressum, Datenschutz, Cookies, Cookie-Einstellungen
- (c) 2026 Smart Web Studio.
- Built for clarity, structure and conversion.

#### Mobile Sticky CTA

- Label: Direkter Projektstart
- Button: Erstgespraech buchen
- Deaktiviert auf: `kontakt.html`, `danke.html`, `impressum.html`, `datenschutz.html`, `cookies.html`, `marketing.html`

#### Cookie-Banner / Cookie-Panel

- Datenschutz & Consent
- Cookie-Auswahl fuer Smart Web Studio
- Diese Website verwendet Cookies, um Funktionen bereitzustellen, die Nutzung zu analysieren und Marketing zu ermoeglichen. Du kannst selbst entscheiden, welche Kategorien du zulassen moechtest.
- Notwendige: immer aktiv
- Statistik
- Marketing
- Datenschutz
- Cookie-Einstellungen
- Cookie-Seite
- Nur notwendige
- Auswahl speichern
- Alle akzeptieren
- Panel-Zusatz: Deine Auswahl fuer Statistik und Marketing
- Panel-Zusatz: Notwendige Cookies
- Panel-Zusatz: Diese Cookies sind fuer den Betrieb der Website erforderlich und speichern z. B. deine Consent-Auswahl.
- Panel-Zusatz: Immer aktiv
- Panel-Zusatz: Statistik Cookies
- Panel-Zusatz: Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.
- Panel-Zusatz: Statistik aktivieren
- Panel-Zusatz: Marketing Cookies
- Panel-Zusatz: Diese Cookies koennen verwendet werden, um Besuchern relevante Werbung anzuzeigen.
- Panel-Zusatz: Marketing aktivieren

### 3.4 Globale Verlinkungslogik

#### Primaere Navigation

- `index.html` -> Start
- `leistungen.html` -> Leistungen
- `projekte.html` -> Projekte
- `ablauf.html` -> Ablauf
- `ueber-mich.html` -> Ueber mich
- `preise.html` -> Preise
- `insights.html` -> Insights
- `kontakt.html` -> Kontakt

#### Footer: Leistungen

- `webentwicklung.html` -> Webentwicklung
- `branding.html` -> Branding
- `seo-marketing.html` -> SEO & Marketing
- `social.html` -> Social Strategie
- `growth.html` -> Growth Strategie
- `ki-beratung.html` -> KI Beratung

#### Footer: Navigation

- `index.html` -> Start
- `leistungen.html` -> Leistungen
- `projekte.html` -> Projekte
- `projekte/website-branding-setup.html` -> Marken- & Website-Setup
- `projekte/relaunch-seo.html` -> Relaunch & SEO
- `projekte/content-tracking-system.html` -> Content- & Tracking-System
- `projekte/funnel-optimierung.html` -> Funnel-Optimierung
- `case-study.html` -> Case Study
- `ablauf.html` -> Ablauf
- `ueber-mich.html` -> Ueber mich
- `preise.html` -> Preise
- `insights.html` -> Insights
- `kontakt.html` -> Kontakt

#### Footer: Rechtliches

- `impressum.html` -> Impressum
- `datenschutz.html` -> Datenschutz
- `cookies.html` -> Cookies
- `cookies.html#cookie-settings` -> Cookie-Einstellungen

#### Zentrale Regeln aus `navigation.js`

- Die Hauptnavigation wird bei Seitenstart neu gerendert; statisches HTML dient nur als Fallback.
- Die vier Projekt-Unterseiten werden in der Navigation als Teil von `Projekte` behandelt; der Menuepunkt `Projekte` bleibt dort aktiv.
- Die Brand-URL zeigt auf der Startseite nach `#top`, auf allen anderen Seiten nach `index.html`.
- Die primaere CTA verweist standardmaessig auf `kontakt.html#terminbuchung`; auf `kontakt.html` verweist sie nur auf `#terminbuchung`.
- `marketing.html` wird intern immer auf `seo-marketing.html` normalisiert.
- Links auf `cookies.html#cookie-settings` oeffnen nicht nur den Anker, sondern per `data-open-cookie-settings` das Cookie-Dialogpanel.
- Der Footer-Brandtext wird runtime-seitig ueberschrieben. Die statischen Footertexte im HTML sind daher nicht die massgebliche Quelle.

### 3.5 Interaktionslogik aus `src/js/main.js`

- Reveal-on-scroll: Elemente mit `.reveal-on-scroll` werden per IntersectionObserver eingeblendet.
- Scroll-Focus: Bereiche mit `.scroll-focus-section` bekommen Sichtbarkeits-/Blur-Effekte; auf Hero-Seiten wird zusaetzlich der feste Hintergrund gesteuert.
- Card Links: Container mit `data-card-link` sind vollstaendig klickbar und verhalten sich wie Links.
- Kontaktformular: Formulare mit `data-contact-form` werden asynchron per `fetch` an ihren `action`-Endpoint gesendet.
- Prefill-Buttons: Links mit `data-prefill-project` schreiben Werte fuer `projectType`, `timeline` und `message` in Session Storage und befuellen das Kontaktformular.
- Filtergruppen: `data-filter-group` + `data-filter-value` + `data-filter-item` steuern die Filter fuer Projekte und Insights.
- Hero-Interaction: die Hero-Stage reagiert auf Pointer-Bewegungen, solange `prefers-reduced-motion` das zulaesst.
- Jump Nav: Seiten mit `.jump-nav--section` erhalten eine dockende Sprungnavigation mit aktiver Abschnittsmarkierung und Smooth Scroll.
- Home-Hero-WebGL: `index.html` nutzt `src/js/water-sphere.js?v=5` mit Three.js-CDN und CSS-Fallback-Orbs.

### 3.6 Kontaktformular-Backend (`api/contact.js`)

- Erwartete Methode: `POST`
- Erwarteter Payload: `name`, `email`, optional `projectType`, `budget`, `timeline`, `website`, `message`, `company` (Honeypot)
- Validierung: E-Mail ist Pflicht; E-Mail und URL werden geprueft. Name ist optional.
- Honeypot: wenn `company` gesetzt ist, antwortet die API mit `{ ok: true }`, ohne Mail zu versenden.
- Versanddienst: Resend ueber `https://api.resend.com/emails`
- Resend-Netzwerkfehler werden abgefangen und als JSON-Fehler an das Frontend weitergegeben.
- Benoetigte ENV-Variablen: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, optional `CONTACT_TO_EMAIL`
- Fallback-Empfaenger ohne ENV: `pcdocjp79@gmail.com`

## 4. Seiteninventar

| Datei | data-page | Titel | Top-Level-Sections | Besonderheiten |
| --- | --- | --- | ---: | --- |
| index.html | home | Smart Web Studio \| High-End Websites mit Qualität | 7 | Standard |
| leistungen.html | leistungen | Leistungen \| Smart Web Studio | 6 | Card-Links |
| webentwicklung.html | webentwicklung | Webentwicklung \| Smart Web Studio | 6 | Jump-Nav |
| branding.html | branding | Branding \| Smart Web Studio | 6 | Jump-Nav |
| seo-marketing.html | seo-marketing | SEO & Marketing \| Smart Web Studio | 6 | Jump-Nav |
| social.html | social | Social Strategie \| Smart Web Studio | 6 | Jump-Nav |
| growth.html | growth | Growth Strategie \| Smart Web Studio | 6 | Jump-Nav |
| ki-beratung.html | ki-beratung | KI Beratung \| Smart Web Studio | 6 | Jump-Nav, Prefill-CTA |
| projekte.html | projekte | Projekte \| Smart Web Studio | 4 | Filter, Card-Links |
| projekte/website-branding-setup.html | projekt-website-branding-setup | Marken- und Website-Setup \| Smart Web Studio | 7 | Base ../ |
| projekte/relaunch-seo.html | projekt-relaunch-seo | Relaunch mit Conversion- und Sichtbarkeitsbasis \| Smart Web Studio | 7 | Base ../ |
| projekte/content-tracking-system.html | projekt-content-tracking-system | Content- und Tracking-System \| Smart Web Studio | 7 | Base ../ |
| projekte/funnel-optimierung.html | projekt-funnel-optimierung | Optimierungs-Sprint für Funnel- und Kontaktwege \| Smart Web Studio | 7 | Base ../ |
| case-study.html | case-study | Case Study \| Smart Web Studio | 5 | Standard |
| ablauf.html | ablauf | Ablauf \| Smart Web Studio | 4 | Standard |
| preise.html | preise | Preise \| Smart Web Studio | 4 | Standard |
| ueber-mich.html | ueber-mich | Über mich \| Smart Web Studio | 5 | Standard |
| insights.html | insights | Insights \| Smart Web Studio | 4 | Filter |
| kontakt.html | kontakt | Kontakt \| Smart Web Studio | 3 | Prefill-CTA, Formular |
| danke.html | danke | Danke \| Smart Web Studio | 4 | Standard |
| impressum.html | impressum | Impressum \| Smart Web Studio | 6 | Standard |
| datenschutz.html | datenschutz | Datenschutz \| Smart Web Studio | 10 | Standard |
| cookies.html | cookies | Cookie-Einstellungen \| Smart Web Studio | 6 | Standard |
| marketing.html | marketing-legacy | Weiterleitung \| Smart Web Studio |  | Redirect, kein main.js |

## 5. Seiten im Detail

### index.html

- Titel: Smart Web Studio | High-End Websites mit Qualität
- Meta-Description: Smart Web Studio entwickelt klare Positionierung, hochwertige Websites und strukturierte Conversion-Systeme für Unternehmen mit Anspruch.
- Canonical: -
- data-page: home
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `home`

#### Interne Links im Hauptinhalt

- `webentwicklung.html` -> Mehr erfahren (Webentwicklung)
- `seo-marketing.html` -> Mehr erfahren (SEO)
- `ki-beratung.html` -> Mehr erfahren (KI) (x2)
- `leistungen.html` -> Webentwicklung ansehen
- `projekte.html` -> Website-Optimierung ansehen
- `seo-marketing.html` -> Mehr zu SEO & Marketing
- `branding.html` -> Mehr erfahren (Branding)
- `social.html` -> Mehr erfahren (Social)
- `growth.html` -> Mehr erfahren (Growth)
- `kontakt.html#terminbuchung` -> Erstgespräch buchen
- `kontakt.html#kontaktformular` -> Projekt einordnen lassen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: High-End Websites mit Klarheit. Marketing mit Richtung. KI mit Nutzen.

- ID: hero-stage
- aria-labelledby: keine
- Klassen: hero-stage hero-stage--full-bleed animate-enter
- Eyebrow/Label: Webentwicklung, Marketing und KI aus einer Hand (Marquee)
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Webentwicklung, Marketing und KI aus einer Hand · Codebasierte Websites · SEO & Sichtbarkeit · KI für den Alltag · Automatisierung ohne Tool-Chaos · Digitale Klarheit für kleine Unternehmen · Struktur statt Zufall · Besser gefunden werden · Professioneller auftreten · Effizienter arbeiten

High-End Websites mit Klarheit.
Marketing mit Richtung.
KI mit Nutzen.

Ich entwickle codebasierte Websites, klare Marketing-Strukturen und praxisnahe KI-Setups für kleine Unternehmen, die digital professioneller auftreten und effizienter arbeiten möchten.
Dabei geht es nicht nur um schönes Design, sondern um einen Auftritt,
der verständlich erklärt, Vertrauen aufbaut, besser gefunden wird
und passende Anfragen wahrscheinlicher macht.

Direkter Ansprechpartner
Klare Angebotslogik
Performance & Struktur
```

##### Section 2: Vertrauensargumente

- ID: keine
- aria-labelledby: trust-strip-title
- Klassen: trust-strip scroll-focus-section mt-10 lg:mt-14 px-0
- Eyebrow/Label: Klarheit
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Vertrauensargumente

Klarheit

Kein Agentur-Pingpong

Strategie, Struktur und Umsetzung bleiben in einer Hand. Entscheidungen
bleiben schnell und nachvollziehbar.

Qualität

Websites mit Substanz

Saubere Seitenarchitektur, klare CTAs, hochwertige Gestaltung und technische
Qualität werden zusammen geplant.

Prozess

Strukturiertes Vorgehen

Von Analyse bis Launch bleibt sichtbar, was gerade entschieden wird und wie
daraus der nächste Schritt entsteht.

Conversion

Fokus auf Wirkung

Kein Showroom-Design ohne Richtung, sondern ein Auftritt, der Vertrauen,
Relevanz und Kontaktwege sauber verbindet.
```

##### Section 3: Viele Websites sehen hochwertig aus und verlieren trotzdem Anfragen.

- ID: problem
- aria-labelledby: problem-headline
- Klassen: approach-section scroll-focus-section animate-enter delay-200 mt-16 lg:mt-20 px-0
- Eyebrow/Label: Problem
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Problem

Viele Websites sehen hochwertig aus und verlieren trotzdem Anfragen.

Wenn Positionierung, Nutzerführung und Conversion nicht sauber zusammenspielen, bleibt selbst ein schöner
Auftritt nur digitale Oberfläche. Wachstum beginnt mit Klarheit, nicht mit mehr Design-Fläche.

01

UNKLARER MARKTAUFTRITT

Das Angebot wirkt zu breit oder austauschbar.

Besucher verstehen nicht schnell genug, wofür du stehst, was dich differenziert und warum genau du die
richtige Wahl bist.

02

ZU VIELE REIBUNGSPUNKTE

Nutzer finden keinen klaren nächsten Schritt.

Fehlende Hierarchien, unklare Seitenlogik und generische CTAs machen aus Interesse keinen sauberen Weg
in Kontakt, Audit oder Erstgespräch.

03

SICHTBARKEIT OHNE SYSTEM

Traffic trifft auf eine Website ohne Vertriebslogik.

Dann wird nur Reibung skaliert. Strategie, Positionierung und Conversion-Architektur müssen zuerst
stehen, bevor Sichtbarkeit wirklich arbeitet.
```

##### Section 4: Drei Kernhebel für einen Auftritt, der nicht nur gut aussieht.

- ID: services
- aria-labelledby: services-headline
- Klassen: service-pillars-section scroll-focus-section animate-enter delay-300 mt-10 lg:mt-16 pb-16 lg:pb-24 relative w-full
- Eyebrow/Label: Leistungen
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen ansehen), `branding.html` (Leistungen ansehen), `seo-marketing.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Leistungen

Drei Kernhebel für einen Auftritt, der nicht nur gut aussieht.

Jede Leistung ist auf Klarheit, Vertrauen und nächste Handlung ausgerichtet. Kein loses Baukasten-System,
sondern ein sauber abgestimmter Vertriebsauftritt.

01

WEBSYSTEM

Webentwicklung

Schnelle, strukturierte Websites mit sauberer Nutzerführung, klaren Conversion-Wegen und einer Technik,
die dem Auftritt gerecht wird.

Leistungen ansehen

02

POSITIONIERUNG

Branding

Klare Positionierung, präzise Botschaften und ein professioneller Auftritt, der Wertigkeit aufbaut statt
austauschbar zu wirken.

Leistungen ansehen

03

NACHFRAGE

SEO & Marketing

Sichtbarkeit, Content-Struktur und Tracking werden so geplant, dass Reichweite in qualifizierte Anfragen
und bessere Entscheidungen übersetzt wird.

Leistungen ansehen
```

##### Section 5: Ein Projektbeweis, der auf Struktur statt auf Showeffekte setzt.

- ID: featured-project
- aria-labelledby: featured-project-title
- Klassen: about-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projekt-Teaser
- Interne Links in dieser Section: `case-study.html` (Projekt ansehen), `case-study.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Projekt-Teaser

Ein Projektbeweis, der auf Struktur statt auf Showeffekte setzt.

Solange keine freigegebenen Kundendaten vorliegen, zeige ich nachvollziehbar, wie ein Projekt aufgebaut,
priorisiert und in Wirkung übersetzt wird.

Ausgangslage

Unklare Positionierung, eine überladene Seitenstruktur und keine saubere Priorisierung der
Kontaktwege.

Ziel

Ein klarer Premium-Auftritt, der Angebot, Vertrauen und nächste Handlung logisch zusammenführt.

Umsetzung

Messaging schärfen, Seitenarchitektur neu ordnen, Leistungen sauber trennen und CTAs konsequent führen.

Ergebnis

Mehr Klarheit im Auftritt, bessere Nutzerführung und ein Kontaktfluss, der professioneller und
vertrauenswürdiger wirkt.

Die komplette Struktur ist in der anonymisierten Case Study aufbereitet.

Projekt ansehen

Case Study Aufbau

Anonymisiert, aber realistisch in Struktur und Denkweise.

- Ausgangslage, Marktbild und Reibungspunkte

- Zieldefinition und Priorisierung der Nutzerwege

- Umsetzung in Marke, Website und CTA-Architektur

- Qualitative Ergebnisse statt erfundener KPI-Slides

ohne Fake-Proof transparente Projektsicht

Projekt ansehen
```

##### Section 6: Ein professioneller Prozess statt kreativer Black Box.

- ID: process
- aria-labelledby: keine
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ablauf
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ablauf

Ein professioneller Prozess statt kreativer Black Box.

Jedes Projekt folgt einer klaren Reihenfolge: zuerst Analyse und Positionierung, dann Struktur,
Umsetzung und kontrollierter Launch.

-
01

01

Analyse

Zielgruppe, Angebot, Wettbewerb und vorhandenes Setup werden strukturiert eingeordnet.

-
02

02

Positionierung & Struktur

Botschaft, Seitenarchitektur, Nutzerwege und CTA-Hierarchie werden auf das Geschäftsziel ausgerichtet.

-
03

03

Design & Umsetzung

Gestaltung, Inhalte und technische Umsetzung arbeiten auf dasselbe Ziel hin: Klarheit und Conversion.

-
04

04

Launch & Feinschliff

Tracking, Kontaktwege und Übergabe werden sauber finalisiert, damit der Auftritt nicht nur live geht,
sondern einsatzbereit ist.
```

##### Section 7: Jeder Besucher sollte sofort wissen, wie es für ihn weitergeht.

- ID: conversion-paths
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Zwei klare Wege
- Interne Links in dieser Section: `leistungen.html` (Leistungen ansehen), `projekte.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Zwei klare Wege

Jeder Besucher sollte sofort wissen, wie es für ihn weitergeht.

Entweder zuerst Leistungen verstehen oder direkt über Ergebnisse und Projektlogik Vertrauen aufbauen.

Ich möchte Leistungen verstehen

Ideal, wenn du zuerst sehen willst, welcher Hebel für dein Projekt relevant
ist.

- Übersicht der aktiven Leistungsbereiche

- Vertiefte Service-Seiten mit Vorgehen und Lieferumfang

- Klarer Übergang in Kontakt, Audit oder Erstgespräch

Leistungen ansehen

Ich möchte Ergebnisse sehen

Ideal, wenn du erst Projektlogik, Proof und die Qualität der Umsetzung
prüfen willst.

- Projektmuster und anonymisierte Leistungsbeweise

- Case Study mit Ausgangslage, Ziel, Umsetzung und Ergebnis

- Direkter Weg vom Proof in das Erstgespräch

Projekt ansehen
```

##### Section 8: Wenn dein Auftritt hochwertiger, klarer und wirksamer werden soll.

- ID: kontakt
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn dein Auftritt hochwertiger, klarer und wirksamer werden soll.

Dann starten wir mit einem strukturierten Erstgespräch oder einem fokussierten Mini-Audit, damit sofort
klar ist, welcher Schritt für dein Projekt zuerst Wirkung bringt.

Erstgespräch buchen

Mini-Audit anfordern
```

### leistungen.html

- Titel: Leistungen | Smart Web Studio
- Meta-Description: Leistungen von Smart Web Studio: Webentwicklung, Branding, SEO & Marketing, Social Strategie, Growth Strategie und KI Beratung für hochwertige, conversion-orientierte Auftritte.
- Canonical: -
- data-page: leistungen
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `leistungen`

#### Interne Links im Hauptinhalt

- `webentwicklung.html` -> Leistungen ansehen (x2)
- `branding.html` -> Leistungen ansehen (x2)
- `seo-marketing.html` -> Leistungen ansehen (x2)
- `social.html` -> Leistungen ansehen
- `growth.html` -> Leistungen ansehen
- `ki-beratung.html` -> Leistungen ansehen (x2)
- `ki-beratung.html` -> KI Beratung ansehen
- `ablauf.html` -> Ablauf ansehen
- `projekte.html` -> Projekt ansehen
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `kontakt.html#terminbuchung` -> Erstgespräch buchen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- `webentwicklung.html`
- `branding.html`
- `seo-marketing.html`
- `social.html`
- `growth.html`
- `ki-beratung.html`

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Die richtige Leistung ist nicht die lauteste. Sie ist die zuerst wirksame.

- ID: keine
- aria-labelledby: services-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Leistungen
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Leistungen

Die richtige Leistung ist nicht die lauteste. Sie ist die zuerst wirksame.

Je nach Ausgangslage braucht dein Projekt zuerst Klarheit, Struktur, Sichtbarkeit oder einen nächsten
Skalierungsschritt. Deshalb greifen alle Leistungen in dieselbe strategische Logik.

Positionierung
Websysteme
Sichtbarkeit
Growth
KI-Einordnung

Was alle Leistungen verbindet

Nicht mehr Output, sondern mehr Richtung im Auftritt.

- klare Positionierung und Angebotslogik

- saubere Seitenarchitektur und Nutzerführung

- Conversion-orientierte CTA-Hierarchie

- messbare Struktur für Sichtbarkeit und Optimierung
```

##### Section 2: Sechs Leistungsbereiche, sauber aufeinander abgestimmt.

- ID: services
- aria-labelledby: keine
- Klassen: approach-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Angebot
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen ansehen), `branding.html` (Leistungen ansehen), `seo-marketing.html` (Leistungen ansehen), `social.html` (Leistungen ansehen), `growth.html` (Leistungen ansehen), `ki-beratung.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Angebot

Sechs Leistungsbereiche, sauber aufeinander abgestimmt.

Jeder Bereich hat einen eigenen Fokus, aber dieselbe Aufgabe: mehr Klarheit, mehr Vertrauen und bessere
nächste Schritte im digitalen Auftritt.

01

BUILD

Webentwicklung

Für Unternehmen, die eine performante Website mit klarer Nutzerführung und starker Conversion-Basis
brauchen.

Leistungen ansehen

02

BRAND

Branding

Für Unternehmen, deren Auftritt professioneller, differenzierter und konsistenter wirken soll.

Leistungen ansehen

03

SEARCH

SEO & Marketing

Für Unternehmen, die Sichtbarkeit, Content-Struktur und Tracking endlich als ein System aufbauen wollen.

Leistungen ansehen

04

SOCIAL

Social Strategie

Für Teams, die Content planbar, markenkonsistent und näher an Angebot und Nachfrage aufbauen möchten.

Leistungen ansehen

05

GROWTH

Growth Strategie

Für Unternehmen, die Nachfrage, Conversion und Optimierung systematisch auf die nächste Stufe bringen
wollen.

Leistungen ansehen

06

AI

KI Beratung

Für Unternehmen, die KI sinnvoll in Website, Content und Prozesse integrieren wollen, ohne
Qualität, Markenlogik zu verwässern.

Leistungen ansehen
```

##### Section 3: Welche Leistung zuerst Sinn ergibt, hängt von der Ausgangslage ab.

- ID: services-decision
- aria-labelledby: keine
- Klassen: packages-section packages-section--decision py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Entscheidungshilfe
- Interne Links in dieser Section: `branding.html` (Leistungen ansehen), `webentwicklung.html` (Leistungen ansehen), `seo-marketing.html` (Leistungen ansehen), `ki-beratung.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Entscheidungshilfe

Welche Leistung zuerst Sinn ergibt, hängt von der Ausgangslage ab.

Nicht jedes Projekt startet bei derselben Stelle. Entscheidend ist, welcher Hebel zuerst Vertrauen,
Klarheit oder Nachfrage verbessert.

Wenn der Auftritt zu unscharf ist

Branding und Positionierung kommen zuerst.

- Angebot wirkt austauschbar

- Botschaften sind nicht präzise genug

- Design transportiert keine klare Wertigkeit

Leistungen ansehen

Wenn die Website nicht sauber führt

Webentwicklung und Struktur sind der erste Hebel.

- Zu viele Reibungspunkte im Nutzerweg

- Kein klarer Fokus auf Kontakt oder Anfrage

- Technik und Struktur bremsen Vertrauen

Leistungen ansehen

Wenn Nachfrage wachsen soll

SEO, Content, Social oder Growth bauen darauf auf.

- Sichtbarkeit ist noch nicht sauber aufgebaut

- Content arbeitet nicht in Richtung Angebot

- Tracking oder Optimierung fehlen

Leistungen ansehen

Wenn KI schon Thema ist, aber noch nicht sauber eingeordnet

KI Beratung schafft Rollen, Prioritäten und sinnvolle Einsatzfelder.

- Tools werden ausprobiert, aber ohne klare Prozesslogik

- Tonalität, Qualität und Freigaben sind nicht sauber geregelt

- Website, Content und interne Abläufe greifen noch nicht zusammen

Leistungen ansehen
```

##### Section 4: KI beschleunigt Recherche, Struktur und Varianten.

- ID: arbeitsweise-mit-ki
- aria-labelledby: services-ai-title
- Klassen: approach-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Arbeitsweise mit KI
- Interne Links in dieser Section: `ki-beratung.html` (KI Beratung ansehen)
- Bilder in dieser Section: keine

```text
Arbeitsweise mit KI

KI beschleunigt Recherche, Struktur und Varianten.

Ich nutze KI dort, wo sie Routinen verkürzt und Tempo schafft. Positionierung, Priorisierung,
Tonalität und Qualitätskontrolle werden nicht ausgelagert, damit das Ergebnis nicht generisch
wird, sondern sauber zum Angebot passt.

VORBEREITUNG

Schneller von Rohmaterial zu Struktur

Themen, Seitenlogik, erste Wireframes und Textgrundlagen lassen sich früher sortieren, verdichten
und auf Relevanz prüfen.

ITERATION

Varianten lassen sich früher testen

Headlines, CTA-Richtungen, Seitenmodule und Content-Ideen können schneller gegeneinander geprüft
und im Projekt geschärft werden.

BERATUNG

KI wird sinnvoll eingeordnet

Ich prüfe, wo KI im Projekt wirklich Zeit spart und wo menschliche Entscheidung, Designgefühl
und finale Freigabe bewusst vorne bleiben müssen.

Wenn du KI nicht als Buzzword, sondern als sauberen Hebel für Website, Content und Prozesse
einordnen willst.

KI Beratung ansehen
```

##### Section 5: Leistungen verstehen, Projekte prüfen oder den Ablauf im Detail ansehen.

- ID: keine
- aria-labelledby: keine
- Klassen: about-section about-section--next-steps py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Nächste Wege
- Interne Links in dieser Section: `ablauf.html` (Ablauf ansehen), `projekte.html` (Projekt ansehen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Nächste Wege

Leistungen verstehen, Projekte prüfen oder den Ablauf im Detail ansehen.

Auf allen relevanten Seiten gibt es einen klaren nächsten Schritt. Keine Sackgassen, keine losen Enden.

Ablauf

Projektprozess verstehen

Wenn du sehen willst, wie Analyse, Strategie, Umsetzung und Launch
zusammenarbeiten.

Proof

Projektlogik prüfen

Wenn du zuerst sehen willst, wie Leistungen in Projekten und Case Studies
strukturiert werden.

Kontakt

Passenden Einstieg klären

Wenn du unsicher bist, welcher Hebel zuerst Sinn ergibt, sortieren wir das
im Erstgespräch oder Mini-Audit.

Ablauf ansehen

Projekt ansehen

Mini-Audit anfordern
```

##### Section 6: Du brauchst keinen Leistungskatalog. Du brauchst die richtige Reihenfolge.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Du brauchst keinen Leistungskatalog. Du brauchst die richtige Reihenfolge.

Wenn du wissen willst, welcher Hebel zuerst Wirkung bringt, starten wir mit einem klaren Gespräch oder einem
kompakten Mini-Audit.

Erstgespräch buchen

Mini-Audit anfordern
```

### webentwicklung.html

- Titel: Webentwicklung | Smart Web Studio
- Meta-Description: Webentwicklung von Smart Web Studio: performante Websites mit klarer Nutzerführung, hochwertigem Design und sauberer Conversion-Architektur.
- Canonical: -
- data-page: webentwicklung
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `webentwicklung`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `#approach` -> Ansatz
- `#deliverables` -> Lieferumfang
- `#standards` -> Standards
- `#related` -> Nächste Schritte
- `branding.html` -> Leistungen
ansehen
- `seo-marketing.html` -> Leistungen
ansehen
- `case-study.html` -> Projekt ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- Sprungnavigation Webentwicklung: Ansatz -> #approach | Lieferumfang -> #deliverables | Standards -> #standards | Nächste Schritte -> #related

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Websites mit Struktur, Klarheit und einer Conversion-Logik, die zum Angebot passt.

- ID: keine
- aria-labelledby: webdev-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Webentwicklung
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `#approach` (Ansatz), `#deliverables` (Lieferumfang), `#standards` (Standards), `#related` (Nächste Schritte)
- Bilder in dieser Section: keine

```text
Webentwicklung

Websites mit Struktur, Klarheit und einer Conversion-Logik, die zum Angebot passt.

Ich entwickle digitale Auftritte, die hochwertig wirken, schnell laden und Besucher sauber in Anfrage,
Erstgespräch oder nächsten Schritt führen.

Erstgespräch buchen

Mini-Audit anfordern

Websystem

Nicht nur schön, sondern klar aufgebaut und auf Anfrage ausgerichtet.

- saubere Seitenstruktur statt visueller Überladung

- klare Nutzerführung mit priorisierten CTA-Wegen

- performante Umsetzung für Mobile, Desktop und Launch

Websystem statt digitaler Visitenkarte

Struktur vor
Effekten.
Nutzerführung vor
Zufall.
Conversion vor
Bauchgefühl.

Technisch sauber, mobil stark und so aufgebaut, dass Vertrauen und Kontaktwege nicht gegeneinander
arbeiten.

- Ansatz

- Lieferumfang

- Standards

- Nächste Schritte
```

##### Section 2: Strategie vor Oberfläche. Seitenarchitektur vor Code.

- ID: approach
- aria-labelledby: webdev-approach-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ansatz
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ansatz

Strategie vor Oberfläche. Seitenarchitektur vor Code.

Bevor umgesetzt wird, definiere ich Ziel, Nutzerweg, Angebotslogik und CTA-Struktur. Erst dann bekommt die
Website ihre visuelle und technische Form.

-
01

01

Zielbild klären

Was soll die Website konkret auslösen und welches Angebot steht im Fokus?

-
02

02

Seitenarchitektur bauen

Inhalte, Module, Hierarchien und Kontaktpfade werden sauber priorisiert.

-
03

03

Design und Entwicklung verzahnen

Gestaltung und Technik greifen ineinander, statt sich gegenseitig zu
blockieren.

-
04

04

Launch sauber vorbereiten

QA, Tracking, Responsiveness und CTA-Wege werden vor der Freigabe
überprüft.
```

##### Section 3: Was du konkret bekommst und was es im Ergebnis verbessert.

- ID: deliverables
- aria-labelledby: webdev-deliverables-title
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Lieferumfang
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Lieferumfang

Was du konkret bekommst und was es im Ergebnis verbessert.

Strukturiertes Websystem

Für klare Hierarchien und eine ruhigere Nutzerführung.

- Seitenstruktur und Modul-Logik

- klare CTA-Hierarchie

- responsive Umsetzung für Desktop und Mobile

Technisches Fundament

Für Performance, Wartbarkeit und sauberen Betrieb.

- performante Frontend-Umsetzung

- saubere semantische Struktur

- Tracking- und SEO-Grundlage

Launch-Bereitschaft

Für einen Auftritt, der nicht nur fertig aussieht.

- Qualitätssicherung vor dem Go-live

- klare Übergabe und nächste Schritte

- typischer Projektrahmen je nach Umfang und Seitenzahl
```

##### Section 4: Performance ist kein Extra. Sie ist Teil des Standards.

- ID: standards
- aria-labelledby: webdev-standards-title
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Qualitätsstandards
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Qualitätsstandards

Performance ist kein Extra. Sie ist Teil des Standards.

Gute Webentwicklung bedeutet nicht nur, dass etwas funktioniert. Sie muss schnell, verständlich,
wartbar und im Alltag belastbar sein.

Saubere Struktur

Klare Inhalts-Hierarchien, sinnvolle Komponenten und eine umsetzbare
Seitenlogik statt unübersichtlicher Einzelscreens.

Performance & Responsiveness

Mobil muss die Website nicht nur funktionieren, sondern sich leicht, ruhig und
professionell anfühlen.

SEO- und Tracking-Basis

Semantik, Headings, saubere interne Verlinkung und relevante Messpunkte werden
direkt mitgedacht.
```

##### Section 5: Webentwicklung wirkt am stärksten im Zusammenspiel mit den
richtigen Nachbarleistungen.

- ID: related
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende nächste Schritte
- Interne Links in dieser Section: `branding.html` (Leistungen
ansehen), `seo-marketing.html` (Leistungen
ansehen), `case-study.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Passende nächste Schritte

Webentwicklung wirkt am stärksten im Zusammenspiel mit den
richtigen Nachbarleistungen.

Vor dem Build

Branding schärfen

Wenn Positionierung und Botschaft zuerst klarer werden müssen, bevor die
Website übersetzt wird.

Leistungen
ansehen

Nach dem Launch

SEO & Marketing aufbauen

Wenn Sichtbarkeit, Content-Struktur und Tracking die Website gezielt weiter
treiben sollen.

Leistungen
ansehen

Proof

Beispiel-Projekt ansehen

Wenn du sehen willst, wie Struktur, CTA-Logik und Ergebniswirkung in einer
Case Study zusammenlaufen.

Projekt ansehen
```

##### Section 6: Wenn deine Website nicht nur Eindruck, sondern Anfragen erzeugen soll.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn deine Website nicht nur Eindruck, sondern Anfragen erzeugen soll.

Dann beginnen wir mit einer strukturierten Einordnung deines Auftritts und entscheiden danach über Scope,
Reihenfolge und sinnvolle Hebel.

Erstgespräch buchen
Mini-Audit anfordern
```

### branding.html

- Titel: Branding | Smart Web Studio
- Meta-Description: Branding und Positionierung von Smart Web Studio: klare Botschaften, hochwertige Wahrnehmung und ein visuelles System für einen professionellen Marktauftritt.
- Canonical: -
- data-page: branding
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `branding`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `#approach` -> Ansatz
- `#deliverables` -> Lieferumfang
- `#standards` -> Standards
- `#related` -> Nächste Schritte
- `webentwicklung.html` -> Leistungen
ansehen
- `seo-marketing.html` -> Leistungen
ansehen
- `case-study.html` -> Projekt ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- Sprungnavigation Branding: Ansatz -> #approach | Lieferumfang -> #deliverables | Standards -> #standards | Nächste Schritte -> #related

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Klarheit in Botschaft und Auftritt macht aus Vergleichbarkeit eine bessere Wahl.

- ID: keine
- aria-labelledby: branding-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Branding & Positionierung
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `#approach` (Ansatz), `#deliverables` (Lieferumfang), `#standards` (Standards), `#related` (Nächste Schritte)
- Bilder in dieser Section: keine

```text
Branding & Positionierung

Klarheit in Botschaft und Auftritt macht aus Vergleichbarkeit eine bessere Wahl.

Ich schärfe Positionierung, Markenbotschaft und visuelle Leitlinien so, dass dein Auftritt hochwertiger,
konsistenter und im Markt klarer wahrgenommen wird.

Erstgespräch buchen
Mini-Audit anfordern

Markenfundament

Positionierung, Botschaft und Design arbeiten als ein System zusammen.

- klare Botschaften statt austauschbarer Aussagen

- visuelle Leitlinien für einen konsistenten Marktauftritt

- stärkere Wahrnehmung über Website, Social und Vertrieb hinweg

Brand System

Positionierung mit
Fokus.
Botschaft mit
Richtung.
Design mit
Konsistenz.

Damit deine Marke nicht nur gut aussieht, sondern wertiger, präziser und professioneller wirkt.

- Ansatz

- Lieferumfang

- Standards

- Nächste Schritte
```

##### Section 2: Marke als System, nicht als lose Design-Entscheidung.

- ID: approach
- aria-labelledby: branding-approach-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ansatz
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ansatz

Marke als System, nicht als lose Design-Entscheidung.

Ich entwickle eine klare Grundlage für Botschaft, Wahrnehmung und visuelle Konsistenz, damit Website,
Content und Vertrieb dieselbe Richtung sprechen.

-
01

01

Marktbild und Zielgruppe prüfen

Wer soll überzeugt werden, was ist relevant und was muss in Sekunden klar
werden?

-
02

02

Botschaft schärfen

Wertversprechen, Nutzenkommunikation und Differenzierung werden präzisiert.

-
03

03

Visuelles System definieren

Typografie, Farben, Stilprinzipien und Leitlinien werden auf dieselbe
Wahrnehmung ausgerichtet.

-
04

04

In Website und Kanäle übersetzen

Branding bleibt nicht im PDF, sondern wird in Website, Social und
Angebotskommunikation belastbar anwendbar.
```

##### Section 3: Was du im Ergebnis in der Hand hast.

- ID: deliverables
- aria-labelledby: branding-deliverables-title
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Lieferumfang
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Lieferumfang

Was du im Ergebnis in der Hand hast.

Strategische Klarheit

Für präzisere Kommunikation und stärkere Differenzierung.

- Positionierungsrahmen

- präzise Markenbotschaften

- Leitlinie für Nutzenkommunikation

Visuelles System

Für einen konsistenten, hochwertigeren Marktauftritt.

- Typografie- und Farbprinzipien

- visuelle Leitlinien für Website und Content

- Anwendungslogik statt lose Design-Dateien

Übersetzung in den Alltag

Damit die Marke nicht nur gedacht, sondern genutzt wird.

- Mini Brand Guide / Grundregeln

- Basis für Website- und Content-Design

- typischer Zeitrahmen je nach Reifegrad und Umfang
```

##### Section 4: Branding soll nicht dekorieren. Es soll Klarheit und Wert spürbar machen.

- ID: standards
- aria-labelledby: branding-standards-title
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Philosophie & Qualität
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Philosophie & Qualität

Branding soll nicht dekorieren. Es soll Klarheit und Wert spürbar machen.

Ich arbeite bewusst nicht auf austauschbare Trend-Optik hin, sondern auf eine Wahrnehmung, die zum
Angebot, zur Zielgruppe und zur späteren Website passt.

Kein Rebranding um des Rebrandings willen

Bestehende Stärken werden nicht zerstört, sondern gezielt modernisiert und
strategisch klarer gemacht.

Direkte Übersetzung in digitale Kanäle

Branding wird von Anfang an so gedacht, dass Website, Insights und Social
darauf sauber aufbauen können.

Weniger Show, mehr Präzision

Jede stilistische Entscheidung muss die Positionierung stärken und nicht nur
optisch gefallen.
```

##### Section 5: Branding wirkt am stärksten, wenn Website und Nachfrage
danach sauber anschließen.

- ID: related
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende nächste Schritte
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen
ansehen), `seo-marketing.html` (Leistungen
ansehen), `case-study.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Passende nächste Schritte

Branding wirkt am stärksten, wenn Website und Nachfrage
danach sauber anschließen.

Übersetzung

Branding in die Website überführen

Wenn der neue Auftritt digital konsistent und conversion-orientiert gebaut
werden soll.

Leistungen
ansehen

Nachfrage

SEO & Marketing auf Markenbasis aufbauen

Wenn Sichtbarkeit später sauber auf Botschaft, Angebotslogik und Zielseiten
aufsetzen soll.

Leistungen
ansehen

Proof

Projektstruktur ansehen

Wenn du sehen willst, wie Positionierung und Website in einer Case Study
zusammenlaufen.

Projekt ansehen
```

##### Section 6: Wenn deine Marke hochwertiger, klarer und glaubwürdiger wirken soll.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn deine Marke hochwertiger, klarer und glaubwürdiger wirken soll.

Dann starten wir mit einem strukturierten Gespräch und prüfen, welche
Klarheit zuerst fehlt: Positionierung, Botschaft oder visuelle Konsistenz.

Erstgespräch buchen
Mini-Audit anfordern
```

### seo-marketing.html

- Titel: SEO & Marketing | Smart Web Studio
- Meta-Description: SEO & Marketing von Smart Web Studio: Suchintention, Content-Struktur, Tracking und Conversion-Logik für qualifizierte Anfragen statt reiner Reichweite.
- Canonical: /seo-marketing
- data-page: seo-marketing
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `seo-marketing`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `#approach` -> Ansatz
- `#deliverables` -> Lieferumfang
- `#standards` -> Standards
- `#related` -> Nächste Schritte
- `webentwicklung.html` -> Leistungen
ansehen
- `branding.html` -> Leistungen
ansehen
- `insights.html` -> Insights ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- Sprungnavigation SEO und Marketing: Ansatz -> #approach | Lieferumfang -> #deliverables | Standards -> #standards | Nächste Schritte -> #related

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Sichtbarkeit ist erst dann wertvoll, wenn sie in die richtige Anfrage führt.

- ID: keine
- aria-labelledby: seo-marketing-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: SEO & Marketing
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `#approach` (Ansatz), `#deliverables` (Lieferumfang), `#standards` (Standards), `#related` (Nächste Schritte)
- Bilder in dieser Section: keine

```text
SEO & Marketing

Sichtbarkeit ist erst dann wertvoll, wenn sie in die richtige Anfrage führt.

Ich plane Suchintention, Content-Struktur, Tracking und Angebotsseiten so, dass Reichweite nicht nur
stattfindet, sondern qualitativ zum Geschäftsmodell passt.

Erstgespräch buchen
Mini-Audit anfordern

Visibility System

Sichtbarkeit wird an Angebotslogik, Content und Tracking gekoppelt.

- Suchintentionen sauber in Zielseiten und Themenfelder übersetzt

- Content mit klarer Priorisierung statt reiner Reichweite

- Tracking für bessere Entscheidungen entlang echter Kontaktwege

Search Intent, Content, Tracking

Suchintention vor
Tools.
Content mit
Richtung.
Tracking für
Entscheidungen.

Damit Sichtbarkeit, Landingpages und Kontaktwege an derselben Conversion-Architektur arbeiten.

- Ansatz

- Lieferumfang

- Standards

- Nächste Schritte
```

##### Section 2: Sichtbarkeit wird entlang echter Nutzerfragen und Angebotsziele geplant.

- ID: approach
- aria-labelledby: keine
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ansatz
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ansatz

Sichtbarkeit wird entlang echter Nutzerfragen und Angebotsziele geplant.

Nicht zuerst Tools oder Output-Mengen, sondern zuerst die Frage: Welche Inhalte, Seiten und Messpunkte
bringen das Geschäft wirklich weiter?

-
01

01

Suchintention und Angebotsfragen sortieren

Welche Themen sind relevant und welche Zielseiten müssen sie unterstützen?

-
02

02

Seiten- und Content-Architektur priorisieren

Themencluster, Landingpages, interne Verlinkung und Angebotsseiten greifen
ineinander.

-
03

03

Tracking auf Entscheidungsfragen ausrichten

Kontaktwege, CTA-Klicks und inhaltliche Hebel werden als sinnvolle Events
definiert.

-
04

04

Iterativ optimieren

Auf Basis echter Nutzungssignale werden Seiten, Inhalte und CTA-Pfade
verbessert.
```

##### Section 3: Was du im Ergebnis für Sichtbarkeit, Inhalte und Messbarkeit bekommst.

- ID: deliverables
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Lieferumfang
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Lieferumfang

Was du im Ergebnis für Sichtbarkeit, Inhalte und Messbarkeit bekommst.

SEO-Struktur

Damit die richtigen Seiten für die richtigen Suchmuster arbeiten.

- Themen- und Zielseitenstruktur

- interne Verlinkungslogik

- Priorisierung nach Angebot und Potenzial

Content-Richtung

Damit Inhalte Nachfrage aufbauen statt nur Fläche zu füllen.

- Themencluster und Content-Roadmap

- Abstimmung auf Angebots- und Funnel-Logik

- klare Prioritäten statt beliebiger Themenlisten

Messbares Setup

Damit Entscheidungen auf Daten mit Aussagekraft basieren.

- relevante CTA- und Kontakt-Events

- Prioritäten für Optimierung

- typischer Umsetzungsrahmen je nach Website-Reife und Umfang
```

##### Section 4: Kein Vanity-Traffic. Keine Reports ohne Konsequenz.

- ID: standards
- aria-labelledby: keine
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Standards
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Standards

Kein Vanity-Traffic. Keine Reports ohne Konsequenz.

SEO und Marketing müssen zur Angebotslogik passen. Sonst wirkt mehr Sichtbarkeit nur wie mehr Aufwand,
nicht wie mehr Wirkung.

Angebot zuerst

Ich plane Such- und Content-Strukturen nicht losgelöst, sondern entlang der
Leistung und Zielgruppe.

Messung mit Relevanz

Nur Events und Kennzahlen, die echte Entscheidungen zu Nutzerführung und
Nachfrage verbessern.

Verzahnung mit Website und Branding

Sichtbarkeit wirkt am stärksten, wenn Auftritt, Angebot und Inhalte
dieselbe Qualitätsstufe haben.
```

##### Section 5: SEO & Marketing funktionieren am stärksten auf einem
klaren Fundament.

- ID: related
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende nächste Schritte
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen
ansehen), `branding.html` (Leistungen
ansehen), `insights.html` (Insights ansehen)
- Bilder in dieser Section: keine

```text
Passende nächste Schritte

SEO & Marketing funktionieren am stärksten auf einem
klaren Fundament.

Fundament

Website-Struktur optimieren

Wenn Zielseiten, Inhalte und CTA-Wege technisch und strukturell noch nicht
sauber genug aufgesetzt sind.

Leistungen
ansehen

Botschaft

Positionierung schärfen

Wenn Sichtbarkeit zwar da ist, das Angebot aber noch nicht klar genug im
Markt verankert wird.

Leistungen
ansehen

Proof

Insights und Projekte ansehen

Wenn du sehen willst, welche Themen und Projektmuster zu SEO und Marketing
passen.

Insights ansehen
```

##### Section 6: Wenn Sichtbarkeit sauber in qualifizierte Anfragen übersetzen soll.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn Sichtbarkeit sauber in qualifizierte Anfragen übersetzen soll.

Dann beginnen wir mit einem strukturierten Gespräch oder einem
fokussierten Mini-Audit und sortieren zuerst Zielseiten, Themen und Messpunkte.

Erstgespräch buchen
Mini-Audit anfordern
```

### social.html

- Titel: Social Strategie | Smart Web Studio
- Meta-Description: Social Strategie von Smart Web Studio: Themencluster, Content-Systeme und klare Übergänge von Aufmerksamkeit in Angebot und Anfrage.
- Canonical: -
- data-page: social
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `social`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `#approach` -> Ansatz
- `#deliverables` -> Lieferumfang
- `#standards` -> Standards
- `#related` -> Nächste Schritte
- `branding.html` -> Leistungen ansehen
- `webentwicklung.html` -> Leistungen ansehen
- `growth.html` -> Leistungen ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- Sprungnavigation Social Strategie: Ansatz -> #approach | Lieferumfang -> #deliverables | Standards -> #standards | Nächste Schritte -> #related

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Social Content braucht Richtung, System und einen klaren Weg ins Angebot.

- ID: keine
- aria-labelledby: social-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Social Strategie
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `#approach` (Ansatz), `#deliverables` (Lieferumfang), `#standards` (Standards), `#related` (Nächste Schritte)
- Bilder in dieser Section: keine

```text
Social Strategie

Social Content braucht Richtung, System und einen klaren Weg ins Angebot.

Ich entwickle Themenfelder, Content-Formate und CTA-Übergänge so, dass Social Media nicht nur Aktivität
zeigt, sondern Vertrauen und Nachfrage vorbereitet.

Erstgespräch buchen
Mini-Audit anfordern

Content System

Nicht mehr posten, sondern relevanter kommunizieren.

- Themencluster aus Zielgruppe und Angebot

- wiederverwendbare Formate und Templates

- saubere Übergänge in Website, Kontakt oder Audit

- Ansatz

- Lieferumfang

- Standards

- Nächste Schritte
```

##### Section 2: Social wird aus Positionierung und Angebotslogik gedacht.

- ID: approach
- aria-labelledby: keine
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ansatz
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ansatz

Social wird aus Positionierung und Angebotslogik gedacht.

So entstehen Inhalte, die nicht nur Reichweite schaffen, sondern Vertrauen
aufbauen und in sinnvolle nächste Schritte führen.

- 01

01

Themenfelder definieren

Was zahlt auf Positionierung, Expertise und Nachfrage ein?

- 02

02

Formate und Templates aufbauen

Damit Content-Produktion schneller, konsistenter und leichter skalierbar
wird.

- 03

03

CTA-Wege definieren

Content führt in Website, Kontakt, Mini-Audit oder Erstgespräch statt im Feed
zu enden.

- 04

04

Rhythmus realistisch planen

Das System muss zu Ressourcen, Team und Zielsetzung passen, sonst wird es
nicht durchgezogen.
```

##### Section 3: Was du konkret für Social, Content und Übergänge bekommst.

- ID: deliverables
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Lieferumfang
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Lieferumfang

Was du konkret für Social, Content und Übergänge bekommst.

Themen- und Redaktionslogik

Für mehr Relevanz und weniger Zufall.

- Themencluster nach Zielgruppe und Angebot

- Prioritäten nach Funnel-Stufe

- klare Themenrolle pro Kanal

Formate & Templates

Für schnellere Produktion und konsistenteren Auftritt.

- wiederverwendbare Content-Formate

- visuelle und textliche Leitplanken

- Grundlage für planbaren Output

Übergang in die Anfrage

Für Content, der auf Angebote einzahlt.

- CTA- und Landingpage-Logik

- Brücken in Website und Kontakt

- typischer Rahmen je nach Teamgröße und Content-Reife
```

##### Section 4: Social muss machbar sein, nicht nur strategisch gut
klingen.

- ID: standards
- aria-labelledby: keine
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Standards
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Standards

Social muss machbar sein, nicht nur strategisch gut
klingen.

Deshalb arbeite ich mit Systemen, die zum Team, zur Zielgruppe und zu den
tatsächlichen Ressourcen passen.

Angebotsnähe

Social Content muss auf Leistung, Expertise und Kontaktwege einzahlen.

Realistische Umsetzung

Kein Format-Overkill, sondern ein sauberer Rahmen, den man wirklich
durchhalten kann.

Konsistenz mit Marke und Website

Social wird nicht isoliert gedacht, sondern als Erweiterung des gesamten
Auftritts.
```

##### Section 5: Social Strategie wird stärker, wenn Marke, Website und
Growth sauber anschließen.

- ID: related
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende nächste Schritte
- Interne Links in dieser Section: `branding.html` (Leistungen ansehen), `webentwicklung.html` (Leistungen ansehen), `growth.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Passende nächste Schritte

Social Strategie wird stärker, wenn Marke, Website und
Growth sauber anschließen.

Grundlage

Branding schärfen

Wenn die Botschaft noch nicht klar genug ist, bevor Themen und Inhalte
geplant werden.

Leistungen ansehen

Zielseiten

Website und Landingpages ausrichten

Wenn Social-Anfragen später in eine sauberere Website-Struktur überführt
werden sollen.

Leistungen ansehen

Skalierung

Growth Strategie ergänzen

Wenn Social-Aktivität in ein systematischeres Funnel- und Conversion-Setup
übergehen soll.

Leistungen ansehen
```

##### Section 6: Wenn Social nicht nur präsent, sondern wirksam sein soll.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn Social nicht nur präsent, sondern wirksam sein soll.

Dann beginnen wir mit einer klaren Themen- und Angebotslogik statt mit
dem nächsten spontanen Post.

Erstgespräch buchen
Mini-Audit anfordern
```

### growth.html

- Titel: Growth Strategie | Smart Web Studio
- Meta-Description: Growth Strategie von Smart Web Studio: Funnel-Logik, Conversion-Optimierung, Tracking und Experimente für Unternehmen mit skalierbarem Angebotsmodell.
- Canonical: -
- data-page: growth
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `growth`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `#approach` -> Ansatz
- `#deliverables` -> Lieferumfang
- `#standards` -> Standards
- `#related` -> Nächste Schritte
- `webentwicklung.html` -> Leistungen ansehen
- `seo-marketing.html` -> Leistungen ansehen
- `projekte.html` -> Projekt ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- Sprungnavigation Growth Strategie: Ansatz -> #approach | Lieferumfang -> #deliverables | Standards -> #standards | Nächste Schritte -> #related

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Growth wird erst dann sinnvoll, wenn Angebot, Website und Tracking stabil genug sind.

- ID: keine
- aria-labelledby: growth-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Growth Strategie
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `#approach` (Ansatz), `#deliverables` (Lieferumfang), `#standards` (Standards), `#related` (Nächste Schritte)
- Bilder in dieser Section: keine

```text
Growth Strategie

Growth wird erst dann sinnvoll, wenn Angebot, Website und Tracking stabil genug sind.

Ich entwickle Funnel-Logik, Conversion-Hebel und Experimente für Unternehmen, die aus einem guten
Auftritt ein systematisches Wachstums-Setup machen wollen.

Erstgespräch buchen
Mini-Audit anfordern

Growth Layer

Keine Taktik-Sammlung, sondern ein lernfähiges System.

- Funnel- und Angebotslogik

- Conversion-Optimierung und Priorisierung

- Tracking, Hypothesen und Experimente

- Ansatz

- Lieferumfang

- Standards

- Nächste Schritte
```

##### Section 2: Growth beginnt mit der Frage, was zuerst den größten Hebel
hat.

- ID: approach
- aria-labelledby: keine
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ansatz
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ansatz

Growth beginnt mit der Frage, was zuerst den größten Hebel
hat.

Deshalb priorisiere ich Funnel-Reibung, Datenbasis und Testlogik, bevor
einzelne Maßnahmen überhaupt live gehen.

- 01

01

Funnel-Landkarte bauen

Wo kommen Interessenten rein, wo gehen sie verloren und welche Wege sind
prioritär?

- 02

02

Messpunkte definieren

Events, Kontaktwege und Engpässe werden so sichtbar, dass daraus echte
Prioritäten entstehen.

- 03

03

Optimierungs-Backlog priorisieren

Nicht alles gleichzeitig, sondern die Hebel mit dem größten erwartbaren
Impact zuerst.

- 04

04

Experimente kontrolliert fahren

Hypothesen, Learnings und nächste Iterationen werden dokumentiert statt im
Tagesgeschäft zu verschwinden.
```

##### Section 3: Was du konkret für Priorisierung, Optimierung und
Wachstumssystem bekommst.

- ID: deliverables
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Lieferumfang
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Lieferumfang

Was du konkret für Priorisierung, Optimierung und
Wachstumssystem bekommst.

Funnel- und Angebotslogik

Für klarere Wege zwischen Interesse und Anfrage.

- Priorisierung der Einstiegspunkte

- Verbindung von Angeboten und CTA-Wegen

- Abstimmung auf Website und Sichtbarkeit

Tracking & Prioritäten

Für bessere Entscheidungen statt permanenter Bauchgefühl-Schleifen.

- relevante Messpunkte und Event-Logik

- Backlog nach Hebel und Wirkung

- klare Reihenfolge für Tests und Optimierungen

Experimente mit Lernlogik

Für systematische Weiterentwicklung statt Aktionismus.

- Hypothesen und Testansätze

- Dokumentation von Learnings

- typischer Rahmen je nach Setup-Reife und Team
```

##### Section 4: Kein Growth-Theater ohne Fundament, Tracking und echte
Lernschleifen.

- ID: standards
- aria-labelledby: keine
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Standards
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Standards

Kein Growth-Theater ohne Fundament, Tracking und echte
Lernschleifen.

Growth ist nur sinnvoll, wenn die Website, das Angebot und die Datenbasis
stabil genug sind, um daraus belastbare Entscheidungen abzuleiten.

Fundament vor Skalierung

Ich setze Growth nicht auf ein unscharfes Angebot oder eine unklare Website
oben drauf.

Daten mit Aussagekraft

Nicht alles wird gemessen, sondern nur das, was echte Hebel sichtbar macht.

Lernlogik statt Aktionismus

Jedes Experiment braucht eine klare Hypothese und einen nachvollziehbaren
nächsten Schritt.
```

##### Section 5: Growth funktioniert am besten auf einem klaren technischen
und inhaltlichen Fundament.

- ID: related
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende nächste Schritte
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen ansehen), `seo-marketing.html` (Leistungen ansehen), `projekte.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Passende nächste Schritte

Growth funktioniert am besten auf einem klaren technischen
und inhaltlichen Fundament.

Website

Conversion-Basis schärfen

Wenn zuerst die Website-Struktur, Zielseiten und Kontaktwege klarer werden
müssen.

Leistungen ansehen

Nachfrage

SEO & Marketing anbinden

Wenn Funnel, Sichtbarkeit und Content gemeinsam auf mehr qualifizierte
Nachfrage einzahlen sollen.

Leistungen ansehen

Proof

Projektmuster ansehen

Wenn du prüfen willst, wie Strategie, Website und Growth in einer Case Study
zusammenlaufen.

Projekt ansehen
```

##### Section 6: Wenn Wachstum systematisch statt zufällig werden soll.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn Wachstum systematisch statt zufällig werden soll.

Dann beginnen wir mit Prioritäten, Daten und klaren Hebeln statt mit der
nächsten unsortierten Maßnahme.

Erstgespräch buchen
Mini-Audit anfordern
```

### ki-beratung.html

- Titel: KI Beratung | Smart Web Studio
- Meta-Description: KI Beratung von Smart Web Studio: strategische Einordnung, sinnvolle Einsatzfelder, klare Prozesslogik und Qualitätskontrolle für Unternehmen, die KI wirksam statt beliebig einsetzen wollen.
- Canonical: -
- data-page: ki-beratung
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `ki-beratung`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> KI Beratung anfragen (x2)
- `kontakt.html#kontaktformular` -> Potenzial schildern (x2)
- `#approach` -> Ansatz
- `#deliverables` -> Lieferumfang
- `#standards` -> Standards
- `#related` -> Nächste Schritte
- `branding.html` -> Leistungen ansehen
- `webentwicklung.html` -> Leistungen ansehen
- `seo-marketing.html` -> Leistungen ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- Sprungnavigation KI Beratung: Ansatz -> #approach | Lieferumfang -> #deliverables | Standards -> #standards | Nächste Schritte -> #related

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- KI Beratung anfragen: href `kontakt.html#terminbuchung`, project `KI Beratung`, timeline `Innerhalb von 2-4 Wochen`, target `-`, message `Ich möchte KI sinnvoll in Website, Content oder interne Arbeitsweise einordnen und den passenden Einstieg klären.`
- Potenzial schildern: href `kontakt.html#kontaktformular`, project `KI Beratung`, timeline `Noch offen`, target `-`, message `Ich möchte KI sinnvoll in Website, Content oder interne Arbeitsweise einordnen und suche eine strukturierte Ersteinschätzung.`
- KI Beratung anfragen: href `kontakt.html#terminbuchung`, project `KI Beratung`, timeline `Innerhalb von 2-4 Wochen`, target `-`, message `Ich möchte KI sinnvoll in Website, Content oder interne Arbeitsweise einordnen und den passenden Einstieg klären.`
- Potenzial schildern: href `kontakt.html#kontaktformular`, project `KI Beratung`, timeline `Noch offen`, target `-`, message `Ich möchte KI sinnvoll in Website, Content oder interne Arbeitsweise einordnen und suche eine strukturierte Ersteinschätzung.`

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: KI sinnvoll einsetzen, ohne Qualität, Verantwortung und Markenlogik an Tools abzugeben.

- ID: keine
- aria-labelledby: ai-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: KI Beratung
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (KI Beratung anfragen), `kontakt.html#kontaktformular` (Potenzial schildern), `#approach` (Ansatz), `#deliverables` (Lieferumfang), `#standards` (Standards), `#related` (Nächste Schritte)
- Bilder in dieser Section: keine

```text
KI Beratung

KI sinnvoll einsetzen, ohne Qualität, Verantwortung und Markenlogik an Tools abzugeben.

Ich ordne ein, wo KI in Recherche, Content, Struktur und internen Prozessen wirklich Tempo bringt und
wo Priorisierung, Freigabe und Qualitätskontrolle bewusst menschlich bleiben sollten.

KI Beratung anfragen

Potenzial schildern

Strategische KI-Einordnung

Nicht mehr Tool-Output, sondern mehr Klarheit in Rollen, Einsatzfeldern und Qualität.

- sinnvolle Einsatzfelder statt blindem Tool-Aktionismus

- klare Guardrails für Tonalität, Freigaben und Verantwortung

- Anbindung an Website, Content und bestehende Arbeitslogik

KI mit Richtung

Tempo dort, wo es hilft.
Qualität dort, wo sie gehalten werden muss.
Klarheit statt Buzzword-Druck.

KI wird nicht als Showeffekt verkauft, sondern als sauber eingeordneter Hebel für bessere Prozesse,
bessere Inhalte und bessere Entscheidungen.

- Ansatz

- Lieferumfang

- Standards

- Nächste Schritte
```

##### Section 2: Erst die Logik klären, dann KI sauber in Arbeitsweise und Touchpoints übersetzen.

- ID: approach
- aria-labelledby: ai-approach-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ansatz
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ansatz

Erst die Logik klären, dann KI sauber in Arbeitsweise und Touchpoints übersetzen.

Ich sortiere nicht zuerst Tools, sondern Ausgangslage, Risiken, Prioritäten und die Stellen, an denen KI
im Projekt wirklich Substanz bringt.

-
01

01

Ausgangslage und Zielbild prüfen

Wo steht das Team heute, welche Reibung ist da und was soll durch KI konkret besser werden?

-
02

02

Einsatzfelder priorisieren

Recherche, Struktur, Content, interne Prozesse oder Website-Module werden nach Nutzen und Risiko sortiert.

-
03

03

Guardrails und Rollen definieren

Tonalität, Freigaben, Datenschutz, Verantwortung und Qualitätskontrolle werden verbindlich eingeordnet.

-
04

04

In Website, Content und Prozesse übersetzen

Das Ergebnis ist ein realistisch nutzbares Setup statt einer losen Liste von Tools und Prompts.
```

##### Section 3: Was du konkret für eine saubere KI-Arbeitsweise mitnimmst.

- ID: deliverables
- aria-labelledby: ai-deliverables-title
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Lieferumfang
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Lieferumfang

Was du konkret für eine saubere KI-Arbeitsweise mitnimmst.

Strategische Einordnung

Für Klarheit über die sinnvollsten Hebel statt Tool-Sammeln.

- Priorisierung relevanter KI-Einsatzfelder

- Einordnung nach Risiko, Nutzen und Prozessnähe

- Verbindung zu Angebot, Zielgruppe und Markenton

KI-Leitplanken

Für Freigaben, Tonalität und verlässliche Qualität im Alltag.

- klare Rollen für Erstellung, Prüfung und finale Freigabe

- Guardrails für Content, Website und interne Nutzung

- Grenzen dessen, was bewusst nicht automatisiert wird

Umsetzbare Startpunkte

Für einen realistischen Einstieg ohne Prozessbruch.

- empfohlene erste Anwendungsfälle mit geringer Reibung

- Anbindung an bestehende Website- und Content-Prozesse

- nächste Schritte für saubere Einführung und Iteration
```

##### Section 4: Kein KI-Theater ohne Kontext, Kontrolle und Anschluss an das reale Geschäft.

- ID: standards
- aria-labelledby: keine
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Standards
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Standards

Kein KI-Theater ohne Kontext, Kontrolle und Anschluss an das reale Geschäft.

KI ist nur dann sinnvoll, wenn sie Zeit spart, ohne Marke, Vertrauensaufbau und Entscheidungsqualität
zu beschädigen.

Marke vor Mustertext

Ich setze KI nicht so ein, dass Botschaften austauschbar oder beliebig wirken.

Verantwortung bleibt klar

Freigaben, Qualität und strategische Priorisierung werden nicht an das Tool delegiert.

Nur dort beschleunigen, wo es wirklich hilft

Tempo ist kein Selbstzweck. Entscheidend ist, ob Prozesse dadurch belastbarer und relevanter werden.
```

##### Section 5: KI Beratung wirkt am stärksten, wenn Marke, Website und Nachfrage sauber angeschlossen sind.

- ID: related
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende nächste Schritte
- Interne Links in dieser Section: `branding.html` (Leistungen ansehen), `webentwicklung.html` (Leistungen ansehen), `seo-marketing.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Passende nächste Schritte

KI Beratung wirkt am stärksten, wenn Marke, Website und Nachfrage sauber angeschlossen sind.

Botschaft

Positionierung schärfen

Wenn KI-generierte Inhalte erst dann sinnvoll werden, wenn Angebot und Tonalität klarer geführt sind.

Leistungen ansehen

Struktur

Website-System vorbereiten

Wenn KI-gestützte Inhalte, Module und Nutzerwege in eine saubere Seitenlogik eingebettet werden sollen.

Leistungen ansehen

Nachfrage

SEO & Marketing anbinden

Wenn KI-gestützte Recherche, Content-Struktur und Sichtbarkeit sinnvoll in den Marktauftritt übersetzt werden sollen.

Leistungen ansehen
```

##### Section 6: Wenn KI in deinem Auftritt und in deinen Prozessen sinnvoll statt zufällig arbeiten soll.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (KI Beratung anfragen), `kontakt.html#kontaktformular` (Potenzial schildern)
- Bilder in dieser Section: keine

```text
Wenn KI in deinem Auftritt und in deinen Prozessen sinnvoll statt zufällig arbeiten soll.

Dann beginnen wir mit einer strukturierten Einordnung und definieren zuerst Rollen, Guardrails und die
Stellen, an denen KI tatsächlich Wirkung bringt.

KI Beratung anfragen

Potenzial schildern
```

### projekte.html

- Titel: Projekte | Smart Web Studio
- Meta-Description: Projekte und Leistungsbeweise von Smart Web Studio: strukturierte Projektkarten, anonymisierte Case-Study-Logik und qualitative Ergebnisse statt erfundener Zahlen.
- Canonical: -
- data-page: projekte
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `projekte`

#### Interne Links im Hauptinhalt

- `projekte/website-branding-setup.html` -> Mehr zur Projektart
- `projekte/relaunch-seo.html` -> Mehr zur Projektart
- `projekte/content-tracking-system.html` -> Mehr zur Projektart
- `projekte/funnel-optimierung.html` -> Mehr zur Projektart
- `case-study.html` -> Projekt
ansehen
- `kontakt.html#terminbuchung` -> Erstgespräch buchen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- `projekte/website-branding-setup.html`
- `projekte/relaunch-seo.html`
- `projekte/content-tracking-system.html`
- `projekte/funnel-optimierung.html`

#### Sprungnavigation

- keine

#### Filterlogik

- Gruppe `projects`: Werte `all`, `website`, `branding`, `seo`, `growth` | Kategorien in Items: `website`, `branding`, `seo`, `growth`

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Leistungsbeweise ohne Showroom-Fassade, aber mit klarer Projektlogik.

- ID: keine
- aria-labelledby: projects-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projekte
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Projekte

Leistungsbeweise ohne Showroom-Fassade, aber mit klarer Projektlogik.

Solange keine freigegebenen Kundendaten vorliegen, zeige ich transparent, wie Projekte aufgebaut,
priorisiert und qualitativ verbessert werden. Keine Fake-Zahlen. Keine Platzhalter-Testimonials.

Was du hier siehst

Reale Projektformate statt frei erfundener Erfolgsslides.

- Ausgangslage, Maßnahme und qualitative Wirkung

- Anonymisierte Case-Study-Struktur

- klare Verbindung zu Leistung, Prozess und Kontakt
```

##### Section 2: Vier typische Projektarten mit klarer Maßnahme und nachvollziehbarer Wirkung.

- ID: keine
- aria-labelledby: project-grid-title
- Klassen: packages-section project-grid-section section-surface--global py-16 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projektmuster
- Interne Links in dieser Section: `projekte/website-branding-setup.html` (Mehr zur Projektart), `projekte/relaunch-seo.html` (Mehr zur Projektart), `projekte/content-tracking-system.html` (Mehr zur Projektart), `projekte/funnel-optimierung.html` (Mehr zur Projektart)
- Bilder in dieser Section: keine

```text
Projektmuster

Vier typische Projektarten mit klarer Maßnahme und nachvollziehbarer Wirkung.

Alle
Website
Branding
SEO
Growth

Website + Branding

Marken- und Website-Setup für ein spezialisiertes Angebot

Ausgangslage: Das Angebot war stark, aber im Markt zu breit und
visuell uneinheitlich dargestellt.

Maßnahme: Positionierung schärfen, Website neu strukturieren,
Kontaktwege priorisieren und Design konsistent übersetzen.

Ergebnis: Klarerer Premium-Eindruck, bessere Nutzerführung und
ein professionellerer Weg von Interesse zu Anfrage.

Mehr zur Projektart

Website + SEO

Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis

Ausgangslage: Die Website hatte Inhalte, aber keine klare
Seitenlogik für Zielgruppen, Suchintention und Kontakt.

Maßnahme: Zielseiten priorisieren, interne Verlinkung anpassen,
Headings und CTA-Wege sauber aufeinander ausrichten.

Ergebnis: Bessere Orientierung, stärkere thematische Klarheit und
mehr Vertrauen entlang der wichtigsten Nutzerwege.

Mehr zur Projektart

SEO + Growth

Content- und Tracking-System für planbarere Optimierung

Ausgangslage: Es gab einzelne Marketing-Maßnahmen, aber keine
belastbare Reihenfolge zwischen Themen, Zielseiten und Messpunkten.

Maßnahme: Themencluster priorisieren, Conversion-Events definieren
und Optimierungs-Backlog nach Wirkung sortieren.

Ergebnis: Klarere Entscheidungsgrundlagen, bessere Priorisierung
und ein ruhigeres, systematischeres Growth-Setup.

Mehr zur Projektart

Growth + Website

Optimierungs-Sprint für klarere Funnel- und Kontaktwege

Ausgangslage: Die Nachfrage war vorhanden, doch Angebot,
Kontaktformular und CTA-Logik erzeugten unnötige Reibung.

Maßnahme: Funnel-Landkarte aufbauen, Kontaktwege entlasten,
Conversion-Hürden reduzieren und Hypothesen priorisieren.

Ergebnis: Weniger Reibung im Weg zur Anfrage und ein besser
steuerbares Setup für weitere Optimierungszyklen.

Mehr zur Projektart
```

##### Section 3: Ergebnisse werden hier qualitativ gezeigt, nicht künstlich aufgeblasen.

- ID: keine
- aria-labelledby: proof-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Proof ohne Fake-Elemente
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Proof ohne Fake-Elemente

Ergebnisse werden hier qualitativ gezeigt, nicht künstlich aufgeblasen.

Statt frei erfundener Zahlen fokussiere ich auf die spürbaren Verbesserungen: klarere Positionierung,
strukturiertere Nutzerführung, professionellerer Eindruck und bessere nächste Schritte.

Wahrnehmung

Mehr Klarheit im Marktauftritt

Angebot, Nutzen und Differenzierung werden schneller verständlich und dadurch
glaubwürdiger.

Nutzerführung

Weniger Reibung in den wichtigsten Wegen

Besucher sehen schneller, was relevant ist und welcher Schritt als nächstes
sinnvoll ist.

Prozess

Bessere Steuerbarkeit nach dem Launch

Struktur, Tracking und Prioritäten machen Weiterentwicklung ruhiger und
nachvollziehbarer.
```

##### Section 4: Wenn du sehen willst, wie dieselbe Klarheit in deinem Projekt aussehen kann.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section section-surface--global py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `case-study.html` (Projekt
ansehen), `kontakt.html#terminbuchung` (Erstgespräch buchen)
- Bilder in dieser Section: keine

```text
Wenn du sehen willst, wie dieselbe Klarheit in deinem Projekt aussehen kann.

Dann geh direkt in die Case Study oder wir sprechen über Ausgangslage,
Prioritäten und den sinnvollsten Einstieg.

Projekt
ansehen
Erstgespräch buchen
```

### projekte/website-branding-setup.html

- Titel: Marken- und Website-Setup | Smart Web Studio
- Meta-Description: Marken- und Website-Setup für ein spezialisiertes Angebot: Positionierung schärfen, Seitenstruktur ordnen und Markenidentität konsistent übersetzen.
- Canonical: -
- data-page: projekt-website-branding-setup
- body id: top
- Base-HREF: ../
- Stylesheets: `../src/css/style.css`, `../src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `../src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `projekt-website-branding-setup`

#### Interne Links im Hauptinhalt

- `projekte/relaunch-seo.html` -> Mehr zur Projektart
- `projekte/content-tracking-system.html` -> Mehr zur Projektart
- `projekte/funnel-optimierung.html` -> Mehr zur Projektart
- `kontakt.html#terminbuchung` -> Projekt besprechen
- `projekte.html` -> Alle Projektarten

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Marken- und Website-Setup für ein spezialisiertes Angebot

- ID: keine
- aria-labelledby: page-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Website + Branding
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Website + Branding

Marken- und Website-Setup für ein spezialisiertes Angebot

Diese Projektart richtet sich an Unternehmen, deren Angebot fachlich stark ist, jedoch im Markt zu
breit oder visuell uneinheitlich wirkt. Ziel ist ein klarer Außenauftritt, bei dem Positionierung,
Struktur und Design konsistent zusammengeführt werden.

Projektschwerpunkt

Positionierung, Struktur und Design in Einklang bringen.

- Markenidentität klar und konsistent übersetzen

- Seitenarchitektur und Nutzerführung neu ordnen

- Klare Kontakt- und CTA-Struktur aufbauen
```

##### Section 2: Für wen diese Projektart geeignet ist

- ID: keine
- aria-labelledby: fuer-wen-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Passende Ausgangslage

Für wen diese Projektart geeignet ist

Diese Projektart eignet sich besonders, wenn Angebot und Marktauftritt auseinanderfallen und ein
klareres, professionelleres Bild nach außen gefragt ist.

Positionierung

Gutes Angebot, unklarer Marktauftritt

Das Angebot ist vorhanden, wird auf dem Markt jedoch nicht klar genug zur
Geltung gebracht.

Website

Uneinheitlicher digitaler Auftritt

Visuelle Sprache, Inhalte und Navigation folgen keiner gemeinsamen Logik und
wirken unstrukturiert.

Onlinepräsenz

Veraltete oder unstrukturierte Präsenz

Die bestehende Website entspricht nicht mehr dem aktuellen Angebot oder wirkt
nicht mehr zeitgemäß.

Spezialisierung

Angebot, das stärker fokussiert werden soll

Das Unternehmen möchte sein Profil am Markt stärker schärfen und sich klarer
differenzieren.
```

##### Section 3: Der typische Startpunkt dieser Projektart

- ID: keine
- aria-labelledby: ausgangslage-title
- Klassen: py-16 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-focus-section section-surface--global
- Eyebrow/Label: Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ausgangslage

Der typische Startpunkt dieser Projektart

Das Angebot ist vorhanden, wird jedoch auf der Website nicht klar vermittelt. Positionierung,
Seitenstruktur und visuelle Sprache greifen nicht sauber ineinander. Nutzer erkennen zu spät, wofür
das Unternehmen steht und welche Handlung als Nächstes sinnvoll ist.

Was umgesetzt wird

Die zentralen Maßnahmen in dieser Projektart.

- Schärfung der Positionierung

- Neuordnung der Seitenstruktur

- Konsistente Übersetzung der Markenidentität in Design

- Verbesserung der Nutzerführung

- Klare Kontakt- und CTA-Struktur
```

##### Section 4: In fünf Schritten zum klaren Außenauftritt

- ID: keine
- aria-labelledby: ablauf-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projektablauf
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Projektablauf

In fünf Schritten zum klaren Außenauftritt

-
01

01

Analyse des bestehenden Auftritts

Sichtung der vorhandenen Website, visuellen Sprache und
Positionierungsbotschaften, um Schwachstellen und Potenziale klar zu benennen.

-
02

02

Strukturierung der Angebotslogik

Klärung, was das Angebot ist, für wen es relevant ist und wie es sich klar
von anderen abgrenzt.

-
03

03

Entwicklung einer klaren Seitenarchitektur

Aufbau einer logischen Seitenstruktur, die Nutzer klar führt und die
wichtigsten Kontaktwege sichtbar macht.

-
04

04

Überarbeitung von Design und Inhalten

Visuelle Sprache, Texte und Inhalte werden auf die geschärfte
Positionierung ausgerichtet und konsistent umgesetzt.

-
05

05

Umsetzung und Feinschliff

Technische Umsetzung, Qualitätssicherung und abschließende Optimierung für
einen sauberen Launch.
```

##### Section 5: Was sich durch dieses Projekt verändert

- ID: keine
- aria-labelledby: wirkung-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Erwartete Wirkung
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Erwartete Wirkung

Was sich durch dieses Projekt verändert

Die Wirkung zeigt sich nicht in abstrakten Metriken, sondern in der wahrnehmbaren Qualität des
Außenauftritts.

Wahrnehmung

Klarerer Premium-Eindruck

Das Unternehmen wirkt fokussierter und professioneller im Markt.

Nutzerführung

Bessere Orientierung auf der Website

Besucher verstehen schneller, was relevant ist und welcher Schritt als
Nächstes sinnvoll ist.

Auftritt

Stärkerer professioneller Außenauftritt

Positionierung, Design und Inhalte folgen einer gemeinsamen Logik und wirken
überzeugend.

Conversion

Verbesserter Weg von Interesse zu Anfrage

Klare CTAs und ein strukturierter Kontaktweg reduzieren die Hürde zur ersten
Anfrage.
```

##### Section 6: Weitere Projektarten im Überblick

- ID: keine
- aria-labelledby: verwandte-title
- Klassen: packages-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Verwandte Projektarten
- Interne Links in dieser Section: `projekte/relaunch-seo.html` (Mehr zur Projektart), `projekte/content-tracking-system.html` (Mehr zur Projektart), `projekte/funnel-optimierung.html` (Mehr zur Projektart)
- Bilder in dieser Section: keine

```text
Verwandte Projektarten

Weitere Projektarten im Überblick

Website + SEO

Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis

Für Websites mit vorhandenen Inhalten, aber ohne klare Seitenlogik für
Zielgruppen, Suchintention und Kontaktwege.

Mehr zur Projektart

SEO + Growth

Content- und Tracking-System für planbare Optimierung

Für Unternehmen mit Marketingmaßnahmen, aber ohne klare Struktur zwischen
Themen, Zielseiten und Tracking.

Mehr zur Projektart

Growth + Website

Optimierungs-Sprint für klarere Funnel- und Kontaktwege

Für Websites mit vorhandener Nachfrage, aber Reibung in Angebot, Formular
oder CTA-Struktur.

Mehr zur Projektart
```

##### Section 7: Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section section-surface--global py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Projekt besprechen), `projekte.html` (Alle Projektarten)
- Bilder in dieser Section: keine

```text
Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

Dann starten wir mit einem strukturierten Gespräch, klären die
Prioritäten und definieren den sinnvollsten nächsten Schritt.

Projekt besprechen
Alle Projektarten
```

### projekte/relaunch-seo.html

- Titel: Relaunch mit Conversion- und Sichtbarkeitsbasis | Smart Web Studio
- Meta-Description: Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis: Zielseiten priorisieren, Informationsarchitektur verbessern und klare Nutzerwege aufbauen.
- Canonical: -
- data-page: projekt-relaunch-seo
- body id: top
- Base-HREF: ../
- Stylesheets: `../src/css/style.css`, `../src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `../src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `projekt-relaunch-seo`

#### Interne Links im Hauptinhalt

- `projekte/website-branding-setup.html` -> Mehr zur Projektart
- `projekte/content-tracking-system.html` -> Mehr zur Projektart
- `projekte/funnel-optimierung.html` -> Mehr zur Projektart
- `kontakt.html#terminbuchung` -> Relaunch anfragen
- `projekte.html` -> Alle Projektarten

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis

- ID: keine
- aria-labelledby: page-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Website + SEO
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Website + SEO

Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis

Diese Projektart richtet sich an Websites mit vorhandenen Inhalten, jedoch ohne klare Seitenlogik
für Zielgruppen, Suchintention und Kontaktwege. Ziel ist eine strukturierte Neuausrichtung, die
Sichtbarkeit und Conversion gleichermaßen stärkt.

Projektschwerpunkt

Struktur, Sichtbarkeit und Nutzerwege neu ausrichten.

- Zentrale Zielseiten identifizieren und priorisieren

- Informationsarchitektur und interne Verlinkung optimieren

- CTA-Logik und Kontaktwege sauber ausrichten
```

##### Section 2: Für wen diese Projektart geeignet ist

- ID: keine
- aria-labelledby: fuer-wen-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Passende Ausgangslage

Für wen diese Projektart geeignet ist

Diese Projektart passt besonders, wenn eine Website bereits Inhalte und Besucher hat, aber keine
klare Struktur für Sichtbarkeit und Anfragen bietet.

Struktur

Bestehende Website ohne klare Logik

Die Website ist vorhanden, aber Seitenstruktur und Nutzerführung folgen
keiner durchgängigen Priorität.

Sichtbarkeit

Inhalte mit geringer Sichtbarkeit

Content ist vorhanden, wird jedoch von Suchmaschinen und Nutzern nicht klar
genug wahrgenommen.

Landingpages

Unklare oder fehlende Zielseiten

Es fehlen dedizierte Seiten, die Suchintentionen und Zielgruppen gezielt
ansprechen.

Neuausrichtung

Strategischer Neuaufbau gewünscht

Die Website soll nicht nur optisch erneuert, sondern inhaltlich und
strukturell neu aufgestellt werden.
```

##### Section 3: Der typische Startpunkt dieser Projektart

- ID: keine
- aria-labelledby: ausgangslage-title
- Klassen: py-16 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-focus-section section-surface--global
- Eyebrow/Label: Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ausgangslage

Der typische Startpunkt dieser Projektart

Inhalte sind vorhanden, jedoch fehlt eine klare Priorisierung der wichtigsten Seiten. Themenstruktur,
interne Verlinkung und Kontaktlogik sind nicht aufeinander abgestimmt. Besucher finden sich schwer
zurecht und der Weg zur Anfrage bleibt unklar.

Was umgesetzt wird

Die zentralen Maßnahmen in dieser Projektart.

- Priorisierung zentraler Zielseiten

- Verbesserung der Informationsarchitektur

- Optimierung interner Verlinkung

- Klarere Contentstruktur

- Saubere CTA-Logik
```

##### Section 4: In fünf Schritten zum strukturierten Relaunch

- ID: keine
- aria-labelledby: ablauf-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projektablauf
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Projektablauf

In fünf Schritten zum strukturierten Relaunch

-
01

01

Analyse der bestehenden Struktur

Bestandsaufnahme aller vorhandenen Seiten, Inhalte und
Verlinkungsstrukturen, um Lücken und Prioritäten sichtbar zu machen.

-
02

02

Definition zentraler Zielseiten

Festlegung der wichtigsten Seiten nach Suchintention, Zielgruppe und
Relevanz für den Kontaktweg.

-
03

03

Überarbeitung der Seitenarchitektur

Neustrukturierung der Informationsebenen, Navigation und internen
Verlinkung für eine klare Nutzerführung.

-
04

04

Optimierung von Content und Navigation

Texte, Headings und Inhalte werden auf Suchintention und Zielgruppe
ausgerichtet. Navigation und CTA-Elemente folgen einer klaren Priorität.

-
05

05

Strukturierter Relaunch

Saubere Umsetzung aller Änderungen mit Qualitätssicherung und
abschließender Prüfung aller Zielseiten und Kontaktwege.
```

##### Section 5: Was sich durch dieses Projekt verändert

- ID: keine
- aria-labelledby: wirkung-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Erwartete Wirkung
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Erwartete Wirkung

Was sich durch dieses Projekt verändert

Die Wirkung zeigt sich in klarerer Struktur, besserer Auffindbarkeit und einem durchgängigeren Weg
von der ersten Suche bis zur Anfrage.

Nutzerführung

Bessere Orientierung

Besucher finden sich auf der Website schneller zurecht und erkennen den
relevanten nächsten Schritt.

Inhalt

Stärkere thematische Klarheit

Themen, Seiten und Inhalte sind sauber strukturiert und sprechen
Zielgruppen gezielt an.

Sichtbarkeit

Solide SEO-Grundlage

Seitenstruktur, interne Verlinkung und Headings schaffen eine belastbare
Basis für organische Sichtbarkeit.

Conversion

Klarere Nutzerwege

CTAs und Kontaktwege sind auf die wichtigsten Seiten abgestimmt und
reduzieren die Hürde zur Anfrage.
```

##### Section 6: Weitere Projektarten im Überblick

- ID: keine
- aria-labelledby: verwandte-title
- Klassen: packages-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Verwandte Projektarten
- Interne Links in dieser Section: `projekte/website-branding-setup.html` (Mehr zur Projektart), `projekte/content-tracking-system.html` (Mehr zur Projektart), `projekte/funnel-optimierung.html` (Mehr zur Projektart)
- Bilder in dieser Section: keine

```text
Verwandte Projektarten

Weitere Projektarten im Überblick

Website + Branding

Marken- und Website-Setup für ein spezialisiertes Angebot

Für Unternehmen mit gutem Angebot, aber unklarem oder uneinheitlichem
Marktauftritt.

Mehr zur Projektart

SEO + Growth

Content- und Tracking-System für planbare Optimierung

Für Unternehmen mit Marketingmaßnahmen, aber ohne klare Struktur zwischen
Themen, Zielseiten und Tracking.

Mehr zur Projektart

Growth + Website

Optimierungs-Sprint für klarere Funnel- und Kontaktwege

Für Websites mit vorhandener Nachfrage, aber Reibung in Angebot, Formular
oder CTA-Struktur.

Mehr zur Projektart
```

##### Section 7: Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section section-surface--global py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Relaunch anfragen), `projekte.html` (Alle Projektarten)
- Bilder in dieser Section: keine

```text
Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

Dann starten wir mit einem strukturierten Gespräch, klären Struktur
und Prioritäten und definieren den sinnvollsten nächsten Schritt.

Relaunch anfragen
Alle Projektarten
```

### projekte/content-tracking-system.html

- Titel: Content- und Tracking-System | Smart Web Studio
- Meta-Description: Content- und Tracking-System für planbare Optimierung: Themencluster definieren, Conversion-Events einrichten und ein strukturiertes Optimierungs-Backlog aufbauen.
- Canonical: -
- data-page: projekt-content-tracking-system
- body id: top
- Base-HREF: ../
- Stylesheets: `../src/css/style.css`, `../src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `../src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `projekt-content-tracking-system`

#### Interne Links im Hauptinhalt

- `projekte/website-branding-setup.html` -> Mehr zur Projektart
- `projekte/relaunch-seo.html` -> Mehr zur Projektart
- `projekte/funnel-optimierung.html` -> Mehr zur Projektart
- `kontakt.html#terminbuchung` -> System aufbauen
- `projekte.html` -> Alle Projektarten

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Content- und Tracking-System für planbare Optimierung

- ID: keine
- aria-labelledby: page-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: SEO + Growth
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
SEO + Growth

Content- und Tracking-System für planbare Optimierung

Diese Projektart richtet sich an Unternehmen mit Marketingmaßnahmen, bei denen jedoch keine klare
Struktur zwischen Themen, Zielseiten, Tracking und Optimierung besteht. Ziel ist ein System, das
Entscheidungen auf Datenbasis ermöglicht.

Projektschwerpunkt

Content, Zielseiten und Tracking strukturiert verbinden.

- Themencluster und Zielseiten priorisieren

- Conversion-Events klar definieren und einrichten

- Optimierungs-Backlog strukturiert aufbauen
```

##### Section 2: Für wen diese Projektart geeignet ist

- ID: keine
- aria-labelledby: fuer-wen-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Passende Ausgangslage

Für wen diese Projektart geeignet ist

Diese Projektart passt besonders, wenn Marketing-Aktivitäten vorhanden sind, aber Struktur und
Messbarkeit fehlen, um Maßnahmen gezielt zu priorisieren.

Marketing

Aktivitäten ohne klare Priorisierung

Einzelne Maßnahmen sind im Einsatz, aber es fehlt eine übergeordnete
Logik, welche davon die meiste Wirkung erzeugen.

Content

Content ohne ausreichende Datenbasis

Inhalte werden produziert, aber es gibt keine Grundlage, um deren Wirkung
zu messen und zu priorisieren.

Tracking

Fehlende oder unklare Conversion-Events

Wichtige Nutzerhandlungen wie Kontaktanfragen oder Downloads werden nicht
sauber gemessen.
```

##### Section 3: Der typische Startpunkt dieser Projektart

- ID: keine
- aria-labelledby: ausgangslage-title
- Klassen: py-16 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-focus-section section-surface--global
- Eyebrow/Label: Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ausgangslage

Der typische Startpunkt dieser Projektart

Einzelne Maßnahmen existieren, greifen jedoch nicht systematisch ineinander. Content, Zielseiten
und Tracking sind nicht strukturiert verbunden. Entscheidungen über nächste Schritte werden ohne
belastbare Grundlage getroffen.

Was umgesetzt wird

Die zentralen Maßnahmen in dieser Projektart.

- Definition von Themenclustern

- Priorisierung von Zielseiten

- Einrichtung klarer Conversion-Events

- Strukturierte Tracking-Grundlage

- Aufbau eines Optimierungs-Backlogs
```

##### Section 4: In vier Schritten zum strukturierten System

- ID: keine
- aria-labelledby: ablauf-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projektablauf
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Projektablauf

In vier Schritten zum strukturierten System

-
01

01

Bestandsaufnahme

Analyse aller vorhandenen Maßnahmen, Inhalte, Seiten und
Tracking-Setups, um den Status quo klar zu erfassen.

-
02

02

Definition der wichtigsten Seiten

Priorisierung der Zielseiten nach Themencluster, Suchintention und
Relevanz für die Conversion.

-
03

03

Konzeption der Trackingstruktur

Definition relevanter Conversion-Events, Einrichtung einer sauberen
Tracking-Grundlage und Abstimmung mit vorhandenen Tools.

-
04

04

Aufbau eines Optimierungs-Systems

Strukturiertes Backlog mit priorisierten Maßnahmen, das zukünftige
Entscheidungen auf Datenbasis ermöglicht.
```

##### Section 5: Was sich durch dieses Projekt verändert

- ID: keine
- aria-labelledby: wirkung-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Erwartete Wirkung
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Erwartete Wirkung

Was sich durch dieses Projekt verändert

Die Wirkung zeigt sich in besserer Steuerbarkeit, klareren Entscheidungsgrundlagen und einem
ruhigeren, systematischeren Vorgehen.

Entscheidungen

Klarere Entscheidungsgrundlagen

Maßnahmen werden auf Basis von Daten priorisiert statt nach Gefühl oder
Gewohnheit.

Priorisierung

Strukturierte Priorisierung

Ein klares Backlog zeigt, welche Maßnahmen die meiste Wirkung erzeugen
und in welcher Reihenfolge sie sinnvoll sind.

Optimierung

Planbare Optimierung

Tracking und Struktur ermöglichen einen kontinuierlichen,
nachvollziehbaren Optimierungsprozess.
```

##### Section 6: Weitere Projektarten im Überblick

- ID: keine
- aria-labelledby: verwandte-title
- Klassen: packages-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Verwandte Projektarten
- Interne Links in dieser Section: `projekte/website-branding-setup.html` (Mehr zur Projektart), `projekte/relaunch-seo.html` (Mehr zur Projektart), `projekte/funnel-optimierung.html` (Mehr zur Projektart)
- Bilder in dieser Section: keine

```text
Verwandte Projektarten

Weitere Projektarten im Überblick

Website + Branding

Marken- und Website-Setup für ein spezialisiertes Angebot

Für Unternehmen mit gutem Angebot, aber unklarem oder uneinheitlichem
Marktauftritt.

Mehr zur Projektart

Website + SEO

Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis

Für Websites mit vorhandenen Inhalten, aber ohne klare Seitenlogik für
Zielgruppen, Suchintention und Kontaktwege.

Mehr zur Projektart

Growth + Website

Optimierungs-Sprint für klarere Funnel- und Kontaktwege

Für Websites mit vorhandener Nachfrage, aber Reibung in Angebot, Formular
oder CTA-Struktur.

Mehr zur Projektart
```

##### Section 7: Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section section-surface--global py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (System aufbauen), `projekte.html` (Alle Projektarten)
- Bilder in dieser Section: keine

```text
Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

Dann starten wir mit einer strukturierten Bestandsaufnahme und
definieren gemeinsam die wichtigsten Hebel für planbare Optimierung.

System aufbauen
Alle Projektarten
```

### projekte/funnel-optimierung.html

- Titel: Optimierungs-Sprint für Funnel- und Kontaktwege | Smart Web Studio
- Meta-Description: Optimierungs-Sprint für klarere Funnel- und Kontaktwege: Reibung im Anfrageprozess reduzieren, CTA-Strukturen verbessern und Conversion-Hürden gezielt abbauen.
- Canonical: -
- data-page: projekt-funnel-optimierung
- body id: top
- Base-HREF: ../
- Stylesheets: `../src/css/style.css`, `../src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `../src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `projekt-funnel-optimierung`

#### Interne Links im Hauptinhalt

- `projekte/website-branding-setup.html` -> Mehr zur Projektart
- `projekte/relaunch-seo.html` -> Mehr zur Projektart
- `projekte/content-tracking-system.html` -> Mehr zur Projektart
- `kontakt.html#terminbuchung` -> Optimierung starten
- `projekte.html` -> Alle Projektarten

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Optimierungs-Sprint für klarere Funnel- und Kontaktwege

- ID: keine
- aria-labelledby: page-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Growth + Website
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Growth + Website

Optimierungs-Sprint für klarere Funnel- und Kontaktwege

Diese Projektart richtet sich an Websites mit vorhandener Nachfrage, bei denen jedoch Reibung in
Angebot, Formular oder CTA-Struktur die Conversion reduziert. Ziel ist ein klarerer, direkterer
Weg von erstem Interesse zur qualifizierten Anfrage.

Projektschwerpunkt

Reibung abbauen, Kontaktwege vereinfachen.

- Bestehenden Funnel analysieren und Reibungspunkte benennen

- CTA-Strukturen und Kontaktwege optimieren

- Wichtigste Verbesserungen priorisieren und umsetzen
```

##### Section 2: Für wen diese Projektart geeignet ist

- ID: keine
- aria-labelledby: fuer-wen-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Passende Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Passende Ausgangslage

Für wen diese Projektart geeignet ist

Diese Projektart passt besonders, wenn Traffic und Interesse vorhanden sind, aber der Weg zur
Anfrage zu viel Reibung erzeugt.

Traffic

Besucher, aber wenig Anfragen

Die Website erhält Besucher, diese nehmen jedoch den Weg zur Anfrage nicht
konsequent auf.

Kontakt

Komplexe oder unklare Kontaktwege

Formulare, Schritte oder Hürden im Kontaktprozess erzeugen unnötige
Reibung und Abbrüche.

CTA

Unklare Handlungsaufforderungen

CTAs fehlen, sind zu schwach platziert oder führen nicht zum richtigen
nächsten Schritt.
```

##### Section 3: Der typische Startpunkt dieser Projektart

- ID: keine
- aria-labelledby: ausgangslage-title
- Klassen: py-16 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-focus-section section-surface--global
- Eyebrow/Label: Ausgangslage
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ausgangslage

Der typische Startpunkt dieser Projektart

Interesse ist vorhanden, jedoch ist der Weg zur Anfrage nicht klar strukturiert. Besucher verlassen
die Website, ohne eine Handlung ausgeführt zu haben, obwohl Bedarf besteht. Die Ursache liegt
häufig in unklaren CTAs, komplexen Formularen oder fehlender Priorisierung der Conversion-Wege.

Was umgesetzt wird

Die zentralen Maßnahmen in dieser Projektart.

- Analyse des bestehenden Funnels

- Reduktion von Kontakt-Hürden

- Optimierung von CTA-Strukturen

- Priorisierung der wichtigsten Verbesserungsmaßnahmen
```

##### Section 4: In vier Schritten zu klareren Nutzerwegen

- ID: keine
- aria-labelledby: ablauf-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Projektablauf
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Projektablauf

In vier Schritten zu klareren Nutzerwegen

-
01

01

Analyse der Nutzerwege

Systematische Betrachtung aller relevanten Pfade von der ersten Seite bis
zur Anfrage, um Reibungspunkte sichtbar zu machen.

-
02

02

Identifikation von Reibungspunkten

Konkrete Benennung von Stellen, an denen Besucher abbrechen oder nicht
den erwarteten nächsten Schritt nehmen.

-
03

03

Priorisierung von Optimierungshebeln

Bewertung der identifizierten Maßnahmen nach Aufwand und erwarteter
Wirkung für eine klare Umsetzungsreihenfolge.

-
04

04

Umsetzung der wichtigsten Verbesserungen

Gezielte Umsetzung der priorisierten Maßnahmen mit Fokus auf maximale
Wirkung im Verhältnis zum Aufwand.
```

##### Section 5: Was sich durch dieses Projekt verändert

- ID: keine
- aria-labelledby: wirkung-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Erwartete Wirkung
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Erwartete Wirkung

Was sich durch dieses Projekt verändert

Die Wirkung zeigt sich in einem direkteren Weg von Interesse zur Anfrage und weniger unnötiger
Reibung entlang der wichtigsten Kontaktwege.

Nutzerführung

Klarere Nutzerwege

Besucher finden den Weg zur Anfrage direkter und ohne unnötige
Zwischenschritte.

Anfrageprozess

Weniger Reibung im Anfrageprozess

Formulare, CTAs und Kontaktwege sind vereinfacht und reduzieren die Hürde
zur ersten Kontaktaufnahme.

Conversion

Höhere Conversion-Wahrscheinlichkeit

Durch geringere Reibung steigt die Wahrscheinlichkeit, dass vorhandenes
Interesse in eine qualifizierte Anfrage umgewandelt wird.
```

##### Section 6: Weitere Projektarten im Überblick

- ID: keine
- aria-labelledby: verwandte-title
- Klassen: packages-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Verwandte Projektarten
- Interne Links in dieser Section: `projekte/website-branding-setup.html` (Mehr zur Projektart), `projekte/relaunch-seo.html` (Mehr zur Projektart), `projekte/content-tracking-system.html` (Mehr zur Projektart)
- Bilder in dieser Section: keine

```text
Verwandte Projektarten

Weitere Projektarten im Überblick

Website + Branding

Marken- und Website-Setup für ein spezialisiertes Angebot

Für Unternehmen mit gutem Angebot, aber unklarem oder uneinheitlichem
Marktauftritt.

Mehr zur Projektart

Website + SEO

Relaunch mit stärkerer Conversion- und Sichtbarkeitsbasis

Für Websites mit vorhandenen Inhalten, aber ohne klare Seitenlogik für
Zielgruppen, Suchintention und Kontaktwege.

Mehr zur Projektart

SEO + Growth

Content- und Tracking-System für planbare Optimierung

Für Unternehmen mit Marketingmaßnahmen, aber ohne klare Struktur zwischen
Themen, Zielseiten und Tracking.

Mehr zur Projektart
```

##### Section 7: Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section section-surface--global py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Optimierung starten), `projekte.html` (Alle Projektarten)
- Bilder in dieser Section: keine

```text
Wenn dieses Projektformat zur aktuellen Ausgangslage passt.

Dann starten wir mit einer strukturierten Analyse der wichtigsten
Reibungspunkte und definieren die wirksamsten nächsten Schritte.

Optimierung starten
Alle Projektarten
```

### case-study.html

- Titel: Case Study | Smart Web Studio
- Meta-Description: Anonymisierte Case Study von Smart Web Studio mit Ausgangslage, Ziel, Umsetzung und qualitativen Ergebnissen statt erfundener KPI-Werte.
- Canonical: -
- data-page: case-study
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `case-study`

#### Interne Links im Hauptinhalt

- `leistungen.html` -> Leistungen ansehen
- `ablauf.html` -> Ablauf ansehen
- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Beispielhafte Projektstruktur statt erfundener Referenz.

- ID: keine
- aria-labelledby: case-study-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Case Study
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Case Study

Beispielhafte Projektstruktur statt erfundener Referenz.

Diese Case Study zeigt transparent, wie ein Projekt strategisch aufgebaut und in Wirkung übersetzt wird,
ohne reale Kundendaten oder künstlich erzeugte Zahlen zu veröffentlichen.

Transparenz-Modell

Realistische Struktur, anonymisierte Projektdaten.

- kein Kundename

- keine frei erfundenen KPI-Deltas

- echte Denkweise hinter Positionierung, Website und Conversion
```

##### Section 2: Ausgangslage

- ID: keine
- aria-labelledby: keine
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: 01
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
-
01

01

Ausgangslage

Die Marke wirkt unklar, das Angebot wird zu breit kommuniziert und die
bestehende Website priorisiert weder Nutzerführung noch Kontaktweg sauber genug.

-
02

02

Ziel

Ein klarer Premium-Auftritt soll Angebot, Positionierung und CTA-Logik so
ordnen, dass aus Interesse belastbare Projektanfragen werden.

-
03

03

Umsetzung

Messaging schärfen, Seitenarchitektur neu setzen, Leistungen trennen,
Kontaktpfade priorisieren und Gestaltung/Technik auf dieselbe Logik ausrichten.

-
04

04

Ergebnis

Eine Website, die professioneller wirkt, klarer führt und ein sauberes System
für Anfrage, Weiterentwicklung und qualitative Optimierung bildet.
```

##### Section 3: Die Wirkung zeigt sich hier in Klarheit, Führung und Wahrnehmung.

- ID: keine
- aria-labelledby: case-result-title
- Klassen: about-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Qualitative Ergebnisse
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Qualitative Ergebnisse

Die Wirkung zeigt sich hier in Klarheit, Führung und Wahrnehmung.

Auch ohne veröffentlichbare Zahlen lässt sich sichtbar machen, was sich durch ein gutes System im
digitalen Auftritt verbessert.

Auftritt

Klarere Positionierung im Markt

Der Nutzen wird schneller verständlich, die Marke wirkt fokussierter und das
Angebot präziser.

Website

Bessere Struktur und Nutzerführung

Inhalte, Leistungen und Kontaktwege folgen einer nachvollziehbaren Priorität
statt einer beliebigen Seitenfolge.

Prozess

Mehr Steuerbarkeit nach dem Launch

Tracking, CTA-Logik und das Fundament für weitere Optimierungen stehen von
Anfang an sauber.
```

##### Section 4: Vom Projektbeweis direkt in Leistung, Ablauf oder Erstgespräch.

- ID: keine
- aria-labelledby: case-links-title
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Weiterführende Wege
- Interne Links in dieser Section: `leistungen.html` (Leistungen ansehen), `ablauf.html` (Ablauf ansehen), `kontakt.html#terminbuchung` (Erstgespräch buchen)
- Bilder in dieser Section: keine

```text
Weiterführende Wege

Vom Projektbeweis direkt in Leistung, Ablauf oder Erstgespräch.

Leistung

Leistungen im Detail ansehen

Wenn du zuerst verstehen willst, welcher Hebel in deinem Projekt an erster
Stelle stehen sollte.

Leistungen ansehen

Prozess

Ablauf im Detail prüfen

Wenn du sehen willst, wie Analyse, Positionierung und Umsetzung aufeinander
aufbauen.

Ablauf ansehen

Kontakt

Ausgangslage direkt besprechen

Wenn du denselben Klarheitsgewinn für dein Projekt priorisieren möchtest.

Erstgespräch buchen
```

##### Section 5: Wenn du dieselbe Klarheit in deinem Projekt sehen willst.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn du dieselbe Klarheit in deinem Projekt sehen willst.

Dann starten wir mit einem strukturierten Erstgespräch oder einem
Mini-Audit und priorisieren die richtigen Hebel ohne Umwege.

Erstgespräch buchen
Mini-Audit anfordern
```

### ablauf.html

- Titel: Ablauf | Smart Web Studio
- Meta-Description: Projektablauf von Smart Web Studio: Analyse, Positionierung, Design, Entwicklung, Launch und Optimierung für hochwertige Agentur-Websites.
- Canonical: -
- data-page: ablauf
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `ablauf`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen
- `projekte.html` -> Projekt ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Ein klar geführter Prozess schafft Vertrauen, Tempo und bessere Entscheidungen.

- ID: keine
- aria-labelledby: process-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Ablauf
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Ablauf

Ein klar geführter Prozess schafft Vertrauen, Tempo und bessere Entscheidungen.

Jedes Projekt folgt derselben Logik: erst Klarheit über Ausgangslage und Ziel, dann Struktur, Umsetzung
und ein kontrollierter Launch ohne Black Box.

Was der Ablauf absichert

Weniger Unsicherheit, mehr Orientierung im Projekt.

- saubere Priorisierung vor Design und Umsetzung

- klare Deliverables pro Phase

- sichtbare Entscheidungen statt Agentur-Nebel

- Launch mit Struktur, Tracking und Übergabe
```

##### Section 2: Von der Analyse bis zur Optimierung mit sauberer Reihenfolge.

- ID: keine
- aria-labelledby: keine
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Sechs Schritte
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Sechs Schritte

Von der Analyse bis zur Optimierung mit sauberer Reihenfolge.

-
01

01

Analyse

Zielgruppe, Markt, Angebot und bestehendes Setup werden strukturiert
bewertet.

-
02

02

Positionierung

Wertversprechen, Differenzierung und Angebotslogik werden geschärft.

-
03

03

Architektur

Seitenstruktur, Nutzerwege, Inhalte und CTA-Hierarchie werden definiert.

-
04

04

Design & Entwicklung

Das visuelle System wird technisch sauber, performant und responsiv
umgesetzt.

-
05

05

Launch

QA, Tracking, Kontaktwege und Übergabe werden finalisiert, bevor live
geschaltet wird.

-
06

06

Optimierung

Daten, Feedback und weitere Hebel werden priorisiert, statt erst nach
Monaten zufällig betrachtet zu werden.
```

##### Section 3: Was der Ablauf für die Zusammenarbeit spürbar besser macht.

- ID: keine
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Vertrauensbausteine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Vertrauensbausteine

Was der Ablauf für die Zusammenarbeit spürbar besser macht.

Klarere Entscheidungen

- weniger Bauchgefühl

- mehr nachvollziehbare Prioritäten

- saubere Scope-Abgrenzung

Mehr Transparenz

- klare Phasen und Deliverables

- saubere Kommunikation statt Pingpong

- direkter Überblick über nächste Schritte

Besserer Launch

- nicht nur live, sondern einsatzbereit

- Kontaktwege und Tracking sind vorbereitet

- Grundlage für Optimierung steht von Anfang an
```

##### Section 4: Wenn du einen klaren Projektprozess willst.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `projekte.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Wenn du einen klaren Projektprozess willst.

Dann starten wir mit dem ersten Schritt: einer strukturierten
Einordnung deiner Ausgangslage und Ziele.

Erstgespräch buchen
Projekt ansehen
```

### preise.html

- Titel: Preise | Smart Web Studio
- Meta-Description: Preise und Pakete von Smart Web Studio für Starter, Professional und Growth inklusive klarer Scope-Orientierung und Gesprächseinstieg.
- Canonical: -
- data-page: preise
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `preise`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Projekt
besprechen (x2)
- `kontakt.html#terminbuchung` -> Projekt besprechen
- `kontakt.html#terminbuchung` -> Erstgespräch buchen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x2)
- `projekte.html` -> Projekt ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Drei Pakete für unterschiedliche Reifegrade, aber mit derselben Qualitätslogik.

- ID: keine
- aria-labelledby: pricing-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Preise
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Preise

Drei Pakete für unterschiedliche Reifegrade, aber mit derselben Qualitätslogik.

Die Preisrahmen helfen bei der Orientierung. Das finale Setup richtet sich nach Ausgangslage, Umfang und der
Reihenfolge der sinnvollsten Hebel.
```

##### Section 2: Preispakete

- ID: keine
- aria-labelledby: pricing-grid-title
- Klassen: packages-section pricing-packages-section py-0 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Starter
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Projekt
besprechen), `kontakt.html#terminbuchung` (Projekt besprechen), `kontakt.html#terminbuchung` (Projekt
besprechen)
- Bilder in dieser Section: keine

```text
Preispakete

Starter

Für einen klaren, professionellen Start mit fokussiertem Umfang.

- kleines Website- oder Relaunch-Projekt

- saubere Struktur und klare CTA-Basis

- ideal für kompakte Unternehmensauftritte

ab EUR 3.900 Richtwert

Projekt
besprechen

Empfohlen

Professional

Für Unternehmen, die Marke, Website und Conversion sauber aufstellen wollen.

- Positionierung, Messaging und Website-Struktur

- mehrere Seiten mit klarer Nutzerführung

- ideal für hochwertige Lead- und Vertriebsauftritte

ab EUR 8.900 Richtwert

Projekt besprechen

Growth

Für Unternehmen mit Nachfrage-Aufbau, Optimierung und größerem
Entwicklungsspielraum.

- stärkeres Setup für Funnel, Sichtbarkeit und Tracking

- mehr Komplexität, mehr Priorisierung, mehr System

- ideal für skalierbare Auftritte mit Optimierungsrhythmus

ab EUR 18.000 Richtwert

Projekt
besprechen

Preise sind Richtwerte. Umfang, Prioritäten und
Projekttiefe definieren das finale Angebot.
```

##### Section 3: Unsicher, welches Paket wirklich passt?

- ID: keine
- aria-labelledby: pricing-guide-title
- Klassen: about-section about-section--next-steps py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Orientierung
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `projekte.html` (Projekt ansehen)
- Bilder in dieser Section: keine

```text
Orientierung

Unsicher, welches Paket wirklich passt?

Das ist normal. Oft ist nicht der größere Umfang richtig, sondern die klarere Reihenfolge. Im Gespräch
sortieren wir, welcher Hebel zuerst Sinn ergibt.

Wenn du Klarheit brauchst

Erstgespräch

Wir ordnen Ausgangslage, Prioritäten, Budgetrahmen und passenden
Leistungsstart.

Wenn du schon Material hast

Mini-Audit

Ideal, wenn Website, Positionierung oder Sichtbarkeit schon da sind und
zuerst sortiert werden sollen.

Wenn du erst Proof sehen willst

Projekte & Case Study

Dort siehst du, wie Scope, Maßnahmen und qualitative Wirkung im Projekt
strukturiert werden.

Erstgespräch buchen

Mini-Audit anfordern

Projekt ansehen
```

##### Section 4: Wenn du den passenden Scope sauber einordnen willst.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn du den passenden Scope sauber einordnen willst.

Dann sprechen wir über Zielbild, Prioritäten und den sinnvollsten Start
statt direkt über die größte Lösung.

Erstgespräch buchen
Mini-Audit anfordern
```

### ueber-mich.html

- Titel: Über mich | Smart Web Studio
- Meta-Description: Über Smart Web Studio: direkte Zusammenarbeit, klare Projektführung, hoher Qualitätsanspruch und ein bewusst fokussierter Ansatz für Marken, Websites und Wachstum.
- Canonical: -
- data-page: ueber-mich
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `ueber-mich`

#### Interne Links im Hauptinhalt

- `kontakt.html#terminbuchung` -> Erstgespräch buchen
- `leistungen.html` -> Leistungen ansehen

#### Bilder im Hauptinhalt

- `assets/uebermich-720.webp` (alt: Portrait des Gründers von Smart Web Studio)

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Du arbeitest direkt mit mir.

- ID: keine
- aria-labelledby: about-me-title
- Klassen: about-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Über mich
- Interne Links in dieser Section: keine
- Bilder in dieser Section: `assets/uebermich-720.webp` (Portrait des Gründers von Smart Web Studio)

```text
Über mich

Du arbeitest direkt mit mir.

Keine Agentur-Weitergabe, keine Zwischenebenen, kein unnötiges Projekt-Pingpong. Strategie, Struktur und
Umsetzung bleiben in einer Hand, damit Entscheidungen klarer und Wege kürzer werden.

Direkter Ansprechpartner
Klare Deliverables
Fokus auf passende Projekte
```

##### Section 2: Worauf ich in Projekten bewusst Wert
lege.

- ID: keine
- aria-labelledby: principles-title
- Klassen: approach-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Arbeitsprinzipien
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Arbeitsprinzipien

Worauf ich in Projekten bewusst Wert
lege.

01

KLARHEIT

Strategie vor Show

Ich denke Projekte zuerst in Zielgruppe, Angebot und Conversion, bevor
Gestaltung überhaupt eine Rolle spielt.

02

FOKUS

Weniger Schleifen, mehr Richtung

Entscheidungen bleiben schnell, weil Konzept, Design und Technik nicht über
mehrere Stellen verteilt sind.

03

QUALITÄT

Marke, Website und Nachfrage greifen ineinander

Ich betrachte den digitalen Auftritt als Gesamtsystem statt als Sammlung
einzelner Maßnahmen.
```

##### Section 3: Warum Smart Web Studio bewusst anders arbeitet als klassische Agentur-Setups.

- ID: keine
- aria-labelledby: work-style-title
- Klassen: packages-section section-surface--global py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Zusammenarbeit
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Zusammenarbeit

Warum Smart Web Studio bewusst anders arbeitet als klassische Agentur-Setups.

Kommunikation

Direkt statt weitergereicht

Die Person, die mit dir über Strategie spricht, denkt auch die Umsetzung und
bewertet später die Wirkung.

Prozess

Strukturiert statt improvisiert

Klare Deliverables, nachvollziehbare Phasen und ein transparenter Projektweg
reduzieren Reibung für beide Seiten.

Fit

Lieber passend als beliebig

Ich fokussiere auf Projekte, bei denen Klarheit, Qualität und strategische
Umsetzung wirklich relevant sind.
```

##### Section 4: Hochwertig heißt für mich: schön, nachvollziehbar und wirksam.

- ID: keine
- aria-labelledby: quality-title
- Klassen: about-section section-surface--about-default py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Qualitätsanspruch
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Qualitätsanspruch

Hochwertig heißt für mich: schön, nachvollziehbar und wirksam.

Design ohne Klarheit bringt wenig. Strategie ohne saubere Umsetzung ebenso. Deshalb arbeite ich bewusst an
der Schnittstelle aus Positionierung, Website und Conversion.

Klare Prioritäten

Nicht alles gleichzeitig, sondern der nächste Hebel mit der stärksten
Wirkung.

Saubere Umsetzung

Responsiveness, Performance, Semantik und Hierarchie werden nicht nachträglich
ergänzt, sondern von Anfang an mitgedacht.

Strukturierte Zusammenarbeit

Klare Deadlines, nachvollziehbare Entscheidungen und ein ruhiger Prozess statt
hektischer Ad-hoc-Schleifen.
```

##### Section 5: Wenn du direkte Zusammenarbeit und klare Entscheidungen
willst.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section section-surface--global py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `leistungen.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Wenn du direkte Zusammenarbeit und klare Entscheidungen
willst.

Dann starten wir mit einem strukturierten Erstgespräch und schauen, welche
Kombination aus Marke, Website und Nachfrage für dein Projekt passt.

Erstgespräch buchen
Leistungen ansehen
```

### insights.html

- Titel: Insights | Smart Web Studio
- Meta-Description: Insights von Smart Web Studio mit klaren Themenclustern zu Website, Branding sowie SEO und Marketing inklusive direkter Verknüpfung zu Leistungen, Projekten und Mini-Audit.
- Canonical: -
- data-page: insights
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `insights`

#### Interne Links im Hauptinhalt

- `webentwicklung.html` -> Leistungen
ansehen (x2)
- `case-study.html` -> Projekt ansehen
- `branding.html` -> Leistungen
ansehen (x2)
- `kontakt.html#kontaktformular` -> Mini-Audit anfordern (x3)
- `seo-marketing.html` -> Leistungen
ansehen (x2)
- `kontakt.html#terminbuchung` -> Erstgespräch buchen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- Gruppe `insights`: Werte `all`, `website`, `branding`, `seo` | Kategorien in Items: `website`, `seo`, `branding`

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Ein Themenbereich für hochwertige
Websites, starke Marken und klarere Nachfrage.

- ID: keine
- aria-labelledby: insights-title
- Klassen: about-section section-surface--global insights-intro-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Insights
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Insights

Ein Themenbereich für hochwertige
Websites, starke Marken und klarere Nachfrage.

Keine generischen Blog-Container, sondern ein fokussierter Expertenbereich. Die Inhalte zeigen, welche
Fragen in Projekten wirklich über Klarheit, Vertrauen und Conversion entscheiden.

Website
Branding
SEO / Marketing

Wie dieser Bereich gedacht ist

Jedes Thema führt direkt weiter in Leistung, Projekt oder Audit.

- Themencluster statt austauschbarer Blogoptik

- relevante Fragestellungen mit direkter Projektübersetzung

- klare nächste Schritte ohne Sackgassen
```

##### Section 2: Die häufigsten Hebel, an denen
hochwertige Projekte gewinnen oder scheitern.

- ID: keine
- aria-labelledby: cluster-title
- Klassen: insight-cluster-section section-surface--global insight-cluster-section--merged py-16 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Themencluster
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen
ansehen), `case-study.html` (Projekt ansehen), `branding.html` (Leistungen
ansehen), `kontakt.html#kontaktformular` (Mini-Audit anfordern), `seo-marketing.html` (Leistungen
ansehen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Themencluster

Die häufigsten Hebel, an denen
hochwertige Projekte gewinnen oder scheitern.

Alle
Website
Branding
SEO / Marketing

Website

Warum gut aussehende Websites trotzdem keine Anfragen auslösen

Wenn Nutzen, Hierarchie und CTA-Struktur nicht sauber geführt werden, verliert selbst
ein hochwertiger Auftritt an Wirkung.

Conversion
Nutzerführung

Leistungen
ansehen

Website / SEO

Seitenarchitektur vor Content-Masse

Bevor Sichtbarkeit skaliert, müssen Zielseiten, interne Wege und Suchintention sauber
zusammenarbeiten.

Struktur
Zielseiten

Projekt ansehen

Branding

Austauschbarer Auftritt trotz solidem Design

Wenn Positionierung und Markenbotschaft nicht scharf genug sind, bleibt das Design
dekorativ statt differenzierend.

Positionierung
Botschaft

Leistungen
ansehen

Branding / SEO

Positionierung vor Content-Produktion klären

Wer nicht präzise weiß, für wen er relevant ist, produziert schnell Sichtbarkeit ohne
klare Nachfragequalität.

Relevanz
Angebotsschärfung

Mini-Audit anfordern

SEO / Marketing

SEO funktioniert erst mit klaren Conversion-Zielen

Sichtbarkeit ist nur dann wertvoll, wenn Zielseiten, Botschaften und nächste Schritte
für die richtige Anfragequalität vorbereitet sind.

Sichtbarkeit
Messbarkeit

Leistungen
ansehen

SEO / Marketing

Besser priorisieren statt überall gleichzeitig optimieren

Mini-Audit und saubere Priorisierung vermeiden Aktionismus und zeigen, welcher Hebel
jetzt wirklich Wirkung bringt.

Priorisierung
Audit

Mini-Audit anfordern
```

##### Section 3: Von Insight zu passender Leistung
ohne Umweg.

- ID: keine
- aria-labelledby: transfer-title
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Direkter Transfer
- Interne Links in dieser Section: `webentwicklung.html` (Leistungen
ansehen), `branding.html` (Leistungen
ansehen), `seo-marketing.html` (Leistungen
ansehen)
- Bilder in dieser Section: keine

```text
Direkter Transfer

Von Insight zu passender Leistung
ohne Umweg.

Website

Struktur, UX und Conversion

Wenn Inhalte zwar da sind, die Website aber zu wenig führt oder zu wenig
Vertrauen aufbaut.

Leistungen
ansehen

Branding

Positionierung und Auftritt schärfen

Wenn das Angebot zu wenig eigenständig wirkt oder die Botschaft noch nicht
klar genug trägt.

Leistungen
ansehen

SEO / Marketing

Sichtbarkeit mit Struktur aufbauen

Wenn Nachfrage nicht nur erzeugt, sondern sauber in qualifizierte Anfragen
übersetzt werden soll.

Leistungen
ansehen
```

##### Section 4: Wenn du ein Thema direkt auf dein Projekt übertragen
willst.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `kontakt.html#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Wenn du ein Thema direkt auf dein Projekt übertragen
willst.

Dann starten wir mit einem strukturierten Erstgespräch oder einem Mini-Audit und priorisieren die nächste
wirklich sinnvolle Maßnahme.

Erstgespräch buchen
Mini-Audit anfordern
```

### kontakt.html

- Titel: Kontakt | Smart Web Studio
- Meta-Description: Kontaktseite von Smart Web Studio mit zwei klaren Einstiegen: Erstgespräch buchen oder Projektformular für einen strukturierten Projektstart.
- Canonical: -
- data-page: kontakt
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `kontakt`
- `data-contact-success-path` = `danke.html`
- `data-mobile-sticky-cta` = `false`

#### Interne Links im Hauptinhalt

- `#kontaktformular` -> Erstgespräch buchen
- `#kontaktformular` -> Mini-Audit anfordern

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- Formular 1: Methode `POST`, Action `/api/contact`, Success-HREF `danke.html`, aria-describedby `contact-form-note`
- Feld `company`: Typ `text`, Label `Unternehmen`, Pflicht nein (Honeypot)
- Feld `name`: Typ `text`, Label `Name (optional)`, Pflicht nein
- Feld `email`: Typ `email`, Label `E-Mail (Pflichtfeld)`, Pflicht ja
- Feld `projectType`: Typ `select`, Label `Projektart (optional)`, Pflicht nein
- Optionen fuer `projectType`: `Bitte wählen`, `Erstgespräch`, `Mini-Audit`, `Webentwicklung`, `Branding`, `SEO & Marketing`, `Social Strategie`, `Growth Strategie`, `KI Beratung`
- Feld `budget`: Typ `select`, Label `Budget (optional)`, Pflicht nein
- Optionen fuer `budget`: `Bitte wählen`, `Unter 5.000 EUR [Unter 5.000 EUR]`, `5.000 - 10.000 EUR [5.000 - 10.000 EUR]`, `10.000 - 20.000 EUR [10.000 - 20.000 EUR]`, `20.000 EUR und mehr [20.000 EUR und mehr]`
- Feld `timeline`: Typ `select`, Label `Zeitplan (optional)`, Pflicht nein
- Optionen fuer `timeline`: `Bitte wählen`, `Sofort [Sofort]`, `Innerhalb von 2-4 Wochen [Innerhalb von 2-4 Wochen]`, `Innerhalb von 1-3 Monaten [Innerhalb von 1-3 Monaten]`, `Noch offen [Noch offen]`
- Feld `website`: Typ `url`, Label `Bestehende Website (optional)`, Pflicht nein, Placeholder `https://deine-website.de`
- Feld `message`: Typ `textarea`, Label `Ausgangslage / Nachricht (optional)`, Pflicht nein, Placeholder `Worum geht es, welche Herausforderung ist gerade am dringendsten und was soll sich durch das Projekt verändern?`

#### Top-Level-Sections im `<main>`

##### Section 1: Zwei klare Wege in den Projektstart.

- ID: keine
- aria-labelledby: contact-hero-title
- Klassen: py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Kontakt
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Kontakt

Zwei klare Wege in den Projektstart.

Du kannst direkt ein Erstgespräch buchen oder dein Projekt schriftlich skizzieren. Beide Wege landen in
einer strukturierten Einordnung statt in einem allgemeinen Kontaktpostfach.

Was bei einer guten Anfrage hilft

- Projektart oder Ausgangslage

- welcher Hebel zuerst gelöst werden soll

- grober Zeitrahmen und vorhandene Grundlagen
```

##### Section 2: Erstgespräch oder Projektformular. Klar statt kompliziert.

- ID: terminbuchung
- aria-labelledby: keine
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Einstiege
- Interne Links in dieser Section: `#kontaktformular` (Erstgespräch buchen), `#kontaktformular` (Mini-Audit anfordern)
- Bilder in dieser Section: keine

```text
Einstiege

Erstgespräch oder Projektformular. Klar statt kompliziert.

Wähle den Einstieg, der zu deiner Situation passt. Der Terminweg ist direkter, das Formular eignet sich für
detailliertere Vorabinformationen.

Erstgespräch buchen

Wenn du Prioritäten, Scope und sinnvolle Reihenfolge direkt klären willst.

- ideal für neue Projekte oder Relaunches

- fokussiert auf Zielbild, Hebel und nächsten Schritt

- prefillt das Formular für eine schnelle Einordnung

Erstgespräch buchen

Projektformular / Mini-Audit

Wenn du dein Projekt lieber zuerst strukturiert beschreiben willst.

- geeignet für konkrete Ausgangslagen oder bestehende Websites

- hilft bei klarerer Vorqualifizierung

- kann als Mini-Audit-Anfrage vorbereitet werden

Mini-Audit anfordern
```

##### Section 3: Projektanfrage senden

- ID: kontaktformular
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Zusammenarbeit
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Projektanfrage senden

Das Formular führt im aktuellen Testfluss auf die Danke-Seite. Inhaltlich ist es bereits auf einen echten
CRM- oder Formular-Endpunkt vorbereitet.

Anfrageformular

E-Mail ist verpflichtend. Projektart, Zeitrahmen und kurze Ausgangslage helfen bei der
schnelleren Einordnung.

Unternehmen

Persönliche Daten

Die Basis für Rückmeldung und Einordnung.

Name (optional)

E-Mail (Pflichtfeld)

Projektdetails

Welche Ausgangslage, welcher Zeithorizont und welcher Hebel
zuerst relevant sind.

Projektart (optional)

Bitte wählen
Erstgespräch
Mini-Audit
Webentwicklung
Branding
SEO & Marketing
Social Strategie
Growth Strategie
KI Beratung

Budget (optional)

Bitte wählen
Unter 5.000 EUR
5.000 - 10.000 EUR
10.000 - 20.000 EUR
20.000 EUR und mehr

Zeitplan (optional)

Bitte wählen
Sofort
Innerhalb von 2-4 Wochen
Innerhalb von 1-3 Monaten
Noch offen

Bestehende Website (optional)

Ausgangslage / Nachricht (optional)

Anfrage senden

Bitte fuelle mindestens Name und E-Mail aus.

Vielen Dank, die Anfrage ist eingegangen.

Zusammenarbeit

Direkt, strukturiert und realistisch

Du arbeitest direkt mit mir. Keine Weitergabe an Zwischenstationen, keine
lose Agentur-Kommunikation.

Ablauf

Antwort in sinnvoller Zeit

Wenn die Anfrage zum Fokus passt, erhältst du in der Regel innerhalb von
zwei Werktagen eine Rückmeldung mit dem nächsten sinnvollen Schritt.

Fit

Fokus auf passende Projekte

Am stärksten wirke ich in Projekten, bei denen Klarheit, Qualität,
Positionierung und Conversion eine echte Priorität haben.

Direkter Ansprechpartner
Strukturierter Prozess
Realistischer Scope
```

### danke.html

- Titel: Danke | Smart Web Studio
- Meta-Description: Bestätigung nach deiner Anfrage bei Smart Web Studio mit klaren nächsten Schritten, weiterer Orientierung und direkten Wegen zurück in Leistungen, Projekte und Erstgespräch.
- Canonical: -
- data-page: danke
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `danke`
- `data-mobile-sticky-cta` = `false`

#### Interne Links im Hauptinhalt

- `leistungen.html` -> Leistungen
ansehen
- `projekte.html` -> Projekt ansehen
- `insights.html` -> Insights ansehen
- `kontakt.html#terminbuchung` -> Erstgespräch buchen
- `leistungen.html` -> Leistungen ansehen

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Deine Anfrage ist angekommen.

- ID: keine
- aria-labelledby: thanks-title
- Klassen: about-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Bestätigung
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Bestätigung

Deine Anfrage ist angekommen.

Danke für dein Interesse an Smart Web Studio. Wenn deine Anfrage zum Fokus passt, erhältst du in der
Regel innerhalb von zwei Werktagen eine Rückmeldung mit dem nächsten sinnvollen Schritt.

Direkter Ansprechpartner
Strukturierte Einordnung
Kein anonymes Postfach

Was jetzt passiert

Der nächste Schritt bleibt klar und nachvollziehbar.

- Anfrage wird auf Projektfit, Ziel und Priorität geprüft

- du erhältst eine konkrete Rückmeldung statt einer Standardantwort

- bei Bedarf starten wir direkt mit Erstgespräch oder Mini-Audit
```

##### Section 2: So geht es ab hier sinnvoll
weiter.

- ID: keine
- aria-labelledby: next-steps-title
- Klassen: process-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Nächste Schritte
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Nächste Schritte

So geht es ab hier sinnvoll
weiter.

01

SICHTUNG

Ausgangslage verstehen

Ich prüfe, ob es primär um Website, Positionierung, SEO oder einen
kombinierten Projektstart geht.

02

EINORDNUNG

Nächsten Hebel priorisieren

Statt alles parallel zu starten, wird der wirksamste nächste Schritt
zuerst sortiert.

03

RÜCKMELDUNG

Konkreter weiterer Weg

Je nach Situation geht es in ein Erstgespräch, ein Mini-Audit oder direkt
in die passende Leistungsseite zur Vorbereitung.
```

##### Section 3: Wenn du dich bis zur Rückmeldung
weiter orientieren willst.

- ID: keine
- aria-labelledby: while-waiting-title
- Klassen: packages-section py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: Währenddessen sinnvoll
- Interne Links in dieser Section: `leistungen.html` (Leistungen
ansehen), `projekte.html` (Projekt ansehen), `insights.html` (Insights ansehen)
- Bilder in dieser Section: keine

```text
Währenddessen sinnvoll

Wenn du dich bis zur Rückmeldung
weiter orientieren willst.

Leistungen

Leistungswege verstehen

Wenn du genauer einordnen willst, ob eher Webentwicklung, Branding oder
SEO/Marketing im Vordergrund steht.

Leistungen
ansehen

Proof

Projektlogik ansehen

Wenn du sehen willst, wie Ausgangslage, Umsetzung und Ergebnis auf
Projektseite strukturiert werden.

Projekt ansehen

Insights

Relevante Themenfelder prüfen

Wenn du vorab sehen willst, welche Website-, Branding- und SEO-Themen für
hochwertige Projekte besonders relevant sind.

Insights ansehen
```

##### Section 4: Wenn du parallel schon den nächsten Schritt fixieren
willst.

- ID: keine
- aria-labelledby: keine
- Klassen: final-cta-section py-32 lg:py-40 px-4 sm:px-6 lg:px-8 scroll-focus-section
- Eyebrow/Label: keine
- Interne Links in dieser Section: `kontakt.html#terminbuchung` (Erstgespräch buchen), `leistungen.html` (Leistungen ansehen)
- Bilder in dieser Section: keine

```text
Wenn du parallel schon den nächsten Schritt fixieren
willst.

Dann kannst du direkt ein Erstgespräch einplanen oder dich vorab noch einmal durch die Leistungen
orientieren.

Erstgespräch buchen
Leistungen ansehen
```

### impressum.html

- Titel: Impressum | Smart Web Studio
- Meta-Description: Impressum und Anbieterkennzeichnung von Smart Web Studio in strukturierter Form mit klaren Platzhaltern für die rechtlich notwendigen Angaben.
- Canonical: -
- data-page: impressum
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `impressum`
- `data-mobile-sticky-cta` = `false`

#### Interne Links im Hauptinhalt

- keine

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Impressum / Anbieterkennzeichnung

- ID: keine
- aria-labelledby: legal-headline
- Klassen: legal-hero reveal-on-scroll
- Eyebrow/Label: Rechtliches
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Rechtliches

Impressum / Anbieterkennzeichnung

Die folgenden Angaben sind als strukturierte Vorlage für die Anbieterkennzeichnung von Smart Web Studio
angelegt und müssen mit den finalen Unternehmensdaten befüllt werden.
```

##### Section 2: Anbieter

- ID: anbieter
- aria-labelledby: anbieter-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Anbieter

Studio
Smart Web Studio

Name
[DEIN_NAME]

Anschrift
[STRASSE, PLZ, ORT, LAND]
```

##### Section 3: Kontakt

- ID: kontakt-impressum
- aria-labelledby: kontakt-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Kontakt

E-Mail
[E-MAIL-ADRESSE]

Telefon (optional)
[TELEFONNUMMER]
```

##### Section 4: Vertretungsberechtigte Person

- ID: vertretungsberechtigte-person
- aria-labelledby: vertretung-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Vertretungsberechtigte Person

[NAME DER VERTRETUNGSBERECHTIGTEN PERSON]
```

##### Section 5: Register / UID / Unternehmensdaten

- ID: register-uid
- aria-labelledby: register-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Register / UID / Unternehmensdaten

Registergericht
[REGISTERGERICHT]

Registernummer
[REGISTERNUMMER]

Umsatzsteuer-ID / UID
[UID-NUMMER]

Unternehmensbezeichnung
[UNTERNEHMENSDATEN]
```

##### Section 6: Haftung / Links

- ID: haftung-links
- aria-labelledby: haftung-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Haftung / Links

Inhalte dieser Website wurden mit angemessener Sorgfalt erstellt. Für Richtigkeit, Vollständigkeit und
Aktualität kann dennoch keine Gewähr übernommen werden.

Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden konkreter
Rechtsverletzungen werden entsprechende Verweise geprüft und bei Bedarf entfernt.
```

### datenschutz.html

- Titel: Datenschutz | Smart Web Studio
- Meta-Description: Datenschutzerklärung von Smart Web Studio mit strukturierter Übersicht zu Verantwortlichkeit, Verarbeitungszwecken, Consent, Speicherdauer und Betroffenenrechten.
- Canonical: -
- data-page: datenschutz
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `datenschutz`
- `data-mobile-sticky-cta` = `false`

#### Interne Links im Hauptinhalt

- `#verantwortlicher` -> Verantwortlicher
- `#zwecke` -> Zwecke der Verarbeitung
- `#rechtsgrundlagen` -> Rechtsgrundlagen
- `#cookies-consent` -> Cookies & Consent
- `#empfaenger` -> Empfänger / Auftragsverarbeiter
- `#speicherdauer` -> Speicherdauer
- `#rechte` -> Betroffenenrechte
- `#drittlandtransfer` -> Drittlandtransfer
- `#kontakt-datenschutz` -> Kontakt Datenschutz
- `cookies.html` -> Zur Cookie-Seite
- `cookies.html#cookie-settings` -> Cookie-Einstellungen öffnen [oeffnet Cookie-Panel]
- `mailto:[DATENSCHUTZ@DEINE-DOMAIN.TLD]` -> [DATENSCHUTZ@DEINE-DOMAIN.TLD]

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Datenschutzerklärung

- ID: keine
- aria-labelledby: legal-headline
- Klassen: legal-hero reveal-on-scroll
- Eyebrow/Label: Rechtliches
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Rechtliches

Datenschutzerklärung

Diese Seite bündelt die datenschutzrelevanten Informationen für Smart Web Studio in einer klar gegliederten
Struktur. Die Platzhalter sind vor dem Livegang mit dem tatsächlichen Setup abzugleichen.
```

##### Section 2: Verantwortlicher

- ID: verantwortlicher
- aria-labelledby: verantwortlicher-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Verantwortlicher

Studio / Name
Smart Web Studio / [DEIN_NAME]

Adresse
[STRASSE, PLZ, ORT, LAND]

E-Mail
[E-MAIL-ADRESSE]

Telefon
[TELEFONNUMMER]
```

##### Section 3: Zwecke der Verarbeitung

- ID: zwecke
- aria-labelledby: zwecke-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Zwecke der Verarbeitung

- Bereitstellung und Betrieb dieser Website

- Bearbeitung von Kontaktanfragen und Kommunikation mit Interessenten oder Kunden

- Technische Stabilität, Sicherheit und Fehleranalyse

- Erfüllung gesetzlicher Aufbewahrungs- und Nachweispflichten

- Einwilligungsbasierte Statistik- oder Marketingmaßnahmen nur nach aktiver Zustimmung
```

##### Section 4: Rechtsgrundlagen

- ID: rechtsgrundlagen
- aria-labelledby: rechtsgrundlagen-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Rechtsgrundlagen

Die konkrete Zuordnung der Rechtsgrundlagen muss anhand des tatsächlichen Setups erfolgen, zum Beispiel
über Vertragsanbahnung oder Vertragserfüllung, berechtigtes Interesse, Einwilligung oder gesetzliche
Pflichten.

Hinweis: Diese Struktur dient als Vorlage und stellt keine Rechtsberatung dar.
```

##### Section 5: Cookies & Consent

- ID: cookies-consent
- aria-labelledby: cookies-consent-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: `cookies.html` (Zur Cookie-Seite), `cookies.html#cookie-settings` (Cookie-Einstellungen öffnen)
- Bilder in dieser Section: keine

```text
Cookies & Consent

Für nicht notwendige Cookies nutzt diese Website ein clientseitiges Consent-Interface. Deine Auswahl wird
lokal im Browser gespeichert und kann jederzeit erneut geöffnet und geändert werden.

- Notwendige Cookies: technisch erforderlich für Betrieb, Sicherheit und Speicherung der Consent-Auswahl

- Statistik Cookies: optional und erst nach aktiver Zustimmung geladen

- Marketing Cookies: optional und erst nach aktiver Zustimmung geladen

Konkrete Anbieter- und Tool-Bezeichnungen müssen auf dieser Seite ergänzt werden, sobald entsprechende
Dienste produktiv eingesetzt werden.

Zur Cookie-Seite

Cookie-Einstellungen öffnen
```

##### Section 6: Empfänger / Auftragsverarbeiter

- ID: empfaenger
- aria-labelledby: empfaenger-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Empfänger / Auftragsverarbeiter

- Hosting: [PROVIDER, SITZ/LAND]

- E-Mail-Dienst: [PROVIDER, SITZ/LAND]

- Formular- oder CRM-Dienst: [PROVIDER, SITZ/LAND]

- [OPTIONAL: Consent-gesteuerte Analytics- oder Marketing-Dienste, falls aktiv]
```

##### Section 7: Speicherdauer

- ID: speicherdauer
- aria-labelledby: speicherdauer-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Speicherdauer

Personenbezogene Daten werden grundsätzlich nur so lange gespeichert, wie es für den jeweiligen Zweck
erforderlich ist.

Darüber hinaus gelten gesetzliche Aufbewahrungsfristen und Dokumentationspflichten, sofern diese
einschlägig sind.
```

##### Section 8: Betroffenenrechte

- ID: rechte
- aria-labelledby: rechte-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Betroffenenrechte

- Recht auf Auskunft

- Recht auf Berichtigung

- Recht auf Löschung

- Recht auf Einschränkung der Verarbeitung

- Recht auf Datenübertragbarkeit

- Recht auf Widerspruch

- Recht auf Widerruf erteilter Einwilligungen

- Beschwerderecht bei der zuständigen Aufsichtsbehörde
```

##### Section 9: Drittlandtransfer

- ID: drittlandtransfer
- aria-labelledby: drittland-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Drittlandtransfer

Derzeit erfolgt nach aktuellem Stand kein Drittlandtransfer außerhalb der EU oder des EWR.

Falls Drittland-Dienste eingesetzt werden, müssen diese hier mit passender Grundlage und
Schutzmaßnahmen ergänzt werden.
```

##### Section 10: Kontakt Datenschutz

- ID: kontakt-datenschutz
- aria-labelledby: kontakt-data-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: `mailto:[DATENSCHUTZ@DEINE-DOMAIN.TLD]` ([DATENSCHUTZ@DEINE-DOMAIN.TLD])
- Bilder in dieser Section: keine

```text
Kontakt Datenschutz

Für datenschutzbezogene Anliegen:
[DATENSCHUTZ@DEINE-DOMAIN.TLD]
```

### cookies.html

- Titel: Cookie-Einstellungen | Smart Web Studio
- Meta-Description: Cookie-Einstellungen, Consent-Management und Informationen zu den Cookie-Kategorien von Smart Web Studio mit direktem Zugriff auf die aktuellen Einstellungen.
- Canonical: -
- data-page: cookies
- body id: top
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`, `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`
- Modul-Script: `src/js/main.js`
- Animated background Platzhalter: ja
- Scroll-to-top Button: ja
- Cookie-Settings-Anker im Footer: ja
- Legacy-Redirect: nein

#### Body-Datenattribute

- `data-page` = `cookies`
- `data-mobile-sticky-cta` = `false`

#### Interne Links im Hauptinhalt

- `datenschutz.html` -> Datenschutz
- `cookies.html#cookie-settings` -> Cookie-Einstellungen öffnen [oeffnet Cookie-Panel]
- `cookies.html#cookie-settings` -> Cookie-Einstellungen ändern [oeffnet Cookie-Panel]
- `datenschutz.html` -> Zur Datenschutzerklärung

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

##### Section 1: Cookies, Consent und deine Auswahl

- ID: keine
- aria-labelledby: cookies-title
- Klassen: legal-hero reveal-on-scroll
- Eyebrow/Label: Cookie-Einstellungen
- Interne Links in dieser Section: `datenschutz.html` (Datenschutz), `cookies.html#cookie-settings` (Cookie-Einstellungen öffnen)
- Bilder in dieser Section: keine

```text
Cookie-Einstellungen

Cookies, Consent und deine Auswahl

Diese Website verwendet Cookies, um Funktionen bereitzustellen, die Nutzung zu analysieren und optionale
Marketingmaßnahmen zu steuern. Du entscheidest selbst, welche Kategorien du zulassen möchtest.

Noch keine Auswahl gespeichert.

Datenschutz

Cookie-Einstellungen öffnen
```

##### Section 2: Wie Consent auf dieser Website
funktioniert

- ID: keine
- aria-labelledby: cookies-intro-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Wie Consent auf dieser Website
funktioniert

Deine Entscheidung wird lokal im Browser gespeichert. Nicht notwendige Kategorien werden erst geladen,
nachdem du aktiv zugestimmt hast.

Die Consent-Auswahl kann jederzeit über den Footer-Link Cookie-Einstellungen oder über den
Button auf dieser Seite erneut geöffnet und angepasst werden.
```

##### Section 3: Notwendige Cookies

- ID: keine
- aria-labelledby: required-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Notwendige Cookies

Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.

Dazu gehört insbesondere die Speicherung deiner Cookie-Auswahl sowie technische Basisfunktionen für
Navigation, Sicherheit und Formularabläufe.
```

##### Section 4: Statistik Cookies

- ID: keine
- aria-labelledby: stats-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Statistik Cookies

Diese Cookies helfen zu verstehen, wie Besucher mit der Website interagieren.

Statistik-Skripte werden erst geladen, wenn du dieser Kategorie ausdrücklich zustimmst.
```

##### Section 5: Marketing Cookies

- ID: keine
- aria-labelledby: marketing-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: keine
- Bilder in dieser Section: keine

```text
Marketing Cookies

Diese Cookies können verwendet werden, um Besuchern relevante Werbung anzuzeigen oder Kampagnen
auszuwerten.

Marketing-Skripte bleiben standardmäßig deaktiviert und werden erst nach aktiver Zustimmung geladen.
```

##### Section 6: Cookie-Einstellungen ändern

- ID: cookie-settings
- aria-labelledby: change-settings-title
- Klassen: legal-section reveal-on-scroll
- Eyebrow/Label: keine
- Interne Links in dieser Section: `cookies.html#cookie-settings` (Cookie-Einstellungen ändern), `datenschutz.html` (Zur Datenschutzerklärung)
- Bilder in dieser Section: keine

```text
Cookie-Einstellungen ändern

Du kannst deine Auswahl jederzeit erneut öffnen, anpassen und speichern. Die Änderung gilt direkt für
zukünftige Ladevorgänge optionaler Kategorien.

Cookie-Einstellungen ändern

Zur Datenschutzerklärung

Noch keine Auswahl gespeichert.
```

### marketing.html

- Titel: Weiterleitung | Smart Web Studio
- Meta-Description: -
- Canonical: /seo-marketing
- data-page: marketing-legacy
- body id: -
- Base-HREF: -
- Stylesheets: `src/css/style.css`, `src/css/tailwind.css`
- Fonts: -
- Modul-Script: -
- Animated background Platzhalter: nein
- Scroll-to-top Button: nein
- Cookie-Settings-Anker im Footer: nein
- Legacy-Redirect: ja

#### Body-Datenattribute

- `data-page` = `marketing-legacy`
- `data-mobile-sticky-cta` = `false`

#### Interne Links im Hauptinhalt

- `seo-marketing.html` -> Zur neuen Seite

#### Bilder im Hauptinhalt

- keine

#### Klickbare Karten / data-card-link

- keine

#### Sprungnavigation

- keine

#### Filterlogik

- keine

#### Prefill-Buttons Richtung Kontaktformular

- keine

#### Formulare

- keine

#### Top-Level-Sections im `<main>`

- keine

## 6. Rekonstruktionshinweise

- Wenn du die Website 1:1 nachbauen willst, beginne mit dem wiederkehrenden Layout: Head-Setup, Top-Navigation, Footer, Cookie-Banner, Scroll-to-top, Mobile-Sticky-CTA.
- Danach reproduzierst du die Seitenstruktur in dieser Reihenfolge: Startseite, Leistungsuebersicht, sechs Service-Detailseiten, Projekte, vier Projekt-Unterseiten, Case Study, Ablauf, Preise, Ueber mich, Insights, Kontakt, Danke, Rechtliches, Redirect-Seite.
- Fuer die Verlinkung ist entscheidend, dass globale Links nicht pro Seite individuell gepflegt werden, sondern zur Laufzeit von `navigation.js` normalisiert werden.
- Fuer Projekt-Unterseiten muss `<base href="../" />` beruecksichtigt werden, damit Root-Links wie `kontakt.html` oder `index.html` aus dem Unterordner korrekt bleiben.
- Das Kontaktformular ist funktional auf die API vorbereitet; ohne gesetzte Resend-ENV-Variablen antwortet der Endpoint mit einer Konfigurationsfehlermeldung.
- Die Cookie-Seite und das Cookie-Panel gehoeren logisch zusammen: `cookies.html#cookie-settings` ist nicht nur ein Anker, sondern der Einstieg in das JS-gesteuerte Dialogfenster.
