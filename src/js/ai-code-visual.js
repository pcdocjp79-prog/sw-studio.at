const CODE_VISUAL_SELECTOR = "[data-ai-code-visual]";
const CODE_OUTPUT_SELECTOR = "[data-ai-code-output]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CODE_SNIPPET = `// System initialisieren
function starteModul() {
  const status = 'aktiv';
  console.log(status);
}

starteModul();`;

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const formatSyntax = (value) =>
  escapeHtml(value)
    .replace(/(\/\/.*)/g, '<span class="ai-code-visual__comment">$1</span>')
    .replace(/\b(function|const)\b/g, '<span class="ai-code-visual__keyword">$1</span>')
    .replace(/\b(console)\b/g, '<span class="ai-code-visual__object">$1</span>')
    .replace(/\b(starteModul|log)\b/g, '<span class="ai-code-visual__function">$1</span>')
    .replace(/('[^']*')/g, '<span class="ai-code-visual__string">$1</span>');

const initCodeVisual = (visual) => {
  const output = visual.querySelector(CODE_OUTPUT_SELECTOR);
  if (!output) return;

  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  let characterIndex = 0;
  let timerId = null;
  let isVisible = true;

  const clearTimer = () => {
    if (timerId === null) return;
    window.clearTimeout(timerId);
    timerId = null;
  };

  const renderText = (value) => {
    output.innerHTML = formatSyntax(value);
  };

  const renderStatic = () => {
    clearTimer();
    renderText(CODE_SNIPPET);
  };

  const schedule = (callback, delay) => {
    clearTimer();
    timerId = window.setTimeout(callback, delay);
  };

  const typeNextCharacter = () => {
    if (!isVisible) {
      clearTimer();
      return;
    }

    if (reducedMotionQuery.matches) {
      renderStatic();
      return;
    }

    if (characterIndex < CODE_SNIPPET.length) {
      characterIndex += 1;
      renderText(CODE_SNIPPET.slice(0, characterIndex));
      schedule(typeNextCharacter, Math.random() * 70 + 30);
      return;
    }

    schedule(() => {
      characterIndex = 0;
      renderText("");
      schedule(typeNextCharacter, 800);
    }, 4000);
  };

  const start = () => {
    if (reducedMotionQuery.matches) {
      renderStatic();
      return;
    }

    if (!isVisible || timerId !== null) return;
    schedule(typeNextCharacter, characterIndex === 0 ? 1000 : 80);
  };

  const handleMotionChange = () => {
    characterIndex = 0;

    if (reducedMotionQuery.matches) {
      renderStatic();
      return;
    }

    renderText("");
    start();
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);

        if (isVisible) {
          start();
          return;
        }

        clearTimer();
      },
      { threshold: 0.05 }
    );
    observer.observe(visual);
  }

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleMotionChange);
  }

  if (reducedMotionQuery.matches) {
    renderStatic();
    return;
  }

  start();
};

document.querySelectorAll(CODE_VISUAL_SELECTOR).forEach(initCodeVisual);
