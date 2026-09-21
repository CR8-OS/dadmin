/**
 * Headless Chrome rendering: PDF and screenshots.
 *
 * VERIFY THE END STATE, NOT THE COMMAND.
 * Chrome does not reliably report failure through its exit code - on Windows
 * it is a GUI-subsystem process and returns nothing at all, so a guard written
 * as `exitCode !== 0` fires on successful renders and passes on broken ones.
 * The only trustworthy evidence is the output file: it exists, it is
 * non-empty, and it is newer than the moment we started. Anything less lets a
 * stale file from last week pass as this week's render.
 *
 * stderr is CAPTURED and surfaced on failure, never discarded. Chrome is
 * chatty on stderr even when it succeeds, which is what makes suppressing it
 * tempting - and suppressing it is how a failed render gets reported as a
 * success.
 */

import { spawn } from 'node:child_process';
import { existsSync, statSync, rmSync } from 'node:fs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { findChrome, fileUrl } from './paths.mjs';

const BASE_FLAGS = [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--virtual-time-budget=9000',
];

function runChrome(args) {
  return new Promise((resolve) => {
    const chrome = findChrome();
    const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    let stdout = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('error', (err) => resolve({ code: null, stderr: String(err), stdout }));
    child.on('close', (code) => resolve({ code, stderr, stdout }));
  });
}

/**
 * Assert the artifact was actually produced by THIS run.
 * `startedAt` is captured before spawning; a file older than it is last run's.
 */
function assertFresh(file, startedAt, { what, stderr }) {
  if (!existsSync(file)) {
    throw new Error(`${what} was not written: ${file}\n${stderr.trim()}`);
  }
  const st = statSync(file);
  if (st.size === 0) {
    throw new Error(`${what} was written empty: ${file}\n${stderr.trim()}`);
  }
  if (st.mtimeMs < startedAt) {
    throw new Error(
      `${what} is stale - it predates this run, so nothing was rendered: ${file}\n${stderr.trim()}`
    );
  }
  return st;
}

export async function renderPdf(pageFile, destPdf) {
  mkdirSync(path.dirname(destPdf), { recursive: true });
  const startedAt = Date.now() - 1000; // filesystem timestamp granularity
  const { stderr } = await runChrome([
    ...BASE_FLAGS,
    '--no-pdf-header-footer',
    `--print-to-pdf=${destPdf}`,
    fileUrl(pageFile),
  ]);
  await new Promise((r) => setTimeout(r, 1500));
  return assertFresh(destPdf, startedAt, { what: 'PDF', stderr });
}

/**
 * colorScheme: 'light' | 'dark'. Blink's preferredColorScheme is 0=dark, 1=light.
 * The old PNG is deleted first so a failed render cannot leave last run's
 * screenshot on disk to be mistaken for the new one - which is exactly how a
 * layout change once looked verified when it had never rendered.
 */
export async function renderScreenshot(pageFile, destPng, { width = 1280, height = 2400, colorScheme = 'light' } = {}) {
  mkdirSync(path.dirname(destPng), { recursive: true });
  if (existsSync(destPng)) rmSync(destPng, { force: true });

  const startedAt = Date.now() - 1000;
  const { stderr } = await runChrome([
    ...BASE_FLAGS,
    '--hide-scrollbars',
    '--force-color-profile=srgb',
    `--blink-settings=preferredColorScheme=${colorScheme === 'dark' ? 0 : 1}`,
    `--window-size=${width},${height}`,
    `--screenshot=${destPng}`,
    fileUrl(pageFile),
  ]);
  await new Promise((r) => setTimeout(r, 1500));
  return assertFresh(destPng, startedAt, { what: `Screenshot (${colorScheme})`, stderr });
}
