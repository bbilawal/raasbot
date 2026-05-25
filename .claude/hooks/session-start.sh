#!/usr/bin/env bash
# Fetch agents from the private bbilawal/Agents repo into .claude/agents/
# Requires: GITHUB_TOKEN env var with read access to bbilawal/Agents
set -euo pipefail

REPO="bbilawal/Agents"
REF="${AGENTS_REF:-main}"
DEST="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/agents"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "session-start hook: GITHUB_TOKEN not set; skipping agent fetch" >&2
  exit 0
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if ! curl -fsSL \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/${REPO}/tarball/${REF}" \
    -o "$tmp/agents.tar.gz"; then
  echo "session-start hook: failed to download ${REPO}@${REF}" >&2
  exit 0
fi

mkdir -p "$tmp/extract"
tar -xzf "$tmp/agents.tar.gz" -C "$tmp/extract"

root="$(find "$tmp/extract" -mindepth 1 -maxdepth 1 -type d | head -n1)"
if [ -z "$root" ]; then
  echo "session-start hook: tarball had no root directory" >&2
  exit 0
fi

mkdir -p "$DEST"
# Copy every .md agent definition, preserving subdirectories
(cd "$root" && find . -type f -name '*.md' -print0) \
  | (cd "$root" && xargs -0 -I{} cp --parents "{}" "$DEST")

echo "session-start hook: synced agents from ${REPO}@${REF} into ${DEST}" >&2
