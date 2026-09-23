# Whiteboard editor UX audit

## Scope and method

Reviewed the live board at desktop (1440 x 900) and mobile (390 x 844), then traced the editor controls through the existing toolbar, inspector, zoom, and canvas components. The canvas interaction and state flow are intentionally out of scope: this pass changes only visual treatment, interaction affordances, and accessible state communication.

## What is already working

- The canvas remains the primary surface, with keyboard-addressable select, pan, shape, freehand, laser, eraser, text, and image tools.
- Pointer drawing, selection, transform, text editing, pan, zoom, undo/redo, import, export, and recoverable-operation feedback are implemented and did not produce browser console or page errors in the interaction pass.
- The inspector appears for compatible tools and selected objects, and its batched style updates avoid history noise.
- The header keeps file, export, account, and documentation paths available without putting a permanent modal over the canvas.

## Findings, prioritized

### P0 - correct before visual polish

1. The empty-canvas onboarding DOM is rendered below the viewport in the live editor, so new users do not receive the intended first-use guidance.
2. The active selection frame uses the rendering library's default visual language rather than the board's green control language. It makes selection feel disconnected from the rest of the editor.

### P1 - clarity and accidental-interaction reduction

1. The 12-icon tool rail depends on browser-native `title` tooltips. Those are delayed, inconsistent across browsers, and absent for keyboard discovery. The selected tool is indicated only by a small dot and a light surface change.
2. The right inspector has strong capability coverage but weak contextual framing. Its tabs do not expose their selected state to the associated panel, and option buttons do not announce their chosen state.
3. At 390 px, header controls compress into a visually incidental row. The board title, export action, and account control compete for too little width. The mobile inspector also sits in the same lower-right region as zoom controls.
4. The left rail shifts away from the viewport edge on mobile, creating an unexplained gutter and reducing useful canvas space.

### P2 - hierarchy and consistency

1. The header's document identity, export action, navigation, and account controls have independently evolved visual treatments. They need a more consistent focus, hover, and grouping language.
2. Tool controls, inspector controls, and zoom controls use slightly different corner, border, and active-state conventions. This makes the editor feel assembled rather than intentional.
3. The empty state contains decorative guidance that competes with the tools. A small centered orientation message is more useful than arrows that attempt to direct attention.

## Change plan

1. Repair the empty-state placement and reduce it to compact, non-blocking onboarding.
2. Strengthen tool, selection, inspector, menu, zoom, focus, and tooltip affordances without changing their action handlers.
3. Give mobile a deliberate compact header, edge-aligned tool rail, and non-overlapping inspector position.
4. Validate desktop and mobile interaction paths, light and dark presentation, keyboard state, menus, and build/test output.

## Explicit non-goals

- No rendering-engine replacement, state-architecture rewrite, tool removal, shortcut reassignment, or export/import behavior changes.
- No invented collaboration, account, cloud, or canvas capabilities.
