# Cleanup Report — Kanvas Whiteboard (Round 2)

Date: 2026-09-23 · Branch: `main` · Scope: full audit (files, imports, variables,
dependencies, media/assets, tooling). No features added, no redesign; UI, behavior and
routing are identical.

Verification: `npm test` 10/10 pass · `npm run build` succeeds (CSS bundle 177.06 kB,
JS 828.89 kB — chunk-size warning is pre-existing) · 22/22 headless feature checks pass
(landing, board draw/undo/redo/copy/paste/zoom/rename/export/autosave/dark-mode, docs,
404) · font check confirms only the two `Factor A @800` faces load and the headline
still renders in Factor A · og/twitter meta images, boot-splash logo, hero image and
doodles all return 200 · zero 404s and zero failed requests across routes.

This project was already cleaned once (see git history `245a405`). This pass audited
what remained, completed an in-progress follow-up cleanup that was sitting uncommitted
in the working tree, and verified everything end-to-end.

---

## 1. Files removed

| Path | Why it was safe to remove |
|---|---|
| `tests/_round2-check.mjs` | Throwaway puppeteer verification helper from the round-2 work; checks were run and captured below, then the file deleted. |
| `tests/_verify-round2.tmp.mjs` | Same as above (created and deleted during this pass). |
| `logs/cleanup-vite.log`, `logs/vite.pid` | Dev-server log/pid generated during this pass's verification; already git-ignored. |

No source file was deleted: every component, hook, context, lib module, page and asset
in `src/` and `public/` was reference-checked and is used (details in §4).

## 2. Completed in-progress round-2 changes (verified, not redesigned)

The working tree contained staged-but-uncommitted changes from a partial earlier pass.
They were audited, verified and are included in this commit:

1. **`site-logo.png` moved** `src/assets/images/` → `public/assets/`.
   - It was only referenced from `index.html` by absolute production URL
     (`https://board-app.vercel.app/src/...`), which is wrong for a `public/`-style
     meta asset and leaked a source-tree path into production metadata.
   - `index.html` `og:image` / `twitter:image` now point to `/assets/site-logo.png`
     (verified: fetches return 200, works from any deploy root).
   - The header/splash logo (`site-logo-removebg-preview.png`) is imported through
     Vite and stays in `src/assets/images/` — untouched.
2. **Three unused font weights removed** from `public/fonts/factor-a/`
   (`TRIALFactorA-Regular100`, `-Medium100`, `-Bold100`).
   - The app uses Factor A exclusively at weight 800 (`.ol-headline`,
     `.ol-type-focused`, `.ol-glyph-flexible`, the `.ol-wordmark` inline style).
     The four removed `@font-face` rules had no render path (everything on the
     landing page that sets Factor A also sets weight 800).
   - `LandingPage.css` `@font-face` block updated to keep only the Extrabold file;
     font check confirms `Factor A|800|loaded` and no requests to removed files.
   - License file `Befonts-License.txt` and the Extrabold OTF remain.
3. **`scripts/analyze-reference.mjs` removed.**
   - One-off PNG-palette analyzer for `docs/reference/reference-design.png`; outputs
     were already consumed during design work and are not reproducible artifacts of
     the app. The reference image itself is intentionally kept (§6).

## 3. Folder structure

The structure already matched a clean convention after the first pass, so no moves
were needed this time:

```
├── index.html            # single-page shell: meta/SEO, CSP, boot splash
├── src/
│   ├── App.jsx           # hash router: landing / board / docs / thankyou / waitlist / 404
│   ├── main.jsx          # entry; mounts ErrorBoundary + App + global styles
│   ├── assets/images/    # logo imported via Vite (header, splash, docs)
│   ├── components/       # one folder per UI concern (Canvas, Toolbar, StylePanel,
│   │                     #   ZoomControls, modals, public pages, ErrorBoundary, …)
│   ├── context/          # app state, undo/redo history (+ unit tests), theme
│   ├── hooks/            # keyboard shortcuts, page-refresh, previous-board, image cache
│   ├── lib/              # pure helpers: geometry, io/export, storage, viewport,
│   │                     #   snapping, shortcuts, browser, images (+ unit tests)
│   └── styles/           # global.css, layout.css, design-system.css
├── public/               # verbatim static files: favicon, robots, sitemap,
│   ├── assets/           #   site-logo.png (og/twitter), hero icons + image, doodles
│   └── fonts/factor-a/   #   trial webfont (800 only) + license
├── tests/                # e2e/perf/repro scripts (puppeteer) + fixtures + pnglib
├── docs/                 # PRD, UX audits, reference design material
├── scripts/              # (empty after cleanup — placeholder for future tooling)
└── vite.config.js
```

## 4. Assets / dependencies audited and kept

Everything below was checked for references and is genuinely used:

- **All 13 `public/` files**: `favicon.png`, `robots.txt`, `sitemap.xml`,
  `assets/site-logo.png` (og/twitter meta), `assets/hero/{demo,menu}-icon.svg`,
  `assets/hero/hero-img1.jpg`, `assets/doodles/{hero-cta-arrow,hero-double-underline}.svg`
  (LandingPage), 2 font files (`@font-face` in `LandingPage.css`), license txt.
- **All runtime dependencies are imported**: `react`, `react-dom`, `konva`,
  `react-konva` (canvas), `lucide-react` (DocumentationPage + KanvasUIFragments icons).
- **All 53 `src/` files** are reachable from `main.jsx`; no orphan components,
  no duplicate/legacy modules, no unused imports or exports found. (A handful of
  exported constants such as `EXPORT_BACKGROUND`/`SHAPE_TYPES` are only used within
  their own module — kept as they are part of the module's public surface, not dead.)
- **`window.__app` / `__stage` / `__setView` / `__commit` hooks** in `CanvasStage.jsx`
  look like debug code but are the interface the e2e tests drive the app with — kept.

## 5. Issues found & fixed

- **`tests/_round2-check.mjs` hard-coded a personal Chrome path** and was a leftover
  from the interrupted pass; removed (its assertions were re-run and pass).
- **`package.json` `test` script omits `src/lib/...` duplicates**: none found — all
  three test files (`historyState`, `eventListeners`, `userMessages`) are listed and
  pass. (Previous report's fix is still in place.)
- **Pre-existing, not changed**: `puppeteer`/`puppeteer-core`/`zod` remain "extraneous"
  (installed ad-hoc, not in `package.json`). The e2e scripts need them; adding them as
  devDependencies would be a dependency change outside cleanup scope. Noted for a
  future decision.
- **Pre-existing, not changed**: JS bundle is 828 kB (Konva is large) and Vite warns
  about it; also `canvas-empty-state` hint says "Press ? for shortcuts" while no `?`
  handler exists. Both are product decisions, not cleanup regressions.

## 6. Intentionally kept even though not currently used

| Item | Why it is kept |
|---|---|
| `docs/reference/` (reference-design.png, officely-layout-scaffold/) | Design reference material, deliberately preserved in round 1. |
| `tests/*.mjs` e2e/perf/repro scripts + `tests/fixtures/` | Only regression coverage for export/import, panning, image handling, perf; not wired into `npm test` because they need puppeteer. |
| `logs/`, `artifacts/`, `.tmp-shots/`, `dist/`, `node_modules/`, `.vercel/`, `excalidraw/` | Generated/local-only, git-ignored, harmless on disk. |
| `src/assets/images/site-logo-removebg-preview.png` | Used by header, splash screen, docs header (Vite import). |
| `scripts/` (now empty) | Conventional location for future project tooling; kept as a folder placeholder. |

## 7. Verification summary

| Check | Result |
|---|---|
| `npm test` (unit) | 10/10 pass |
| `npm run build` | succeeds; CSS 177.06 kB, JS 828.89 kB (warning pre-existing) |
| Headless smoke suite (`tests/smoke-after-cleanup.mjs`) | 22/22 pass, no page/console errors |
| Font audit (landing) | only `Factor A`/`Factor A Flexible` @800 + DM Sans load; no removed-font requests |
| Meta/boot-splash image URLs | all 200 |
| 404 / failed requests across routes | none |
