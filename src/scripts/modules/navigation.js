const HOME_PATH = "index.html";
const NAV_LINK_CLASS = "nav-link rounded-full px-3 sm:px-5 py-1.5 text-sm sm:text-sm font-medium";
const NAV_MOBILE_CTA_CLASS = `${NAV_LINK_CLASS} nav-link--mobile-cta`;
const DEFAULT_COOKIE_NOTE =
  "Cookie-Einstellungen folgen nach Integration des Consent-Tools.";

const HOME_ENTRY_LINKS = [
  { type: "contact", label: "Erstgespr\u00e4ch buchen" },
  { type: "contact", label: "Mini-Audit anfordern" },
  { type: "section", id: "process", label: "Prozess" },
  { type: "section", id: "pricing", label: "Pakete" },
];

const PAGE_CONFIGS = {
  home: {
    path: HOME_PATH,
    navCtaLabel: "Erstgespr\u00e4ch buchen",
    navLinks: [
      { type: "section", id: "services", label: "Leistungen" },
      { type: "section", id: "process", label: "Ablauf" },
      { type: "section", id: "pricing", label: "Pakete" },
      { type: "section", id: "about", label: "\u00dcber mich" },
      { type: "section", id: "kontakt", label: "Kontakt" },
    ],
    footerEntryLinks: HOME_ENTRY_LINKS,
  },
  branding: {
    path: "branding.html",
    navCtaLabel: "Erstgespr\u00e4ch buchen",
    navLinks: [
      { type: "page", path: HOME_PATH, label: "Start" },
      { type: "section", id: "services", label: "Problem" },
      { type: "section", id: "process", label: "Ansatz" },
      { type: "section", id: "pricing", label: "Deliverables" },
      { type: "section", id: "about", label: "Rebranding" },
      { type: "contact", label: "Kontakt" },
    ],
    footerEntryLinks: [
      { type: "contact", label: "Erstgespr\u00e4ch buchen" },
      { type: "contact", label: "Mini-Audit anfordern" },
      { type: "section", id: "process", label: "Ansatz" },
      { type: "section", id: "pricing", label: "Deliverables" },
    ],
  },
  webentwicklung: {
    path: "webentwicklung.html",
    navCtaLabel: "Erstgespr\u00e4ch buchen",
    navLinks: [
      { type: "page", path: HOME_PATH, label: "Start" },
      { type: "section", id: "services", label: "Problem" },
      { type: "section", id: "process", label: "Vorgehen" },
      { type: "section", id: "pricing", label: "Was ich baue" },
      { type: "section", id: "about", label: "Standards" },
      { type: "contact", label: "Kontakt" },
    ],
    footerEntryLinks: [
      { type: "contact", label: "Erstgespr\u00e4ch buchen" },
      { type: "contact", label: "Mini-Audit anfordern" },
      { type: "section", id: "process", label: "Vorgehen" },
      { type: "section", id: "pricing", label: "Was ich baue" },
    ],
  },
  marketing: {
    path: "marketing.html",
    navCtaLabel: "Erstgespr\u00e4ch buchen",
    navLinks: [
      { type: "page", path: HOME_PATH, label: "Start" },
      { type: "section", id: "services", label: "Problem" },
      { type: "section", id: "process", label: "Ansatz" },
      { type: "section", id: "pricing", label: "Tracking" },
      { type: "section", id: "about", label: "Skalierung" },
      { type: "contact", label: "Kontakt" },
    ],
    footerEntryLinks: [
      { type: "contact", label: "Erstgespr\u00e4ch buchen" },
      { type: "contact", label: "Mini-Audit anfordern" },
      { type: "section", id: "process", label: "Ansatz" },
      { type: "section", id: "pricing", label: "Tracking" },
    ],
  },
  impressum: {
    path: "impressum.html",
    navCtaLabel: "Kontakt aufnehmen",
    navLinks: [
      { type: "page", path: HOME_PATH, label: "Startseite" },
      { type: "page", path: `${HOME_PATH}#services`, label: "Leistungen" },
      { type: "contact", label: "Kontakt" },
    ],
    footerEntryLinks: [
      { type: "contact", label: "Erstgespr\u00e4ch buchen" },
      { type: "contact", label: "Mini-Audit anfordern" },
      { type: "page", path: `${HOME_PATH}#process`, label: "Prozess" },
      { type: "page", path: `${HOME_PATH}#pricing`, label: "Pakete" },
    ],
  },
  datenschutz: {
    path: "datenschutz.html",
    navCtaLabel: "Kontakt aufnehmen",
    navLinks: [
      { type: "page", path: HOME_PATH, label: "Startseite" },
      { type: "page", path: `${HOME_PATH}#services`, label: "Leistungen" },
      { type: "contact", label: "Kontakt" },
    ],
    footerEntryLinks: [
      { type: "contact", label: "Erstgespr\u00e4ch buchen" },
      { type: "contact", label: "Mini-Audit anfordern" },
      { type: "page", path: `${HOME_PATH}#process`, label: "Prozess" },
      { type: "page", path: `${HOME_PATH}#pricing`, label: "Pakete" },
    ],
  },
};

const FOOTER_SERVICE_LINKS = [
  { type: "page", path: "branding.html", label: "Branding & Positionierung", pageKey: "branding" },
  { type: "page", path: "webentwicklung.html", label: "Webentwicklung", pageKey: "webentwicklung" },
  { type: "page", path: "marketing.html", label: "Marketing & Growth", pageKey: "marketing" },
];

const FOOTER_LEGAL_LINKS = [
  { type: "page", path: "impressum.html", label: "Impressum / Anbieterkennzeichnung", pageKey: "impressum" },
  { type: "page", path: "datenschutz.html", label: "Datenschutz", pageKey: "datenschutz" },
  { type: "cookie", label: "Cookie-Einstellungen" },
];

const getCurrentPageKey = () => {
  const explicitPageKey = document.body?.dataset.page?.trim();
  if (explicitPageKey && PAGE_CONFIGS[explicitPageKey]) {
    return explicitPageKey;
  }

  const rawPath = window.location.pathname.replace(/\\/g, "/").replace(/\/+$/, "");
  const slug = rawPath.split("/").pop() || "";
  const normalized = slug.replace(/\.html$/i, "");

  if (!normalized || normalized === "index") return "home";
  if (PAGE_CONFIGS[normalized]) return normalized;

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

const hasLocalContactDestination = () => {
  const contactMode = document.body?.dataset.contactMode?.trim();

  if (contactMode === "local") return true;
  if (contactMode === "global") return false;

  return Boolean(document.querySelector("[data-contact-form]"));
};

const getContactTarget = () => (hasLocalContactDestination() ? "#kontakt" : `${HOME_PATH}#kontakt`);

const getCookieTarget = () => {
  const configuredTarget = document.body?.dataset.cookieTarget?.trim();
  return configuredTarget || "#cookie-einstellungen";
};

const isCurrentPageLink = (path, currentPagePath) => {
  const normalizedPath = (path || "").split("#")[0];
  return normalizedPath === currentPagePath;
};

const getResolvedHref = (link, runtimeConfig) => {
  switch (link.type) {
    case "section":
      return `#${link.id}`;
    case "contact":
      return runtimeConfig.contactTarget;
    case "cookie":
      return runtimeConfig.cookieTarget;
    case "page":
    default:
      return link.path || HOME_PATH;
  }
};

const createLinkElement = (link, runtimeConfig, options = {}) => {
  const anchor = document.createElement("a");
  const href = getResolvedHref(link, runtimeConfig);
  const isLocalSection = link.type === "section";
  const isLocalContact = link.type === "contact" && runtimeConfig.contactTarget === "#kontakt";

  anchor.href = href;
  anchor.textContent = link.label;

  if (options.className) {
    anchor.className = options.className;
  }

  if (isLocalSection || isLocalContact) {
    anchor.setAttribute("data-nav-section", "");
  }

  const isCurrentPage =
    link.type === "page" &&
    isCurrentPageLink(link.path, runtimeConfig.currentPagePath) &&
    !String(link.path || "").includes("#");

  if (isCurrentPage) {
    anchor.setAttribute("aria-current", "page");
  }

  if (link.type === "cookie" && runtimeConfig.cookieIsPlaceholder) {
    anchor.title = DEFAULT_COOKIE_NOTE;
    anchor.setAttribute("data-placeholder-link", "cookie");
  }

  return anchor;
};

const renderPrimaryNavigation = (primaryNav, pageConfig, runtimeConfig) => {
  if (!primaryNav || !pageConfig) return;

  const fragment = document.createDocumentFragment();

  pageConfig.navLinks.forEach((link) => {
    fragment.appendChild(
      createLinkElement(link, runtimeConfig, { className: NAV_LINK_CLASS })
    );
  });

  const mobileCta = document.createElement("a");
  mobileCta.href = runtimeConfig.contactTarget;
  mobileCta.className = NAV_MOBILE_CTA_CLASS;
  mobileCta.textContent = pageConfig.navCtaLabel;
  fragment.appendChild(mobileCta);

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

const upsertCookiePlaceholderNote = (footer, runtimeConfig) => {
  if (!footer) return;

  const legalGroup = footer.querySelector('[data-footer-group="legal"]');
  if (!legalGroup) return;

  let note = legalGroup.querySelector("[data-cookie-placeholder]");

  if (!runtimeConfig.cookieIsPlaceholder) {
    note?.remove();
    return;
  }

  if (!note) {
    note = document.createElement("p");
    note.className = "site-footer__note";
    note.setAttribute("data-cookie-placeholder", "");
    legalGroup.appendChild(note);
  }

  note.textContent = DEFAULT_COOKIE_NOTE;
};

const renderFooterNavigation = (footer, pageConfig, runtimeConfig) => {
  if (!footer || !pageConfig) return;

  renderFooterList(
    footer.querySelector('[data-footer-group="services"] .site-footer__list'),
    FOOTER_SERVICE_LINKS,
    runtimeConfig
  );

  renderFooterList(
    footer.querySelector('[data-footer-group="entry"] .site-footer__list'),
    pageConfig.footerEntryLinks || HOME_ENTRY_LINKS,
    runtimeConfig
  );

  renderFooterList(
    footer.querySelector('[data-footer-group="legal"] .site-footer__list'),
    FOOTER_LEGAL_LINKS,
    runtimeConfig
  );

  upsertCookiePlaceholderNote(footer, runtimeConfig);
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
    navCta.href = runtimeConfig.contactTarget;
    navCta.textContent = pageConfig.navCtaLabel;
    navCta.setAttribute("aria-label", pageConfig.navCtaLabel);
  }
};

const normalizeStandaloneLinks = (runtimeConfig) => {
  document.querySelectorAll('a[href="/"]').forEach((link) => {
    link.href = HOME_PATH;
  });

  document
    .querySelectorAll(`a[href="#kontakt"], a[href="${HOME_PATH}#kontakt"]`)
    .forEach((link) => {
      if (link.closest("#primary-nav")) return;
      link.href = runtimeConfig.contactTarget;
    });

  document
    .querySelectorAll(`a[href="#cookie-einstellungen"], a[href="${HOME_PATH}#cookie-einstellungen"]`)
    .forEach((link) => {
      link.href = runtimeConfig.cookieTarget;

      if (runtimeConfig.cookieIsPlaceholder) {
        link.title = DEFAULT_COOKIE_NOTE;
        link.setAttribute("data-placeholder-link", "cookie");
      } else {
        link.removeAttribute("title");
        link.removeAttribute("data-placeholder-link");
      }
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

  window.addEventListener("scroll", requestTopNavStateUpdate, { passive: true });
  window.addEventListener("resize", requestTopNavStateUpdate);
  updateTopNavScrollState();
};

const initMobileNavigation = (glassNav, mobileNavToggle, primaryNav) => {
  if (!glassNav || !mobileNavToggle || !primaryNav) return;

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
    contactTarget: getContactTarget(),
    cookieTarget: getCookieTarget(),
    cookieIsPlaceholder: !document.querySelector("[data-cookie-settings]"),
  };

  updateBrandAndCtaLinks(pageConfig, runtimeConfig);
  renderPrimaryNavigation(primaryNav, pageConfig, runtimeConfig);
  renderFooterNavigation(footer, pageConfig, runtimeConfig);
  normalizeStandaloneLinks(runtimeConfig);

  initScrollToTop(scrollToTopButton);
  initTopNavScrollState(topNav);
  initMobileNavigation(glassNav, mobileNavToggle, primaryNav);
  initActiveSectionObserver(primaryNav);
};

