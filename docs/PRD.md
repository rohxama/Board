# Project Spec: Web-Based Diagramming Tool (Excalidraw-style) — React + Vite Edition

Give this entire document to Codex as the build instructions. It is written to be self-contained — no other context should be needed.

---

## 1. Project Summary

Build a browser-based diagramming/whiteboard application, similar to Excalidraw. The app lets a user draw diagrams using prebuilt shapes and a freehand pen, style their strokes, use a temporary "laser pointer" for explanations, snap shapes to a grid and to each other, and export/import their work as JSON, plus export a PNG image.

---

## 2. Tech Stack

- **Framework:** React (functional components + hooks only, no class components)
- **Build tool:** Vite
- **Canvas library:** `react-konva` (React bindings for Konva.js) + `konva` as its peer dependency
- **State management:** React's built-in `useState` / `useReducer` + Context API. **Do not add Zustand, Redux, Jotai, or any external state library right now.** The app's state is small enough (active tool, active style, selection, shape list, history) to manage cleanly with plain React state. Structure the state logic behind a single custom hook / context so that swapping in Zustand later — if the app grows — only touches that one layer, not every component.
- **Package manager:** npm
- **Language:** JavaScript (no TypeScript for this pass, per user preference — keep code style consistent and add JSDoc comments on non-obvious functions instead of types)
- Optional, do not implement yet, just leave a clean seam for later:
  - `perfect-freehand` (nicer variable-width pen strokes)
  - `roughjs` (hand-drawn sketchy shape rendering)

**Only add a new dependency if it removes real, nontrivial hand-written code.** Before adding anything beyond `react`, `react-dom`, `konva`, and `react-konva`, check whether plain React/JS can do it reasonably cleanly first.

---

## 3. Visual/UX Direction

- **Minimal, sleek, lots of breathing room.** No dense toolbars, no boxed-in panels with heavy borders.
- Neutral, light background canvas by default (subtle dot or line grid, low contrast, not distracting).
- **Floating pill-shaped toolbar**, horizontally centered, docked near the top of the screen. Icon-only buttons (simple inline SVG components — no icon library dependency needed for this scope). Each icon has a hover tooltip showing its name and keyboard shortcut.
- **Style panel** appears only when a drawing tool or a selected shape is active — floats near the toolbar or along the left edge, not always visible, doesn't crowd the canvas.
- **Zoom controls** float in the bottom-right corner (zoom %, plus/minus, reset).
- Generous padding/margins throughout; avoid visual clutter — this is a stated hard requirement, not a nice-to-have.
- Smooth, subtle transitions (e.g. panel fade-in/out via CSS, not a library), nothing flashy.

---

## 4. Project Structure

Scaffold with `npm create vite@latest . -- --template react`, then organize as:

```
/index.html
/vite.config.js
/package.json
/src
  main.jsx                     -> React root render, imports global CSS
  App.jsx                      -> top-level layout: <CanvasStage/>, <Toolbar/>, <StylePanel/>, <ZoomControls/>

  /styles
    global.css                 -> resets, CSS variables (colors, spacing scale, radii)
    layout.css                 -> floating toolbar/panel positioning

  /context
    AppStateContext.jsx         -> Context + reducer: activeTool, activeStyle, selectedShapeIds
    HistoryContext.jsx          -> Context + reducer: undo/redo stacks, shapes array (the single source of truth for diagram content)

  /hooks
    useKeyboardShortcuts.js     -> binds shortcuts.js map to dispatched actions
    useStageZoomPan.js          -> cursor-centered zoom + pan logic, returns stage props/handlers
    useShapeDrag.js             -> shared drag-move handler that applies snapping before commit

  /components
    Toolbar/
      Toolbar.jsx
      ToolButton.jsx
      Toolbar.css
    StylePanel/
      StylePanel.jsx
      ColorSwatch.jsx
      StrokeWidthSlider.jsx
      DashStyleToggle.jsx
      StylePanel.css
    ZoomControls/
      ZoomControls.jsx
      ZoomControls.css
    Canvas/
      CanvasStage.jsx           -> the <Stage> + three <Layer>s, wires up active tool's event handlers
      GridLayer.jsx             -> renders dot/line grid, memoized, only redraws on zoom/pan change
      ContentLayer.jsx          -> maps `shapes` state to Konva shape components
      OverlayLayer.jsx          -> renders Transformer, snapping guide lines, laser trail
      shapes/
        RectShape.jsx
        EllipseShape.jsx
        ArrowShape.jsx
        LineShape.jsx
        PenStrokeShape.jsx
        TextShape.jsx

  /tools
    useRectangleTool.js         -> each returns { onMouseDown, onMouseMove, onMouseUp } to attach to Stage
    useEllipseTool.js
    useArrowTool.js
    useLineTool.js
    usePenTool.js
    useLaserTool.js
    useTextTool.js
    useEraserTool.js
    useSelectTool.js

  /lib
    snapping.js                 -> pure functions: snapToGrid(pos), getSnapGuides(movingShape, otherShapes)
    io.js                        -> exportJSON(shapes), importJSON(file), exportPNG(stageRef)
    shortcuts.js                 -> the keyboard shortcut → action map
    idGenerator.js                -> simple incrementing/uuid-like id generator for new shapes
```

**Why this structure:**
- `/context` holds the two sources of truth (UI state, and diagram content + history) — components read from these instead of passing props down many levels.
- `/tools` are hooks, not classes — each returns plain event handler functions, so `CanvasStage.jsx` just does `const { onMouseDown, onMouseMove, onMouseUp } = useActiveTool()` and attaches them, without caring which tool is active.
- `/lib` holds pure, framework-agnostic functions (snapping math, serialization) — easy to unit-test later, no React dependency.
- `/components/Canvas/shapes` keeps each Konva shape's render logic isolated and swappable (e.g. later replacing `PenStrokeShape.jsx`'s line rendering with `perfect-freehand` only touches this one file).

---

## 5. Core Architecture

### 5.1 State (`/context`)

**`AppStateContext`** (UI-level state, changes often, doesn't need undo history):
```js
{
  activeTool: 'select' | 'rectangle' | 'ellipse' | 'arrow' | 'line' | 'pen' | 'laser' | 'text' | 'eraser',
  activeStyle: { stroke, strokeWidth, dash, fill, opacity },
  selectedShapeIds: string[]
}
```
Expose via a reducer (`SET_TOOL`, `SET_STYLE`, `SET_SELECTION`) and a `useAppState()` hook that returns `{ state, dispatch }`.

**`HistoryContext`** (the diagram's actual content — this is what gets undone/redone/exported):
```js
{
  shapes: ShapeData[],       // current diagram content, single source of truth
  undoStack: ShapeData[][],
  redoStack: ShapeData[][]
}
```
Expose `useHistory()` returning `{ shapes, commit(newShapes), undo(), redo() }`. `commit()` pushes the *previous* `shapes` array onto `undoStack`, clears `redoStack`, and sets the new `shapes`. Only call `commit()` on completed actions (shape finalized on mouseup, drag end, resize end, delete, style change) — never on every intermediate mousemove.

Each shape in `shapes` is a plain serializable object, e.g.:
```js
{ id, type: 'rectangle', x, y, width, height, stroke, strokeWidth, dash, fill, opacity, rotation }
```
Keeping shapes as plain data (not Konva node references) is what makes JSON export, undo/redo, and React re-rendering all consistent — `ContentLayer.jsx` simply maps this array to Konva shape components every render.

### 5.2 Canvas & Layers (`CanvasStage.jsx`, layers)

One `<Stage>` from react-konva containing three `<Layer>`s:
1. **GridLayer** — background grid, re-renders only when zoom/pan state changes (wrap in `React.memo`).
2. **ContentLayer** — `shapes.map(shape => <ShapeComponent key={shape.id} {...shape} />)`, dispatching the correct component per `shape.type`.
3. **OverlayLayer** — Konva `Transformer` bound to selected shape(s), temporary snapping guide `Line`s, and the laser pointer trail. Never read from when exporting.

`useStageZoomPan` hook encapsulates wheel-zoom (ctrl/cmd + scroll) and space-drag/middle-mouse pan, returning stage-level props (`scaleX`, `scaleY`, `x`, `y`, and their event handlers) so `CanvasStage.jsx` just spreads them onto `<Stage>`.

### 5.3 Tools (`/tools`)

Each tool is a hook with a consistent shape, e.g.:
```js
export function useRectangleTool() {
  // internal useState for the in-progress shape being drawn
  return { onMouseDown, onMouseMove, onMouseUp };
}
```
`CanvasStage.jsx` picks the active tool's hook based on `activeTool` from `AppStateContext` (a small switch/lookup, not conditional hook calls — call all tool hooks unconditionally at the top level per React's rules of hooks, and only wire up the active one's handlers to the Stage).

**Rectangle / Ellipse / Line:** mousedown starts a draft shape at that point, mousemove updates its width/height in local state (live preview), mouseup calls `commit()` with the finalized shape appended to `shapes`.

**Arrow:** same pattern, `ArrowShape.jsx` renders a Konva `Arrow`. Support Shift-held angle snapping (0°/45°/90°/135°) during mousemove.

**Line:** same as arrow, no arrowhead, same Shift angle-snapping.

**Pen:** mousedown starts collecting `points` in local state, mousemove appends (throttled), mouseup commits a `PenStrokeShape` with the final points array. Leave a comment noting where `perfect-freehand` could later replace the raw point array with a variable-width stroke.

**Laser:** same mousemove-collect pattern, but rendered only in `OverlayLayer`, never committed to `shapes`/history. On mouseup, animate opacity to 0 with Konva's `Tween` (or a simple `requestAnimationFrame` fade), then remove from local state.

**Text:** click places a temporary editable `<textarea>` positioned absolutely over the click point (plain HTML overlay, not a Konva node, while editing); on blur/Enter, commit a `TextShape` with the typed content into `shapes`.

**Eraser:** click identifies the shape under the cursor (via Konva's built-in hit detection) and calls `commit()` with it removed from `shapes`.

**Select:** clicking a shape sets `selectedShapeIds`; `OverlayLayer` attaches a Konva `Transformer` to the matching node ref(s). Dragging/resizing updates that shape's fields in `shapes` locally during the gesture, and calls `commit()` on drag end / transform end (not every frame).

### 5.4 Snapping (`lib/snapping.js`)

Pure, framework-agnostic functions:
- `snapToGrid(x, y, gridSize = 10)` → rounded `{x, y}`
- `getSnapGuides(movingShapeBounds, otherShapesBounds, threshold = 6)` → returns any matched horizontal/vertical guide lines to render, and an optional snapped position

Called from the relevant tool hook / `useShapeDrag.js` during drag/resize, before updating local state — so snapping is applied consistently regardless of which tool triggered the movement.

### 5.5 Undo/Redo

Fully handled by `HistoryContext` as described in 5.1. `useKeyboardShortcuts` binds Ctrl+Z / Ctrl+Shift+Z to `undo()` / `redo()`.

### 5.6 Import/Export (`lib/io.js`)

- **`exportJSON(shapes)`** — wraps `{ version: 1, shapes }`, triggers a Blob download.
- **`importJSON(file)`** — reads and parses the file, validates `version`, returns the `shapes` array for the caller to pass into `HistoryContext`'s `commit()` (importing is itself a committed history action, so it's undoable).
- **`exportPNG(stageRef)`** — takes a ref to the react-konva `Stage`, temporarily hides the overlay layer's node, calls `stage.toDataURL({ pixelRatio: 2 })`, restores visibility, triggers a Blob download.

### 5.7 UI Components

- `Toolbar.jsx` reads `activeTool` from `AppStateContext` and dispatches `SET_TOOL` on click; highlights the active button.
- `StylePanel.jsx` reads/writes `activeStyle`; also, if `selectedShapeIds` is non-empty, edits apply to the selected shape(s) via `HistoryContext`'s `commit()` instead of just future shapes.
- `ZoomControls.jsx` reads/writes the zoom state from `useStageZoomPan`.
- `useKeyboardShortcuts.js` is the single place mapping keys to `dispatch()`/`undo()`/`redo()` calls — no shortcut logic duplicated inside individual components or tools.

---

## 6. Feature Checklist (acceptance criteria)

Build and verify in this order:

1. [ ] Vite + React app boots, `<CanvasStage>` renders a full-viewport Konva stage with grid, pans and zooms smoothly (cursor-centered zoom).
2. [ ] Rectangle, ellipse, line, and arrow tools each draw correctly via click-drag, respecting `activeStyle`.
3. [ ] Select tool: click to select (Transformer handles appear), shift-click multi-select, drag-select marquee, drag to move, Delete key removes selected shape(s) — all going through `commit()`.
4. [ ] Style panel changes stroke color/width/dash/fill; applies to new shapes and to the current selection.
5. [ ] Pen tool draws smooth freehand strokes.
6. [ ] Text tool places editable text.
7. [ ] Eraser tool deletes shapes on click.
8. [ ] Grid snapping active during drag/resize.
9. [ ] Shape-to-shape snapping shows temporary guide lines during drag, cleared on release.
10. [ ] Undo/redo works for every mutation type (create, move, resize, rotate, delete, style change, import).
11. [ ] Laser tool draws and fades on the overlay only, never touches `shapes`/history/export.
12. [ ] JSON export/import round-trips a diagram exactly.
13. [ ] PNG export is crisp (2x) with no selection handles/guides/laser visible.
14. [ ] All toolbar actions have matching keyboard shortcuts via `useKeyboardShortcuts`.
15. [ ] UI matches the minimal/sleek direction in Section 3.

---

## 7. Explicit Non-Goals

- No TypeScript this pass.
- No Zustand/Redux/other state library — plain Context + reducers only, until a real scaling need appears.
- No backend, accounts, database, or real-time collaboration.
- No mobile/touch gesture handling (mouse/trackpad only for now).
- No persistence (localStorage) — in-memory only.
- No rough.js sketchy rendering — leave the seam noted in `PenStrokeShape.jsx` and shape components, don't wire it in.

---

## 8. Deliverable

A Vite-scaffolded React app at the structure in Section 4, running via `npm install && npm run dev`, and producing a static build via `npm run build`, satisfying every item in the Section 6 checklist.
