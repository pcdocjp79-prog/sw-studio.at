const CONFIGURATOR_VERSION = "2026-05-02";
const CONTACT_PREFILL_STORAGE_KEY = "sws-contact-prefill";
const CONTACT_FORM_TARGET = "kontakt.html#kontaktformular";

const FORM_FIELD_NAMES = new Set([
  "typography",
  "styleDirection",
  "scope",
  "audience",
  "tone",
  "brandPreset",
  "density",
]);

const TYPOGRAPHY_OPTIONS = {
  inter: {
    label: "Klar & Modern (Inter)",
    font: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
  geist: {
    label: "Editorial (Geist)",
    font: '"Geist", "Inter", ui-sans-serif, sans-serif',
  },
  mono: {
    label: "Technisch (JetBrains Mono)",
    font: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
  },
};

const BRAND_PRESETS = {
  "monochrome-dark": {
    label: "Monochrome Dark",
    bg: "#0a0a0a",
    text: "#fafafa",
    accent: "#a1a1aa",
  },
  "clean-studio": {
    label: "Clean Studio",
    bg: "#fafaf7",
    text: "#111111",
    accent: "#0a0a0a",
  },
  "deep-blue": {
    label: "Deep Blue",
    bg: "#0b1a3d",
    text: "#ecf2ff",
    accent: "#5b8def",
  },
  "neon-cyber": {
    label: "Neon Cyber",
    bg: "#06070b",
    text: "#d6f3ff",
    accent: "#39ffd0",
  },
  "soft-editorial": {
    label: "Soft Editorial",
    bg: "#f1ece2",
    text: "#1a1612",
    accent: "#b6552c",
  },
};

const STYLE_OPTIONS = {
  "precision-dark": { label: "Praezise & dunkel", contrast: "1.08", radius: "1.35rem", motion: "14s" },
  "editorial-light": { label: "Editorial & hell", contrast: "0.92", radius: "0.85rem", motion: "18s" },
  "signal-rich": { label: "Signalstark & dynamisch", contrast: "1.18", radius: "1.8rem", motion: "9s" },
};

const SCOPE_OPTIONS = {
  landing: { label: "Fokussierte Landingpage", eyebrow: "Landingpage" },
  "service-site": { label: "Service-Website", eyebrow: "Service-Website" },
  "content-system": { label: "Website mit Content-System", eyebrow: "Content-System" },
  "growth-platform": { label: "Wachstumsplattform", eyebrow: "Growth-Plattform" },
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

const DENSITY_OPTIONS = { 1: "0.75rem", 2: "1rem", 3: "1.25rem" };
const DENSITY_LABELS = { 1: "Ruhig / luftig", 2: "Ausgewogen", 3: "Verdichtet / detailreich" };

const DEFAULT_FORM_STATE = Object.freeze({
  typography: "inter",
  styleDirection: "precision-dark",
  scope: "service-site",
  audience: "founders",
  tone: "calm",
  brandPreset: "monochrome-dark",
  density: "2",
});

const SECTION_TYPE_LABELS = { hero: "Hero", text: "Text", feature: "Feature" };

const setText = (element, value) => {
  if (element) element.textContent = value;
};

const normalizeFieldValue = (value) => String(value || "").trim();
const normalizeEditableText = (value, maxLength = 220) =>
  normalizeFieldValue(value).replace(/\s+/g, " ").slice(0, maxLength);

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

let sectionIdCounter = 0;
const createSectionId = () => `sec-${Date.now().toString(36)}-${++sectionIdCounter}`;

const getNamedFormValue = (form, name) => {
  const field = form.elements[name];
  return field ? normalizeFieldValue(field.value) : "";
};

const getFormState = (form) => {
  const next = { ...DEFAULT_FORM_STATE };
  for (const name of FORM_FIELD_NAMES) {
    next[name] = getNamedFormValue(form, name) || DEFAULT_FORM_STATE[name];
  }
  return next;
};

const createInitialHeroSection = (formState) => {
  const scope = SCOPE_OPTIONS[formState.scope] || SCOPE_OPTIONS[DEFAULT_FORM_STATE.scope];
  return {
    id: createSectionId(),
    type: "hero",
    theme: "brand",
    edited: { eyebrow: false, headline: false, copy: false },
    content: {
      eyebrow: scope.eyebrow,
      headline: "Eine ruhige, klare Hero-Sektion",
      copy: "Eine kurze Begruessung, die Position und Nutzen sofort sichtbar macht.",
    },
  };
};

const createTextSection = () => ({
  id: createSectionId(),
  type: "text",
  theme: "brand",
  content: {
    headline: "Worum es hier geht",
    body:
      "Ein kurzer Absatz, der den Kontext einordnet und die naechste Idee vorbereitet. Klick zum Bearbeiten.",
  },
});

const createFeatureSection = () => ({
  id: createSectionId(),
  type: "feature",
  theme: "brand",
  content: {
    headline: "Drei klare Bausteine",
    items: [
      { title: "Klar", body: "Fokus auf das, was wirkt." },
      { title: "Ruhig", body: "Wenig Reibung, viel Hierarchie." },
      { title: "Belastbar", body: "Sauber gebaut, messbar gut." },
    ],
  },
});

const SECTION_FACTORIES = {
  text: createTextSection,
  feature: createFeatureSection,
};

const renderControls = (idx, total, theme) => `
  <div class="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
    <button type="button" class="configurator-block__ctrl" data-section-action="up" ${idx === 0 ? "disabled" : ""} aria-label="Hoch">&uarr;</button>
    <button type="button" class="configurator-block__ctrl" data-section-action="down" ${idx === total - 1 ? "disabled" : ""} aria-label="Runter">&darr;</button>
    <button type="button" class="configurator-block__ctrl" data-section-action="theme" aria-label="Theme wechseln" title="Theme: ${theme}">&#9680;</button>
    <button type="button" class="configurator-block__ctrl" data-section-action="delete" aria-label="Loeschen">&times;</button>
  </div>`;

const themeClasses = (theme) => {
  if (theme === "light") return "bg-white text-black border-black/10";
  if (theme === "dark") return "bg-zinc-900 text-white border-white/10";
  return "bg-transparent border-current/20";
};

const editable = (section, field, value, classes = "") =>
  `<span class="configurator-editable outline-none ${classes}" contenteditable="true" spellcheck="false"
    data-editable data-section-id="${section.id}" data-field="${field}">${escapeHtml(value)}</span>`;

const renderHero = (section) => `
  <p class="text-[0.7rem] uppercase tracking-[0.18em] opacity-70 mb-2">
    ${editable(section, "eyebrow", section.content.eyebrow)}
  </p>
  <h3 class="font-display text-2xl sm:text-3xl leading-tight mb-3">
    ${editable(section, "headline", section.content.headline)}
  </h3>
  <p class="text-sm sm:text-base opacity-80 max-w-xl">
    ${editable(section, "copy", section.content.copy, "block")}
  </p>
  <div class="mt-4 flex gap-2 text-xs opacity-70" aria-hidden="true">
    <span class="px-3 py-1 rounded-full border border-current/40">Erstgespraech</span>
    <span class="px-3 py-1 rounded-full opacity-60">Projekt einordnen</span>
  </div>`;

const renderText = (section) => `
  <h3 class="font-display text-xl sm:text-2xl mb-2">
    ${editable(section, "headline", section.content.headline)}
  </h3>
  <p class="text-sm sm:text-base opacity-80 leading-relaxed">
    ${editable(section, "body", section.content.body, "block")}
  </p>`;

const renderFeature = (section) => `
  <h3 class="font-display text-xl sm:text-2xl mb-4">
    ${editable(section, "headline", section.content.headline)}
  </h3>
  <div class="grid sm:grid-cols-3 gap-3">
    ${section.content.items
      .map(
        (item, i) => `
      <div class="rounded-xl border border-current/20 p-3">
        <p class="font-display text-sm mb-1">
          ${editable(section, `items.${i}.title`, item.title)}
        </p>
        <p class="text-xs opacity-75 leading-relaxed">
          ${editable(section, `items.${i}.body`, item.body, "block")}
        </p>
      </div>`
      )
      .join("")}
  </div>`;

const SECTION_RENDERERS = { hero: renderHero, text: renderText, feature: renderFeature };

const renderSection = (section, idx, total) => {
  const inner = (SECTION_RENDERERS[section.type] || renderText)(section);
  return `
    <article class="configurator-block group relative rounded-2xl border ${themeClasses(section.theme)} p-5 sm:p-6 transition-colors"
      data-section-id="${section.id}" data-section-type="${section.type}" data-section-theme="${section.theme}">
      ${renderControls(idx, total, section.theme)}
      ${inner}
    </article>`;
};

const setNestedField = (target, fieldPath, value) => {
  const parts = fieldPath.split(".");
  let cursor = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    cursor = cursor[Number.isInteger(+key) ? +key : key];
    if (!cursor) return false;
  }
  const last = parts[parts.length - 1];
  cursor[Number.isInteger(+last) ? +last : last] = value;
  return true;
};

const buildBriefingMessage = (formState, sections) => {
  const typography = TYPOGRAPHY_OPTIONS[formState.typography] || TYPOGRAPHY_OPTIONS[DEFAULT_FORM_STATE.typography];
  const brand = BRAND_PRESETS[formState.brandPreset] || BRAND_PRESETS[DEFAULT_FORM_STATE.brandPreset];
  const style = STYLE_OPTIONS[formState.styleDirection] || STYLE_OPTIONS[DEFAULT_FORM_STATE.styleDirection];
  const scope = SCOPE_OPTIONS[formState.scope] || SCOPE_OPTIONS[DEFAULT_FORM_STATE.scope];

  const sectionLines = sections.map((section, idx) => {
    const themeLabel = section.theme === "light" ? "Light" : section.theme === "dark" ? "Dark" : "Brand";
    const typeLabel = SECTION_TYPE_LABELS[section.type] || section.type;
    const headline = normalizeEditableText(section.content?.headline || "");
    const suffix = headline ? ` - "${headline}"` : "";
    return `  ${idx + 1}. ${typeLabel} (${themeLabel})${suffix}`;
  });

  return [
    "Konfigurator-Entwurf:",
    "",
    `- Typografie: ${typography.label}`,
    `- Brand: ${brand.label} (BG ${brand.bg.toUpperCase()} / Text ${brand.text.toUpperCase()} / Accent ${brand.accent.toUpperCase()})`,
    `- Stil: ${style.label}`,
    `- Umfang: ${scope.label}`,
    `- Zielgruppe: ${AUDIENCE_OPTIONS[formState.audience] || formState.audience}`,
    `- Ton: ${TONE_OPTIONS[formState.tone] || formState.tone}`,
    `- Dichte: ${DENSITY_LABELS[formState.density] || formState.density}`,
    "",
    "Sektionen:",
    ...sectionLines,
    "",
    "Naechster Schritt:",
    "Ich moechte diese Konfiguration besprechen und gemeinsam einordnen lassen.",
  ].join("\n");
};

export const initConfigurator = (root) => {
  const form = root.querySelector("[data-configurator-form]");
  const preview = root.querySelector("[data-configurator-preview]");
  const sectionsRoot = root.querySelector("[data-sections-root]");

  if (!form || !preview || !sectionsRoot) return;

  const handoffButton = root.querySelector("[data-configurator-handoff]");
  const addControls = root.querySelector("[data-add-section-controls]");
  const summaryTypography = root.querySelector("[data-summary-typography]");
  const summaryBrand = root.querySelector("[data-summary-brand]");
  const summaryScope = root.querySelector("[data-summary-scope]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const initialFormState = getFormState(form);
  const internal = {
    form: { ...initialFormState },
    sections: [createInitialHeroSection(initialFormState)],
  };

  let renderRafId = null;
  const queueRender = () => {
    if (renderRafId !== null) return;
    renderRafId = requestAnimationFrame(() => {
      renderRafId = null;
      renderAll();
    });
  };

  const state = new Proxy(internal, {
    set(target, property, value) {
      target[property] = value;
      queueRender();
      return true;
    },
  });

  const updateSectionsArray = (mutator) => {
    const next = internal.sections.slice();
    mutator(next);
    state.sections = next;
  };

  const moveSectionUp = (id) =>
    updateSectionsArray((arr) => {
      const i = arr.findIndex((s) => s.id === id);
      if (i <= 0) return;
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    });

  const moveSectionDown = (id) =>
    updateSectionsArray((arr) => {
      const i = arr.findIndex((s) => s.id === id);
      if (i < 0 || i >= arr.length - 1) return;
      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
    });

  const deleteSection = (id) =>
    updateSectionsArray((arr) => {
      const i = arr.findIndex((s) => s.id === id);
      if (i < 0 || arr.length <= 1) return;
      arr.splice(i, 1);
    });

  const cycleSectionTheme = (id) => {
    // brand -> light -> dark -> brand. Reassign array to trigger Proxy + force render.
    const order = ["brand", "light", "dark"];
    updateSectionsArray((arr) => {
      const i = arr.findIndex((s) => s.id === id);
      if (i < 0) return;
      const nextTheme = order[(order.indexOf(arr[i].theme) + 1) % order.length];
      arr[i] = { ...arr[i], theme: nextTheme };
    });
  };

  const addSection = (type) => {
    const factory = SECTION_FACTORIES[type];
    if (!factory) return;
    // Append at the end of the array (push, not unshift) so new sections appear below.
    updateSectionsArray((arr) => {
      arr.push(factory());
    });
  };

  const renderGlobals = () => {
    const f = internal.form;
    const style = STYLE_OPTIONS[f.styleDirection] || STYLE_OPTIONS[DEFAULT_FORM_STATE.styleDirection];
    const brand = BRAND_PRESETS[f.brandPreset] || BRAND_PRESETS[DEFAULT_FORM_STATE.brandPreset];
    const typography = TYPOGRAPHY_OPTIONS[f.typography] || TYPOGRAPHY_OPTIONS[DEFAULT_FORM_STATE.typography];

    preview.style.setProperty("--preview-bg", brand.bg);
    preview.style.setProperty("--preview-text", brand.text);
    preview.style.setProperty("--preview-accent", brand.accent);
    preview.style.setProperty("--preview-font", typography.font);
    preview.style.setProperty("--cfg-accent", brand.accent);
    preview.style.setProperty("--cfg-radius", style.radius);
    preview.style.setProperty(
      "--cfg-density",
      DENSITY_OPTIONS[f.density] || DENSITY_OPTIONS[DEFAULT_FORM_STATE.density]
    );
    preview.style.setProperty("--cfg-contrast", style.contrast);
    preview.style.setProperty("--cfg-motion", reducedMotion ? "0.01ms" : style.motion);

    setText(summaryTypography, typography.label);
    setText(summaryBrand, brand.label);
    setText(summaryScope, SCOPE_OPTIONS[f.scope]?.label || f.scope);
  };

  const refreshFirstHeroFromGlobals = () => {
    const hero = internal.sections[0];
    if (!hero || hero.type !== "hero" || !hero.edited) return;
    const scope = SCOPE_OPTIONS[internal.form.scope] || SCOPE_OPTIONS[DEFAULT_FORM_STATE.scope];
    if (!hero.edited.eyebrow) hero.content.eyebrow = scope.eyebrow;
  };

  const renderSections = () => {
    const total = internal.sections.length;
    // Only preserve a survivor DOM node if user is actively typing into a contenteditable
    // (not when they clicked a control button — that path needs a fresh render to apply theme/order changes).
    const activeEditable = document.activeElement?.matches?.("[data-editable]")
      ? document.activeElement
      : null;
    const focusedSectionId = activeEditable?.closest?.("[data-section-id]")?.dataset.sectionId;

    const html = internal.sections.map((s, i) => renderSection(s, i, total)).join("");

    if (focusedSectionId) {
      const newRoot = document.createElement("div");
      newRoot.innerHTML = html;
      const oldNodes = Array.from(sectionsRoot.children);
      const newNodes = Array.from(newRoot.children);
      sectionsRoot.innerHTML = "";
      newNodes.forEach((node) => {
        const id = node.dataset.sectionId;
        if (id === focusedSectionId) {
          const survivor = oldNodes.find((n) => n.dataset.sectionId === id);
          sectionsRoot.appendChild(survivor || node);
        } else {
          sectionsRoot.appendChild(node);
        }
      });
      return;
    }

    sectionsRoot.innerHTML = html;
  };

  const renderAll = () => {
    refreshFirstHeroFromGlobals();
    renderGlobals();
    renderSections();
  };

  const handleFormChange = (event) => {
    const target = event.target;
    if (!target?.name || !FORM_FIELD_NAMES.has(target.name)) return;
    state.form = { ...internal.form, [target.name]: normalizeFieldValue(target.value) };
  };

  form.addEventListener("input", handleFormChange);
  form.addEventListener("change", handleFormChange);

  addControls?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-section]");
    if (!button) return;
    addSection(button.dataset.addSection);
  });

  sectionsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-section-action]");
    if (!button) return;
    const id = button.closest("[data-section-id]")?.dataset.sectionId;
    if (!id) return;
    const action = button.dataset.sectionAction;
    if (action === "up") moveSectionUp(id);
    else if (action === "down") moveSectionDown(id);
    else if (action === "theme") cycleSectionTheme(id);
    else if (action === "delete") deleteSection(id);
  });

  sectionsRoot.addEventListener("input", (event) => {
    const target = event.target.closest("[data-editable]");
    if (!target) return;
    const id = target.dataset.sectionId;
    const field = target.dataset.field;
    const section = internal.sections.find((s) => s.id === id);
    if (!section) return;
    const value = normalizeEditableText(target.textContent);
    setNestedField(section.content, field, value);
    if (section.edited && field in section.edited) section.edited[field] = true;
  });

  sectionsRoot.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("[data-editable]")) {
      event.preventDefault();
      event.target.blur();
    }
  });

  sectionsRoot.addEventListener("paste", (event) => {
    if (!event.target.matches("[data-editable]")) return;
    event.preventDefault();
    const text = event.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, normalizeEditableText(text));
  });

  const writeContactPrefill = () => {
    const payload = {
      projectValue: "Webentwicklung",
      timelineValue: "Noch offen",
      messageValue: buildBriefingMessage(internal.form, internal.sections),
    };
    try {
      window.sessionStorage.setItem(CONTACT_PREFILL_STORAGE_KEY, JSON.stringify(payload));
    } catch (_error) {
      // Keep redirect flow intact if storage is unavailable.
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    writeContactPrefill();
    window.location.href = CONTACT_FORM_TARGET;
  });

  handoffButton?.addEventListener("click", () => {
    writeContactPrefill();
    window.location.href = CONTACT_FORM_TARGET;
  });

  // CONFIGURATOR_VERSION marker kept for diagnostics in build output.
  void CONFIGURATOR_VERSION;

  renderAll();
};
