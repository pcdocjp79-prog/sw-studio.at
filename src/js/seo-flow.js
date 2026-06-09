/* SEO Flow — interaktive Phasen-Section auf seo-marketing.html
   Links klickbare Phasen (Disclosure), rechts wechselnder Viewer.
   Vanilla JS, modular, ohne Abhängigkeiten. */
const initSeoFlow = () => {
  const root = document.querySelector("[data-seo-flow]");
  if (!root) return;

  const steps = Array.from(root.querySelectorAll("[data-flow-step]"));
  const triggers = Array.from(root.querySelectorAll("[data-flow-trigger]"));
  const scenes = Array.from(root.querySelectorAll("[data-flow-scene]"));
  const moduleLabel = root.querySelector("[data-flow-module]");
  if (triggers.length === 0) return;

  const setActive = (id) => {
    const key = String(id);

    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.flowStep === key);
    });

    triggers.forEach((trigger) => {
      trigger.setAttribute(
        "aria-expanded",
        trigger.dataset.flowTrigger === key ? "true" : "false"
      );
    });

    scenes.forEach((scene) => {
      scene.classList.toggle("is-active", scene.dataset.flowScene === key);
    });

    if (moduleLabel) moduleLabel.textContent = `MODUL_0${id}`;
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setActive(trigger.dataset.flowTrigger);
    });
  });

  // Tastatur: Pfeil hoch/runter wechselt zwischen den Phasen
  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const index = triggers.indexOf(document.activeElement);
    if (index === -1) return;

    event.preventDefault();
    const next =
      event.key === "ArrowDown"
        ? (index + 1) % triggers.length
        : (index - 1 + triggers.length) % triggers.length;

    triggers[next].focus();
    setActive(triggers[next].dataset.flowTrigger);
  });

  setActive(1);
};

initSeoFlow();
