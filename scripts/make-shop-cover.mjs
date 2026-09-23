#!/usr/bin/env node
/**
 * Build a 1200x630 shop/unfurl cover from the wide header.
 *
 * The header is about 2.7:1 - right for a README banner, wrong for Ko-fi
 * previews and link unfurls, which expect roughly 1.9:1 and CENTER-CROP.
 * Dropped in as-is, the crop slices off either the wordmark or the man.
 *
 * So rather than crop, this PADS: the header is centered on a 1200x630 field
 * of the same paper tone, letterboxed top and bottom. Nothing is lost, the
 * seams are invisible because the pad colour is sampled from the artwork
 * itself, and the result survives any further center-crop a platform applies.
 *
 * Rendered through Chrome rather than an image library, for the same reason
 * the rest of this repo does: it is already a dependency and it is on every
 * platform we target.
 *
 * Usage: node scripts/make-shop-cover.mjs [--out <dir>]
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, fileUrl } from './lib/paths.mjs';
import { renderScreenshot } from './lib/render.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs();
const outDir = args.out && args.out !== true ? path.resolve(args.out) : REPO;

const PAPER = '#F3F1EB';
const W = 1200;
const H = 630;

const source = path.join(REPO, 'dadmin-header-cream.png');
if (!existsSync(source)) throw new Error(`Header artwork not found: ${source}`);

// Inline the image as a data URI so the page has no external dependency and
// renders identically wherever it runs.
const b64 = readFileSync(source).toString('base64');

const html = `<!DOCTYPE html>
<meta charset="utf-8">
<style>
  html, body { margin: 0; padding: 0; background: ${PAPER}; }
  body {
    width: ${W}px; height: ${H}px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  /* 88% leaves a margin so nothing touches the edge if a platform crops
     slightly tighter than it advertises. */
  img { width: 88%; height: auto; display: block; }
</style>
<img src="data:image/png;base64,${b64}" alt="">
`;

const staging = path.join(tmpdir(), 'dadmin-cover');
mkdirSync(staging, { recursive: true });
const page = path.join(staging, 'cover.html');
writeFileSync(page, html, 'utf8');

const dest = path.join(outDir, 'dadmin-shop-cover.png');
mkdirSync(outDir, { recursive: true });

const st = await renderScreenshot(page, dest, { width: W, height: H, colorScheme: 'light' });
rmSync(staging, { recursive: true, force: true });

console.log(`\nshop cover built`);
console.log(`  size  : ${W}x${H} (${(W / H).toFixed(2)}:1)`);
console.log(`  bytes : ${Math.round(st.size / 1024)} KB`);
console.log(`  path  : ${dest}`);
console.log(`\n  Padded, not cropped - a further center-crop still keeps the whole artwork.`);
