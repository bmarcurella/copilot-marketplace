#!/usr/bin/env bash
# check-freshness.sh - SessionStart hook for copilot-extension-builder.
# Prints a reminder (as a systemMessage JSON) if the monitored documentation sources are stale.
# Best-effort and non-blocking: any error just exits 0 with no output.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$DIR/../references/sources.json"
[ -f "$SRC" ] || exit 0

if command -v python3 >/dev/null 2>&1; then
  msg="$(python3 - "$SRC" <<'PY' 2>/dev/null || true
import json, sys, datetime
try:
    d = json.load(open(sys.argv[1]))
    interval = int(d.get("check_interval_days", 14)) or 14
    today = datetime.date.today()
    oldest = None
    stale = False
    for s in d.get("sources", []):
        lc = s.get("last_checked")
        if not lc:
            stale = True
            break
        dt = datetime.date.fromisoformat(lc)
        if oldest is None or dt < oldest:
            oldest = dt
    if not stale:
        if oldest is None:
            stale = True
        elif (today - oldest).days > interval:
            stale = True
    if stale:
        print(json.dumps({"systemMessage": "copilot-extension-builder: knowledge sources may be stale. Run /sync-knowledge to refresh from Microsoft Learn / GitHub docs."}))
except Exception:
    pass
PY
)"
  [ -n "$msg" ] && printf '%s\n' "$msg"
fi
exit 0
