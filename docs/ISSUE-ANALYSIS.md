# Whiteboard Editor — Issue Analysis & Implementation Prompts

Three issues analyzed below, each with root-cause analysis followed by one complete, standalone prompt for an AI coding agent (Codex, Claude Code, OpenCode, Gemini CLI, etc.). Give each prompt separately — don't run them in the same session back to back without verifying the previous one landed cleanly, since Issue 1 and Issue 3 touch overlapping interaction/state code.

---

# Issue 1 — Whiteboard freezes after clicking empty space

## 1. Most likely root cause

This is almost never a single bug — it's usually 2–3 of these compounding:

- **Stuck gesture flag.** A `mousedown` on a shape sets something like `isDragging = true`, but the matching `mouseup`/`dragend` listener is attached *only to that shape node*, not to the Stage or `window`. If the pointer ends up over empty canvas (or leaves the browser entirely) before release, that listener never fires, and `isDragging` stays `true` forever. Every subsequent `mousedown` handler checks `if (isDragging) return;` and silently no-ops — this reads exactly like "freeze."
- **Transformer pointed at a stale/missing node.** Clicking empty space clears `selectedShapeIds`, but if the Transformer's `.nodes([...])` call runs before the corresponding shape ref has been nulled out (or references a node that just unmounted), Konva throws inside that call. If that throw isn't caught, it can abort the rest of that event handler's execution — including whatever state update was supposed to re-enable further interaction — leaving the app in an inconsistent, unresponsive state without technically "crashing" (React is still running, it's just stuck holding stale state).
- **Leftover event listeners from tool switching.** If each tool hook attaches its own native/Konva listeners in a `useEffect` but the cleanup function is missing or incomplete, switching tools stacks multiple handlers on the same events. Old handlers close over stale state (old `shapes`, old `selectedShapeIds`) and can throw or produce contradictory updates when they fire alongside the new tool's handler.
- **Infinite re-render triggered by a state update inside an effect with no stable dependency.** This manifests as the tab becoming unresponsive (100% CPU on the main thread) right after a particular click — easy to mistake for "the editor crashed."
- **Unfinished draw state.** If a shape-drawing tool (rectangle/pen/etc.) leaves a "draft shape" in local state and the user clicks empty space with a *different* tool now active, the next interaction may try to continue mutating that orphaned draft, producing `NaN` dimensions or an exception during render.

## 2. How professional whiteboard apps solve this

Figma, Miro, and Excalidraw all model pointer interaction as an explicit **finite state machine**: `idle → drawing → dragging → resizing → panning → idle`. Only one state is active at a time, transitions are explicit, and — critically — every state has a guaranteed exit path that doesn't depend on the pointer being over any particular DOM/canvas node. Global-scope listeners (on `window` or the Stage, never on individual shapes) are used for "release" events specifically so a gesture can never get stuck mid-way regardless of where the pointer ends up or whether the window loses focus.

## 3. Correct architecture

- A single **interaction/gesture reducer** (separate from the diagram-content reducer) with an explicit `mode` field: `'idle' | 'drawing' | 'dragging' | 'resizing' | 'panning'`. Every transition is a discrete action; no implicit boolean flags scattered across hooks.
- **All "end" listeners (`mouseup`, `dragend`, `touchend`) attach at the Stage or `window` level**, never on individual shape nodes, so they always fire and always reset `mode` back to `'idle'` — including via a `window.addEventListener('blur', resetToIdle)` safety net for alt-tab/focus-loss cases.
- The Transformer's bound nodes are **derived reactively** from `selectedShapeIds` + a live refs map, with a guard that filters out any `null`/unmounted refs *before* calling `.nodes(...)` — never assume every id in `selectedShapeIds` has a live ref at the moment of the call.
- Tool hooks' `useEffect` cleanup functions must remove every listener they attached, with no exceptions — verify this explicitly rather than assuming.
- Clicking the Stage itself (`e.target === e.target.getStage()`) is the single, explicit code path for "clear selection" — it should not be inferred indirectly from the absence of a shape-click event.

## 4. What should change

- Introduce or fix the gesture-mode reducer described above.
- Move all release-listeners to Stage/window scope.
- Add defensive filtering before every Transformer `.nodes()` call.
- Audit every tool hook's `useEffect` cleanup.
- Add a `window blur` → force-idle safety net.

## 5. Edge cases

- User starts dragging, then alt-tabs away, then returns and clicks — must not stay stuck.
- User clicks empty space *while* a resize/rotate is mid-gesture.
- Rapid tool switching mid-draw (press `R`, click-drag partially, press `V` before mouseup).
- Multi-select active, then click empty space — must clear cleanly and re-enable single selection immediately after.
- Browser drops the `mouseup` event entirely (happens with some trackpads/some OSes) — window-level fallback must still recover state.

## 6. Performance considerations

- Don't attach/detach native listeners on every render — attach once per tool activation, guarded by a stable dependency array.
- Avoid `setState` calls inside `mousemove` for anything other than the actively-dragged/drawn shape's live preview.

## 7. State management considerations

- Keep ephemeral gesture state (drag-in-progress, current draft shape) **out of** the committed diagram-content history — it should never be capable of corrupting the undo/redo stack even if it gets into a weird state.

## 8. Konva/Canvas best practices

- Use `stage.on('mousedown touchstart', ...)` at the Stage level for deselection logic, checking `e.target === stage` explicitly.
- Never rely on children array indices to identify a hit shape — use stable `id`/`name` attributes.
- Wrap Transformer `.nodes()` calls in a guard, always.

## 9. UX best practices

- Clicking empty space must be a "safe" action from every possible prior state — it should always return the editor to a fully responsive idle state, with zero exceptions.

## 10. Implementation Prompt for AI Coding Agent

```
TASK: Fix a freeze bug in an existing React + react-konva whiteboard editor that occurs after clicking empty canvas space, without rewriting unrelated code.

CONTEXT:
This is an existing production codebase (whiteboard/diagram editor similar to Miro/Excalidraw, built with React + react-konva). Do not redesign the architecture wholesale. Only modify what's necessary to fix this specific bug and prevent regressions.

BUG DESCRIPTION:
After creating many shapes, clicking on an empty area of the canvas (or in some cases an unexpected area) causes the editor to become unresponsive: new shapes can no longer be created, existing interactions stop responding, and only a full page refresh recovers it. This does not always reproduce immediately — it appears intermittently after a sequence of interactions (draw shape, drag shape, click empty space).

INVESTIGATE THESE SPECIFIC HYPOTHESES FIRST (do not guess blindly — check each):
1. Are any "end of gesture" listeners (mouseup, dragend, touchend) attached to individual shape nodes instead of the Stage or window? If the pointer releases somewhere other than that specific node, the listener never fires and a boolean flag (e.g. isDragging) can get stuck `true` forever, causing subsequent mousedown handlers to silently no-op.
2. Does clearing selection ever call the Transformer's `.nodes([...])` with a stale or unmounted ref in the array? Does this ever throw uncaught?
3. Do any tool-specific hooks (rectangle tool, pen tool, select tool, etc.) attach native or Konva event listeners in a useEffect without a complete cleanup function on unmount/tool-switch? Check for listener buildup across repeated tool switches.
4. Is there any local "draft shape in progress" state that survives a tool switch, potentially causing NaN dimensions or invalid renders when interacted with again?
5. Is there any window blur / focus-loss handling at all? If the user alt-tabs mid-gesture, is there any recovery path?
6. Search for any useEffect whose dependency array might cause it to re-run every render and set state unconditionally (infinite loop risk).

REQUIRED FIX:
1. Implement (or fix, if a partial version exists) an explicit interaction-mode state — e.g. a reducer or well-scoped state value with values like 'idle' | 'drawing' | 'dragging' | 'resizing' | 'panning'. Only one mode is active at a time. All transitions must be explicit, not inferred.
2. Move all "gesture end" listeners (mouseup, dragend, touchend equivalents) to the Stage level or window level — never bound only to an individual shape node — so they are guaranteed to fire regardless of where the pointer ends up.
3. Add a window 'blur' event listener that force-resets interaction mode to 'idle' and clears any in-progress drag/draw/resize state, as a safety net for focus-loss scenarios (alt-tab, devtools focus steal, etc.).
4. Before every call to the Transformer's `.nodes(...)` method, filter the target node array to exclude any null/undefined/unmounted refs.
5. Audit every custom tool hook (rectangle, ellipse, arrow, line, pen, laser, text, eraser, select — whichever exist in this codebase) and ensure every listener attached in a useEffect has a matching, complete cleanup function that runs on tool deactivation.
6. Ensure clicking the empty Stage area (target === stage) is one single, explicit, well-tested code path that: clears selection, resets interaction mode to idle, and clears any draft/in-progress shape state — with no side effects that depend on prior interaction history.
7. Add defensive guards so that no single interaction handler's exception can leave the interaction-mode state stuck in a non-idle value — consider wrapping risky Konva calls (Transformer attach/detach) in try/catch that, on failure, force-resets mode to idle rather than leaving it in whatever state it was in when the exception was thrown.

CONSTRAINTS:
- Do not rewrite the diagram-content state (shapes array, undo/redo history) — this fix is scoped to interaction/gesture state and event listener lifecycle only.
- Do not introduce new dependencies (no state machine libraries like XState) unless the codebase already has significant complexity that clearly warrants it — a plain reducer is preferred and sufficient here.
- Preserve all existing working features (drawing, selecting, dragging, resizing, rotating, deleting) exactly as they currently function — only the freeze bug and its root causes should change.
- Modify only the files directly responsible for interaction/gesture state, event listener attachment, and Transformer binding. Do not touch shape rendering, styling, or export/import code.

ACCEPTANCE CRITERIA:
- Clicking empty canvas space after any sequence of prior interactions (draw, drag, resize, rotate, multi-select) always results in a fully responsive editor immediately after the click.
- Starting a drag and releasing the pointer over empty space, outside the canvas entirely, or via alt-tab/window blur, always correctly resets interaction state to idle.
- Rapid tool switching mid-gesture (e.g., pressing a different tool's shortcut key while a shape is being drawn) never leaves stray listeners or draft state behind.
- No regression in existing shape creation, selection, drag, resize, rotate, multi-select, or delete functionality.

TESTING CHECKLIST:
- [ ] Create 20+ shapes, click empty space repeatedly in different sequences — no freeze.
- [ ] Start dragging a shape, release the mouse button while the cursor is over empty space — editor remains responsive.
- [ ] Start dragging a shape, alt-tab away mid-drag, return, click anywhere — editor recovers to idle.
- [ ] Start drawing a rectangle, press a different tool's shortcut key mid-draw, then click empty space — no stuck draft shape, no console errors.
- [ ] Multi-select 5+ shapes, click empty space — selection clears cleanly, Transformer detaches without error, further interactions work normally.
- [ ] Open browser devtools console during all of the above — zero uncaught exceptions.
- [ ] Repeat all of the above at a zoomed-in and zoomed-out stage scale.

PERFORMANCE REQUIREMENTS:
- The fix must not introduce additional listeners that fire on every mousemove beyond what already exists for drag/resize previews.
- No new state updates should be introduced inside high-frequency events (mousemove) — only inside discrete start/end events.

REGRESSION PREVENTION:
- After the fix, re-verify: shape creation for every shape type, single and multi-select, drag, resize, rotate, delete, undo/redo, and any existing keyboard shortcuts still work exactly as before.

Report back: which of the hypothesized root causes were confirmed present in the actual code, which fix(es) were applied, and any additional root cause found that wasn't in the hypothesis list above.
```

---

# Issue 2 — Shape should only be selectable from its border

## 1. Most likely root cause

By default, Konva hit-tests filled shapes (`Rect`, `Ellipse`, etc.) as **solid regions** — any pointer position inside the shape's bounding geometry registers as a hit, including the fill interior. This is the standard/default behavior and isn't a bug — it's just the opposite of what's being asked for here. `Line` and `Arrow` shapes are naturally closer to what's wanted already, since they have no fill to hit-test against (only their stroke path registers).

## 2. How professional editors implement this

Worth naming directly: **most professional whiteboard/diagram tools (Excalidraw, Miro, and Figma's default single-click behavior) intentionally do NOT do this** — they make the entire shape, fill included, clickable, because users naturally click the middle of a shape expecting selection, and border-only hit zones are a common source of "why won't this select" frustration, especially for thin strokes or shapes at small zoom levels. Border-only click-to-select does exist in some specialized tools (e.g., certain CAD or diagram tools where overlapping filled shapes need to be individually addressable), typically implemented via a custom hit region drawn only along the stroke path, with a generous tolerance width so users don't need pixel-perfect precision.

This tradeoff is worth deciding on deliberately before implementing — the prompt below implements exactly what was asked (border-only), but flags the UX tradeoff so it's an informed choice rather than a surprise later.

## 3. Correct architecture

Konva separates a shape's **visual draw** (`sceneFunc`) from its **hit-test draw** (`hitFunc`) — you can override just the hit-test logic while leaving the shape's visible rendering untouched. For each filled shape type (rectangle, ellipse), supply a custom `hitFunc` that draws *only the stroked outline* onto Konva's internal hit-detection canvas (no fill), with an intentionally widened stroke width for the hit region specifically (separate from the visible stroke width) so clicking near — not exactly on — the border still registers.

## 4. What should change

- Add a custom `hitFunc` to the Rect and Ellipse shape components (Line/Arrow already behave this way natively and likely need no change, though verify their default `hitStrokeWidth` is reasonable).
- Widen the hit region beyond the visual stroke width for usability (e.g., visual stroke 2px, hit tolerance 8–10px).
- Keep marquee/drag-select (rubber-band selection) working via bounding-box intersection, independent of this per-shape click rule — a shape should still be includable in a drag-select rectangle even though a direct click only lands on its border.
- Decide and document the behavior for: (a) shapes with no visible stroke at all — should they become unselectable by click entirely, or fall back to full-shape hit testing? (b) text shapes, which have no meaningful "border" concept — likely need to keep full-bounding-box click behavior as a deliberate exception.

## 5. Edge cases

- Rotated shapes — Konva's hit testing runs in the shape's local coordinate space automatically via its transform, so this should work correctly without extra rotation-handling code, but must be explicitly verified.
- Very small shapes where the border ring is visually tiny at the shape's own scale.
- Stage zoom level — `hitStrokeWidth`-style values are defined in the shape's local units, not screen pixels; at low zoom the effective on-screen click target shrinks proportionally, so the hit tolerance may need to be zoom-aware (or generous enough to remain usable at typical zoom-out levels).
- Dashed strokes — the hit region should almost certainly remain a continuous ring rather than literally matching the dash gaps, or users will be unable to click between dashes.
- Shapes with zero fill/fully transparent fill — no change in behavior, since only the border ever mattered for these anyway.

## 6. Performance considerations

Custom `hitFunc` only executes when a hit test is actually requested (on pointer events), not on every render frame — this has negligible performance impact even with many shapes on canvas.

## 7. State management considerations

None — this is purely a rendering/hit-detection concern isolated to individual shape components; no state architecture changes needed.

## 8. Konva/Canvas best practices

- Prefer overriding `hitFunc` over trying to achieve this with `hitStrokeWidth` alone for filled shapes — `hitStrokeWidth` alone doesn't remove the fill's hit contribution on shapes like `Rect`/`Ellipse`.
- Keep the custom hit-region drawing logic isolated per shape type so it can be adjusted independently later.

## 9. UX best practices

- Hit tolerance should meaningfully exceed the visible stroke width — don't require pixel-perfect clicks.
- Provide a cursor change (e.g., pointer cursor) specifically when hovering the clickable border region, so users get feedback about exactly where the clickable zone is, rather than discovering it by trial and error.

## 10. Implementation Prompt for AI Coding Agent

```
TASK: Restrict shape selection to clicks on the shape's visible border/stroke only, for a React + react-konva whiteboard editor, without breaking existing selection/drag/resize/rotate/marquee-select behavior.

CONTEXT:
Existing production codebase, whiteboard/diagram editor built with React + react-konva. Shapes currently include at minimum: rectangle, ellipse, line, arrow, and possibly others (pen strokes, text) — check the actual shape components present in this codebase before proceeding.

CURRENT BEHAVIOR:
Clicking anywhere inside a filled shape (e.g., inside a rectangle's fill area) selects it.

DESIRED BEHAVIOR:
- A shape becomes selected only when the user clicks on its visible border/stroke (with a reasonable, generous click tolerance beyond the exact visual stroke width — do not require pixel-perfect precision).
- Clicking inside the shape's fill (but not on the border) must NOT select it.
- Clicking outside the shape must NOT select it.
- Once selected via a border click, drag, resize, rotate, and the Transformer must all continue to work exactly as they currently do — this change affects only the initial click-to-select hit detection, nothing about post-selection interaction.
- Marquee/drag-select (rubber-band selection over an empty area) must continue to select shapes based on bounding-box intersection with the drag rectangle — do NOT apply the border-only rule to marquee selection; a shape should still be included in a marquee selection if its bounding box intersects the drag rectangle, regardless of whether the user's marquee touched its border specifically.

IMPLEMENTATION APPROACH:
1. For filled shape types (rectangle, ellipse, and any other filled shape type present in the codebase), override each shape's `hitFunc` to draw only a stroked outline (no fill) onto the hit-detection canvas, using a widened stroke width for the hit region specifically (separate from the shape's visual stroke width) — e.g., if visual stroke is 2px, use something like 8-10px for the hit region, drawn centered on the actual border path.
2. For line and arrow shapes, verify their default hit behavior (Konva's `hitStrokeWidth` property) already achieves stroke-only hit testing with adequate click tolerance; adjust `hitStrokeWidth` if the default is too thin to comfortably click.
3. For any shape type with no meaningful border concept (e.g., text, if present) — do not apply this restriction; leave its existing full-area click-to-select behavior unchanged, and note this exception explicitly in your implementation.
4. For shapes with no visible stroke at all (strokeWidth 0 or no stroke color) — decide and implement one clear behavior: either they become unselectable via direct click (only selectable via marquee), or fall back to full-shape hit testing as a special case. State which one you implemented and why.
5. Ensure the custom hitFunc correctly accounts for the shape's own rotation and scale (Konva applies the node's transform automatically before invoking hitFunc, in local shape coordinates — verify this holds and rotated shapes' hit regions rotate correctly with them).
6. Add a pointer cursor change (CSS cursor: pointer, or Konva's stage container style) specifically when hovering the clickable border region of a shape, to visually communicate where the clickable zone is.

CONSTRAINTS:
- Do not modify the visible rendering (sceneFunc / normal shape drawing) of any shape — only the hit-testing logic changes.
- Do not modify marquee/rubber-band selection logic beyond verifying it still works via bounding-box intersection, independent of this change.
- Do not modify drag, resize, rotate, or Transformer logic — those must continue to operate identically once a shape is selected, regardless of how selection was triggered.
- Preserve all other existing features unrelated to selection hit-testing.

ACCEPTANCE CRITERIA:
- Clicking inside a filled rectangle/ellipse's fill area (clearly away from the border) does not select it.
- Clicking on or very near (within the widened tolerance) a rectangle/ellipse's border selects it.
- Clicking fully outside a shape's bounding area does not select it.
- Line and arrow shapes remain selectable by clicking on or near their stroke path.
- Once selected (by any valid method), drag/resize/rotate/Transformer behave exactly as before this change.
- Marquee-select still selects shapes by bounding-box intersection, unaffected by this change.
- Rotated shapes' clickable border region rotates correctly with the shape.

EDGE CASES TO TEST:
- Very small shapes (border ring visually tiny).
- Shapes at extreme zoom-in and zoom-out levels — click tolerance should remain usable at typical zoom-out levels (adjust tolerance to account for stage scale if needed).
- Dashed-stroke shapes — the hit region must remain a continuous ring, not matching the visual dash gaps.
- Fully transparent-fill shapes — behavior should be unaffected since only the border ever mattered.
- Overlapping shapes — clicking in the overlap area where one shape's fill covers another shape's border should correctly select whichever shape's border is actually at that point, not whichever shape is "on top" by fill area alone.

TESTING CHECKLIST:
- [ ] Draw a rectangle with visible fill and stroke; click center of fill — not selected.
- [ ] Click on the rectangle's border — selected, Transformer handles appear.
- [ ] Drag, resize, and rotate the now-selected rectangle — works normally.
- [ ] Repeat for ellipse.
- [ ] Click on a line/arrow's stroke — selected as before.
- [ ] Draw two overlapping rectangles; click in the overlap region on one shape's border specifically — correct shape selects.
- [ ] Marquee-select a group of shapes by dragging a selection rectangle over empty space that overlaps their bounding boxes (not their borders specifically) — all intersected shapes select.
- [ ] Test at 50% zoom and 200% zoom — border click tolerance remains reasonably usable.
- [ ] Test a shape with a dashed stroke — clicking between visual dashes still selects it.

PERFORMANCE REQUIREMENTS:
- No measurable frame-rate impact with 100+ shapes on canvas — hitFunc only runs on actual pointer hit-test calls, not on every render.

REGRESSION PREVENTION:
- Re-verify all existing shape creation, selection, drag, resize, rotate, delete, multi-select, and marquee-select functionality remains intact after this change.

Report back: which shape types you applied the custom hitFunc to, what hit-tolerance value you chose and why, how you handled shapes with no stroke, and how you handled text (if present) as an exception.
```

---

# Issue 3 — Shapes break after dragging many objects

## 1. Most likely root cause

This is very likely a combination of:

- **Unstable React keys.** If shapes are keyed by array index instead of a permanent unique `id` assigned at creation time, React's reconciliation can reassign an existing Konva node to a *different* shape's data after any array reordering (delete, undo, z-order change) — the node "keeps" its old visual/transform state while now representing different underlying data, which looks exactly like "shapes become disorganized" or "separate unexpectedly."
- **Direct state mutation.** If a drag handler ever mutates a shape object in place (`shape.x = newX`) rather than producing a new object via an immutable update, React may not detect the change at all in some render paths (since the top-level array reference technically changed but individual object references didn't, or vice versa depending on how memoization is set up), causing some shapes to visually update while their underlying committed state silently doesn't, or the reverse.
- **Multi-select drag not committing all affected shapes atomically.** If Konva's native drag visually moves multiple selected nodes together (e.g., via a Transformer or group), but only the specifically-dragged shape's new position gets written back into React state on drag end, the *other* selected shapes will snap back to their old state-derived positions on the next re-render — this matches "shapes separate unexpectedly" almost exactly.
- **Coordinate conversion bugs.** Using raw screen pointer coordinates instead of Konva's stage-relative pointer position (which accounts for current zoom/pan) when computing drop positions — causes shapes to land in the wrong place, especially noticeable at non-default zoom levels, and gets worse as more shapes/drags accumulate compounding error.
- **Over-eager history commits.** Pushing to the undo/redo stack on every `dragmove` tick (instead of only on `dragend`) causes excessive state churn under load, increasing the odds of a race between an in-progress drag's intermediate state and a completed commit, especially with many objects on canvas.

## 2. How professional editors solve this

Every serious canvas-based editor (Figma, Miro, tldraw, Excalidraw) uses: (a) a stable, permanent unique ID per object assigned once at creation and never regenerated, (b) fully immutable state updates (new arrays/objects on every commit, never in-place mutation), (c) letting the canvas engine handle drag *visually* at native/GPU speed without a React re-render on every frame, syncing back to the state model only at gesture start/end, and (d) treating multi-object drag as a single atomic delta applied to every selected object at once, committed as one history entry.

## 3. Correct architecture

- **Stable IDs**: assign a permanent unique id (uuid or monotonic counter) to every shape at creation; use this id as the React `key`, never the array index.
- **Normalized state shape**: store shapes as `{ [id]: shapeData }` plus an ordered `shapeIds: string[]` array for z-order — this makes id-based lookups O(1) and multi-shape commits straightforward, versus scanning/filtering a flat array repeatedly.
- **Immutable commits only**: every state update produces new objects/arrays; never mutate an existing shape object's fields directly.
- **Native Konva drag, React syncs only at gesture boundaries**: let Konva's built-in `draggable` handle the actual visual movement every frame (no React state update per `dragmove`); read the final node position only in `onDragEnd` (or a throttled `onDragMove` at most, if live position sync to other UI is needed) and commit then.
- **Atomic multi-select drag commit**: compute a single `{ dx, dy }` delta between drag-start and drag-end pointer positions (in stage-relative coordinates), and apply that identical delta to every currently-selected shape's stored position in one commit — do not rely on Konva's per-node visual state to "already be correct" for the non-primary dragged shapes.
- **Correct coordinate space**: always use `stage.getRelativePointerPosition()` (or the react-konva equivalent) for any position math, never raw browser event coordinates, so zoom/pan are always correctly accounted for.
- **History commits only on gesture end**: `dragend`/`transformend` are the only points that push a new undo/redo entry for a drag/resize/rotate gesture — never on intermediate move events.

## 4. What should change

- Audit shape creation code to confirm a permanent unique id is assigned once and never recomputed.
- Audit all `key={}` usages on rendered shape components — must be the shape's `id`, never an index.
- Audit every place shape state is updated for in-place mutation vs. proper immutable spread/copy.
- Rework multi-select drag to compute and commit a single shared delta across all selected shapes atomically.
- Replace any raw pointer-coordinate math with stage-relative coordinate helpers.
- Move all history-stack pushes for drag/resize/rotate to gesture-end handlers only.

## 5. Edge cases

- Dragging a multi-selection where shapes have different rotations applied.
- Dragging while the stage is zoomed in/out.
- Dragging with snapping (grid or shape-to-shape) active simultaneously — snapping should be computed from absolute position at each check, not accumulated as a delta-on-delta, to avoid floating-point drift over a long drag.
- Starting a second drag gesture before a prior commit has fully processed (rapid consecutive drags) — state updates should use functional/previous-state-based updates, not closures capturing a shape list from handler-creation time.
- Undo immediately after a multi-shape drag must revert all affected shapes together as one action, not one at a time.
- Deleting one shape while another is mid-drag (rare, but should not corrupt state).

## 6. Performance considerations

- Avoid recreating a new callback function per shape on every render (e.g., inline arrow functions in `.map()` capturing shape data) — this can cause every shape to re-render on any single shape's state change. Prefer passing the shape's `id` into a stable, memoized handler rather than closing over shape-specific data per render.
- Consider `React.memo` on individual shape components with a comparator scoped to that shape's own fields only.
- Use Konva's `layer.batchDraw()` appropriately rather than forcing full-layer redraws on every state change.
- For layers that don't need interaction (e.g., a background grid layer), set `listening={false}` to skip hit-graph computation for that layer entirely.

## 7. State management considerations

- Normalize shape storage as `{ [id]: shapeData }` + ordered `shapeIds` for O(1) lookups during multi-shape commits, rather than repeatedly scanning/filtering a flat array by id.
- Keep the "gesture in progress" transient data (drag-start pointer position, initial positions of all selected shapes) in local/ephemeral state, separate from the committed history-backed state, and only merge into the committed state on gesture end.

## 8. Konva/Canvas best practices

- Let Konva's native `draggable` prop and its internal position cache do the visual work — don't fight it by writing React state on every `dragmove` tick.
- Use `onDragEnd`/`onTransformEnd` as the sync points into React state.
- Read final positions from the actual Konva node (`node.x()`, `node.y()`, `node.rotation()`, etc.) at commit time rather than trusting intermediate event payloads.

## 9. UX best practices

- A multi-selected drag must feel like moving one rigid group — no member of the selection should lag, snap back, or visually detach at any point during or after the drag.
- Undo of a multi-shape drag should restore the entire group's prior positions in a single action, matching user expectation of "undo the thing I just did."

## 10. Implementation Prompt for AI Coding Agent

```
TASK: Fix shape/state desynchronization bugs that occur when dragging many objects (especially multi-selected groups) in an existing React + react-konva whiteboard editor, without rewriting unrelated code.

CONTEXT:
Existing production codebase, whiteboard/diagram editor built with React + react-konva, supporting many shapes on an infinite pannable/zoomable canvas with selection, drag, resize, and rotate.

BUG DESCRIPTION:
When many shapes exist and the user drags objects (particularly multiple selected objects at once), shapes become disorganized, sometimes separate unexpectedly from where they were dragged, transforms become incorrect, and the editor becomes increasingly unstable the more this happens.

INVESTIGATE THESE SPECIFIC HYPOTHESES FIRST:
1. Are shapes keyed in React by array index rather than a stable, permanent unique id assigned at creation time? Check every place shapes are rendered via .map().
2. Is shape state ever mutated in place (e.g., `shape.x = newValue`) rather than via a fully immutable update (new object, new array)? Search for direct property assignment on shape state objects.
3. When multiple shapes are selected and dragged together, does the code correctly compute and commit position updates for ALL selected shapes, or only for the specific shape the drag event originated on? This is the most likely primary cause of shapes "separating unexpectedly."
4. Is pointer/drop position math using raw browser event coordinates, or Konva's stage-relative pointer position (which accounts for current zoom and pan)? Raw coordinates will produce wrong positions especially away from default zoom/pan.
5. Is a new history/undo entry pushed on every dragmove tick, or only on dragend? Excessive intermediate commits can cause state races under load.
6. Are per-shape event handler functions being recreated on every render in a way that could cause unrelated shapes to re-render unnecessarily during a drag?

REQUIRED FIX:
1. Ensure every shape has a permanent, stable unique id assigned once at creation (via a uuid or monotonic counter) that is never regenerated, and ensure this id — not array index — is used as the React key wherever shapes are rendered.
2. Ensure all shape state updates are fully immutable: every commit produces new shape objects and a new top-level array/map, never mutating existing shape objects' fields directly. Refactor any in-place mutation found.
3. Rework multi-select drag handling so that: on drag start, capture the initial positions of every currently-selected shape plus the drag's starting pointer position (in stage-relative coordinates); on drag end, compute a single { dx, dy } delta from the drag gesture and apply that identical delta to every selected shape's stored position, committing all of them together as one atomic state update (and one undo/redo history entry).
4. Replace any raw event.clientX/clientY (or equivalent) position math with the Konva stage's relative-pointer-position method so zoom and pan are always correctly accounted for.
5. Ensure history/undo-redo entries for drag, resize, and rotate gestures are pushed only once, at gesture end (dragend/transformend) — never on intermediate move events.
6. Let Konva's native draggable behavior handle the actual visual movement during the drag (no React state updates on every dragmove tick for performance) — sync back to committed React state only at dragend.
7. If shape handler functions (onDragStart, onDragEnd, etc.) are currently being recreated per-shape on every render in a way that references shape-specific data via closures, refactor so handlers are stable/memoized and receive the shape's id as an argument instead, to avoid unnecessary re-renders of unrelated shapes.

CONSTRAINTS:
- Do not change the visual rendering of shapes, only their state management, id handling, and drag commit logic.
- Do not modify unrelated features (styling panel, export/import, laser tool, etc.).
- Preserve all currently-working single-shape drag, resize, and rotate behavior exactly — this fix should only affect correctness under multi-select and at-scale (many-shapes) conditions.
- If the codebase currently stores shapes as a flat array, you may normalize to an id-keyed map + ordered id array if it meaningfully simplifies the multi-shape atomic commit logic — state this decision explicitly if made, and update all code paths (rendering, history, export/import) consistently.

ACCEPTANCE CRITERIA:
- Dragging a single shape among 50+ shapes on canvas behaves correctly and consistently every time.
- Multi-selecting 5+ shapes and dragging them together moves all of them by the identical delta, with none lagging, snapping back, or detaching, both during the drag and after release.
- Undoing a multi-shape drag reverts all affected shapes to their prior positions in a single undo action.
- Dragging at non-default zoom/pan levels produces correct final positions matching where the user visually dropped the shape(s).
- Repeated drag operations (30+ consecutive drags across many shapes) do not degrade correctness or cause any shape to become detached from its expected position.

EDGE CASES TO TEST:
- Multi-select shapes with different individual rotations, then drag as a group.
- Drag at 50% zoom and at 200% zoom.
- Drag with grid snapping and/or shape-to-shape snapping active simultaneously, if those features exist in this codebase.
- Start a new drag gesture immediately after a previous one completes (rapid consecutive drags).
- Undo immediately after a multi-shape drag, then redo — verify full round-trip correctness.
- Delete one shape while a different shape is mid-drag (should not corrupt state).

TESTING CHECKLIST:
- [ ] Create 50+ shapes of mixed types; drag individual shapes repeatedly — no desync.
- [ ] Multi-select 10 shapes; drag the group across the canvas — all move together, none detach.
- [ ] Undo the above multi-drag — all 10 shapes revert together in one action.
- [ ] Redo — all 10 shapes move forward together in one action.
- [ ] Repeat multi-select drag test at 50% and 200% zoom levels.
- [ ] Repeat with grid/shape snapping enabled, if present.
- [ ] Rapidly perform 20+ consecutive single and multi-shape drags — no accumulated drift or desync.
- [ ] Check React DevTools profiler during a multi-shape drag — confirm unrelated shapes are not needlessly re-rendering during the gesture.

PERFORMANCE REQUIREMENTS:
- Dragging must remain smooth (no dropped frames perceptible to the user) with 100+ shapes on canvas.
- No React state updates should occur on every dragmove tick — only at gesture start (if needed for capturing initial state) and gesture end (for committing final state).

REGRESSION PREVENTION:
- Re-verify single-shape drag, resize, rotate, delete, undo/redo, JSON export/import, and PNG export all continue to work correctly after this change, since shape id/state structure changes could affect serialization.

Report back: what the shape id scheme currently was (index-based or stable id) and whether you changed it, whether any in-place mutation was found and fixed, exactly how the multi-select atomic drag commit was implemented, and confirmation that history commits now only occur at gesture end.
```
