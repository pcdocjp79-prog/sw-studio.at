const initWebdevServiceAccordion = () => {
  const root = document.querySelector("[data-webdev-service-accordion]");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll("[data-webdev-service-tab]"));
  const panels = Array.from(root.querySelectorAll("[data-webdev-service-panel]"));
  if (tabs.length === 0 || panels.length === 0 || tabs.length !== panels.length) return;

  const stageNodes = Array.from(root.querySelectorAll("[data-webdev-service-node]"));
  const count = root.querySelector("[data-webdev-service-count]");
  const currentLabel = root.querySelector("[data-webdev-service-label]");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  let activeIndex = Math.max(0, panels.findIndex((panel) => panel.classList.contains("is-active")));

  const formatIndex = (index) => String(index + 1).padStart(2, "0");
  const totalCount = String(panels.length).padStart(2, "0");

  const setActivePanel = (nextIndex, { moveFocus = false } = {}) => {
    const normalizedIndex = (nextIndex + panels.length) % panels.length;
    activeIndex = normalizedIndex;

    root.dataset.activeIndex = String(normalizedIndex);
    root.style.setProperty("--service-active-index", String(normalizedIndex));

    tabs.forEach((tab, index) => {
      const isActive = index === normalizedIndex;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      if (isActive && moveFocus) tab.focus();
    });

    panels.forEach((panel, index) => {
      const isActive = index === normalizedIndex;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    stageNodes.forEach((node, index) => {
      node.classList.toggle("is-active", index === normalizedIndex);
      node.classList.toggle("is-complete", index < normalizedIndex);
    });

    if (count) count.textContent = `${formatIndex(normalizedIndex)} / ${totalCount}`;
    if (currentLabel) currentLabel.textContent = panels[normalizedIndex]?.dataset.serviceLabel || "";
  };

  tabs.forEach((tab, index) => {
    tab.style.setProperty("--panel-entry-delay", `${index * 70}ms`);

    tab.addEventListener("click", () => setActivePanel(index));
    tab.addEventListener("focus", () => setActivePanel(index));
    tab.addEventListener("pointerenter", () => {
      if (finePointerQuery.matches) setActivePanel(index);
    });

    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = activeIndex + 1;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = activeIndex - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex === null) return;

      event.preventDefault();
      setActivePanel(nextIndex, { moveFocus: true });
    });
  });

  setActivePanel(activeIndex);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          root.classList.add("is-ready");
          observer.disconnect();
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(root);
    return;
  }

  root.classList.add("is-ready");
};

initWebdevServiceAccordion();
