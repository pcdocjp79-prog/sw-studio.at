const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const getCardState = (index, activeStep) => {
  if (activeStep < index) {
    const depth = index - activeStep;
    return {
      y: depth * 14,
      z: depth * -15,
      scale: 1 - depth * 0.03,
      rotate: depth * -2.5,
    };
  }

  if (activeStep === index) {
    return {
      y: 0,
      z: 0,
      scale: 1,
      rotate: 0,
    };
  }

  return {
    y: -820,
    z: 0,
    scale: 0.95,
    rotate: -10,
    isReleased: true,
  };
};

const interpolate = (start, end, progress) => start + (end - start) * progress;

const interpolateState = (fromState, toState, progress) => ({
  y: interpolate(fromState.y, toState.y, progress),
  z: interpolate(fromState.z, toState.z, progress),
  scale: interpolate(fromState.scale, toState.scale, progress),
  rotate: interpolate(fromState.rotate, toState.rotate, progress),
});

const initWebdevProjectStack = () => {
  const root = document.querySelector("[data-webdev-project-stack]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll("[data-project-card]"));
  if (cards.length < 2) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 900px)");
  let rafId = null;

  const resetCards = () => {
    cards.forEach((card) => {
      card.style.removeProperty("--project-card-y");
      card.style.removeProperty("--project-card-z");
      card.style.removeProperty("--project-card-scale");
      card.style.removeProperty("--project-card-rotate");
      card.style.removeProperty("--project-card-events");
      card.style.removeProperty("z-index");
      card.classList.remove("is-active");
      card.removeAttribute("aria-hidden");
    });
  };

  const render = () => {
    rafId = null;

    if (reducedMotionQuery.matches || !desktopQuery.matches) {
      resetCards();
      return;
    }

    const sectionRect = root.getBoundingClientRect();
    const scrollableDistance = Math.max(sectionRect.height - window.innerHeight, 1);
    const progress = clamp((sectionRect.top * -1) / scrollableDistance);
    const totalIntervals = cards.length;
    const scaledProgress = progress * totalIntervals;
    const currentStep = Math.min(Math.floor(scaledProgress), totalIntervals);
    const stepProgress = clamp(scaledProgress - currentStep);

    cards.forEach((card, index) => {
      const fromState = getCardState(index, currentStep);
      const toState = getCardState(index, Math.min(currentStep + 1, totalIntervals));
      const state = interpolateState(fromState, toState, stepProgress);
      const isActive = Math.round(scaledProgress) === index;
      card.style.setProperty("--project-card-y", `${state.y.toFixed(2)}px`);
      card.style.setProperty("--project-card-z", `${state.z}px`);
      card.style.setProperty("--project-card-scale", state.scale.toFixed(3));
      card.style.setProperty("--project-card-rotate", `${state.rotate.toFixed(3)}deg`);
      card.style.zIndex = String((cards.length - index) * 10);
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-hidden", currentStep > index ? "true" : "false");
    });
  };

  const requestRender = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
  reducedMotionQuery.addEventListener?.("change", requestRender);
  desktopQuery.addEventListener?.("change", requestRender);

  render();
};

initWebdevProjectStack();
