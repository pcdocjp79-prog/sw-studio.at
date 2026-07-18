const initWebdevProjectJourney = () => {
  const root = document.querySelector("[data-webdev-journey]");
  if (!root) return;

  const nodes = Array.from(root.querySelectorAll("[data-journey-node]"));
  const panels = Array.from(root.querySelectorAll("[data-journey-panel]"));
  const progressSegments = Array.from(root.querySelectorAll(".webdev-journey__footer-progress i"));
  const counter = root.querySelector("[data-journey-counter]");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (nodes.length === 0 || nodes.length !== panels.length) return;

  let activeIndex = Math.max(0, nodes.findIndex((node) => node.classList.contains("is-active")));
  const total = String(nodes.length).padStart(2, "0");
  const markInteracted = () => root.classList.add("has-interacted");

  const setActiveIndex = (nextIndex, { moveFocus = false } = {}) => {
    const normalizedIndex = (nextIndex + nodes.length) % nodes.length;
    activeIndex = normalizedIndex;
    root.dataset.journeyActive = String(normalizedIndex + 1);

    nodes.forEach((node, index) => {
      const isActive = index === normalizedIndex;
      node.classList.toggle("is-active", isActive);
      node.classList.toggle("is-complete", index < normalizedIndex);
      node.setAttribute("aria-selected", String(isActive));
      node.tabIndex = isActive ? 0 : -1;

      if (isActive && moveFocus) node.focus();
    });

    panels.forEach((panel, index) => {
      const isActive = index === normalizedIndex;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    progressSegments.forEach((segment, index) => {
      segment.classList.toggle("is-active", index === normalizedIndex);
      segment.classList.toggle("is-complete", index < normalizedIndex);
    });

    if (counter) {
      counter.textContent = `${String(normalizedIndex + 1).padStart(2, "0")} / ${total}`;
    }
  };

  nodes.forEach((node, index) => {
    node.addEventListener("click", () => {
      markInteracted();
      setActiveIndex(index);
    });
    node.addEventListener("focus", () => {
      markInteracted();
      setActiveIndex(index);
    });
    node.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" && finePointerQuery.matches) {
        markInteracted();
        setActiveIndex(index);
      }
    });

    node.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = activeIndex + 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = activeIndex - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = nodes.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      setActiveIndex(nextIndex, { moveFocus: true });
    });
  });

  setActiveIndex(activeIndex);
};

initWebdevProjectJourney();
