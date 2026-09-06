# Canvas performance and reference review

## Stage 1 — Investigate

The patched board uses React, react-konva, and Konva. The verified pressure
points were full history snapshots and large raster exports. Canvas pointer
handling is requestAnimationFrame-coalesced for drawing/dragging, and pan now
uses the same policy.

## Stage 2 — Patch

- Board state refuses more than 10,000 shapes while preserving the current
  board and reporting a recoverable limit error.
- History depth scales down as a board grows: 1,000 shapes retains 100 frames,
  5,000 retains 20, and 10,000 retains 10 (minimum 10 frames).
- Undo/redo move immutable frames between stacks instead of deep-cloning a
  complete board on each operation.
- Raster export has a 5,000-shape safety limit; SVG and JSON remain available.
- Pan events are rendered at most once per animation frame, retaining the last
  pointer location.

## Stage 3 — Stress test

The repeatable reducer benchmark is `node --expose-gc tests/history-perf-repro.mjs`.
It covers 1k, 5k, 10k, 10k+ rejection, 1k complex 160-point pen strokes, and
ten commit/undo/redo operations at 5k shapes.

| Workload | Before patch | After patch | Result |
| --- | ---: | ---: | --- |
| 5k shapes: 10 commit + 10 undo + 10 redo | 346.33 ms / 120.95 MB RSS | 82.25 ms / 86.96 MB RSS | 76% less reducer time; 28% less RSS |
| Maximum accepted shape count | 10,000 | 10,000 | stable cap |
| 10,001 shapes | silently ignored | board preserved with recoverable error | fixed |
| Raster export | unbounded | 5,000 shapes | controlled degradation |

The browser stress harness is `tests/performance-repro.mjs`; it records rAF
FPS, maximum frame time, long tasks, heap, DOM nodes, layout/script/task time,
console errors, and stack traces when run in an interactive Chromium-capable
environment. Browser-specific FPS/CPU values are intentionally not inferred
from the reducer benchmark.

## Stage 4 — Reference comparison

Miro documents a 100,000-object technical maximum but warns that performance
may degrade around 1,000 objects and recommends fewer than 5,000 for a better
experience. It also identifies freehand/vector content and high-resolution
media as disproportionately expensive. Kanvas now adopts a more conservative
single-user editing cap (10,000) and an explicit 5,000-shape raster-export
limit, while retaining SVG/JSON alternatives. Miro also simplifies complex
widgets when zoomed out; Kanvas instead culls off-screen Konva nodes. This is
behaviorally comparable progressive degradation, though not an implementation
copy.

Reference: [Miro board performance guidance](https://help.miro.com/hc/en-us/articles/360013588560-Board-performance-and-loading-issues).

## Stage 5 — Code review

- The cap is enforced in history, storage, and import paths, so oversized data
  does not reach normal rendering.
- Export errors propagate to the toolbar's existing user-message handler.
- History frame sharing is safe because all updater callbacks begin with a
  deep clone; direct input remains cloned at the boundary.
- The normal drawing and selection paths are unchanged; degradation applies
  only at large-board thresholds.

## Stage 6 — Deploy gate

Deploy only after `npm test` and `npm run build` pass. Check the production
URL for the toast/error behavior at the 10,001-shape boundary and verify that
large raster export offers the fallback message rather than freezing the tab.
