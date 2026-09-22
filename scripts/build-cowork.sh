#!/usr/bin/env bash
# Builds a Cowork M365 app package. Used by CI and for local sideload testing.
#
#   ./scripts/build-cowork.sh customer-architect
#
# M365 requires manifest.json at the ZIP ROOT, so we zip from inside the plugin folder.
# README.md, .DS_Store, and __MACOSX cruft are excluded.
set -euo pipefail

PLUGIN="${1:-}"
if [[ -z "$PLUGIN" ]]; then
  echo "usage: $0 <plugin-folder-name>" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/cowork-plugins/$PLUGIN"
[[ -d "$SRC" ]] || { echo "error: $SRC does not exist" >&2; exit 1; }

VERSION=$(MANIFEST="$SRC/manifest.json" node -p \
  "JSON.parse(require('fs').readFileSync(process.env.MANIFEST,'utf8')).version")
OUT="$ROOT/dist/$PLUGIN-$VERSION.zip"

mkdir -p "$ROOT/dist"
rm -f "$OUT"
(cd "$SRC" && zip -rq "$OUT" . -x "README.md" -x "*.DS_Store" -x "__MACOSX/*")

# manifest.json must be at the zip root, or Cowork rejects the package on upload.
# Capture the listing rather than piping into `grep -q`: grep exits on first match, and the
# resulting SIGPIPE would trip `pipefail` even on success.
LISTING=$(unzip -l "$OUT")
grep -qE " manifest\.json$" <<<"$LISTING" || {
  echo "error: manifest.json is not at the zip root" >&2
  exit 1
}

echo "built $OUT"
echo "$LISTING"
