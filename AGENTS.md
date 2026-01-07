# Repository Guidelines

## Project Structure & Module Organization
- `src/routes` contains SvelteKit routes and server endpoints.
- `src/lib` holds shared components, utilities, and client/server helpers.
- `src/app.html`, `src/app.css`, and `src/app.d.ts` define app shell, global styles, and type declarations.
- `prisma/schema.prisma` defines the database schema.
- `static/` is not present yet; add it if you need static assets served at the root.

## Build, Test, and Development Commands
- `pnpm install` installs dependencies.
- `pnpm dev` runs the Vite dev server at `http://localhost:5173`.
- `pnpm build` builds the production bundle.
- `pnpm preview` serves the production build locally.
- `pnpm check` runs SvelteKit sync and `svelte-check` against `tsconfig.json`.
- `pnpm lint` runs ESLint across the repo.
- `pnpm format` formats files with Prettier.
- `docker-compose up -d` starts local Postgres; `docker-compose down` stops it.
- `pnpm prisma:generate` generates Prisma client code.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in JS/TS/Svelte.
- Quotes: single quotes (Prettier config).
- Trailing commas: none.
- Svelte file order: options, scripts, markup, styles (Prettier plugin).
- Follow SvelteKit naming for routes (e.g., `+page.svelte`, `+server.ts`).

## Testing Guidelines
- No test framework is configured yet; add tests under `src` or a top-level `tests/` when needed.
- Use `pnpm check` and `pnpm lint` as the current quality gates.

## Commit & Pull Request Guidelines
- Recent commits use short, imperative messages like “Add Prisma schema and CRUD endpoints”.
- Keep commits focused; include context in the PR description.
- PRs should link relevant issues, describe behavior changes, and include screenshots for UI changes.

## Configuration & Secrets
- Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, and `ASSET_STORAGE_DIR`.
- Keep API keys server-side and out of client-exposed code.
