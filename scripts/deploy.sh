#!/usr/bin/env bash
# Build and deploy LingoForge to Cloudflare Pages.
#
# Replaces .github/workflows/deploy.yml, which cannot run while the GitHub
# account is blocked (Actions disabled account-wide, ticket 4583559).
# Mirrors that workflow's steps exactly so the output is identical.
#
# Usage: scripts/deploy.sh [--skip-tests]
#
# Requires: CLOUDFLARE_API_TOKEN (defaults to ~/.cloudflare/api-token)
#           node 20+, python3, network access for edge-tts.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PROJECT_NAME="lingoforge"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-be2fcc462d6ce346d319308ee23f1854}"
TOKEN_FILE="${CLOUDFLARE_TOKEN_FILE:-$HOME/.cloudflare/api-token}"
VENV_DIR="${VENV_DIR:-$REPO_ROOT/.venv-deploy}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  [[ -r "$TOKEN_FILE" ]] || { echo "ERROR: no token in \$CLOUDFLARE_API_TOKEN or $TOKEN_FILE" >&2; exit 1; }
  CLOUDFLARE_API_TOKEN="$(cat "$TOKEN_FILE")"
fi
# Deliberately not exported: only the wrangler step gets the token, so the
# npm/pip tooling that runs earlier never sees deploy credentials.

# edge-tts goes in a venv: Debian's python3 is PEP 668 externally-managed and
# refuses a plain `pip install --user`.
if [[ ! -x "$VENV_DIR/bin/python" ]]; then
  echo "==> creating venv at $VENV_DIR"
  python3 -m venv "$VENV_DIR"
fi
"$VENV_DIR/bin/pip" install --quiet edge-tts==7.2.8

echo "==> npm ci"
npm ci

if [[ "${1:-}" != "--skip-tests" ]]; then
  echo "==> tests"
  npm test
fi

# No audio is committed. gen-audio.py skips MP3s that already exist, so public/audio
# is kept in a cache outside the repo: a deploy only synthesizes new texts, and a
# flaky edge-tts run is retried (only the failed items) instead of aborting.
# Skipping this step ships a site with silent playback buttons.
AUDIO_CACHE="${AUDIO_CACHE:-$HOME/.cache/lingoforge-audio}"
mkdir -p "$AUDIO_CACHE" public/audio
cp -a "$AUDIO_CACHE/." public/audio/

# A missing MP3 is silent, not loud: tts.ts falls back to Web Speech, which says
# nothing at all on a phone with no Russian voice. Refuse to ship that.
for attempt in 1 2 3; do
  echo "==> gen-audio (attempt $attempt)"
  PATH="$VENV_DIR/bin:$PATH" npm run gen-audio
  cp -a public/audio/. "$AUDIO_CACHE/"
  echo "==> check-audio"
  python3 scripts/check-audio.py && break
  [[ $attempt -lt 3 ]] || exit 1
done

echo "==> build"
npm run build

echo "==> deploy to Cloudflare Pages"
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" \
  npx --yes wrangler@4.141.0 pages deploy dist \
  --project-name "$PROJECT_NAME" \
  --branch main \
  --commit-dirty=true

echo
echo "Deployed: https://${PROJECT_NAME}.pages.dev"
