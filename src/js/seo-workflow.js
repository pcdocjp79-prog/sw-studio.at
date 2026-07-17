const initSeoWorkflow = () => {
  const root = document.querySelector("[data-seo-workflow]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll("[data-workflow-step]"));
  const counter = root.querySelector("[data-workflow-counter]");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stateLabels = steps.map((step) => step.querySelector("[data-workflow-state]"));
  const cycleDuration = 3000;
  let activeIndex = 0;
  let cycleTimer = 0;
  let isVisible = false;
  let isPointerInside = false;

  if (steps.length === 0) return;

  const updateState = (nextIndex) => {
    activeIndex = Math.max(0, Math.min(steps.length - 1, nextIndex));
    root.dataset.workflowActive = String(activeIndex + 1);

    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === activeIndex);
      step.classList.toggle("is-complete", index < activeIndex);

      if (stateLabels[index]) {
        stateLabels[index].textContent = index < activeIndex
          ? "fertig"
          : index === activeIndex
            ? "aktiv"
            : "bereit";
      }
    });

    if (counter) {
      counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
    }
  };

  const stopCycle = () => {
    if (!cycleTimer) return;
    window.clearInterval(cycleTimer);
    cycleTimer = 0;
  };

  const startCycle = () => {
    stopCycle();
    root.classList.toggle(
      "is-running",
      isVisible && !reducedMotionQuery.matches && !document.hidden
    );
    if (!isVisible || isPointerInside || reducedMotionQuery.matches || document.hidden) return;

    cycleTimer = window.setInterval(() => {
      updateState((activeIndex + 1) % steps.length);
    }, cycleDuration);
  };

  steps.forEach((step, index) => {
    step.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse" || reducedMotionQuery.matches) return;
      isPointerInside = true;
      stopCycle();
      updateState(index);
    });
  });

  root.addEventListener("pointerleave", () => {
    isPointerInside = false;
    startCycle();
  });

  document.addEventListener("visibilitychange", startCycle);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        startCycle();
      },
      { rootMargin: "120px 0px", threshold: 0.12 }
    );

    observer.observe(root);
  } else {
    isVisible = true;
    startCycle();
  }

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", startCycle);
  }

  updateState(0);
};

initSeoWorkflow();
