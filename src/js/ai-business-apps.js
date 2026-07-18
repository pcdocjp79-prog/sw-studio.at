const blueprint = document.querySelector("[data-business-app-blueprint]");

if (blueprint) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isInView = !("IntersectionObserver" in window);

  const syncRunningState = () => {
    blueprint.classList.toggle("is-running", isInView && !reducedMotion.matches);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        syncRunningState();
      },
      { rootMargin: "12% 0px 12%", threshold: 0.18 }
    );

    observer.observe(blueprint);
  } else {
    syncRunningState();
  }

  reducedMotion.addEventListener("change", syncRunningState);
}
