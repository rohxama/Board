# Cleanup Report — Kanvas Whiteboard (D:\Board)

Date: 2026-09-23 · Branch: `main` · Scope: dead code, unused assets, temp/debug files,
folder reorganization. No features added, no redesign; UI/behavior kept identical
(apart from restoring functionality that had regressed — see *Issues found & fixed*).

Verification: `npm test` 10/10 pass · `npm run build` succeeds · 32/32 headless
feature checks pass (incl. "Board actions menu opens with Undo/Redo/Import") ·
pixel-diff of all routes before/after shows 0 px differences on landing, thankyou,
waitlist, notfound and board (aside from the restored ⋯ button region) · docs pages
behaviorally verified with a scroll-reveal check.

---

## 1. Files removed

### Source (dead code / duplicate modules)
| Path | Why it was safe to remove |
|---|---|
| `src/components/Toolbar/DesignToolbar.jsx` | Duplicate of `Toolbar.jsx`; `App.jsx` now imports `Toolbar`. |
| `src/components/OfficelyLanding/OfficelyLanding.jsx` + `.css` | Old landing replaced by `LandingPage`; no longer routed. |
| `src/components/LandingPage/{Header,Hero,ProductShowcase,HowItWorks,UseCases,Benefits,Testimonials,Pricing,TrustStrip,FinalCTA,Footer}.jsx` | Previous-generation landing sections; not imported anywhere (current landing is a single-file page). |
| `src/components/LandingPage/LandingPageMvp.css` | Unreferenced stylesheet variant. |
| `src/lib/theme.js` | Unused; theme logic lives in `src/lib/themeColors.js` + `ThemeContext`. |
| Dead helpers in `src/lib/browser.js` | `hasTouchEvents`, `canUseCanvas`, `canUseClipboardWrite`, `writeTextToClipboard`, `isPrimaryModifier`, `readFileAsText` — no importers after `io.js` switched off `readFileAsText`. |
| `fitViewToContent` inside `ZoomControls.jsx` | Moved to `src/lib/viewport.js` (single home for viewport math); same code, same behavior. |
| `action()` helper in `Toolbar.jsx` | Defined but never called (dead code). |
| Unused `Chip` component in `LandingPage.jsx` | Never rendered. |
| Dead `useVisitorStatus` re-export | File renamed `src/hooks/useVisitorStatus.js` → `src/hooks/usePreviousBoard.js`; internal helper is no longer exported under the old name. |

### Debug / one-off scripts (`scripts/`)
`analyze.cjs`, `comps.cjs`, `dbg-drag{,2,3,4}.cjs`, `dbg-geom.cjs`, `dbg-probe{2,3,4}.cjs`,
`dots.cjs`, `map.cjs`, `map2.cjs`, `pix.cjs`, `probe.cjs`, `probe2.cjs`, `probe3.cjs`,
`shotcheck.cjs`, `smoke-tools.cjs`, `test-viewport.cjs`, `pnglib.cjs` — throwaway
probes from earlier debugging rounds; outputs already captured in `docs/`.

### Temp / debug files
- `tests/.import-test.json`, `tests/.inv1.json`, `tests/.inv2.json`, `tests/_extract.mjs`,
  `tests/debug-draw.cjs`, `tests/export-import.log` — artifacts of test runs.
- `docpage-head.tmp.css` (repo root), and all `tests/_*.mjs` verification helpers
  (`_feature-check`, `_capture-shots`, `_pixdiff`, `_audit-css`, `_audit-result.txt`,
  `_reveal-check`, `_header-geo`, `_debug1/2`) — created during this cleanup and deleted
  again before committing.
- `.audit-backup/` (`.bak` copies, `.ps1` patch scripts) and `.commandcode/` — backup and
  tooling leftovers that were tracked by accident.
- `dist/` build output and all of `node_modules/` — were tracked in git; now removed from
  the index and ignored (see §4).

### Dead CSS (~745+ lines net, built CSS 196.75 kB → 177.57 kB)
- `src/components/DocumentationPage/DocumentationPage.css`
- `src/components/LandingPage/LandingPage.css` (incl. `.ol-tape*`, `.ol-chip*`,
  `.ol-lower-chips`, `.ol-type-flexible` — all dead once the `Chip` component and its
  decorations went away)
- `src/styles/design-system.css` (all `.landing-page` / `.lp-*` rules, dropped classes
  from group selectors only after proving the class appears nowhere in source)
- `src/styles/layout.css`
Only class names that provably never appear in `src/`, `public/`, `index.html` or tests
were pruned; every route was then visually re-verified via screenshots.

## 2. Assets removed
- `public/fonts/factor-a/TRIALFactorA-Extrabold65-BF6476bc2feca7f.otf` — trial font file
  with no `@font-face` or reference anywhere.
- `public/assets/hero/slack-icon.svg` — referenced only by the removed `Chip` component.

## 3. Reorganization
| Before | After |
|---|---|
| `officely-layout-scaffold/` (repo root) | `docs/reference/officely-layout-scaffold/` |
| `public/assets/reference design.png` (shipped to production for no reason) | `docs/reference/reference-design.png` |
| `scripts/pnglib.cjs` (deleted) | helper now lives with its only consumer: `tests/pnglib.cjs`; `tests/export-import.mjs` import updated. |
| `Toolbar.jsx` (380+ lines, inline modal) | `SaveAsModal` extracted to `src/components/SaveAsModal/SaveAsModal.jsx` (pure code move, identical markup/logic). |

### Remaining folders and their responsibilities
- `src/` — application code: `components/` (Canvas, Toolbar, StylePanel, ZoomControls,
  modals, public pages: LandingPage, DocumentationPage, Waitlist/ThankYou/NotFound),
  `context/` (app state, history, theme), `hooks/`, `lib/` (geometry, io, storage,
  viewport, browser helpers), `styles/` (design-system + layout CSS),
  `assets/images/` (logo used by header + og/twitter meta).
- `public/` — static files copied verbatim: fonts (`fonts/factor-a/`), icons
  (`assets/hero/*-icon.svg`), favicon, robots/sitemap, og image.
- `tests/` — test suites run by `npm test` (`*.test.js` live next to source in `src/`)
  plus puppeteer e2e/perf scripts (`*-e2e.mjs`, `*-repro*.mjs`, `export-import.mjs`,
  `invalid-actions.mjs`, `redo-integrity.mjs`, `smoke-after-cleanup.mjs`) and
  `fixtures/` input diagrams.
- `scripts/` — maintained tooling only: `analyze-reference.mjs`.
- `docs/` — `PRD.md`, audit/review docs (`frontend-ux-audit.md`,
  `performance-reference-review.md`, `whiteboard-ux-audit.md`) and `docs/reference/`
  (reference design image + static scaffold).
- `.vercel/` — deploy config. `dist/`, `node_modules/`, `logs/`, `artifacts/`,
  `.tmp-shots/` — generated, git-ignored.

## 4. Intentionally kept (unused today, but useful later / required)
- **e2e & performance scripts + `tests/fixtures/`** — not part of `npm test`, but they
  are the only regression coverage for export/import, panning, dropdowns and perf;
  organized in `tests/`, kept.
- **`docs/reference/`** — reference design PNG and layout scaffold moved here instead of
  deleted, per decision to keep reference material.
- **`src/assets/images/site-logo*.png`** — logo is used in headers and as the
  `og:image` / `twitter:image` meta image.
- **Git-ignored generated dirs**: `logs/`, `artifacts/`, `.tmp-shots/` (screenshot
  comparisons), `dist/`, `node_modules/`, `node_modules/.vite/`, `.vercel`,
  `excalidraw/` — kept on disk, ignored by git (`.gitignore` updated and organized with
  section comments).
- **`package.json` test script extended** with `src/lib/userMessages.test.js` (test file
  exists and passes; was missing from the script).
- **All 5 runtime dependencies are used**: `konva`, `react-konva`, `react`,
  `react-dom`, `lucide-react`.

## 5. Issues found & fixed during cleanup
1. **"Board actions" menu was unopenable (pre-existing regression).** Git archaeology
   showed the overflow menu markup (`Undo`, `Redo`, `Import diagram`, quick exports,
   light/dark toggle) has had no trigger button since commits `8ea1422`/`9524d3a`, which
   stranded JSON import with no UI entry point. *Fix:* restored the `⋯` button
   (`.overflow-trigger`, title/aria "Board actions") inside `.overflow-menu-wrap` and
   restored its CSS in `layout.css` byte-identical to the original rule; removed the
   never-called `action()` helper. Verified by feature check and header geometry
   (trigger sits inside the 100 px toolbar, menu drops below it).
2. **Docs scroll-reveal breakage found and repaired while pruning.** The CSS prune had
   cut the base selector mid-token (`veal] {`) and removed `@keyframes docRevealUp`,
   leaving 12 rules referencing a missing animation — the showcase gallery stayed at
   `opacity: 0` forever. *Fix:* restored the `[data-reveal]` base rule, the
   `docRevealUp` keyframes and the section comment; removed genuinely dead keyframes
   (`docDraw`, `docPop`, `docPulse`, `docPulseBorder`); normalized stray indentation.
   Verified: braces balanced (681/681), no `veal]` fragments, group-selector bodies
   byte-match HEAD, and a behavioral reveal check passes (first section reveals on
   load, off-screen items stay pending, gallery items end at `opacity: 1`).
   *Note:* baseline screenshots captured mid-bug are not a valid reference for docs
   pages; the behavioral check + visual inspection are authoritative there.
3. **`tests/_pixdiff.mjs` bug (verification tooling, since deleted):** it hardcoded its
   two comparison directories and ignored CLI arguments, so earlier "pairwise" runs were
   all baseline-vs-after. Fixed and rerun; the real pairwise results are the ones cited
   at the top of this report.
4. **Broken import after moving helpers:** `tests/export-import.mjs` imported
   `../scripts/pnglib.cjs`; updated to `./pnglib.cjs` after the helper moved into
   `tests/`. `scripts/analyze-reference.mjs` path references updated likewise.
5. **Pre-existing oddity noted, not changed:** `node_modules` contains `puppeteer`,
   `puppeteer-core`, `zod` and other packages that are *not* in `package.json` (they
   were installed ad-hoc for the e2e scripts). With `node_modules/` now untracked and
   ignored, a fresh `npm install` will **not** include puppeteer — install it
   (`npm i -D puppeteer`) before running the e2e scripts. Left as-is to avoid changing
   dependencies during a cleanup pass.
6. **Tracked build output & dependencies:** `dist/` and all of `node_modules/` were
   committed previously (~4,700 files); removed from the index and covered by
   `.gitignore`.

## 6. Verification summary
- `npm test` → 10/10 pass.
- `npm run build` → succeeds; CSS bundle 196.75 kB → 177.57 kB (chunk-size warning is
  pre-existing).
- Headless feature suite → 32/32 pass, no page/console errors, including the restored
  Board actions menu.
- Screenshot pixel-diff across `/`, `/board`, `/docs`, `/thank-you`, `/waitlist`,
  `/nope` (desktop + mobile, light + dark): 0 px delta everywhere except (a) the board
  header region where the restored `⋯` button now sits, and (b) docs mobile, where
  scroll-reveal timing makes captures nondeterministic — confirmed by re-capturing the
  same build twice (that run also differs), i.e. not caused by this cleanup.
