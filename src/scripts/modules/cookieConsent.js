const CONSENT_STORAGE_KEY = "smart-web-studio.cookie-consent";
const CONSENT_VERSION = "2026-03-08";
const COOKIE_PAGE_PATH = "cookies.html";
const COOKIE_SETTINGS_HASH = "cookie-settings";
const COOKIE_SETTINGS_FALLBACK = `${COOKIE_PAGE_PATH}#${COOKIE_SETTINGS_HASH}`;
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DEFAULT_CONSENT = Object.freeze({
  necessary: true,
  statistics: false,
  marketing: false,
});

const analyticsLoaders = [
  () => {
    // Future analytics scripts can be injected here after consent.
  },
];

const marketingLoaders = [
  () => {
    // Future marketing scripts can be injected here after consent.
  },
];

let memoryConsent = null;
let interfaceRoot = null;
let bannerElement = null;
let panelElement = null;
let backdropElement = null;
let lastTriggerElement = null;
let panelIsOpen = false;
let consentInitialized = false;
let analyticsLoaded = false;
let marketingLoaded = false;
let draftConsent = { ...DEFAULT_CONSENT };

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const createConsentPayload = (overrides = {}) => ({
  version: CONSENT_VERSION,
  updatedAt: overrides.updatedAt || new Date().toISOString(),
  necessary: true,
  statistics: Boolean(overrides.statistics),
  marketing: Boolean(overrides.marketing),
});

const getStoredConsent = () => {
  try {
    const serialized = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return serialized ? JSON.parse(serialized) : memoryConsent;
  } catch (_error) {
    return memoryConsent;
  }
};

const clearStoredConsent = () => {
  memoryConsent = null;

  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (_error) {
    // Ignore storage access issues and continue with in-memory state.
  }
};

const readConsent = () => {
  const storedConsent = getStoredConsent();

  if (!isPlainObject(storedConsent)) {
    return null;
  }

  if (storedConsent.version !== CONSENT_VERSION) {
    clearStoredConsent();
    return null;
  }

  if (
    typeof storedConsent.statistics !== "boolean" ||
    typeof storedConsent.marketing !== "boolean"
  ) {
    clearStoredConsent();
    return null;
  }

  return createConsentPayload(storedConsent);
};

const persistConsent = (nextConsent) => {
  const payload = createConsentPayload(nextConsent);
  memoryConsent = payload;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch (_error) {
    // Continue with the in-memory fallback when localStorage is blocked.
  }

  return payload;
};

const getConsentSummary = (consent) => {
  if (!consent) {
    return "Noch keine Auswahl gespeichert.";
  }

  if (consent.statistics && consent.marketing) {
    return "Aktuell aktiv: Notwendige, Statistik und Marketing.";
  }

  if (consent.statistics) {
    return "Aktuell aktiv: Notwendige und Statistik.";
  }

  if (consent.marketing) {
    return "Aktuell aktiv: Notwendige und Marketing.";
  }

  return "Aktuell aktiv: Nur notwendige Cookies.";
};

const updateConsentSummaries = (consent) => {
  const summaryText = getConsentSummary(consent);

  document.querySelectorAll("[data-cookie-consent-summary]").forEach((element) => {
    element.textContent = summaryText;
  });
};

const shouldOpenFromHash = () =>
  window.location.hash.replace(/^#/, "") === COOKIE_SETTINGS_HASH;

const syncConsentControls = () => {
  document.querySelectorAll("[data-consent-toggle]").forEach((input) => {
    const category = input.getAttribute("data-consent-toggle");
    if (category !== "statistics" && category !== "marketing") return;
    input.checked = Boolean(draftConsent[category]);
  });
};

const updateBannerState = (visible) => {
  if (!bannerElement) return;

  bannerElement.hidden = !visible;
  bannerElement.classList.toggle("is-visible", visible);
  document.body.classList.toggle("has-cookie-banner", visible);
};

const openPanelVisuals = () => {
  if (!panelElement || !backdropElement) return;

  panelElement.hidden = false;
  backdropElement.hidden = false;
  requestAnimationFrame(() => {
    panelElement.classList.add("is-visible");
    backdropElement.classList.add("is-visible");
  });
};

const closePanelVisuals = () => {
  if (!panelElement || !backdropElement) return;

  panelElement.classList.remove("is-visible");
  backdropElement.classList.remove("is-visible");
  panelElement.hidden = true;
  backdropElement.hidden = true;
};

const runLoaders = (loaders, category) => {
  loaders.forEach((loader) => {
    try {
      loader();
    } catch (error) {
      console.error(`Cookie consent loader failed for ${category}.`, error);
    }
  });
};

export const loadAnalyticsScripts = () => {
  if (analyticsLoaded) return;

  analyticsLoaded = true;
  document.documentElement.dataset.analyticsConsent = "granted";
  runLoaders(analyticsLoaders, "statistics");
};

export const loadMarketingScripts = () => {
  if (marketingLoaded) return;

  marketingLoaded = true;
  document.documentElement.dataset.marketingConsent = "granted";
  runLoaders(marketingLoaders, "marketing");
};

const dispatchConsentChange = (consent) => {
  document.dispatchEvent(
    new CustomEvent("cookieconsent:change", {
      detail: {
        consent,
        storageKey: CONSENT_STORAGE_KEY,
        version: CONSENT_VERSION,
      },
    })
  );
};

const applyConsent = (consent) => {
  document.documentElement.dataset.cookieConsent =
    consent ? "configured" : "pending";
  document.documentElement.dataset.cookieConsentStatistics =
    consent?.statistics ? "granted" : "denied";
  document.documentElement.dataset.cookieConsentMarketing =
    consent?.marketing ? "granted" : "denied";

  if (consent?.statistics) {
    loadAnalyticsScripts();
  }

  if (consent?.marketing) {
    loadMarketingScripts();
  }

  updateConsentSummaries(consent);
  dispatchConsentChange(consent);
};

const getConsentFromDraft = () =>
  createConsentPayload({
    statistics: draftConsent.statistics,
    marketing: draftConsent.marketing,
  });

const saveConsent = () => {
  const consent = persistConsent(getConsentFromDraft());
  draftConsent = { ...consent };
  syncConsentControls();
  updateBannerState(false);
  closeCookieSettings();
  applyConsent(consent);
};

const acceptAllConsent = () => {
  draftConsent = {
    ...DEFAULT_CONSENT,
    statistics: true,
    marketing: true,
  };
  syncConsentControls();
  saveConsent();
};

const acceptNecessaryOnly = () => {
  draftConsent = { ...DEFAULT_CONSENT };
  syncConsentControls();
  saveConsent();
};

const trapPanelFocus = (event) => {
  if (!panelIsOpen || event.key !== "Tab" || !panelElement) return;

  const focusableElements = Array.from(
    panelElement.querySelectorAll(FOCUSABLE_SELECTOR)
  ).filter((element) => !element.hasAttribute("hidden"));

  if (focusableElements.length === 0) {
    event.preventDefault();
    panelElement.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

const handlePanelKeydown = (event) => {
  if (!panelIsOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeCookieSettings();
    return;
  }

  trapPanelFocus(event);
};

const createConsentMarkup = () => `
  <div class="cookie-consent-root" data-cookie-consent-root>
    <div class="cookie-consent-backdrop" data-cookie-consent-backdrop hidden></div>
    <aside
      class="cookie-settings-panel"
      data-cookie-settings-panel
      id="cookie-consent-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
      aria-describedby="cookie-settings-description"
      tabindex="-1"
      hidden
    >
      <div class="cookie-settings-panel__header">
        <div>
          <p class="cookie-settings-panel__eyebrow">Cookie-Einstellungen</p>
          <h2 id="cookie-settings-title" class="cookie-settings-panel__title font-display">
            Deine Auswahl für Statistik und Marketing
          </h2>
          <p id="cookie-settings-description" class="cookie-settings-panel__description">
            Diese Website verwendet Cookies, um Funktionen bereitzustellen, die Nutzung zu analysieren
            und Marketing zu ermöglichen. Du kannst selbst entscheiden, welche Kategorien du zulassen möchtest.
          </p>
        </div>
        <button
          type="button"
          class="cookie-settings-panel__close"
          data-cookie-action="close"
          aria-label="Cookie-Einstellungen schließen"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div class="cookie-settings-panel__body">
        <div class="cookie-consent-card cookie-consent-card--required">
          <div class="cookie-consent-card__topline">
            <div>
              <h3 class="cookie-consent-card__title font-display">Notwendige Cookies</h3>
              <p class="cookie-consent-card__description">
                Diese Cookies sind für den Betrieb der Website erforderlich und speichern z. B. deine Consent-Auswahl.
              </p>
            </div>
            <span class="cookie-consent-badge cookie-consent-badge--locked">Immer aktiv</span>
          </div>
        </div>

        <label class="cookie-consent-card cookie-consent-card--interactive">
          <span class="cookie-consent-card__topline">
            <span>
              <span class="cookie-consent-card__title font-display">Statistik Cookies</span>
              <span class="cookie-consent-card__description">
                Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.
              </span>
            </span>
            <span class="cookie-consent-switch">
              <input type="checkbox" data-consent-toggle="statistics" />
              <span class="cookie-consent-switch__track" aria-hidden="true"></span>
              <span class="cookie-consent-switch__label">Statistik aktivieren</span>
            </span>
          </span>
        </label>

        <label class="cookie-consent-card cookie-consent-card--interactive">
          <span class="cookie-consent-card__topline">
            <span>
              <span class="cookie-consent-card__title font-display">Marketing Cookies</span>
              <span class="cookie-consent-card__description">
                Diese Cookies können verwendet werden, um Besuchern relevante Werbung anzuzeigen.
              </span>
            </span>
            <span class="cookie-consent-switch">
              <input type="checkbox" data-consent-toggle="marketing" />
              <span class="cookie-consent-switch__track" aria-hidden="true"></span>
              <span class="cookie-consent-switch__label">Marketing aktivieren</span>
            </span>
          </span>
        </label>
      </div>

      <div class="cookie-settings-panel__footer">
        <div class="cookie-consent-links">
          <a class="cookie-consent-links__link" href="datenschutz.html">Datenschutz</a>
          <a
            class="cookie-consent-links__link"
            href="${COOKIE_SETTINGS_FALLBACK}"
            data-open-cookie-settings
          >
            Cookie-Einstellungen
          </a>
          <a class="cookie-consent-links__link" href="${COOKIE_PAGE_PATH}">Cookie-Seite</a>
        </div>
        <div class="cookie-consent-actions cookie-consent-actions--panel">
          <button type="button" class="cookie-consent-btn cookie-consent-btn--ghost" data-cookie-action="necessary">
            Nur notwendige
          </button>
          <button type="button" class="cookie-consent-btn cookie-consent-btn--secondary" data-cookie-action="save">
            Auswahl speichern
          </button>
          <button type="button" class="cookie-consent-btn cookie-consent-btn--primary" data-cookie-action="accept-all">
            Alle akzeptieren
          </button>
        </div>
      </div>
    </aside>

    <section
      class="cookie-banner"
      data-cookie-banner
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      hidden
    >
      <div class="cookie-banner__content">
        <div class="cookie-banner__copy">
          <p class="cookie-banner__eyebrow">Datenschutz & Consent</p>
          <h2 id="cookie-banner-title" class="cookie-banner__title font-display">
            Cookie-Auswahl für Smart Web Studio
          </h2>
          <p id="cookie-banner-description" class="cookie-banner__description">
            Diese Website verwendet Cookies, um Funktionen bereitzustellen, die Nutzung zu analysieren und Marketing zu ermöglichen.
            Du kannst selbst entscheiden, welche Kategorien du zulassen möchtest.
          </p>
        </div>

        <div class="cookie-banner__categories" aria-label="Cookie-Kategorien">
          <span class="cookie-banner__pill cookie-banner__pill--static">Notwendige: immer aktiv</span>
          <label class="cookie-banner__toggle">
            <input type="checkbox" data-consent-toggle="statistics" />
            <span>Statistik</span>
          </label>
          <label class="cookie-banner__toggle">
            <input type="checkbox" data-consent-toggle="marketing" />
            <span>Marketing</span>
          </label>
        </div>

        <div class="cookie-consent-links">
          <a class="cookie-consent-links__link" href="datenschutz.html">Datenschutz</a>
          <a
            class="cookie-consent-links__link"
            href="${COOKIE_SETTINGS_FALLBACK}"
            data-open-cookie-settings
          >
            Cookie-Einstellungen
          </a>
          <a class="cookie-consent-links__link" href="${COOKIE_PAGE_PATH}">Cookie-Seite</a>
        </div>
      </div>

      <div class="cookie-consent-actions">
        <button type="button" class="cookie-consent-btn cookie-consent-btn--ghost" data-cookie-action="necessary">
          Nur notwendige
        </button>
        <button type="button" class="cookie-consent-btn cookie-consent-btn--secondary" data-cookie-action="save">
          Auswahl speichern
        </button>
        <button type="button" class="cookie-consent-btn cookie-consent-btn--primary" data-cookie-action="accept-all">
          Alle akzeptieren
        </button>
      </div>
    </section>
  </div>
`;

const ensureConsentInterface = () => {
  if (interfaceRoot) return;

  const interfaceWrapper = document.createElement("div");
  interfaceWrapper.innerHTML = createConsentMarkup().trim();
  interfaceRoot = interfaceWrapper.firstElementChild;
  document.body.appendChild(interfaceRoot);

  bannerElement = interfaceRoot.querySelector("[data-cookie-banner]");
  panelElement = interfaceRoot.querySelector("[data-cookie-settings-panel]");
  backdropElement = interfaceRoot.querySelector("[data-cookie-consent-backdrop]");
};

const setDraftConsentCategory = (category, value) => {
  if (category !== "statistics" && category !== "marketing") return;

  draftConsent = {
    ...DEFAULT_CONSENT,
    statistics: category === "statistics" ? Boolean(value) : draftConsent.statistics,
    marketing: category === "marketing" ? Boolean(value) : draftConsent.marketing,
  };

  syncConsentControls();
};

const bindConsentEvents = () => {
  interfaceRoot?.addEventListener("change", (event) => {
    if (!(event.target instanceof Element)) return;

    const toggle = event.target.closest("[data-consent-toggle]");
    if (!(toggle instanceof HTMLInputElement)) return;
    setDraftConsentCategory(toggle.getAttribute("data-consent-toggle"), toggle.checked);
  });

  interfaceRoot?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const actionTrigger = event.target.closest("[data-cookie-action]");
    if (!actionTrigger) return;

    const action = actionTrigger.getAttribute("data-cookie-action");

    switch (action) {
      case "close":
        closeCookieSettings();
        break;
      case "necessary":
        acceptNecessaryOnly();
        break;
      case "save":
        saveConsent();
        break;
      case "accept-all":
        acceptAllConsent();
        break;
      default:
        break;
    }
  });

  backdropElement?.addEventListener("click", () => {
    closeCookieSettings();
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const trigger = event.target.closest("[data-open-cookie-settings]");
    if (!trigger) return;

    event.preventDefault();
    openCookieSettings(trigger);
  });

  document.addEventListener("keydown", handlePanelKeydown);
};

export const openCookieSettings = (triggerElement = null) => {
  ensureConsentInterface();

  lastTriggerElement =
    triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
  panelIsOpen = true;
  syncConsentControls();
  openPanelVisuals();
  document.body.classList.add("has-cookie-settings-open");

  const preferredFocusTarget =
    panelElement?.querySelector('[data-cookie-action="close"]') || panelElement;
  preferredFocusTarget?.focus({ preventScroll: true });
};

export const closeCookieSettings = () => {
  if (!panelIsOpen) return;

  panelIsOpen = false;
  document.body.classList.remove("has-cookie-settings-open");
  closePanelVisuals();

  if (lastTriggerElement instanceof HTMLElement) {
    lastTriggerElement.focus({ preventScroll: true });
  }
};

export const checkCookieConsent = () => {
  ensureConsentInterface();

  const storedConsent = readConsent();
  draftConsent = storedConsent ? { ...storedConsent } : { ...DEFAULT_CONSENT };
  syncConsentControls();
  updateBannerState(!storedConsent);
  applyConsent(storedConsent);

  return storedConsent;
};

export const initCookieConsent = () => {
  if (consentInitialized) return;

  consentInitialized = true;
  ensureConsentInterface();
  bindConsentEvents();
  window.openCookieSettings = openCookieSettings;
  checkCookieConsent();

  if (shouldOpenFromHash()) {
    openCookieSettings();
  }
};
