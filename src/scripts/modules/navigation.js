export const initNavigation = () => {
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
  
      if (currentScrollY <= topThreshold) {
        topNav.classList.remove("is-hidden");
      } else if (scrollingDown) {
        topNav.classList.add("is-hidden");
      } else if (scrollingUp) {
        topNav.classList.remove("is-hidden");
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
  
    updateTopNavVisibility();
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
};

