import { initNavigation } from "../scripts/modules/navigation.js";
import { initCookieConsent } from "../scripts/modules/cookieConsent.js";

document.documentElement.classList.add("js");

// Leave empty to keep the static background; set a valid .glb path to enable 3D mode.
const animatedBackgroundModelPath = "";

function initAnimatedBackground() {
  const backgroundContainer = document.getElementById("animated-background");
  if (!backgroundContainer) return;
  if (!animatedBackgroundModelPath) return;

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotionQuery.matches) return;

  if (!window.THREE || !window.THREE.GLTFLoader) return;

  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (_error) {
      return false;
    }
  })();

  if (!hasWebGL) return;

  const scene = new window.THREE.Scene();
  const camera = new window.THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );
  camera.position.set(0, 0, 5);

  const renderer = new window.THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  if ("outputColorSpace" in renderer && window.THREE.SRGBColorSpace) {
    renderer.outputColorSpace = window.THREE.SRGBColorSpace;
  }

  backgroundContainer.appendChild(renderer.domElement);

  const ambientLight = new window.THREE.AmbientLight(0xffffff, 1.35);
  const keyLight = new window.THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(2.1, 1.8, 3);
  const rimLight = new window.THREE.DirectionalLight(0x88b6ff, 0.65);
  rimLight.position.set(-2.6, -1.3, -1.8);
  scene.add(ambientLight, keyLight, rimLight);

  const loader = new window.THREE.GLTFLoader();
  const clock = new window.THREE.Clock();
  let model = null;
  let mixer = null;
  let frameId = null;
  let isRunning = false;

  const fitCameraToModel = (object3d) => {
    const bounds = new window.THREE.Box3().setFromObject(object3d);
    if (bounds.isEmpty()) return;

    const size = bounds.getSize(new window.THREE.Vector3());
    const center = bounds.getCenter(new window.THREE.Vector3());
    object3d.position.sub(center);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const fovRad = window.THREE.MathUtils.degToRad(camera.fov);
    const cameraDistance =
      maxDimension > 0
        ? (maxDimension / (2 * Math.tan(fovRad / 2))) * 1.35
        : 4;

    camera.position.set(0, maxDimension * 0.08, cameraDistance);
    camera.near = Math.max(cameraDistance / 100, 0.01);
    camera.far = Math.max(cameraDistance * 100, 120);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  };

  const render = () => {
    if (!isRunning) return;

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (model) {
      model.rotation.y += delta * 0.24;
      model.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.08;
    }

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(render);
  };

  const startRendering = () => {
    if (isRunning) return;
    isRunning = true;
    clock.getDelta();
    frameId = requestAnimationFrame(render);
  };

  const stopRendering = () => {
    isRunning = false;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  };

  loader.load(
    animatedBackgroundModelPath,
    (gltf) => {
      model = gltf.scene;
      fitCameraToModel(model);
      scene.add(model);

      if (Array.isArray(gltf.animations) && gltf.animations.length > 0) {
        mixer = new window.THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }

      document.body.classList.add("has-animated-bg");
      startRendering();
    },
    undefined,
    () => {
      stopRendering();
    }
  );

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopRendering();
    } else if (document.body.classList.contains("has-animated-bg")) {
      startRendering();
    }
  });

  const handleReduceMotionChange = (event) => {
    if (!event.matches) return;
    stopRendering();
    document.body.classList.remove("has-animated-bg");
  };

  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", handleReduceMotionChange);
  } else if (typeof reduceMotionQuery.addListener === "function") {
    reduceMotionQuery.addListener(handleReduceMotionChange);
  }
}

const initRevealOnScroll = () => {
  const revealOnScrollElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealOnScrollElements.length === 0) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
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

  const getHeroPhaseProgress = (viewportHeight) => {
    if (!firstScrollFocusSection) return null;

    const sectionRect = firstScrollFocusSection.getBoundingClientRect();
    const sectionTopRatio = sectionRect.top / Math.max(viewportHeight, 1);

    return {
      intro: getRangeProgress(sectionTopRatio, 0.96, 0.72),
      recede: getRangeProgress(sectionTopRatio, 0.72, 0.34),
      settle: getRangeProgress(sectionTopRatio, 0.34, 0.2),
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

    const viewportHeight = Math.max(window.innerHeight, 1);
    const heroPhaseProgress = getHeroPhaseProgress(viewportHeight);

    if (!heroPhaseProgress) {
      resetHeroScrollFocusVisuals();
      return;
    }

    const introProgress = easeInOutSine(heroPhaseProgress.intro);
    const recedeProgress = easeOutCubic(heroPhaseProgress.recede);
    const settleProgress = easeInOutSine(heroPhaseProgress.settle);

    let frameScale = interpolateNumber(1, 1.012, introProgress);
    frameScale = interpolateNumber(frameScale, 1.078, recedeProgress);
    frameScale = interpolateNumber(frameScale, 1.125, settleProgress);

    let frameShiftY = interpolateNumber(0, -3, introProgress);
    frameShiftY = interpolateNumber(frameShiftY, -12, recedeProgress);
    frameShiftY = interpolateNumber(frameShiftY, -18, settleProgress);

    let surfaceBlur = interpolateNumber(0, 1.6, introProgress);
    surfaceBlur = interpolateNumber(surfaceBlur, 15.5, recedeProgress);
    surfaceBlur = interpolateNumber(surfaceBlur, 23, settleProgress);

    let surfaceOpacity = interpolateNumber(1, 0.988, introProgress);
    surfaceOpacity = interpolateNumber(surfaceOpacity, 0.84, recedeProgress);
    surfaceOpacity = interpolateNumber(surfaceOpacity, 0.72, settleProgress);

    let contentShiftY = interpolateNumber(0, -2, introProgress);
    contentShiftY = interpolateNumber(contentShiftY, -10, recedeProgress);
    contentShiftY = interpolateNumber(contentShiftY, -14, settleProgress);

    let contentOpacity = interpolateNumber(1, 0.93, introProgress);
    contentOpacity = interpolateNumber(contentOpacity, 0.56, recedeProgress);
    contentOpacity = interpolateNumber(contentOpacity, 0.38, settleProgress);

    let contentBlur = interpolateNumber(0, 0.8, introProgress);
    contentBlur = interpolateNumber(contentBlur, 7.4, recedeProgress);
    contentBlur = interpolateNumber(contentBlur, 12, settleProgress);

    let borderOpacity = interpolateNumber(1, 0.72, introProgress);
    borderOpacity = interpolateNumber(borderOpacity, 0.16, recedeProgress);
    borderOpacity = interpolateNumber(borderOpacity, 0.02, settleProgress);

    let veilOpacity = interpolateNumber(0, 0.1, introProgress);
    veilOpacity = interpolateNumber(veilOpacity, 0.44, recedeProgress);
    veilOpacity = interpolateNumber(veilOpacity, 0.66, settleProgress);

    let stageOpacity = interpolateNumber(1, 0.995, introProgress);
    stageOpacity = interpolateNumber(stageOpacity, 0.89, recedeProgress);
    stageOpacity = interpolateNumber(stageOpacity, 0.82, settleProgress);

    let tiltDamping = interpolateNumber(1, 0.9, introProgress);
    tiltDamping = interpolateNumber(tiltDamping, 0.48, recedeProgress);
    tiltDamping = interpolateNumber(tiltDamping, 0.3, settleProgress);

    setHeroScrollFocusVisuals({
      stageOpacity,
      frameOpacity: 1,
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
  const loadingLabel =
    submitButton?.dataset.loadingLabel?.trim() || "Wird gesendet...";
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

  contactForm.addEventListener("submit", async (event) => {
    if (!endpoint) return;

    event.preventDefault();
    hideStatusMessage(successMessage);
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

      if (successHref) {
        window.location.href = successHref;
        return;
      }

      showStatusMessage(
        successMessage,
        "Vielen Dank, die Anfrage ist eingegangen.",
        { focus: true }
      );
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
    hideStatusMessage(successMessage);
    hideStatusMessage(errorMessage);
  });
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

const initFilterGroups = () => {
  const filterGroups = Array.from(document.querySelectorAll("[data-filter-group]"));
  if (filterGroups.length === 0) return;

  filterGroups.forEach((groupElement) => {
    const groupName = groupElement.getAttribute("data-filter-group");
    if (!groupName) return;

    const buttons = Array.from(
      groupElement.querySelectorAll("[data-filter-value]")
    );
    const items = Array.from(
      document.querySelectorAll(`[data-filter-item="${groupName}"]`)
    );

    if (buttons.length === 0 || items.length === 0) return;

    const setFilter = (value) => {
      const normalizedValue = value || "all";

      buttons.forEach((button) => {
        const isActive = button.getAttribute("data-filter-value") === normalizedValue;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      items.forEach((item) => {
        const categories = (item.getAttribute("data-category") || "")
          .split(/\s+/)
          .filter(Boolean);
        const matches =
          normalizedValue === "all" || categories.includes(normalizedValue);

        item.hidden = !matches;
        item.classList.toggle("is-hidden", !matches);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setFilter(button.getAttribute("data-filter-value"));
      });
    });

    setFilter(
      groupElement.getAttribute("data-filter-default") ||
        buttons[0]?.getAttribute("data-filter-value") ||
        "all"
    );
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

initAnimatedBackground();
initRevealOnScroll();
initScrollFocusEffect();
initNavigation();
initCookieConsent();
initCardLinks();
initContactForm();
initProjectIntentButtons();
initFilterGroups();
initHeroStageInteraction();
initJumpNav();
