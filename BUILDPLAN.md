PORTRAIT STUDIO PRO v2
BUILD PLAN (AGENT-READY, PLAINTEXT)

============================================================
OVERVIEW
============================================================

This build plan describes the step-by-step implementation of Portrait Studio Pro v2.
It is written for an agentic coding system (e.g. Codex) and is ordered, gated,
and explicit about what “done” means at each phase.

The goal is a portrait-generation workstation with:
- versioned prompt recipes
- reproducible runs
- OpenAI + Gemini image generation
- critique → edit iteration
- identity consistency via pinned references

============================================================
PHASE 0 — REPO BOOTSTRAP
Goal: runnable project skeleton
============================================================

Tasks:
- Initialize SvelteKit project with TypeScript
- Add Tailwind CSS
- Add ESLint + Prettier
- Configure pnpm scripts
- Create .env.example with:
  DATABASE_URL
  OPENAI_API_KEY
  GEMINI_API_KEY
  ASSET_STORAGE_DIR=./data/assets
- Add docker-compose.yml for Postgres

Exit criteria:
- pnpm dev starts the app
- docker-compose up starts Postgres
- App loads in browser without errors

============================================================
PHASE 1 — DATABASE & PERSISTENCE
Goal: core entities persist correctly
============================================================

Tasks:
- Install Prisma
- Define schema for Project, Recipe, RecipeVersion, Run, Asset, PinSet
- Generate Prisma client
- Implement CRUD API endpoints

Exit criteria:
- Project, Recipe, RecipeVersion, Run records persist correctly

============================================================
PHASE 2 — ASSET STORAGE
Goal: upload and serve images
============================================================

Tasks:
- Implement local filesystem storage abstraction
- Implement upload endpoint
- Implement streaming endpoint

Exit criteria:
- Images upload and stream correctly

============================================================
PHASE 3 — SHOT SPEC + PROMPT COMPILER
Goal: deterministic prompt generation
============================================================

Tasks:
- Define ShotSpec schema
- Implement prompt compiler for OpenAI and Gemini

Exit criteria:
- Same input yields same compiled prompt

============================================================
PHASE 4 — PROVIDER ADAPTERS
Goal: image generation works
============================================================

Tasks:
- Implement OpenAI gpt-image-1.5 adapter
- Implement Gemini adapter
- Execute runs and store outputs

Exit criteria:
- Images generated and stored

============================================================
PHASE 5 — WORKBENCH UI
Goal: usable MVP
============================================================

Tasks:
- Implement workbench UI
- Generate and edit images

Exit criteria:
- End-to-end workflow works

============================================================
PHASE 6 — CRITIQUE & PINS
Goal: iteration and consistency
============================================================

Tasks:
- Implement critique endpoint
- Implement identity pinning

Exit criteria:
- Critique suggestions work
- Identity persists across runs

============================================================
END BUILD PLAN
============================================================
