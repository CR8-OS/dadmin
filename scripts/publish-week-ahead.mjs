#!/usr/bin/env node
/**
 * Stamp and archive the Week Ahead page as a dated weekly PDF.
 *
 * One PDF per week, named for that week's Monday, holding the latest state of
 * that week. Re-running inside the same week overwrites that week's file
 * rather than piling up copies - "memorialize weekly, as of the latest
 * update". A stable "Week Ahead (current).pdf" sits beside the archive so the
 * person who only ever reads the agenda has one obvious file to open.
 *
 * The masthead "Updated" line means CONTENT last rebuilt from sources (mail,
 * calendar, memo, tasks). It is NOT the print time. Re-printing the same
 * content with new CSS is not an update, so --stamp-now is opt-in: the script
 * cannot tell whether you refreshed the content and will not guess. A page
 * that claims a freshness it does not have is the one thing this cannot
 * afford, because someone trusts it and skips the re-read.
 *
 * Usage:
 *   node scripts/publish-week-ahead.mjs                     # design-only change
 *   node scripts/publish-week-ahead.mjs --stamp-now         # content was rebuilt
 *   node scripts/publish-week-ahead.mjs --from-draft <file> # promote an edited draft first
 *   node scripts/publish-week-ahead.mjs --week-of 2026-09-14
 */

import { existsSync, copyFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { getPaths, assertPaths, readText, writeText, countMojibake, parseArgs, APP_TITLE } from './lib/paths.mjs';
import { weekTag, contentStamp, fitnessFailures, weekMismatch } from './lib/page.mjs';
import { renderPdf } from './lib/render.mjs';

const args = parseArgs();
const when = args['week-of'] ? new Date(`${args['week-of']}T12:00:00`) : new Date();
if (Number.isNaN(when.getTime())) {
  console.error(`Could not parse --week-of "${args['week-of']}". Use YYYY-MM-DD.`);
  process.exit(1);
}

try {
  const p = getPaths({ page: args.page, archive: args.archive });
  assertPaths(p);

  if (p.legacyConfig) {
    console.warn(`Note: reading config from the pre-rename location ${p.configFile}.`);
    console.warn(`      Re-run install-paths.mjs when convenient to move it.`);
  }

  // Claude's file tools can only write inside the session outputs folder, so
  // edits are made to a draft there and must be promoted into the canonical
  // page. Skipping that step is silent and expensive: the draft looks right in
  // every screenshot while publish and deploy keep shipping the old page.
  if (args['from-draft']) {
    const draftPath = args['from-draft'];
    if (!existsSync(draftPath)) throw new Error(`Draft not found: ${draftPath}`);
    const draft = readText(draftPath);
    const problems = fitnessFailures(draft);
    if (problems.length) {
      throw new Error(`Refusing to promote an unfit draft:\n  - ${problems.join('\n  - ')}`);
    }
    writeText(p.page, draft);
    console.log(`promoted   : ${path.basename(draftPath)} -> ${p.page}`);
  }

  if (!existsSync(p.page)) {
    throw new Error(`Page not found: ${p.page}. Pass --from-draft, or run install-paths.mjs.`);
  }

  const doc = readText(p.page);

  // Refuse to print a corrupted or malformed page into the archive.
  const problems = fitnessFailures(doc);
  if (problems.length) {
    throw new Error(`Page is not fit to publish:\n  - ${problems.join('\n  - ')}`);
  }

  const tag = weekTag(when);

  const mismatch = weekMismatch(doc, tag, when.getFullYear());
  if (mismatch) throw new Error(mismatch.message);

  let stamp = contentStamp(doc);
  if (args['stamp-now']) {
    const label =
      'Updated ' +
      when.toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    const next = doc.replace(/<span>Updated[^<]*<\/span>/, `<span>${label}</span>`);
    if (next === doc) console.warn('No "Updated" span found - masthead not stamped.');
    else { writeText(p.page, next); stamp = label; }
  }

  const dest = path.join(p.archive, `Week Ahead ${tag}.pdf`);
  const st = await renderPdf(p.page, dest);

  // Stable pointer to the newest week, beside the dated archive.
  const current = path.join(p.archive, 'Week Ahead (current).pdf');
  copyFileSync(dest, current);

  console.log(`\n${APP_TITLE} - week ahead published`);
  console.log(`  week       : ${tag}`);
  console.log(`  file       : ${path.basename(dest)}`);
  console.log(`  current    : ${path.basename(current)}`);
  console.log(`  size       : ${Math.round(st.size / 1024)} KB`);
  console.log(`  contentSays: ${stamp}`);
  console.log(`  mojibake   : ${countMojibake(doc)}`);
  console.log(`  source     : ${p.page}`);
} catch (err) {
  console.error(`\n${err.message}\n`);
  process.exit(1);
}
