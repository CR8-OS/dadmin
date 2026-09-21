#!/usr/bin/env node
/**
 * One-time setup: give the Week Ahead page a permanent home and record where
 * everything lives, so no script depends on a transient folder.
 *
 * The page contains family names, appointments and school details, and this
 * repo is public - so it lives in the data folder under the `.local.` naming
 * convention .gitignore excludes. Never move it into the repo.
 *
 * Usage:
 *   node scripts/install-paths.mjs --data "<data folder>" --archive "<pdf archive>" \
 *                                  [--from-draft "<current week-ahead.html>"]
 */

import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { getPaths, pathsFile, configDir, readText, writeText, parseArgs, APP_TITLE } from './lib/paths.mjs';
import { fitnessFailures } from './lib/page.mjs';

const args = parseArgs();

try {
  // Read existing config where possible, but do not require it: this is the
  // bootstrap, so --data/--archive may be the only source of truth.
  let existing = {};
  try { existing = getPaths(); } catch { /* not configured yet - expected */ }

  const dataDir = args.data || existing.data;
  const archiveDir = args.archive || existing.archive;

  if (!dataDir || !archiveDir) {
    console.error(
      `${APP_TITLE} setup needs both locations the first time.\n\n` +
        `  node scripts/install-paths.mjs \\\n` +
        `    --data    "<folder holding your household files>" \\\n` +
        `    --archive "<folder where the weekly PDFs go>" \\\n` +
        `    --from-draft "<path to your current week-ahead.html>"   # optional\n`
    );
    process.exit(1);
  }

  if (!existsSync(dataDir)) throw new Error(`Data folder not found: ${dataDir}`);
  if (!existsSync(archiveDir)) mkdirSync(archiveDir, { recursive: true });

  const dest = path.join(dataDir, 'week-ahead.local.html');

  if (args['from-draft']) {
    const src = args['from-draft'];
    if (!existsSync(src)) throw new Error(`Source page not found: ${src}`);
    const text = readText(src);
    const problems = fitnessFailures(text);
    if (problems.length) {
      throw new Error(`Refusing to install an unfit page:\n  - ${problems.join('\n  - ')}`);
    }
    writeText(dest, text);
  }

  mkdirSync(configDir(), { recursive: true });
  writeText(pathsFile(), JSON.stringify({ page: dest, archive: archiveDir, data: dataDir }, null, 2) + '\n');

  const after = getPaths();
  console.log(`\n${APP_TITLE} configured`);
  console.log(`  config   : ${after.configFile}`);
  console.log(`  page     : ${after.page}${existsSync(after.page) ? '' : '   (not created yet - pass --from-draft)'}`);
  console.log(`  archive  : ${after.archive}`);
  console.log(`  data     : ${after.data}`);
} catch (err) {
  console.error(`\n${err.message}\n`);
  process.exit(1);
}
