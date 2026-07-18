const initSeoProblemStack = () => {
  const root = document.querySelector(".seo-problem-stack[data-webdev-problem-stack]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll("[data-problem-card]"));
  const dots = Array.from(root.querySelectorAll("[data-problem-dot]"));
  const progress = root.querySelector("[data-problem-progress]");
  const announcer = root.querySelector("[data-problem-announcer]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (cards.length === 0) return;

  let activeIndex = 0;
  let isTransitioning = false;
  let transitionTimer = 0;

  const getCardTitle = (card) => card.querySelector(".webdev-problem-stack__body strong")?.textContent.trim() || "Problem";
  const getCardDescription = (card) => card.querySelector(".webdev-problem-stack__body span")?.textContent.trim() || "";

  const render = ({ announce = false, focus = false } = {}) => {
    cards.forEach((card, cardIndex) => {
      const stackPosition = (cardIndex - activeIndex + cards.length) % cards.length;
      const isTop = stackPosition === 0;
      const xOffset = [
        "0px",
        "clamp(0.4rem, 1.2vw, 0.8rem)",
        "clamp(-0.95rem, -1.4vw, -0.45rem)",
        "clamp(0.25rem, 0.8vw, 0.55rem)"
      ][stackPosition] ?? "0px";
      const yOffset = [0, 12, 23, 34][stackPosition] ?? 0;
      const scale = [1, 0.985, 0.97, 0.955][stackPosition] ?? 1;
      const rotation = [0, 1.35, -1.65, 2.05][stackPosition] ?? 0;

      card.style.setProperty("--stack-x", xOffset);
      card.style.setProperty("--stack-y", `${yOffset}px`);
      card.style.setProperty("--stack-scale", `${scale}`);
      card.style.setProperty("--stack-rotate", `${rotation}deg`);
      card.style.setProperty("--stack-opacity", `${1 - stackPosition * 0.07}`);
      card.style.zIndex = String(cards.length - stackPosition);

      card.classList.toggle("is-top", isTop);
      card.classList.toggle("is-next", stackPosition === 1);
      card.disabled = !isTop;
      card.setAttribute("aria-hidden", isTop ? "false" : "true");
      card.setAttribute(
        "aria-label",
        isTop
          ? `Problem ${activeIndex + 1} von ${cards.length}: ${getCardTitle(card)}. ${getCardDescription(card)} Nächstes Problem anzeigen.`
          : ""
      );
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });

    if (progress) {
      progress.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    }

    if (announce && announcer) {
      announcer.textContent = `Problem ${activeIndex + 1} von ${cards.length}: ${getCardTitle(cards[activeIndex])}`;
    }

    if (focus) {
      cards[activeIndex].focus({ preventScroll: true });
    }
  };

  const finishTransition = (shouldFocusNext) => {
    const previousCard = cards[activeIndex];
    previousCard.classList.add("is-resetting");
    activeIndex = (activeIndex + 1) % cards.length;
    render({ announce: true, focus: shouldFocusNext });

    requestAnimationFrame(() => {
      previousCard.classList.remove("is-exiting");
      root.classList.remove("is-advancing");
      root.removeAttribute("aria-busy");

      requestAnimationFrame(() => {
        previousCard.classList.remove("is-resetting");
        isTransitioning = false;
      });
    });
  };

  const showNextCard = ({ focus = false } = {}) => {
    if (isTransitioning) return;

    if (reducedMotion.matches) {
      activeIndex = (activeIndex + 1) % cards.length;
      render({ announce: true, focus });
      return;
    }

    isTransitioning = true;
    root.classList.add("is-advancing");
    root.setAttribute("aria-busy", "true");
    cards[activeIndex].classList.add("is-exiting");

    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => finishTransition(focus), 300);
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!card.classList.contains("is-top")) return;
      showNextCard({ focus: event.detail === 0 });
    });
  });

  render();
};

initSeoProblemStack();
