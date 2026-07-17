/* SEO Flow — interaktive Phasen-Section auf seo-marketing.html
   Links klickbare Phasen (Disclosure), rechts wechselnder Viewer.
   Vanilla JS, modular, ohne Abhängigkeiten. */
const initSeoFlow = () => {
  const root = document.querySelector("[data-seo-flow]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll("[data-flow-step]"));
  const triggers = Array.from(root.querySelectorAll("[data-flow-trigger]"));
  const details = Array.from(root.querySelectorAll("[data-flow-detail]"));
  const scenes = Array.from(root.querySelectorAll("[data-flow-scene]"));
  const moduleLabel = root.querySelector("[data-flow-module]");
  const signalLabel = root.querySelector("[data-flow-signal]");
  const ticks = Array.from(root.querySelectorAll("[data-flow-ticks] span"));
  const fill = root.querySelector("[data-flow-fill]");
  const viewer = root.querySelector("[data-flow-viewer]");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(pointer: fine)");
  const desktopTiltQuery = window.matchMedia("(min-width: 1024px)");
  const leaveTimers = new WeakMap();
  const signalLabels = [
    "INTENT_MAP",
    "INDEX_READY",
    "READ_PATH",
    "TRUST_LAYER",
    "REQUEST_READY",
  ];

  if (triggers.length === 0) return;

  let current = Number(steps.find((step) => step.classList.contains("is-active"))?.dataset.flowStep) || 1;
  let resizeFrame = 0;

  const prefersReducedMotion = () => reducedMotionQuery.matches;

  const updateFill = (id = current) => {
    if (!fill || steps.length < 2) return;

    const activeIndex = Math.max(0, steps.findIndex((step) => step.dataset.flowStep === String(id)));
    const progress = (activeIndex / (steps.length - 1)) * 100;
    fill.style.setProperty("--seo-flow-fill", `${progress}%`);
  };

  const setActive = (id) => {
    const next = Number(id);
    const key = String(next);
    if (!steps.some((step) => step.dataset.flowStep === key)) return;

    if (viewer) {
      viewer.dataset.flowDirection = next < current ? "backward" : "forward";
      viewer.dataset.flowState = key;
    }

    current = next;

    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.flowStep === key);
    });

    triggers.forEach((trigger) => {
      const isActiveTrigger = trigger.dataset.flowTrigger === key;
      trigger.setAttribute("aria-expanded", String(isActiveTrigger));

      if (isActiveTrigger) {
        trigger.setAttribute("aria-current", "step");
      } else {
        trigger.removeAttribute("aria-current");
      }
    });

    details.forEach((detail) => {
      const isActiveDetail = detail.dataset.flowDetail === key;
      detail.classList.toggle("is-active", isActiveDetail);
      detail.setAttribute("aria-hidden", String(!isActiveDetail));
    });

    scenes.forEach((scene) => {
      const isActiveScene = scene.dataset.flowScene === key;
      const wasActive = scene.classList.contains("is-active");
      const leaveTimer = leaveTimers.get(scene);

      if (leaveTimer) window.clearTimeout(leaveTimer);

      if (isActiveScene) {
        scene.classList.remove("is-leaving");
        scene.classList.remove("is-active");
        void scene.offsetWidth;
        scene.classList.add("is-active");
        return;
      }

      if (wasActive) {
        scene.classList.add("is-leaving");
        leaveTimers.set(
          scene,
          window.setTimeout(() => scene.classList.remove("is-leaving"), 380)
        );
      }

      scene.classList.remove("is-active");
    });

    if (moduleLabel) moduleLabel.textContent = `MODUL_${String(next).padStart(2, "0")}`;
    if (signalLabel) {
      signalLabel.textContent = signalLabels[next - 1] || signalLabels[0];
      signalLabel.classList.remove("is-refreshing");
      void signalLabel.offsetWidth;
      signalLabel.classList.add("is-refreshing");
    }

    ticks.forEach((tick, index) => {
      tick.classList.toggle("is-on", index < next);
    });

    window.requestAnimationFrame(() => updateFill(next));
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setActive(trigger.dataset.flowTrigger);
    });
  });

  root.addEventListener("keydown", (event) => {
    const isForward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const isBackward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const isBoundary = event.key === "Home" || event.key === "End";
    if (!isForward && !isBackward && !isBoundary) return;
    const index = triggers.indexOf(document.activeElement);
    if (index === -1) return;

    event.preventDefault();
    let next = index;

    if (event.key === "Home") next = 0;
    if (event.key === "End") next = triggers.length - 1;
    if (isForward) next = (index + 1) % triggers.length;
    if (isBackward) next = (index - 1 + triggers.length) % triggers.length;

    triggers[next].focus();
    setActive(triggers[next].dataset.flowTrigger);
  });

  const maxViewerTilt = 4;
  const viewerPointerInfluence = 0.58;
  const viewerLerpFactor = 0.1;
  let viewerTargetX = 0;
  let viewerTargetY = 0;
  let viewerCurrentX = 0;
  let viewerCurrentY = 0;
  let viewerRafId = null;
  let viewerRect = null;
  let viewerRectRafId = null;

  const canTiltViewer = () =>
    Boolean(viewer) &&
    !prefersReducedMotion() &&
    finePointerQuery.matches &&
    desktopTiltQuery.matches;

  const updateViewerRect = () => {
    if (!viewer) return;
    const rect = viewer.getBoundingClientRect();
    viewerRect = rect.width > 0 && rect.height > 0 ? rect : null;
  };

  const requestViewerRectUpdate = () => {
    if (!viewer || viewerRectRafId !== null) return;
    viewerRectRafId = window.requestAnimationFrame(() => {
      updateViewerRect();
      viewerRectRafId = null;
    });
  };

  const setViewerVisualState = (normalizedX, normalizedY) => {
    if (!viewer) return;

    const rotateX = (-normalizedY * maxViewerTilt).toFixed(2);
    const rotateY = (normalizedX * maxViewerTilt).toFixed(2);

    viewer.style.setProperty("--seo-flow-tilt-x", `${rotateX}deg`);
    viewer.style.setProperty("--seo-flow-tilt-y", `${rotateY}deg`);
  };

  const renderViewerTilt = () => {
    viewerCurrentX += (viewerTargetX - viewerCurrentX) * viewerLerpFactor;
    viewerCurrentY += (viewerTargetY - viewerCurrentY) * viewerLerpFactor;
    setViewerVisualState(viewerCurrentX, viewerCurrentY);

    const settled =
      Math.abs(viewerTargetX - viewerCurrentX) < 0.002 &&
      Math.abs(viewerTargetY - viewerCurrentY) < 0.002;

    if (settled) {
      viewerCurrentX = viewerTargetX;
      viewerCurrentY = viewerTargetY;
      setViewerVisualState(viewerCurrentX, viewerCurrentY);
      viewerRafId = null;
      return;
    }

    viewerRafId = window.requestAnimationFrame(renderViewerTilt);
  };

  const queueViewerRender = () => {
    if (viewerRafId !== null) return;
    viewerRafId = window.requestAnimationFrame(renderViewerTilt);
  };

  const setViewerPointerTarget = (event) => {
    if (!viewer) return;
    if (!viewerRect) updateViewerRect();
    if (!viewerRect) return;

    const relativeX = Math.max(0, Math.min(1, (event.clientX - viewerRect.left) / viewerRect.width));
    const relativeY = Math.max(0, Math.min(1, (event.clientY - viewerRect.top) / viewerRect.height));
    const normalizedX = relativeX * 2 - 1;
    const normalizedY = relativeY * 2 - 1;

    viewerTargetX = Math.max(-1, Math.min(1, normalizedX * viewerPointerInfluence));
    viewerTargetY = Math.max(-1, Math.min(1, normalizedY * viewerPointerInfluence));
    queueViewerRender();
  };

  const resetViewer = (instant = false) => {
    if (!viewer) return;
    viewerTargetX = 0;
    viewerTargetY = 0;

    if (!instant) {
      queueViewerRender();
      return;
    }

    if (viewerRafId !== null) {
      window.cancelAnimationFrame(viewerRafId);
      viewerRafId = null;
    }

    viewerCurrentX = 0;
    viewerCurrentY = 0;
    setViewerVisualState(0, 0);
  };

  if (viewer) {
    viewer.addEventListener(
      "pointerenter",
      (event) => {
        if (!canTiltViewer()) {
          resetViewer(true);
          return;
        }

        updateViewerRect();
        setViewerPointerTarget(event);
      },
      { passive: true }
    );

    viewer.addEventListener(
      "pointermove",
      (event) => {
        if (!canTiltViewer()) {
          resetViewer(true);
          return;
        }

        setViewerPointerTarget(event);
      },
      { passive: true }
    );

    viewer.addEventListener("pointerleave", () => resetViewer());
    viewer.addEventListener("pointercancel", () => resetViewer());
    window.addEventListener("resize", requestViewerRectUpdate);
    window.addEventListener("scroll", requestViewerRectUpdate, { passive: true });

    if ("IntersectionObserver" in window) {
      const viewerObserver = new IntersectionObserver(
        ([entry]) => {
          viewer.classList.toggle("is-paused", !entry.isIntersecting);
        },
        { rootMargin: "120px 0px", threshold: 0.08 }
      );

      viewerObserver.observe(viewer);
    }
  }

  const syncMotionPreference = () => {
    if (prefersReducedMotion()) {
      resetViewer(true);
      updateFill(current);
      return;
    }

    updateFill(current);
  };

  const scheduleFillUpdate = () => {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      updateFill(current);
    });
  };

  window.addEventListener("resize", scheduleFillUpdate);

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", syncMotionPreference);
    finePointerQuery.addEventListener("change", () => resetViewer(true));
    desktopTiltQuery.addEventListener("change", () => resetViewer(true));
  }

  setActive(1);
};

initSeoFlow();
