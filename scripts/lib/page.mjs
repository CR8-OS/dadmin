/**
 * Checks on the week-ahead page itself.
 *
 * Every one of these exists because the corresponding failure shipped. They
 * are cheap, they run before publishing, and each names what breaks so the
 * message is useful at 6am rather than a bare assertion number.
 *
 * A guard that cannot fail is worse than no guard, because it reads as
 * coverage. Each of these has been shown to fire on a real bad input.
 */

import { countMojibake } from './paths.mjs';

/** Monday of the week containing `d`. Sunday rolls BACK six days, not forward. */
export function mondayOf(d) {
  const date = new Date(d);
  date.setHours(12, 0, 0, 0); // avoid DST edges shifting the date
  const dow = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() + (dow === 0 ? -6 : 1 - dow));
  return date;
}

export function weekTag(d) {
  const m = mondayOf(d);
  const pad = (n) => String(n).padStart(2, '0');
  return `${m.getFullYear()}-${pad(m.getMonth() + 1)}-${pad(m.getDate())}`;
}

/** What the masthead claims about its own freshness. */
export function contentStamp(html) {
  const m = html.match(/<span>(Updated[^<]*)<\/span>/);
  return m ? m[1] : '(no stamp found)';
}

/**
 * Fitness checks that must pass before the page is printed or deployed.
 * Returns an array of human-readable failures; empty means fit to publish.
 */
export function fitnessFailures(html) {
  const fail = [];

  // Without a doctype the browser uses quirks mode, where <table> does NOT
  // inherit font-family from <body> - the horizon table silently falls back
  // to Times New Roman while the rest of the page stays sans.
  if (!/^\s*<!doctype html>/i.test(html)) {
    fail.push('no <!DOCTYPE html> - quirks mode renders tables in serif');
  }

  // The file being valid UTF-8 is not enough; with nothing declaring it, a
  // browser opening it from disk falls back to the system codepage and every
  // accented name renders as two garbage characters.
  if (!/<meta[^>]+charset/i.test(html)) {
    fail.push('no charset declared - accented names render as garbage');
  }

  const mojibake = countMojibake(html);
  if (mojibake > 0) {
    fail.push(`${mojibake} mojibake characters - the page is already corrupted`);
  }

  return fail;
}

/**
 * The archive filename comes from the RUN DATE; the content comes from the
 * page. If nothing checks they agree, running this in a later week files
 * stale content under a new week's name - a false record, which is worse than
 * a missing one.
 *
 * Compared against the <h1>, which names the week exactly. An earlier version
 * compared day numbers with a +/-6 day tolerance and could never fire, because
 * a week is seven days.
 */
export function weekMismatch(html, targetTag, year) {
  const m = html.match(/<h1>\s*Week of\s+([A-Za-z]+)\s+(\d{1,2})\s*<\/h1>/);
  if (!m) return null;

  const parsed = new Date(`${m[1]} ${m[2]}, ${year} 12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  const pageTag = weekTag(parsed);
  if (pageTag === targetTag) return null;

  return {
    pageTitle: `${m[1]} ${m[2]}`,
    pageTag,
    targetTag,
    message:
      `Page is titled "Week of ${m[1]} ${m[2]}" (${pageTag}) but this run would file it as ` +
      `${targetTag}. Rebuild the content for this week, or pass --week-of ${pageTag} to ` +
      `archive it under its own week.`,
  };
}
