#!/usr/bin/env node
/**
 * Prove the guards can actually fire.
 *
 * "Never write an assertion that cannot fail." A week-mismatch guard once
 * compared day numbers with a +/-6 day tolerance, and a week is seven days -
 * so every stale page passed while the check read as coverage. These tests
 * feed each guard something bad and require it to complain.
 *
 * No test framework: this must run anywhere Node runs, with no install step.
 *
 * Usage: node scripts/selftest.mjs
 */

import { mondayOf, weekTag, fitnessFailures, weekMismatch, contentStamp } from './lib/page.mjs';
import { countMojibake, fileUrl, parseArgs } from './lib/paths.mjs';

let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { passed++; console.log(`  ok    ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}\n          expected ${JSON.stringify(expected)}\n          got      ${JSON.stringify(actual)}`); }
}

function truthy(name, value) {
  if (value) { passed++; console.log(`  ok    ${name}`); }
  else { failed++; console.log(`  FAIL  ${name} (expected truthy, got ${JSON.stringify(value)})`); }
}

console.log('\nweek maths');
// Sunday must roll BACK six days. Getting this wrong files Sunday under next week.
check('Monday of a Monday',    weekTag(new Date('2026-09-14T12:00:00')), '2026-09-14');
check('Monday of a Tuesday',   weekTag(new Date('2026-09-15T12:00:00')), '2026-09-14');
check('Monday of a Saturday',  weekTag(new Date('2026-09-19T12:00:00')), '2026-09-14');
check('Monday of a SUNDAY',    weekTag(new Date('2026-09-20T12:00:00')), '2026-09-14');
check('next Monday is its own week', weekTag(new Date('2026-09-21T12:00:00')), '2026-09-21');
truthy('mondayOf returns a Monday', mondayOf(new Date('2026-09-20T12:00:00')).getDay() === 1);

console.log('\nfitness guards must FIRE on bad input');
const good = '<!DOCTYPE html>\n<meta charset="utf-8">\n<h1>Week of September 14</h1>';
check('a good page has no failures', fitnessFailures(good), []);
truthy('missing doctype is caught',  fitnessFailures('<meta charset="utf-8">').some((f) => /DOCTYPE/.test(f)));
truthy('missing charset is caught',  fitnessFailures('<!DOCTYPE html><h1>x</h1>').some((f) => /charset/.test(f)));
truthy('mojibake is caught',         fitnessFailures(good + 'Ã©lodie').some((f) => /mojibake/.test(f)));

console.log('\nweek mismatch guard must FIRE on a stale page');
const page = '<h1>Week of September 14</h1>';
check('same week passes', weekMismatch(page, '2026-09-14', 2026), null);
truthy('a week later is caught', weekMismatch(page, '2026-09-21', 2026) !== null);
truthy('a week earlier is caught', weekMismatch(page, '2026-09-07', 2026) !== null);
truthy('the message names both weeks', /September 14.*2026-09-21/s.test(weekMismatch(page, '2026-09-21', 2026).message));
// The bug that made the first version useless: +/-6 days always passed.
truthy('six days out is still caught (the old tolerance bug)', weekMismatch(page, '2026-09-21', 2026) !== null);

console.log('\nencoding');
check('clean text has no mojibake', countMojibake('Elodie - Apero'), 0);
truthy('double-encoded text is detected', countMojibake('Ã©lodie') > 0);
truthy('replacement char is detected', countMojibake('caf�') > 0);

console.log('\nstamp + args');
check('reads the content stamp', contentStamp('<span>Updated Tue Sep 15, 2:30 PM</span>'), 'Updated Tue Sep 15, 2:30 PM');
check('missing stamp says so', contentStamp('<span>nope</span>'), '(no stamp found)');
check('parses flags', parseArgs(['--stamp-now', '--week-of', '2026-09-14']), { _: [], 'stamp-now': true, 'week-of': '2026-09-14' });

console.log('\nfile urls are platform-correct');
truthy('file url has a scheme', fileUrl('.').startsWith('file:///'));

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
