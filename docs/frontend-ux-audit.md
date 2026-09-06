# Frontend UX audit

Date: 2026-09-06  
Scope: every currently routed product surface at `#/`, `#/board`, `#/docs`, `#/thank-you`, `#/waitlist`, and unknown routes, reviewed at 1440px and 390px widths. The board review includes its splash, canvas, toolbar, inspector, zoom controls, account/settings panels, board recovery dialog, cookie banner/preferences, feedback dialog, user messages, and processing/error states.

## Product design direction

Kanvas is an intentionally calm personal whiteboard: a place to think, draw, and organize without turning the work surface into a dashboard. The product should feel editorial and welcoming before entry, then precise, quiet, and operational while making. The existing green mark is the connective cue between those modes. The visual system should use that cue sparingly, reserve rich colour for actual canvas content, and make state and hierarchy do the explanatory work.

## Page-by-page findings

### Landing page (`#/`)

**What works:** The hero communicates the product quickly, the board mockup is recognizable, and primary conversion remains clear.

**Issues**

- The public palette, rounded floating header, pill CTAs, and pastel illustrations do not share the editor's neutral, green-led visual language. It feels like a different product.
- The hero is visually strong but places a decorative mockup ahead of the reading order on narrow screens. The user encounters simulated controls before the product promise.
- Header action hierarchy is unclear: the primary dark pill has no visible label in the reviewed mobile layout and header navigation offers no consistently exposed route back from secondary pages.
- Repeated card treatments, soft coloured backgrounds, and visual ornaments make later sections compete with the product evidence.
- “Pro / coming soon” is presented as a full pricing card although it is not actionable, creating an avoidable dead end.
- Keyboard focus treatment and skip navigation are not visible; hover/focus states vary by section.

### Documentation (`#/docs`)

**What works:** Content is structured around tasks, the canvas-grid motif is relevant, and the desktop three-column reference layout supports deep reading.

**Issues**

- Documentation header uses a different identity lockup and action treatment from the landing page and editor.
- At 390px the primary “Open Whiteboard” CTA becomes an unlabeled green square. This is a critical responsive failure.
- Mobile navigation and “On this page” controls sit over the content at the bottom of the viewport, reducing usable reading area and appearing before users understand what they open.
- Multiple ornamental section breaks, illustrated cards, and mixed pastel accents weaken the scan path and make instructional content look more like a brochure than a reference.
- Long-form hierarchy needs more consistent heading, code/key, callout, and link styling. Desktop side navigation also lacks a clear active-location state.
- Navigation / on-page panels need robust dialog semantics, focus management, escape support, and a visible close affordance on compact screens.

### Whiteboard and editor (`#/board`)

**What works:** The underlying canvas is intentionally sparse, the left tool rail is discoverable, the default board has a clear title and basic save state, and the design toolbar exposes useful board actions.

**Issues**

- The editor is compact and green-led while public pages are pastel and heavily rounded. Buttons, shadows, text weights, icon sizes, radii, and control groupings are inconsistent across the product.
- The top bar contains several floating blocks with no shared density or action hierarchy. “Export board”, home, learn, and account each use different visual patterns.
- Mobile collapses meaningful labels to icon-only controls without enough tooltip/tap-target support; the board title and save status disappear. This makes recovery and orientation harder on a small screen.
- The cookie banner covers a large portion of the drawing surface, especially at 390px, and turns the first canvas interaction into a consent-navigation task.
- The left rail is a long unlabeled icon stack. Its active state is subtle, keyboard shortcuts are hidden, and the collapse affordance is separated from the initial tool grouping.
- Inspector, account panel, export menu, feedback modal, and prior-board dialog each use different panel/chrome patterns. Several dialogs do not fully restore focus or expose an explicit close mechanism.
- Empty-board guidance is minimal. A non-intrusive first-run hint or compact help entry point should explain the initial next action without obscuring the canvas.
- The five-second splash is a fixed wait rather than meaningful loading feedback; it blocks returning users from their board.
- Error handling is a transient toast with automatic retries only. It does not offer a stable recovery action or error context once retries are exhausted.

### Settings, account, and feedback surfaces

**What works:** Profile, appearance, defaults, support, and feedback are discoverable from the account area.

**Issues**

- Settings are embedded in an account menu rather than having a durable information hierarchy. Section headings and destructive actions need clearer grouping and confirmation language.
- Form controls, swatches, radios, secondary actions, and saved/error messages do not share a common state model.
- Feedback has focus on open and Escape support, but does not trap focus, has no visible close control, and its error/success treatment differs from other overlays.
- Support currently uses a placeholder email address in the UI.

### Restore-board dialog, cookie preferences, processing, and error states

**What works:** A previous board can be restored or replaced, image processing is announced, and cookie choices include a reject path.

**Issues**

- Modal language, icon decoration, footer notes, button hierarchy, and panel dimensions differ from the feedback and cookie dialogs.
- The previous-board dialog has a narrow two-button focus loop but no Escape dismissal or focus-return contract.
- Cookie preferences lacks a dialog role, modal semantics, focus trap, initial focus, and a visible close action. The banner placement is disruptive inside an interactive canvas.
- Processing feedback is visually detached from the action that caused it; failure reporting relies on console messages or short-lived toasts.
- ErrorBoundary intentionally auto-retries but, after retries, offers no “try again”, “return home”, or retained recovery option.

### Thank-you, waitlist, and unknown route (`#/thank-you`, `#/waitlist`, unknown routes)

**Issues**

- These routes use oversized decorative typography and illustrations unrelated to the landing and editor systems.
- Thank-you and 404 have no next-step CTA, navigation, or route back to the board/home. The 404 route is a dead end.
- Waitlist is visually dominated by a large wordmark/clock image, leaving the form and its status messaging visually secondary.
- Validation, error, loading, duplicate-submission, and successful submission states need shared inline feedback and consistent page framing.

## Prioritized issue list

| Priority | Problem | Why it matters | Planned treatment |
| --- | --- | --- | --- |
| P0 | Mobile documentation CTA becomes unlabeled; mobile board hides essential context; cookie banner blocks canvas | Core navigation and the primary task become unclear or obstructed | Preserve action labels where possible, use responsive overflow rules, compact/reposition consent UI |
| P0 | No coherent cross-product design system | Users switch between what appears to be separate products; maintenance is fragmented | Establish shared tokens, control primitives, focus states, overlays, and responsive rules first |
| P0 | Recovery and terminal pages have no durable action | Error, 404, thank-you, and waitlist routes strand users | Add clear route-preserving recovery actions and consistent status UI |
| P1 | Inconsistent menus, dialogs, panels, and form states | Increases cognitive load and leaves accessibility gaps | Normalize panel chrome, keyboard semantics, close behavior, focus treatment, and state presentation |
| P1 | Editor tool/action hierarchy and discoverability | Slows onboarding in the product's primary workflow | Clarify top-bar action tiers, label/reveal tools responsively, improve active/disabled states |
| P1 | Marketing visual noise and uneven conversion hierarchy | Dilutes the real whiteboard value proposition | Reduce ornamental competition, align public palette and type with product identity |
| P2 | Docs scan patterns and side-nav state | Makes reference use slower than necessary | Standardize document typography, anchor state, compact navigation behavior |
| P2 | Fixed startup wait | Adds perceived latency on repeat use | Make loading feedback feel intentional and avoid unnecessary blocking when safe |

## Unified design system to implement

### Foundations

- **Type:** retain the installed system-forward type stack. Use one display scale for marketing/documentation headings and one compact UI scale for editor controls.
- **Colour:** ink and paper neutrals for hierarchy; Kanvas green for selected, primary, and success states; canvas content colours remain distinct from UI state. Remove arbitrary purple/blue/coral UI accents unless they communicate semantic shape content.
- **Spacing:** 4px base unit, with 8, 12, 16, 24, 32, 48, and 72px composition steps.
- **Shape and elevation:** 8px controls, 12px panels/cards, 16px feature surfaces. One restrained panel shadow and one stronger overlay shadow.
- **Motion:** short opacity/transform transitions only; honour reduced motion. No decorative motion required for comprehension.

### Shared components and interaction rules

- One primary, secondary, quiet, destructive, icon, and disabled button treatment.
- One input, textarea, checkbox, radio, range, and swatch state system with visible focus rings and accessible labels.
- One popover/menu and modal/panel shell: predictable header, close action, action footer, keyboard and focus behavior.
- One toast/notice style for success, processing, warning, and error, with enough persistence for a user to act.
- One navigation pattern: identifiable brand link, labelled primary action, compact mobile menu, and consistent return path.
- One documentation content system: headings, body text, keyboard keys, callouts, links, and active anchors.

## Implementation order

1. Add foundation tokens and reset/focus/motion rules without altering functionality.
2. Normalize shared editor controls, overlays, forms, and responsive behavior.
3. Align landing and documentation navigation, typography, content surfaces, and mobile layouts.
4. Refine terminal/feedback/recovery states and add actionable route exits.
5. Validate all routes, overlays, keyboard interactions, desktop/mobile screenshots, and the production build.
