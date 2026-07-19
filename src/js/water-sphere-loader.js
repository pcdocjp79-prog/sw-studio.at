/**
 * water-sphere-loader.js
 * Lädt die WebGL-Hero-Sphere (water-sphere.js inkl. Three.js, ~510 kB)
 * per dynamic import, sobald der Browser den ersten Frame gerendert hat.
 * So bleibt das Bundle aus dem kritischen Renderpfad (Lighthouse: LCP/TBT),
 * startet aber praktisch sofort — ohne wahrnehmbare Verzögerung.
 *
 * water-sphere.js selbst bleibt unverändert: Es initialisiert sich beim
 * Import selbst (readyState-Guard) und blendet den Canvas wie bisher
 * über body.webgl-ready weich ein.
 */

function loadWaterSphere() {
  // Seite ohne Sphere-Markup: Download komplett sparen
  if (!document.querySelector("[data-orb-parallax-layer]")) return;

  // Reduced Motion: water-sphere.js würde sofort abbrechen und den
  // CSS-Fallback zeigen — das erledigen wir hier ohne den 510-kB-Download.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.remove("webgl-ready");
    document.body.classList.add("no-webgl");
    return;
  }

  import("./water-sphere.js");
}

// Doppeltes requestAnimationFrame: feuert direkt NACH dem ersten Paint —
// der Hero-Text ist dann bereits sichtbar, die Sphere lädt sofort danach.
function scheduleLoad() {
  requestAnimationFrame(() => {
    requestAnimationFrame(loadWaterSphere);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleLoad, { once: true });
} else {
  scheduleLoad();
}
