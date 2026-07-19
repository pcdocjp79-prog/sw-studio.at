const initAiMarquee = () => {
  const marquee = document.querySelector("[data-ai-marquee]");
  const track = marquee?.querySelector(".ai-marquee__track");
  const group = track?.querySelector(".ai-marquee__group");

  if (!track || !group) return;

  const syncLoopOffset = () => {
    const groupWidth = group.getBoundingClientRect().width;

    if (groupWidth > 0) {
      track.style.setProperty("--ai-marquee-offset", `-${groupWidth}px`);
    }
  };

  syncLoopOffset();

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(syncLoopOffset);
    resizeObserver.observe(group);
  } else {
    window.addEventListener("resize", syncLoopOffset, { passive: true });
  }

  document.fonts?.ready.then(syncLoopOffset);
};

initAiMarquee();
