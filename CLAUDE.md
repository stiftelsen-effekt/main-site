# CLAUDE.md

Main site for Gi Effektivt / Ge Effektivt / Giv Effektivt — a multi-country (NO/SE/DK) donation platform. Next.js (Pages Router) frontend with Sanity as CMS, Auth0 for the logged-in profile pages, and the [effekt-backend](https://github.com/stiftelsen-effekt/effekt-backend) API for donation data.

## Commands

- `npm install` — install dependencies (Node version: see `.nvmrc`)
- `npm run dev` — dev server on http://localhost:3000
- `npm run typecheck` — TypeScript check (`tsc --noEmit`)
- `npm test` — Jest unit tests
- `npm run lint` — ESLint
- `npm run format` — Prettier (also runs on commit via husky/lint-staged)

Environment: copy `.env.example` to `.env.local`. The defaults point at a test Sanity dataset and a local backend; see comments in `.env.example` for the Swedish/Danish alternatives.

## Architecture notes

- **Custom routing**: only files with the `.page.tsx` extension are picked up by the Next.js router. `pages/[[...slug]].page.tsx` parses the slug and renders the correct page type. Page types are regular modules under `pages/` (without `.page.tsx`) that export static paths and props via the `withStaticProps()` helper.
- **Two layouts**: public pages use `components/main/layout.tsx`; everything under `pages/dashboard` uses the profile layout `components/min-side/layout.tsx` (wrapped in the Auth0 provider). Each page sets its layout via a `.Layout` property on the export.
- **Content**: fetched from Sanity with GROQ queries (`_queries.ts` and colocated query files). The Sanity studio lives in `studio/` as a separate npm project.
- **Reusable components** live in `components/`, mostly under `components/main/blocks/` for CMS-driven content blocks.

## Verifying UI changes (Claude Code cloud sessions)

Cloud sessions have `@playwright/test` and Chromium available (installed by `scripts/claude-code-setup.sh`). When a change affects anything user-visible:

1. Start the dev server (`npm run dev`) and wait until the affected page compiles.
2. Write a small throwaway Playwright script that opens the affected pages against `http://localhost:3000` and saves full-page screenshots (desktop 1440px and mobile 390px widths) to `screenshots/` at the repo root.
3. Commit the screenshots to the branch and embed them in the PR description using raw URLs: `https://raw.githubusercontent.com/stiftelsen-effekt/main-site/<branch>/screenshots/<file>.png`.
4. Keep screenshots small (PNG, only the affected pages) — reviewers may ask to drop the `screenshots/` commit before merge.

If Playwright or Chromium is missing, the environment's network allowlist probably lacks the Playwright CDN domains (`cdn.playwright.dev`, `playwright.azureedge.net`, `playwright.download.prss.microsoft.com`); say so in the PR instead of skipping verification silently.

## Conventions

- Prettier is the source of truth for formatting; don't hand-format.
- Styles are CSS/SCSS modules colocated with components.
- Run `npm run typecheck` and `npm test` before considering a change done.
