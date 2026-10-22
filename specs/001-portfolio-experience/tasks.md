---

description: "Task list for Portfolio Experience v1"
---

# Tasks: Portfolio Experience v1

**Input**: Design documents from `specs/001-portfolio-experience/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: Requested. Every pure logic module gets a `node:test` file written first and confirmed
failing before the module exists. DOM and visual behavior are verified with the numbered
scenarios in [quickstart.md](quickstart.md#manual-scenarios).

**Organization**: Tasks are grouped by user story so each story can be built, tested, and shown
on its own. Every task ends with **Done when**, its acceptance criterion.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on unfinished tasks)
- **[Story]**: US1–US5, matching the user stories in [spec.md](spec.md)
- Paths are relative to the repository root, per the [plan structure](plan.md#source-code-repository-root)

## Approval gates

These need the author's decision or approval before the listed tasks start. No task commits,
pushes, installs, or deploys without approval at that time.

| Gate | Before | Question |
|---|---|---|
| G1 | T027 | Tower renderer: **resolved 2026-10-22, Canvas 2D** |
| G2 | T034 | Pedway: **resolved 2026-10-22, labeled Loop context** |
| G3 | T049 | Merge to `main`, push, and enable GitHub Pages |

---

## Phase 1: Setup

**Purpose**: Create the folders the plan defines. No dependencies are installed.

- [ ] T001 Create the folders `css/`, `js/`, `js/gis/`, `assets/resume/`, `assets/img/`, `assets/svg/`, and `tests/` at the repository root, leaving `instruction.md`, `01_inspiration/`, `Architectual-gis-wireframe/`, `readme.md`, `claude.md`, `skills.md`, and `speckit.md` untouched. **Done when**: the folders exist and `git status` shows no change to existing files.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The page shell, base styles, and stage loader that every story builds on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 Write the page shell in `index.html`: `<!doctype html>`, `<html lang="en">`, charset and viewport meta, `<title>Jordan Stephens · Portfolio</title>`, meta description, `<link rel="stylesheet" href="css/site.css">`, `<script type="module" src="js/main.js">`, a skip link to `#main` as the first focusable element, `<header>`, `<nav aria-label="Portfolio sections">`, `<main id="main">`, and `<footer>`. Inside `<main>`, add one empty `<section>` per fragment in [contracts/content-markup.md](contracts/content-markup.md#sections-and-anchors), in this order: `entry`, `gis`, `descent`, `identity`, `leadership`, `business`, `technology`, `career`, `wellness` (containing `wellness-financial`, `wellness-emotional`, `wellness-mental`, `wellness-physical`), `contact`, each with its listed heading, `data-section`, and `data-minimum` values. Use relative URLs only. **Done when**: every fragment exists exactly once, headings run `h1` → `h2` → `h3` without skips, and the page loads at <http://localhost:8000/> with no console errors.
- [ ] T003 [P] Write the base styles in `css/site.css`: color tokens on `:root` (`--bg`, `--fg`, `--muted`, `--rule`, `--accent` as international orange) with a comment recording each text/background contrast ratio (≥ 4.5:1 for text, ≥ 3:1 for UI and focus); system font stacks from [research.md](research.md#decision-typography-and-visual-system); a 12-column grid; `.visually-hidden`; a 2 px `--accent` `:focus-visible` outline; `img, svg, canvas { max-width: 100%; }`; `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`; and a `@media print` block with light colors that hides interactive stage controls. **Done when**: contrast ratios in the comment all meet the thresholds, and quickstart scenario 13 (320 px) shows no horizontal page scroll on the empty shell.
- [ ] T004 [P] Write the stage loader in `js/main.js`: add class `js` to `<html>`; a `loadStage(name, importFn)` helper that awaits a dynamic `import()` inside `try`/`catch`, calls the module's `init(section)`, and on any failure logs `console.warn` and leaves the page untouched; load `command` immediately; load `gis/render` and `descent` when their sections come within one viewport (`IntersectionObserver`, `rootMargin: "100% 0px"`); load `audit` only when `new URLSearchParams(location.search).has('audit')`. **Done when**: with `js/command.js` missing, the page still loads, other stages still initialize, and only a warning is logged (FR-039).

**Checkpoint**: Shell, styles, and isolated stage loading are ready.

---

## Phase 3: User Story 1 - Direct professional access (Priority: P1) 🎯 MVP

**Goal**: Name, resume, LinkedIn, GitHub, email, and "Chicago, IL" in the first view, plus navigation to every section.

**Independent Test**: Quickstart scenarios 1 and 2 at 375×667 and 1440×900, with scripts on and off.

- [ ] T005 [US1] Add the profile block to the `<header>` in `index.html`: `h1` with the author's name; entries with `data-profile` = `email`, `location` (text "Chicago, IL"), `resume-view`, `resume-download`, `linkedin`, `github`; `location` starts `data-status="supplied"` and all others start `data-status="pending"`. Per the data model, "A pending field renders as marked text, never as a link" and "Phone number and street address are not fields and MUST NOT appear." When supplied, `resume-view` uses `target="_blank" rel="noopener"` with visually hidden text "(opens in new tab)", and `resume-download` uses the `download` attribute, both pointing to `assets/resume/` (FR-001, FR-004, FR-005). **Done when**: quickstart scenario 1 shows all six entries without scrolling at both sizes, and no pending entry is an `<a>`.
- [ ] T006 [US1] Add the persistent section navigation inside `<nav>` in `index.html`: links to `#identity`, `#leadership`, `#business`, `#technology`, `#career`, `#wellness`, `#contact`, each prefixed with its index numeral `01`–`07` (FR-002). **Done when**: every section is one activation away from the top of the page.
- [ ] T007 [US1] Style the header, profile block, and navigation in `css/site.css`: the header stays reachable while scrolling (sticky), the nav may scroll sideways within itself on narrow screens but the page never does, and pending entries are marked by a text label, not color alone (FR-036, FR-041). **Done when**: quickstart scenarios 1, 12 (200% text), and 13 (320 px) pass.
- [ ] T008 [US1] Add hash navigation focus in `js/main.js`: on load with a fragment and on `hashchange`, give the target section's heading `tabindex="-1"` and move focus to it, without replaying any stage (FR-003). **Done when**: quickstart scenario 2 opens `/#wellness-mental` focused on its heading, and browser back/forward returns to the previous section.

**Checkpoint**: A visitor can reach every professional link and section directly.

---

## Phase 4: User Story 2 - Complete, requirement-mapped portfolio content (Priority: P1)

**Goal**: Every section and Wellness subarea with requirement-labeled items, pending items clearly marked, and a coverage audit.

**Independent Test**: Open `?audit`: no `fail` rows, pending content shown as `warn`; compare sections against the [Assignment Requirement Map](spec.md#assignment-requirement-map).

### Tests for User Story 2 ⚠️

- [ ] T009 [P] [US2] Write `tests/audit.test.js` for a pure `runAudit(model, { mode })` imported from `js/audit.js`: one passing and one failing fixture for every check in [contracts/audit-report.md](contracts/audit-report.md#report) (section coverage counting only non-bonus items, unknown requirement key, duplicate key, pending count, `external` without `data-source`, pending profile entry, image without `alt`, "a `verified` fact without a source, or a `pending` fact with a value", phone-number pattern in page text (`\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}`, with fixtures proving the building address "233 South Wacker Drive, Chicago 60606", heights such as "1,451 ft", and coordinates do not match), cutaway `href` with no matching section), plus `mode: 'release'` turning pending content and pending profile entries from `warn` to `fail`. **Done when**: `node --test tests/audit.test.js` runs and fails because `js/audit.js` does not exist yet.

### Implementation for User Story 2

- [ ] T010 [US2] Write `js/audit.js`: the pure `runAudit(model, { mode })`; `collectModel(document)` that reads the markup in [contracts/content-markup.md](contracts/content-markup.md) into a plain model (sections with `id`, `minimum`, items with `requirement`, `status`, `source`; profile entries; images; facts; cutaway levels; page text); the requirement-key list copied from the contract's [Requirement keys](contracts/content-markup.md#requirement-keys) table; and `init()` that renders the results as a table in a fixed panel, `mode: 'release'` when the URL has `audit=release`. Item status values are exactly `pending`, `external`, `gathered`, `draft`, `final`. **Done when**: T009 passes and `?audit` shows a results table on the shell.
- [ ] T011 [US2] Add Identity items to `#identity` in `index.html`: `<article data-item>` for `identity.introduction` ("2–4 first-person sentences"), `identity.headshot`, and `identity.mission-statement`, each `data-status="pending"` with the marker `Content pending — Identity: {requirement label}.` (FR-006a, FR-009). **Done when**: three pending items render and the audit reports no unknown keys.
- [ ] T012 [US2] Add Leadership items to `#leadership` in `index.html`: one pending `<article data-item>` per non-bonus option (`team-week`, `gifts-project`, `community-role`, `feedback-workshops`, `tea-host`, `tea-debriefs`, `dream-speech`, `civics-project`), titles from the [requirement map](spec.md#assignment-requirement-map), marker text per the contract. The author removes unchosen options later (T040). **Done when**: the audit shows Leadership coverage ≥ 5.
- [ ] T013 [US2] Add Business items to `#business` in `index.html`: one pending item per non-bonus option (`client-project`, `consulting-company`, `rfp-proposal`, `engagement-days`, `mentor-feedback`, `external-guests`). **Done when**: the audit shows Business coverage ≥ 4.
- [ ] T014 [US2] Add Technology items to `#technology` in `index.html`: one pending item per non-bonus option (`web-app`, `geek-week`, `coding-clicked`, `debugging-growth`, `github-collaboration`, `cloud-tools`, `business-tools`, `typing-speed`, `five-hour-minimums`). **Done when**: the audit shows Technology coverage ≥ 5.
- [ ] T015 [US2] Add Career Planning items to `#career` in `index.html`: one pending item per non-bonus option (`career-plans`, `career-director`, `employer-workshops`, `resume-prep`, `professional-brand`, `target-roles`). **Done when**: the audit shows Career coverage ≥ 4.
- [ ] T016 [US2] Add Wellness items in `index.html`: in each of `#wellness-financial`, `#wellness-emotional`, `#wellness-mental`, `#wellness-physical`, one pending item per non-bonus option listed for that subarea in the contract, with `h4` titles under the `h3` subarea heading. **Done when**: the audit shows each subarea with coverage ≥ 1.
- [ ] T017 [US2] Fill `#contact` in `index.html` with the email, "Chicago, IL", LinkedIn, and GitHub entries using the same `data-profile` / `data-status` rules as T005, and no phone number or street address. **Done when**: the audit's forbidden-contact check passes.
- [ ] T018 [US2] Style sections and items in `css/site.css`: section index numerals, ruled grid cells, item headings, evidence links, and the pending marker shown with a visible "PENDING" text label plus a dashed outline (not color alone). **Done when**: quickstart scenarios 3 (scripts off) and 12 (200% text) show every item readable, and the pending state is identifiable in grayscale.

**Checkpoint**: US1 + US2 form a complete, assignment-compliant page with placeholders (MVP).

---

## Phase 5: User Story 3 - Command-style entry (Priority: P2)

**Goal**: A command prompt beside the profile that reaches every destination, with tappable suggestions.

**Independent Test**: Quickstart scenarios 5 and 6.

### Tests for User Story 3 ⚠️

- [ ] T019 [P] [US3] Write `tests/command.test.js` for `parseCommand(input)` imported from `js/command.js`, covering [contracts/commands.md](contracts/commands.md): trimming, lower-casing, ignoring a leading `/`, `>` or `$`; every name and alias (including `career planning`) mapping to its destination and response text; `resume` returning a resume action; `help`, `?`, `ls` listing every command name; empty and unknown input returning the exact unknown-command text. **Done when**: the test runs and fails because `js/command.js` does not exist yet.

### Implementation for User Story 3

- [ ] T020 [US3] Write `js/command.js`: the pure `parseCommand(input)` returning `{ action: 'navigate' | 'resume' | 'help', target, message }`, and `init(section)` that handles form submit (prevent default), writes `message` to the `role="status"` element, sets `location.hash` for navigation (focus handled by T008), and opens the resume link's `href` in a new tab when it is supplied (or reports that it is pending). The prompt never auto-focuses on any device. **Done when**: T019 passes.
- [ ] T021 [US3] Add the entry markup to `#entry` in `index.html`: a `<form>` with a visible `<label>`, `<input type="text" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="go">` without `autofocus`, a submit button, a `<p role="status" aria-live="polite">`, and a suggestion list of plain links for every command except `help` (`#gis`, `#identity` … `#contact`, and the resume entry). Place it beside, not in front of, the profile block. **Done when**: with scripts off the suggestions work as links, and quickstart scenarios 5 and 6 pass with scripts on.
- [ ] T022 [US3] Style the prompt in `css/site.css`: monospace stack, `caret-color: var(--accent)`, suggestion links as a wrapped row with targets at least 24×24 px, response text that appears immediately with no typing animation. **Done when**: quickstart scenarios 6 (touch) and 13 (320 px) pass.

**Checkpoint**: The entry works alone and degrades to navigation without scripts.

---

## Phase 6: User Story 4 - Chicago GIS wireframe of Willis Tower (Priority: P3)

**Goal**: A rotatable, zoomable wireframe built from the facts table, with classified annotations and a static fallback.

**Independent Test**: Quickstart scenarios 7, 8, and 9.

**Gate G1** resolved: Canvas 2D (author, 2026-10-22).

### Tests for User Story 4 ⚠️

- [ ] T023 [P] [US4] Write `tests/geometry.test.js` for `js/gis/geometry.js`: `buildTower(facts)` returns 9 tubes on a 75 ft grid named `NW N NE W C E SW S SE` (north up); all 9 reach the floor-50 height, 7 continue above it, 5 above floor 66, and 2 (`W`, `C`) above floor 90; tube top height = setback floor × (`height-architectural` ÷ `floors-above`); the base measures 225 × 225 ft; `buildTower` returns `null` when any required fact is `pending` or missing; `project(point, view)` returns the same screen point after a 360° azimuth change (within 1e-9); `clampZoom(z)` keeps zoom within 0.5–4× and `clampTilt(t)` keeps tilt within 5°–60°. **Done when**: the test runs and fails because the module does not exist yet.

### Implementation for User Story 4

- [ ] T024 [US4] Add the tower facts table to `#gis` in `index.html`: a `<table>` with caption "Willis Tower: technical data" and one `<tr data-fact data-class>` row for each of the 20 rows in [research.md › Tower](research.md#tower), using the exact values, classes, and sources there; columns label, value with unit, classification in words, source link; notes for the 110-floor and 1973 disagreements (FR-021, FR-022, FR-034). **Done when**: the audit's facts check passes, and every `verified` row links to its source.
- [ ] T025 [P] [US4] Draw `assets/svg/willis-elevation.svg`: a to-scale elevation and 3×3 plan diagram using the research figures, with setback floors labeled "approximate (secondary source)", monochrome linework, `role="img"`, and `<title>` and `<desc>`; embed it in `#gis` as the default view (FR-024). No antennas are drawn, because individual antenna heights are unverified. **Done when**: quickstart scenario 9 shows the drawing with scripts off.
- [ ] T026 [US4] Write `js/gis/geometry.js`: pure `buildTower(facts)` returning tubes and line segments (tube edges, floor lines spaced by `floor-height`, and a schematic block outline for Wacker, Adams, Franklin, Jackson labeled interpretation), `project(point, { azimuth, tilt, zoom, width, height })`, `clampZoom(z)` (0.5–4×), and `clampTilt(t)` (5°–60°). **Done when**: T023 passes.
- [ ] T027 [US4] Write `js/gis/render.js` `init(section)`: read the facts table into a facts object; call `buildTower` and keep the static drawing if it returns `null`; otherwise create a `<canvas tabindex="0" role="img">` described by the table caption, scaled for `devicePixelRatio` and resized with `ResizeObserver`; draw only when the view changes (one `requestAnimationFrame` per change); set `touch-action: pan-y` so vertical swipes scroll the page and horizontal drags rotate; mouse vertical drag adjusts tilt through `clampTilt` (5°–60°); wheel and pinch zoom through `clampZoom`; keys `ArrowLeft`/`ArrowRight` rotate 15°, `+`/`-` zoom, `Home` resets; add visible rotate, zoom, and reset buttons; on success add `is-live` to the section (FR-019, FR-020, FR-025). **Done when**: quickstart scenarios 7 and 8 pass, including a full 360° turn by pointer, touch, and keyboard, and rotation holds ≥ 30 fps at 4× CPU throttling and ≥ 60 fps unthrottled.
- [ ] T028 [US4] Add annotations in `js/gis/render.js`: HTML labels positioned at projected anchor points for architectural height, highest occupied floor, each setback tier, tube size at the base, and coordinates at ground level, each showing its classification in words; orange point markers as anchors; a circular bearing ring with tick marks, a north marker using `orientation`, and a live `NNN°` view-angle readout; plus a persistent label on the model: "Reconstruction from published dimensions; not a surveyed model" (FR-023). **Done when**: every label in quickstart scenario 7 shows its classification, and labels stay attached while rotating.
- [ ] T029 [US4] Style the tower stage in `css/site.css`: canvas aspect and sizing, monospace annotation labels, orange anchors, control button layout (targets ≥ 24×24 px), the bearing ring, and `.is-live` hiding the static drawing. **Done when**: quickstart scenarios 7, 9, and 13 pass.

**Checkpoint**: The tower works alone, and the page stays complete when it fails.

---

## Phase 7: User Story 5 - Underground descent into the portfolio (Priority: P4)

**Goal**: Scrolling past the tower descends into a drafted cutaway whose seven labeled levels open the portfolio sections.

**Independent Test**: Quickstart scenarios 4 and 10.

**Gate G2** resolved: labeled Loop context (author, 2026-10-22).

### Tests for User Story 5 ⚠️

- [ ] T030 [P] [US5] Write `tests/descent.test.js` for `scrollProgress(sectionTop, sectionHeight, viewportHeight)` from `js/descent.js`: 0 before the section, 1 after it, linear in between, clamped to [0, 1], and the same value at the same position whether reached scrolling down or up. **Done when**: the test runs and fails because the module does not exist yet.

### Implementation for User Story 5

- [ ] T031 [US5] Write `js/descent.js`: pure `scrollProgress()`, and `init(section)` that attaches a passive, `requestAnimationFrame`-throttled scroll listener only while `#descent` intersects the viewport (`IntersectionObserver`), writes the progress to the `--descent` custom property, and does nothing while `prefers-reduced-motion: reduce` matches (re-checking on change) (FR-026, FR-033, FR-040). **Done when**: T030 passes.
- [ ] T032 [US5] Add the underground facts table to `#descent` in `index.html`: one `<tr data-fact data-class>` row for each of the 13 rows in [research.md › Ground and underground](research.md#ground-and-underground), same format as T024. **Done when**: the audit's facts check passes.
- [ ] T033 [US5] Add a skip control at the top of `#descent` in `index.html`: a link "Skip to portfolio" to `#identity`, always visible on touch screens and visible on focus elsewhere (FR-028). **Done when**: keyboard users can pass the descent in one activation (quickstart scenario 11).
- [ ] T034 [US5] Draw the cutaway as inline SVG in `#descent` in `index.html`, layers from top to bottom: street and Lower Wacker, basement (43 ft below Franklin St), Pedway as Loop context labeled "no known connection to Willis Tower" (gate G2), freight-tunnel level at 40 ft labeled "location under this block not verified", caissons to bedrock, and limestone bedrock at about 100 ft. Use `<pattern>` hatching by material (soil, concrete, limestone) per drafting convention, a depth scale whose labels show each fact's classification, and exactly seven `<a class="level" href data-level>` elements for `identity`, `leadership`, `business`, `technology`, `career`, `wellness`, `contact`, each with visible text such as "01 Identity · Street level". Label the level spacing per the data model: "Spacing between levels is interpretation and is labeled so." Give the SVG a `<title>` and `<desc>`. Also place `assets/svg/willis-elevation.svg` as `<img alt="">` above the cutaway inside the descent's inner viewport, so the tower can rise out of view (FR-027, FR-029). **Done when**: the audit's cutaway check passes, and each level is keyboard-focusable and opens its section with scripts off.
- [ ] T035 [US5] Style the descent in `css/site.css`: only under `.js` and `prefers-reduced-motion: no-preference`, make `#descent` `300vh` tall with a sticky inner viewport and translate the tower elevation and cutaway by `var(--descent)` so the ground line rises past the viewer; otherwise show the cutaway as a static drawing in normal flow. The line spacing of the depth scale tightens with depth. **Done when**: quickstart scenarios 4 and 10 pass, and the frame rate holds ≥ 30 fps at 4× CPU throttling and ≥ 60 fps unthrottled.

**Checkpoint**: All five stages work, each independently.

---

## Phase 8: Content Workstream (author-led, runs alongside Phases 5–7)

**Purpose**: Replace placeholders with the author's own material. Nothing here is written for the author.

- [ ] T036 [US2] Author fills the **Use?**, **Status**, and **Where it lives** columns in `specs/001-portfolio-experience/content-inventory.md` for every row. **Done when**: each section has its minimum of options marked for use.
- [ ] T037 [US2] For each item marked `external`, set `data-status="external"` and `data-source` in `index.html`; make Drive/Office 365 evidence publicly viewable or copy it into `assets/img/` (optimized, ≤ 150 KB each); set `data-status="gathered"` once it is in the repo (FR-012a). **Done when**: the audit's external-source check passes, and the link check shows no sign-in landing pages.
- [ ] T038 [US1] Author supplies the resume as `assets/resume/jordan-stephens-resume.pdf` (≤ 500 KB, no phone number or street address) and the email, LinkedIn, and GitHub URLs; switch those `data-profile` entries to `data-status="supplied"` `<a>` elements in the header and `#contact` of `index.html`. **Done when**: the audit's profile check passes, and the resume opens in a new tab and downloads separately.
- [ ] T039 [US2] Author supplies the headshot; save it as `assets/img/headshot.webp` in widths 320 and 640 px (each ≤ 150 KB) with `width`, `height`, `srcset`, and a text description in `alt`; author writes the introduction and mission statement; mark the three Identity items `final` in `index.html`. **Done when**: the first-view budget (≤ 150 KB) still holds.
- [ ] T040 [US2] Author writes or places the content for each chosen option in `index.html`, deletes the unchosen pending items, and moves statuses through `draft` to `final`. **Done when**: `?audit=release` reports zero pending items (SC-009).
- [ ] T041 [US4] Confirm the setback floors and tube pairs (50/66/90) against SOM, CTBUH, or Chicago Architecture Center material; if confirmed, change `setback-50`, `setback-66`, `setback-90` to `verified` with the source in `index.html` and `specs/001-portfolio-experience/research.md`. **Done when**: the rows are verified with a source, or stay approximate with a note saying what was checked.

---

## Phase 9: Polish & Release

**Purpose**: Documentation, full validation, and release readiness.

- [ ] T042 [P] Rewrite `readme.md` to describe this experience, its five stages, how to run it locally, and the [README Reconciliation](spec.md#readme-reconciliation) decisions, keeping the deferred items (photography galleries, case studies, media codec support) listed as future work (FR-044). **Done when**: no README statement contradicts the spec.
- [ ] T043 Run `node --test tests/`. **Done when**: all tests pass.
- [ ] T044 Run quickstart scenarios 1–14, confirm nothing flashes more than three times per second (FR-035), review that all content is first person and specific (Principle I), confirm there is no dead or unused code in `js/` and `css/` (Principle VIII), and record pass/fail with date and device in `specs/001-portfolio-experience/checklists/release.md`. **Done when**: all 14 pass, or failures are logged as new tasks.
- [ ] T045 Run Lighthouse (mobile) and measure every [performance budget](plan.md#performance-budgets) in the Network panel; record the numbers in `specs/001-portfolio-experience/checklists/release.md`. **Done when**: Accessibility 100, Performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms, and every budget is met.
- [ ] T046 Run the link check from [quickstart.md](quickstart.md#automated-checks) and check LinkedIn by hand; record results in `specs/001-portfolio-experience/checklists/release.md`. **Done when**: every external link returns 200 without landing on a sign-in page (SC-008).
- [ ] T047 Open `?audit=release`, run `grep -n "01_inspiration" index.html css/site.css js -r` (expected: no matches, FR-043), and record both results in `specs/001-portfolio-experience/checklists/release.md`. **Done when**: zero `fail` rows (constitution quality gates 1, 7).
- [ ] T048 Run the audience test from [quickstart.md](quickstart.md#audience-test-sc-013) with three people and record times in `specs/001-portfolio-experience/checklists/release.md`. **Done when**: each finds the resume and a named section within 30 seconds (SC-013).
- [ ] T049 **Gate G3**: with the author's approval, merge `001-portfolio-experience` into `main`, push, and enable GitHub Pages (Settings › Pages › Deploy from branch `main`, folder `/`), then repeat T046 against `https://jstephens-create.github.io/portfolio2.0/`. **Done when**: the live site passes the link check and scenario 1.

---

## Dependencies & Execution Order

### Phase dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2)** → user stories.
- **US1 and US2 (P1)** start after Phase 2 and together form the MVP.
- **US3, US4, US5** each start after Phase 2. They depend on US1 only for the T008 focus
  handling and on US2 only for the audit (T010) used in their acceptance checks.
- Gates G1 and G2 are resolved. US5's descent moves the tower elevation drawn in
  T025, so T035 follows T025.
- **Content workstream (Phase 8)** can start once US2's item shells exist (T011–T016); T038
  needs T005 and T017.
- **Polish (Phase 9)** follows all stories and Phase 8; T049 follows every other task.

### Within each story

- Test file first, confirmed failing, then the module that makes it pass.
- `index.html` tasks run in order (same file). `css/site.css` tasks run in order (same file).
- Each story ends at its checkpoint before the next priority is started.

### Parallel opportunities

- T003 and T004 (different files) after T002.
- All test files (T009, T019, T023, T030) can be written in parallel once Phase 2 is done.
- T025 (SVG file) in parallel with T024 and T026.
- T042 (README) in parallel with any Phase 9 validation task.

---

## Parallel Example: User Story 4

```bash
# After gate G1, in parallel:
Task: "Write tests/geometry.test.js (T023)"
Task: "Draw assets/svg/willis-elevation.svg (T025)"
# Then sequentially:
Task: "Write js/gis/geometry.js until T023 passes (T026)"
Task: "Write js/gis/render.js init, then annotations (T027, T028)"
```

---

## Implementation Strategy

### MVP first (US1 + US2)

1. Phase 1 → Phase 2.
2. US1 (T005–T008), then US2 (T009–T018).
3. **Stop and validate**: quickstart scenarios 1, 2, 3 (content only), 11–14 and `?audit`. This page meets the
   assignment structure with marked placeholders.

### Incremental delivery

1. MVP → US3 entry → US4 tower → US5 descent, validating each checkpoint.
2. The content workstream runs alongside from the MVP onward.
3. Phase 9 validation, then gate G3 for publishing.

### Due date

Assignment due 2026-11-23. Complete the MVP first so a compliant page exists early; the immersive
stages and content can then proceed in parallel.

---

## Notes

- Commit only at checkpoints and only with the author's approval.
- Every figure shown comes from the facts tables; no module hard-codes a measurement.
- Never write reflections, quotes, or experiences for the author; pending markers stay until the
  author supplies the content.
