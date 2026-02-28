export const initHero3DScrollEffects = () => {
  // Boundaries:
  // 1) Generic reveal observer for `.reveal-on-scroll`
  // 2) Hero background scroll-depth effect (blur/scale/offset)
  // 3) Hero card pointer tilt interaction
  // Scroll Observer
  const revealOnScrollElements = document.querySelectorAll(".reveal-on-scroll");
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
  
    revealOnScrollElements.forEach((el) => observer.observe(el));
  } else {
    revealOnScrollElements.forEach((el) => el.classList.add("is-visible"));
  }
  
  const scrollFocusSections = Array.from(document.querySelectorAll(".scroll-focus-section"));
  const heroStageForScrollFocus = document.querySelector("[data-hero-stage]");
  const firstScrollFocusSection = scrollFocusSections[0] || null;
  
  if (heroStageForScrollFocus) {
    document.body.classList.add("has-fixed-hero-bg");
  }
  
  const initScrollFocusEffect = () => {
    if (scrollFocusSections.length === 0) return;
  
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    let rafId = null;
  
    const setHeroScrollFocusVisuals = (
      frameBlur,
      frameOpacity,
      frameScale,
      frameShiftY,
      stageOpacity
    ) => {
      document.documentElement.style.setProperty("--hero-scroll-opacity", `${stageOpacity.toFixed(3)}`);
      document.documentElement.style.setProperty("--hero-frame-scroll-blur", `${frameBlur.toFixed(2)}px`);
      document.documentElement.style.setProperty("--hero-frame-scroll-opacity", `${frameOpacity.toFixed(3)}`);
      document.documentElement.style.setProperty("--hero-frame-scroll-scale", `${frameScale.toFixed(3)}`);
      document.documentElement.style.setProperty("--hero-frame-scroll-shift-y", `${frameShiftY.toFixed(2)}px`);
    };
  
    const getHeroBlurProgress = (viewportHeight) => {
      if (!firstScrollFocusSection) return 0;
  
      const sectionRect = firstScrollFocusSection.getBoundingClientRect();
      const startLine = viewportHeight;
      const endLine = viewportHeight * 0.16;
      const rawProgress = (startLine - sectionRect.top) / Math.max(startLine - endLine, 1);
      return Math.min(1, Math.max(0, rawProgress));
    };
  
    const updateScrollFocusState = () => {
      rafId = null;
  
      if (reducedMotion) {
        scrollFocusSections.forEach((section) => {
          section.classList.add("is-visible");
        });
  
        if (heroStageForScrollFocus) {
          setHeroScrollFocusVisuals(0, 1, 1, 0, 1);
        }
        return;
      }
  
      const viewportHeight = Math.max(window.innerHeight, 1);
  
      if (!heroStageForScrollFocus) return;
  
      const blurProgress = getHeroBlurProgress(viewportHeight);
      const depthProgress = Math.min(1, Math.max(0, Math.pow(blurProgress, 0.82)));
      const frameBlurAmount = 118 * depthProgress;
      const frameOpacity = Math.max(0.3, 1 - depthProgress * 0.58);
      const frameScale = Math.max(0.66, 1 - depthProgress * 0.34);
      const frameShiftY = -112 * depthProgress;
      const stageOpacity = Math.max(0.2, 1 - depthProgress * 0.64);
      setHeroScrollFocusVisuals(
        frameBlurAmount,
        frameOpacity,
        frameScale,
        frameShiftY,
        stageOpacity
      );
    };
  
    const queueScrollFocusUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(updateScrollFocusState);
    };
  
    if ("IntersectionObserver" in window) {
      const sectionRevealObserver = new IntersectionObserver(
        (entries, observerInstance) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -10% 0px",
        }
      );
  
      scrollFocusSections.forEach((section, index) => {
        section.style.setProperty("--scroll-focus-delay", `${Math.min(index * 90, 450)}ms`);
        sectionRevealObserver.observe(section);
      });
    } else {
      scrollFocusSections.forEach((section) => {
        section.classList.add("is-visible");
      });
    }
  
    const handleReducedMotionChange = (event) => {
      reducedMotion = event.matches;
      queueScrollFocusUpdate();
    };
  
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }
  
    window.addEventListener("scroll", queueScrollFocusUpdate, { passive: true });
    window.addEventListener("resize", queueScrollFocusUpdate);
    queueScrollFocusUpdate();
  };
  
  initScrollFocusEffect();
  
  // Hero 3D pointer interaction
  const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
  
  const initHeroStageInteraction = () => {
    const heroStageElement = document.querySelector("[data-hero-stage]");
    const heroStageCard = heroStageElement?.querySelector("[data-hero-stage-card]");
    if (!heroStageElement || !heroStageCard) return;
  
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maxTilt = 5;
    const pointerInfluence = 0.65;
    const lerpFactor = 0.1;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;
    let cardRect = null;
    let cardRectRafId = null;
    const usesFixedBackgroundLayer = document.body.classList.contains("has-fixed-hero-bg");

    const updateCardRect = () => {
      const rect = heroStageCard.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        cardRect = null;
        return;
      }
      cardRect = rect;
    };

    const requestCardRectUpdate = () => {
      if (cardRectRafId !== null) return;
      cardRectRafId = requestAnimationFrame(() => {
        updateCardRect();
        cardRectRafId = null;
      });
    };
  
    const setVisualState = (normalizedX, normalizedY) => {
      const pointerXPercent = ((normalizedX + 1) * 50).toFixed(2);
      const pointerYPercent = ((normalizedY + 1) * 50).toFixed(2);
      const rotateX = (-normalizedY * maxTilt).toFixed(2);
      const rotateY = (normalizedX * maxTilt).toFixed(2);
  
      heroStageElement.style.setProperty("--hero-stage-pointer-x", `${pointerXPercent}%`);
      heroStageElement.style.setProperty("--hero-stage-pointer-y", `${pointerYPercent}%`);
      heroStageElement.style.setProperty("--hero-stage-rotate-x", `${rotateX}deg`);
      heroStageElement.style.setProperty("--hero-stage-rotate-y", `${rotateY}deg`);
    };
  
    const renderTilt = () => {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      setVisualState(currentX, currentY);
  
      const settled =
        Math.abs(targetX - currentX) < 0.002 &&
        Math.abs(targetY - currentY) < 0.002;
  
      if (settled) {
        rafId = null;
        return;
      }
  
      rafId = requestAnimationFrame(renderTilt);
    };
  
    const queueRender = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(renderTilt);
    };
  
    const setPointerTarget = (event) => {
      if (!cardRect) {
        updateCardRect();
      }

      if (!cardRect) return;

      const relativeX = Math.max(0, Math.min(1, (event.clientX - cardRect.left) / cardRect.width));
      const relativeY = Math.max(0, Math.min(1, (event.clientY - cardRect.top) / cardRect.height));
      const normalizedX = relativeX * 2 - 1;
      const normalizedY = relativeY * 2 - 1;
  
      targetX = Math.max(-1, Math.min(1, normalizedX * pointerInfluence));
      targetY = Math.max(-1, Math.min(1, normalizedY * pointerInfluence));
      queueRender();
    };
  
    const resetTilt = (instant = false) => {
      targetX = 0;
      targetY = 0;
  
      if (!instant) {
        queueRender();
        return;
      }
  
      currentX = 0;
      currentY = 0;
      setVisualState(0, 0);
    };
  
    const canAnimate = () => supportsFinePointer && !reducedMotionQuery.matches;
  
    const handlePointerExit = () => {
      heroStageElement.classList.remove("is-interactive");
      resetTilt();
    };

    window.addEventListener("resize", requestCardRectUpdate);
    window.addEventListener("scroll", requestCardRectUpdate, { passive: true });

    if (usesFixedBackgroundLayer) {
      window.addEventListener(
        "pointermove",
        (event) => {
          if (!canAnimate()) return;
          heroStageElement.classList.add("is-interactive");
          setPointerTarget(event);
        },
        { passive: true }
      );
      window.addEventListener("pointerleave", handlePointerExit);
      window.addEventListener("blur", handlePointerExit);
    } else {
      heroStageElement.addEventListener("pointerenter", (event) => {
        if (!canAnimate()) return;
        updateCardRect();
        heroStageElement.classList.add("is-interactive");
        setPointerTarget(event);
      });
  
      heroStageElement.addEventListener("pointermove", (event) => {
        if (!heroStageElement.classList.contains("is-interactive")) return;
        setPointerTarget(event);
      });
  
      heroStageElement.addEventListener("pointerleave", handlePointerExit);
      heroStageElement.addEventListener("pointercancel", handlePointerExit);
    }
  
    const handleReducedMotionChange = (event) => {
      if (!event.matches) return;
      heroStageElement.classList.remove("is-interactive");
      resetTilt(true);
    };
  
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(handleReducedMotionChange);
    }

    updateCardRect();
    resetTilt(true);
  };
  
  initHeroStageInteraction();
};

