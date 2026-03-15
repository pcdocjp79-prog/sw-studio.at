import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HTML_FILES = fs
  .readdirSync(ROOT)
  .filter((name) => name.endsWith(".html"))
  .sort();

const LEGACY_PAGES = new Set(["marketing.html"]);
const ACTIVE_JS = "src/js/main.js";
const ACTIVE_CSS = "src/css/style.css";
const TAILWIND_CDN_SRC = "https://cdn.tailwindcss.com";
const TAILWIND_INLINE_MARKER = "window.tailwind.config";
const DISALLOWED_REFS = new Set(["src/main.js", "src/styles/main.scss"]);

const errors = [];

const readFile = (filePath) => fs.readFileSync(path.join(ROOT, filePath), "utf8");

const fileExists = (targetPath) => fs.existsSync(path.resolve(ROOT, targetPath));

const collectIds = (html) =>
  new Set(Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]));

const parseAttributes = (source) => {
  const attributes = new Map();
  const attributePattern =
    /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of source.matchAll(attributePattern)) {
    const [, rawName, doubleQuoted, singleQuoted, bareValue] = match;
    attributes.set(
      rawName.toLowerCase(),
      doubleQuoted ?? singleQuoted ?? bareValue ?? ""
    );
  }

  return attributes;
};

const collectTags = (html) =>
  Array.from(html.matchAll(/<([a-z0-9-]+)\b([^>]*)>/gi), (match) => ({
    name: match[1].toLowerCase(),
    raw: match[0],
    attributes: parseAttributes(match[2]),
  }));

const htmlByFile = new Map(HTML_FILES.map((file) => [file, readFile(file)]));
const idsByFile = new Map(
  Array.from(htmlByFile.entries(), ([file, html]) => [file, collectIds(html)])
);

const isExternalTarget = (value) =>
  /^(?:[a-z]+:|\/\/)/i.test(value) || value.startsWith("mailto:") || value.startsWith("tel:");

const normalizeLocalPath = (value) => value.split("#")[0].split("?")[0];

const ensureTargetExists = (sourceFile, target) => {
  if (!target || isExternalTarget(target) || target.startsWith("javascript:")) {
    return;
  }

  const [pathPart, hashPart] = target.split("#");
  const localPath = normalizeLocalPath(pathPart);

  if (!localPath) {
    if (hashPart && !idsByFile.get(sourceFile)?.has(hashPart)) {
      errors.push(`${sourceFile}: missing same-page anchor "#${hashPart}"`);
    }
    return;
  }

  if (localPath.startsWith("/")) {
    errors.push(`${sourceFile}: absolute local runtime target "${target}" is not allowed`);
    return;
  }

  if (!fileExists(localPath)) {
    errors.push(`${sourceFile}: missing local target "${target}"`);
    return;
  }

  if (hashPart && localPath.endsWith(".html") && htmlByFile.has(localPath)) {
    if (!idsByFile.get(localPath)?.has(hashPart)) {
      errors.push(`${sourceFile}: missing target anchor "${target}"`);
    }
  }
};

for (const file of HTML_FILES) {
  const html = htmlByFile.get(file);
  const tags = collectTags(html);
  const isLegacyPage = LEGACY_PAGES.has(file);

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) {
    errors.push(`${file}: expected exactly 1 h1, found ${h1Count}`);
  }

  const bodyTag = tags.find((tag) => tag.name === "body");
  const bodyPage = bodyTag?.attributes.get("data-page")?.trim();
  if (!bodyPage) {
    errors.push(`${file}: missing body[data-page]`);
  }

  const stylesheetLinks = tags.filter(
    (tag) =>
      tag.name === "link" &&
      tag.attributes.get("rel") === "stylesheet" &&
      tag.attributes.has("href")
  );
  const moduleScripts = tags.filter(
    (tag) =>
      tag.name === "script" &&
      tag.attributes.get("type") === "module" &&
      tag.attributes.has("src")
  );
  const tailwindCdnScripts = tags.filter(
    (tag) =>
      tag.name === "script" && tag.attributes.get("src") === TAILWIND_CDN_SRC
  );

  if (!isLegacyPage) {
    const activeCssCount = stylesheetLinks.filter(
      (tag) => tag.attributes.get("href") === ACTIVE_CSS
    ).length;
    const activeJsCount = moduleScripts.filter(
      (tag) => tag.attributes.get("src") === ACTIVE_JS
    ).length;

    if (activeCssCount !== 1) {
      errors.push(`${file}: expected 1 active stylesheet reference, found ${activeCssCount}`);
    }

    if (activeJsCount !== 1) {
      errors.push(`${file}: expected 1 active module entry reference, found ${activeJsCount}`);
    }

    if (!html.includes(TAILWIND_INLINE_MARKER)) {
      errors.push(`${file}: missing inline tailwind config marker`);
    }

    if (tailwindCdnScripts.length !== 1) {
      errors.push(`${file}: expected 1 Tailwind CDN script, found ${tailwindCdnScripts.length}`);
    }

    if (!/id="primary-nav"/.test(html)) {
      errors.push(`${file}: missing primary navigation placeholder`);
    }

    if (!/id="site-footer"/.test(html)) {
      errors.push(`${file}: missing site footer placeholder`);
    }
  }

  for (const disallowedRef of DISALLOWED_REFS) {
    if (html.includes(disallowedRef)) {
      errors.push(`${file}: references removed legacy path "${disallowedRef}"`);
    }
  }

  for (const tag of tags) {
    if (tag.name === "a" && tag.attributes.has("href")) {
      ensureTargetExists(file, tag.attributes.get("href"));
    }

    if (tag.name === "script" && tag.attributes.has("src")) {
      ensureTargetExists(file, tag.attributes.get("src"));
    }

    if (
      tag.name === "link" &&
      tag.attributes.get("rel") === "stylesheet" &&
      tag.attributes.has("href")
    ) {
      ensureTargetExists(file, tag.attributes.get("href"));
    }

    if (tag.name === "img" && tag.attributes.has("src")) {
      ensureTargetExists(file, tag.attributes.get("src"));
    }

    if (tag.attributes.has("srcset")) {
      for (const candidate of tag.attributes.get("srcset").split(",")) {
        const [src] = candidate.trim().split(/\s+/);
        if (src) ensureTargetExists(file, src);
      }
    }
  }

  const filterGroups = Array.from(
    html.matchAll(
      /<([a-z0-9-]+)\b[^>]*data-filter-group="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi
    ),
    (match) => ({
      name: match[2],
      content: match[3],
    })
  );

  for (const group of filterGroups) {
    const filterButtons = (group.content.match(/data-filter-value="/g) || []).length;
    const groupItems =
      (html.match(new RegExp(`data-filter-item="${group.name}"`, "g")) || []).length;

    if (filterButtons === 0) {
      errors.push(`${file}: data-filter-group "${group.name}" has no filter buttons`);
    }

    if (groupItems === 0) {
      errors.push(`${file}: data-filter-group "${group.name}" has no matching items`);
    }
  }
  for (const match of html.matchAll(/<([a-z0-9-]+)\b([^>]*)data-card-link="([^"]+)"([^>]*)>/gi)) {
    const fullTag = match[0];
    const target = match[3];

    if (!/role="link"/i.test(fullTag)) {
      errors.push(`${file}: data-card-link target "${target}" is missing role="link"`);
    }

    if (!/tabindex="0"/i.test(fullTag)) {
      errors.push(`${file}: data-card-link target "${target}" is missing tabindex="0"`);
    }

    ensureTargetExists(file, target);
  }

  const contactForms = Array.from(html.matchAll(/<form\b([^>]*)data-contact-form\b([^>]*)>/gi));
  if (contactForms.length > 1) {
    errors.push(`${file}: expected at most 1 data-contact-form, found ${contactForms.length}`);
  }

  if (contactForms.length === 1) {
    const fullTag = contactForms[0][0];
    const actionMatch = fullTag.match(/\saction="([^"]*)"/i);
    const successHrefMatch = fullTag.match(/\sdata-success-href="([^"]+)"/i);
    const bodySuccessPath = bodyTag?.attributes.get("data-contact-success-path")?.trim();

    if (!actionMatch?.[1] && !successHrefMatch?.[1] && !bodySuccessPath) {
      errors.push(`${file}: data-contact-form needs action, data-success-href, or body data-contact-success-path`);
    }

    if (successHrefMatch?.[1]) {
      ensureTargetExists(file, successHrefMatch[1]);
    }
  }

  for (const match of html.matchAll(/data-prefill-target="([^"]+)"/g)) {
    const targetId = match[1];
    if (!idsByFile.get(file)?.has(targetId)) {
      errors.push(`${file}: missing data-prefill-target id "${targetId}"`);
    }
  }

  if (html.includes("data-hero-stage") && !html.includes("data-hero-stage-card")) {
    errors.push(`${file}: data-hero-stage is missing data-hero-stage-card`);
  }
}

if (!idsByFile.get("cookies.html")?.has("cookie-settings")) {
  errors.push('cookies.html: missing required "#cookie-settings" anchor');
}

if (!(htmlByFile.get("cookies.html")?.includes("data-cookie-consent-summary"))) {
  errors.push("cookies.html: missing data-cookie-consent-summary hook");
}

if (!fileExists(ACTIVE_JS)) {
  errors.push(`missing required active JS entry "${ACTIVE_JS}"`);
}

if (!fileExists(ACTIVE_CSS)) {
  errors.push(`missing required active stylesheet "${ACTIVE_CSS}"`);
}

if (errors.length > 0) {
  console.error("Repo check failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Repo check passed for ${HTML_FILES.length} HTML entry files.`);
