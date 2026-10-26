#!/usr/bin/env node
/**
 * Revatya v1.2.0 — Automated Overhaul Verification Suite
 * Verifies:
 * 1. Zero sub-12px font classes (`text-[9px]`, `text-[10px]`, `text-[11px]`) across `src/`
 * 2. Zero `rounded-full` pill classes across `src/` (except decorative blur blobs or status dots)
 * 3. Removal of `shortBrandStatement` from `src/components/layout/Footer.tsx`
 * 4. Existence and non-zero byte size of all 37 bespoke `.webp` images and 1 `.mp4` video
 * 5. 100% unique (zero duplicate reuse) bespoke image assignment across districts, applications,
 *    roadmap stages, research programmes, city perspectives, and narrative visuals in `src/data/siteContent.ts`
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function walkFiles(dir, extFilter = ['.ts', '.tsx', '.css']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, extFilter));
    } else if (extFilter.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

let failures = 0;
function pass(msg) {
  console.log(`  PASS  ${msg}`);
}
function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  failures++;
}

console.log('=== Revatya v2.0.0 Automated Verification Suite ===\n');

// 1. Check for sub-12px typography classes
const srcFiles = walkFiles(SRC_DIR);
const sub12Regex = /text-\[(?:9|10|11)px\]/g;
const sub12Hits = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(sub12Regex);
  if (matches) {
    sub12Hits.push(`${path.relative(ROOT_DIR, file)} (${matches.join(', ')})`);
  }
}

if (sub12Hits.length === 0) {
  pass('Zero sub-12px font utility classes (`text-[9px]`, `text-[10px]`, `text-[11px]`) in `src/`');
} else {
  fail(`Found sub-12px font classes in: ${sub12Hits.join('; ')}`);
}

// 2. Check Footer.tsx for removed paragraph
const footerPath = path.join(SRC_DIR, 'components/layout/Footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf8');
if (!footerContent.includes('shortBrandStatement')) {
  pass('Footer paragraph (`BRAND_CONTENT.shortBrandStatement`) is removed from `Footer.tsx`');
} else {
  fail('`shortBrandStatement` is still present in `Footer.tsx`');
}

// 3. Check `rounded-full` in UI components (allow only tiny decorative dots h-1.5/h-2 or blur-[120px] ambient glow)
const pillViolations = [];
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('rounded-full')) {
      const isAmbientGlow = line.includes('blur-') || line.includes('pointer-events-none');
      const isTinyDot = /h-(?:1\.5|2|2\.5)\s+w-(?:1\.5|2|2\.5)/.test(line) || /w-(?:1\.5|2|2\.5)\s+h-(?:1\.5|2|2\.5)/.test(line);
      if (!isAmbientGlow && !isTinyDot) {
        pillViolations.push(`${path.relative(ROOT_DIR, file)}:${idx + 1}: ${line.trim()}`);
      }
    }
  });
}

if (pillViolations.length === 0) {
  pass('Zero `rounded-full` pill buttons, badges, tabs, or navbars across `src/`');
} else {
  fail(`Found pill geometry violations:\n    ${pillViolations.join('\n    ')}`);
}

// 4. Verify asset-manifest.json and all 37 images + 1 video on disk
const manifestPath = path.join(PUBLIC_DIR, 'images/asset-manifest.json');
if (!fs.existsSync(manifestPath)) {
  fail('Missing `public/images/asset-manifest.json`');
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const imageCount = manifest.images?.length ?? 0;
  if (imageCount >= 37) {
    pass(`Asset manifest catalogs ${imageCount} bespoke .webp images`);
  } else {
    fail(`Expected at least 37 images in asset-manifest.json, found ${imageCount}`);
  }

  let missingAssets = 0;
  for (const img of manifest.images || []) {
    const relPath = img.outputPath || img.publicPath;
    const diskPath = path.join(PUBLIC_DIR, relPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath) || fs.statSync(diskPath).size === 0) {
      fail(`Missing or empty image asset on disk: ${relPath}`);
      missingAssets++;
    }
  }
  const videoRel =
    manifest.videos?.[0]?.outputPath ||
    manifest.video?.outputPath ||
    '/video/orbital-city-hero-loop.mp4';
  const videoDiskPath = path.join(PUBLIC_DIR, videoRel.replace(/^\//, ''));
  if (!fs.existsSync(videoDiskPath) || fs.statSync(videoDiskPath).size === 0) {
    fail(`Missing or empty video asset on disk: ${videoRel}`);
    missingAssets++;
  }

  if (missingAssets === 0) {
    pass('All 37 bespoke .webp images and 1 hero .mp4 video exist on disk with non-zero size');
  }
}

// 5. Verify zero duplicate image reuse in `src/data/siteContent.ts`
const siteContentPath = path.join(SRC_DIR, 'data/siteContent.ts');
const siteContent = fs.readFileSync(siteContentPath, 'utf8');
const srcMatches = [...siteContent.matchAll(/(?:imageSrc|src):\s*'([^']+\.webp)'/g)].map((m) => m[1]);

const uniqueSrcs = new Set(srcMatches);
if (srcMatches.length >= 37 && uniqueSrcs.size === srcMatches.length) {
  pass(`Zero duplicate image reuse in \`siteContent.ts\` (${uniqueSrcs.size}/${srcMatches.length} unique .webp paths wired)`);
} else {
  const counts = {};
  for (const s of srcMatches) counts[s] = (counts[s] || 0) + 1;
  const dupes = Object.entries(counts)
    .filter(([, c]) => c > 1)
    .map(([k, c]) => `${k} (used ${c}x)`);
  fail(`Duplicate or missing image paths in siteContent.ts: total=${srcMatches.length}, unique=${uniqueSrcs.size}. Dupes: ${dupes.join(', ')}`);
}

// 6. Verify v2.0.0 rules: zero <figcaption>, zero strokeDasharray, zero h-px decorative dashes, zero em/en dashes
const figcaptionHits = [];
const strokeDashHits = [];
const decorativeDashHits = [];
const emEnDashHits = [];

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT_DIR, file);
  if (content.includes('<figcaption')) figcaptionHits.push(rel);
  if (content.includes('strokeDasharray')) strokeDashHits.push(rel);
  if (content.includes('h-px w-')) decorativeDashHits.push(rel);
  if (content.includes('—') || content.includes('–')) emEnDashHits.push(rel);
}

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
if (indexHtml.includes('—') || indexHtml.includes('–')) {
  emEnDashHits.push('index.html');
}

if (figcaptionHits.length === 0) {
  pass('Zero `<figcaption>` elements across `src/`');
} else {
  fail(`Found <figcaption> in: ${figcaptionHits.join(', ')}`);
}

if (strokeDashHits.length === 0) {
  pass('Zero SVG `strokeDasharray` attributes across `src/`');
} else {
  fail(`Found strokeDasharray in: ${strokeDashHits.join(', ')}`);
}

if (decorativeDashHits.length === 0) {
  pass('Zero decorative horizontal dash lines (`h-px w-`) across `src/`');
} else {
  fail(`Found decorative horizontal dash lines in: ${decorativeDashHits.join(', ')}`);
}

if (emEnDashHits.length === 0) {
  pass('Zero em-dashes (`—`) or en-dashes (`–`) across `src/` and `index.html`');
} else {
  fail(`Found em-dash or en-dash in: ${emEnDashHits.join(', ')}`);
}

// 7. Verify City Atlas unification on CityPage.tsx and CityAtlasPage.tsx, and District Architecture on HomePage.tsx
const homePageContent = fs.readFileSync(path.join(SRC_DIR, 'pages/HomePage.tsx'), 'utf8');
const cityPageContent = fs.readFileSync(path.join(SRC_DIR, 'pages/CityPage.tsx'), 'utf8');
const cityAtlasPageContent = fs.readFileSync(path.join(SRC_DIR, 'pages/CityAtlasPage.tsx'), 'utf8');

if (
  cityPageContent.includes('InteractiveCityAtlas') &&
  cityAtlasPageContent.includes('InteractiveCityAtlas') &&
  homePageContent.includes('DISTRICT ARCHITECTURE')
) {
  pass('City Atlas is featured on `/city` and `/city-atlas`, and District Architecture is featured on `/`');
} else {
  fail('City Atlas or District Architecture verification failed across pages');
}

console.log('\n====================================================');
if (failures > 0) {
  console.error(`Verification failed with ${failures} issue(s).`);
  process.exit(1);
} else {
  console.log('All static overhaul checks passed with 0 irregularities!');
}
