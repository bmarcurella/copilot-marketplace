#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Builds a Cowork M365 app package on Windows — the PowerShell twin of build-cowork.sh (which CI uses).

.EXAMPLE
  ./scripts/build-cowork.ps1 customer-architect

.NOTES
  M365 requires manifest.json at the ZIP ROOT, so entries are written relative to the plugin folder.
  The root README.md, .DS_Store, and __MACOSX cruft are excluded. Entry names use forward slashes;
  Compress-Archive in Windows PowerShell 5.1 writes backslashes, which some package validators reject.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory, Position = 0)]
  [ValidatePattern('^[A-Za-z0-9._-]+$')]
  [string]$Plugin
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "cowork-plugins/$Plugin"
if (-not (Test-Path $src -PathType Container)) { throw "$src does not exist" }

$version = (Get-Content (Join-Path $src 'manifest.json') -Raw | ConvertFrom-Json).version
$dist = Join-Path $root 'dist'
$out = Join-Path $dist "$Plugin-$version.zip"
New-Item -ItemType Directory -Force $dist | Out-Null
if (Test-Path $out) { Remove-Item $out }

$srcFull = (Resolve-Path $src).Path.TrimEnd('\', '/')
$files = Get-ChildItem $srcFull -Recurse -File -Force | Where-Object {
  $relative = $_.FullName.Substring($srcFull.Length + 1) -replace '\\', '/'
  $relative -ne 'README.md' -and $_.Name -ne '.DS_Store' -and $relative -notmatch '(^|/)__MACOSX/'
}

$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $entry = $file.FullName.Substring($srcFull.Length + 1) -replace '\\', '/'
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $zip, $file.FullName, $entry, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally {
  $zip.Dispose()
}

# manifest.json must be at the zip root, or Cowork rejects the package on upload.
$read = [System.IO.Compression.ZipFile]::OpenRead($out)
try {
  $entries = $read.Entries | ForEach-Object FullName
} finally {
  $read.Dispose()
}
if ($entries -notcontains 'manifest.json') { throw 'manifest.json is not at the zip root' }

Write-Host "built $out"
$entries | ForEach-Object { "  $_" }
