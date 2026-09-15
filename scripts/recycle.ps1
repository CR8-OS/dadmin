# Send a file to the Recycle Bin instead of destroying it. Remove-Item is
# permanent; this is recoverable, which is the right default for anything in
# the user's own Drive folder.
param([Parameter(Mandatory)][string]$Path)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName Microsoft.VisualBasic
$full = (Resolve-Path $Path).Path
[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile(
  $full,
  [Microsoft.VisualBasic.FileIO.UIOption]::OnlyErrorDialogs,
  [Microsoft.VisualBasic.FileIO.RecycleOption]::SendToRecycleBin
)
"recycled: $full"
