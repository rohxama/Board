# Cleanup Report — Kanvas Whiteboard (D:\Board)

Date: 2026-09-23 · Branch: `main` · Two passes ("round 1" and "round 2", both below).
Scope: remove genuinely unused files/assets/dead code, tidy structure, keep
UI/features/behavior identical. No features added, no redesign.

Verification (final state): `npm test` 10/10 · `npm run build` succeeds (CSS 177.06 kB,
JS 828.89 kB — chunk-size warning pre-existing) · `tests/smoke-after-cleanup.mjs` 22/22
(headless: landing, board draw/undo/redo/copy/paste/zoom/rename/export/autosave,
dark mode, docs, 404; zero page/console errors) · font audit: only `Factor A|800` and
`Factor A Flexible|800` load, headline renders in Factor A · zero 404s / failed requests
across routes.

Every deletion in this report was reference-checked first (literal grep, dynamic-pattern
awareness, import sweep, git history). Commit history: round 1 = `245a405`, round 2 =
`5ebb463` (+ report revision `5ad4fe2`).

---

## 1. Files removed

### Round 1 — source (dead code / duplicate modules)
| Path | Why it was safe to remove |
|---|---|
| `src/components/Toolbar/DesignToolbar.jsx` | Duplicate of `Toolbar.jsx`; `App.jsx` imports `Toolbar`. |
| `src/components/OfficelyLanding/OfficelyLanding.jsx` + `.css` | Old landing replaced by `LandingPage`; no longer routed. |
| `src/components/LandingPage/{Header,Hero,ProductShowcase,HowItWorks,UseCases,Benefits,Testimonials,Pricing,TrustStrip,FinalCTA,Footer}.jsx` | Previous-generation landing sections; not imported anywhere. |
| `src/components/LandingPage/LandingPageMvp.css` | Unreferenced stylesheet variant. |
| `src/lib/theme.js` | Unused; theme logic lives in `themeColors.js` + `ThemeContext`. |
| Dead helpers in `src/lib/browser.js` | `hasTouchEvents`, `canUseCanvas`, `canUseClipboardWrite`, `writeTextToClipboard`, `isPrimaryModifier`, `readFileAsText` — no importers. |
| `fitViewToContent` in `ZoomControls.jsx` | Moved to `src/lib/viewport.js` (single home for viewport math); same code. |
| `action()` helper in `Toolbar.jsx` | Defined but never called. |
| Unused `Chip` in `LandingPage.jsx` | Never rendered. |
| `useVisitorStatus` re-export | File renamed to `src/hooks/usePreviousBoard.js`. |

### Round 1 — debug scripts, temp files, tracked build output
- `scripts/`: `analyze.cjs`, `comps.cjs`, `dbg-drag{,2,3,4}.cjs`, `dbg-geom.cjs`,
  `dbg-probe{2,3,4}.cjs`, `dots.cjs`, `map.cjs`, `map2.cjs`, `pix.cjs`, `probe.cjs`,
  `probe2.cjs`, `probe3.cjs`, `shotcheck.cjs`, `smoke-tools.cjs`, `test-viewport.cjs`,
  `pnglib.cjs` (moved to `tests/`, see §3).
- Temp/test artifacts: `tests/.import-test.json`, `tests/.inv1.json`, `tests/.inv2.json`,
  `tests/_extract.mjs`, `tests/debug-draw.cjs`, `tests/export-import.log`, root
  `docpage-head.tmp.css`, and all `tests/_*.mjs` verification helpers created during the
  work (`_feature-check`, `_capture-shots`, `_pixdiff`, `_audit-css`, `_audit-result.txt`,
  `_reveal-check`, `_header-geo`, `_debug1`, `_debug2`).
- `.audit-backup/` (`.bak` + `.ps1` scripts) and `.commandcode/` — accidental tool/backup
  leftovers that were tracked.
- `dist/` and all of `node_modules/` untracked (~4,700 files were committed) and covered
  by `.gitignore`.
- Dead CSS ~745+ lines across `DocumentationPage.css`, `LandingPage.css`,
  `design-system.css`, `layout.css` (only class names that never appear in source;
  built CSS 196.75 kB → 177.57 kB).

### Round 2 — unused files/media
| Path | Why it was safe to remove |
|---|---|
| `public/fonts/factor-a/TRIALFactorA-{Regular100,Medium100,Bold100}-*.otf` (+ their 3 `@font-face` rules in `LandingPage.css`) | "Factor A" is only ever used at weight **800** (headline `font:800`, `.ol-type-focused`, wordmark inline `font-weight:800`) — the 400/500/700 faces were never fetched or rendered (~382 KB). Kept: `Extrabold100` + `Befonts-License.txt`. |
| `scripts/analyze-reference.mjs` | One-off PNG palette/ASCII analyzer for `docs/reference/reference-design.png`; zero references, output not cited anywhere. With it gone, the `scripts/` folder no longer exists. |
| `tests/_round2-check.mjs`, `tests/_verify-round2.tmp.mjs` | Throwaway round-2 verification helpers; checks run and captured below, then deleted. |
| `logs/cleanup-vite.log`, `logs/vite.pid` | Dev-server log/pid from verification; already git-ignored. |

## 2. Assets removed
- `public/assets/hero/slack-icon.svg` — referenced only by the removed `Chip` component.
- `public/fonts/factor-a/TRIALFactorA-Extrabold65-BF6476bc2feca7f.otf` — trial font file
  with no `@font-face` or reference anywhere.
- Three unused Factor-A weights (round 2, see §1).

## 3. Reorganization
| Before | After |
|---|---|
| `officely-layout-scaffold/` (repo root) | `docs/reference/officely-layout-scaffold/` |
| `public/assets/reference design.png` (shipped to production for no reason) | `docs/reference/reference-design.png` |
| `scripts/pnglib.cjs` | `tests/pnglib.cjs` (next to its only consumer); `tests/export-import.mjs` import updated |
| `SaveAsModal` inline in `Toolbar.jsx` | `src/components/SaveAsModal/SaveAsModal.jsx` (pure code move) |
| `src/hooks/useVisitorStatus.js` | `src/hooks/usePreviousBoard.js` (name matches its purpose) |
| `fitViewToContent` in `ZoomControls.jsx` | `src/lib/viewport.js` |
| `src/assets/images/site-logo.png` (round 2) | `public/assets/site-logo.png` + `index.html` `og:image`/`twitter:image` updated — the old URLs pointed at `/src/assets/…`, which Vite does **not** copy into `dist/`, so the social-preview image 404'd in production; from `public/` it ships with the build (static files are served ahead of Vercel's catch-all rewrite) |
| `scripts/` (round 2) | folder removed entirely after its last file went |

## 4. Remaining folders and their responsibilities

```
├── index.html            # single-page shell: meta/SEO, CSP, boot splash
├── src/
│   ├── App.jsx           # hash router: landing / board / docs / thankyou / waitlist / 404
│   ├── main.jsx          # entry; mounts ErrorBoundary + App + global styles
│   ├── assets/images/    # site-logo-removebg-preview.png (Vite-imported: headers, splash, docs)
│   ├── components/       # one folder per UI concern (Canvas, Toolbar, StylePanel,
│   │                     #   ZoomControls, modals, public pages, ErrorBoundary, …)
│   ├── context/          # app state, undo/redo history (+ unit tests), theme
│   ├── hooks/            # keyboard shortcuts, page-refresh, previous-board, image cache
│   ├── lib/              # pure helpers: geometry, io/export, storage, viewport,
│   │                     #   snapping, shortcuts, browser, images, themeColors (+ tests)
│   └── styles/           # global.css, layout.css, design-system.css
├── public/               # 11 static files, verbatim: favicon, robots.txt, sitemap.xml,
│   ├── assets/           #   site-logo.png (og/twitter), hero icons + hero-img1, doodles
│   └── fonts/factor-a/   #   Factor A Extrabold 800 (trial) + license
├── tests/                # e2e/perf/repro puppeteer scripts + fixtures/ + pnglib.cjs
├── docs/                 # PRD.md, frontend-ux-audit.md, performance-reference-review.md,
│   └── reference/         #   whiteboard-ux-audit.md; reference/ = design PNG + scaffold
└── vite.config.js, package.json, package-lock.json, README.md, .gitignore, CLEANUP_REPORT.md
```
*(There is no `scripts/` folder any more — its last one-off file was removed in round 2;
git cannot track empty directories.)*

## 5. Assets / dependencies audited and kept

- **All 11 `public/` files**: `favicon.png`, `robots.txt`, `sitemap.xml`,
  `assets/site-logo.png` (og/twitter meta), `assets/hero/{demo,menu}-icon.svg`
  (used dynamically via `<Icon name="demo|menu">` → `/assets/hero/${name}-icon.svg`;
  a literal grep misses them), `assets/hero/hero-img1.jpg`,
  `assets/doodles/{hero-cta-arrow,hero-double-underline}.svg`, the Extrabold OTF
  (`@font-face`) and its license.
- **All runtime dependencies are imported**: `react`, `react-dom`, `konva`,
  `react-konva` (canvas), `lucide-react` (DocumentationPage + KanvasUIFragments icons).
- **All `src/` files are reachable from `main.jsx`** — import sweep found only the 3
  `*.test.js`, which `npm test` runs directly. A few module-level exports
  (`EXPORT_BACKGROUND`, `SHAPE_TYPES`, …) are used within their own module — part of the
  module's public surface, not dead.
- **`window.__app` / `__stage` / `__setView` / `__commit` hooks** in `CanvasStage.jsx`
  look like debug code but are the interface the e2e tests drive — kept.

## 6. Intentionally kept (unused today, but useful later / required)

| Item | Why it is kept |
|---|---|
| `tests/*.mjs` e2e/perf/repro scripts + `tests/fixtures/` (every fixture is used by a test) | Only regression coverage for export/import, panning, dropdowns, image handling, perf; not in `npm test` because they need puppeteer. |
| `docs/reference/` (reference-design.png, officely-layout-scaffold/) | Design reference material — kept per explicit decision, consolidated instead of deleted. |
| `docs/*.md` (PRD, audits) | Project knowledge; no inbound refs by design. |
| `src/assets/images/site-logo-removebg-preview.png` | Header, splash screen, docs header (Vite import). |
| `public/fonts/factor-a/Befonts-License.txt` | License accompanying the kept trial font. |
| `package.json` test script includes `src/lib/userMessages.test.js` | Test file exists and passes; it was missing from the script. |
| `logs/`, `artifacts/`, `.tmp-shots/`, `dist/`, `node_modules/`, `.vercel/`, `excalidraw/` | Generated/local-only, git-ignored, harmless on disk. |

## 7. Issues found & fixed

1. **"Board actions" menu was unopenable (pre-existing regression).** The overflow menu
   markup (Undo, Redo, Import diagram, quick exports, light/dark toggle) had no trigger
   button since commits `8ea1422`/`9524d3a`, stranding JSON import with no UI entry
   point. *Fix:* restored the `⋯` button (`.overflow-trigger`, title/aria "Board
   actions") + its CSS in `layout.css` byte-identical to the original; removed the
   never-called `action()` helper. Verified by feature check and header geometry.
2. **Docs scroll-reveal breakage found while pruning, repaired in place.** The prune had
   cut the base selector mid-token (`veal] {`) and removed `@keyframes docRevealUp`,
   leaving 12 rules referencing a missing animation — the showcase gallery stayed at
   `opacity: 0` forever. *Fix:* restored `[data-reveal]` base rule, `docRevealUp`
   keyframes and section comment; removed genuinely dead keyframes (`docDraw`, `docPop`,
   `docPulse`, `docPulseBorder`). Verified: braces balanced (681/681), no `veal]`
   fragments, group-selector bodies byte-match HEAD, behavioral reveal check passes.
   *Note:* baseline screenshots captured mid-bug are not a valid reference for docs
   pages; the behavioral check + visual inspection are authoritative there.
3. **`tests/_pixdiff.mjs` bug (temp tooling, since deleted):** hardcoded its comparison
   directories and ignored CLI args — earlier "pairwise" runs were all
   baseline-vs-after. Fixed and rerun; real results cited in §8.
4. **Broken import after moving helpers:** `tests/export-import.mjs` imported
   `../scripts/pnglib.cjs` → updated to `./pnglib.cjs`.
5. **Social-preview image 404 in production:** `og:image`/`twitter:image` pointed at
   `/src/assets/…`, which Vite never copies to `dist/`. Fixed by moving
   `site-logo.png` to `public/assets/` and updating both meta tags (§3).
   *Caveat:* `board-app.vercel.app` currently serves a **stale build** (its HTML has no
   og meta at all; it also rewrites unknown paths to `index.html`, so `200 text/html`
   proves nothing there). Re-deploy from this repo to pick the fix up.
6. **Hardcoded wrong Chrome path in 4 e2e scripts** (`export-import`, `invalid-actions`,
   `pan-extreme`, `performance-repro-cdp`): `Program Files (x86)` no longer exists;
   Chrome is under `Program Files`. Now resolves the first existing path with fallback;
   `node --check` passes on all four.
7. **Tracked build output & dependencies:** `dist/` and `node_modules/` were committed
   (~4,700 files); removed from the index, covered by `.gitignore`, organized with
   section comments.
8. **Pre-existing, noted, not changed:** `puppeteer`/`puppeteer-core`/`zod` are in
   `node_modules` but not in `package.json` — a fresh `npm install` will not include
   them, so install (`npm i -D puppeteer puppeteer-core`) before running e2e scripts.
   Adding devDependencies is a dependency change outside cleanup scope. Also pre-existing:
   828 kB JS chunk warning (Konva is large), and the empty-canvas hint mentions `?` for
   shortcuts though no `?` handler exists — product decisions, not cleanup regressions.

## 8. Verification summary

**Round 1**
- `npm test` 10/10 · `npm run build` succeeds.
- Headless feature suite 32/32, incl. "Board actions menu opens with Undo/Redo/Import".
- Screenshot pixel-diff across `/`, `/board`, `/docs`, `/thank-you`, `/waitlist`,
  `/nope` (desktop + mobile, light + dark): **0 px** delta everywhere except (a) the
  board header where the restored `⋯` button sits, and (b) docs mobile, where
  scroll-reveal timing makes captures nondeterministic (confirmed by re-capturing the
  same build twice — that run also differs).

**Round 2 (final state)**
- `npm test` 10/10 · `npm run build` succeeds (exit 0).
- `tests/smoke-after-cleanup.mjs` 22/22, no page/console errors.
- Font enumeration: only `Factor A|800` + `Factor A Flexible|800` (both loaded), DM Sans
  400/700; no requests to the three removed font weights.
- Live browser check: all landing images `naturalWidth > 0`, zero 404s/failed requests;
  screenshots of `/` and `#/docs` visually identical to before (headline glyphs,
  doodles, docs layout).
- Zero dangling references to any removed path across `src/`, `tests/`, `index.html`.
