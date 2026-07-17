#!/bin/bash
# Prepares the cloud sandbox for Claude Code on the web (claude.ai/code).
# Runs via the SessionStart hook in .claude/settings.json; no-ops locally.

if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

if [ ! -d node_modules ]; then
  npm install --no-audit --no-fund || true
fi

exit 0
