# CLAUDE.md

Pilot: one Expo Router app (SDK 58) rendering the same Tamagui UI on web, iOS and Android. It exists to compare against the Next.js + Solito + Tamagui reference app (`~/Documents/vsCodeProjects/posts-app`, read-only). Results are in `docs/pilot-report.md`. Not production code.

## Commands

- `npm run web` / `npm start` / `npm run ios` / `npm run android`: run `tamagui generate-css` first, then `expo start`. The first step is required: `app/_layout.tsx` imports the generated `tamagui.generated.css` (gitignored).
- `npm run build:web`: `expo export --platform web` into `dist/` (server output: `dist/client` + `dist/server`).
- `npm run serve:web`: `expo serve` runs the exported server (default port 8081; use `--port`).
- `npm run typecheck`, `npm run lint` (`biome check .`), `npm run format`.
- `npm test`: Vitest unit tests (`tests/`). `npm run test:e2e`: Playwright against the production build (`e2e/`), which builds and serves on port 3100 unless one is already running there.
- `scripts/check-html.sh [base-url]`: curls every route and prints status, `<title>`, meta description and whether the content is in the raw HTML.
- Install with `npx expo install <pkg>` so versions match the SDK. Package manager is npm.

## Architecture

- Routes live in `app/` (Expo Router only; no Solito, no second router). Shared code is outside it: `features/<feature>/` (screens, `api.ts`), `components/` (header, theme), `features/shared/`.
- Screens (`features/*/…-screen.tsx`) are presentational and take data as props. Route files own data: each exports `loader` (via `createStaticLoader` from `expo-server`), `generateMetadata`, `ErrorBoundary`, and a default component that reads `useLoaderData`.
- `features/*/api.ts` run only inside loaders and `generateMetadata`, so they run on the Expo server on web and on the dev/production Expo server for native. The client bundle contains no API URL (verified by grep of `dist/client`).
- Web has a custom header (`components/site-header.tsx`, rendered only when `Platform.OS === 'web'`). Native uses the Stack header. `/user/[id]` is `presentation: 'modal'` on native and `'card'` on web (set in `app/_layout.tsx`).
- UI is Tamagui 3 with `@tamagui/config/v5`. Icons are generated into `components/icons` with `npx @tamagui/cli icons add <Name>` (v3 ships no icon package).

## Non-obvious decisions and gotchas

- **`web.output` is `"server"`**, not `"static"`: a missing post or product must return a real HTTP 404, and the pages are request-time data. Static output would need `generateStaticParams` for every id and cannot 404 an unknown id on a static host. Cost: needs a Node/edge server in production.
- **Missing item → HTTP 404 via `StatusError`**, thrown by `orNotFound()` in the loader. Production returns status 404 with a `text/plain` body, not the styled page. In `expo start` dev the same route returns 500.
- **`generateMetadata` runs separately from `loader`**, so each detail page fetches the upstream API twice per request.
- **Env vars** `API_BASE_URL` and `PRODUCTS_API_BASE_URL` are read at request time on the server (no `EXPO_PUBLIC_` prefix, so never inlined). See `.env.example`.
- **No `metro.config.js`.** `withTamagui` from `@tamagui/cli/metro` made `expo start --web` fail for every route after the first ("Requiring unknown module"); the production export worked with it. See the report. Do not re-add it without retesting dev.
- **`SuspenseFallback` in `app/_layout.tsx` must not use Tamagui.** Expo Router renders it outside the root layout's component tree, so there is no `TamaguiProvider` and SSR crashed on a Tamagui `Spinner`.
- **Tamagui 3 syntax differs from v2** (the reference): bare tokens (`gap="3"`, `color="blue10"`), string clauses for media and state (`width="50% sm:33% lg:25%"`, `backgroundColor="x hover:y press:z"`), `render="a"` instead of `tag="a"`, Button `size="lg"`. The config is v5 (not the guide's v6) to keep the reference's token names.
- Links wrapping a Tamagui view use `<Link asChild>` with `render="a"` on the child so web gets a real `<a href>`.
- Native loaders call the Expo server (dev server in development). A production native build needs the server deployed and reachable.
- Biome mirrors the reference: single quotes, no semicolons, width 100, `useImportType` and `noConsoleLog` are errors, `noExplicitAny` is an error here (the reference has it off).
- Do not deploy or push anywhere without asking the owner.
