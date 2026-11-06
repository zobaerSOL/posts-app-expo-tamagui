# Pilot report: Expo Router everywhere (Option B) vs Next.js + Solito + Tamagui

Date: 2026-11-06. One machine (Apple Silicon Mac, Node v26.0.0 arm64, npm 12). Every number below was measured in this session unless it says otherwise. Single runs are marked as such.

Stack of the pilot: Expo SDK **58.0.23** (latest `expo` dist-tag at the time), `expo-router` 58.0.30, React Native 0.88.1, React 19.3.0, Tamagui **3.2.3** (latest). Reference: Expo 54, RN 0.81.5, Next 16.1.1, Tamagui 2.0.0-rc.16, Solito 5. The Tamagui major differs between the two apps, so some differences below come from Tamagui, not from the framework choice.

## Summary

- All requested routes work on web (dev and production) and on the iOS simulator (iPhone 15 Pro, iOS 17.4, Expo Go), including `/user/[id]` as a modal on native and a normal page on web.
- With `web.output: "server"`, `/posts/[id]` and `/products/[id]` return real HTML with the content, per-page `<title>` and meta description, and a real HTTP 404 for a missing item. Verified with `curl` against the production export.
- Android was **not run** (you told me to skip it).
- Biggest costs found: a production Node/edge server is required, the client JS is about 2.3x the reference's (697 KB vs 302 KB compressed), the 404 for a missing item is a plain-text body, and Tamagui's Metro plugin breaks dev SSR (cause not found).

## What was verified

| Check | Result |
| --- | --- |
| Web dev server, every route (`curl`, `scripts/check-html.sh`) | `/`, `/posts`, `/posts/1`, `/products`, `/products/1`, `/user/3` return 200 with content; `/nope` returns 404; `/posts/9999` and `/products/9999` return **500** in dev |
| Production export + `expo serve`, every route | Same, but `/posts/9999` and `/products/9999` return **404** |
| Raw HTML contains the post and product title | Yes for `/posts/1` and `/products/1` (see Web SEO) |
| Playwright (`npm run test:e2e`, fresh production build) | 11 passed: 2 smoke specs for `/posts` and `/posts/1`, 404 checks, and every route loading with no page errors or console errors |
| Vitest (`npm test`) | 5 passed (`getJson`, `orNotFound`) |
| `tsc --noEmit` (strict, `noUncheckedIndexedAccess`) | Exit 0 |
| `biome check .` | Clean after adding generated `expo-env.d.ts` to the ignore list |
| `expo-doctor` | 20/20 checks passed |
| iOS simulator | `/`, `/posts`, `/posts/1`, `/products`, `/products/1`, `/user/3` seen in screenshots; `/user/3` renders as a sheet modal. `/posts/9999` and `/products/9999` only showed the dev LogBox ("Failed to load loader data for route"); I could not dismiss it, so I did not see my `ErrorBoundary` UI on native |
| Android | **Not run** |
| Web: client-side navigation to a missing item (ErrorBoundary in the browser) | **Not tested**: the app has no link to a missing item and a `pushState` hack did not trigger the router, so I removed that test |

Cold-start deep links in Expo Go only open the project home, so route screenshots were taken with the app already running.

## Web rendering decision (`web.output`)

Chosen: **`"server"`**. Based on [server rendering](https://docs.expo.dev/router/web/server-rendering/), [static rendering](https://docs.expo.dev/router/web/static-rendering/) and [data loaders](https://docs.expo.dev/router/web/data-loaders/) (all stable in SDK 58).

Reasons:
1. A missing post or product must return a real 404. Static output only emits HTML for ids returned by `generateStaticParams`; an unknown id would hit the host's 404 handling, and every id (100 posts, 194 products) would be baked at build time. Server output renders per request and a loader can throw `StatusError(404)`.
2. The reference app is `force-dynamic` (request-time data). Server output is the like-for-like mode.
3. Per-request `generateMetadata` and loaders can read request-time env vars.

Cost: a runtime server is required (Expo Hosting, Node/Express, Cloudflare, Vercel, Netlify or Bun adapters). Static and server output cannot be mixed in one project ([docs](https://docs.expo.dev/router/web/server-rendering/#common-questions)). I did **not** build a static variant, so the static-vs-server comparison is from the docs only.

Not used: React Server Components (experimental per [the guide](https://docs.expo.dev/guides/server-components/)), API routes (not needed; loaders cover server fetching).

## Web SEO

Production export, `expo serve`, raw `curl` output (`scripts/check-html.sh`):

| Route | Status | `<title>` | Content in raw HTML |
| --- | --- | --- | --- |
| `/` | 200 | `ShopHub: Expo Router pilot` | yes |
| `/posts` | 200 | `Posts \| ShopHub` | yes |
| `/posts/1` | 200 | `sunt aut facere repellat provident occaecati excepturi optio reprehenderit \| ShopHub` | yes |
| `/posts/9999` | **404** | none | `text/plain` body `post 9999 not found` |
| `/products` | 200 | `All products \| ShopHub` | yes |
| `/products/1` | 200 | `Essence Mascara Lash Princess \| ShopHub` (+ Open Graph title and image) | yes |
| `/products/9999` | **404** | none | `text/plain` body |
| `/user/3` | 200 | `User 3 \| ShopHub` | yes |
| `/nope` | 404 | `Page not found` | styled `+not-found` page, `robots: noindex` |

Meta description on `/posts/1` is the first 160 characters of the post body. Tags come from `generateMetadata` (resolved before the HTML stream, per the [docs](https://docs.expo.dev/router/web/server-rendering/#metadata)), not from `<Head>`.

Reference (clone, `next start`, same `curl`): status codes match (200, and 404 for missing items and `/nope`, with a rendered page), the title and content are in the HTML, but **every route has the same title and description** (`Tamagui • App Router`) because the reference sets only a root `metadata`. That is a gap in the reference app, not a Next limitation.

Lighthouse SEO category: 100 on `/posts` and `/posts/1` for both apps.

404 limitations in Expo:
- A loader that throws `StatusError(404)` yields a correct status but a **plain-text body**, not a rendered page. I found no documented way to render the `+not-found` UI with a 404 from a dynamic route. The data-loader docs do not describe 404s at all; I took `StatusError` from the [API routes docs](https://docs.expo.dev/router/web/api-routes/#error-handling) and confirmed the behavior by running it.
- In `expo start` (dev) the same route returns **500**, so the dev server does not match production here.

API base URL: kept out of the browser. `grep -rl "jsonplaceholder\|dummyjson" dist/client` finds nothing; the URLs appear only under `dist/server`. The override works at request time: starting `expo serve` with `API_BASE_URL=http://localhost:4000` (a stub) made the same exported build render the stub's title; without it, the default API's title.

Data loaders are stable in SDK 58, so I used them (no client-side-fetch fallback on web). On native, loaders are fetched from the Expo server ([docs](https://docs.expo.dev/router/web/data-loaders/#native-apps)), which means a production native build needs the server deployed. The reference's native app fetches the APIs directly.

## Shared code

Counted: non-blank, non-comment lines in `.ts/.tsx/.js` UI and feature code (pilot: `app/`, `features/`, `components/`, excluding generated icons; reference: `apps/next/app`, `apps/next/shims`, `apps/expo/app`, `packages/app`, `packages/ui/src`, `packages/config/src`, excluding tests). Script: scratchpad `loc.py`.

| Measure | Pilot | Reference |
| --- | --- | --- |
| Total lines counted | 807 | 1,290 |
| Shared by file (no `.web`/`.native` suffix, not under `apps/*`) | **100%** (807 / 807) | **81.4%** (1,050 / 1,290) |
| Shared by runtime use* | **92.9%** (750 / 807) | **55.9%** (721 / 1,290) |
| Reference without the category sidebar (`site-shell.tsx`, 192 lines, not in the pilot) | n/a | 65.7% (721 / 1,098) |

\* "By runtime use" also treats as platform-specific the files used on one platform: pilot `+html.tsx` and `site-header.tsx` (web only); reference `features/*/native.tsx`, `shared/async.tsx` (native), `site-shell.tsx` and `NextTamaguiProvider.tsx` (web). This classification is my judgment.

Inline `Platform.OS` branches: pilot 2 files (`_layout.tsx` header and modal presentation, `home/screen.tsx` quick links); reference 1 file.

Scope differences that favor the pilot: no category sidebar, no custom fonts, no animations driver, no toast components. The reference's routing duplication (two route trees, native fetch wrappers) accounts for most of the gap.

## Web performance

Lighthouse 13.6.0 (CLI), mobile preset with simulated throttling, headless Chrome, production builds on localhost, 3 runs per page, median shown. Lighthouse lab runs do not report **INP**; Total Blocking Time is shown as the nearest lab proxy.

`expo serve` sent JS and HTML **uncompressed** (no `content-encoding`), while `next start` gzips. I re-ran the pilot behind a small gzip proxy to emulate a compressing host or CDN; the first table is the like-for-like one.

| App | Page | Perf score | FCP | LCP | TBT | CLS | JS transferred | Total transferred |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pilot (gzip proxy) | `/posts` | 93 | 935 ms | 935 ms | 301 ms | 0 | 697 KB | 803 KB |
| Pilot (gzip proxy) | `/posts/1` | 94 | 930 ms | 930 ms | 292 ms | 0 | 697 KB | 800 KB |
| Reference | `/posts` | 87 | 1,057 ms | 4,060 ms | 85 ms | 0 | 302 KB | 620 KB |
| Reference | `/posts/1` | 86 | 1,058 ms | 4,061 ms | 126 ms | 0 | 306 KB | 611 KB |
| Pilot, as served by `expo serve` | `/posts` | 65 | 4,382 ms | 4,382 ms | 320 ms | 0 | 2,701 KB | 4,123 KB |
| Pilot, as served by `expo serve` | `/posts/1` | 69 | 4,230 ms | 4,230 ms | 291 ms | 0 | 2,701 KB | 4,104 KB |

Reading it: the pilot paints earlier here, but ships about 2.3x the compressed JS and has about 3x the blocking time. I did not investigate why the reference's LCP is about 4.06 s while its FCP is 1.06 s. Both apps inline roughly 600-750 KB of Tamagui theme CSS into every HTML response (pilot 732-751 KB, gzip about 50 KB; reference 597-643 KB, gzip about 40-46 KB). The pilot has no Tamagui compile step; the reference's production build uses Tamagui's webpack style extraction.

Client bundle (pilot, raw/gzip): entry 1,090/288 KB, common chunk 1,362/347 KB, root layout 240/55 KB.

## Build and dev time

Single runs, same machine and Node. Reference measured on a copy in the scratchpad so the original was not touched.

| Measure | Pilot | Reference |
| --- | --- | --- |
| Cold dev start to first full page of `/posts/1` | 10.6 s (`expo start --web -c`, caches removed; excludes the `tamagui generate-css` step, which I did not time separately) | 9.9 s (`next dev`, Turbopack, `.next` removed; excludes the workspace `yarn build` that `yarn web` runs first) |
| First hit of `/products/1` afterwards | 1.3 s | 2.0 s |
| Production build, cold | 23.4 s (`npm run build:web`, includes `generate-css`) | 21.3 s (`yarn workspace next-app build`: builds workspace packages, then `next build --webpack` with Tamagui extraction) |
| Production build, no changes | 4.9 s | 13.0 s |
| Production build after a one-line change | 4.3 s | 12.9 s |

The one-line change was a heading string in the posts list screen (reverted afterwards).

## Config and glue

| Item | Pilot | Reference |
| --- | --- | --- |
| Bundler/framework config files | 0 (`app.json` only; no `metro.config.js`, `babel.config.js` or `next.config.js`) | 3: `next.config.js` (72 lines), `metro.config.js` (29), `babel.config.js` (38) |
| Tamagui config files | 2 (`tamagui.config.ts`, `tamagui.build.ts`) | `packages/config` (5 files) plus `apps/next/.tamagui` |
| `tsconfig` files | 1 | 6 |
| `package.json` files | 1 | 6 (root + 5 workspaces) |
| Shims | 0 | 1 (`react-native-safe-area-context`) plus 3 `.web` provider files |
| Aliases | 0 | 7 (3 Turbopack, 2 webpack, 2 Babel `module-resolver`) plus `resolveExtensions` |
| `transpilePackages` entries | 0 | 8 |
| Patches | 0 | 2 (`solito`, `@tamagui/portal`) |
| Dependency `resolutions` | 0 | 10 |
| Type-error gate | `tsc` | `typescript.ignoreBuildErrors: true` |
| Extra build steps | `tamagui generate-css` before dev and build | `yarn build` of workspace packages, two bundlers (Turbopack dev, webpack prod) |
| Other glue | `global.d.ts` (`declare module '*.css'`), 5 generated icon files | `scripts/fix-xcode-env.mjs`, `.yarnrc.yml`, `turbo.json` (unused), `vercel.json`, `apps/next/.env` |

Test and lint configs (`biome.json`, `vitest.config.ts`, `playwright.config.ts`) exist in both and are not counted above.

## Gaps and workarounds

| # | What happened | Workaround | Link |
| --- | --- | --- | --- |
| 1 | The Tamagui Expo guide imports `../tamagui.generated.css`, but nothing generates it. Dev failed with `Unable to resolve "../tamagui.generated.css"`. `withTamagui` did not create it. | Run `tamagui generate-css` before dev and build (`npm run css`, chained in the scripts). The file is about 700 KB and gitignored. | [Expo guide](https://tamagui.dev/docs/guides/expo), [Metro guide](https://tamagui.dev/docs/guides/metro) |
| 2 | `withTamagui` from `@tamagui/cli/metro` (3.2.3), as in the guide, breaks `expo start --web` after the first route: other routes return 500 with `Requiring unknown module "53"`. With the plugin removed, all routes render. The production export **works** with the plugin. **Cause not found**: I isolated it by toggling the plugin only and read its source, but did not trace the module-id mismatch. | No `metro.config.js`. The Metro guide lists the no-plugin setup as valid. This loses the plugin's config watching; the compiler (`tamagui build`) was not evaluated. | [Metro guide](https://tamagui.dev/docs/guides/metro) |
| 3 | The guide uses `@tamagui/config/v6` (Tailwind-aligned). Tamagui 3 also changed the style API (bare tokens, string clauses for media and state, `render` instead of `tag`, Button `size="lg"`). The reference's v2 screens did not type-check as-is. | Used `@tamagui/config/v5` (the upgrade guide's recommended first step) and ported the screens. | [Upgrade to v3](https://tamagui.dev/docs/guides/how-to-upgrade) |
| 4 | Tamagui 3 has no icon package (`@tamagui/lucide-icons` is 2.0.0-rc and depends on `@tamagui/core` 2.x). | Generated the 5 icons used with the CLI into `components/icons`. | [Icons](https://tamagui.dev/ui/lucide-icons) |
| 5 | `SuspenseFallback` exported from the root layout renders outside the layout's tree. A Tamagui `Spinner` there crashed SSR with "Can't find Tamagui configuration", and the page fell back to client rendering with an empty body. | Fallback uses React Native `ActivityIndicator` only. | [Loading states](https://docs.expo.dev/router/error-handling/) |
| 6 | A loader's `StatusError(404)` gives a status 404 with a plain-text body in production and 500 in dev (see Web SEO). | None; documented. | [Data loaders](https://docs.expo.dev/router/web/data-loaders/), [API routes](https://docs.expo.dev/router/web/api-routes/#error-handling) |
| 7 | `generateMetadata` cannot see loader data, so each detail page calls the upstream API twice per request. | Accepted for the pilot. A per-request cache would be needed in a real app. | [Metadata](https://docs.expo.dev/router/web/server-rendering/#metadata) |
| 8 | Native loaders run on the server, so a production native build depends on a deployed server. | None; architectural difference from the reference. | [Native apps](https://docs.expo.dev/router/web/data-loaders/#native-apps) |
| 9 | `expo serve` does not compress responses (observed: no `content-encoding`). Lighthouse performance was 65-69 until a gzip proxy was put in front. | Measured both ways. A real host or CDN would normally compress. | [Server rendering](https://docs.expo.dev/router/web/server-rendering/) |
| 10 | Dev log shows once: "Tamagui: Using global config fallback. This may indicate duplicate tamagui instances". Rendering still works. It does not appear in the production export or `expo serve` logs. | None. | n/a |
| 11 | Each exported loader bundle under `dist/server/_expo/loaders` is about 2.4 MB. | None; server-side only. | n/a |
| 12 | `npm run ios` / `expo start --ios` timed out on the first `simctl openurl` while the simulator warmed up; a retry worked. | Retry. | n/a |
| 13 | The template added `AGENTS.md` and `.claude/settings.json`, and `create-expo-app` ran `git init` with one local commit. No remote was added; nothing was pushed. | Left as is. | n/a |

No `any` was used to silence a type error. No dependency was added that the pilot does not use.

## Recommendation

Option B is good enough for a content-heavy web app of this shape: server-rendered catalog and blog pages where each page needs its own metadata and a correct 404 status. In production export, everything the brief asked for worked: content in the raw HTML, per-page title and description, real 404 status, API URLs kept out of the browser bundle, and loaders without client-side fetch on web. Shared code is much higher (93-100% vs 56-81% depending on how it is counted), glue is much lower (no aliases, shims or patches), and rebuilds were faster in my single runs.

Next.js is still the safer choice if you need any of the following, none of which I tested in Expo:
- Incremental regeneration, per-route static/dynamic mixing (Expo does not support mixing output modes), or tag-based cache invalidation. Expo's loaders only offer `Cache-Control` headers.
- A styled body on a 404 returned from a dynamic route (Expo gives plain text, and the dev server returns 500).
- A lighter client: the pilot ships about 2.3x the compressed JS and has about 3x the TBT.
- A proven dev loop with Tamagui's Metro plugin and compiler (gap 2), or Next's image optimization and edge ecosystem.

Things to weigh before choosing B that this pilot cannot settle: native loaders require the server in production; SDK 58 is the first release where server rendering is stable; the Tamagui 3 API break affects any migration from the reference; Android, INP, real devices, load testing and the Tamagui compiler were not evaluated.

If SEO and rendering control are the main goals and the team wants one codebase, B is viable and cheaper to maintain. If the roadmap includes ISR-style caching or hybrid static pages, plan on Next for web.
