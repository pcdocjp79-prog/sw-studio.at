const marquee = document.querySelector("[data-seo-marquee]");

if (marquee) {
  const cards = [...marquee.querySelectorAll("[data-marquee-card]")];
  const toggle = marquee.querySelector("[data-marquee-toggle]");
  const toggleLabel = marquee.querySelector("[data-marquee-toggle-label]");
  const counter = marquee.querySelector("[data-marquee-counter]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let isVisible = false;
  let isManuallyPaused = false;
  const cardsInScanZone = new Set();

  const selectScannedCard = () => {
    if (!cardsInScanZone.size || reducedMotion.matches) return;

    const marqueeCenter = marquee.getBoundingClientRect().left + marquee.clientWidth / 2;
    const scannedCard = [...cardsInScanZone].reduce((closest, card) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - marqueeCenter);

      return !closest || distance < closest.distance ? { card, distance } : closest;
    }, null)?.card;

    if (!scannedCard) return;

    cards.forEach((card) => card.classList.toggle("is-scanned", card === scannedCard));

    if (counter) {
      counter.textContent = `${String(scannedCard.dataset.marqueeIndex).padStart(2, "0")} / 05`;
    }
  };

  const syncMotion = () => {
    const canRun = isVisible && !document.hidden && !reducedMotion.matches;
    marquee.classList.toggle("is-running", canRun);
    marquee.classList.toggle("is-manually-paused", isManuallyPaused);

    if (reducedMotion.matches) {
      cardsInScanZone.clear();
      cards.forEach((card, index) => card.classList.toggle("is-scanned", index === 0));
      if (counter) counter.textContent = "01 / 05";
    }
  };

  const updateToggle = () => {
    if (!toggle) return;

    toggle.setAttribute("aria-pressed", String(isManuallyPaused));
    toggle.setAttribute("aria-label", isManuallyPaused ? "Marquee fortsetzen" : "Marquee pausieren");
    if (toggleLabel) toggleLabel.textContent = isManuallyPaused ? "Weiter" : "Pause";
  };

  toggle?.addEventListener("click", () => {
    isManuallyPaused = !isManuallyPaused;
    updateToggle();
    syncMotion();
  });

  marquee.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") marquee.classList.add("is-hover-paused");
  });

  marquee.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") marquee.classList.remove("is-hover-paused");
  });

  document.addEventListener("visibilitychange", syncMotion);
  reducedMotion.addEventListener("change", syncMotion);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncMotion();
      },
      { threshold: 0.08 }
    );

    const scannerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) cardsInScanZone.add(entry.target);
          else cardsInScanZone.delete(entry.target);
        });
        selectScannedCard();
      },
      {
        root: marquee,
        rootMargin: "0px -38% 0px -38%",
        threshold: 0.08,
      }
    );

    sectionObserver.observe(marquee);
    cards.forEach((card) => scannerObserver.observe(card));
  } else {
    isVisible = true;
    syncMotion();
  }

  updateToggle();
  syncMotion();
}
