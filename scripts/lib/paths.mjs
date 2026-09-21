/**
 * Shared path resolution for the Dadmin scripts.
 *
 * WHY NODE RATHER THAN POWERSHELL
 * Node reads and writes UTF-8 by default. The PowerShell version corrupted
 * this project's files twice: `Get-Content -Raw` decodes through the ANSI
 * codepage on PS 5.1 and `Set-Content -Encoding UTF8` adds a BOM, so one
 * round-trip turned every accented name into mojibake and the BOM into a
 * stray glyph. That entire class of bug does not exist here. Do not
 * reintroduce it by shelling out to PowerShell for file I/O.
 *
 * PRIVACY
 * The week-ahead page contains family names, appointments and school details,
 * and this repo is public. The page lives in the user's data folder under the
 * `.local.` naming convention that .gitignore excludes. Never move it here.
 *
 * RESOLUTION ORDER, per path
 *   1. explicit argument from the caller
 *   2. environment variable  (DADMIN_PAGE / DADMIN_ARCHIVE / DADMIN_DATA)
 *   3. <config dir>/paths.json
 *   4. nothing - we say so plainly rather than guessing at someone's disk
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import path from 'node:path';

export const APP = 'dadmin';
export const APP_TITLE = 'Dadmin';

/** Config lives in the user's home dir on every platform. */
export function configDir() {
  return path.join(homedir(), `.${APP}`);
}

/**
 * Older installs kept config under the project's previous name. Read it as a
 * fallback so an existing setup keeps working after the rename instead of
 * failing with "not configured" on a machine that plainly is.
 */
function legacyConfigDirs() {
  return [path.join(homedir(), '.mrs-doubtfire')];
}

export function pathsFile() {
  return path.join(configDir(), 'paths.json');
}

/** UTF-8 in, UTF-8 out, no BOM, on every platform. */
export function readText(file) {
  return readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

export function writeText(file, text) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, text, 'utf8');
}

/** Count characters that only appear when text has been double-encoded. */
export function countMojibake(text) {
  const m = text.match(/[\uFFFD\u00E2\u00C3]/g);
  return m ? m.length : 0;
}

function loadConfig() {
  const candidates = [pathsFile(), ...legacyConfigDirs().map((d) => path.join(d, 'paths.json'))];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      const cfg = JSON.parse(readText(file));
      return { cfg, file, legacy: file !== pathsFile() };
    } catch (err) {
      console.warn(`Could not parse ${file} - ignoring it. (${err.message})`);
    }
  }
  return { cfg: {}, file: pathsFile(), legacy: false };
}

export function getPaths({ page, archive, data } = {}) {
  const { cfg, file, legacy } = loadConfig();

  const pick = (explicit, envName, cfgKey) =>
    explicit || process.env[envName] || cfg[cfgKey] || null;

  const dataDir = pick(data, 'DADMIN_DATA', 'data');
  const archiveDir = pick(archive, 'DADMIN_ARCHIVE', 'archive');
  const pageFile =
    pick(page, 'DADMIN_PAGE', 'page') ||
    (dataDir ? path.join(dataDir, 'week-ahead.local.html') : null);

  if (!dataDir || !archiveDir) {
    throw new Error(
      `${APP_TITLE} paths are not configured on this machine.\n\n` +
        `Run once:\n` +
        `  node scripts/install-paths.mjs --data "<your data folder>" ` +
        `--archive "<where weekly PDFs go>" --from-draft "<current week-ahead.html>"\n\n` +
        `Or set DADMIN_DATA / DADMIN_ARCHIVE / DADMIN_PAGE in the environment.\n` +
        `Config file: ${pathsFile()}`
    );
  }

  return { data: dataDir, archive: archiveDir, page: pageFile, configFile: file, legacyConfig: legacy };
}

/** Fail early and legibly rather than halfway through a publish. */
export function assertPaths(p, { requirePage = false } = {}) {
  if (!existsSync(p.data)) {
    throw new Error(`Data folder not found: ${p.data}. Set DADMIN_DATA or edit ${p.configFile}.`);
  }
  if (!existsSync(p.archive)) mkdirSync(p.archive, { recursive: true });
  if (requirePage && !existsSync(p.page)) {
    throw new Error(`Page not found: ${p.page}. Set DADMIN_PAGE, edit ${p.configFile}, or pass --page.`);
  }
}

/**
 * Where Chrome lives on each platform.
 *
 * Checked in order and the first hit wins. CHROME_PATH overrides everything,
 * which is what CI and unusual installs need. We look for Chrome, Chromium
 * and Edge because Edge is Chromium underneath and its headless flags are
 * identical - on a locked-down Windows machine it is often the only one there.
 */
export function findChrome() {
  // An explicit CHROME_PATH is an instruction, not a hint. If it is set and
  // wrong, fail - do not quietly fall through to a different browser than the
  // one that was asked for, because then CI and debugging sessions silently
  // test something other than the thing under test.
  if (process.env.CHROME_PATH) {
    if (existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
    throw new Error(`CHROME_PATH is set but does not exist: ${process.env.CHROME_PATH}`);
  }

  const candidates = {
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      path.join(homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    ],
    win32: [
      path.join(process.env['PROGRAMFILES'] || 'C:\\Program Files', 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env['LOCALAPPDATA'] || '', 'Google/Chrome/Application/chrome.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe'),
    ],
    linux: [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/snap/bin/chromium',
      '/usr/bin/microsoft-edge',
    ],
  };

  for (const candidate of candidates[platform()] || candidates.linux) {
    if (candidate && existsSync(candidate)) return candidate;
  }

  throw new Error(
    `No Chrome/Chromium/Edge found for platform "${platform()}".\n` +
      `Install one, or set CHROME_PATH to its executable.`
  );
}

/** file:// URL that is correct on Windows drive letters and POSIX alike. */
export function fileUrl(p) {
  return new URL(`file://${path.resolve(p).replace(/\\/g, '/').replace(/^(?=[A-Za-z]:)/, '/')}`).href;
}

/** Minimal flag parser so the scripts need no dependency to be run by hand. */
export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else { out[key] = next; i++; }
    } else out._.push(a);
  }
  return out;
}
