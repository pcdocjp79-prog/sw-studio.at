#!/usr/bin/env node
// Phase 1 hotfix — moves tailwind.css to be the LAST stylesheet in <head> so its
// utilities can override custom rules in style.css (mirrors the original CDN
// behavior, where the CDN script injected its <style> at the end of <head>).
//
// Usage: node scripts/phase1-fix-css-order.mjs

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

function fix(file, isProjekte) {
  const orig = readFileSync(file, "utf8");
  let out = orig;
  const log = [];

  const tailwindHref = isProjekte ? "../src/css/tailwind.css" : "src/css/tailwind.css";

  // 1) Remove any existing tailwind.css link line
  const existingTailwindRe = new RegExp(
    `[ \\t]*<link\\s+rel=["']stylesheet["']\\s+href=["']${tailwindHref.replace(/[.\\/]/g, "\\$&")}["']\\s*\\/?>\\s*\\n?`,
    "m"
  );
  if (existingTailwindRe.test(out)) {
    out = out.replace(existingTailwindRe, "");
    log.push("removed existing tailwind link");
  }

  // 2) Insert tailwind.css link right before </head>
  const tailwindLink = `  <link rel="stylesheet" href="${tailwindHref}" />\n`;
  if (!out.includes(tailwindHref)) {
    if (/<\/head>/i.test(out)) {
      out = out.replace(/(<\/head>)/i, `${tailwindLink}$1`);
      log.push("inserted tailwind.css before </head>");
    } else {
      log.push("WARN: no </head> found, skipped");
    }
  } else {
    log.push("tailwind.css link still present (replacement not applied)");
  }

  if (out !== orig) {
    writeFileSync(file, out);
    console.log(`✓ ${file}: ${log.join("; ")}`);
  } else {
    console.log(`- ${file}: no change (${log.join("; ") || "nothing matched"})`);
  }
}

for (const f of ROOT_FILES) fix(f, false);
for (const f of PROJEKTE_FILES) fix(f, true);
console.log("\nDone.");
