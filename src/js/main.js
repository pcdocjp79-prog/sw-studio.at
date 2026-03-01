// Mark document as JS-enabled so CSS can apply progressive enhancement.
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
    (_error) => {
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

initAnimatedBackground();

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
    const depthProgress = Math.min(1, Math.max(0, Math.pow(blurProgress, 1.8)));
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

// Navigation Elements
const topNav = document.querySelector(".top-nav");
const glassNav = document.getElementById("glass-nav");
const mobileNavToggle = document.getElementById("mobile-nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const scrollToTopButton = document.getElementById("scroll-to-top");
const scrollToTopThreshold = 200;

let scrollToTopTicking = false;

const updateScrollToTopVisibility = () => {
  if (!scrollToTopButton) {
    scrollToTopTicking = false;
    return;
  }

  scrollToTopButton.classList.toggle("is-visible", window.scrollY > scrollToTopThreshold);
  scrollToTopTicking = false;
};

const requestScrollToTopFrame = () => {
  if (scrollToTopTicking) return;
  scrollToTopTicking = true;
  requestAnimationFrame(updateScrollToTopVisibility);
};

if (scrollToTopButton) {
  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateScrollToTopVisibility();

  window.addEventListener(
    "scroll",
    requestScrollToTopFrame,
    { passive: true }
  );

  window.addEventListener("resize", requestScrollToTopFrame);
}

// Keep navigation sticky and increase readability after small scroll

if (topNav) {
  let ticking = false;
  const topThreshold = 24;

  const updateTopNavScrollState = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    topNav.classList.toggle("is-scrolled", currentScrollY > topThreshold);
    ticking = false;
  };

  const requestTopNavStateUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateTopNavScrollState);
  };

  window.addEventListener(
    "scroll",
    requestTopNavStateUpdate,
    { passive: true }
  );
  window.addEventListener("resize", requestTopNavStateUpdate);

  updateTopNavScrollState();
}

// Mobile Navigation
if (glassNav && mobileNavToggle && primaryNav) {
  const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

  const setMobileNavState = (isOpen) => {
    const open = Boolean(isOpen) && mobileBreakpoint.matches;
    glassNav.classList.toggle("is-mobile-open", open);

    mobileNavToggle.setAttribute("aria-expanded", String(open));

    if (mobileBreakpoint.matches) {
      primaryNav.setAttribute("aria-hidden", String(!open));
    } else {
      primaryNav.removeAttribute("aria-hidden");
    }
  };

  mobileNavToggle.addEventListener("click", () => {
    const isOpen = glassNav.classList.contains("is-mobile-open");
    setMobileNavState(!isOpen);
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileBreakpoint.matches) return;
      setMobileNavState(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileBreakpoint.matches) return;
    if (!glassNav.contains(event.target)) {
      setMobileNavState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileNavState(false);
    }
  });

  const syncWithBreakpoint = () => {
    if (mobileBreakpoint.matches) {
      const isOpen = glassNav.classList.contains("is-mobile-open");
      mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
      primaryNav.setAttribute("aria-hidden", String(!isOpen));
      return;
    }

    setMobileNavState(false);
  };

  syncWithBreakpoint();
  if (typeof mobileBreakpoint.addEventListener === "function") {
    mobileBreakpoint.addEventListener("change", syncWithBreakpoint);
  } else if (typeof mobileBreakpoint.addListener === "function") {
    mobileBreakpoint.addListener(syncWithBreakpoint);
  }
}

const navSectionLinks = primaryNav
  ? Array.from(primaryNav.querySelectorAll("[data-nav-section]"))
  : [];

const setActiveNavSectionLink = (sectionId) => {
  if (!sectionId) return;

  navSectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (navSectionLinks.length > 0) {
  const navSectionTargets = navSectionLinks
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      const sectionId = href.slice(1);
      let sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return null;

      if (sectionId === "kontakt" && sectionElement.offsetHeight <= 1) {
        const footerElement = document.getElementById("site-footer");
        if (footerElement) {
          sectionElement = footerElement;
        }
      }

      return { id: sectionId, element: sectionElement };
    })
    .filter((entry) => Boolean(entry));
  const sectionIdsByElement = new Map(
    navSectionTargets.map((entry) => [entry.element, entry.id])
  );

  const validSectionIds = new Set(navSectionTargets.map((entry) => entry.id));
  const initialHashId = (window.location.hash || "").replace(/^#/, "");
  const initialActiveSectionId = validSectionIds.has(initialHashId)
    ? initialHashId
    : navSectionTargets[0]?.id;

  if (initialActiveSectionId) {
    setActiveNavSectionLink(initialActiveSectionId);
  }

  navSectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      setActiveNavSectionLink(href.slice(1));
    });
  });

  if ("IntersectionObserver" in window && navSectionTargets.length > 0) {
    let currentActiveSectionId = initialActiveSectionId || navSectionTargets[0].id;

    const navSectionObserver = new IntersectionObserver(
      (entries) => {
        let nextActive = null;
        let bestRatio = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const resolvedId = sectionIdsByElement.get(entry.target);
          if (!resolvedId) return;
          if (entry.intersectionRatio <= bestRatio) return;
          bestRatio = entry.intersectionRatio;
          nextActive = resolvedId;
        });

        if (!nextActive || nextActive === currentActiveSectionId) return;
        currentActiveSectionId = nextActive;
        setActiveNavSectionLink(nextActive);
      },
      {
        rootMargin: "-36% 0px -48% 0px",
        threshold: [0.18, 0.34, 0.52, 0.68],
      }
    );

    navSectionTargets.forEach((entry) => {
      navSectionObserver.observe(entry.element);
    });
  }
}

const cardLinkTargets = Array.from(document.querySelectorAll("[data-card-link]"));

if (cardLinkTargets.length > 0) {
  const shouldIgnoreCardLinkClick = (target) =>
    Boolean(target?.closest("a, button, input, textarea, select, summary"));

  const navigateToCardLink = (cardElement) => {
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
}

const initContactForm = () => {
  const contactForm = document.querySelector("[data-contact-form]");
  if (!contactForm) return;

  const successMessage = document.querySelector("[data-contact-success]");
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

initContactForm();


// Hero pointer interaction
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

