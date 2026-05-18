const initWebdevProblemStack = () => {
  const root = document.querySelector("[data-webdev-problem-stack]");
  if (!root) return;

  const cards = Array.from(root.querySelectorAll("[data-problem-card]"));
  const dots = Array.from(root.querySelectorAll("[data-problem-dot]"));
  if (cards.length === 0) return;

  let activeIndex = 0;

  const render = () => {
    cards.forEach((card, cardIndex) => {
      const stackPosition = (cardIndex - activeIndex + cards.length) % cards.length;
      const isTop = stackPosition === 0;

      card.style.setProperty("--stack-y", `${stackPosition * 12}px`);
      card.style.setProperty("--stack-scale", `${1 - stackPosition * 0.05}`);
      card.style.setProperty("--stack-rotate", `${stackPosition * -2.5}deg`);
      card.style.setProperty("--stack-opacity", stackPosition > 3 ? "0" : "1");
      card.style.zIndex = String(cards.length - stackPosition);

      card.classList.toggle("is-top", isTop);
      card.disabled = !isTop;
      card.setAttribute("aria-hidden", isTop ? "false" : "true");
      card.setAttribute(
        "aria-label",
        isTop ? `${card.textContent.trim().replace(/\s+/g, " ")}. Naechstes Problem anzeigen.` : ""
      );
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  const showNextCard = () => {
    activeIndex = (activeIndex + 1) % cards.length;
    render();
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("is-top")) return;
      showNextCard();
    });
  });

  render();
};

initWebdevProblemStack();
