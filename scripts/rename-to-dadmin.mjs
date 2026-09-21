#!/usr/bin/env node
/**
 * Rename the product from Mrs. Doubtfire to Dadmin, inside the repo only.
 *
 * SCOPE, deliberately narrow. This touches the SHIPPABLE product: the repo's
 * files, the skill directory, the plugin id. It does NOT touch the user's own
 * instance - their data folder, their ~/.mrs-doubtfire config, their PDF
 * archive, their retro history. Those keep working (paths.mjs reads the old
 * config location as a fallback) and can be migrated later, or never.
 *
 * Renaming someone's live data folder to tidy up a product rename is how you
 * break a working setup for cosmetic reasons.
 *
 * Run with --dry to see every change before any of it happens.
 *
 * Usage:
 *   node scripts/rename-to-dadmin.mjs --dry
 *   node scripts/rename-to-dadmin.mjs
 */

import { readdirSync, statSync, renameSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'archive']);
const TEXT_EXT = new Set(['.md', '.json', '.mjs', '.js', '.ps1', '.txt', '.yml', '.yaml', '.html', '.css']);

/**
 * Files whose old-name references are LOAD-BEARING and must survive.
 *
 *  - this script: rewriting itself turns /doubtfire/g into /dadmin/g and the
 *    rules stop matching what they are meant to find.
 *  - lib/paths.mjs: holds the legacy `~/.mrs-doubtfire` config path we read as
 *    a fallback. Renaming it is precisely how you break every existing
 *    install while believing you are tidying up.
 */
const SKIP_FILES = new Set([
  path.join(REPO, 'scripts', 'rename-to-dadmin.mjs'),
  path.join(REPO, 'scripts', 'lib', 'paths.mjs'),
]);

/**
 * Ordered: most specific first, so "mrs-doubtfire" is not half-replaced by a
 * rule for "doubtfire" and left as "mrs-dadmin".
 */
const REPLACEMENTS = [
  [/Mrs\.\s*Doubtfire/g, 'Dadmin'],
  [/Mrs\s+Doubtfire/g, 'Dadmin'],
  [/mrs-doubtfire/g, 'dadmin'],
  [/mrs_doubtfire/g, 'dadmin'],
  [/MrsDoubtfire/g, 'Dadmin'],
  [/_MrsDoubtfire/g, '_Dadmin'],
  [/Doubtfire/g, 'Dadmin'],
  [/doubtfire/g, 'dadmin'],
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const edits = [];
const renames = [];

for (const file of walk(REPO)) {
  const ext = path.extname(file).toLowerCase();
  if (TEXT_EXT.has(ext) && !SKIP_FILES.has(file)) {
    const before = readFileSync(file, 'utf8');
    let after = before;
    for (const [re, to] of REPLACEMENTS) after = after.replace(re, to);
    if (after !== before) {
      const hits = before.split('\n').filter((l) => /doubtfire/i.test(l)).length;
      edits.push({ file, hits });
      if (!dry) writeFileSync(file, after, 'utf8');
    }
  }
  if (/doubtfire/i.test(path.basename(file))) {
    let base = path.basename(file);
    for (const [re, to] of REPLACEMENTS) base = base.replace(re, to);
    renames.push({ from: file, to: path.join(path.dirname(file), base) });
  }
}

// Directories, deepest first so a parent rename cannot invalidate a child path.
const dirs = [];
(function walkDirs(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) { walkDirs(full); dirs.push(full); }
  }
})(REPO);

for (const dir of dirs) {
  if (!/doubtfire/i.test(path.basename(dir))) continue;
  let base = path.basename(dir);
  for (const [re, to] of REPLACEMENTS) base = base.replace(re, to);
  renames.push({ from: dir, to: path.join(path.dirname(dir), base) });
}

console.log(`\n${dry ? 'DRY RUN - nothing written' : 'APPLYING'}\n`);
console.log(`files edited (${edits.length}):`);
for (const e of edits) console.log(`  ${path.relative(REPO, e.file)}  (${e.hits} line${e.hits === 1 ? '' : 's'})`);

console.log(`\npaths renamed (${renames.length}):`);
for (const r of renames) {
  console.log(`  ${path.relative(REPO, r.from)}  ->  ${path.relative(REPO, r.to)}`);
  if (!dry) {
    if (existsSync(r.to)) { console.log(`     SKIPPED - target already exists`); continue; }
    renameSync(r.from, r.to);
  }
}

if (dry) {
  console.log(`\nRe-run without --dry to apply.\n`);
} else {
  const left = walk(REPO).filter((f) => {
    if (!TEXT_EXT.has(path.extname(f).toLowerCase())) return false;
    if (SKIP_FILES.has(f)) return false; // deliberate, documented above
    return /doubtfire/i.test(readFileSync(f, 'utf8'));
  });
  console.log(`\nunintended references remaining: ${left.length}`);
  for (const f of left) console.log(`  ${path.relative(REPO, f)}`);
  console.log(`\nintentionally keeping the old name (backwards compatibility):`);
  for (const f of SKIP_FILES) {
    if (existsSync(f) && /doubtfire/i.test(readFileSync(f, 'utf8'))) {
      console.log(`  ${path.relative(REPO, f)}`);
    }
  }
  console.log('');
}
