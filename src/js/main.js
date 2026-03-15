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

  const resetHeroScrollFocusVisuals = () => {
    setHeroScrollFocusVisuals(0, 1, 1, 0, 1);
  };

  const shouldEnhanceHeroScroll = () =>
    Boolean(heroStageForScrollFocus) &&
    desktopHeroEffectsQuery.matches &&
    !reducedMotion;

  const getHeroBlurProgress = (viewportHeight) => {
    if (!firstScrollFocusSection) return 0;

    const sectionRect = firstScrollFocusSection.getBoundingClientRect();
    const startLine = viewportHeight;
    const endLine = viewportHeight * 0.24;
    const rawProgress = (startLine - sectionRect.top) / Math.max(startLine - endLine, 1);
    return Math.min(1, Math.max(0, rawProgress));
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
    const blurProgress = getHeroBlurProgress(viewportHeight);
    const depthProgress = Math.min(1, Math.max(0, Math.pow(blurProgress, 1.55)));
    const frameBlurAmount = 54 * depthProgress;
    const frameOpacity = Math.max(0.66, 1 - depthProgress * 0.28);
    const frameScale = Math.max(0.88, 1 - depthProgress * 0.12);
    const frameShiftY = -46 * depthProgress;
    const stageOpacity = Math.max(0.76, 1 - depthProgress * 0.22);

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
  const successHref =
    contactForm.dataset.successHref?.trim() ||
    document.body?.dataset.contactSuccessPath?.trim() ||
    "";
  const hasConfiguredEndpoint = () =>
    (contactForm.getAttribute("action") || "").trim().length > 0;

  contactForm.addEventListener("submit", (event) => {
    if (hasConfiguredEndpoint()) return;

    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    contactForm.reset();

    if (successHref) {
      window.location.href = successHref;
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
      successMessage.focus({ preventScroll: true });
    }
  });

  contactForm.addEventListener("input", () => {
    if (!successMessage || successMessage.hidden) return;
    successMessage.hidden = true;
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
