#!/usr/bin/env node
/**
 * Build dadmin.plugin - the click-to-install bundle.
 *
 * A .plugin file is a zip of the repo root. Most people install from the
 * marketplace, but the bundle is what you hand to someone who does not use a
 * terminal, and it is what a Ko-fi shop listing delivers.
 *
 * NO ZIP DEPENDENCY. Node has no built-in archiver, and this repo has no
 * package.json on purpose - it is a Claude plugin, not a Node project, and
 * asking people to npm install before they can build it is a barrier for no
 * benefit. So we use whatever the platform already has: `zip` on macOS and
 * Linux, Compress-Archive on Windows. Both are present by default.
 *
 * The bundle is NOT committed. It is a build artifact that duplicates the
 * whole repo, and committing it means every future change ships alongside a
 * stale copy of itself.
 *
 * Usage: node scripts/build-plugin.mjs [--out <dir>]
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync, statSync, readFileSync } from 'node:fs';
import { platform, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/paths.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs();
const outDir = args.out && args.out !== true ? path.resolve(args.out) : REPO;

// Never ship these. Version control, build output, local scratch, and the
// promo folder - which by design holds material this repo cannot relicense.
const EXCLUDE = new Set(['.git', 'node_modules', 'promo', 'archive']);
const EXCLUDE_EXT = new Set(['.plugin', '.bak', '.zip']);

const manifest = JSON.parse(readFileSync(path.join(REPO, '.claude-plugin', 'plugin.json'), 'utf8'));
const name = manifest.name;
const version = manifest.version;

const staging = path.join(tmpdir(), `${name}-build`);
rmSync(staging, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

cpSync(REPO, path.join(staging, name), {
  recursive: true,
  filter: (src) => {
    const base = path.basename(src);
    if (EXCLUDE.has(base)) return false;
    if (EXCLUDE_EXT.has(path.extname(base).toLowerCase())) return false;
    return true;
  },
});

const dest = path.join(outDir, `${name}.plugin`);
rmSync(dest, { force: true });
mkdirSync(outDir, { recursive: true });

const srcDir = path.join(staging, name);
const tmpZip = path.join(staging, `${name}.zip`);

if (platform() === 'win32') {
  execFileSync('powershell', [
    '-NoProfile', '-Command',
    `Compress-Archive -Path '${srcDir}\\*' -DestinationPath '${tmpZip}' -Force`,
  ], { stdio: 'pipe' });
} else {
  // -r recurse, -q quiet, -X drop platform metadata that bloats the archive
  execFileSync('zip', ['-rqX', tmpZip, '.'], { cwd: srcDir, stdio: 'pipe' });
}

cpSync(tmpZip, dest);
rmSync(staging, { recursive: true, force: true });

// Verify the end state, not the command: the file exists and is plausible.
if (!existsSync(dest)) throw new Error(`Bundle was not written: ${dest}`);
const st = statSync(dest);
if (st.size < 5 * 1024) {
  throw new Error(`Bundle is suspiciously small (${st.size} bytes) - the staging copy probably failed.`);
}

console.log(`\n${name}.plugin built`);
console.log(`  version : ${version}`);
console.log(`  size    : ${Math.round(st.size / 1024)} KB`);
console.log(`  path    : ${dest}`);
