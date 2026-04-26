const HOME_PATH = "index.html";
const CONTACT_PATH = "kontakt.html";
const BOOKING_HASH = "terminbuchung";
const COOKIE_PATH = "cookies.html";
const COOKIE_SETTINGS_HASH = "cookie-settings";
const COOKIE_SETTINGS_PATH = `${COOKIE_PATH}#${COOKIE_SETTINGS_HASH}`;
const PRIMARY_CTA_LABEL = "Erstgespräch buchen";
const SEO_MARKETING_PATH = "seo-marketing.html";
const MOBILE_STICKY_CTA_ID = "mobile-sticky-cta";
const NAV_MOBILE_BREAKPOINT = 1024;

const NAV_LINK_CLASS = "nav-link rounded-full px-3 sm:px-5 py-1.5 text-sm font-medium";

const PROJECT_DETAIL_LINKS = Object.freeze([
  {
    type: "page",
    path: "projekte/website-branding-setup.html",
    label: "Marken- & Website-Setup",
    pageKey: "projekt-website-branding-setup",
  },
  {
    type: "page",
    path: "projekte/relaunch-seo.html",
    label: "Relaunch & SEO",
    pageKey: "projekt-relaunch-seo",
  },
  {
    type: "page",
    path: "projekte/content-tracking-system.html",
    label: "Content- & Tracking-System",
    pageKey: "projekt-content-tracking-system",
  },
  {
    type: "page",
    path: "projekte/funnel-optimierung.html",
    label: "Funnel-Optimierung",
    pageKey: "projekt-funnel-optimierung",
  },
]);

const PROJECT_DETAIL_PAGE_KEYS = Object.freeze(
  PROJECT_DETAIL_LINKS.map(({ pageKey }) => pageKey)
);

const SERVICE_DETAIL_LINKS = Object.freeze([
  {
    type: "page",
    path: "webentwicklung.html",
    label: "WEBENTWICKLUNG",
    description:
      "Individuelle codebasierte Websites mit klarer Nutzerfuehrung und Performance.",
    pageKey: "webentwicklung",
  },
  {
    type: "page",
    path: SEO_MARKETING_PATH,
    label: "SEO & MARKETING",
    description:
      "Mehr Sichtbarkeit, verstaendliche Angebotskommunikation und bessere Anfragen.",
    pageKey: "seo-marketing",
  },
  {
    type: "page",
    path: "ki-beratung.html",
    label: "KI & AUTOMATISIERUNG",
    description:
      "Praktische KI-Setups und Automatisierung fuer weniger manuelle Arbeit.",
    pageKey: "ki-beratung",
  },
]);

const SERVICE_DETAIL_PAGE_KEYS = Object.freeze(
  SERVICE_DETAIL_LINKS.map(({ pageKey }) => pageKey)
);

const GLOBAL_NAV_LINKS = [
  { type: "page", path: HOME_PATH, label: "Start", pageKey: "home" },
  {
    type: "page",
    path: "leistungen.html",
    label: "Leistungen",
    pageKey: "leistungen",
    matchPageKeys: SERVICE_DETAIL_PAGE_KEYS,
    children: SERVICE_DETAIL_LINKS,
  },
  {
    type: "page",
    path: "projekte.html",
    label: "Projekte",
    pageKey: "projekte",
    matchPageKeys: PROJECT_DETAIL_PAGE_KEYS,
  },
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
  ...PROJECT_DETAIL_LINKS,
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
  "projekt-website-branding-setup": {
    path: "projekte/website-branding-setup.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  "projekt-relaunch-seo": {
    path: "projekte/relaunch-seo.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  "projekt-content-tracking-system": {
    path: "projekte/content-tracking-system.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
  "projekt-funnel-optimierung": {
    path: "projekte/funnel-optimierung.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
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
  "website-branding-setup": "projekt-website-branding-setup",
  "relaunch-seo": "projekt-relaunch-seo",
  "content-tracking-system": "projekt-content-tracking-system",
  "funnel-optimierung": "projekt-funnel-optimierung",
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

const normalizePagePath = (pathValue) => {
  const normalizedPath = (pathValue || "").split("#")[0];
  return normalizedPath === "marketing.html" ? SEO_MARKETING_PATH : normalizedPath;
};

const isCurrentPageLink = (link, runtimeConfig) => {
  if (link.type !== "page") return false;

  const normalizedLinkPath = normalizePagePath(link.path);
  const normalizedCurrentPagePath = normalizePagePath(runtimeConfig.currentPagePath);

  if (normalizedLinkPath && normalizedLinkPath === normalizedCurrentPagePath) {
    return true;
  }

  return (
    Array.isArray(link.matchPageKeys) &&
    link.matchPageKeys.includes(runtimeConfig.currentPageKey)
  );
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

const setCurrentPageState = (anchor, link, runtimeConfig, options = {}) => {
  const isCurrentPage =
    link.type === "page" &&
    isCurrentPageLink(link, runtimeConfig) &&
    !String(normalizePagePath(link.path) || "").includes("#");

  if (options.addActiveClass) {
    anchor.classList.toggle("is-active", isCurrentPage);
  }

  if (isCurrentPage) {
    anchor.setAttribute("aria-current", "page");
  } else {
    anchor.removeAttribute("aria-current");
  }

  return isCurrentPage;
};

const createLinkElement = (link, runtimeConfig, options = {}) => {
  const anchor = document.createElement("a");
  const href = getResolvedHref(link, runtimeConfig);

  anchor.href = href;
  anchor.textContent = link.label;

  if (options.className) {
    anchor.className = options.className;
  }

  setCurrentPageState(anchor, link, runtimeConfig, {
    addActiveClass: Boolean(options.addActiveClass),
  });

  if (link.type === "cookie-settings") {
    anchor.setAttribute("data-open-cookie-settings", "");
    anchor.setAttribute("aria-haspopup", "dialog");
  }

  return anchor;
};

const createDropdownChildLink = (link, runtimeConfig) => {
  const anchor = document.createElement("a");
  const title = document.createElement("span");
  const description = document.createElement("span");

  anchor.href = getResolvedHref(link, runtimeConfig);
  anchor.className = "nav-dropdown__item";

  title.className = "nav-dropdown__item-title";
  title.textContent = link.label;

  description.className = "nav-dropdown__item-description";
  description.textContent = link.description || "";

  anchor.append(title, description);
  setCurrentPageState(anchor, link, runtimeConfig, { addActiveClass: true });

  return anchor;
};

const createDropdownNavigationItem = (link, runtimeConfig) => {
  const wrapper = document.createElement("div");
  const triggerRow = document.createElement("div");
  const parentLink = createLinkElement(link, runtimeConfig, {
    className: `${NAV_LINK_CLASS} nav-dropdown__link`,
    addActiveClass: true,
  });
  const toggleButton = document.createElement("button");
  const toggleIcon = document.createElement("span");
  const panel = document.createElement("div");
  const surface = document.createElement("div");
  const panelId = `nav-dropdown-${link.pageKey || link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  wrapper.className = "nav-dropdown";
  wrapper.setAttribute("data-nav-dropdown", "");

  triggerRow.className = "nav-dropdown__trigger-row";

  toggleButton.type = "button";
  toggleButton.className = "nav-dropdown__toggle";
  toggleButton.setAttribute("data-nav-dropdown-toggle", "");
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", panelId);
  toggleButton.setAttribute("aria-label", `${link.label} Untermenue umschalten`);

  toggleIcon.className = "nav-dropdown__chevron";
  toggleIcon.setAttribute("aria-hidden", "true");
  toggleButton.appendChild(toggleIcon);

  panel.id = panelId;
  panel.className = "nav-dropdown__panel";
  panel.setAttribute("data-nav-dropdown-panel", "");
  panel.hidden = true;

  surface.className = "nav-dropdown__surface";

  link.children?.forEach((childLink) => {
    surface.appendChild(createDropdownChildLink(childLink, runtimeConfig));
  });

  panel.appendChild(surface);
  triggerRow.append(parentLink, toggleButton);
  wrapper.append(triggerRow, panel);

  if (parentLink.classList.contains("is-active")) {
    wrapper.classList.add("is-active");
  }

  return wrapper;
};

const renderPrimaryNavigation = (primaryNav, runtimeConfig) => {
  if (!primaryNav) return;

  const fragment = document.createDocumentFragment();

  GLOBAL_NAV_LINKS.forEach((link) => {
    if (Array.isArray(link.children) && link.children.length > 0) {
      fragment.appendChild(createDropdownNavigationItem(link, runtimeConfig));
      return;
    }

    fragment.appendChild(
      createLinkElement(link, runtimeConfig, {
        className: NAV_LINK_CLASS,
        addActiveClass: true,
      })
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

const initPrimaryNavDropdowns = (primaryNav) => {
  const dropdowns = Array.from(primaryNav?.querySelectorAll("[data-nav-dropdown]") || []);

  if (dropdowns.length === 0) {
    return {
      closeAll: () => {},
    };
  }

  const mobileBreakpoint = window.matchMedia(`(max-width: ${NAV_MOBILE_BREAKPOINT}px)`);

  const setDropdownState = (dropdown, isOpen) => {
    const toggleButton = dropdown.querySelector("[data-nav-dropdown-toggle]");
    const panel = dropdown.querySelector("[data-nav-dropdown-panel]");

    if (!toggleButton || !panel) return;

    const open = Boolean(isOpen);
    dropdown.classList.toggle("is-open", open);
    toggleButton.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
  };

  const closeAll = (exceptDropdown = null) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown === exceptDropdown) return;
      setDropdownState(dropdown, false);
    });
  };

  dropdowns.forEach((dropdown) => {
    const toggleButton = dropdown.querySelector("[data-nav-dropdown-toggle]");

    if (!toggleButton) return;

    let closeTimeoutId = null;

    const clearCloseTimeout = () => {
      if (closeTimeoutId === null) return;
      window.clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    };

    const scheduleClose = () => {
      clearCloseTimeout();
      closeTimeoutId = window.setTimeout(() => {
        setDropdownState(dropdown, false);
      }, 120);
    };

    const openDropdown = () => {
      clearCloseTimeout();
      closeAll(dropdown);
      setDropdownState(dropdown, true);
    };

    toggleButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = dropdown.classList.contains("is-open");
      if (isOpen) {
        clearCloseTimeout();
        setDropdownState(dropdown, false);
        return;
      }

      openDropdown();
    });

    dropdown.addEventListener("mouseenter", () => {
      if (mobileBreakpoint.matches) return;
      openDropdown();
    });

    dropdown.addEventListener("mouseleave", () => {
      if (mobileBreakpoint.matches) return;
      scheduleClose();
    });

    dropdown.addEventListener("focusin", () => {
      if (mobileBreakpoint.matches) return;
      openDropdown();
    });

    dropdown.addEventListener("focusout", (event) => {
      if (mobileBreakpoint.matches) return;
      if (dropdown.contains(event.relatedTarget)) return;
      scheduleClose();
    });
  });

  document.addEventListener("click", (event) => {
    if (primaryNav?.contains(event.target)) return;
    closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAll();
    }
  });

  const syncDropdownsToViewport = () => {
    closeAll();
  };

  if (typeof mobileBreakpoint.addEventListener === "function") {
    mobileBreakpoint.addEventListener("change", syncDropdownsToViewport);
  } else if (typeof mobileBreakpoint.addListener === "function") {
    mobileBreakpoint.addListener(syncDropdownsToViewport);
  }

  return { closeAll };
};

const initMobileNavigation = (
  glassNav,
  mobileNavToggle,
  primaryNav,
  closeNavDropdowns = () => {}
) => {
  if (!glassNav || !mobileNavToggle || !primaryNav) return;

  const mobileBreakpoint = window.matchMedia(`(max-width: ${NAV_MOBILE_BREAKPOINT}px)`);
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

    if (!open) {
      closeNavDropdowns();
    }

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
  normalizeStandaloneLinks(runtimeConfig);

  initScrollToTop(scrollToTopButton);
  initTopNavScrollState(topNav, glassNav);
  const navDropdownApi = initPrimaryNavDropdowns(primaryNav);
  initMobileNavigation(glassNav, mobileNavToggle, primaryNav, navDropdownApi.closeAll);
  initActiveSectionObserver(primaryNav);
};
