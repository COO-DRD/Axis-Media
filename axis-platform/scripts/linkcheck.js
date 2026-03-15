#!/usr/bin/env node
/**
 * AXIS Pre-flight Link Checker
 * --------------------------------------------------
 * Crawls the built /dist directory and validates every
 * internal href and src attribute.
 *
 * Rules enforced:
 *  - No href="" (empty links)
 *  - No href="#" placeholder anchors on live pages
 *  - No "Coming Soon" or placeholder text patterns
 *  - All internal links must resolve to an actual file in /dist
 *  - All <img src> must resolve to an actual asset
 *
 * Usage:
 *   node scripts/linkcheck.js [--dist ./dist] [--base-url https://axismediaws.com]
 *   npm run check:links
 *
 * Exit code 0 = no violations
 * Exit code 1 = violations found (fails CI)
 */

const fs   = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const DIST    = args.find(a => a.startsWith("--dist="))?.split("=")[1]  || "./dist";
const BASE    = args.find(a => a.startsWith("--base-url="))?.split("=")[1] || "https://axismediaws.com";
const VERBOSE = args.includes("--verbose");

const PLACEHOLDER_PATTERNS = [
  /coming soon/i,
  /under construction/i,
  /lorem ipsum/i,
  /placeholder/i,
  /tbd\b/i,
  /\[insert/i,
];

// ── State ────────────────────────────────────────────────────────────────
const violations = [];
const checked    = { links: 0, images: 0, text: 0 };


// ── Utilities ────────────────────────────────────────────────────────────

function log(msg) { if (VERBOSE) console.log(`  ${msg}`); }

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function resolveInternalPath(href, distRoot) {
  // Strip query strings and hash
  const clean = href.split("?")[0].split("#")[0];
  if (!clean || clean === "/") return path.join(distRoot, "index.html");

  // Try exact file, then /index.html
  const candidates = [
    path.join(distRoot, clean),
    path.join(distRoot, clean, "index.html"),
    path.join(distRoot, clean.replace(/\/$/, ""), "index.html"),
  ];
  return candidates.find(c => fs.existsSync(c)) || null;
}

function extractLinks(html) {
  const links  = [];
  const hrefRe = /href=["']([^"']+)["']/g;
  const srcRe  = /src=["']([^"']+)["']/g;
  let m;
  while ((m = hrefRe.exec(html)) !== null) links.push({ type: "href", value: m[1] });
  while ((m = srcRe.exec(html))  !== null) links.push({ type: "src",  value: m[1] });
  return links;
}


// ── Main Checker ─────────────────────────────────────────────────────────

function checkFile(filePath, distRoot) {
  const html     = fs.readFileSync(filePath, "utf-8");
  const relPath  = path.relative(distRoot, filePath);
  const pageHref = `/${relPath.replace(/index\.html$/, "").replace(/\.html$/, "")}`;

  log(`Checking: ${relPath}`);

  // 1. Placeholder text check
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(html)) {
      violations.push({
        type:    "PLACEHOLDER_TEXT",
        page:    pageHref,
        detail:  `Matches pattern: ${pattern}`,
      });
    }
  }
  checked.text++;

  // 2. Link / src checks
  for (const { type, value } of extractLinks(html)) {
    const href = value.trim();

    // Skip external, mailto, tel, data URIs, and CDN assets
    if (
      href.startsWith("http://")  ||
      href.startsWith("https://") ||
      href.startsWith("mailto:")  ||
      href.startsWith("tel:")     ||
      href.startsWith("data:")    ||
      href.startsWith("//")
    ) {
      continue;
    }

    // Empty href violation
    if (!href || href === "#") {
      violations.push({
        type:    "EMPTY_LINK",
        page:    pageHref,
        detail:  `${type}="${href}"`,
      });
      continue;
    }

    // Only check absolute internal paths (starting with /)
    if (!href.startsWith("/")) continue;

    if (type === "href") {
      checked.links++;
      const resolved = resolveInternalPath(href, distRoot);
      if (!resolved) {
        violations.push({
          type:    "DEAD_INTERNAL_LINK",
          page:    pageHref,
          href,
          detail:  `No matching file found in ${distRoot}`,
        });
      } else {
        log(`  ✓ href "${href}" → ${path.relative(distRoot, resolved)}`);
      }
    }

    if (type === "src") {
      checked.images++;
      const assetPath = path.join(distRoot, href);
      if (!fs.existsSync(assetPath)) {
        violations.push({
          type:    "MISSING_ASSET",
          page:    pageHref,
          href,
          detail:  `Asset not found: ${assetPath}`,
        });
      }
    }
  }
}


// ── Run ──────────────────────────────────────────────────────────────────

console.log("\n╔══════════════════════════════════════════════════╗");
console.log("║  AXIS Pre-flight Link Checker                    ║");
console.log("╚══════════════════════════════════════════════════╝\n");

if (!fs.existsSync(DIST)) {
  console.error(`✗ dist directory not found: ${DIST}`);
  console.error("  Run 'astro build' first.\n");
  process.exit(1);
}

const htmlFiles = collectHtmlFiles(DIST);
console.log(`  Scanning ${htmlFiles.length} HTML files in ${DIST}…\n`);

for (const file of htmlFiles) {
  checkFile(file, path.resolve(DIST));
}

// ── Report ────────────────────────────────────────────────────────────────

console.log(`\n  ─── Summary ─────────────────────────────────────`);
console.log(`  Pages scanned:    ${htmlFiles.length}`);
console.log(`  Links checked:    ${checked.links}`);
console.log(`  Assets checked:   ${checked.images}`);
console.log(`  Text scans:       ${checked.text}`);
console.log(`  Violations found: ${violations.length}`);

if (violations.length === 0) {
  console.log("\n  ✓ No dead links. No placeholder text. Infrastructure is clean.\n");
  process.exit(0);
} else {
  console.log("\n  ✗ VIOLATIONS DETECTED — Fix before deploying:\n");
  const grouped = violations.reduce((acc, v) => {
    acc[v.type] = acc[v.type] || [];
    acc[v.type].push(v);
    return acc;
  }, {});

  for (const [type, items] of Object.entries(grouped)) {
    console.log(`  [${type}] (${items.length} occurrence${items.length > 1 ? "s" : ""})`);
    for (const item of items) {
      console.log(`    Page: ${item.page}`);
      if (item.href)   console.log(`    Link: ${item.href}`);
      console.log(`    Note: ${item.detail}\n`);
    }
  }

  console.log("  → All violations must be resolved before deployment.");
  console.log("  → Dead links redirect to /?ref=404 at the Cloudflare edge.");
  console.log("  → Draft portfolio pieces must stay in Supabase 'draft' state.\n");
  process.exit(1);
}
