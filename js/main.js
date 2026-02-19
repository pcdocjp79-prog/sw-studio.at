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

// Scroll-driven background parallax (slower than page scroll)
const root = document.documentElement;
const backgroundParallaxFactor = 0.2;
let bgPanTicking = false;

const updateBackgroundPan = () => {
  const parallaxOffset = -window.scrollY * backgroundParallaxFactor;
  root.style.setProperty("--bg-parallax-offset", `${parallaxOffset.toFixed(2)}px`);
  bgPanTicking = false;
};

const requestBackgroundPanFrame = () => {
  if (bgPanTicking) return;
  bgPanTicking = true;
  requestAnimationFrame(updateBackgroundPan);
};

updateBackgroundPan();

window.addEventListener(
  "scroll",
  requestBackgroundPanFrame,
  { passive: true }
);

window.addEventListener("resize", () => {
  requestBackgroundPanFrame();
});

window.addEventListener("load", () => {
  requestBackgroundPanFrame();
});

// Navigation Elements
const topNav = document.querySelector(".top-nav");
const glassNav = document.getElementById("glass-nav");
const brandLink = document.querySelector(".brand-link");
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

if (brandLink) {
  brandLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

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

// Hide/Show top navigation based on scroll direction

if (topNav) {
  let lastScrollY = Math.max(window.scrollY, 0);
  let ticking = false;
  const directionThreshold = 4;
  const topThreshold = 24;

  const updateTopNavVisibility = () => {
    const currentScrollY = Math.max(window.scrollY, 0);

    if (topNav.classList.contains("nav-locked-open")) {
      topNav.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    const scrollingDown = currentScrollY > lastScrollY + directionThreshold;
    const scrollingUp = currentScrollY < lastScrollY - directionThreshold;

    if (currentScrollY <= topThreshold || scrollingUp) {
      topNav.classList.remove("is-hidden");
    } else if (scrollingDown) {
      topNav.classList.add("is-hidden");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateTopNavVisibility);
    },
    { passive: true }
  );
}

// Mobile Navigation
if (glassNav && mobileNavToggle && primaryNav) {
  const mobileBreakpoint = window.matchMedia("(max-width: 768px)");

  const setMobileNavState = (isOpen) => {
    const open = Boolean(isOpen) && mobileBreakpoint.matches;
    glassNav.classList.toggle("is-mobile-open", open);
    topNav?.classList.toggle("nav-locked-open", open);

    if (open) {
      topNav?.classList.remove("is-hidden");
    }

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


// Pointer Glow (Navigation + Section 2 Tiles)
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

const attachPointerGlow = (element, options = {}) => {
  const {
    activeClassName = "is-glow-active",
    xVariable = "--glow-x",
    yVariable = "--glow-y",
  } = options;

  let rafId = null;
  let targetX = 0;
  let targetY = 0;

  const renderGlow = () => {
    element.style.setProperty(xVariable, `${targetX}px`);
    element.style.setProperty(yVariable, `${targetY}px`);
    rafId = null;
  };

  const queueRender = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(renderGlow);
  };

  const updateGlowTarget = (event) => {
    const rect = element.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
    queueRender();
  };

  element.addEventListener("pointerenter", (event) => {
    element.classList.add(activeClassName);
    updateGlowTarget(event);
  });

  element.addEventListener("pointermove", updateGlowTarget);

  element.addEventListener("pointerleave", () => {
    element.classList.remove(activeClassName);
  });
};

if (supportsFinePointer) {
  if (glassNav) {
    attachPointerGlow(glassNav, {
      xVariable: "--glow-x",
      yVariable: "--glow-y",
    });
  }

  document.querySelectorAll(".section-2 .tile-card").forEach((tileCard) => {
    attachPointerGlow(tileCard, {
      xVariable: "--tile-glow-x",
      yVariable: "--tile-glow-y",
    });
  });
}

// Section 2 Tile Media Toggle (click to expand image)
const sectionTwoElement = document.querySelector(".section-2");
const sectionTwoTileCards = Array.from(document.querySelectorAll(".section-2 .tile-card"));
const sectionTwoDetailPanels = Array.from(document.querySelectorAll(".section-2 .tile-detail-panel"));
const sectionTwoDetailPanelsById = new Map(
  sectionTwoDetailPanels.map((detailPanel) => [detailPanel.id, detailPanel])
);
let activeSectionTwoTileCard = null;
let activeSectionTwoDetailPanel = null;
let sectionTwoPositionRafId = null;

const setSectionTwoTileActive = (tileCard, isActive) => {
  tileCard.classList.toggle("is-media-active", isActive);
  tileCard.setAttribute("aria-pressed", String(isActive));
};

const setSectionTwoDetailPanelVisible = (detailPanel, isVisible) => {
  if (!detailPanel) return;
  detailPanel.classList.toggle("is-visible", isVisible);
  detailPanel.setAttribute("aria-hidden", String(!isVisible));
};

const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

const clearSectionTwoDetailPanelPosition = (detailPanel) => {
  if (!detailPanel) return;
  detailPanel.style.removeProperty("--detail-panel-left");
  detailPanel.style.removeProperty("--detail-panel-right");
  detailPanel.style.removeProperty("--detail-panel-from-left-left");
  detailPanel.style.removeProperty("--detail-panel-from-left-right");
};

const positionSectionTwoDetailPanel = (tileCard, detailPanel) => {
  if (!sectionTwoElement || !tileCard || !detailPanel) return;

  const sectionRect = sectionTwoElement.getBoundingClientRect();
  const tileRect = tileCard.getBoundingClientRect();

  if (sectionRect.width <= 0 || tileRect.width <= 0) return;

  const tileLeftInSection = tileRect.left - sectionRect.left;
  const tileWidth = tileRect.width;

  if (detailPanel.classList.contains("tile-detail-panel--from-left")) {
    const targetRight = sectionRect.width - (tileLeftInSection + tileWidth * 0.82);
    const panelRight = clampValue(targetRight, 24, sectionRect.width * 0.68);
    detailPanel.style.setProperty("--detail-panel-from-left-right", `${panelRight.toFixed(2)}px`);
    return;
  }

  const targetLeft = tileLeftInSection + tileWidth * 0.88;
  const panelLeft = clampValue(targetLeft, 220, sectionRect.width - 140);
  detailPanel.style.setProperty("--detail-panel-left", `${panelLeft.toFixed(2)}px`);
};

const syncActiveSectionTwoDetailPanelPosition = () => {
  if (!activeSectionTwoTileCard || !activeSectionTwoDetailPanel) return;
  positionSectionTwoDetailPanel(activeSectionTwoTileCard, activeSectionTwoDetailPanel);
};

const requestActiveSectionTwoDetailPanelPosition = () => {
  if (sectionTwoPositionRafId !== null) return;
  sectionTwoPositionRafId = requestAnimationFrame(() => {
    syncActiveSectionTwoDetailPanelPosition();
    sectionTwoPositionRafId = null;
  });
};

if (sectionTwoTileCards.length > 0) {
  const closeSectionTwoTiles = () => {
    sectionTwoTileCards.forEach((tileCard) => {
      setSectionTwoTileActive(tileCard, false);
    });

    sectionTwoDetailPanels.forEach((detailPanel) => {
      setSectionTwoDetailPanelVisible(detailPanel, false);
      clearSectionTwoDetailPanelPosition(detailPanel);
    });

    activeSectionTwoTileCard = null;
    activeSectionTwoDetailPanel = null;
  };

  sectionTwoTileCards.forEach((tileCard) => {
    const linkedPanelId = tileCard.dataset.detailPanel;
    const linkedDetailPanel = linkedPanelId ? sectionTwoDetailPanelsById.get(linkedPanelId) : null;

    tileCard.setAttribute("role", "button");
    tileCard.setAttribute("tabindex", "0");
    tileCard.setAttribute("aria-pressed", "false");

    const toggleTileCard = () => {
      const shouldActivate = !tileCard.classList.contains("is-media-active");
      closeSectionTwoTiles();
      if (!shouldActivate) return;

      setSectionTwoTileActive(tileCard, true);
      positionSectionTwoDetailPanel(tileCard, linkedDetailPanel);
      setSectionTwoDetailPanelVisible(linkedDetailPanel, true);
      activeSectionTwoTileCard = tileCard;
      activeSectionTwoDetailPanel = linkedDetailPanel;
    };

    tileCard.addEventListener("click", () => {
      toggleTileCard();
    });

    tileCard.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleTileCard();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideTileCard = sectionTwoTileCards.some((tileCard) => tileCard.contains(event.target));
    const clickedInsideDetailPanel = sectionTwoDetailPanels.some((detailPanel) => detailPanel.contains(event.target));
    if (clickedInsideTileCard || clickedInsideDetailPanel) return;
    closeSectionTwoTiles();
  });

  window.addEventListener("resize", () => {
    requestActiveSectionTwoDetailPanelPosition();
  });

  closeSectionTwoTiles();
} else {
  sectionTwoDetailPanels.forEach((detailPanel) => {
    detailPanel.setAttribute("aria-hidden", "true");
  });
}

// Logic Tab Switcher
const validTabs = new Set(["collab", "audit"]);

function switchTab(tab) {
  if (!validTabs.has(tab)) return;

  const nextContentId = "content-" + tab;
  const nextContent = document.getElementById(nextContentId);
  if (!nextContent) return;

  document.querySelectorAll(".tab-content").forEach((el) => {
    const isActivePanel = el.id === nextContentId;
    el.classList.toggle("hidden", !isActivePanel);
    el.setAttribute("aria-hidden", String(!isActivePanel));
  });

  const btnCollab = document.getElementById("tab-collab");
  const btnAudit = document.getElementById("tab-audit");
  if (!btnCollab || !btnAudit) return;

  const collabActive = tab === "collab";
  btnCollab.classList.toggle("bg-white/10", collabActive);
  btnCollab.classList.toggle("text-white", collabActive);
  btnCollab.classList.toggle("shadow-sm", collabActive);
  btnCollab.classList.toggle("text-zinc-400", !collabActive);

  btnAudit.classList.toggle("bg-white/10", !collabActive);
  btnAudit.classList.toggle("text-white", !collabActive);
  btnAudit.classList.toggle("shadow-sm", !collabActive);
  btnAudit.classList.toggle("text-zinc-400", collabActive);

  btnCollab.setAttribute("aria-selected", String(collabActive));
  btnAudit.setAttribute("aria-selected", String(!collabActive));
  btnCollab.setAttribute("tabindex", collabActive ? "0" : "-1");
  btnAudit.setAttribute("tabindex", collabActive ? "-1" : "0");
}

// Pricing Logic
let currentPlan = "business";
let currentBilling = "monthly";
const validBillingPeriods = new Set(["monthly", "yearly"]);
const cardBaseClass = "w-full text-left p-4 rounded-xl border cursor-pointer hover:bg-white/10 transition-colors";

const plans = {
  business: {
    monthly: 249,
    yearly: 2490,
    desc: "GREAT FOR TEAMS LAUNCHING WORKFLOWS.",
    features: ["Up to 10 Users", "Basic Reporting", "30-Day Audit Log"],
  },
  enterprise: {
    monthly: 999,
    yearly: 9990,
    desc: "GLOBAL COMPLIANCE & PRODUCTION SCALE.",
    features: ["Unlimited Users", "Advanced AI Analytics", "SSO & Compliance", "Priority Support"],
  },
};

function setBilling(period) {
  if (!validBillingPeriods.has(period)) return;

  currentBilling = period;
  const monthlyButton = document.getElementById("btn-monthly");
  const yearlyButton = document.getElementById("btn-yearly");
  if (!monthlyButton || !yearlyButton) return;

  monthlyButton.className =
    period === "monthly"
      ? "px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow"
      : "px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white";
  yearlyButton.className =
    period === "yearly"
      ? "px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow"
      : "px-3 py-1 text-xs font-medium rounded text-zinc-400 hover:text-white";
  updatePricingUI();
}

function selectPlan(plan) {
  if (!plans[plan]) return;

  currentPlan = plan;

  const businessCard = document.getElementById("card-business");
  const enterpriseCard = document.getElementById("card-enterprise");
  if (!businessCard || !enterpriseCard) return;

  const activeClass = "border-white/20 bg-white/5";
  const inactiveClass = "border-white/5 bg-transparent";
  const businessActive = plan === "business";
  const enterpriseActive = !businessActive;

  businessCard.className = `${cardBaseClass} ${businessActive ? activeClass : inactiveClass}`;
  enterpriseCard.className = `${cardBaseClass} ${enterpriseActive ? activeClass : inactiveClass}`;

  const businessIcon = businessCard.querySelector("iconify-icon");
  const enterpriseIcon = enterpriseCard.querySelector("iconify-icon");
  if (businessIcon && enterpriseIcon) {
    businessIcon.setAttribute("icon", businessActive ? "solar:check-circle-bold" : "solar:circle-linear");
    businessIcon.classList.toggle("text-white", businessActive);
    businessIcon.classList.toggle("text-zinc-500", !businessActive);

    enterpriseIcon.setAttribute("icon", enterpriseActive ? "solar:check-circle-bold" : "solar:circle-linear");
    enterpriseIcon.classList.toggle("text-white", enterpriseActive);
    enterpriseIcon.classList.toggle("text-zinc-500", !enterpriseActive);
  }

  updatePricingUI();
}

function updatePricingUI() {
  const data = plans[currentPlan];
  if (!data) return;

  const price = currentBilling === "monthly" ? data.monthly : data.yearly;
  const suffix = currentBilling === "monthly" ? "/month" : "/year";

  const priceDisplay = document.getElementById("price-display");
  const periodDisplay = document.getElementById("period-display");
  const descDisplay = document.getElementById("desc-display");
  const list = document.getElementById("feature-list");
  if (!priceDisplay || !periodDisplay || !descDisplay || !list) return;

  priceDisplay.textContent = "$" + price;
  periodDisplay.textContent = suffix;
  descDisplay.textContent = data.desc;

  list.textContent = "";
  data.features.forEach((feature) => {
    const item = document.createElement("li");
    item.className = "flex items-center gap-3 text-sm";

    const icon = document.createElement("iconify-icon");
    icon.setAttribute("icon", "solar:check-read-linear");
    icon.className = "text-blue-400";

    item.append(icon, document.createTextNode(" " + feature));
    list.appendChild(item);
  });
}

const tabButtons = Array.from(document.querySelectorAll("[data-tab]"));
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });

  button.addEventListener("keydown", (event) => {
    const currentIndex = tabButtons.indexOf(button);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabButtons.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabButtons.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextButton = tabButtons[nextIndex];
    switchTab(nextButton.dataset.tab);
    nextButton.focus();
  });
});

document.querySelectorAll("[data-billing]").forEach((button) => {
  button.addEventListener("click", () => {
    setBilling(button.dataset.billing);
  });
});

document.querySelectorAll("[data-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    selectPlan(button.dataset.plan);
  });
});

switchTab("collab");
setBilling(currentBilling);
selectPlan(currentPlan);
