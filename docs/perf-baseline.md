# Performance Baseline — sw-studio.at

> Stand: 2026-04-25 — Phase-0-Bestandsaufnahme **vor** dem Refactor.
> Basis: `npm run build`-Output vom 2026-04-24 in [dist/](../dist/).
> Lighthouse-Werte werden unmittelbar vor dem Start von Phase 1 ergänzt (siehe [§ 7](#7-lighthouse-baseline)).

---

## 1. Build-Output (gemessen)

Gemessen mit `stat -c%s` (raw) und `gzip -c | wc -c` bzw. `brotli -c | wc -c`.

| Datei | Raw | Gzip | Brotli | Anmerkung |
|---|---:|---:|---:|---|
| `dist/assets/main-C2x1Qgh5.js` | 39 540 B (38.6 KB) | 11 155 B (10.9 KB) | 9 954 B (9.7 KB) | enthält cookieConsent + navigation |
| `dist/assets/main-DK4BDZxe.js` | 13 021 B (12.7 KB) | 4 486 B (4.4 KB) | 3 968 B (3.9 KB) | Entry-Bundle (`src/js/main.js`) |
| `dist/assets/main-ugK0IeoV.css` | 1 147 B (1.1 KB) | 501 B | 397 B | hero-sphere.css |
| `dist/assets/style-Bvk1EK4g.css` | 88 869 B (86.8 KB) | 16 660 B (16.3 KB) | 14 214 B (13.9 KB) | gesamtes `src/css/style.css` |
| **JS gesamt (gzip)** | — | **15 641 B (15.3 KB)** | 13 922 B (13.6 KB) | ✅ unter 100-KB-Budget |
| **CSS gesamt (gzip)** | — | **17 161 B (16.8 KB)** | 14 611 B (14.3 KB) | innerhalb Erwartung |

`dist/assets/water-sphere.js` existiert **nicht** als separates Bundle — der Quellcode ([src/js/water-sphere.js](../src/js/water-sphere.js), 21 KB) wird im Build aktuell **nicht erfasst** (er wird in [index.html](../index.html) per absolutem Pfad `src/js/water-sphere.js?v=5` referenziert und greift auf das globale `THREE` aus dem unpkg-CDN zu). Vite bundlet ihn daher nicht. Das ist Teil des Phase-2-Refactors.

## 2. Externe Ressourcen (CDN — Schätzungen)

Nicht aus dem eigenen Build, deshalb _Schätzwerte_ aus offiziellen Doku-/Distribution-Größen:

| Ressource | Wo geladen | Raw (geschätzt) | Gzip (geschätzt) | Quelle |
|---|---|---:|---:|---|
| `https://cdn.tailwindcss.com` (Play-CDN, JIT zur Runtime) | 23 von 24 HTML-Seiten | ~ 360 KB | **~ 93 KB** | tailwindcss.com/docs/installation/play-cdn |
| `https://unpkg.com/three@0.160.0/build/three.min.js` | nur [index.html](../index.html#L36) | ~ 612 KB | **~ 155 KB** | unpkg-Header |
| Google Fonts CSS (`Geist 5w + Inter 5w + JetBrainsMono 2w`) | alle Seiten | — | ~ 6 KB CSS + ~ 80–120 KB WOFF2 | fonts.gstatic.com |

→ **Tailwind-CDN allein verursacht ~ 93 KB gz JS-Transfer pro Seite plus Runtime-JIT-Compile** (CPU/INP-Risiko auf Mobile).

## 3. Source-Dateien

| Datei | Bytes | Anmerkung |
|---|---:|---|
| [src/css/style.css](../src/css/style.css) | 120 921 (118 KB) | Hauptstylesheet, 5 158 Zeilen, 27 `@keyframes`, 9 `prefers-reduced-motion`-Queries |
| [src/css/typography.css](../src/css/typography.css) | 1 323 | Custom-Fonts |
| [src/css/grain-overlay.css](../src/css/grain-overlay.css) | 672 | Grain-Effekt |
| [src/css/hero-sphere.css](../src/css/hero-sphere.css) | 1 700 | Hero-Sphere |
| [src/js/main.js](../src/js/main.js) | 31 011 (30 KB) | 10 Init-Funktionen |
| [src/js/water-sphere.js](../src/js/water-sphere.js) | 21 596 (21 KB) | Three.js + Simplex-Noise-Shader |
| [src/scripts/modules/navigation.js](../src/scripts/modules/navigation.js) | 24 907 (24 KB) | Nav, Footer, Sticky-CTA |
| [src/scripts/modules/cookieConsent.js](../src/scripts/modules/cookieConsent.js) | 18 413 (18 KB) | Cookie-Banner |

## 4. Asset-Inventar ([assets/](../assets/), 6.3 MB gesamt)

| Datei | Größe | Status |
|---|---:|---|
| `hero-cube-iridescent-v1.jpg` | 170 KB | ✅ **LCP-Kandidat** (in [index.html](../index.html) verwendet) |
| `hero-cube-iridescent-v1.png` | 2 087 KB | ⚠️ Backup, vermutlich ungenutzt → Löschkandidat (Phase 4) |
| `sw-studio_logo.png` | 113 KB | ✅ in Verwendung — SVG-Konvertierung empfohlen |
| `smart web stidio Logo T.png` | 1 535 KB | ⚠️ Tippfehler im Namen ("stidio"), vermutlich ungenutzt → Löschkandidat |
| `uebermich.webP` | 2 459 KB | ⚠️ unkomprimierte Quelldatei, responsive Varianten existieren → Löschkandidat |
| `uebermich-1024.webp` | 111 KB | ✅ responsive Variante |
| `uebermich-720.webp` | 60 KB | ✅ responsive Variante |
| `uebermich-480.webp` | 31 KB | ✅ responsive Variante |

→ Bei Bestätigung können **~ 6 MB Assets** (3 Dateien) gelöscht werden — das schrumpft Repo-Größe und Vercel-Deploy-Zeit, beeinflusst aber **nicht** die Runtime-Performance, solange sie nicht referenziert werden.

## 5. Lazy-Loading Status

| HTML-Datei | Hat `loading="lazy"`? |
|---|---|
| [ueber-mich.html](../ueber-mich.html) | ✅ ja |
| **alle 23 anderen** | ❌ nein |

→ Phase 4: `loading="lazy"` + `decoding="async"` + `width`/`height` für alle Bilder außer LCP.

## 6. HTTP-Requests Landing Page ([index.html](../index.html))

Aus Quellcode ausgezählt:

| Typ | Anzahl | Details |
|---|---:|---|
| `<script>` external | **3** | inline-Tailwind-Config (Z. 17), Tailwind CDN (Z. 35), Three.js CDN (Z. 36) |
| `<script>` lokal | **2** | `src/js/main.js`, `src/js/water-sphere.js?v=5` |
| `<link rel="stylesheet">` external | **1** | Google Fonts CSS |
| `<link rel="stylesheet">` lokal | **2** | `src/css/style.css`, `src/css/hero-sphere.css?v=5` |
| `<link rel="preconnect">` | 2 | fonts.googleapis.com, fonts.gstatic.com |
| `<img>` (above-the-fold) | mind. 1 | Logo |
| Google Fonts WOFF2-Dateien | ≥ 3 | Inter, Geist, JetBrains Mono — eine Datei pro Weight + Subset |

→ Auf 3G/4G-Mobile rechnet das mit ~ 15+ Network-Requests _bevor_ die Seite interaktiv wird.

## 7. Lighthouse-Baseline

Gemessen 2026-04-25 unmittelbar vor Phase 1. Setup: `npm run build` → `vite preview --port 4173` → `npx lighthouse@11 http://localhost:4173/ --form-factor=mobile --throttling-method=simulate --only-categories=performance --quiet`. Headless Chromium, simuliertes Slow-4G-Throttling, Landing Page (`index.html`).

| Metrik | Mobile (Slow 4G, simuliert) | Ziel (Phase 6) | Status |
|---|---:|---:|:---:|
| **Performance Score** | **58 / 100** | ≥ 95 | ❌ |
| LCP | 5.56 s | < 2.0 s | ❌ |
| FCP | 4.73 s | — | ❌ |
| CLS | 0.000 | < 0.05 | ✅ |
| TBT | 293 ms | (Proxy für INP) | ⚠️ |
| Speed Index | 7.06 s | — | ❌ |
| TTI | 5.19 s | — | ❌ |
| Total Byte Weight | 547 KB | — | — |
| Unused JS (savings) | 134 KB | — | — |

**Top-Network-Requests (transferSize, sortiert):**
| KB | URL |
|---:|---|
| 163.3 | `https://unpkg.com/three@0.160.0/build/three.min.js` |
| 123.9 | `https://cdn.tailwindcss.com/3.4.17` |
| 110.7 | `assets/sw-studio_logo-BmkTZnbI.png` (LCP-Kandidat ist das Logo!) |
| 47.3 | `fonts.gstatic.com/.../inter` |
| 30.6 | `fonts.gstatic.com/.../jetbrainsmono` |
| 27.8 | `fonts.gstatic.com/.../geist` |
| 16.8 | `assets/style-69rQ8Jzl.css` |
| 11.3 | `assets/main-C2x1Qgh5.js` |
| 4.8 | `assets/main-nqv7V1-7.js` |

**Schlüsselbefund:** Das **Logo** (110 KB PNG) ist Lighthouse zufolge das LCP-Element — nicht das Hero-Cube-Bild. Das verschiebt die Priorität für Phase 4 (Logo → SVG/optimiertes WebP wird zum LCP-Hebel).

CLS 0.000 ist ausgezeichnet. Der Rückstand kommt fast vollständig aus zwei externen Skripten (Three.js + Tailwind-CDN, zusammen 287 KB) + Render-Blocking Google-Fonts (~ 105 KB).

### Nach Phase 1 (Tailwind-CDN entfernt, lokaler Build)

Drei aufeinanderfolgende Runs (gleiches Setup wie Baseline):

| Metrik | Run 1 | Run 2 | Run 3 | Median | Δ vs. Baseline |
|---|---:|---:|---:|---:|---:|
| Performance Score | 50 | 53 | 53 | **53** | −5 |
| LCP | 4.60 s | 4.53 s | 4.54 s | **4.54 s** | **−1.02 s** ✅ |
| FCP | 2.79 s | 2.79 s | 2.79 s | **2.79 s** | **−1.94 s** ✅ |
| CLS | 0.001 | 0.001 | 0.001 | 0.001 | ≈ |
| TBT | 1530 ms | 1186 ms | 1186 ms | **1186 ms** | **+893 ms** ⚠️ |
| Speed Index | 4.89 s | 4.76 s | 4.73 s | **4.76 s** | **−2.30 s** ✅ |
| Total Byte Weight | 424 KB | — | — | **424 KB** | **−123 KB** ✅ |

**Interpretation des TBT-Anstiegs (Score-Paradox):**
Vorher blockierte das ~1 s lange Tailwind-CDN-Script die Initial-Render-Phase. Three.js' WebGL-Setup (163 KB Download + Shader-Compile + Link) lief deshalb **nach** dem 5-s-TBT-Messfenster ab und blieb im Score unsichtbar. Mit entferntem Tailwind-CDN rendert die Seite ~ 1.9 s früher (FCP 4.73 → 2.79 s) — Three.js' CPU-Arbeit fällt jetzt **in** das Messfenster. Der Gesamt-Score ist temporär niedriger, die Seite ist objektiv schneller (LCP −1 s, SI −2.3 s, Bytes −123 KB).

Phase 2 (Three.js dynamic import + Reduced-Motion-Gate) eliminiert genau diese Quelle — TBT erwartet < 200 ms.

## 8. Beobachtete Risiken

1. **Tailwind Play-CDN in Produktion** — laut [Tailwind-Doku](https://tailwindcss.com/docs/installation/play-cdn) ausdrücklich nicht für Produktion. JIT-Kompilierung im Browser blockiert den Main-Thread und wird in jedem Page-Load wiederholt.
2. **Three.js komplett ungebundelt** — 612 KB raw / ~155 KB gz werden eager über Drittanbieter-CDN geladen, **bevor** ermittelt wird, ob WebGL überhaupt benötigt/möglich ist (Reduced-Motion, Save-Data, kein WebGL).
3. **Hero-WebGL-Script greift auf globales `THREE` zu** — Vite-Bundling umgeht es, daher kein Tree-Shaking, kein Hashing, kein Source-Map-Sharing.
4. **Fehlende `loading="lazy"`** auf 23 von 24 Seiten → Bilder unter dem Fold werden eager geladen.
5. **3 verwaiste, große Assets** (~ 6 MB) im Repo — beeinflussen Repo-/Deploy-Größe.
6. **Cookie-Banner im kritischen Pfad** ([src/scripts/modules/cookieConsent.js](../src/scripts/modules/cookieConsent.js), 18 KB) wird im Haupt-Bundle ausgeliefert, obwohl er nach `requestIdleCallback` nachgeladen werden könnte.
7. **Google Fonts via CDN ohne `preload`** für die kritische Hero-Schrift → FOUT-Risiko.

## 9. Positives (was bereits gut ist)

- ✅ `prefers-reduced-motion` wird **umfassend respektiert** (entgegen der Annahme im ursprünglichen Auftragstext): 9 CSS-Media-Queries + JS-Checks in [water-sphere.js](../src/js/water-sphere.js) und [main.js](../src/js/main.js).
- ✅ Vite-Multi-Page-Build steht und produziert hashed Assets.
- ✅ Hero-Bild liegt bereits als 170-KB-JPG vor (gut komprimiert).
- ✅ Responsive Bild-Varianten für `uebermich` existieren (480/720/1024).
- ✅ Hero-Renderer pausiert bereits bei `prefers-reduced-motion` (`body.no-webgl`-Klasse).

---

_Quellmessungen reproduzierbar via:_
```bash
cd dist/assets && for f in *.js *.css; do echo -n "$f raw="; stat -c%s "$f"; echo -n " gz="; gzip -c "$f" | wc -c; done
```
