# Smart Web Studio — Redesign & Upgrade Plan
## Ziel: Von "professionell" zu "Award-Winner Level"
**Erstellt für:** sw-studio.at  
**Stand:** März 2026  
**Arbeitsweise:** Schrittweise Umsetzung — NIEMALS alles auf einmal  
**Ziel-Referenzen:** Awwwards SOTD, Stripe.com, Linear.app, Basement Studio, Resend.com

---

## PHASE 1 — Fundament & Visual Identity Upgrade
*Priorität: HOCH — Basis für alles andere*

### 1.1 Typografie-System überarbeiten
**Problem:** Aktuell zu generisch, keine typografischen Akzente, kein echter Charakter.  
**Ziel:** Eine starke Schrift-Kombination die Autorität + Modernität kommuniziert.

**Konkrete Maßnahmen:**
- Display-Font für Headlines: z.B. **Clash Display**, **Syne**, oder **Cabinet Grotesk** (alle auf fontshare.com kostenlos)
- Body-Font: Inter oder Geist (Vercel) — clean, hochwertig, gut lesbar
- Typografische Skalierung überarbeiten: Headline H1 auf 80–100px (Desktop), mit sehr engem Letter-Spacing (-0.04em)
- Einführung von "Display Text" — große Zahlen / Buchstaben als visuelle Gestaltungselemente (z.B. "01", "02" — das ist bereits ansatzweise da, aber noch nicht konsequent genug)

**Code-Schritt (isoliert umsetzbar):**
```css
/* Beispiel Import Clash Display */
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

:root {
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Inter', sans-serif;
  --tracking-tight: -0.04em;
  --tracking-display: -0.06em;
}

h1, h2 { 
  font-family: var(--font-display);
  letter-spacing: var(--tracking-display);
  line-height: 1.05;
}
```

---

### 1.2 Cursor — Custom Cursor einführen
**Problem:** Standard-Cursor, kein visuelles Feedback, kein Premium-Gefühl.  
**Ziel:** Ein subtiler Custom Cursor (kleiner Dot + Ring), der auf interaktive Elemente reagiert.

**Konkrete Maßnahmen:**
- Kleiner weißer Dot (6px) als Cursor
- Größerer transparenter Ring (40px) der leicht verzögert folgt (lerp-Animation)
- Auf Hover über Links/Buttons: Ring vergrößert sich + Farbe wechselt zu Pink/Magenta

**Code-Schritt (isoliert als JS-Modul):**
```javascript
// cursor.js — eigenständiges Modul, kann jederzeit ein/ausgebaut werden
const dot = document.createElement('div');
const ring = document.createElement('div');
dot.className = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
});
```

---

### 1.3 Noise / Grain Texture als globales Overlay
**Problem:** Die Gradienten wirken zu digital-glatt, kein Tiefengefühl.  
**Ziel:** Ein feines Film-Grain Overlay über der ganzen Seite gibt Premium-Charakter.

**Konkrete Maßnahmen:**
- SVG-basiertes Noise-Overlay als Pseudo-Element auf `body::after`
- Opacity: 0.03–0.05 — kaum sichtbar, aber spürbar im Gesamteindruck
- Kein Performance-Impact

**Code-Schritt:**
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}
```

---

## PHASE 2 — Hero Section komplett neu
*Priorität: HOCH — erster Eindruck entscheidet alles*

### 2.1 Animated Text Hero mit Marquee
**Problem:** Hero ist statisch. Keine Bewegung, kein Einstieg der "zieht".  
**Ziel:** Ein cineastischer Einstieg — Text der erscheint, ein horizontales Marquee-Band, starker visueller Impact.

**Konkrete Maßnahmen:**
- H1 bleibt inhaltlich, aber bekommt ein "Reveal" — jedes Wort erscheint mit leichtem Y-Offset + Opacity von 0 → 1 (Stagger 0.08s pro Wort)
- Unter dem Hero-Text: ein langsam laufendes Marquee-Band mit Keywords: "Webentwicklung — Branding — SEO — Positionierung — Conversion — Struktur — Launch — Wachstum —"
- Das Marquee läuft als CSS-Animation (kein JS nötig), Pause on Hover

**Code-Schritt:**
```html
<div class="marquee-wrapper" aria-hidden="true">
  <div class="marquee-track">
    <span>Webentwicklung — Branding — Positionierung — Conversion — SEO — Launch — Wachstum — Struktur —</span>
    <span>Webentwicklung — Branding — Positionierung — Conversion — SEO — Launch — Wachstum — Struktur —</span>
  </div>
</div>
```
```css
.marquee-wrapper { overflow: hidden; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); }
.marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
```

### 2.2 Hero — Scroll Indicator
- Kleiner animierter Pfeil / Linie unten in der Hero Section
- Signalisiert: "Es gibt mehr zu sehen"
- Verschwindet nach dem ersten Scroll

---

## PHASE 3 — Seitenstruktur vereinfachen
*Priorität: HOCH — aktuell zu viele Seiten, zu viel Wiederholung*

### 3.1 Navigation straffen
**Problem:** 8 Nav-Punkte + viele Footer-Links = Orientierungslosigkeit.  
**Empfehlung neue Nav-Struktur (5 Punkte):**

| Alt | Neu |
|-----|-----|
| Start | Start |
| Leistungen | Leistungen |
| Projekte | Projekte |
| Ablauf | (in Leistungen integrieren) |
| Über mich | Studio |
| Preise | Preise |
| Insights | Blog / Insights |
| Kontakt | Erstgespräch buchen (CTA-Button) |

- "Ablauf" als eigene Seite aufgeben → als Section auf der Leistungsseite integrieren
- "Über mich" umbenennen in "Studio" — wirkt professioneller für eine Brand

### 3.2 Texte: Vom Verkaufsmodus in den Informationsmodus
**Problem:** Jede Kachel, jede Seite überzeugt statt informiert.  
**Regel für alle Unterseiten:** Die Startseite überzeugt. Alle anderen Seiten informieren.

**Für jede Leistungsseite — neue Textstruktur:**
```
1. Was ist es? (1 Satz, sachlich)
2. Für wen? (Zielgruppe konkret)
3. Was bekommst du konkret? (Bullet-Liste mit Deliverables)
4. Wie läuft es ab? (3–4 Schritte)
5. Was kostet es? (Richtwert oder Pakethinweis)
6. CTA
```

**Beispiel für Webentwicklung — vorher/nachher:**

*Vorher:*
> "Schnelle, strukturierte Websites mit sauberer Nutzerführung, klaren Conversion-Wegen und einer Technik, die dem Auftritt gerecht wird."

*Nachher:*
> "Ich baue Websites auf Basis von [Technologie]. Du bekommst: fertige Seiten inkl. CMS-Anbindung, Tracking-Setup, Mobile-Optimierung und eine Übergabe mit Dokumentation."

---

## PHASE 4 — Micro-Animationen & Scroll-Effekte
*Priorität: MITTEL — großer visueller Impact, nach Phase 1-3*

### 4.1 Scroll-triggered Animations mit CSS (kein GSAP nötig)
**Ziel:** Elemente erscheinen beim Scrollen mit Stil.

**Code-Schritt (Intersection Observer, leichtgewichtig):**
```javascript
// scroll-reveal.js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
```
```css
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
[data-reveal="delay-1"] { transition-delay: 0.1s; }
[data-reveal="delay-2"] { transition-delay: 0.2s; }
[data-reveal="delay-3"] { transition-delay: 0.3s; }
```
Dann einfach `data-reveal` zu beliebigen HTML-Elementen hinzufügen.

### 4.2 Karten-Hover Effekte upgraden
**Problem:** Aktuell haben die Cards Border-Glow, aber kein 3D-Gefühl.  
**Ziel:** Subtiler Tilt-Effekt auf Hover (wie Linear.app Cards).

```javascript
// card-tilt.js
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
});
```

### 4.3 Zahlen Counter Animation
**Ziel:** Wenn Zahlen (Preise, Stats) in den Viewport kommen, zählen sie von 0 hoch.  
Schafft Aufmerksamkeit und Dynamik auf der Preisseite.

---

## PHASE 5 — Neue Sektionen die fehlen
*Priorität: MITTEL — vertrauensbildend, fehlt komplett*

### 5.1 "Stack & Tools" Section
**Was es ist:** Eine horizontale Leiste die zeigt, womit du arbeitest.  
**Warum:** Technisch versierte Kunden wollen wissen: Webflow? Framer? WordPress? Custom Code?  
**Format:** Logo-Reihe + Technologie-Name, dezent, nicht aufdringlich  
**Platzierung:** Auf der Leistungsseite oder Über-mich-Seite

### 5.2 "Ausgewählte Projekte" als visuelles Grid
**Was fehlt:** Ein echter Portfolio-Bereich mit visuellen Vorschauen.  
**Warum:** Awwwards-Sites LEBEN von visuellen Projektnachweisen.  
**Idee:** Auch wenn noch keine echten Kundenprojekte freigegeben sind:  
→ Mockups, Screenshots deiner eigenen Seite, fiktive aber realistische Projektdarstellungen  
→ Ein 2-spaltigiges Grid mit Hover-Overlay (Projektname + Tags erscheinen)

### 5.3 Testimonials / Social Proof (minimal)
**Problem:** Komplett leer.  
**Lösung:** Auch 1–2 echte Zitate von Bekannten / Testpersonen reichen für den Start.  
**Format:** Großes Zitat-Typografie-Element, Name + Kontext darunter — kein Karussell

### 5.4 FAQ Section
**Platzierung:** Preisseite & Leistungsseite  
**Inhalt (Beispiel-Fragen):**
- Welche Technologie verwendest du?
- Wie lange dauert ein Projekt?
- Lieferst du auch Texte / Copywriting?
- Was passiert nach dem Launch?
- Arbeitest du auch remote / außerhalb Vorarlbergs?

---

## PHASE 6 — Performance & Technische Details
*Priorität: NIEDRIG aber wichtig für Award-Einreichung*

### 6.1 PageSpeed auf 95+ bringen
- Bilder in WebP konvertieren
- Fonts preloaden: `<link rel="preload" as="font">`
- CSS kritisch inline, Rest defer
- JS defer / async wo möglich

### 6.2 Open Graph & Meta Tags
- Jede Seite braucht: title, description, og:image (1200x630px, gebrandetes Design), og:title
- Das og:image ist das "Aushängeschild" wenn jemand den Link teilt

### 6.3 Favicon Set
- Aktuelles Logo als SVG-Favicon (skaliert sauber)
- Apple Touch Icon (180x180px)

---

## REIHENFOLGE DER UMSETZUNG (empfohlen)

| Schritt | Was | Aufwand | Impact |
|---------|-----|---------|--------|
| 1 | Typografie-System (1.1) | Klein | Hoch |
| 2 | Grain Overlay (1.3) | Sehr klein | Mittel |
| 3 | Scroll Reveal Animation (4.1) | Klein | Hoch |
| 4 | Hero Marquee (2.1) | Klein | Hoch |
| 5 | Custom Cursor (1.2) | Mittel | Mittel |
| 6 | Texte überarbeiten (3.2) | Groß | Sehr hoch |
| 7 | Navigation straffen (3.1) | Mittel | Hoch |
| 8 | Card Tilt (4.2) | Klein | Mittel |
| 9 | FAQ hinzufügen (5.4) | Klein | Hoch |
| 10 | Projekte Grid (5.2) | Groß | Sehr hoch |
| 11 | Stack Section (5.1) | Klein | Mittel |
| 12 | Testimonials (5.3) | Klein | Sehr hoch |
| 13 | Performance (6.1–6.3) | Mittel | Wichtig für SEO |

---

## DESIGN REFERENZEN (zur Orientierung)

- **linear.app** — Cards, Typografie, Micro-Animationen
- **resend.com** — Clean Dark Mode, Grain, Spacing
- **basement.studio** — Cursor, Marquee, Personality
- **stripe.com** — Vertrauen + Struktur + Eleganz
- **framer.com** — Hero Animations, Scroll Interaktionen
- **awwwards.com** — Inspiration für aktuelle Trends

---

## WICHTIGE REGEL FÜR DIE UMSETZUNG

> ❗ **Immer einen Schritt nach dem anderen.**  
> Jeden Schritt testen bevor der nächste beginnt.  
> Kein Schritt ist abhängig vom vorherigen — sie können unabhängig gebaut werden.  
> Jeder Schritt soll deployed und live testbar sein bevor weitergemacht wird.

---

*Dokument erstellt mit Claude für Smart Web Studio — sw-studio.at*  
*Zur Verwendung in Claude Code / Entwicklungsumgebung*
