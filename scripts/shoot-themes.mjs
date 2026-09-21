#!/usr/bin/env node
/**
 * Render the page in light and dark so both can be compared before publishing.
 * Shots go to a scratch folder, never to the archive.
 *
 * Usage:
 *   node scripts/shoot-themes.mjs [--width 1280] [--height 2400] [--out <dir>] [--suffix -wide]
 */

import { tmpdir } from 'node:os';
import path from 'node:path';
import { getPaths, assertPaths, parseArgs, APP } from './lib/paths.mjs';
import { renderScreenshot } from './lib/render.mjs';

const args = parseArgs();

try {
  const p = getPaths({ page: args.page });
  assertPaths(p, { requirePage: true });

  const outDir = args.out || path.join(tmpdir(), `${APP}-shots`);
  const width = Number(args.width || 1280);
  const height = Number(args.height || 2400);
  const suffix = args.suffix && args.suffix !== true ? args.suffix : '';

  for (const scheme of ['light', 'dark']) {
    const dest = path.join(outDir, `shot-${scheme}${suffix}.png`);
    const st = await renderScreenshot(p.page, dest, { width, height, colorScheme: scheme });
    console.log(`  ${scheme.padEnd(5)} ${String(Math.round(st.size / 1024)).padStart(5)} KB  ${dest}`);
  }
} catch (err) {
  console.error(`\n${err.message}\n`);
  process.exit(1);
}
