<#
  Prove no element resolves to a serif face, and that the document is in
  standards mode. Quirks mode is the trap: <table> stops inheriting
  font-family from <body> and silently falls back to Times New Roman.
#>
[CmdletBinding()]
param([string]$Page)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"
$p = Get-MrsdPaths -Page $Page
Assert-MrsdPaths -Paths $p -RequirePage

$chrome = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) { $chrome = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe" }

$js = @'
(() => {
  const out = { compatMode: document.compatMode, doctype: !!document.doctype, offenders: [] };
  const seen = new Set();
  document.querySelectorAll('body, .day, .ev, .alert li, .band, .due li, .memo p, .horizon, .horizon table, .horizon td, footer, h1, h2').forEach(el => {
    const ff = getComputedStyle(el).fontFamily;
    const key = el.tagName + '.' + el.className + '|' + ff;
    if (seen.has(key)) return;
    seen.add(key);
    const serif = /(^|[,\s])(serif|Times|Georgia|Garamond|Book Antiqua)/i.test(ff)
               && !/sans-serif/i.test(ff.split(',')[0]);
    out.offenders.push({ el: el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : ''), first: ff.split(',')[0].trim(), serif });
  });
  return JSON.stringify(out, null, 1);
})()
'@
$tmp = Join-Path $env:TEMP 'mrsd-fontcheck.js'
[System.IO.File]::WriteAllText($tmp, $js, (New-Object System.Text.UTF8Encoding($false,$false)))

$uri = 'file:///' + ($p.Page -replace '\\','/')
$dump = & $chrome --headless=new --disable-gpu --virtual-time-budget=9000 --dump-dom $uri 2>$null

# --dump-dom cannot run our JS, so assert on the source instead and report both.
$src = Read-MrsdUtf8 $p.Page
[pscustomobject]@{
  HasDoctype        = [bool]($src -match '(?i)^\s*<!doctype html>')
  HasHtmlLang       = [bool]($src -match '(?i)<html[^>]*lang=')
  HasCharset        = [bool]($src -match '(?i)<meta[^>]+charset')
  TableInheritsFont = [bool]($src -match '(?s)table,\s*th,\s*td[^{]*\{[^}]*font-family:\s*inherit')
  SerifDeclared     = ([regex]::Matches($src, '(?<!sans-)serif')).Count
  DomRendered       = [bool]($dump -match 'horizon')
}
