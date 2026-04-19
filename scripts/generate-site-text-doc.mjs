import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "website-texte-komplett.md");

const PAGE_ORDER = [
  "index.html",
  "leistungen.html",
  "webentwicklung.html",
  "branding.html",
  "seo-marketing.html",
  "social.html",
  "growth.html",
  "ki-beratung.html",
  "projekte.html",
  "projekte/website-branding-setup.html",
  "projekte/relaunch-seo.html",
  "projekte/content-tracking-system.html",
  "projekte/funnel-optimierung.html",
  "case-study.html",
  "ablauf.html",
  "preise.html",
  "ueber-mich.html",
  "insights.html",
  "kontakt.html",
  "danke.html",
  "impressum.html",
  "datenschutz.html",
  "cookies.html",
  "marketing.html",
];

const GLOBAL_TEXTS = [
  {
    title: "Hauptnavigation",
    lines: [
      "Smart Web Studio",
      "Start",
      "Leistungen",
      "Projekte",
      "Ablauf",
      "Über mich",
      "Preise",
      "Insights",
      "Kontakt",
      "Erstgespräch buchen",
    ],
  },
  {
    title: "Footer",
    lines: [
      "Smart Web Studio",
      "Marke. Website. Wachstum.",
      "Strategische Websites mit klarer Positionierung, sauberer Nutzerführung und einer Conversion-Architektur, die Vertrauen in Anfragen übersetzt.",
      "Direkter Ansprechpartner | Vorarlberg / DACH",
      "Direkte Zusammenarbeit, strukturierter Ablauf und Fokus auf passende Projekte.",
      "Erstgespräch buchen",
      "Webentwicklung",
      "Branding",
      "SEO & Marketing",
      "Social Strategie",
      "Growth Strategie",
      "KI Beratung",
      "Start",
      "Leistungen",
      "Projekte",
      "Marken- & Website-Setup",
      "Relaunch & SEO",
      "Content- & Tracking-System",
      "Funnel-Optimierung",
      "Case Study",
      "Ablauf",
      "Über mich",
      "Preise",
      "Insights",
      "Kontakt",
      "Impressum",
      "Datenschutz",
      "Cookies",
      "Cookie-Einstellungen",
      "© 2026 Smart Web Studio.",
      "Built for clarity, structure and conversion.",
    ],
  },
  {
    title: "Mobile Sticky CTA",
    lines: ["Direkter Projektstart", "Erstgespräch buchen"],
  },
  {
    title: "Cookie-Consent",
    lines: [
      "Datenschutz & Consent",
      "Cookie-Auswahl für Smart Web Studio",
      "Diese Website verwendet Cookies, um Funktionen bereitzustellen, die Nutzung zu analysieren und Marketing zu ermöglichen. Du kannst selbst entscheiden, welche Kategorien du zulassen möchtest.",
      "Notwendige: immer aktiv",
      "Statistik",
      "Marketing",
      "Datenschutz",
      "Cookie-Einstellungen",
      "Cookie-Seite",
      "Nur notwendige",
      "Auswahl speichern",
      "Alle akzeptieren",
      "Deine Auswahl für Statistik und Marketing",
      "Notwendige Cookies",
      "Diese Cookies sind für den Betrieb der Website erforderlich und speichern z. B. deine Consent-Auswahl.",
      "Immer aktiv",
      "Statistik Cookies",
      "Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.",
      "Statistik aktivieren",
      "Marketing Cookies",
      "Diese Cookies können verwendet werden, um Besuchern relevante Werbung anzuzeigen.",
      "Marketing aktivieren",
    ],
  },
];

const BLOCK_TAGS = new Set([
  "a",
  "address",
  "article",
  "aside",
  "blockquote",
  "button",
  "dd",
  "details",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "label",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
]);

function decodeHtmlEntities(value) {
  if (!value) return "";

  const named = {
    amp: "&",
    apos: "'",
    quot: '"',
    lt: "<",
    gt: ">",
    nbsp: " ",
    ndash: "-",
    mdash: "-",
    hellip: "...",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (!entity) return match;

    if (entity[0] === "#") {
      const isHex = entity[1]?.toLowerCase() === "x";
      const number = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(number) ? String.fromCodePoint(number) : match;
    }

    return named[entity.toLowerCase()] ?? match;
  });
}

function normalizeWhitespace(lines) {
  const result = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (!line) continue;
    if (result[result.length - 1] === line) continue;
    result.push(line);
  }

  return result;
}

function stripHiddenAndNonContent(html) {
  let cleaned = html;

  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");
  cleaned = cleaned.replace(/<(script|style|svg|noscript|picture|video|audio|canvas)\b[\s\S]*?<\/\1>/gi, "");
  cleaned = cleaned.replace(/<(meta|link|source|img|input)\b[^>]*\/?>/gi, "");
  cleaned = cleaned.replace(/<br\b[^>]*\/?>/gi, "\n");

  const removableBlocks = [
    /<([a-z0-9:-]+)\b[^>]*\bhidden\b[^>]*>[\s\S]*?<\/\1>/gi,
    /<([a-z0-9:-]+)\b[^>]*\baria-hidden\s*=\s*"true"[^>]*>[\s\S]*?<\/\1>/gi,
    /<([a-z0-9:-]+)\b[^>]*\bclass\s*=\s*"[^"]*\bsr-only\b[^"]*"[^>]*>[\s\S]*?<\/\1>/gi,
  ];

  for (const pattern of removableBlocks) {
    let previous = "";
    while (previous !== cleaned) {
      previous = cleaned;
      cleaned = cleaned.replace(pattern, "");
    }
  }

  return cleaned;
}

function htmlToLines(html) {
  const blockBreak = "__BLOCK_BREAK__";

  const prepared = stripHiddenAndNonContent(html)
    .replace(/<\/([a-z0-9:-]+)>/gi, (match, tag) => (BLOCK_TAGS.has(tag.toLowerCase()) ? blockBreak : ""))
    .replace(/<([a-z0-9:-]+)\b[^>]*>/gi, (match, tag) => (BLOCK_TAGS.has(tag.toLowerCase()) ? blockBreak : ""))
    .replace(/<[^>]+>/g, "");

  const decoded = decodeHtmlEntities(prepared)
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]*\n[ \t]*/g, " ")
    .replace(/\s+/g, " ")
    .replace(new RegExp(`\\s*${blockBreak}\\s*`, "g"), "\n")
    .replace(/\n{3,}/g, "\n\n");

  return normalizeWhitespace(decoded.split("\n"));
}

function extractBodyOrMain(html) {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

function extractTopLevelSections(html) {
  const sections = [];
  const sectionTagRegex = /<\/?section\b[^>]*>/gi;
  let depth = 0;
  let startIndex = null;
  let match;

  while ((match = sectionTagRegex.exec(html)) !== null) {
    const tag = match[0];
    const isClosing = tag.startsWith("</");

    if (!isClosing) {
      if (depth === 0) {
        startIndex = match.index;
      }
      depth += 1;
      continue;
    }

    if (depth === 0) continue;
    depth -= 1;

    if (depth === 0 && startIndex !== null) {
      sections.push(html.slice(startIndex, sectionTagRegex.lastIndex));
      startIndex = null;
    }
  }

  return sections;
}

function extractTextColumns(filePath) {
  const html = fs.readFileSync(path.join(ROOT, filePath), "utf8");
  const contentArea = extractBodyOrMain(html);
  const sections = extractTopLevelSections(contentArea);

  if (sections.length === 0) {
    const fallbackLines = htmlToLines(contentArea);
    return fallbackLines.length ? [fallbackLines] : [];
  }

  const columns = sections
    .map((section) => htmlToLines(section))
    .filter((lines) => lines.length > 0);

  return columns;
}

function renderLines(lines) {
  return lines.map((line) => `${line}`).join("\n");
}

function buildMarkdown() {
  const chunks = [
    "# Website-Textdokumentation",
    "",
    "Diese Datei enthält nur die sichtbaren Website-Texte der vorhandenen Seiten. Wiederkehrende Elemente wie Navigation, Footer und Cookie-Consent stehen gesammelt am Anfang; danach folgen die einzelnen Seiten mit `Spalte 1`, `Spalte 2`, `Spalte 3` usw.",
    "",
    "## Wiederkehrende Texte",
    "",
  ];

  GLOBAL_TEXTS.forEach((entry, index) => {
    chunks.push(`### Spalte ${index + 1} - ${entry.title}`);
    chunks.push("");
    chunks.push(renderLines(entry.lines));
    chunks.push("");
  });

  PAGE_ORDER.forEach((filePath) => {
    const columns = extractTextColumns(filePath);

    chunks.push(`## ${filePath}`);
    chunks.push("");

    if (columns.length === 0) {
      chunks.push("### Spalte 1");
      chunks.push("");
      chunks.push("Kein sichtbarer Inhalt gefunden.");
      chunks.push("");
      return;
    }

    columns.forEach((lines, index) => {
      chunks.push(`### Spalte ${index + 1}`);
      chunks.push("");
      chunks.push(renderLines(lines));
      chunks.push("");
    });
  });

  return `${chunks.join("\n").trim()}\n`;
}

fs.writeFileSync(OUTPUT_FILE, buildMarkdown(), "utf8");
console.log(`Dokumentation erstellt: ${path.relative(ROOT, OUTPUT_FILE)}`);
