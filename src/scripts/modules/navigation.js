const HOME_PATH = "index.html";
const CONTACT_PATH = "kontakt.html";
const BOOKING_HASH = "terminbuchung";
const COOKIE_PATH = "cookies.html";
const COOKIE_SETTINGS_HASH = "cookie-settings";
const COOKIE_SETTINGS_PATH = `${COOKIE_PATH}#${COOKIE_SETTINGS_HASH}`;
const PRIMARY_CTA_LABEL = "Erstgespräch buchen";
const SEO_MARKETING_PATH = "seo-marketing.html";
const MOBILE_STICKY_CTA_ID = "mobile-sticky-cta";

const NAV_LINK_CLASS = "nav-link rounded-full px-3 sm:px-5 py-1.5 text-sm font-medium";

const GLOBAL_NAV_LINKS = [
  { type: "page", path: HOME_PATH, label: "Start", pageKey: "home" },
  { type: "page", path: "leistungen.html", label: "Leistungen", pageKey: "leistungen" },
  { type: "page", path: "projekte.html", label: "Projekte", pageKey: "projekte" },
  { type: "page", path: "ablauf.html", label: "Ablauf", pageKey: "ablauf" },
  { type: "page", path: "ueber-mich.html", label: "Über mich", pageKey: "ueber-mich" },
  { type: "page", path: "preise.html", label: "Preise", pageKey: "preise" },
  { type: "page", path: "insights.html", label: "Insights", pageKey: "insights" },
  { type: "page", path: CONTACT_PATH, label: "Kontakt", pageKey: "kontakt" },
];

const FOOTER_NAVIGATION_LINKS = [
  { type: "page", path: HOME_PATH, label: "Start", pageKey: "home" },
  { type: "page", path: "leistungen.html", label: "Leistungen", pageKey: "leistungen" },
  { type: "page", path: "projekte.html", label: "Projekte", pageKey: "projekte" },
  { type: "page", path: "case-study.html", label: "Case Study", pageKey: "case-study" },
  { type: "page", path: "ablauf.html", label: "Ablauf", pageKey: "ablauf" },
  { type: "page", path: "ueber-mich.html", label: "Über mich", pageKey: "ueber-mich" },
  { type: "page", path: "preise.html", label: "Preise", pageKey: "preise" },
  { type: "page", path: "insights.html", label: "Insights", pageKey: "insights" },
  { type: "page", path: CONTACT_PATH, label: "Kontakt", pageKey: "kontakt" },
];

const FOOTER_SERVICE_LINKS = [
  { type: "page", path: "webentwicklung.html", label: "Webentwicklung", pageKey: "webentwicklung" },
  { type: "page", path: "branding.html", label: "Branding", pageKey: "branding" },
  { type: "page", path: SEO_MARKETING_PATH, label: "SEO & Marketing", pageKey: "seo-marketing" },
  { type: "page", path: "social.html", label: "Social Strategie", pageKey: "social" },
  { type: "page", path: "growth.html", label: "Growth Strategie", pageKey: "growth" },
  { type: "page", path: "ki-beratung.html", label: "KI Beratung", pageKey: "ki-beratung" },
];

const FOOTER_LEGAL_LINKS = [
  { type: "page", path: "impressum.html", label: "Impressum", pageKey: "impressum" },
  { type: "page", path: "datenschutz.html", label: "Datenschutz", pageKey: "datenschutz" },
  { type: "page", path: COOKIE_PATH, label: "Cookies", pageKey: "cookies" },
  { type: "cookie-settings", path: COOKIE_SETTINGS_PATH, label: "Cookie-Einstellungen" },
];

const FOOTER_BRAND = Object.freeze({
  name: "Smart Web Studio",
  tagline: "Marke. Website. Wachstum.",
  description:
    "Strategische Websites mit klarer Positionierung, sauberer Nutzerführung und einer Conversion-Architektur, die Vertrauen in Anfragen übersetzt.",
  meta: "Direkter Ansprechpartner | Vorarlberg / DACH",
  note:
    "Direkte Zusammenarbeit, strukturierter Ablauf und Fokus auf passende Projekte.",
});

const PAGE_CONFIGS = {
  home: { path: HOME_PATH, navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  leistungen: { path: "leistungen.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  branding: { path: "branding.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  webentwicklung: {
    path: "webentwicklung.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  "seo-marketing": {
    path: SEO_MARKETING_PATH,
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  social: { path: "social.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  growth: { path: "growth.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  "ki-beratung": {
    path: "ki-beratung.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  projekte: { path: "projekte.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  "case-study": {
    path: "case-study.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  ablauf: { path: "ablauf.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  preise: { path: "preise.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  "ueber-mich": {
    path: "ueber-mich.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  insights: { path: "insights.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: true },
  kontakt: { path: CONTACT_PATH, navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: false },
  danke: { path: "danke.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: false },
  impressum: { path: "impressum.html", navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: false },
  datenschutz: {
    path: "datenschutz.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: false,
  },
  cookies: { path: COOKIE_PATH, navCtaLabel: PRIMARY_CTA_LABEL, stickyMobileCta: false },
  "marketing-legacy": {
    path: "marketing.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: false,
  },
};

const SLUG_ALIASES = {
  marketing: "marketing-legacy",
};

const getCurrentPageKey = () => {
  const explicitPageKey = document.body?.dataset.page?.trim();
  if (explicitPageKey && PAGE_CONFIGS[explicitPageKey]) {
    return explicitPageKey;
  }

  const rawPath = window.location.pathname.replace(/\\/g, "/").replace(/\/+$/, "");
  const slug = rawPath.split("/").pop() || "";
  const normalized = slug.replace(/\.html$/i, "");
  const resolvedKey = SLUG_ALIASES[normalized] || normalized;

  if (!normalized || normalized === "index") return "home";
  if (PAGE_CONFIGS[resolvedKey]) return resolvedKey;

  return null;
};

const getCurrentPagePath = (currentPageKey) => {
  if (currentPageKey && PAGE_CONFIGS[currentPageKey]) {
    return PAGE_CONFIGS[currentPageKey].path;
  }

  const rawPath = window.location.pathname.replace(/\\/g, "/").replace(/\/+$/, "");
  const slug = rawPath.split("/").pop() || "";
  return !slug || slug === "/" ? HOME_PATH : slug;
};

const getBookingTarget = () => {
  const configuredTarget = document.body?.dataset.bookingTarget?.trim();
  if (configuredTarget) return configuredTarget;

  return getCurrentPageKey() === "kontakt"
    ? `#${BOOKING_HASH}`
    : `${CONTACT_PATH}#${BOOKING_HASH}`;
};

const getCookiePageTarget = () => {
  const configuredTarget = document.body?.dataset.cookieTarget?.trim();
  return configuredTarget || COOKIE_PATH;
};

const getCookieSettingsTarget = () => {
  const configuredTarget = document.body?.dataset.cookieSettingsTarget?.trim();
  return configuredTarget || COOKIE_SETTINGS_PATH;
};

const shouldShowMobileStickyCta = (pageConfig) => {
  const configuredValue = document.body?.dataset.mobileStickyCta?.trim();
  if (configuredValue) {
    return configuredValue !== "false";
  }

  return Boolean(pageConfig?.stickyMobileCta);
};

const isCurrentPageLink = (path, currentPagePath) => {
  const normalizedPath = (path || "").split("#")[0];
  return normalizedPath === currentPagePath;
};

const getResolvedHref = (link, runtimeConfig) => {
  switch (link.type) {
    case "cookie-settings":
      return runtimeConfig.cookieSettingsTarget;
    case "section":
      return `#${link.id}`;
    case "page":
    default:
      if (link.path === COOKIE_PATH) {
        return runtimeConfig.cookiePageTarget || COOKIE_PATH;
      }
      if (link.path === "marketing.html") {
        return SEO_MARKETING_PATH;
      }
      return link.path || HOME_PATH;
  }
};

const createLinkElement = (link, runtimeConfig, options = {}) => {
  const anchor = document.createElement("a");
  const href = getResolvedHref(link, runtimeConfig);

  anchor.href = href;
  anchor.textContent = link.label;

  if (options.className) {
    anchor.className = options.className;
  }

  const normalizedLinkPath =
    link.path === "marketing.html" ? SEO_MARKETING_PATH : link.path;
  const isCurrentPage =
    link.type === "page" &&
    isCurrentPageLink(normalizedLinkPath, runtimeConfig.currentPagePath) &&
    !String(normalizedLinkPath || "").includes("#");

  if (isCurrentPage) {
    anchor.setAttribute("aria-current", "page");
  }

  if (link.type === "cookie-settings") {
    anchor.setAttribute("data-open-cookie-settings", "");
    anchor.setAttribute("aria-haspopup", "dialog");
  }

  return anchor;
};

const renderPrimaryNavigation = (primaryNav, runtimeConfig) => {
  if (!primaryNav) return;

  const fragment = document.createDocumentFragment();

  GLOBAL_NAV_LINKS.forEach((link) => {
    fragment.appendChild(
      createLinkElement(link, runtimeConfig, { className: NAV_LINK_CLASS })
    );
  });

  primaryNav.replaceChildren(fragment);
};

const renderFooterList = (listElement, links, runtimeConfig) => {
  if (!listElement) return;

  const fragment = document.createDocumentFragment();

  links.forEach((link) => {
    const listItem = document.createElement("li");
    const anchor = createLinkElement(link, runtimeConfig, {
      className: "site-footer__link",
    });
    listItem.appendChild(anchor);
    fragment.appendChild(listItem);
  });

  listElement.replaceChildren(fragment);
};

const renderFooterBrand = (footer, runtimeConfig) => {
  if (!footer) return;

  const brandColumn = footer.querySelector(".site-footer__column--brand");
  if (!brandColumn) return;

  const brandTitle = brandColumn.querySelector(".site-footer__brand");
  const tagline = brandColumn.querySelector(".site-footer__tagline");
  const description = brandColumn.querySelector(".site-footer__description");
  const meta = brandColumn.querySelector(".site-footer__meta");

  if (brandTitle) {
    brandTitle.textContent = FOOTER_BRAND.name;
  }

  if (tagline) {
    tagline.textContent = FOOTER_BRAND.tagline;
  }

  if (description) {
    description.textContent = FOOTER_BRAND.description;
  }

  if (meta) {
    meta.textContent = FOOTER_BRAND.meta;
  }

  let footerNote = brandColumn.querySelector(".site-footer__note");
  if (!footerNote) {
    footerNote = document.createElement("p");
    footerNote.className = "site-footer__note";
    brandColumn.appendChild(footerNote);
  }

  footerNote.textContent = `${FOOTER_BRAND.note} `;

  const noteLink = document.createElement("a");
  noteLink.className = "site-footer__link";
  noteLink.href = runtimeConfig.bookingTarget;
  noteLink.textContent = PRIMARY_CTA_LABEL;
  footerNote.appendChild(noteLink);
};

const renderFooterNavigation = (footer, runtimeConfig) => {
  if (!footer) return;

  renderFooterBrand(footer, runtimeConfig);

  renderFooterList(
    footer.querySelector('[data-footer-group="services"] .site-footer__list'),
    FOOTER_SERVICE_LINKS,
    runtimeConfig
  );

  renderFooterList(
    footer.querySelector('[data-footer-group="entry"] .site-footer__list'),
    FOOTER_NAVIGATION_LINKS,
    runtimeConfig
  );

  renderFooterList(
    footer.querySelector('[data-footer-group="legal"] .site-footer__list'),
    FOOTER_LEGAL_LINKS,
    runtimeConfig
  );
};

const updateBrandAndCtaLinks = (pageConfig, runtimeConfig) => {
  const brandLink = document.querySelector(".brand-link");
  const navCta = document.querySelector(".nav-cta");

  if (brandLink) {
    const isHomePage = runtimeConfig.currentPageKey === "home";
    brandLink.href = isHomePage ? "#top" : HOME_PATH;
    brandLink.setAttribute("aria-label", isHomePage ? "Zum Seitenanfang" : "Zur Startseite");
  }

  if (navCta && pageConfig) {
    navCta.href = runtimeConfig.bookingTarget;
    navCta.textContent = pageConfig.navCtaLabel;
    navCta.setAttribute("aria-label", pageConfig.navCtaLabel);
  }
};

const normalizeStandaloneLinks = (runtimeConfig) => {
  document.querySelectorAll('a[href="/"]').forEach((link) => {
    link.href = HOME_PATH;
  });

  document.querySelectorAll('a[href="marketing.html"]').forEach((link) => {
    link.href = SEO_MARKETING_PATH;
  });

  document
    .querySelectorAll(
      `a[href="#cookie-einstellungen"], a[href="${HOME_PATH}#cookie-einstellungen"], a[href="${COOKIE_SETTINGS_PATH}"], a[data-open-cookie-settings]`
    )
    .forEach((link) => {
      link.href = runtimeConfig.cookieSettingsTarget;
      link.setAttribute("data-open-cookie-settings", "");
      link.setAttribute("aria-haspopup", "dialog");
    });
};

const initScrollToTop = (scrollToTopButton) => {
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

  if (!scrollToTopButton) return;

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateScrollToTopVisibility();
  window.addEventListener("scroll", requestScrollToTopFrame, { passive: true });
  window.addEventListener("resize", requestScrollToTopFrame);
};

const initTopNavScrollState = (topNav, glassNav) => {
  if (!topNav) return;

  const topThreshold = 18;
  const hideThreshold = 120;
  const directionThreshold = 6;
  let lastScrollY = Math.max(window.scrollY, 0);
  let ticking = false;

  const revealTopNav = () => {
    topNav.classList.remove("is-hidden");
    topNav.classList.add("is-revealed");
  };

  const resetTopNav = () => {
    topNav.classList.remove("is-hidden");
    topNav.classList.remove("is-revealed");
  };

  const updateTopNavScrollState = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const delta = currentScrollY - lastScrollY;
    const isScrollingDown = delta > directionThreshold;
    const isScrollingUp = delta < -directionThreshold;
    const isMobileNavOpen = Boolean(glassNav?.classList.contains("is-mobile-open"));

    topNav.classList.toggle("is-scrolled", currentScrollY > topThreshold);

    if (isMobileNavOpen || currentScrollY <= topThreshold) {
      resetTopNav();
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    if (isScrollingDown && currentScrollY > hideThreshold) {
      topNav.classList.add("is-hidden");
      topNav.classList.remove("is-revealed");
    } else if (isScrollingUp || currentScrollY <= hideThreshold) {
      revealTopNav();
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  const requestTopNavStateUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateTopNavScrollState);
  };

  window.addEventListener("scroll", requestTopNavStateUpdate, { passive: true });
  window.addEventListener("resize", requestTopNavStateUpdate);
  updateTopNavScrollState();
};

const initMobileNavigation = (glassNav, mobileNavToggle, primaryNav) => {
  if (!glassNav || !mobileNavToggle || !primaryNav) return;

  const mobileBreakpoint = window.matchMedia("(max-width: 1024px)");
  const topNav = document.querySelector(".top-nav");
  const primaryNavLinks = Array.from(primaryNav.querySelectorAll("a"));

  const syncMobileNavAccessibility = (isOpen) => {
    const canReachNav = !mobileBreakpoint.matches || Boolean(isOpen);

    if ("inert" in primaryNav) {
      primaryNav.inert = !canReachNav;
    }

    primaryNavLinks.forEach((link) => {
      if (canReachNav) {
        link.removeAttribute("tabindex");
        return;
      }

      link.setAttribute("tabindex", "-1");
    });
  };

  const setMobileNavState = (isOpen) => {
    const open = Boolean(isOpen) && mobileBreakpoint.matches;
    glassNav.classList.toggle("is-mobile-open", open);
    mobileNavToggle.setAttribute("aria-expanded", String(open));

    if (open && topNav) {
      topNav.classList.remove("is-hidden");
      topNav.classList.add("is-revealed");
    }

    if (mobileBreakpoint.matches) {
      primaryNav.setAttribute("aria-hidden", String(!open));
    } else {
      primaryNav.removeAttribute("aria-hidden");
    }

    syncMobileNavAccessibility(open);
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
      syncMobileNavAccessibility(isOpen);
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
};

const initActiveSectionObserver = (primaryNav) => {
  if (!primaryNav) return;

  const navSectionLinks = Array.from(primaryNav.querySelectorAll("[data-nav-section]"));
  if (navSectionLinks.length === 0) return;

  const setActiveNavSectionLink = (sectionId) => {
    if (!sectionId) return;

    navSectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

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
    .filter(Boolean);

  if (navSectionTargets.length === 0) return;

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

  if (!("IntersectionObserver" in window)) return;

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
};

const renderMobileStickyCta = (pageConfig, runtimeConfig) => {
  document.getElementById(MOBILE_STICKY_CTA_ID)?.remove();
  document.body.classList.remove("has-mobile-sticky-cta");

  if (!shouldShowMobileStickyCta(pageConfig)) return;

  const stickyWrapper = document.createElement("div");
  stickyWrapper.id = MOBILE_STICKY_CTA_ID;
  stickyWrapper.className = "mobile-sticky-cta";

  const stickyLabel = document.createElement("span");
  stickyLabel.className = "mobile-sticky-cta__label";
  stickyLabel.textContent = "Direkter Projektstart";

  const stickyLink = document.createElement("a");
  stickyLink.className = "mobile-sticky-cta__link";
  stickyLink.href = runtimeConfig.bookingTarget;
  stickyLink.textContent = PRIMARY_CTA_LABEL;
  stickyLink.setAttribute("aria-label", PRIMARY_CTA_LABEL);

  stickyWrapper.append(stickyLabel, stickyLink);
  document.body.appendChild(stickyWrapper);
  document.body.classList.add("has-mobile-sticky-cta");
};

export const initNavigation = () => {
  const topNav = document.querySelector(".top-nav");
  const glassNav = document.getElementById("glass-nav");
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const footer = document.getElementById("site-footer");
  const scrollToTopButton = document.getElementById("scroll-to-top");

  const currentPageKey = getCurrentPageKey();
  const pageConfig = currentPageKey ? PAGE_CONFIGS[currentPageKey] : null;
  const runtimeConfig = {
    currentPageKey,
    currentPagePath: getCurrentPagePath(currentPageKey),
    bookingTarget: getBookingTarget(),
    cookiePageTarget: getCookiePageTarget(),
    cookieSettingsTarget: getCookieSettingsTarget(),
  };

  updateBrandAndCtaLinks(pageConfig, runtimeConfig);
  renderPrimaryNavigation(primaryNav, runtimeConfig);
  renderFooterNavigation(footer, runtimeConfig);
  renderMobileStickyCta(pageConfig, runtimeConfig);
  normalizeStandaloneLinks(runtimeConfig);

  initScrollToTop(scrollToTopButton);
  initTopNavScrollState(topNav, glassNav);
  initMobileNavigation(glassNav, mobileNavToggle, primaryNav);
  initActiveSectionObserver(primaryNav);
};
