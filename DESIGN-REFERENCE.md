# Design Reference — Smart Web Studio

Diese Datei dient als Nachschlagewerk für das Design-System des Projekts.
Hier werden Hintergründe, Farben, Klassen-Konventionen und andere wiederkehrende
Designentscheidungen dokumentiert, damit Anweisungen an Claude präzise formuliert
werden können.

---

## Hintergründe

### Globaler Hintergrund (Body)

Der Grundhintergrund aller Seiten ist im `body` definiert:

```css
body {
  background-color: #07101c; /* sehr dunkles Nacht-Blau */
}
```

**Wie ansprechen:** "Body-Hintergrund" oder "globaler Hintergrund"

---

### Section-Surface-Utilities

Für Abschnitte (Sections) gibt es ein fertiges Utility-System mit der
CSS-Klasse `section-surface--*`. Diese Klassen können einer Section
direkt hinzugefügt werden, um den Abschnittshintergrund zu steuern.
Alle Varianten basieren auf einem fast schwarzen Dunkel-Blau (`#08080c`)
mit unterschiedlicher Transparenz.

| Klasse | Hintergrundfarbe | Stärke | Trennlinien |
|--------|-----------------|--------|-------------|
| `.section-surface--darkened` | `rgba(8, 8, 12, 0.4)` | abgedunkelt | oben + unten |
| `.section-surface--about-default` | `rgba(8, 8, 12, 0.4)` | wie darkened, aber ohne untere Linie + blauer Seitenglanz links | nur oben |
| `.section-surface--global` | `transparent` | kein eigener Hintergrund | keine |

> **Entfernt:** `.section-surface--muted` (`rgba(8,8,12,0.18)`) wurde aus dem CSS gelöscht —
> war nirgendwo in HTML oder JS referenziert und damit toter Code.

**Wie ansprechen:** Einfach den Suffix nennen, z.B.:
- *"gib dem Leistungen-Abschnitt den **darkened**-Hintergrund"*
- *"setze den Abschnitt auf **global** / transparent"*

---

### Abschnitts-Glows (`::before` Pseudo-Elemente)

Viele Abschnitte haben einen dezenten radialen Glow-Gradient als Pseudo-Element,
der keine eigene Klasse hat, sondern direkt am Selektor hängt.

| Abschnitt / Klasse | Glow-Farbe | Position |
|--------------------|-----------|---------|
| `.approach-section::before` | `rgba(98, 173, 255, 0.06)` — Blau | mittig |
| `.service-pillars-section::before` | `rgba(148, 242, 255, 0.06)` — Cyan-Türkis | mittig |
| `.about-section::before` | `rgba(98, 173, 255, 0.04)` — Blau | links |

**Wie ansprechen:** "Glow" eines Abschnitts, z.B. *"entferne den Glow beim Leistungen-Abschnitt"*

---

### Aktuell gesetzte Hintergründe — Übersicht nach Seite

Abschnitte **ohne** `section-surface--` Klasse erben den Basis-Hintergrund ihrer
CSS-Komponenten-Klasse (z.B. `about-section` hat selbst `rgba(8,8,12,0.4)` hardcodiert).

#### index.html — Startseite

| Abschnitt (eyebrow / id) | HTML-Klasse | Hintergrund |
|--------------------------|-------------|-------------|
| Hero | `#hero-stage` | eigener Hero-Hintergrund |
| Problem | `approach-section` | kein surface → Body-Hintergrund + blauer Glow |
| Leistungen | `service-pillars-section` | kein surface → Body-Hintergrund + cyan Glow |
| Projekt-Teaser | `about-section` | kein surface → `rgba(8,8,12,0.4)` (about-section eigener Hintergrund) |
| Ablauf | `process-section` | kein surface → Body-Hintergrund |
| Zwei klare Wege | `packages-section` | kein surface → Body-Hintergrund |
| Kontakt (CTA) | `final-cta-section` | kein surface → Body-Hintergrund |

> **Hinweis:** Auf der Startseite hat noch kein Abschnitt (außer Hero) eine explizite `section-surface--` Klasse.

---

#### leistungen.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro (Hero-ähnlich) | anonym | kein surface → Body-Hintergrund |
| Leistungen-Übersicht | `approach-section` | kein surface → Body-Hintergrund + blauer Glow |
| Services-Decision | anonym | kein surface → Body-Hintergrund |
| Arbeitsweise mit KI | anonym | kein surface → Body-Hintergrund |
| Next Steps | `about-section about-section--next-steps` | kein surface → `rgba(8,8,12,0.4)` |
| Kontakt (CTA) | `final-cta-section` | kein surface → Body-Hintergrund |

---

#### webentwicklung.html / branding.html / seo-marketing.html / ki-beratung.html / social.html / growth.html
*(alle Leistungs-Detailseiten haben dasselbe Muster)*

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro (Hero-ähnlich) | anonym | kein surface → Body-Hintergrund |
| Kernpunkte / Detail | `approach-section` + **`section-surface--darkened`** | `rgba(8,8,12,0.4)` — deutlich abgedunkelt |
| Projekt-/Beweis-Block | `about-section` + **`section-surface--global`** | transparent |

---

#### ablauf.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro | anonym | kein surface → Body-Hintergrund |
| Prozessschritte | `process-section` | kein surface → Body-Hintergrund |
| Pakete | `packages-section` | kein surface → Body-Hintergrund |
| Kontakt (CTA) | `final-cta-section` | kein surface → Body-Hintergrund |

---

#### preise.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro | anonym | kein surface → Body-Hintergrund |
| Preispakete | `packages-section pricing-packages-section` | kein surface → Body-Hintergrund |
| Guide / Next Steps | `about-section about-section--next-steps` | kein surface → `rgba(8,8,12,0.4)` |
| Kontakt (CTA) | `final-cta-section` | kein surface → Body-Hintergrund |

---

#### kontakt.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro | anonym | kein surface → Body-Hintergrund |
| Terminbuchung | `packages-section` | kein surface → Body-Hintergrund |
| Kontaktformular (CTA) | `final-cta-section` | kein surface → Body-Hintergrund |

---

#### projekte.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro | anonym | kein surface → Body-Hintergrund |
| Projekt-Grid | `packages-section project-grid-section` + **`section-surface--global`** | transparent |
| Beweis-Block | `about-section` + **`section-surface--about-default`** | `rgba(8,8,12,0.4)` + blauer Seitenglanz |
| Kontakt (CTA) | `final-cta-section` + **`section-surface--global`** | transparent |

---

#### ueber-mich.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro (Über mich) | `about-section` + **`section-surface--global`** | transparent |
| Prinzipien | `approach-section` + **`section-surface--about-default`** | `rgba(8,8,12,0.4)` + blauer Seitenglanz |
| Arbeitsstil | `packages-section` + **`section-surface--global`** | transparent |
| Qualität | `about-section` + **`section-surface--about-default`** | `rgba(8,8,12,0.4)` + blauer Seitenglanz |
| Kontakt (CTA) | `final-cta-section` + **`section-surface--global`** | transparent |

---

#### case-study.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro | anonym | kein surface → Body-Hintergrund |
| Prozess | `process-section` | kein surface → Body-Hintergrund |
| Ergebnis | `about-section` | kein surface → `rgba(8,8,12,0.4)` (about-section Eigenhintergrund) |
| Links | `packages-section` | kein surface → Body-Hintergrund |
| Kontakt (CTA) | `final-cta-section` | kein surface → Body-Hintergrund |

---

#### insights.html

| Abschnitt | HTML-Klasse | Hintergrund |
|-----------|-------------|-------------|
| Intro | `about-section insights-intro-section` + **`section-surface--global`** | transparent |
| Artikel-Cluster | `insight-cluster-section` + **`section-surface--global`** | transparent |

---

## Farb-Variablen (CSS Custom Properties)

Definiert in `:root` in [src/css/style.css](src/css/style.css):

```css
--primary-color:   #00d4ff   /* Cyan-Akzent */
--secondary-color: #ff00ff   /* Magenta-Akzent */
--bg-color:        #000000   /* (Fallback, aktiv ist body #07101c) */
--text-color:      #e6edf7   /* Helles Blau-Weiß für Fließtext */
--glass-bg:        rgba(255, 255, 255, 0.1)
--glass-border:    rgba(255, 255, 255, 0.2)
```

---

## Weitere Notizen

*(Hier können weitere Designentscheidungen ergänzt werden)*
