const initWebdevServiceAccordion = () => {
  const root = document.querySelector("[data-webdev-service-accordion]");
  if (!root) return;

  const panels = Array.from(root.querySelectorAll("[data-webdev-service-panel]"));
  if (panels.length === 0) return;

  const setActivePanel = (activePanel) => {
    panels.forEach((panel) => {
      const isActive = panel === activePanel;
      panel.classList.toggle("is-active", isActive);
      panel.querySelector(".webdev-service-panel__button")?.setAttribute("aria-pressed", String(isActive));
    });
  };

  panels.forEach((panel, index) => {
    panel.style.setProperty("--panel-entry-delay", `${index * 90}ms`);

    const button = panel.querySelector(".webdev-service-panel__button");
    button?.addEventListener("click", () => setActivePanel(panel));
    button?.addEventListener("focus", () => setActivePanel(panel));
  });

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
