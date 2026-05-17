import { initNavigation } from "../scripts/modules/navigation.js";
import { initCookieConsent } from "../scripts/modules/cookieConsent.js";

document.documentElement.classList.add("js");

const SURFACE_REVEAL_SELECTOR = [
  ".approach-card",
  ".process-step",
  ".pkg-card",
  ".trust-strip__item",
  ".next-step-card",
  ".contact-aside",
  ".contact-form-shell",
  ".configurator-shell",
].join(", ");

const MEDIA_REVEAL_SELECTOR = [
  ".about-section__portrait-col",
  ".about-portrait",
  ".about-portrait__frame",
  ".about-portrait__img",
].join(", ");

const REVEAL_COMPLETE_SELECTOR = [
  ".reveal-on-scroll--surface",
  ".reveal-on-scroll--media",
  ".about-block.reveal-on-scroll",
].join(", ");

const parseCssTimeToMs = (value) => {
  const normalizedValue = value.trim();
  if (!normalizedValue) return 0;
  if (normalizedValue.endsWith("ms")) {
    return Number.parseFloat(normalizedValue);
  }
  if (normalizedValue.endsWith("s")) {
    return Number.parseFloat(normalizedValue) * 1000;
  }
  return Number.parseFloat(normalizedValue) || 0;
};

const initRevealOnScroll = () => {
  const revealOnScrollElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealOnScrollElements.length === 0) return;

  revealOnScrollElements.forEach((element) => {
    if (
      element.matches(MEDIA_REVEAL_SELECTOR) ||
      element.querySelector(MEDIA_REVEAL_SELECTOR)
    ) {
      element.classList.add("reveal-on-scroll--media");
      return;
    }

    if (
      element.matches(SURFACE_REVEAL_SELECTOR) ||
      element.querySelector(SURFACE_REVEAL_SELECTOR)
    ) {
      element.classList.add("reveal-on-scroll--surface");
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const { target } = entry;
          target.classList.add("is-visible");

          if (target.matches(REVEAL_COMPLETE_SELECTOR)) {
            const computedStyle = window.getComputedStyle(target);
            const revealDelayMs = parseCssTimeToMs(
              computedStyle.getPropertyValue("--reveal-delay")
            );
            const revealDurationMs = parseCssTimeToMs(
              computedStyle.getPropertyValue("--reveal-duration")
            );

            window.setTimeout(() => {
              target.classList.add("is-reveal-complete");
            }, revealDelayMs + revealDurationMs + 140);
          }

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealOnScrollElements.forEach((element) => observer.observe(element));
    return;
  }

  revealOnScrollElements.forEach((element) => element.classList.add("is-visible"));
};

const clampNumber = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const interpolateNumber = (start, end, progress) =>
  start + (end - start) * clampNumber(progress);

const easeOutCubic = (value) => 1 - Math.pow(1 - clampNumber(value), 3);

const easeInOutSine = (value) => -(Math.cos(Math.PI * clampNumber(value)) - 1) / 2;

const getRangeProgress = (current, start, end) => {
  const distance = Math.max(Math.abs(start - end), 0.0001);
  return clampNumber((start - current) / distance);
};

const initScrollFocusEffect = () => {
  const scrollFocusSections = Array.from(document.querySelectorAll(".scroll-focus-section"));
  if (scrollFocusSections.length === 0) return;

  const heroStageForScrollFocus = document.querySelector("[data-hero-stage]");
  const firstScrollFocusSection = scrollFocusSections[0] || null;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopHeroEffectsQuery = window.matchMedia("(min-width: 901px)");
  const heroScrollActivationThreshold = 18;
  let reducedMotion = reducedMotionQuery.matches;
  let rafId = null;

  if (heroStageForScrollFocus) {
    document.body.classList.add("has-fixed-hero-bg");
  }

  const setHeroScrollFocusVisuals = ({
    stageOpacity = 1,
    frameOpacity = 1,
    frameScale = 1,
    frameShiftY = 0,
    surfaceBlur = 0,
    surfaceOpacity = 1,
    contentShiftY = 0,
    contentOpacity = 1,
    contentBlur = 0,
    borderOpacity = 1,
    veilOpacity = 0,
    tiltDamping = 1,
  }) => {
    const targetStyle = heroStageForScrollFocus?.style || document.documentElement.style;
    targetStyle.setProperty("--hero-scroll-opacity", `${stageOpacity.toFixed(3)}`);
    targetStyle.setProperty("--hero-frame-scroll-opacity", `${frameOpacity.toFixed(3)}`);
    targetStyle.setProperty("--hero-frame-scroll-scale", `${frameScale.toFixed(3)}`);
    targetStyle.setProperty("--hero-frame-scroll-shift-y", `${frameShiftY.toFixed(2)}px`);
    targetStyle.setProperty("--hero-surface-scroll-blur", `${surfaceBlur.toFixed(2)}px`);
    targetStyle.setProperty("--hero-surface-scroll-opacity", `${surfaceOpacity.toFixed(3)}`);
    targetStyle.setProperty("--hero-content-scroll-y", `${contentShiftY.toFixed(2)}px`);
    targetStyle.setProperty("--hero-content-scroll-opacity", `${contentOpacity.toFixed(3)}`);
    targetStyle.setProperty("--hero-content-scroll-blur", `${contentBlur.toFixed(2)}px`);
    targetStyle.setProperty("--hero-border-scroll-opacity", `${borderOpacity.toFixed(3)}`);
    targetStyle.setProperty("--hero-veil-scroll-opacity", `${veilOpacity.toFixed(3)}`);
    targetStyle.setProperty("--hero-tilt-damping", `${tiltDamping.toFixed(3)}`);
  };

  const resetHeroScrollFocusVisuals = () => {
    setHeroScrollFocusVisuals({
      stageOpacity: 1,
      frameOpacity: 1,
      frameScale: 1,
      frameShiftY: 0,
      surfaceBlur: 0,
      surfaceOpacity: 1,
      contentShiftY: 0,
      contentOpacity: 1,
      contentBlur: 0,
      borderOpacity: 1,
      veilOpacity: 0,
      tiltDamping: 1,
    });
  };

  const shouldEnhanceHeroScroll = () =>
    Boolean(heroStageForScrollFocus) &&
    desktopHeroEffectsQuery.matches &&
    !reducedMotion;

  const shouldHoldHeroAtRest = () =>
    window.scrollY <= heroScrollActivationThreshold;

  const getHeroPhaseProgress = (viewportHeight) => {
    if (!firstScrollFocusSection) return null;

    const sectionRect = firstScrollFocusSection.getBoundingClientRect();
    const sectionTopRatio = sectionRect.top / Math.max(viewportHeight, 1);

    return {
      intro: getRangeProgress(sectionTopRatio, 0.96, 0.82),
      recede: getRangeProgress(sectionTopRatio, 0.82, 0.66),
      settle: getRangeProgress(sectionTopRatio, 0.66, 0.58),
    };
  };

  const updateScrollFocusState = () => {
    rafId = null;

    if (!shouldEnhanceHeroScroll()) {
      scrollFocusSections.forEach((section) => {
        section.classList.add("is-visible");
      });
      resetHeroScrollFocusVisuals();
      return;
    }

    if (shouldHoldHeroAtRest()) {
      resetHeroScrollFocusVisuals();
      return;
    }

    const viewportHeight = Math.max(window.innerHeight, 1);
    const heroPhaseProgress = getHeroPhaseProgress(viewportHeight);

    if (!heroPhaseProgress) {
      resetHeroScrollFocusVisuals();
      return;
    }

    const introProgress = heroPhaseProgress.intro;
    const recedeProgress = heroPhaseProgress.recede;
    const settleProgress = heroPhaseProgress.settle;

    let frameScale = interpolateNumber(1, 1.012, introProgress);
    frameScale = interpolateNumber(frameScale, 1.078, recedeProgress);
    frameScale = interpolateNumber(frameScale, 1.125, settleProgress);

    let frameShiftY = interpolateNumber(0, -3, introProgress);
    frameShiftY = interpolateNumber(frameShiftY, -12, recedeProgress);
    frameShiftY = interpolateNumber(frameShiftY, -18, settleProgress);

    const frameOpacity = 1;

    const surfaceBlur = 0;
    let surfaceOpacity = interpolateNumber(1, 0.96, introProgress);
    surfaceOpacity = interpolateNumber(surfaceOpacity, 0.74, recedeProgress);
    surfaceOpacity = interpolateNumber(surfaceOpacity, 0.5, settleProgress);

    let contentShiftY = interpolateNumber(0, -2, introProgress);
    contentShiftY = interpolateNumber(contentShiftY, -10, recedeProgress);
    contentShiftY = interpolateNumber(contentShiftY, -14, settleProgress);

    const contentBlur = 0;
    let contentOpacity = interpolateNumber(1, 0.85, introProgress);
    contentOpacity = interpolateNumber(contentOpacity, 0.35, recedeProgress);
    contentOpacity = interpolateNumber(contentOpacity, 0, settleProgress);

    let borderOpacity = interpolateNumber(1, 0.92, introProgress);
    borderOpacity = interpolateNumber(borderOpacity, 0.68, recedeProgress);
    borderOpacity = interpolateNumber(borderOpacity, 0.5, settleProgress);

    const veilOpacity = 0;

    const stageOpacity = 1;

    let tiltDamping = interpolateNumber(1, 0.9, introProgress);
    tiltDamping = interpolateNumber(tiltDamping, 0.48, recedeProgress);
    tiltDamping = interpolateNumber(tiltDamping, 0.3, settleProgress);

    setHeroScrollFocusVisuals({
      stageOpacity,
      frameOpacity,
      frameScale,
      frameShiftY,
      surfaceBlur,
      surfaceOpacity,
      contentShiftY,
      contentOpacity,
      contentBlur,
      borderOpacity,
      veilOpacity,
      tiltDamping,
    });
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
      section.style.setProperty("--scroll-focus-delay", `${Math.min(index * 70, 280)}ms`);
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

  const handleHeroBreakpointChange = () => {
    queueScrollFocusUpdate();
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleReducedMotionChange);
  }

  if (typeof desktopHeroEffectsQuery.addEventListener === "function") {
    desktopHeroEffectsQuery.addEventListener("change", handleHeroBreakpointChange);
  } else if (typeof desktopHeroEffectsQuery.addListener === "function") {
    desktopHeroEffectsQuery.addListener(handleHeroBreakpointChange);
  }

  window.addEventListener("scroll", queueScrollFocusUpdate, { passive: true });
  window.addEventListener("resize", queueScrollFocusUpdate);
  window.addEventListener("pageshow", queueScrollFocusUpdate);
  window.addEventListener("load", queueScrollFocusUpdate, { once: true });
  queueScrollFocusUpdate();
};

const initCardLinks = () => {
  const cardLinkTargets = Array.from(document.querySelectorAll("[data-card-link]"));
  if (cardLinkTargets.length === 0) return;

  const shouldIgnoreCardLinkClick = (target) =>
    Boolean(target?.closest("a, button, input, textarea, select, summary, label"));

  const navigateToCardLink = (cardElement) => {
    if (cardElement.hidden) return;

    const targetUrl = cardElement.getAttribute("data-card-link");
    if (!targetUrl) return;
    window.location.href = targetUrl;
  };

  cardLinkTargets.forEach((cardElement) => {
    cardElement.style.cursor = "pointer";

    cardElement.addEventListener("click", (event) => {
      if (event.defaultPrevented) return;
      if (shouldIgnoreCardLinkClick(event.target)) return;
      navigateToCardLink(cardElement);
    });

    cardElement.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      navigateToCardLink(cardElement);
    });
  });
};

const CONTACT_SUCCESS_STORAGE_KEY = "sws-contact-form-success";

const initContactForm = () => {
  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) return;

  const successMessage = document.querySelector("[data-contact-success]");
  const errorMessage = document.querySelector("[data-contact-error]");
  const submitButton = contactForm.querySelector('[type="submit"]');
  const successHref =
    contactForm.dataset.successHref?.trim() ||
    document.body?.dataset.contactSuccessPath?.trim() ||
    "";
  const endpoint = (contactForm.getAttribute("action") || "").trim();
  const defaultSubmitLabel = submitButton?.textContent?.trim() || "";
  const defaultSuccessText =
    successMessage?.textContent?.trim() ||
    "Ich pruefe deine Anfrage und melde mich mit einer ehrlichen Einschaetzung zum naechsten sinnvollen Schritt.";
  const loadingLabel =
    submitButton?.dataset.loadingLabel?.trim() || "Wird gesendet...";
  const hasStoredSuccessState = () => {
    try {
      return window.localStorage.getItem(CONTACT_SUCCESS_STORAGE_KEY) === "true";
    } catch (_error) {
      return false;
    }
  };
  const storeSuccessState = () => {
    try {
      window.localStorage.setItem(CONTACT_SUCCESS_STORAGE_KEY, "true");
    } catch (_error) {
      // Ignore storage access issues; the inline success state still works.
    }
  };
  const setSubmittingState = (isSubmitting) => {
    contactForm.setAttribute("aria-busy", String(isSubmitting));

    if (!submitButton) return;

    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting
      ? loadingLabel
      : defaultSubmitLabel || submitButton.textContent;
  };
  const hideStatusMessage = (messageElement) => {
    if (!messageElement || messageElement.hidden) return;
    messageElement.hidden = true;
  };
  const showStatusMessage = (messageElement, messageText, { focus = false } = {}) => {
    if (!messageElement) return;

    messageElement.textContent = messageText;
    messageElement.hidden = false;

    if (focus) {
      messageElement.focus({ preventScroll: true });
    }
  };

  if (hasStoredSuccessState()) {
    showStatusMessage(successMessage, defaultSuccessText);
  }

  contactForm.addEventListener("submit", async (event) => {
    if (!endpoint) return;

    event.preventDefault();
    hideStatusMessage(errorMessage);

    if (!contactForm.checkValidity()) {
      showStatusMessage(
        errorMessage,
        "Bitte fuelle mindestens die Pflichtfelder Name und E-Mail korrekt aus."
      );
      contactForm.reportValidity();
      return;
    }

    setSubmittingState(true);

    try {
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      let responseData = null;

      try {
        responseData = await response.json();
      } catch (_error) {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          responseData?.error ||
            "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es spaeter erneut."
        );
      }

      contactForm.reset();
      storeSuccessState();
      showStatusMessage(successMessage, defaultSuccessText, { focus: true });

      if (successHref) {
        window.location.href = successHref;
        return;
      }
    } catch (error) {
      showStatusMessage(
        errorMessage,
        error instanceof Error && error.message
          ? error.message
          : "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es spaeter erneut.",
        { focus: true }
      );
    } finally {
      setSubmittingState(false);
    }
  });

  contactForm.addEventListener("input", () => {
    hideStatusMessage(errorMessage);
  });
};

const initContactFormAnchorScroll = () => {
  const contactSection = document.getElementById("kontaktformular");
  const contactFormShell = contactSection?.querySelector(".contact-form-shell");
  const scrollTarget = contactFormShell || contactSection;
  if (!scrollTarget) return;

  const scrollToForm = (behavior = "smooth") => {
    scrollTarget.scrollIntoView({ behavior, block: "center" });
  };

  const isContactFormHref = (href) => {
    if (!href) return false;

    try {
      const targetUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      return (
        targetUrl.hash === "#kontaktformular" &&
        targetUrl.origin === currentUrl.origin &&
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search
      );
    } catch (_error) {
      return href === "#kontaktformular";
    }
  };

  document.querySelectorAll('a[href*="#kontaktformular"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!isContactFormHref(href)) return;

      event.preventDefault();
      window.history.pushState(null, "", "#kontaktformular");
      scrollToForm();
    });
  });

  if (window.location.hash === "#kontaktformular") {
    window.requestAnimationFrame(() => scrollToForm("auto"));
  }
};

const CONTACT_PREFILL_STORAGE_KEY = "sws-contact-prefill";

const initProjectIntentButtons = () => {
  const projectTypeField = document.querySelector('[name="projectType"]');
  const timelineField = document.querySelector('[name="timeline"]');
  const messageField = document.querySelector('[name="message"]');
  const supportedButtons = Array.from(document.querySelectorAll("[data-prefill-project]"));
  const readStoredPrefill = () => {
    try {
      const rawValue = window.sessionStorage.getItem(CONTACT_PREFILL_STORAGE_KEY);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (_error) {
      return null;
    }
  };
  const writeStoredPrefill = (payload) => {
    try {
      window.sessionStorage.setItem(
        CONTACT_PREFILL_STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch (_error) {
      // Ignore storage access issues and keep the default navigation flow.
    }
  };
  const clearStoredPrefill = () => {
    try {
      window.sessionStorage.removeItem(CONTACT_PREFILL_STORAGE_KEY);
    } catch (_error) {
      // Ignore storage access issues and keep the default navigation flow.
    }
  };
  const applyPrefillPayload = (payload) => {
    if (!payload || typeof payload !== "object") return;

    if (projectTypeField && payload.projectValue) {
      projectTypeField.value = payload.projectValue;
    }

    if (timelineField && payload.timelineValue) {
      timelineField.value = payload.timelineValue;
    }

    if (messageField && payload.messageValue && !messageField.value) {
      messageField.value = payload.messageValue;
    }
  };
  const isSamePageHref = (href) => {
    if (!href || href.startsWith("#")) return true;

    try {
      const targetUrl = new URL(href, window.location.href);
      const currentUrl = new URL(window.location.href);
      return (
        targetUrl.origin === currentUrl.origin &&
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search
      );
    } catch (_error) {
      return false;
    }
  };

  if (projectTypeField) {
    applyPrefillPayload(readStoredPrefill());
    clearStoredPrefill();
  }

  if (supportedButtons.length === 0) return;

  supportedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const payload = {
        projectValue: button.getAttribute("data-prefill-project") || "",
        timelineValue: button.getAttribute("data-prefill-timeline") || "",
        messageValue: button.getAttribute("data-prefill-message") || "",
      };
      const targetId = button.getAttribute("data-prefill-target");
      const targetElement = targetId ? document.getElementById(targetId) : projectTypeField;
      const buttonHref = button.getAttribute("href") || "";
      const canApplyInPlace = Boolean(projectTypeField) && isSamePageHref(buttonHref);

      if (!canApplyInPlace && payload.projectValue) {
        writeStoredPrefill(payload);
        return;
      }

      applyPrefillPayload(payload);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        const focusTarget = targetElement.matches("input, textarea, select, button")
          ? targetElement
          : targetElement.querySelector("input, textarea, select, button");

        focusTarget?.focus({ preventScroll: true });
      }
    });
  });
};

const initHeroStageInteraction = () => {
  const heroStageElement = document.querySelector("[data-hero-stage]");
  const heroStageCard = heroStageElement?.querySelector("[data-hero-stage-card]");
  if (!heroStageElement || !heroStageCard) return;

  const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopTiltQuery = window.matchMedia("(min-width: 1024px)");
  const maxTilt = 4;
  const pointerInfluence = 0.58;
  const lerpFactor = 0.1;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;
  let cardRect = null;
  let cardRectRafId = null;
  let heroIsActive = true;
  const usesFixedBackgroundLayer = document.body.classList.contains("has-fixed-hero-bg");

  const canAnimate = () =>
    supportsFinePointer &&
    !reducedMotionQuery.matches &&
    desktopTiltQuery.matches &&
    heroIsActive;

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

  const handlePointerExit = () => {
    heroStageElement.classList.remove("is-interactive");
    resetTilt();
  };

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        const nextEntry = entries[0];
        heroIsActive = Boolean(nextEntry?.isIntersecting);
        if (!heroIsActive) {
          handlePointerExit();
        }
      },
      {
        threshold: 0.24,
      }
    );

    heroObserver.observe(heroStageElement);
  }

  window.addEventListener("resize", requestCardRectUpdate);
  window.addEventListener("scroll", requestCardRectUpdate, { passive: true });

  if (usesFixedBackgroundLayer) {
    const heroTiltScrollGate = 32;
    window.addEventListener(
      "pointermove",
      (event) => {
        if (!canAnimate()) return;
        if (heroStageElement.classList.contains("animate-enter")) {
          handlePointerExit();
          return;
        }
        if (window.scrollY > heroTiltScrollGate) {
          handlePointerExit();
          return;
        }
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

  const handleMotionPreferenceChange = () => {
    heroStageElement.classList.remove("is-interactive");
    resetTilt(true);
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionPreferenceChange);
  }

  if (typeof desktopTiltQuery.addEventListener === "function") {
    desktopTiltQuery.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof desktopTiltQuery.addListener === "function") {
    desktopTiltQuery.addListener(handleMotionPreferenceChange);
  }

  updateCardRect();
  resetTilt(true);
};

const initHeroStageIntro = () => {
  const heroStageElement = document.querySelector("[data-hero-stage].animate-enter");
  const heroStageCard = heroStageElement?.querySelector("[data-hero-stage-card]");
  if (!heroStageElement || !heroStageCard) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let introIsFinished = false;
  let introHasStarted = false;
  let introStartTimeoutId = null;
  let introFinishTimeoutId = null;

  // Reload/Anchor/Back-Nav mid-page: Intro überspringen, damit Scroll-Blur sofort greift.
  // Wird mehrfach aufgerufen, weil Browser-Scroll-Restoration je nach Cache-Zustand
  // erst nach Script-Ausführung passiert (typisch bei F5 mit Cache und bfcache).
  const skipIntroIfMidPage = () => {
    if (introIsFinished) return;
    if (window.scrollY <= 18) return;
    if (introStartTimeoutId !== null) {
      window.clearTimeout(introStartTimeoutId);
      introStartTimeoutId = null;
    }
    if (introFinishTimeoutId !== null) {
      window.clearTimeout(introFinishTimeoutId);
      introFinishTimeoutId = null;
    }
    heroStageElement.classList.remove("animate-enter", "is-intro-ready", "is-intro-active");
    heroStageElement.classList.add("is-intro-done");
    introIsFinished = true;
    window.dispatchEvent(new Event("scroll"));
  };

  skipIntroIfMidPage();
  if (introIsFinished) {
    window.addEventListener("pageshow", skipIntroIfMidPage);
    return;
  }

  window.addEventListener("pageshow", skipIntroIfMidPage);
  window.addEventListener("load", skipIntroIfMidPage, { once: true });

  heroStageElement.classList.add("is-intro-active");

  const releaseIntroLock = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        heroStageElement.classList.remove("is-intro-active");
      });
    });
  };

  const handleEarlyScroll = () => {
    if (window.scrollY > 18) finishIntro();
  };

  const finishIntro = () => {
    if (introIsFinished) return;
    introIsFinished = true;
    if (introStartTimeoutId !== null) {
      window.clearTimeout(introStartTimeoutId);
    }
    if (introFinishTimeoutId !== null) {
      window.clearTimeout(introFinishTimeoutId);
    }
    window.removeEventListener("scroll", handleEarlyScroll);
    heroStageElement.classList.remove("animate-enter", "is-intro-ready");
    heroStageElement.classList.add("is-intro-done");
    releaseIntroLock();
    window.dispatchEvent(new Event("scroll"));
  };

  window.addEventListener("scroll", handleEarlyScroll, { passive: true });

  const startIntro = () => {
    if (introHasStarted || introIsFinished) return;
    introHasStarted = true;
    heroStageElement.classList.add("is-intro-ready");
    window.setTimeout(() => {
      heroStageElement.classList.add("is-intro-done");
    }, 880);
    introFinishTimeoutId = window.setTimeout(finishIntro, 2600);
  };

  if (reducedMotionQuery.matches) {
    heroStageElement.classList.remove("animate-enter", "is-intro-ready", "is-intro-active");
    finishIntro();
    return;
  }

  const heroFontPromise =
    typeof document.fonts?.load === "function"
      ? Promise.allSettled([
          document.fonts.load('600 1em "Geist"'),
          document.fonts.load('400 1em "Inter"'),
        ])
      : Promise.resolve();

  introStartTimeoutId = window.setTimeout(startIntro, 150);

  heroFontPromise.then(() => {
    if (introIsFinished || introHasStarted) return;
    if (introStartTimeoutId !== null) {
      window.clearTimeout(introStartTimeoutId);
    }
    startIntro();
  });

  heroStageCard.addEventListener(
    "animationend",
    (event) => {
      if (event.animationName !== "heroStageCardIntro") return;
      finishIntro();
    },
    { once: true }
  );
};

function initJumpNav() {
  const nav = document.querySelector(".jump-nav--section");
  if (!nav) return;

  const topNav = document.querySelector(".top-nav");
  const placeholder = document.createElement("div");
  placeholder.className = "jump-nav__placeholder";
  placeholder.setAttribute("aria-hidden", "true");
  nav.before(placeholder);

  const links = [...nav.querySelectorAll(".jump-nav__link")];
  const sectionEntries = links
    .map((link) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return null;

      const section = document.querySelector(href);
      if (!(section instanceof HTMLElement)) return null;

      return {
        href,
        link,
        section,
      };
    })
    .filter(Boolean);

  if (sectionEntries.length === 0) return;

  let placeholderTop = 0;
  let navHeight = nav.offsetHeight;
  let ticking = false;

  const getTopNavBottom = () =>
    Math.max(topNav?.getBoundingClientRect().bottom || 0, 0);

  const refreshMeasurements = () => {
    placeholderTop = placeholder.getBoundingClientRect().top + window.scrollY;
    navHeight = nav.offsetHeight;
  };

  const syncSectionOffset = (topNavBottom) => {
    const dockedOffset = Math.max(topNavBottom - 4, 0);
    nav.style.setProperty("--jump-nav-section-top", `${dockedOffset}px`);
  };

  const syncPlaceholderHeight = () => {
    placeholder.style.height = nav.classList.contains("is-docked")
      ? `${navHeight}px`
      : "0px";
  };

  const updateDockedState = (topNavBottom) => {
    const threshold = placeholderTop - topNavBottom - 8;
    const shouldDock = window.scrollY >= threshold;

    if (nav.classList.contains("is-docked") !== shouldDock) {
      nav.classList.toggle("is-docked", shouldDock);
      navHeight = nav.offsetHeight;
    }

    syncPlaceholderHeight();
  };

  const getScrollOffset = (topNavBottom) => topNavBottom + navHeight + 8;

  const updateActiveLink = (topNavBottom) => {
    const offset = getScrollOffset(topNavBottom) + 8;
    let currentHref = sectionEntries[0]?.href || "";

    sectionEntries.forEach((entry) => {
      if (window.scrollY >= entry.section.offsetTop - offset) {
        currentHref = entry.href;
      }
    });

    sectionEntries.forEach((entry) => {
      entry.link.classList.toggle("is-active", entry.href === currentHref);
    });
  };

  const syncJumpNavState = () => {
    ticking = false;
    const topNavBottom = getTopNavBottom();
    syncSectionOffset(topNavBottom);
    updateDockedState(topNavBottom);
    updateActiveLink(topNavBottom);
  };

  const requestJumpNavSync = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(syncJumpNavState);
  };

  const refreshAndSyncJumpNav = () => {
    refreshMeasurements();
    requestJumpNavSync();
  };

  sectionEntries.forEach((entry) => {
    entry.link.addEventListener("click", (e) => {
      e.preventDefault();
      const topNavBottom = getTopNavBottom();
      const top =
        entry.section.getBoundingClientRect().top +
        window.scrollY -
        getScrollOffset(topNavBottom);

      window.scrollTo({ top, behavior: 'smooth' });
      sectionEntries.forEach((item) => {
        item.link.classList.toggle("is-active", item.href === entry.href);
      });
      history.replaceState(null, "", entry.href);
    });
  });

  refreshMeasurements();
  syncJumpNavState();
  window.addEventListener("scroll", requestJumpNavSync, { passive: true });
  window.addEventListener("resize", refreshAndSyncJumpNav);
  window.addEventListener("load", refreshAndSyncJumpNav, { once: true });
}

const initWebdevAuditCard = () => {
  const card = document.querySelector("[data-webdev-audit-card]");
  if (!card) return;

  const shell = card.closest(".webdev-audit-card-shell") || card;
  const scoreValue = card.querySelector("[data-webdev-audit-score]");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const targetScore = 100;
  const duration = 2000;
  let scoreStarted = false;
  let scoreFrameId = null;

  const getScoreColor = (score) => {
    if (score >= 100) return "#4ade80";
    if (score >= 60) return "#ffb84d";
    return "#ff5c7a";
  };

  const drawScore = (score) => {
    if (!scoreValue) return;
    const roundedScore = Math.round(score);
    scoreValue.textContent = String(roundedScore);
    scoreValue.parentElement?.style.setProperty("--audit-score-color", getScoreColor(roundedScore));
  };

  const animateScore = () => {
    if (!scoreValue || scoreStarted) return;
    scoreStarted = true;

    if (reducedMotionQuery.matches) {
      drawScore(targetScore);
      return;
    }

    let startTime = null;

    const step = (timestamp) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const progress = clampNumber(elapsed / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      drawScore(targetScore * easedProgress);

      if (progress < 1) {
        scoreFrameId = requestAnimationFrame(step);
        return;
      }

      drawScore(targetScore);
      scoreFrameId = null;
    };

    scoreFrameId = requestAnimationFrame(step);
  };

  drawScore(reducedMotionQuery.matches ? targetScore : 0);

  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    animateScore();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.setTimeout(animateScore, 360);
          observer.disconnect();
        });
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(shell);
  }

  const resetTilt = () => {
    card.classList.remove("is-tilting");
    card.style.setProperty("--audit-tilt-x", "0deg");
    card.style.setProperty("--audit-tilt-y", "0deg");
  };

  const canTilt = () => finePointerQuery.matches && !reducedMotionQuery.matches;

  card.addEventListener(
    "pointermove",
    (event) => {
      if (!canTilt()) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((event.clientY - centerY) / Math.max(rect.height / 2, 1)) * -7;
      const rotateY = ((event.clientX - centerX) / Math.max(rect.width / 2, 1)) * 7;

      card.classList.add("is-tilting");
      card.style.setProperty("--audit-tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--audit-tilt-y", `${rotateY.toFixed(2)}deg`);
    },
    { passive: true }
  );

  card.addEventListener("pointerleave", resetTilt);
  card.addEventListener("pointercancel", resetTilt);

  const handleMotionPreferenceChange = () => {
    if (scoreFrameId !== null) {
      cancelAnimationFrame(scoreFrameId);
      scoreFrameId = null;
    }

    if (reducedMotionQuery.matches) {
      drawScore(targetScore);
    }

    resetTilt();
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);
    finePointerQuery.addEventListener("change", resetTilt);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionPreferenceChange);
    finePointerQuery.addListener(resetTilt);
  }
};

const initWebdevQualityScores = () => {
  const root = document.querySelector("[data-webdev-quality]");
  if (!root) return;

  const metrics = Array.from(root.querySelectorAll(".webdev-quality__metric"));
  if (metrics.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = 1900;
  const flipResetDelay = 6000;
  const flipResetTimers = new WeakMap();

  const getScoreColor = (score) => {
    if (score >= 90) return "#19e28d";
    if (score >= 50) return "#ffb84d";
    return "#ff5c7a";
  };

  const drawMetric = (metric, score) => {
    const scoreValue = metric.querySelector("[data-score-value]");
    const progressCircle = metric.querySelector(".webdev-quality__progress");
    const targetScore = Number(metric.dataset.score || 100);
    const radius = Number(progressCircle?.getAttribute("r") || 50);
    const circumference = 2 * Math.PI * radius;
    const normalizedScore = clampNumber(score / 100);
    const color = getScoreColor(score);

    if (scoreValue) {
      scoreValue.textContent = String(Math.round(score));
      scoreValue.style.color = color;
    }

    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference * (1 - normalizedScore)}`;
      progressCircle.style.stroke = color;
    }

    if (Math.round(score) >= targetScore && scoreValue && progressCircle) {
      scoreValue.style.color = "#19e28d";
      progressCircle.style.stroke = "#19e28d";
    }
  };

  const animateMetric = (metric) => {
    const targetScore = Number(metric.dataset.score || 100);
    let startTime = null;

    const animate = (timestamp) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const progress = easeOutCubic(Math.min(elapsed / duration, 1));
      const currentScore = targetScore * progress;

      drawMetric(metric, currentScore);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
        return;
      }

      drawMetric(metric, targetScore);
    };

    const delay = parseCssTimeToMs(window.getComputedStyle(metric).getPropertyValue("--metric-delay"));
    window.setTimeout(() => requestAnimationFrame(animate), delay);
  };

  const startScores = () => {
    root.classList.add("is-animated");

    metrics.forEach((metric) => {
      const targetScore = Number(metric.dataset.score || 100);

      if (reducedMotion) {
        drawMetric(metric, targetScore);
        return;
      }

      drawMetric(metric, 0);
      animateMetric(metric);
    });
  };

  metrics.forEach((metric) => {
    const resetMetricFlip = () => {
      metric.classList.remove("is-flipped");
      metric.setAttribute("aria-pressed", "false");

      const existingTimer = flipResetTimers.get(metric);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
        flipResetTimers.delete(metric);
      }
    };

    const toggleMetric = () => {
      const isFlipped = !metric.classList.contains("is-flipped");

      if (!isFlipped) {
        resetMetricFlip();
        return;
      }

      metric.classList.add("is-flipped");
      metric.setAttribute("aria-pressed", String(isFlipped));

      const existingTimer = flipResetTimers.get(metric);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      const resetTimer = window.setTimeout(resetMetricFlip, flipResetDelay);
      flipResetTimers.set(metric, resetTimer);
    };

    metric.addEventListener("click", toggleMetric);
    metric.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleMetric();
    });
  });

  if ("IntersectionObserver" in window) {
    const flipResetObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) return;
          metrics.forEach((metric) => {
            metric.classList.remove("is-flipped");
            metric.setAttribute("aria-pressed", "false");

            const existingTimer = flipResetTimers.get(metric);
            if (existingTimer) {
              window.clearTimeout(existingTimer);
              flipResetTimers.delete(metric);
            }
          });
        });
      },
      {
        threshold: 0.08,
      }
    );

    flipResetObserver.observe(root);
  }

  if (reducedMotion || !("IntersectionObserver" in window)) {
    startScores();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        startScores();
        observer.disconnect();
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  observer.observe(root);
};

const initWebdevWhyCount = () => {
  const counters = Array.from(document.querySelectorAll("[data-webdev-why-count]"));
  if (counters.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = 1700;

  const drawCounter = (counter, score) => {
    const value = counter.querySelector("[data-count-value]");
    const progressCircle = counter.querySelector("[data-count-progress]");
    const radius = Number(progressCircle?.getAttribute("r") || 50);
    const circumference = 2 * Math.PI * radius;
    const normalizedScore = clampNumber(score / 100);

    if (value) {
      value.textContent = String(Math.round(score));
    }

    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference}`;
      progressCircle.style.strokeDashoffset = `${circumference * (1 - normalizedScore)}`;
    }
  };

  const animateCounter = (counter) => {
    const targetScore = Number(counter.dataset.score || 100);
    let startTime = null;

    const animate = (timestamp) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const progress = easeOutCubic(Math.min(elapsed / duration, 1));
      const currentScore = targetScore * progress;

      drawCounter(counter, currentScore);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
        return;
      }

      drawCounter(counter, targetScore);
    };

    requestAnimationFrame(animate);
  };

  const startCounter = (counter) => {
    if (counter.dataset.countStarted === "true") return;

    counter.dataset.countStarted = "true";
    const targetScore = Number(counter.dataset.score || 100);

    if (reducedMotion) {
      drawCounter(counter, targetScore);
      return;
    }

    drawCounter(counter, 0);
    animateCounter(counter);
  };

  counters.forEach((counter) => drawCounter(counter, 0));

  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach(startCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        startCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.45,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  counters.forEach((counter) => observer.observe(counter));
};

const initCodeClosingTypewriter = () => {
  const root = document.querySelector("[data-code-closing-typewriter]");
  if (!root) return;

  const lines = Array.from(root.querySelectorAll(".webdev-code-closing__line"));
  if (lines.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasStarted = false;

  if (reducedMotion) {
    root.classList.add("is-typewriter-ready");
    return;
  }

  const wrapTextNodes = (element) => {
    const childNodes = Array.from(element.childNodes);

    childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        const fragment = document.createDocumentFragment();

        Array.from(text).forEach((character) => {
          const characterSpan = document.createElement("span");
          characterSpan.className = "webdev-code-closing__char";
          characterSpan.textContent = character;
          fragment.appendChild(characterSpan);
        });

        element.replaceChild(fragment, node);
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        wrapTextNodes(node);
      }
    });
  };

  lines.forEach((line) => wrapTextNodes(line));

  const characters = Array.from(root.querySelectorAll(".webdev-code-closing__char"));
  const cursor = document.createElement("span");
  cursor.className = "webdev-code-closing__cursor";

  const startTyping = () => {
    if (hasStarted) return;
    hasStarted = true;
    root.classList.add("is-typewriter-ready");

    if (characters.length === 0) return;

    let characterIndex = 0;

    const typeNextCharacter = () => {
      const character = characters[characterIndex];

      if (!character) {
        return;
      }

      character.classList.add("is-visible");
      character.after(cursor);
      characterIndex += 1;

      if (characterIndex >= characters.length) {
        return;
      }

      let delay = 24 + Math.random() * 24;
      if ([".", ",", "!", "?"].includes(character.textContent || "")) {
        delay += 220;
      }

      window.setTimeout(typeNextCharacter, delay);
    };

    characters[0].before(cursor);
    window.setTimeout(typeNextCharacter, 280);
  };

  if (!("IntersectionObserver" in window)) {
    startTyping();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        startTyping();
        observer.disconnect();
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  observer.observe(root);
};

const initPageSpecificModules = () => {
  if (document.body?.dataset.page !== "webentwicklung") return;
  const configuratorRoot = document.querySelector("[data-configurator]");
  if (!configuratorRoot) return;

  import("./configurator.js")
    .then(({ initConfigurator }) => {
      initConfigurator(configuratorRoot);
    })
    .catch((error) => {
      console.error("Configurator module failed to load", error);
    });
};

initRevealOnScroll();
initScrollFocusEffect();
initHeroStageIntro();
initNavigation();
initCookieConsent();
initCardLinks();
initContactForm();
initContactFormAnchorScroll();
initProjectIntentButtons();
initHeroStageInteraction();
initJumpNav();
initWebdevAuditCard();
initWebdevQualityScores();
initWebdevWhyCount();
initCodeClosingTypewriter();
initPageSpecificModules();
