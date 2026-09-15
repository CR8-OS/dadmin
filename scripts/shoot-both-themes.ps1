<#
  Render the page in light and dark and save both PNGs, so the two themes can
  be compared before publishing. Shots go to a scratch folder, never to the
  archive.
#>
[CmdletBinding()]
param(
  [string]$Page,
  [string]$OutDir,
  [int]$Height = 2700,
  [int]$Width  = 1280,
  [string]$Suffix = ''
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"

$p = Get-MrsdPaths -Page $Page
Assert-MrsdPaths -Paths $p -RequirePage

if (-not $OutDir) { $OutDir = Join-Path $env:TEMP 'mrs-doubtfire-shots' }
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }

$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe" }
if (-not (Test-Path $chrome)) { throw 'Chrome not found; needed to render.' }

$uri = 'file:///' + ($p.Page -replace '\\', '/')

# Blink's preferredColorScheme: 0 = dark, 1 = light.
foreach ($t in @(@{ n = 'light'; v = 1 }, @{ n = 'dark'; v = 0 })) {
  $out = Join-Path $OutDir "shot-$($t.n)$Suffix.png"
  & $chrome --headless=new --disable-gpu --hide-scrollbars --force-color-profile=srgb `
    --blink-settings=preferredColorScheme=$($t.v) --virtual-time-budget=9000 `
    --window-size=$Width,$Height --screenshot="$out" $uri 2>$null
  Start-Sleep -Seconds 2
}

Get-ChildItem $OutDir -Filter "shot-*$Suffix.png" |
  Select-Object Name, @{ n = 'KB'; e = { [math]::Round($_.Length / 1KB) } }, FullName
