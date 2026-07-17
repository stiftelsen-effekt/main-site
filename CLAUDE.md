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

## Conventions

- Prettier is the source of truth for formatting; don't hand-format.
- Styles are CSS/SCSS modules colocated with components.
- Run `npm run typecheck` and `npm test` before considering a change done.
