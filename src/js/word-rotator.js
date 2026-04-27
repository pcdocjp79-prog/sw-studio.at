function initWordRotator() {
  const rotators = document.querySelectorAll(".word-rotator");
  if (rotators.length === 0) return;

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  rotators.forEach((rotator) => {
    const wordsAttr = rotator.dataset.rotatorWords;
    if (!wordsAttr) return;

    const words = wordsAttr
      .split("|")
      .map((word) => word.trim())
      .filter(Boolean);
    if (words.length < 2) return;

    const interval = Math.max(
      1500,
      parseInt(rotator.dataset.rotatorInterval || "3500", 10)
    );
    const startDelay = Math.max(
      0,
      parseInt(rotator.dataset.rotatorStartDelay || "2800", 10)
    );

    const sizer = rotator.querySelector(".word-rotator__sizer");
    const wordsContainer = rotator.querySelector(".word-rotator__words");
    if (!sizer || !wordsContainer) return;

    const updateSizer = () => {
      const ghost = document.createElement("span");
      ghost.style.position = "absolute";
      ghost.style.left = "-9999px";
      ghost.style.top = "0";
      ghost.style.visibility = "hidden";
      ghost.style.whiteSpace = "nowrap";
      const computed = window.getComputedStyle(sizer);
      ghost.style.font = computed.font;
      ghost.style.fontWeight = computed.fontWeight;
      ghost.style.letterSpacing = computed.letterSpacing;
      ghost.style.textTransform = computed.textTransform;
      document.body.appendChild(ghost);

      let widestWord = words[0];
      let widestWidth = 0;
      words.forEach((word) => {
        ghost.textContent = word;
        const width = ghost.getBoundingClientRect().width;
        if (width > widestWidth) {
          widestWidth = width;
          widestWord = word;
        }
      });
      document.body.removeChild(ghost);
      sizer.textContent = widestWord;
    };

    updateSizer();

    let resizeTimeoutId = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimeoutId);
      resizeTimeoutId = window.setTimeout(updateSizer, 200);
    });

    let currentIndex = 0;
    let timeoutId = null;
    let isAnimating = false;

    const stop = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const schedule = (delay) => {
      stop();
      if (reduceMotionQuery.matches) return;
      if (document.hidden) return;
      timeoutId = window.setTimeout(swap, typeof delay === "number" ? delay : interval);
    };

    function swap() {
      if (isAnimating) {
        schedule(interval);
        return;
      }
      isAnimating = true;

      const nextIndex = (currentIndex + 1) % words.length;
      const nextWord = words[nextIndex];

      const currentWord = wordsContainer.querySelector(".word-rotator__word");

      const newWord = document.createElement("span");
      newWord.className = "word-rotator__word word-rotator__word--enter";
      newWord.textContent = nextWord;
      wordsContainer.appendChild(newWord);

      if (currentWord) {
        currentWord.classList.remove("word-rotator__word--enter");
        currentWord.classList.add("word-rotator__word--exit");
        currentWord.addEventListener(
          "animationend",
          () => currentWord.remove(),
          { once: true }
        );
      }

      newWord.addEventListener(
        "animationend",
        () => {
          newWord.classList.remove("word-rotator__word--enter");
          isAnimating = false;
        },
        { once: true }
      );

      currentIndex = nextIndex;
      schedule(interval);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stop();
      } else {
        schedule(interval);
      }
    });

    const handleReduceMotionChange = () => {
      if (reduceMotionQuery.matches) {
        stop();
      } else {
        schedule(interval);
      }
    };

    if (typeof reduceMotionQuery.addEventListener === "function") {
      reduceMotionQuery.addEventListener("change", handleReduceMotionChange);
    } else if (typeof reduceMotionQuery.addListener === "function") {
      reduceMotionQuery.addListener(handleReduceMotionChange);
    }

    schedule(startDelay);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWordRotator);
} else {
  initWordRotator();
}
