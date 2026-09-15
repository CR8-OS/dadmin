<#
  One-time setup: give the Week Ahead page a permanent home and record where
  everything lives, so no script depends on a Claude session folder again.

  The page holds family names, appointments and school details, and the repo is
  public - so the page lives in the Drive data folder under the household's
  existing `.local.` convention, never in the repo.
#>
[CmdletBinding()]
param(
  [string]$FromPage,                  # current working copy to adopt
  [string]$Data,
  [string]$Archive
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"

$p = Get-MrsdPaths -Data $Data -Archive $Archive
if (-not (Test-Path $p.Data))    { throw "Data folder not found: $($p.Data)" }
if (-not (Test-Path $p.Archive)) { New-Item -ItemType Directory -Path $p.Archive -Force | Out-Null }

$dest = Join-Path $p.Data 'week-ahead.local.html'

if ($FromPage) {
  if (-not (Test-Path $FromPage)) { throw "Source page not found: $FromPage" }
  $text = Read-MrsdUtf8 $FromPage
  $bad  = Test-MrsdEncoding $text
  if ($bad -gt 0) { throw "Refusing to install a page with $bad mojibake characters." }
  if ($text -notmatch '(?i)^\s*<!doctype html>') { throw 'Refusing to install a page with no doctype (quirks mode turns tables serif).' }
  if ($text -notmatch '(?i)<meta[^>]+charset')   { throw 'Refusing to install a page with no charset declaration.' }
  Write-MrsdUtf8 $dest $text
}

$cfgDir = Split-Path $script:MrsdPathsFile -Parent
if (-not (Test-Path $cfgDir)) { New-Item -ItemType Directory -Path $cfgDir -Force | Out-Null }

$json = [ordered]@{
  page    = $dest
  archive = $p.Archive
  data    = $p.Data
} | ConvertTo-Json
Write-MrsdUtf8 $script:MrsdPathsFile $json

$after = Get-MrsdPaths
[pscustomobject]@{
  ConfigFile  = $after.ConfigFile
  Page        = $after.Page
  PageExists  = Test-Path $after.Page
  Archive     = $after.Archive
  Data        = $after.Data
}
