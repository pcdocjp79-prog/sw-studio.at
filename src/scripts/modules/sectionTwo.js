export const initSectionTwoFeature = () => {
  // Boundaries:
  // - Section 2 tile glow
  // - Section 2 tile/panel interactions and pager logic
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
  const sectionTwoReducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let sectionTwoReducedMotion = sectionTwoReducedMotionQuery.matches;
  const sectionTwoLineItemSelector =
    ".tile-detail-panel__eyebrow, .tile-detail-panel__title, .tile-detail-panel__text, .tile-detail-panel__pager-subheading, .tile-detail-panel__pager-list li, .tile-detail-panel__pager-steps li";
  const sectionTwoPagerConfigs = [
    {
      panelId: "webdev-detail-panel",
      slideSelector: "[data-webdev-slide]",
      prevButtonId: "webdev-part-prev",
      nextButtonId: "webdev-part-next",
      indicatorId: "webdev-part-indicator",
    },
    {
      panelId: "seo-detail-panel",
      slideSelector: "[data-seo-slide]",
      prevButtonId: "seo-part-prev",
      nextButtonId: "seo-part-next",
      indicatorId: "seo-part-indicator",
    },
    {
      panelId: "branding-detail-panel",
      slideSelector: "[data-branding-slide]",
      prevButtonId: "branding-part-prev",
      nextButtonId: "branding-part-next",
      indicatorId: "branding-part-indicator",
    },
  ];
  let activeSectionTwoTileCard = null;
  let activeSectionTwoDetailPanel = null;
  let sectionTwoPositionRafId = null;
  let sectionTwoSafeInsetRafId = null;
  let sectionTwoSafeInsetMonitorUntil = 0;
  
  const setSectionTwoTileActive = (tileCard, isActive) => {
    const activeState = String(isActive);
    tileCard.classList.toggle("is-media-active", isActive);
    tileCard.setAttribute("aria-pressed", activeState);
    if (tileCard.hasAttribute("aria-controls")) {
      tileCard.setAttribute("aria-expanded", activeState);
    }
  };
  
  const setSectionTwoDetailPanelVisible = (detailPanel, isVisible) => {
    if (!detailPanel) return;
    detailPanel.classList.toggle("is-visible", isVisible);
    detailPanel.setAttribute("aria-hidden", String(!isVisible));
  };
  
  const setSectionTwoLineIndices = (container) => {
    if (!container) return;
    let lineIndex = 0;
  
    container.querySelectorAll(sectionTwoLineItemSelector).forEach((lineItem) => {
      lineItem.setAttribute("data-line-item", "");
      lineItem.style.setProperty("--line-index", String(lineIndex));
      lineIndex += 1;
    });
  };
  
  const getSectionTwoLineAnimationContainer = (detailPanel) => {
    if (!detailPanel) return null;
    const activePagerSlide = detailPanel.querySelector("[data-pager-slide].is-active");
    if (activePagerSlide) return activePagerSlide;
    return detailPanel.querySelector(".tile-detail-panel__content");
  };
  
  const resetSectionTwoLineAnimation = (detailPanel) => {
    if (!detailPanel) return;
    detailPanel.querySelectorAll(".is-lines-active").forEach((container) => {
      container.classList.remove("is-lines-active");
    });
  };
  
  const triggerSectionTwoLineAnimation = (container, baseDelayMs = 190) => {
    if (!container) return;
  
    const detailPanel = container.closest(".tile-detail-panel");
    if (detailPanel) {
      const containerRect = container.getBoundingClientRect();
      const entersFromLeft = detailPanel.classList.contains("tile-detail-panel--from-left");
      const entryTravel = window.innerWidth + containerRect.width + 80;
      const dynamicEnterX = entersFromLeft ? -entryTravel : entryTravel;
      container.style.setProperty("--line-enter-x", `${dynamicEnterX.toFixed(2)}px`);
    }
  
    container.style.setProperty("--line-base-delay", `${Math.max(baseDelayMs, 0)}ms`);
    container.classList.remove("is-lines-active");
  
    if (sectionTwoReducedMotion) {
      container.classList.add("is-lines-active");
      return;
    }
  
    void container.offsetWidth;
    container.classList.add("is-lines-active");
  };
  
  sectionTwoDetailPanels.forEach((detailPanel) => {
    const pagerSlides = detailPanel.querySelectorAll("[data-pager-slide]");
    if (pagerSlides.length > 0) {
      pagerSlides.forEach((slide) => {
        setSectionTwoLineIndices(slide);
      });
      return;
    }
  
    const content = detailPanel.querySelector(".tile-detail-panel__content");
    setSectionTwoLineIndices(content);
  });
  
  const createSectionTwoPagerController = (config) => {
    const detailPanel = document.getElementById(config.panelId);
    if (!detailPanel) return null;
  
    const slides = Array.from(detailPanel.querySelectorAll(config.slideSelector));
    if (slides.length === 0) return null;
  
    const prevButton = document.getElementById(config.prevButtonId);
    const nextButton = document.getElementById(config.nextButtonId);
    const indicator = document.getElementById(config.indicatorId);
  
    let partIndex = 0;
    let navRevealTimeoutId = null;
  
    const clearNavRevealTimer = () => {
      if (navRevealTimeoutId === null) return;
      window.clearTimeout(navRevealTimeoutId);
      navRevealTimeoutId = null;
    };
  
    const setNavVisible = (isVisible) => {
      detailPanel.classList.toggle("is-pager-nav-hidden", !isVisible);
    };
  
    const scheduleNavReveal = (delayMs = 0) => {
      clearNavRevealTimer();
      setNavVisible(false);
  
      const resolvedDelay = sectionTwoReducedMotion ? 0 : Math.max(delayMs, 0);
      navRevealTimeoutId = window.setTimeout(() => {
        setNavVisible(true);
        navRevealTimeoutId = null;
      }, resolvedDelay);
    };
  
    const update = () => {
      const lastIndex = slides.length - 1;
      partIndex = Math.max(0, Math.min(partIndex, lastIndex));
  
      slides.forEach((slide, index) => {
        const isActive = index === partIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });
  
      if (indicator) {
        indicator.textContent = `${partIndex + 1} / ${slides.length}`;
      }
  
      prevButton?.classList.toggle("is-hidden", partIndex === 0);
      nextButton?.classList.toggle("is-hidden", partIndex === lastIndex);
  
      if (detailPanel.classList.contains("is-visible")) {
        const openingRun = detailPanel.hasAttribute("data-lines-opening");
        const openingDelay = sectionTwoReducedMotion ? 0 : 620;
        const baseDelay = openingRun ? openingDelay : 120;
        triggerSectionTwoLineAnimation(slides[partIndex], baseDelay);
  
        if (openingRun) {
          scheduleNavReveal(openingDelay);
          detailPanel.removeAttribute("data-lines-opening");
        } else {
          clearNavRevealTimer();
          setNavVisible(true);
        }
      }
    };
  
    const reset = () => {
      partIndex = 0;
      update();
    };
  
    prevButton?.addEventListener("click", () => {
      partIndex -= 1;
      update();
    });
  
    nextButton?.addEventListener("click", () => {
      partIndex += 1;
      update();
    });
  
    update();
  
    return {
      detailPanel,
      open: () => {
        detailPanel.setAttribute("data-lines-opening", "true");
        setNavVisible(false);
        reset();
      },
      teardown: () => {
        clearNavRevealTimer();
        setNavVisible(true);
      },
    };
  };
  
  const sectionTwoPagerControllers = sectionTwoPagerConfigs
    .map((pagerConfig) => createSectionTwoPagerController(pagerConfig))
    .filter((pagerController) => Boolean(pagerController));
  
  const sectionTwoPagerControllersByPanelId = new Map(
    sectionTwoPagerControllers.map((pagerController) => [pagerController.detailPanel.id, pagerController])
  );
  
  const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));
  
  const resetSectionTwoDetailPanelSafeInsets = (detailPanel) => {
    if (!detailPanel) return;
    detailPanel.style.setProperty("--detail-panel-safe-start", "0px");
    detailPanel.style.setProperty("--detail-panel-safe-end", "0px");
  };
  
  const updateSectionTwoDetailPanelSafeInsets = (tileCard, detailPanel) => {
    if (!tileCard || !detailPanel) return;
  
    const mediaElement = tileCard.querySelector(".tile-card-media--filled");
    if (!mediaElement) {
      resetSectionTwoDetailPanelSafeInsets(detailPanel);
      return;
    }
  
    const detailPanelRect = detailPanel.getBoundingClientRect();
    const mediaRect = mediaElement.getBoundingClientRect();
    if (detailPanelRect.width <= 0 || detailPanelRect.height <= 0) {
      resetSectionTwoDetailPanelSafeInsets(detailPanel);
      return;
    }
  
    const overlapWidth = Math.max(
      0,
      Math.min(detailPanelRect.right, mediaRect.right) - Math.max(detailPanelRect.left, mediaRect.left)
    );
    const overlapHeight = Math.max(
      0,
      Math.min(detailPanelRect.bottom, mediaRect.bottom) - Math.max(detailPanelRect.top, mediaRect.top)
    );
  
    if (overlapWidth <= 0 || overlapHeight <= 0) {
      resetSectionTwoDetailPanelSafeInsets(detailPanel);
      return;
    }
  
    const overlapCenterX = Math.max(detailPanelRect.left, mediaRect.left) + overlapWidth / 2;
    const detailPanelCenterX = detailPanelRect.left + detailPanelRect.width / 2;
    const visiblePanelLeft = Math.max(detailPanelRect.left, 0);
    const visiblePanelRight = Math.min(detailPanelRect.right, window.innerWidth);
    const visiblePanelWidth = Math.max(1, visiblePanelRight - visiblePanelLeft);
    const insetGap = 16;
    const maxInset = visiblePanelWidth * 0.38;
    const safeInset = Math.min(overlapWidth + insetGap, maxInset);
  
    if (overlapCenterX <= detailPanelCenterX) {
      detailPanel.style.setProperty("--detail-panel-safe-start", `${safeInset.toFixed(2)}px`);
      detailPanel.style.setProperty("--detail-panel-safe-end", "0px");
      return;
    }
  
    detailPanel.style.setProperty("--detail-panel-safe-start", "0px");
    detailPanel.style.setProperty("--detail-panel-safe-end", `${safeInset.toFixed(2)}px`);
  };
  
  const syncActiveSectionTwoDetailPanelSafeInsets = () => {
    if (!activeSectionTwoTileCard || !activeSectionTwoDetailPanel) return;
    updateSectionTwoDetailPanelSafeInsets(activeSectionTwoTileCard, activeSectionTwoDetailPanel);
  };
  
  const monitorActiveSectionTwoDetailPanelSafeInsets = () => {
    syncActiveSectionTwoDetailPanelSafeInsets();
  
    if (performance.now() < sectionTwoSafeInsetMonitorUntil && activeSectionTwoTileCard && activeSectionTwoDetailPanel) {
      sectionTwoSafeInsetRafId = requestAnimationFrame(monitorActiveSectionTwoDetailPanelSafeInsets);
      return;
    }
  
    sectionTwoSafeInsetRafId = null;
  };
  
  const stopSectionTwoSafeInsetMonitor = () => {
    if (sectionTwoSafeInsetRafId !== null) {
      cancelAnimationFrame(sectionTwoSafeInsetRafId);
      sectionTwoSafeInsetRafId = null;
    }
    sectionTwoSafeInsetMonitorUntil = 0;
  };
  
  const startSectionTwoSafeInsetMonitor = (durationMs = 680) => {
    if (!activeSectionTwoTileCard || !activeSectionTwoDetailPanel) return;
    sectionTwoSafeInsetMonitorUntil = performance.now() + durationMs;
    if (sectionTwoSafeInsetRafId !== null) return;
    sectionTwoSafeInsetRafId = requestAnimationFrame(monitorActiveSectionTwoDetailPanelSafeInsets);
  };
  
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
      sectionTwoPagerControllers.forEach((pagerController) => {
        pagerController.teardown();
      });
  
      sectionTwoTileCards.forEach((tileCard) => {
        setSectionTwoTileActive(tileCard, false);
      });
  
      sectionTwoDetailPanels.forEach((detailPanel) => {
        setSectionTwoDetailPanelVisible(detailPanel, false);
        clearSectionTwoDetailPanelPosition(detailPanel);
        resetSectionTwoDetailPanelSafeInsets(detailPanel);
        resetSectionTwoLineAnimation(detailPanel);
        detailPanel.removeAttribute("data-lines-opening");
      });
  
      stopSectionTwoSafeInsetMonitor();
      activeSectionTwoTileCard = null;
      activeSectionTwoDetailPanel = null;
    };
  
    sectionTwoTileCards.forEach((tileCard) => {
      const linkedPanelId = tileCard.dataset.detailPanel;
      const linkedDetailPanel = linkedPanelId ? sectionTwoDetailPanelsById.get(linkedPanelId) : null;
  
      tileCard.setAttribute("role", "button");
      tileCard.setAttribute("tabindex", "0");
      tileCard.setAttribute("aria-pressed", "false");
      if (linkedDetailPanel) {
        tileCard.setAttribute("aria-controls", linkedDetailPanel.id);
        tileCard.setAttribute("aria-expanded", "false");
      }
  
      const toggleTileCard = () => {
        const shouldActivate = !tileCard.classList.contains("is-media-active");
        closeSectionTwoTiles();
        if (!shouldActivate) return;
  
        activeSectionTwoTileCard = tileCard;
        activeSectionTwoDetailPanel = linkedDetailPanel;
        setSectionTwoTileActive(tileCard, true);
        positionSectionTwoDetailPanel(tileCard, linkedDetailPanel);
        setSectionTwoDetailPanelVisible(linkedDetailPanel, true);
  
        const linkedPagerController = linkedDetailPanel
          ? sectionTwoPagerControllersByPanelId.get(linkedDetailPanel.id)
          : null;
  
        if (linkedPagerController) {
          linkedPagerController.open();
        } else {
          triggerSectionTwoLineAnimation(getSectionTwoLineAnimationContainer(linkedDetailPanel), 360);
        }
  
        if (linkedDetailPanel) {
          startSectionTwoSafeInsetMonitor();
        }
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
  
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!activeSectionTwoTileCard) return;
      closeSectionTwoTiles();
    });
  
    window.addEventListener("resize", () => {
      requestActiveSectionTwoDetailPanelPosition();
      startSectionTwoSafeInsetMonitor(320);
    });
  
    closeSectionTwoTiles();
  } else {
    sectionTwoDetailPanels.forEach((detailPanel) => {
      detailPanel.setAttribute("aria-hidden", "true");
    });
  }
  
  const handleSectionTwoReducedMotionChange = (event) => {
    sectionTwoReducedMotion = event.matches;
  };
  
  if (typeof sectionTwoReducedMotionQuery.addEventListener === "function") {
    sectionTwoReducedMotionQuery.addEventListener("change", handleSectionTwoReducedMotionChange);
  } else if (typeof sectionTwoReducedMotionQuery.addListener === "function") {
    sectionTwoReducedMotionQuery.addListener(handleSectionTwoReducedMotionChange);
  }
  
};

