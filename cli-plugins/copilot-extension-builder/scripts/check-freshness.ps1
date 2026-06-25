# check-freshness.ps1 - SessionStart hook for copilot-extension-builder.
# Prints a reminder (as a systemMessage) if the monitored documentation sources are stale.
# Best-effort and non-blocking: any error just exits 0 with no output.

$ErrorActionPreference = 'SilentlyContinue'
try {
    $sourcesPath = Join-Path $PSScriptRoot '..\references\sources.json'
    if (-not (Test-Path $sourcesPath)) { exit 0 }

    $data = Get-Content -Raw -Path $sourcesPath | ConvertFrom-Json
    $interval = [int]$data.check_interval_days
    if ($interval -le 0) { $interval = 14 }

    $today = (Get-Date).Date
    $oldest = $null
    $stale = $false

    foreach ($s in $data.sources) {
        if (-not $s.last_checked) { $stale = $true; break }
        $d = [datetime]::ParseExact([string]$s.last_checked, 'yyyy-MM-dd', $null).Date
        if ($null -eq $oldest -or $d -lt $oldest) { $oldest = $d }
    }

    if (-not $stale) {
        if ($null -eq $oldest) { $stale = $true }
        elseif (($today - $oldest).Days -gt $interval) { $stale = $true }
    }

    if ($stale) {
        $msg = 'copilot-extension-builder: knowledge sources may be stale. Run /sync-knowledge to refresh from Microsoft Learn / GitHub docs.'
        Write-Output (@{ systemMessage = $msg } | ConvertTo-Json -Compress)
    }
}
catch { }
exit 0
