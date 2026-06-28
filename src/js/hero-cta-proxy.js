/**
 * Hero-CTA-Klick-Proxy
 *
 * Die Hero-Kachel wird als fixierter Hintergrund-Layer (z-index: -2) gerendert,
 * damit der Seiteninhalt beim Scrollen darueber laeuft und die Kachel sanft
 * ausblendet. Dadurch liegen die CTA-Links der Hero HINTER der Inhaltsebene und
 * sind per Maus/Touch nicht klickbar. (Tastatur und Screenreader funktionieren
 * weiterhin, da Fokus nicht vom Stacking-Context abhaengt.)
 *
 * Dieses Modul legt unsichtbare, aria-versteckte Klickflaechen in die oberste
 * Ebene, die exakt der real gerenderten Position der Hero-CTAs folgen — inklusive
 * Tilt-, Scale- und Scroll-Transform. Klicks werden an dieselbe URL weitergereicht.
 *
 * Die sichtbaren Buttons bleiben unveraendert Teil der animierten Kachel. Dadurch
 * blendet ihr Erscheinungsbild beim Scrollen automatisch synchron mit der Kachel
 * aus (Variante B), und der Hover-Effekt wird ueber eine gespiegelte Klasse
 * erhalten.
 *
 * Eigenstaendiges Modul: jederzeit entfernbar, ohne die Kachel oder ihre
 * Animationen zu beeinflussen.
 */

const HERO_CTA_PROXY_HOVER_CLASS = "is-hover-proxy";
const HERO_CTA_PROXY_MIN_OPACITY = 0.5;

const initHeroCtaProxy = () => {
  const heroStage = document.querySelector("[data-hero-stage]");
  if (!heroStage) return;

  const ctaLinks = Array.from(heroStage.querySelectorAll(".hero-cta-row a[href]"));
  if (ctaLinks.length === 0) return;

  const heroContent = heroStage.querySelector(".hero-stage__content");
  // Sobald der erste Inhaltsbereich die Kachel ueberdeckt, duerfen die Proxys
  // keine Klicks mehr fangen (sonst blockieren unsichtbare Flaechen den Inhalt).
  const coveringSection =
    document.querySelector("#services") ||
    document.querySelector(".scroll-focus-section");

  const proxyLayer = document.createElement("div");
  proxyLayer.className = "hero-cta-proxy-layer";
  proxyLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(proxyLayer);

  const pairs = ctaLinks.map((link) => {
    const proxy = document.createElement("a");
    proxy.className = "hero-cta-proxy";
    proxy.setAttribute("aria-hidden", "true");
    proxy.setAttribute("tabindex", "-1");
    proxy.setAttribute("draggable", "false");
    proxy.href = link.getAttribute("href") || "#";

    // Hover-Spiegelung: die Proxy-Flaeche liegt ueber dem echten Button und
    // wuerde dessen :hover sonst abfangen.
    proxy.addEventListener("pointerenter", () => {
      link.classList.add(HERO_CTA_PROXY_HOVER_CLASS);
    });
    proxy.addEventListener("pointerleave", () => {
      link.classList.remove(HERO_CTA_PROXY_HOVER_CLASS);
    });

    proxyLayer.appendChild(proxy);
    return { link, proxy };
  });

  let rafId = null;
  let followUntil = 0;

  const deactivate = ({ link, proxy }) => {
    proxy.style.pointerEvents = "none";
    proxy.style.width = "0px";
    proxy.style.height = "0px";
    link.classList.remove(HERO_CTA_PROXY_HOVER_CLASS);
  };

  function schedule() {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(update);
  }

  function update() {
    rafId = null;

    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth || 0;
    const contentOpacity = heroContent
      ? Number.parseFloat(window.getComputedStyle(heroContent).opacity) || 0
      : 1;
    const coveringTop = coveringSection
      ? coveringSection.getBoundingClientRect().top
      : Number.POSITIVE_INFINITY;

    pairs.forEach((pair) => {
      const { link, proxy } = pair;
      const rect = link.getBoundingClientRect();
      const onScreen =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < viewportHeight &&
        rect.right > 0 &&
        rect.left < viewportWidth;
      const covered = coveringTop < rect.bottom - 4;
      const active =
        onScreen && !covered && contentOpacity >= HERO_CTA_PROXY_MIN_OPACITY;

      if (!active) {
        deactivate(pair);
        return;
      }

      const href = link.getAttribute("href");
      if (href && proxy.getAttribute("href") !== href) {
        proxy.setAttribute("href", href);
      }

      proxy.style.pointerEvents = "auto";
      proxy.style.left = `${rect.left}px`;
      proxy.style.top = `${rect.top}px`;
      proxy.style.width = `${rect.width}px`;
      proxy.style.height = `${rect.height}px`;
      proxy.style.borderRadius = window.getComputedStyle(link).borderRadius;
    });

    if (performance.now() < followUntil) {
      schedule();
    }
  }

  // Haelt die rAF-Schleife fuer eine kurze Phase aktiv, damit die Proxys auch der
  // nachlaufenden Tilt-/Scroll-Animation folgen, statt dauerhaft zu laufen.
  const follow = (durationMs) => {
    followUntil = Math.max(followUntil, performance.now() + durationMs);
    schedule();
  };

  window.addEventListener("scroll", () => follow(160), { passive: true });
  window.addEventListener("resize", () => follow(200));
  window.addEventListener("orientationchange", () => follow(400));
  window.addEventListener("pointermove", () => follow(280), { passive: true });
  window.addEventListener("pageshow", () => follow(240));
  window.addEventListener("load", () => follow(240), { once: true });

  if (document.fonts && typeof document.fonts.ready?.then === "function") {
    document.fonts.ready.then(() => follow(240));
  }

  // Spaetes Layout (Fonts, Hero-Intro) abfangen.
  window.setTimeout(() => follow(120), 400);
  window.setTimeout(() => follow(120), 1300);
  window.setTimeout(() => follow(120), 2800);

  schedule();
};

initHeroCtaProxy();
