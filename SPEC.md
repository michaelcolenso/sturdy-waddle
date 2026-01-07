PORTRAIT STUDIO PRO v2
ENGINEERING SPECIFICATION (AGENT-READY)
PLAINTEXT VERSION

====================================================================
0. OBJECTIVE
====================================================================

Build Portrait Studio Pro v2, a portrait-generation workstation that converts
structured photographic intent into reproducible, versioned image-generation
workflows, optimized for:

- OpenAI gpt-image-1.5
- Google Gemini image generation

The system must support:
- Projects
- Recipes (draft + versioned)
- Runs
- Assets
- Critique → Edit loops
- Identity consistency via pinned references


====================================================================
1. TECHNOLOGY STACK (LOCKED)
====================================================================

Frontend:
- SvelteKit
- TypeScript
- Tailwind CSS
- Svelte stores for state
- CSS Grid for image layouts

Backend:
- Node.js (TypeScript)
- SvelteKit server routes (+server.ts)
- Provider calls ONLY from server

Database:
- Prisma ORM
- PostgreSQL
- SQLite allowed for development, schema must remain Postgres-safe

Storage:
- Development: local filesystem at ./data/assets
- Abstracted storage interface for future S3 / R2 support

Secrets:
- OPENAI_API_KEY
- GEMINI_API_KEY
- Secrets must never be exposed to the client


====================================================================
2. CORE DOMAIN CONCEPTS
====================================================================

Project:
Container for related portrait work (client, series, experiment).

Recipe:
Editable draft Shot Spec.

RecipeVersion:
Immutable snapshot of a Recipe at generation time.

Run:
Execution of a RecipeVersion using a provider.

Asset:
Any image involved (input reference or generated output).

PinSet:
Persistent constraints used to maintain identity and consistency
across runs.


====================================================================
3. REQUIRED USER FLOWS
====================================================================

3.1 Recipe Lifecycle
- Create Project
- Create Recipe
- Edit Shot Spec (auto-save draft)
- “Create Version + Generate” creates immutable RecipeVersion

3.2 Generate (Text → Image)
- Select provider: OpenAI or Gemini
- Parameters:
  - Aspect ratio
  - Image count (4, 9, or 16)
  - Quality preset
- Outputs persisted and displayed in a grid

3.3 Edit (Image → Image)
- Select existing Asset or upload reference image
- Provide edit instruction
- Outputs persisted as new Assets

3.4 Critique → Edit Loop
- Select output image
- Call critique endpoint
- Receive:
  - Observations
  - Three suggested edit instructions
- User selects one suggestion and runs an Edit

3.5 Identity and Consistency
- User may pin:
  - Identity reference image
  - Wardrobe notes
  - Lighting notes
- Pins must affect all future prompt compilation


====================================================================
4. APPLICATION ROUTES
====================================================================

/workbench/{projectId}
Main editing and generation interface.

/runs/{runId}
Run metadata, compiled prompts, and assets.

/settings
UI defaults only. No API keys.


====================================================================
5. DATABASE SCHEMA (PRISMA)
====================================================================

MODEL: Project
Fields:
- id: String, primary key, uuid
- name: String
- createdAt: DateTime, default now
- updatedAt: DateTime, auto-updated
Relations:
- recipes: Recipe[]
- runs: Run[]
- pinSet: PinSet (optional)


MODEL: Recipe
Fields:
- id: String, primary key, uuid
- projectId: String (FK)
- name: String
- draftSpecJson: Json
- createdAt: DateTime, default now
- updatedAt: DateTime, auto-updated
Relations:
- project: Project
- versions: RecipeVersion[]


MODEL: RecipeVersion (IMMUTABLE)
Fields:
- id: String, primary key, uuid
- recipeId: String (FK)
- versionNumber: Int
- specJson: Json
- compiledPromptOpenAI: String
- compiledPromptGemini: String
- note: String (optional)
- createdAt: DateTime, default now
Relations:
- recipe: Recipe


MODEL: Run
Fields:
- id: String, primary key, uuid
- projectId: String (FK)
- recipeVersionId: String (optional FK)
- provider: RunProvider
- mode: RunMode
- paramsJson: Json
- status: RunStatus
- error: String (optional)
- createdAt: DateTime, default now
- updatedAt: DateTime, auto-updated
Relations:
- project: Project
- assets: Asset[]


ENUM: RunProvider
- OPENAI
- GEMINI

ENUM: RunMode
- GENERATE
- EDIT

ENUM: RunStatus
- PENDING
- RUNNING
- SUCCEEDED
- FAILED


MODEL: Asset
Fields:
- id: String, primary key, uuid
- runId: String (FK)
- kind: AssetKind
- mimeType: String
- byteSize: Int
- sha256: String
- storageUrl: String
- width: Int (optional)
- height: Int (optional)
- createdAt: DateTime, default now
Relations:
- run: Run


ENUM: AssetKind
- INPUT
- OUTPUT
- THUMB


MODEL: PinSet
Fields:
- id: String, primary key, uuid
- projectId: String, unique
- identityAssetId: String (optional)
- wardrobeNotes: String (optional)
- lightingNotes: String (optional)
- updatedAt: DateTime
Relations:
- project: Project


====================================================================
6. SHOT SPEC (CANONICAL STRUCTURE)
====================================================================

ShotSpec fields:

subject:
- description (required)
- expression (optional)
- pose (optional)
- wardrobe (optional)
- grooming (optional)

scene (optional):
- setting
- background
- timeOfDay
- weather
- props[]

lighting (optional):
- setup
- key
- fill
- rim
- modifiers[]
- mood

camera (optional):
- focalLength
- aperture
- framing
- perspective

style (optional):
- realism: photoreal | stylized | cinematic
- filmStock
- gradeNotes[]
- grain: none | subtle | heavy

constraints (optional):
- must[]
- avoid[]


====================================================================
7. PROMPT COMPILATION PIPELINE
====================================================================

Step 1: Normalize
- Trim whitespace
- Deduplicate phrases
- Canonicalize photographic language
- Lint warnings only (non-blocking)

Step 2: Assemble (provider-agnostic order)
1. Subject
2. Pose / expression / wardrobe
3. Scene
4. Lighting
5. Camera
6. Style / film / color
7. Constraints

Step 3: Provider Adaptation
- compileOpenAI(spec, pins)
- compileGemini(spec, pins)

Pins must inject:
- Identity preservation instruction
- Wardrobe and lighting constraints


====================================================================
8. PROVIDER INTERFACE
====================================================================

ImageProvider interface:

- id: openai | gemini
- generate(request)
- edit(request)

All provider outputs must normalize to binary buffers plus metadata.


====================================================================
9. API ENDPOINTS
====================================================================

Projects:
- POST /api/projects
- GET /api/projects/{id}

Recipes:
- POST /api/recipes
- PATCH /api/recipes/{id}
- POST /api/recipes/{id}/version

Runs:
- POST /api/runs
- GET /api/runs/{id}

Assets:
- POST /api/assets/upload
- GET /api/assets/{id}

Critique:
- POST /api/critique
Response:
- observations[]
- suggestedEdits[3]


====================================================================
10. UI REQUIREMENTS (MVP)
====================================================================

Workbench:
- Shot Spec editor
- Provider selector
- Generate, Edit, Critique actions
- Image grid with selection
- Identity pinning

Run Details:
- Compiled prompts
- Parameters
- Assets
- Re-run button


====================================================================
11. REPOSITORY STRUCTURE (TARGET)
====================================================================

src/
  lib/
    domain/
    server/
  routes/
prisma/
docker-compose.yml
.env.example


====================================================================
12. ACCEPTANCE CRITERIA
====================================================================

Phase 1 – Foundation
- Projects, Recipes, Runs persist
- Shot Spec validates
- Prompts compile deterministically

Phase 2 – Generation
- OpenAI generation works end-to-end
- Gemini generation works end-to-end
- Outputs stored and displayed

Phase 3 – Editing and Critique
- Image edits work
- Critique returns three suggestions
- Edit executes correctly

Phase 4 – Consistency
- Identity pin affects future runs
- Wardrobe and lighting pins persist

Phase 5 – Stability
- Reload preserves state
- Errors handled cleanly
- No API keys exposed to client


====================================================================
13. GUARDRAILS
====================================================================

- Provider logic must never exist in UI
- RecipeVersions are immutable
- Favor clarity over cleverness
- Optimize for portrait realism and consistency

END OF SPEC
