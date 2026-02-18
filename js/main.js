// Mark document as JS-enabled so CSS can apply progressive enhancement.
document.documentElement.classList.add("js");

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Scroll Observer
const revealOnScrollElements = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.1 }
  );

  revealOnScrollElements.forEach((el) => observer.observe(el));
} else {
  revealOnScrollElements.forEach((el) => el.classList.add("is-visible"));
}

// Scroll-driven background pan (top -> bottom of image)
const root = document.documentElement;
let bgPanTicking = false;

const updateBackgroundPan = () => {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const progress = maxScroll === 0 ? 0 : Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
  root.style.setProperty("--bg-position-y", `${(progress * 100).toFixed(2)}%`);
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
  window.scrollTo(0, 0);
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

// Logic Tab Switcher
const validTabs = new Set(["collab", "audit"]);

function switchTab(tab) {
  if (!validTabs.has(tab)) return;

  const nextContent = document.getElementById("content-" + tab);
  if (!nextContent) return;

  document.querySelectorAll(".tab-content").forEach((el) => el.classList.add("hidden"));
  nextContent.classList.remove("hidden");

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

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
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
