<#
  Undo a CP1252/UTF-8 double-encode.

  Reads the bytes, decodes UTF-8 to get the mojibake string, re-encodes THAT as
  CP1252 to recover the original bytes, then decodes those as UTF-8. Also
  strips a BOM that survived as a literal character (it comes back as '?' at
  the very start of the file, rendering as a stray glyph top-left).

  The bug this fixes: Get-Content -Raw reads via the ANSI codepage on PS 5.1,
  and Set-Content -Encoding UTF8 writes a BOM. Always pass explicit encodings.

  Pass -WhatIf to see what would change without writing.
#>
[CmdletBinding(SupportsShouldProcess)]
param([string[]]$Path)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"

if (-not $Path) {
  $p = Get-MrsdPaths
  $Path = @($p.Page, (Join-Path $PSScriptRoot '..\reference\week-ahead-artifact.md' | Resolve-Path -ErrorAction SilentlyContinue).Path) |
          Where-Object { $_ -and (Test-Path $_) }
}

$cp = [System.Text.Encoding]::GetEncoding(1252)

foreach ($f in $Path) {
  if (-not (Test-Path $f)) { Write-Warning "missing: $f"; continue }

  $before = Read-MrsdUtf8 $f
  if ((Test-MrsdEncoding $before) -eq 0 -and $before[0] -ne '?') {
    "{0,-28} already clean" -f (Split-Path $f -Leaf)
    continue
  }

  $fixed = $script:MrsdUTF8.GetString($cp.GetBytes($before))

  # Box-drawing rules in a comment banner use a byte CP1252 cannot represent,
  # so they land as U+FFFD. They are decoration; restore them directly.
  $fixed = $fixed -replace ([string][char]0xFFFD), ([string][char]0x2550)

  # A BOM cannot survive the round-trip; it returns as a literal '?'.
  if ($fixed[0] -eq '?' -and ($fixed[1] -eq '<' -or $fixed[1] -eq '#' -or $fixed[1] -eq '-')) {
    $fixed = $fixed.Substring(1)
  }

  if ($PSCmdlet.ShouldProcess($f, 'repair encoding')) {
    Copy-Item $f "$f.bak" -Force
    Write-MrsdUtf8 $f $fixed
  }

  $after = Read-MrsdUtf8 $f
  [pscustomobject]@{
    File     = Split-Path $f -Leaf
    Mojibake = Test-MrsdEncoding $after
    FirstCh  = 'U+{0:X4}' -f [int]$after[0]
    Bytes    = ([System.IO.File]::ReadAllBytes($f)).Length
  }
}
