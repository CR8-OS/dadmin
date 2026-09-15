<#
  Copy the live page's <style> block into the spec's Template fence, so next
  week's build starts from the current design instead of an older one.

  Only the CSS moves. The spec's template markup uses placeholders
  (MONTH DAY, etc.) and must not be overwritten with real family content -
  the spec is committed to a public repo.
#>
[CmdletBinding(SupportsShouldProcess)]
param([string]$Page, [string]$Spec)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"

$p = Get-MrsdPaths -Page $Page
Assert-MrsdPaths -Paths $p -RequirePage
if (-not $Spec) { $Spec = (Resolve-Path (Join-Path $PSScriptRoot '..\reference\week-ahead-artifact.md')).Path }

$html = Read-MrsdUtf8 $p.Page
$md   = Read-MrsdUtf8 $Spec

foreach ($pair in @(@{n='page';t=$html}, @{n='spec';t=$md})) {
  $bad = Test-MrsdEncoding $pair.t
  if ($bad -gt 0) { throw "Refusing to sync: $($pair.n) contains $bad mojibake characters. Run repair-encoding.ps1." }
}

$m = [regex]::Match($html, '(?s)<style>(.*?)</style>')
if (-not $m.Success) { throw 'No <style> block found in the live page.' }
$style = $m.Groups[1].Value

$m2 = [regex]::Match($md, '(?s)(?<=## Template)(.*?)<style>(.*?)</style>')
if (-not $m2.Success) { throw 'No <style> block found in the spec template.' }
$md = $md.Remove($m2.Groups[2].Index, $m2.Groups[2].Length).Insert($m2.Groups[2].Index, $style)

if ($md -notmatch '(?i)<meta[^>]+charset') {
  $md = $md -replace '(?m)^<title>Week of MONTH DAY</title>', "<meta charset=`"utf-8`">`n<title>Week of MONTH DAY</title>"
}

if ($PSCmdlet.ShouldProcess($Spec, 'sync template CSS')) { Write-MrsdUtf8 $Spec $md }

$check = Read-MrsdUtf8 $Spec
[pscustomobject]@{
  Spec       = Split-Path $Spec -Leaf
  Bytes      = ([System.IO.File]::ReadAllBytes($Spec)).Length
  HasCharset = [bool]($check -match '(?i)<meta[^>]+charset')
  DarkMode   = [bool]($check -match 'prefers-color-scheme')
  Mojibake   = Test-MrsdEncoding $check
  Fences     = ([regex]::Matches($check, '```')).Count
}
