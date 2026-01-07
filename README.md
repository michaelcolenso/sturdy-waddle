# Portrait Studio Pro v2

This repository contains the Phase 0 scaffold for Portrait Studio Pro v2.

## Prerequisites

- Node.js 18+
- pnpm
- Docker (for local Postgres)

## Configuration

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

Environment variables:

- `DATABASE_URL` — Postgres connection string.
- `OPENAI_API_KEY` — OpenAI API key (server-side only).
- `GEMINI_API_KEY` — Gemini API key (server-side only).
- `ASSET_STORAGE_DIR` — local asset storage directory.

## Development

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Local Database

Start Postgres with Docker:

```bash
docker-compose up -d
```

Stop Postgres:

```bash
docker-compose down
```

## Production Build

Build and preview the production bundle:

```bash
pnpm build
pnpm preview
```
