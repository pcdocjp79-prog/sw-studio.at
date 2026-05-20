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

const setStyleProperty = (element, property, value) => {
  if (element.style.getPropertyValue(property) === value) return;
  element.style.setProperty(property, value);
};

const setAttributeValue = (element, attribute, value) => {
  if (element.getAttribute(attribute) === value) return;
  element.setAttribute(attribute, value);
};

const initWebdevProjectStack = () => {
  const root = document.querySelector("[data-webdev-project-stack]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll("[data-project-card]"));
  const cta = root.querySelector("[data-project-stack-cta]");
  if (cards.length < 2) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 900px)");
  let rafId = null;
  let measureRafId = null;
  let sectionTop = 0;
  let scrollableDistance = 1;

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

    if (cta) {
      cta.style.removeProperty("--project-cta-opacity");
      cta.style.removeProperty("--project-cta-y");
      cta.style.removeProperty("--project-cta-scale");
      cta.style.removeProperty("--project-cta-events");
      cta.classList.remove("is-visible");
      cta.removeAttribute("aria-hidden");
    }
  };

  const refreshMeasurements = () => {
    measureRafId = null;
    const sectionRect = root.getBoundingClientRect();
    sectionTop = sectionRect.top + window.scrollY;
    scrollableDistance = Math.max(root.offsetHeight - window.innerHeight, 1);
    requestRender();
  };

  const requestMeasurementRefresh = () => {
    if (measureRafId !== null) return;
    measureRafId = window.requestAnimationFrame(refreshMeasurements);
  };

  const render = () => {
    rafId = null;

    if (reducedMotionQuery.matches || !desktopQuery.matches) {
      resetCards();
      return;
    }

    const progress = clamp((window.scrollY - sectionTop) / scrollableDistance);
    const totalIntervals = cards.length;
    const scaledProgress = progress * totalIntervals;
    const currentStep = Math.min(Math.floor(scaledProgress), totalIntervals);
    const stepProgress = clamp(scaledProgress - currentStep);

    cards.forEach((card, index) => {
      const fromState = getCardState(index, currentStep);
      const toState = getCardState(index, Math.min(currentStep + 1, totalIntervals));
      const state = interpolateState(fromState, toState, stepProgress);
      const isActive = Math.round(scaledProgress) === index;
      setStyleProperty(card, "--project-card-y", `${state.y.toFixed(2)}px`);
      setStyleProperty(card, "--project-card-z", `${state.z}px`);
      setStyleProperty(card, "--project-card-scale", state.scale.toFixed(3));
      setStyleProperty(card, "--project-card-rotate", `${state.rotate.toFixed(3)}deg`);
      setStyleProperty(card, "z-index", String((cards.length - index) * 10));
      card.classList.toggle("is-active", isActive);
      setAttributeValue(card, "aria-hidden", currentStep > index ? "true" : "false");
    });

    if (cta) {
      const ctaProgress = clamp(scaledProgress - (cards.length - 1));
      const ctaVisible = ctaProgress > 0.05;

      setStyleProperty(cta, "--project-cta-opacity", ctaProgress.toFixed(3));
      setStyleProperty(cta, "--project-cta-y", `${((1 - ctaProgress) * 22).toFixed(2)}px`);
      setStyleProperty(cta, "--project-cta-scale", (0.97 + ctaProgress * 0.03).toFixed(3));
      cta.classList.toggle("is-visible", ctaVisible);
      setAttributeValue(cta, "aria-hidden", ctaVisible ? "false" : "true");
    }
  };

  const requestRender = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestMeasurementRefresh);
  window.addEventListener("load", requestMeasurementRefresh, { once: true });
  reducedMotionQuery.addEventListener?.("change", requestMeasurementRefresh);
  desktopQuery.addEventListener?.("change", requestMeasurementRefresh);

  refreshMeasurements();
};

initWebdevProjectStack();
