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

# Skip the Cypress binary download: download.cypress.io is not on the sandbox
# network allowlist, and the failing/hanging download otherwise aborts npm
# install (leaving node_modules empty) or burns the whole hook timeout.
# Cypress e2e runs are not part of the cloud workflow anyway.
export CYPRESS_INSTALL_BINARY=0

if [ ! -d node_modules ]; then
  npm install --no-audit --no-fund || true
fi

# Playwright for visual verification of UI changes (not a project dependency;
# browser binaries are cached in the cloud environment). Requires the Playwright
# CDN domains on the environment's network allowlist — see CLAUDE.md.
if [ ! -d node_modules/@playwright/test ]; then
  npm install --no-save --no-audit --no-fund @playwright/test || true
fi
npx playwright install --with-deps chromium || npx playwright install chromium || true

exit 0
