<#
  List every non-ASCII character in the page with counts, so corruption is
  visible as data rather than guessed at from a rendering.
#>
[CmdletBinding()]
param([string]$Page)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\_paths.ps1"

$p = Get-MrsdPaths -Page $Page
Assert-MrsdPaths -Paths $p -RequirePage

$b = [System.IO.File]::ReadAllBytes($p.Page)
$s = Read-MrsdUtf8 $p.Page

"file             : $($p.Page)"
"bytes            : $($b.Length)"
"has BOM          : " + (($b[0] -eq 0xEF) -and ($b[1] -eq 0xBB) -and ($b[2] -eq 0xBF))
"declares charset : " + [bool]($s -match '(?i)<meta[^>]+charset')
"mojibake count   : " + (Test-MrsdEncoding $s)
"first 60 chars   : " + (($s.Substring(0, [Math]::Min(60, $s.Length))) -replace '[\r\n]', ' ')
""
"-- every non-ASCII character present, with counts --"

$names = @{
  0x2014 = 'em dash';             0x2013 = 'en dash'
  0x2018 = 'left single quote';   0x2019 = 'right single quote'
  0x201C = 'left double quote';   0x201D = 'right double quote'
  0x00E9 = 'e acute';             0x00C9 = 'E acute'
  0x00E8 = 'e grave';             0x00E0 = 'a grave'
  0x2550 = 'box double horizontal'; 0x2500 = 'box light horizontal'
  0x00A0 = 'NBSP'
  0xFFFD = 'REPLACEMENT CHAR - CORRUPT'
  0x00E2 = 'a circumflex - MOJIBAKE'
  0x00C3 = 'A tilde - MOJIBAKE'
  0xFEFF = 'BOM AS LITERAL CHAR - CORRUPT'
}

$counts = @{}
foreach ($c in $s.ToCharArray()) {
  $k = [int]$c
  if ($k -gt 126) { if ($counts.ContainsKey($k)) { $counts[$k]++ } else { $counts[$k] = 1 } }
}

if ($counts.Count -eq 0) { "  (none - page is pure ASCII)" }
$counts.GetEnumerator() | Sort-Object Name | ForEach-Object {
  $label = if ($names.ContainsKey($_.Name)) { $names[$_.Name] } else { '-' }
  "  U+{0:X4}  {1,5}x  {2}" -f $_.Name, $_.Value, $label
}
