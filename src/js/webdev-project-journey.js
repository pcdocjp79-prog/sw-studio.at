const initWebdevProjectJourney = () => {
  const root = document.querySelector("[data-webdev-journey]");
  if (!root) return;

  const nodes = Array.from(root.querySelectorAll("[data-journey-node]"));
  const panels = Array.from(root.querySelectorAll("[data-journey-panel]"));
  const stage = root.querySelector(".webdev-journey__stage");
  const routeSegments = Array.from(root.querySelectorAll("[data-journey-route-segment]"));
  const routeArrows = Array.from(root.querySelectorAll("[data-journey-route-arrow]"));
  const progressSegments = Array.from(root.querySelectorAll(".webdev-journey__footer-progress i"));
  const counter = root.querySelector("[data-journey-counter]");

  if (nodes.length === 0 || nodes.length !== panels.length) return;

  let activeIndex = Math.max(0, nodes.findIndex((node) => node.classList.contains("is-active")));
  const total = String(nodes.length).padStart(2, "0");
  const markInteracted = () => root.classList.add("has-interacted");

  const syncRouteGeometry = () => {
    if (!stage || routeSegments.length < 3 || routeArrows.length < 3) return;

    const stageRect = stage.getBoundingClientRect();
    if (stageRect.width === 0 || stageRect.height === 0) return;

    const nodeRects = nodes.map((node) => node.getBoundingClientRect());
    const scaleX = 800 / stageRect.width;
    const scaleY = 440 / stageRect.height;
    const toX = (value) => (value - stageRect.left) * scaleX;
    const toY = (value) => (value - stageRect.top) * scaleY;
    const centerX = (rect) => toX(rect.left + rect.width / 2);
    const centerY = (rect) => toY(rect.top + rect.height / 2);
    const gapX = 10 * scaleX;
    const gapY = 10 * scaleY;
    const arrowX = 11 * scaleX;
    const arrowY = 7 * scaleY;

    const topStartX = toX(nodeRects[0].right);
    const topEndX = toX(nodeRects[1].left) - gapX;
    const topY = (centerY(nodeRects[0]) + centerY(nodeRects[1])) / 2;

    const rightX = (centerX(nodeRects[1]) + centerX(nodeRects[2])) / 2;
    const rightStartY = toY(nodeRects[1].bottom);
    const rightEndY = toY(nodeRects[2].top) - gapY;

    const bottomStartX = toX(nodeRects[2].left);
    const bottomEndX = toX(nodeRects[3].right) + gapX;
    const bottomY = (centerY(nodeRects[2]) + centerY(nodeRects[3])) / 2;

    routeSegments[0].setAttribute("d", `M${topStartX} ${topY}H${topEndX}`);
    routeSegments[1].setAttribute("d", `M${rightX} ${rightStartY}V${rightEndY}`);
    routeSegments[2].setAttribute("d", `M${bottomStartX} ${bottomY}H${bottomEndX}`);

    routeArrows[0].setAttribute("d", `M${topEndX - arrowX} ${topY - arrowY}L${topEndX} ${topY} ${topEndX - arrowX} ${topY + arrowY}`);
    routeArrows[1].setAttribute("d", `M${rightX - arrowX * 0.65} ${rightEndY - arrowY}L${rightX} ${rightEndY} ${rightX + arrowX * 0.65} ${rightEndY - arrowY}`);
    routeArrows[2].setAttribute("d", `M${bottomEndX + arrowX} ${bottomY - arrowY}L${bottomEndX} ${bottomY} ${bottomEndX + arrowX} ${bottomY + arrowY}`);
  };

  const setActiveIndex = (nextIndex, { moveFocus = false } = {}) => {
    const normalizedIndex = (nextIndex + nodes.length) % nodes.length;
    activeIndex = normalizedIndex;
    root.dataset.journeyActive = String(normalizedIndex + 1);

    nodes.forEach((node, index) => {
      const isActive = index === normalizedIndex;
      node.classList.toggle("is-active", isActive);
      node.classList.toggle("is-complete", index < normalizedIndex);
      node.classList.toggle("is-next", index === normalizedIndex + 1);
      node.setAttribute("aria-selected", String(isActive));
      node.tabIndex = isActive ? 0 : -1;

      if (isActive && moveFocus) node.focus();
    });

    panels.forEach((panel, index) => {
      const isActive = index === normalizedIndex;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    routeSegments.forEach((segment, index) => {
      segment.classList.toggle("is-complete", index < normalizedIndex);
      segment.classList.toggle("is-next", index === normalizedIndex && normalizedIndex < nodes.length - 1);
    });

    routeArrows.forEach((arrow, index) => {
      arrow.classList.toggle("is-complete", index < normalizedIndex);
      arrow.classList.toggle("is-next", index === normalizedIndex && normalizedIndex < nodes.length - 1);
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

    node.addEventListener("keydown", (event) => {
      let nextIndex = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = activeIndex + 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = activeIndex - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = nodes.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      markInteracted();
      setActiveIndex(nextIndex, { moveFocus: true });
    });
  });

  setActiveIndex(activeIndex);
  requestAnimationFrame(syncRouteGeometry);

  if ("ResizeObserver" in window && stage) {
    const routeResizeObserver = new ResizeObserver(syncRouteGeometry);
    routeResizeObserver.observe(stage);
  } else {
    window.addEventListener("resize", syncRouteGeometry);
  }
};

initWebdevProjectJourney();
