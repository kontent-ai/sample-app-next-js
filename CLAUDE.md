## What this project is

A Next.js (App Router) sample app on top of Kontent.ai. It renders the "Ficto" healthcare brand sites as an integration reference: Delivery SDK, Draft Mode preview, Smart Link in-context editing, and multi-environment preview via Auth0.

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/` — your training data is outdated. This repo is on Next 16.

## Tooling

- **npm only** — `npm ci` / `npm install`, never yarn or pnpm.
- `.npmrc` enforces `min-release-age=3` (a 3-day supply-chain cooldown). To install a package version newer than that on purpose, pass a one-off `--min-release-age=0` on that single command — npm has no per-package allowlist.
- After changing code: `npm run biome:fix` (format + safe fixes), then `npm run lint` (ESLint catches what Biome doesn't). Both must pass. `npm run typecheck` for types.
- ESLint is pinned to **v9** — `@kontent-ai/eslint-config` depends on `eslint-plugin-react`, which has no ESLint 10-compatible release. Do not bump eslint to 10.
- `npm run dev`; `npm run dev:https` when a flow needs HTTPS (preview iframe, session cookies).
- `npm run generateModels` regenerates `models/` from the content model; prefer regenerating to hand-editing.
- `npm run build` needs real Kontent credentials in `.env.local` — static generation fetches content, and `lib/utils/env.ts` throws if env vars are missing. CI runs lint + test only.

## Architecture

### Single route tree, environment in the URL

All pages live under `app/[envId]/`. The `[envId]` segment is **not** typed by the user — `proxy.ts` rewrites every incoming request to `/<envId>/...`, taking the env id from the `envId` cookie (defaulting to `NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID`).

To switch environments, put the environment-id GUID as the first path segment (`/<guid>/articles`). `handleExplicitProjectRoute` in `proxy.ts` detects it, stores it in the `envId` cookie, clears the preview key, and redirects to the clean URL. `proxy.ts` also normalizes article listing/pagination routes.

### Auth & multi-environment preview

- The **default** environment uses `KONTENT_PREVIEW_API_KEY` from `.env.local`, injected by `proxy.ts`.
- Any **other** environment needs its own preview key: `app/getPreviewApiKey` → Auth0 login (`auth0-js` WebAuth, `webAuth` in `lib/constants/auth.ts`) → `app/callback` exchanges the access token via Kontent's internal admin API for that environment's preview key, stored in a cookie.

### Draft Mode & Smart Link

- Preview = Next.js Draft Mode. Enable via `/api/preview?secret=mySuperSecret&type=<codename>&slug=<slug>`; disable via `/api/exit-preview`. Pages read it with `draftMode()`.
- `draft.isEnabled` flows into `lib/kontentClient.ts` as `usePreview` to switch between published and preview content.
- Smart Link (in-context editing): `useSmartLink` / `SmartlinkInitializer` initialize the SDK; `useLivePreview` subscribes to live content updates; `createElementSmartLink` / `createItemSmartLink` (`lib/utils/smartLinkUtils.ts`) add the editing data-attributes.

### Data & content

- `lib/kontentClient.ts` — all Delivery SDK access (`getHomepage`, `getArticleBySlug`, `getProductsForListing`, …). `getDeliveryClient` builds the client per env id + preview key.
- `lib/routing.ts` — `resolveUrlPath` maps a content item to a URL path; `resolveReference` resolves linked-item references.
- Collections are brands: `ficto_healthtech` / `ficto_imaging` / `ficto_surgical`. `NEXT_PUBLIC_KONTENT_COLLECTION_CODENAME` (`siteCodename`) selects which brand renders; Delivery queries filter by it.
- Rich text: `transformToPortableText` (`@kontent-ai/rich-text-resolver`) + `PortableText` (`@kontent-ai/rich-text-resolver-react`); resolvers in `components/shared/richText/RichTextElement.tsx`.

### Conventions

- No `src/` — top-level `app/`, `components/`, `lib/`, `models/`, `scripts/`, `styles/`, `tests/`.
- Relative imports include the file extension (`.ts` / `.tsx`) — Biome's `useImportExtensions` enforces it. No path alias.
- `components/` = UI, `lib/` = non-UI logic, `models/` = generated content types (don't hand-edit).
- No barrel files except a deliberate public API.

## Code style

Match surrounding files. Core rules:

- **Functional style over OOP** — pure functions, composition, immutable data; not classes.
- **`const` over `let`** unless reassignment is genuinely required.
- **Boolean names start with `is`/`has`/`can`/`should`/`was`** (e.g. `isPreviewEnabled`).
- **No `return` on the same line as a condition** — use a block.
- **Comments only when they add non-obvious value** — explain *why*, not *what*.
- No emojis in code, comments, or docs.
- Props types are `Readonly<{ ... }>`.
