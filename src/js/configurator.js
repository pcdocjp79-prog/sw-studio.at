const CONFIGURATOR_VERSION = "2026-05-02";
const CONTACT_PREFILL_STORAGE_KEY = "sws-contact-prefill";
const CONTACT_FORM_TARGET = "kontakt.html#kontaktformular";

const FORM_FIELD_NAMES = new Set([
  "goal",
  "styleDirection",
  "scope",
  "audience",
  "tone",
  "accent",
  "density",
]);

const STATE_KEYS = new Set([...FORM_FIELD_NAMES, "content"]);
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const GOAL_OPTIONS = {
  "qualified-leads": {
    label: "Anfragen qualifizieren",
    title: "Klare Website fuer qualifizierte Anfragen",
    copy:
      "Ein fokussierter Auftritt, der Angebot, Vertrauen und naechsten Schritt sauber verbindet.",
  },
  "premium-trust": {
    label: "Premium-Vertrauen aufbauen",
    title: "Ein Auftritt, der Wertigkeit schnell spuerbar macht",
    copy:
      "Positionierung, Beweise und Nutzerfuehrung arbeiten zusammen, bevor der erste Klick passiert.",
  },
  "clarity-system": {
    label: "Angebot klar strukturieren",
    title: "Ein Websystem, das Komplexitaet ruhig ordnet",
    copy:
      "Leistungen, Zielgruppen und Kontaktwege werden priorisiert, damit Besucher schneller verstehen.",
  },
};

const STYLE_OPTIONS = {
  "precision-dark": {
    label: "Praezise & dunkel",
    contrast: "1.08",
    radius: "1.35rem",
    motion: "14s",
  },
  "editorial-light": {
    label: "Editorial & hell",
    contrast: "0.92",
    radius: "0.85rem",
    motion: "18s",
  },
  "signal-rich": {
    label: "Signalstark & dynamisch",
    contrast: "1.18",
    radius: "1.8rem",
    motion: "9s",
  },
};

const SCOPE_OPTIONS = {
  landing: {
    label: "Fokussierte Landingpage",
    eyebrow: "Landingpage",
  },
  "service-site": {
    label: "Service-Website",
    eyebrow: "Service-Website",
  },
  "content-system": {
    label: "Website mit Content-System",
    eyebrow: "Content-System",
  },
  "growth-platform": {
    label: "Wachstumsplattform",
    eyebrow: "Growth-Plattform",
  },
};

const AUDIENCE_OPTIONS = {
  founders: "Gruender und kleine Teams",
  "local-business": "Lokale Dienstleister",
  "premium-service": "Premium-Serviceanbieter",
  "b2b-experts": "B2B-Experten",
};

const TONE_OPTIONS = {
  calm: "Ruhig und wertig",
  direct: "Direkt und klar",
  bold: "Markant und selbstbewusst",
};

const ACCENT_OPTIONS = {
  cyan: "#62d6ff",
  magenta: "#ff6fb5",
  lime: "#b8f36c",
  amber: "#ffc45c",
};

const DENSITY_OPTIONS = {
  1: "0.75rem",
  2: "1rem",
  3: "1.25rem",
};

const DENSITY_LABELS = {
  1: "Ruhig / luftig",
  2: "Ausgewogen",
  3: "Verdichtet / detailreich",
};

const DEFAULT_STATE = Object.freeze({
  goal: "qualified-leads",
  styleDirection: "precision-dark",
  scope: "service-site",
  audience: "founders",
  tone: "calm",
  accent: "#62d6ff",
  density: "2",
  content: {
    headline: GOAL_OPTIONS["qualified-leads"].title,
    headlineEdited: false,
  },
});

const setText = (element, value) => {
  if (!element) return;
  element.textContent = value;
};

const normalizeFieldValue = (value) => String(value || "").trim();

const normalizeEditableText = (value, maxLength = 140) =>
  normalizeFieldValue(value).replace(/\s+/g, " ").slice(0, maxLength);

const getGoalTitle = (goalValue) =>
  (GOAL_OPTIONS[goalValue] || GOAL_OPTIONS[DEFAULT_STATE.goal]).title;

const getAccentColor = (value) => {
  const normalizedValue = normalizeFieldValue(value).toLowerCase();
  if (HEX_COLOR_PATTERN.test(normalizedValue)) return normalizedValue;

  return ACCENT_OPTIONS[normalizedValue] || DEFAULT_STATE.accent;
};

const createDefaultState = () => ({
  ...DEFAULT_STATE,
  content: { ...DEFAULT_STATE.content },
});

const getNamedFormValue = (form, name) => {
  const field = form.elements[name];
  if (!field) return "";

  if (field instanceof RadioNodeList) {
    return normalizeFieldValue(field.value);
  }

  return normalizeFieldValue(field.value);
};

const getStateFromForm = (form) =>
  Array.from(FORM_FIELD_NAMES).reduce(
    (state, name) => ({
      ...state,
      [name]: getNamedFormValue(form, name) || DEFAULT_STATE[name] || "",
    }),
    createDefaultState()
  );

const buildPreviewSummary = (state) => {
  const goal = GOAL_OPTIONS[state.goal] || GOAL_OPTIONS[DEFAULT_STATE.goal];
  const style =
    STYLE_OPTIONS[state.styleDirection] ||
    STYLE_OPTIONS[DEFAULT_STATE.styleDirection];
  const scope = SCOPE_OPTIONS[state.scope] || SCOPE_OPTIONS[DEFAULT_STATE.scope];

  return {
    eyebrow: scope.eyebrow,
    headline: normalizeEditableText(state.content?.headline) || goal.title,
    copy: goal.copy,
    goal: goal.label,
    styleDirection: style.label,
    scope: scope.label,
    audience: AUDIENCE_OPTIONS[state.audience] || state.audience,
    tone: TONE_OPTIONS[state.tone] || state.tone,
    accent: getAccentColor(state.accent),
    density: state.density,
  };
};

const createBriefingPayload = (state) => ({
  version: CONFIGURATOR_VERSION,
  selections: {
    goal: GOAL_OPTIONS[state.goal]?.label || state.goal,
    styleDirection: STYLE_OPTIONS[state.styleDirection]?.label || state.styleDirection,
    scope: SCOPE_OPTIONS[state.scope]?.label || state.scope,
    audience: AUDIENCE_OPTIONS[state.audience] || state.audience,
    tone: TONE_OPTIONS[state.tone] || state.tone,
    accent: state.accent,
    density: state.density,
  },
  content: {
    headline: normalizeEditableText(state.content?.headline) || getGoalTitle(state.goal),
  },
  previewSummary: buildPreviewSummary(state),
});

const createConfiguratorMessage = (state) => {
  const briefing = createBriefingPayload(state);
  const headline =
    briefing.content.headline || briefing.previewSummary.headline || getGoalTitle(state.goal);
  const accentColor = getAccentColor(state.accent).toUpperCase();

  return [
    "Konfigurator-Entwurf:",
    "",
    `- Ziel: ${briefing.selections.goal}`,
    `- Stil: ${briefing.selections.styleDirection}`,
    `- Umfang: ${briefing.selections.scope}`,
    `- Zielgruppe: ${briefing.selections.audience}`,
    `- Ton: ${briefing.selections.tone}`,
    `- Akzentfarbe: ${accentColor}`,
    `- Dichte: ${DENSITY_LABELS[state.density] || state.density}`,
    `- Headline: ${headline}`,
    "",
    "Naechster Schritt:",
    "Ich moechte diese Konfiguration besprechen und gemeinsam einordnen lassen.",
  ].join("\n");
};

export const initConfigurator = (root) => {
  const form = root.querySelector("[data-configurator-form]");
  const preview = root.querySelector("[data-configurator-preview]");

  if (!form || !preview) return;

  const handoffButton = root.querySelector("[data-configurator-handoff]");
  const previewEyebrow = preview.querySelector("[data-preview-eyebrow]");
  const previewTitle = preview.querySelector("[data-preview-title]");
  const previewCopy = preview.querySelector("[data-preview-copy]");
  const accentValue = root.querySelector("[data-accent-value]");
  const summaryGoal = root.querySelector("[data-summary-goal]");
  const summaryStyle = root.querySelector("[data-summary-style]");
  const summaryScope = root.querySelector("[data-summary-scope]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderRafId = null;

  const queueRender = () => {
    if (renderRafId !== null) return;

    renderRafId = requestAnimationFrame(() => {
      renderRafId = null;
      renderPreview();
    });
  };

  const state = new Proxy(getStateFromForm(form), {
    set(target, property, value) {
      if (!STATE_KEYS.has(property)) {
        target[property] = value;
        return true;
      }

      const normalizedValue =
        property === "content" && value && typeof value === "object"
          ? {
              headline: normalizeEditableText(value.headline),
              headlineEdited: Boolean(value.headlineEdited),
            }
          : normalizeFieldValue(value);

      if (target[property] === normalizedValue) return true;

      target[property] = normalizedValue;

      if (property === "goal" && !target.content?.headlineEdited) {
        target.content = {
          ...target.content,
          headline: getGoalTitle(normalizedValue),
          headlineEdited: false,
        };
      }

      queueRender();
      return true;
    },
  });

  const renderPreview = () => {
    const summary = buildPreviewSummary(state);
    const style =
      STYLE_OPTIONS[state.styleDirection] ||
      STYLE_OPTIONS[DEFAULT_STATE.styleDirection];
    const accentColor = getAccentColor(state.accent);

    preview.style.setProperty("--preview-accent", accentColor);
    preview.style.setProperty("--cfg-accent", accentColor);
    preview.style.setProperty("--cfg-radius", style.radius);
    preview.style.setProperty(
      "--cfg-density",
      DENSITY_OPTIONS[state.density] || DENSITY_OPTIONS[DEFAULT_STATE.density]
    );
    preview.style.setProperty("--cfg-contrast", style.contrast);
    preview.style.setProperty("--cfg-motion", reducedMotion ? "0.01ms" : style.motion);

    setText(previewEyebrow, summary.eyebrow);
    if (previewTitle !== document.activeElement) {
      setText(previewTitle, summary.headline);
    }
    setText(previewCopy, summary.copy);
    setText(accentValue, accentColor);
    setText(summaryGoal, summary.goal);
    setText(summaryStyle, summary.styleDirection);
    setText(summaryScope, summary.scope);
  };

  const syncStateFromField = (field) => {
    if (!field?.name || !FORM_FIELD_NAMES.has(field.name)) return;
    state[field.name] = getNamedFormValue(form, field.name);
  };

  const syncHeadlineFromPreview = ({ restoreEmpty = false } = {}) => {
    if (!previewTitle) return;

    const headline = normalizeEditableText(previewTitle.textContent);

    if (!headline && restoreEmpty) {
      const fallbackHeadline = getGoalTitle(state.goal);
      state.content = {
        headline: fallbackHeadline,
        headlineEdited: false,
      };
      setText(previewTitle, fallbackHeadline);
      return;
    }

    state.content = {
      headline,
      headlineEdited: Boolean(headline),
    };
  };

  const writeContactPrefill = () => {
    const payload = {
      projectValue: "Webentwicklung",
      timelineValue: "Noch offen",
      messageValue: createConfiguratorMessage(state),
    };

    try {
      window.sessionStorage.setItem(
        CONTACT_PREFILL_STORAGE_KEY,
        JSON.stringify(payload)
      );
    } catch (_error) {
      // Keep the redirect flow intact if storage is unavailable.
    }
  };

  form.addEventListener("input", (event) => {
    syncStateFromField(event.target);
  });

  form.addEventListener("change", (event) => {
    syncStateFromField(event.target);
  });

  previewTitle?.addEventListener("input", () => {
    syncHeadlineFromPreview();
  });

  previewTitle?.addEventListener("blur", () => {
    syncHeadlineFromPreview({ restoreEmpty: true });
  });

  previewTitle?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    previewTitle.blur();
  });

  previewTitle?.addEventListener("paste", (event) => {
    event.preventDefault();
    const text = event.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, normalizeEditableText(text));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    writeContactPrefill();
    window.location.href = CONTACT_FORM_TARGET;
  });

  handoffButton?.addEventListener("click", () => {
    writeContactPrefill();
    window.location.href = CONTACT_FORM_TARGET;
  });

  renderPreview();
};
