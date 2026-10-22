# Implementation Plan: Portfolio Experience v1

**Branch**: `001-portfolio-experience` | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-portfolio-experience/spec.md`

## Summary

A single static page, published on GitHub Pages, that satisfies the i.c.stars portfolio
assignment on its own and layers the three immersive stages on top of it. All content, profile
links, architectural facts, and cutaway links are written in `index.html` as semantic markup, so
the page is complete with scripts off. Small, independent script modules then add the command
prompt, a hand-written Canvas 2D wireframe of Willis Tower (loaded only when its stage approaches),
and a scroll-driven descent into an SVG cutaway whose levels link to the portfolio sections.
No framework, no build step, and no third-party runtime code in v1 (see
[research.md](research.md) for each decision and its alternatives).

## Technical Context

**Language/Version**: HTML (living standard), CSS (custom properties, grid, media queries),
JavaScript ES2022 modules. No transpilation.

**Primary Dependencies**: None at runtime. Development uses tools already installed: Node 26
(built-in `node:test`), Python 3.14 (`http.server`), curl, Chrome/Edge DevTools and Lighthouse.

**Storage**: None. Content lives in `index.html`; the resume and images are static files.

**Testing**: `node --test tests/` for pure logic modules (command parsing, scroll progress, tower
geometry, content audit); `?audit` in-browser coverage report; Lighthouse and manual scenarios in
[quickstart.md](quickstart.md).

**Target Platform**: Current Chrome, Edge, Safari (macOS and iOS), Firefox, and Samsung Internet;
viewports 320–1920 px; served from GitHub Pages under a project path
(`https://jstephens-create.github.io/portfolio2.0/`), so all URLs are relative.

**Project Type**: Static website (single page).

**Performance Goals**: LCP ≤ 2.5 s on Lighthouse mobile; CLS ≤ 0.1; TBT ≤ 200 ms; tower and descent
≥ 30 fps on a mid-range phone (4× CPU throttling) and ≥ 60 fps on desktop; Lighthouse
Accessibility 100.

**Constraints**: Works with scripts disabled; respects `prefers-reduced-motion`; no phone number
or street address anywhere; no figure without a classification; transfer budgets below.

**Scale/Scope**: One page, 11 sections and subsections, at least 22 portfolio items, 33
architectural facts ([research.md](research.md#sourced-facts)), 7 cutaway levels, 1 resume PDF, a
handful of images. One author; public, read-only audience.

### Performance budgets

Compressed transfer sizes, measured with the cache disabled.

| Budget | Limit |
|---|---|
| Critical path: HTML + CSS + boot scripts | ≤ 60 KB |
| First view total, including headshot | ≤ 150 KB |
| Tower stage scripts (lazy) | ≤ 15 KB |
| Whole page, excluding resume PDF and evidence media | ≤ 300 KB |
| Resume PDF | ≤ 500 KB |
| Each content image | ≤ 150 KB, with responsive sizes |
| Web fonts | 0 KB in v1 (system font stacks) |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Pre-research | Post-design |
|---|---|---|---|
| I. Assignment Completeness | All sections, minimums, homepage items; first person; links tested | ✅ Requirement keys and minimums in [content-markup](contracts/content-markup.md); audit enforces | ✅ |
| II. Creative Direction Integrity | Entry, tower, descent preserved | ✅ All three are stories with their own modules | ✅ |
| III. Content Before Spectacle | Content works without scripts, 3D, or motion; skippable; WCAG 2.2 AA | ✅ Content in HTML; stages are enhancements | ✅ Quickstart scenarios 3, 4, 9, 11 |
| IV. Lightweight, Responsive | Lazy heavy assets; fallbacks; numeric budgets | ✅ Budgets above | ✅ No runtime dependency; tower ≤ 15 KB |
| V. Verified Data | Every figure classified and sourced | ✅ Facts table contract; audit check | ✅ [research.md](research.md) records sources |
| VI. Purposeful Motion and Drafted Design | Swiss grid, drafting conventions, motion with meaning, no glow | ✅ Monochrome linework; motion only for rotation and descent | ✅ |
| VII. Technology by Need | Each dependency justified against a simpler option | ✅ Zero runtime dependencies; Three.js evaluated and deferred | ✅ |
| VIII. Modular, Maintainable | Content separate from behavior; stage failures isolated | ✅ One module per stage; each loads in its own `try` | ✅ |
| IX. Repository Scope | Sources preserved; approvals for installs, commits, pushes, deploys | ✅ No source files moved; inspiration images not published | ✅ |

Result: **PASS**, no violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-experience/
├── plan.md               # This file
├── research.md           # Phase 0: decisions and sourced facts
├── data-model.md         # Phase 1: entities as markup
├── quickstart.md         # Phase 1: validation guide
├── content-inventory.md  # Worksheet for FR-012a (author fills in)
├── contracts/
│   ├── content-markup.md # Anchors, data attributes, requirement keys
│   ├── commands.md       # Entry prompt grammar
│   └── audit-report.md   # Coverage and release checks
├── checklists/
│   └── requirements.md
└── tasks.md              # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html                 # All content, facts table, cutaway SVG (single source)
css/
└── site.css               # Tokens, Swiss grid, typography, stages, reduced motion, print
js/
├── main.js                # Boot: capability checks, nav focus, lazy-load each stage in isolation
├── command.js             # parseCommand() (pure) + prompt wiring
├── descent.js             # scrollProgress() (pure) + sticky descent driver
├── audit.js               # ?audit report; loaded only on request
└── gis/
    ├── geometry.js        # buildTower(facts) → line segments (pure)
    └── render.js          # Canvas 2D projection, pointer/touch/keyboard input, labels
assets/
├── resume/                # Resume PDF (author supplies)
├── img/                   # Headshot and evidence images, optimized
└── svg/
    └── willis-elevation.svg  # Static fallback drawing; dimensions from research.md facts
tests/
├── command.test.js
├── descent.test.js
├── geometry.test.js
└── audit.test.js
```

Existing files stay where they are: `instruction.md`, `01_inspiration/`,
`Architectual-gis-wireframe/`, `readme.md` (updated per FR-044, not moved). The empty
`claude.md`, `skills.md`, and `speckit.md` are left untouched.

**Structure Decision**: Flat static-site layout at the repository root, because GitHub Pages
serves the root of `main` directly with no build. Pure logic sits in modules that tests import
without a browser; DOM wiring stays thin around them.

## Delivery order

Follows spec priorities and the 2026-11-23 due date. Each step is usable on its own.

1. **P1 content layer**: `index.html` with profile, navigation, all sections and pending items,
   facts table, static drawing, cutaway links; `site.css`; audit. Publishable as a complete,
   assignment-compliant page with placeholders.
2. **P2 entry**: command prompt and suggestions.
3. **P3 tower**: geometry from facts, Canvas 2D renderer, input, labels.
4. **P4 descent**: scroll-driven move from the skyline into the cutaway.
5. **Content workstream** (parallel, from the inventory): gather, write, and replace pending
   items; README update; final `?audit=release`.

Deployment to GitHub Pages and every commit and push need the author's approval at that time.

## Requirements Traceability

Every functional requirement maps to where it is built and how it is checked.

| Requirements | Built in | Checked by |
|---|---|---|
| FR-001, FR-004, FR-005 | Profile header in `index.html`; resume PDF in `assets/resume/` ([data model](data-model.md#professional-profile), [markup](contracts/content-markup.md#profile-links)) | Audit (profile links, phone pattern); quickstart scenario 1; resume check |
| FR-002, FR-003 | Persistent `<nav>`; fixed anchors ([markup](contracts/content-markup.md#sections-and-anchors)) | Quickstart scenarios 1, 2 |
| FR-006, FR-006a, FR-007, FR-008, FR-009 | Sections and items in `index.html` ([markup](contracts/content-markup.md#portfolio-items), [requirement keys](contracts/content-markup.md#requirement-keys)) | Audit (coverage, labels, duplicates, pending) |
| FR-010 | `data-evidence` links; `alt` on images | Audit (images); link check |
| FR-011 | Content only in `index.html`; cutaway levels are links, not copies | Quickstart scenario 10 |
| FR-012, FR-012a | `js/audit.js` (`?audit`); [content-inventory.md](content-inventory.md); `data-source` | Audit (external sources); link check landing URLs |
| FR-013 – FR-018 | `js/command.js` ([commands](contracts/commands.md)) | `tests/command.test.js`; quickstart scenarios 5, 6 |
| FR-019 – FR-025 | `js/gis/geometry.js`, `js/gis/render.js`; facts table; `willis-elevation.svg` ([research](research.md#decision-tower-rendering)) | `tests/geometry.test.js`; audit (facts); scenarios 7, 8, 9 |
| FR-026 – FR-029 | `js/descent.js`; cutaway SVG in `index.html` ([research](research.md#decision-underground-descent)) | `tests/descent.test.js`; audit (cutaway levels); scenarios 4, 10 |
| FR-030 – FR-036 | Semantic markup, skip link, `site.css` tokens and reduced-motion rules, facts table as text equivalent | Lighthouse accessibility; scenarios 3, 4, 11, 12 |
| FR-037 – FR-041 | Lazy loading and per-stage isolation in `js/main.js`; budgets above | Lighthouse performance; Network panel budgets; scenarios 9, 13 |
| FR-042, FR-043 | `site.css` visual system ([research](research.md#decision-typography-and-visual-system)); inspiration images not published | Design review against Principle VI |
| FR-044 | `readme.md` update (delivery step 5) | Review before release |

## Unresolved Issues

None block task generation. Each is tracked so it is settled before the step that needs it.
Resolved 2026-10-22 by the author: tower renderer stays Canvas 2D; the Pedway appears as labeled
Loop context.

| Issue | Needed by | Owner |
|---|---|---|
| Setback floors and pairs (50/66/90) rest on one secondary source; confirm from SOM, CTBUH, or CAC material | Delivery step 3 (shown as approximate until then) | Research task |
| Not found in any source: individual antenna heights, caisson depth, freight tunnels under adjacent streets, Lower Wacker clearances | Shown as "pending verification" | Research task, optional |
| Author content, resume PDF, headshot, profile URLs | Final release (v1 ships with marked placeholders) | Author, via content inventory |
| Inspiration files not yet reviewed (`2.png`, `4.png`, one ChatGPT image, two 2026-10-16 screenshots, `Xbox.0.mov`) | Before visual polish | Author review |
| GitHub Pages enablement for `main` | Before first deploy | Author approval |

## Complexity Tracking

No constitution violations. One deliberate departure from a reference document is recorded in
[research.md](research.md#decision-tower-rendering): the GIS README suggests Three.js and
OrbitControls; v1 uses a hand-written Canvas 2D renderer instead, with explicit conditions for
adopting Three.js later.
