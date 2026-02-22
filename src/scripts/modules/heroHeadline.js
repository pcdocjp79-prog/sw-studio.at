export const initHeroHeadlineFeature = () => {
  const heroHeadline = document.querySelector("[data-hero-headline]");
  const heroHeadlineReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroHeadlineAnimationStorageKey = "sws.heroHeadlineAnimated";
  
  const getHeroHeadlineAnimationState = () => {
    try {
      return window.sessionStorage.getItem(heroHeadlineAnimationStorageKey) === "1";
    } catch (_error) {
      return false;
    }
  };
  
  const setHeroHeadlineAnimationState = () => {
    try {
      window.sessionStorage.setItem(heroHeadlineAnimationStorageKey, "1");
    } catch (_error) {
      // sessionStorage may be unavailable in restricted environments.
    }
  };
  
  const setHeroHeadlineVariant = (headlineElement, variant) => {
    if (!headlineElement) return;
  
    const resolvedVariant = variant === "keywords" ? "keywords" : "stagger";
    headlineElement.dataset.activeVariant = resolvedVariant;
  
    headlineElement.querySelectorAll("[data-hero-variant]").forEach((variantElement) => {
      const isActive = variantElement.dataset.heroVariant === resolvedVariant;
      variantElement.classList.toggle("is-active", isActive);
      variantElement.setAttribute("aria-hidden", String(!isActive));
    });
  };
  
  const initHeroHeadline = () => {
    if (!heroHeadline) return;
  
    const configuredVariant = heroHeadline.dataset.heroMode === "keywords" ? "keywords" : "stagger";
    setHeroHeadlineVariant(heroHeadline, configuredVariant);
  
    if (configuredVariant !== "stagger") return;
  
    const shouldReduceMotion = heroHeadlineReducedMotionQuery.matches;
    const hasAnimatedAlready = getHeroHeadlineAnimationState();
  
    if (shouldReduceMotion || hasAnimatedAlready) {
      heroHeadline.classList.add("is-animated");
      setHeroHeadlineAnimationState();
      return;
    }
  
    const staggerVariant = heroHeadline.querySelector('[data-hero-variant="stagger"]');
    const heroLines = staggerVariant ? Array.from(staggerVariant.querySelectorAll(".hero-line")) : [];
  
    if (heroLines.length === 0) {
      heroHeadline.classList.add("is-animated");
      setHeroHeadlineAnimationState();
      return;
    }
  
    heroHeadline.classList.add("is-animating");
  
    let animationCompleted = false;
    const completeHeroHeadlineAnimation = () => {
      if (animationCompleted) return;
      animationCompleted = true;
      heroHeadline.classList.remove("is-animating");
      heroHeadline.classList.add("is-animated");
      setHeroHeadlineAnimationState();
    };
  
    heroLines[heroLines.length - 1].addEventListener("animationend", completeHeroHeadlineAnimation, { once: true });
    const sequenceDurationMs = (heroLines.length - 1) * 240 + 820;
    window.setTimeout(completeHeroHeadlineAnimation, sequenceDurationMs);
  };
  
  initHeroHeadline();
};

