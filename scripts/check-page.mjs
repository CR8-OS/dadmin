#!/usr/bin/env node
/**
 * Assert the page is fit to publish, and report every non-ASCII character in
 * it with counts so corruption is visible as data rather than guessed at from
 * a rendering.
 *
 * This is a SOURCE check, not a render check. An earlier version shelled out
 * to `chrome --dump-dom` and reported a field that was always false, because
 * --dump-dom cannot run page scripts and return their result. A check that
 * always fails the same way teaches you to ignore it, which is worse than not
 * having it. To verify what actually rendered, look at a screenshot.
 *
 * Usage: node scripts/check-page.mjs [--page <file>] [--quiet]
 */

import { statSync } from 'node:fs';
import { getPaths, assertPaths, readText, countMojibake, parseArgs } from './lib/paths.mjs';
import { fitnessFailures, contentStamp } from './lib/page.mjs';

const NAMES = {
  0x2014: 'em dash', 0x2013: 'en dash',
  0x2018: 'left single quote', 0x2019: 'right single quote',
  0x201c: 'left double quote', 0x201d: 'right double quote',
  0x00e9: 'e acute', 0x00c9: 'E acute', 0x00e8: 'e grave', 0x00e0: 'a grave',
  0x2550: 'box double horizontal', 0x2500: 'box light horizontal',
  0x00a0: 'NBSP',
  0xfffd: 'REPLACEMENT CHAR - CORRUPT',
  0x00e2: 'a circumflex - MOJIBAKE',
  0x00c3: 'A tilde - MOJIBAKE',
  0xfeff: 'BOM AS LITERAL CHAR - CORRUPT',
};

const args = parseArgs();

try {
  const p = getPaths({ page: args.page });
  assertPaths(p, { requirePage: true });

  const src = readText(p.page);
  const st = statSync(p.page);

  console.log(`file        : ${p.page}`);
  console.log(`bytes       : ${st.size}`);
  console.log(`charset     : ${/<meta[^>]+charset/i.test(src) ? 'declared' : 'MISSING'}`);
  console.log(`doctype     : ${/^\s*<!doctype html>/i.test(src) ? 'present' : 'MISSING'}`);
  console.log(`tables inherit type: ${/table,\s*th,\s*td[^{]*\{[^}]*font-family:\s*inherit/s.test(src) ? 'yes' : 'NO'}`);
  console.log(`mojibake    : ${countMojibake(src)}`);
  console.log(`content says: ${contentStamp(src)}`);

  if (!args.quiet) {
    const counts = new Map();
    for (const ch of src) {
      const cp = ch.codePointAt(0);
      if (cp > 126) counts.set(cp, (counts.get(cp) || 0) + 1);
    }
    console.log('\nnon-ASCII characters present:');
    if (counts.size === 0) console.log('  (none - pure ASCII)');
    for (const cp of [...counts.keys()].sort((a, b) => a - b)) {
      const label = NAMES[cp] || '-';
      console.log(`  U+${cp.toString(16).toUpperCase().padStart(4, '0')}  ${String(counts.get(cp)).padStart(5)}x  ${label}`);
    }
  }

  const problems = fitnessFailures(src);
  if (problems.length) {
    console.error(`\nNOT fit to publish:\n  - ${problems.join('\n  - ')}\n`);
    process.exit(1);
  }
  console.log('\nfit to publish.');
} catch (err) {
  console.error(`\n${err.message}\n`);
  process.exit(1);
}
