# Week Ahead scripts

Build, check and archive the weekly Week Ahead page. See
`reference/week-ahead-artifact.md` for what the page is and what belongs on it.

## Setup, once per machine

Nothing here has a personal path baked in — the repo is public and
household-agnostic. Record your own layout first:

```powershell
.\install-paths.ps1 `
  -Data    'X:\path\to\your\_Dadmin' `
  -Archive 'X:\path\to\Dadmin Agendas' `
  -FromPage 'X:\path\to\current\week-ahead.html'
```

That writes `~/.dadmin/paths.json` and copies the page to its permanent
home. Every other script then runs with no arguments. `MRSD_DATA`,
`MRSD_ARCHIVE` and `MRSD_PAGE` override the config if you need them to.

**The page never lives in this repo.** It carries family names, appointments
and school details; the repo is public. It lives in the Drive data folder under
the household's `.local.` convention so `.gitignore` keeps it out.

## The scripts

| Script | What it does |
| --- | --- |
| `install-paths.ps1` | One-time setup; gives the page a permanent home. |
| `publish-week-ahead.ps1` | Prints the weekly PDF into the archive. `-StampNow` only when content was rebuilt. |
| `audit-encoding.ps1` | Lists every non-ASCII character with counts. |
| `repair-encoding.ps1` | Reverses a CP1252/UTF-8 double-encode. `-WhatIf` supported. |
| `check-fonts.ps1` | Asserts doctype, charset, and that tables inherit type. |
| `shoot-both-themes.ps1` | Renders light and dark PNGs to a scratch folder. |
| `sync-spec-template.ps1` | Copies the live CSS into the spec's template. |
| `recycle.ps1` | Sends a file to the Recycle Bin rather than destroying it. |

## Two traps worth knowing

**Encoding.** `Get-Content -Raw` reads via the ANSI codepage on PowerShell 5.1,
and `Set-Content -Encoding UTF8` writes a BOM. One round-trip turns every
accented name into mojibake and the BOM into a stray `?` glyph at the top-left
of the page. Use the `Read-MrsdUtf8` / `Write-MrsdUtf8` helpers in `_paths.ps1`.
`publish-week-ahead.ps1` refuses to print a page that already contains
mojibake, so corruption fails loudly instead of landing in the archive.

**The doctype is load-bearing.** Without `<!DOCTYPE html>` the browser uses
quirks mode, where `<table>` does not inherit `font-family` from `<body>` — the
horizon table silently falls back to Times New Roman while everything else
stays sans. `check-fonts.ps1` guards this.
