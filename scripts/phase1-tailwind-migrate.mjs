#!/usr/bin/env node
// Phase 1 — One-shot migration: removes Tailwind Play-CDN + inline config from all HTML
// files and inserts a <link> to the build-step Tailwind stylesheet. Idempotent.
//
// Usage: node scripts/phase1-tailwind-migrate.mjs

import { readFileSync, writeFileSync } from "node:fs";

const ROOT_FILES = [
  "index.html", "ablauf.html", "branding.html", "case-study.html", "cookies.html",
  "danke.html", "datenschutz.html", "growth.html", "impressum.html", "insights.html",
  "ki-beratung.html", "kontakt.html", "leistungen.html", "preise.html", "projekte.html",
  "seo-marketing.html", "social.html", "ueber-mich.html", "webentwicklung.html",
  "marketing.html",
];
const PROJEKTE_FILES = [
  "projekte/website-branding-setup.html",
  "projekte/relaunch-seo.html",
  "projekte/funnel-optimierung.html",
  "projekte/content-tracking-system.html",
];

const INLINE_CONFIG_RE = /[ \t]*<script>\s*window\.tailwind[\s\S]*?<\/script>\s*\n?/m;
const CDN_SCRIPT_RE = /[ \t]*<script\s+src=["']https:\/\/cdn\.tailwindcss\.com["'][^>]*><\/script>\s*\n?/m;
const STYLE_LINK_RE = /(<link\s+rel=["']stylesheet["']\s+href=["'](?:\.\.\/)?src\/css\/style\.css["']\s*\/?>)/m;

function migrate(file, isProjekte) {
  const orig = readFileSync(file, "utf8");
  let out = orig;
  const log = [];

  if (INLINE_CONFIG_RE.test(out)) {
    out = out.replace(INLINE_CONFIG_RE, "");
    log.push("removed inline tailwind.config");
  }
  if (CDN_SCRIPT_RE.test(out)) {
    out = out.replace(CDN_SCRIPT_RE, "");
    log.push("removed cdn.tailwindcss.com script");
  }

  const tailwindHref = isProjekte ? "../src/css/tailwind.css" : "src/css/tailwind.css";
  const tailwindLink = `<link rel="stylesheet" href="${tailwindHref}" />`;

  if (!out.includes(tailwindHref)) {
    if (STYLE_LINK_RE.test(out)) {
      out = out.replace(STYLE_LINK_RE, `${tailwindLink}\n  $1`);
      log.push("inserted tailwind.css link before style.css");
    } else {
      log.push("WARN: no style.css link found, skipping tailwind link insertion");
    }
  } else {
    log.push("tailwind.css link already present");
  }

  if (out !== orig) {
    writeFileSync(file, out);
    console.log(`✓ ${file}: ${log.join("; ")}`);
  } else {
    console.log(`- ${file}: no change (${log.join("; ") || "nothing matched"})`);
  }
}

for (const f of ROOT_FILES) migrate(f, false);
for (const f of PROJEKTE_FILES) migrate(f, true);
console.log("\nDone.");
