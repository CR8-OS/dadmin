<#
.SYNOPSIS
  Stamp and archive the Week Ahead page as a dated weekly PDF.

.DESCRIPTION
  One PDF per week, named for that week's Monday, holding the latest state of
  that week. Re-running inside the same week overwrites that week's file rather
  than piling up copies - "memorialize weekly, as of the latest update."

  The masthead "Updated" line means CONTENT last rebuilt from sources (mail,
  calendar, memo, TickTick). It is NOT the print time. Re-printing the same
  content with a new design is not an update, so only pass -StampNow when the
  content itself was actually refreshed this run. Otherwise the page would
  claim a freshness it does not have, which is the one thing this page cannot
  afford to do.

  Paths come from _paths.ps1 (env vars, ~/.mrs-doubtfire/paths.json, or
  defaults). Nothing here is hardcoded to a Claude session folder.

.NOTES
  ENCODING - do not "simplify" the file I/O. Get-Content -Raw reads via the
  ANSI codepage on PS 5.1 and Set-Content -Encoding UTF8 adds a BOM; one
  round-trip mangles every accented name. Use the Read/Write-MrsdUtf8 helpers.

.EXAMPLE
  .\publish-week-ahead.ps1 -StampNow    # content was rebuilt from sources
.EXAMPLE
  .\publish-week-ahead.ps1              # design-only change, leave the stamp
#>
[CmdletBinding()]
param(
  [string]   $Page,
  [string]   $Archive,
  [datetime] $WeekOf = (Get-Date),
  [switch]   $StampNow
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"

$p = Get-MrsdPaths -Page $Page -Archive $Archive
Assert-MrsdPaths -Paths $p -RequirePage

# Monday of the requested week. PowerShell's DayOfWeek puts Sunday at 0, so
# Sunday has to roll back six days, not forward one.
$dow     = [int]$WeekOf.DayOfWeek
$offset  = if ($dow -eq 0) { -6 } else { 1 - $dow }
$weekTag = $WeekOf.Date.AddDays($offset).ToString('yyyy-MM-dd')

# Refuse to publish a corrupted page rather than printing it into the archive.
$doc = Read-MrsdUtf8 $p.Page
$bad = Test-MrsdEncoding $doc
if ($bad -gt 0) {
  throw "Page contains $bad mojibake/replacement characters. Run repair-encoding.ps1 before publishing."
}

if ($StampNow) {
  $label = 'Updated ' + (Get-Date).ToString('ddd MMM d, h:mm tt')
  $new   = [regex]::Replace($doc, '<span>Updated[^<]*</span>', "<span>$label</span>", 1)
  if ($new -eq $doc) { Write-Warning 'No "Updated" span found - masthead not stamped.' }
  else { Write-MrsdUtf8 $p.Page $new; $doc = $new }
}

# Read back what the stamp actually says, so the report never guesses.
$stamp = ([regex]::Match($doc, '<span>(Updated[^<]*)</span>')).Groups[1].Value
if (-not $stamp) { $stamp = '(no stamp found)' }

# A page with no charset renders accents as garbage once it leaves this machine.
if ($doc -notmatch '(?i)<meta[^>]+charset') {
  Write-Warning 'Page does not declare <meta charset="utf-8"> - accented names may render as garbage.'
}

$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe" }
if (-not (Test-Path $chrome)) { throw 'Chrome not found; needed to print the PDF.' }

$dest = Join-Path $p.Archive "Week Ahead $weekTag.pdf"
& $chrome --headless=new --disable-gpu --no-pdf-header-footer `
          --virtual-time-budget=9000 `
          --print-to-pdf="$dest" "file:///$($p.Page -replace '\\','/')" 2>$null
Start-Sleep -Seconds 2

if (-not (Test-Path $dest)) { throw "PDF was not written: $dest" }
$f = Get-Item $dest
[pscustomobject]@{
  Week        = $weekTag
  File        = $f.Name
  SizeKB      = [math]::Round($f.Length / 1KB)
  Printed     = $f.LastWriteTime.ToString('ddd MMM d, h:mm tt')
  ContentSays = $stamp
  Mojibake    = $bad
  Source      = $p.Page
}
