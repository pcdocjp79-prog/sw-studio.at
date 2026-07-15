const CODE_VISUAL_SELECTOR = "[data-ai-code-visual]";
const CODE_OUTPUT_SELECTOR = "[data-ai-code-output]";
const CODE_VIEWPORT_SELECTOR = "[data-ai-code-viewport]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CODE_SNIPPET = `// Routine erkannt
const flow = workflow('inbox');

flow.read()
  .extract(['sender', 'intent'])
  .classify({ priority: 'smart' })
  .enrich('crm')
  .route('owner')
  .notify('team');

flow.run({ mode: 'automatic' });`;

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const formatSyntax = (value) =>
  escapeHtml(value)
    .replace(/(\/\/.*)/g, '<span class="ai-code-visual__comment">$1</span>')
    .replace(/\b(const)\b/g, '<span class="ai-code-visual__keyword">$1</span>')
    .replace(/\b(flow)\b/g, '<span class="ai-code-visual__object">$1</span>')
    .replace(/\b(workflow|read|extract|classify|enrich|route|notify|run)\b/g, '<span class="ai-code-visual__function">$1</span>')
    .replace(/('[^']*')/g, '<span class="ai-code-visual__string">$1</span>');

const initCodeVisual = (visual) => {
  const output = visual.querySelector(CODE_OUTPUT_SELECTOR);
  const viewport = visual.querySelector(CODE_VIEWPORT_SELECTOR);
  if (!output || !viewport) return;

  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  let characterIndex = 0;
  let timerId = null;
  let scrollFrameId = null;
  let isVisible = true;

  const clearTimer = () => {
    if (timerId === null) return;
    window.clearTimeout(timerId);
    timerId = null;
  };

  const renderText = (value) => {
    output.innerHTML = formatSyntax(value);
  };

  const clearScrollFrame = () => {
    if (scrollFrameId === null) return;
    window.cancelAnimationFrame(scrollFrameId);
    scrollFrameId = null;
  };

  const followCode = () => {
    clearScrollFrame();
    scrollFrameId = window.requestAnimationFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
      scrollFrameId = null;
    });
  };

  const resetCode = () => {
    clearScrollFrame();
    characterIndex = 0;
    renderText("");
    viewport.scrollTop = 0;
  };

  const renderStatic = () => {
    clearTimer();
    renderText(CODE_SNIPPET);
    viewport.scrollTop = 0;
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
      const typedCharacter = CODE_SNIPPET[characterIndex - 1];

      if (typedCharacter === "\n" || characterIndex % 18 === 0 || characterIndex === CODE_SNIPPET.length) {
        followCode();
      }

      const typeDelay = typedCharacter === "\n"
        ? 135
        : /[.;{}]/.test(typedCharacter)
          ? 90
          : Math.random() * 42 + 28;
      schedule(typeNextCharacter, typeDelay);
      return;
    }

    schedule(() => {
      visual.classList.add("is-code-resetting");
      schedule(() => {
        resetCode();
        visual.classList.remove("is-code-resetting");
        schedule(typeNextCharacter, 720);
      }, 190);
    }, 2600);
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
    visual.classList.remove("is-code-resetting");
    resetCode();

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
        clearScrollFrame();
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
