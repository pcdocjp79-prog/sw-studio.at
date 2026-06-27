const HOME_PATH = "index.html";
const CONTACT_PATH = "kontakt.html";
const CONTACT_FORM_HASH = "kontaktformular";
const COOKIE_PATH = "cookies.html";
const COOKIE_SETTINGS_HASH = "cookie-settings";
const COOKIE_SETTINGS_PATH = `${COOKIE_PATH}#${COOKIE_SETTINGS_HASH}`;
const PRIMARY_CTA_LABEL = "Projekt anfragen";
const PRIMARY_CTA_META_LABEL = "";
const SEO_MARKETING_PATH = "seo-marketing.html";
const MOBILE_STICKY_CTA_ID = "mobile-sticky-cta";
const NAV_MOBILE_BREAKPOINT = 1180;

const NAV_LINK_CLASS = "nav-link";

const GLOBAL_NAV_LINKS = [
  { type: "page", path: HOME_PATH, label: "Start", pageKey: "home" },
  {
    type: "page",
    path: "webentwicklung.html",
    label: "Webentwicklung",
    pageKey: "webentwicklung",
  },
  {
    type: "page",
    path: SEO_MARKETING_PATH,
    label: "SEO & Marketing",
    pageKey: "seo-marketing",
  },
  {
    type: "page",
    path: "ki-leistungen.html",
    label: "KI & AUTOMATISIERUNG",
    pageKey: "ki-leistungen",
  },
  { type: "page", path: CONTACT_PATH, label: "Kontakt", pageKey: "kontakt" },
];

const FOOTER_NAVIGATION_LINKS = [
  { type: "page", path: HOME_PATH, label: "Start", pageKey: "home" },
  { type: "page", path: CONTACT_PATH, label: "Kontakt", pageKey: "kontakt" },
];

const FOOTER_SERVICE_LINKS = [
  { type: "page", path: "webentwicklung.html", label: "Webentwicklung", pageKey: "webentwicklung" },
  { type: "page", path: SEO_MARKETING_PATH, label: "SEO & Marketing", pageKey: "seo-marketing" },
  { type: "page", path: "ki-leistungen.html", label: "KI & AUTOMATISIERUNG", pageKey: "ki-leistungen" },
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
  "ki-leistungen": {
    path: "ki-leistungen.html",
    navCtaLabel: PRIMARY_CTA_LABEL,
    stickyMobileCta: true,
  },
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
  "ki-beratung": "ki-leistungen",
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

const getPrimaryCtaTarget = () => {
  const configuredTarget = document.body?.dataset.primaryCtaTarget?.trim();
  if (configuredTarget) return configuredTarget;

  return `${CONTACT_PATH}#${CONTACT_FORM_HASH}`;
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

const createMobilePrimaryCtaNavItem = (runtimeConfig) => {
  const anchor = document.createElement("a");
  anchor.href = runtimeConfig.primaryCtaTarget;
  anchor.className = `${NAV_LINK_CLASS} nav-link--mobile-cta`;
  anchor.textContent = PRIMARY_CTA_LABEL;
  anchor.setAttribute("aria-label", PRIMARY_CTA_LABEL);
  return anchor;
};

const renderPrimaryNavigation = (primaryNav, runtimeConfig) => {
  if (!primaryNav) return;

  const fragment = document.createDocumentFragment();

  GLOBAL_NAV_LINKS.forEach((link) => {
    fragment.appendChild(
      createLinkElement(link, runtimeConfig, {
        className: NAV_LINK_CLASS,
        addActiveClass: true,
      })
    );
  });

  fragment.appendChild(createMobilePrimaryCtaNavItem(runtimeConfig));
  primaryNav.replaceChildren(fragment);
};

const createPrimaryCtaBlock = (runtimeConfig, options) => {
  const wrapper = document.createElement("div");
  wrapper.className = options.wrapperClass;
  Object.entries(options.wrapperAttrs || {}).forEach(([key, value]) => {
    wrapper.setAttribute(key, value);
  });

  if (PRIMARY_CTA_META_LABEL) {
    const meta = document.createElement("span");
    meta.className = options.metaClass;
    meta.textContent = PRIMARY_CTA_META_LABEL;
    wrapper.appendChild(meta);
  }

  const link = document.createElement("a");
  link.className = options.linkClass;
  link.href = runtimeConfig.primaryCtaTarget;
  link.textContent = PRIMARY_CTA_LABEL;
  link.setAttribute("aria-label", PRIMARY_CTA_LABEL);

  wrapper.appendChild(link);
  return wrapper;
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
  noteLink.href = runtimeConfig.primaryCtaTarget;
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
    navCta.href = runtimeConfig.primaryCtaTarget;
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

const initTopNavScrollState = (topNav) => {
  if (!topNav) return;

  const topThreshold = 18;
  let ticking = false;

  const updateTopNavScrollState = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    topNav.classList.toggle("is-scrolled", currentScrollY > topThreshold);
    topNav.classList.remove("is-hidden");
    topNav.classList.remove("is-revealed");
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

    if (open && topNav) {
      topNav.classList.remove("is-hidden");
      topNav.classList.add("is-revealed");
    }

    if (mobileBreakpoint.matches) {
      primaryNav.setAttribute("aria-hidden", String(!open));
    } else {
      primaryNav.removeAttribute("aria-hidden");
    }

    document.body.classList.toggle("has-mobile-nav-open", open);
    document.documentElement.classList.toggle("has-mobile-nav-open", open);

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

const initNavUnderline = (primaryNav) => {
  if (!primaryNav) return;

  const desktopBreakpoint = window.matchMedia(`(min-width: ${NAV_MOBILE_BREAKPOINT + 1}px)`);
  const underline = document.createElement("span");
  underline.className = "nav-underline";
  underline.setAttribute("aria-hidden", "true");
  primaryNav.appendChild(underline);

  let isVisible = false;

  const positionUnderline = (link, options = {}) => {
    const styles = window.getComputedStyle(link);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const width = Math.max(link.offsetWidth - paddingLeft - paddingRight, 0);

    if (options.immediate) {
      underline.style.transition = "none";
    }

    underline.style.transform = `translateX(${link.offsetLeft + paddingLeft}px)`;
    underline.style.width = `${width}px`;

    if (options.immediate) {
      // Reflow erzwingen, damit die Position ohne Animation gesetzt wird
      void underline.offsetWidth;
      underline.style.transition = "";
    }

    underline.classList.add("is-visible");
    isVisible = true;
  };

  const showForLink = (link) => {
    if (!desktopBreakpoint.matches || !link) return;
    // Aus dem unsichtbaren Zustand direkt einblenden statt quer zu sliden
    positionUnderline(link, { immediate: !isVisible });
  };

  const restoreToActive = (options = {}) => {
    if (!desktopBreakpoint.matches) return;
    const activeLink = primaryNav.querySelector("a.nav-link.is-active");

    if (activeLink) {
      positionUnderline(activeLink, options);
      return;
    }

    underline.classList.remove("is-visible");
    isVisible = false;
  };

  primaryNav
    .querySelectorAll("a.nav-link:not(.nav-link--mobile-cta)")
    .forEach((link) => {
      link.addEventListener("mouseenter", () => showForLink(link));
      link.addEventListener("focusin", () => showForLink(link));
    });

  primaryNav.addEventListener("mouseleave", () => restoreToActive());
  primaryNav.addEventListener("focusout", (event) => {
    if (primaryNav.contains(event.relatedTarget)) return;
    restoreToActive();
  });

  window.addEventListener("resize", () => restoreToActive({ immediate: true }));

  if (document.fonts?.ready) {
    // Nach dem Font-Laden neu messen, sonst stimmt die Breite nicht
    document.fonts.ready.then(() => restoreToActive({ immediate: true }));
  }

  restoreToActive({ immediate: true });
};

const renderMobileStickyCta = (pageConfig, runtimeConfig) => {
  document.getElementById(MOBILE_STICKY_CTA_ID)?.remove();
  document.body.classList.remove("has-mobile-sticky-cta");

  if (!shouldShowMobileStickyCta(pageConfig)) return;

  const stickyWrapper = createPrimaryCtaBlock(runtimeConfig, {
    wrapperClass: "mobile-sticky-cta",
    metaClass: "mobile-sticky-cta__label",
    linkClass: "mobile-sticky-cta__link",
  });
  stickyWrapper.id = MOBILE_STICKY_CTA_ID;

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
    primaryCtaTarget: getPrimaryCtaTarget(),
    cookiePageTarget: getCookiePageTarget(),
    cookieSettingsTarget: getCookieSettingsTarget(),
  };

  updateBrandAndCtaLinks(pageConfig, runtimeConfig);
  renderPrimaryNavigation(primaryNav, runtimeConfig);
  renderFooterNavigation(footer, runtimeConfig);
  normalizeStandaloneLinks(runtimeConfig);

  initScrollToTop(scrollToTopButton);
  initTopNavScrollState(topNav);
  initNavUnderline(primaryNav);
  initMobileNavigation(glassNav, mobileNavToggle, primaryNav);
};
