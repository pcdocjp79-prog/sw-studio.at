// Scroll-driven Marquee (ki-automatisierung.html):
// misst den Scroll-Fortschritt des Bands durch den Viewport (0 → 1),
// glättet ihn per Lerp und schreibt ihn als --ai-marquee-progress.
// Die eigentliche Bewegung passiert in src/css/ai-marquee.css.
const MARQUEE_SELECTOR = "[data-ai-marquee]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PROGRESS_PROPERTY = "--ai-marquee-progress";
const SMOOTHING = 0.09;
const SETTLE_EPSILON = 0.0004;
const VIEW_MARGIN = "160px";

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const initMarquee = (marquee) => {
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  let targetProgress = 0.5;
  let currentProgress = null;
  let frameId = null;
  let isInView = false;

  const measure = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = marquee.getBoundingClientRect();
    targetProgress = clamp01((viewportHeight - rect.top) / (viewportHeight + rect.height));
  };

  const cancelFrame = () => {
    if (frameId === null) return;
    window.cancelAnimationFrame(frameId);
    frameId = null;
  };

  const scheduleFrame = () => {
    if (frameId !== null || reducedMotionQuery.matches) return;
    frameId = window.requestAnimationFrame(render);
  };

  const render = () => {
    frameId = null;
    currentProgress =
      currentProgress === null
        ? targetProgress
        : currentProgress + (targetProgress - currentProgress) * SMOOTHING;
    if (Math.abs(targetProgress - currentProgress) < SETTLE_EPSILON) {
      currentProgress = targetProgress;
    }
    marquee.style.setProperty(PROGRESS_PROPERTY, currentProgress.toFixed(4));
    if (currentProgress !== targetProgress) {
      scheduleFrame();
    }
  };

  const handleScroll = () => {
    if (!isInView || reducedMotionQuery.matches) return;
    measure();
    scheduleFrame();
  };

  const handleResize = () => {
    if (reducedMotionQuery.matches) return;
    measure();
    scheduleFrame();
  };

  const handleMotionPreference = () => {
    if (reducedMotionQuery.matches) {
      cancelFrame();
      currentProgress = null;
      marquee.style.removeProperty(PROGRESS_PROPERTY);
      return;
    }
    measure();
    scheduleFrame();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isInView = entry.isIntersecting;
        if (!isInView) {
          cancelFrame();
          return;
        }
        if (reducedMotionQuery.matches) return;
        measure();
        scheduleFrame();
      });
    },
    { rootMargin: VIEW_MARGIN }
  );

  observer.observe(marquee);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionPreference);
  }
  handleMotionPreference();
};

document.querySelectorAll(MARQUEE_SELECTOR).forEach(initMarquee);
