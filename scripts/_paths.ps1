<#
  Shared path resolution for the Week Ahead scripts. Dot-source this:

      . "$PSScriptRoot\_paths.ps1"
      $p = Get-MrsdPaths

  WHY THIS EXISTS
  The working page used to live in the Claude session's outputs folder, whose
  path contains a session GUID that changes every session. Any script that
  hardcoded it worked exactly once. The page's real home is the Drive data
  folder, which is stable, synced, and already where the household's private
  files live.

  PRIVACY
  The page contains family names, appointments and school details, and this
  repo is public. The page therefore lives on Drive and follows the existing
  `.local.` naming convention so .gitignore keeps it out of git. Never move it
  into the repo.

  RESOLUTION ORDER, per path
    1. explicit parameter passed by the caller
    2. environment variable  (MRSD_PAGE / MRSD_ARCHIVE / MRSD_DATA)
    3. ~/.mrs-doubtfire/paths.json
    4. built-in default
#>

$script:MrsdPathsFile = Join-Path $env:USERPROFILE '.mrs-doubtfire\paths.json'
$script:MrsdUTF8      = New-Object System.Text.UTF8Encoding($false, $false)

function Read-MrsdUtf8 { param([string]$Path) $script:MrsdUTF8.GetString([System.IO.File]::ReadAllBytes($Path)) }
function Write-MrsdUtf8 { param([string]$Path, [string]$Text) [System.IO.File]::WriteAllText($Path, $Text, $script:MrsdUTF8) }

function Get-MrsdPaths {
  [CmdletBinding()]
  param([string]$Page, [string]$Archive, [string]$Data)

  $cfg = [pscustomobject]@{}
  if (Test-Path $script:MrsdPathsFile) {
    try { $cfg = Read-MrsdUtf8 $script:MrsdPathsFile | ConvertFrom-Json }
    catch { Write-Warning "Could not parse $script:MrsdPathsFile - ignoring it." }
  }

  function Pick {
    param($Explicit, $EnvName, $CfgKey, $Default)
    if ($Explicit)                     { return $Explicit }
    $e = [Environment]::GetEnvironmentVariable($EnvName)
    if ($e)                            { return $e }
    if ($cfg.PSObject.Properties.Name -contains $CfgKey -and $cfg.$CfgKey) { return $cfg.$CfgKey }
    return $Default
  }

  # No personal paths are baked in: this repo is public and household-agnostic.
  # Each machine records its own layout via install-paths.ps1. If nothing is
  # configured we say so plainly rather than guessing at someone's Drive.
  $dataDir = Pick $Data    'MRSD_DATA'    'data'    $null
  $archive = Pick $Archive 'MRSD_ARCHIVE' 'archive' $null
  $page    = Pick $Page    'MRSD_PAGE'    'page'    $(if ($dataDir) { Join-Path $dataDir 'week-ahead.local.html' } else { $null })

  if (-not $dataDir -or -not $archive) {
    throw @"
Mrs. Doubtfire paths are not configured on this machine.

Run once:
  .\scripts\install-paths.ps1 -Data '<your data folder>' -Archive '<where weekly PDFs go>' -FromPage '<current week-ahead.html>'

Or set MRSD_DATA / MRSD_ARCHIVE / MRSD_PAGE in the environment.
Config file: $script:MrsdPathsFile
"@
  }

  [pscustomobject]@{
    Data       = $dataDir
    Archive    = $archive
    Page       = $page
    ConfigFile = $script:MrsdPathsFile
  }
}

# Fail early and legibly rather than halfway through a publish.
function Assert-MrsdPaths {
  param([Parameter(Mandatory)]$Paths, [switch]$RequirePage)
  if (-not (Test-Path $Paths.Data))    { throw "Data folder not found: $($Paths.Data). Set MRSD_DATA or edit $($Paths.ConfigFile)." }
  if (-not (Test-Path $Paths.Archive)) { New-Item -ItemType Directory -Path $Paths.Archive -Force | Out-Null }
  if ($RequirePage -and -not (Test-Path $Paths.Page)) {
    throw "Page not found: $($Paths.Page). Set MRSD_PAGE, edit $($Paths.ConfigFile), or pass -Page."
  }
}

# Mojibake guard, shared by every script that reads or writes the page.
function Test-MrsdEncoding {
  param([Parameter(Mandatory)][string]$Text)
  ([regex]::Matches($Text, '[\uFFFD\u00E2\u00C3]')).Count
}
