# Research: Portfolio Experience v1

Phase 0 output. Each decision records what was chosen, why, and what else was considered.
Architectural and geographic figures are in [Sourced facts](#sourced-facts); nothing there is
presented as verified without a source that was actually checked.

## Decision: Page architecture

- **Decision**: One static HTML page holding all content; CSS for presentation; small ES modules
  as progressive enhancement. No framework, no build step.
- **Rationale**: Principle III requires every piece of content to work with scripts off, which
  rules out client-rendered content. GitHub Pages serves static files from `main` directly. The
  whole site is one author's single page, which needs no component system.
- **Alternatives considered**: Static-site generator (Eleventy, Astro) to write content in
  Markdown: adds a build step and Node dependencies for a single page. Client-rendered content
  from JSON: fails Principle III. Multi-page site (old README): splits the connected descent and
  is not required; sections stay individually linkable instead.

## Decision: Tower rendering

- **Decision**: A hand-written Canvas 2D wireframe renderer (`js/gis/render.js`): rotate points
  about the vertical axis, tilt, perspective-project, stroke line segments. Rendered on demand
  (on input), not in a continuous loop. Labels are HTML elements positioned at projected anchor
  points so they stay real, readable text.
- **Rationale**: v1 draws a few thousand static line segments (nine tubes, setbacks, floor lines,
  street context), which Canvas 2D strokes well within frame budget on phones. Three.js would
  cost about 171 KB compressed plus 7 KB for OrbitControls (measured: `three@0.170.0`
  `three.module.min.js` 691,648 bytes raw / 171,050 gzip), more than the rest of the page combined.
  Its OrbitControls also would not meet the spec as-is: it sets `touch-action: none`, which traps
  vertical page scrolling on touch screens (FR-025), and plain arrow keys pan rather than rotate
  (rotation needs Shift/Ctrl+arrows). Custom touch and keyboard handling would be needed either
  way, so the library would mainly replace about 60 lines of projection math.
- **Input**: the canvas uses `touch-action: pan-y`, so vertical swipes scroll the page and
  horizontal drags rotate (FR-025). Arrow keys rotate and `+`/`-` zoom when the canvas has focus;
  visible rotate, zoom, and reset buttons do the same (FR-020). Zoom is clamped so the whole
  building stays recognizable.
- **Upgrade trigger**: adopt Three.js (pinned, lazy-loaded) if a later version needs glTF/GLB
  assets, shaded or hidden-line rendering, city context beyond roughly 20,000 segments, or if the
  Canvas renderer misses SC-012 on a mid-range phone.
- **Alternatives considered**: Three.js + OrbitControls (suggested by the GIS README; deferred
  per the trigger above). SVG with 3D math: re-creating thousands of DOM nodes per rotation is
  slower than Canvas. Pre-rendered rotation frames (image sequence): heavy and not zoomable.

## Decision: Underground descent

- **Decision**: The descent section is tall; inside it a sticky viewport holds the tower
  elevation and the SVG cutaway. One passive scroll listener (throttled to animation frames)
  computes progress 0–1 for the section and writes it to a CSS custom property; CSS transforms
  move the drawing upward so the ground line rises past the viewer. `scrollProgress()` is a pure
  function so it can be tested. The listener is attached only while the descent is on screen
  (observed with `IntersectionObserver`), and the tower renders only on input, so nothing runs
  while a stage is off-screen or the tab is hidden (FR-040).
- **Rationale**: Works in every target browser, reverses naturally when scrolling up (FR-026),
  and costs one style write per frame. With `prefers-reduced-motion` or without scripts, the
  section is simply a static drawing followed by the content, which satisfies FR-033.
- **Alternatives considered**: CSS scroll-driven animations (`animation-timeline`): no script,
  but not yet in every target browser; could replace the listener later. Moving a 3D camera below
  ground: ties the descent to the tower renderer, so one failure would break both (Principle VIII).

## Decision: Cutaway drawing

- **Decision**: An inline SVG in `index.html`: monochrome linework, labeled layers (street, Lower
  Wacker, freight-tunnel level, foundations, bedrock), each portfolio section as an `<a>` level
  linking to its anchor. Layer depths come from the facts table; level spacing is labeled
  interpretation.
- **Rationale**: Inline SVG links are keyboard-focusable and readable by screen readers, scale
  crisply at any width, and work with scripts off. The drawing language matches the drafted
  cutaway chosen in clarification.
- **Alternatives considered**: Raster illustration: not accessible or crisp, heavier. Canvas:
  links would need a parallel HTML layer.

## Decision: Content source and audit

- **Decision**: Content and status live in markup (`data-item`, `data-requirement`,
  `data-status`). The coverage summary (FR-012) is an in-browser report shown with `?audit`,
  loaded only on request. The intake worksheet is
  [content-inventory.md](content-inventory.md).
- **Rationale**: One source of truth for direct navigation and the cutaway (FR-011); no tool to
  install; the audit reads exactly what visitors see.
- **Alternatives considered**: Content in JSON or Markdown with a generator: needs a build step.
  Hand-maintained coverage table only: drifts from the page.

## Decision: Typography and visual system

- **Decision**: System font stacks: a neo-grotesque sans (`"Helvetica Neue", Helvetica, Arial,
  sans-serif`) for text and a monospace stack (`ui-monospace, "SF Mono", Consolas, monospace`)
  for the prompt, coordinates, and annotations. A 12-column grid with a fixed baseline rhythm.
  Monochrome palette with one accent for focus and interaction, defined as tokens with a dark
  default and a light print style.
- **Rationale**: Swiss typography relies on grid and hierarchy more than a specific typeface;
  system fonts cost 0 KB (budget) and render instantly. References in `01_inspiration/`
  (programmatic Swiss, engineered editorial, data as material) are interpreted as rules: grid,
  scale contrast, dense but readable metadata, linework that carries information. Neon glow and
  network-glow images are not used, per the GIS README and Principle VI.
- **Alternatives considered**: Self-hosted Inter or IBM Plex: about 20–40 KB per weight; can be
  added later if the system stack proves inconsistent across platforms.

## Decision: Testing

- **Decision**: Node's built-in test runner (`node --test`) for pure modules; Lighthouse
  (built into Chrome) for accessibility and performance; curl for links; manual scenarios in
  [quickstart.md](quickstart.md).
- **Rationale**: All tools are already installed (Node 26, Python 3.14, curl). Lighthouse's
  accessibility audit is based on axe-core.
- **Alternatives considered**: Playwright or Vitest: real value for browser automation, but each
  is a dependency install; revisit if manual scenarios become slow to repeat.

## Decision: Hosting

- **Decision**: GitHub Pages serving the root of `main`. All asset and link URLs are relative,
  because the site lives under `/portfolio2.0/`.
- **Rationale**: Approved platform in the assignment; no build or workflow file needed.
- **Alternatives considered**: GitHub Actions deploy workflow: unnecessary without a build.

## Design references

| Reference | Stage | Status | Principle taken |
|---|---|---|---|
| `Architectual-gis-wireframe/base_idea.png` (architectural wireframe, city model, plan shapes, drafted orange diagrams) | Tower | in use (author reference) | Structural edges, transparent surfaces, plan-shape diagrams, annotation |
| `01_inspiration/1.png`, `3.png` (Swiss posters, editorial grids) | All | in use (author reference) | Grid, scale contrast, text as structure |
| `01_inspiration/Screenshot 2026-10-22 032055.png`, `032132.png` (programmatic Swiss, data as material, engineered editorial) | All, cutaway | in use (author reference) | Rule-based layout, monochrome precision, exploded technical drawing |
| `01_inspiration/uo.jpg` (pixel numerals, circular drafting marks) | Entry | proposed | Monospace/pixel display type for the prompt |
| Computational rhythm (neon triangles), blue network image | — | not used | Glow conflicts with Principle VI |
| `01_inspiration/2.png` (SL24 brutalist data dossier: dark ruled grid, large index numerals, underscore labels, one orange block) | All, navigation | in use (author reference) | Ruled grid cells, large section index numbers, uppercase underscore labels for real identifiers only, a single orange accent |
| `01_inspiration/4.png` (The Designers Republic / Autechre poster: rule-based diagonal pattern, dense metadata block) | Cutaway | in use (author reference) | Rule-generated diagonal hatching, used only as section-cut material hatching (earth, concrete, rock), where hatch patterns carry meaning in drafting |
| `01_inspiration/ChatGPT Image Oct 16, 2026, 09_12_53 AM.jpg` (Weingart spread: vertical line rhythm varying in width, black/white/orange) | Tower, descent | in use (author reference) | Line density as signal: floor-line rhythm on the tower; line spacing that tightens with depth in the descent |
| `01_inspiration/Screenshot 2026-10-16 122951.png`, `123046.png` (audio-visual wireframe work: objects in circular reticles, numeric readouts, red point markers) | Tower | in use (author reference) | Circular bearing ring around the tower showing true north and current view angle; numeric readouts of real values; point markers as annotation anchors |
| `01_inspiration/Xbox.0.mov` (42 s) | — | not reviewed | No frame-extraction tool installed; needs the author's description |
| Drafted cutaway (clarification Q3) | Descent | approved (clarification Q3) | Section drawing, labeled strata |

### Principles drawn from the references

- **Visual**: dark ground with white linework; one accent, international orange, for focus,
  interaction, and annotation anchors (it appears in `base_idea.png`, `2.png`, and the Weingart
  spread); ruled grid cells; large section index numerals (01–07); monospace uppercase labels.
- **Interaction**: the tower sits inside a circular bearing ring whose tick marks and readout show
  the real view angle relative to true north; annotations anchor to orange point markers.
- **Architecture**: section-cut hatching in the cutaway follows drafting convention by material
  (soil, concrete, limestone), not as free decoration.
- **Motion**: rotation responds directly to input with short easing (≤ 200 ms); the descent is
  coupled to scroll, never timed; command responses appear immediately (no typewriter delay that
  holds back information).

### Reference elements not adopted (would conflict with the constitution)

- Invented technical jargon and fake metadata ("DARK_NODE", "ENCRYPTED_LOG"): conflicts with
  Principle V; underscore labels are used only for real identifiers (e.g. `233_S_WACKER`).
- Decorative barcodes, code-as-texture overlays, and point-cloud particles: decoration without
  information, excluded by Principle VI and FR-042.
- Full-bleed generative patterns: kept only as meaningful material hatching.

## Sourced facts

Research pass 2026-10-22. These rows seed the facts table in `index.html`
([content-markup](contracts/content-markup.md#architectural-facts)).

**Re-check during plan review (2026-10-22)**: the preferred-source values were re-read directly
from the pages. CTBUH: 442.1 m, 1,451 ft, 527 m, 412.7 m, 108 floors. CAC: 110 stories, nine
tubes, Graham and Khan of SOM, completed 1974. SOM: nine 75 × 75 ft column-free tubes, site
3 acres, 1,450 ft, 110 stories, completed 1974, caissons "down to bedrock", tubes "bundled
together as a closed square up to the first 50 stories". All matched. Secondary-source rows were
not re-checked and remain `approximate`.

**Classification rule**: `verified` only when a preferred source from the GIS README, or SOM,
or City of Chicago/OSM data states the value and the page was opened. A value found only in a
secondary source (Wikipedia, PBS, WBEZ) is `approximate` with the note "secondary source" until
a preferred source confirms it. Arithmetic on verified values is `approximate` with its
derivation shown.

Sources: [CTBUH](https://www.skyscrapercenter.com/building/willis-tower/169) ·
[SOM](https://www.som.com/projects/willis-tower/) ·
[CAC](https://www.architecture.org/learn/resources/buildings-of-chicago/building/willis-tower/) ·
[OSM way 380868216](https://www.openstreetmap.org/way/380868216) ·
[Nominatim](https://nominatim.openstreetmap.org/search?q=Willis+Tower+Chicago&format=json) ·
[City of Chicago Building Footprints, bldg_id 358897](https://data.cityofchicago.org/resource/syp8-uezg.json?bldg_id=358897) ·
[Wikipedia: Willis Tower](https://en.wikipedia.org/wiki/Willis_Tower) ·
[PBS Building Big](https://www.pbs.org/wgbh/buildingbig/wonder/structure/sears_tower.html) ·
[Wikipedia: Chicago Tunnel Company](https://en.wikipedia.org/wiki/Chicago_Tunnel_Company) ·
[WBEZ Curious City](https://www.wbez.org/curious-city/2013/06/20/six-tunnels-hidden-under-chicagos-loop) ·
[Wikipedia: Chicago Pedway](https://en.wikipedia.org/wiki/Chicago_Pedway) ·
[Wikipedia: Wacker Drive](https://en.wikipedia.org/wiki/Wacker_Drive)

### Tower

| Key | Fact | Value | Class | Source / derivation |
|---|---|---|---|---|
| `address` | Address | 233 South Wacker Drive, Chicago 60606 | verified | CTBUH, OSM |
| `coordinates` | Location | 41.87874° N, 87.63596° W | verified | Nominatim (centroid of OSM way 380868216) |
| `height-architectural` | Architectural height | 442.1 m / 1,451 ft | verified | CTBUH (SOM: 1,450 ft) |
| `height-occupied` | Highest occupied floor | 412.7 m / 1,354 ft | verified | CTBUH |
| `height-tip` | Height to antenna tip | 527 m / 1,729 ft | verified | CTBUH |
| `floors-above` | Floors above ground | 108 | verified | CTBUH; SOM, CAC, and city data cite 110 (shown as a note) |
| `floors-below` | Floors below ground | 3 | verified | CTBUH |
| `completed` | Completed | 1974 | verified | CTBUH, CAC, city data (SOM also cites 1973) |
| `design` | Architect / structural engineer | SOM: Bruce Graham, Fazlur Khan | verified | CTBUH, CAC |
| `structure` | Structural system | Bundled tube: 9 tubes in a 3×3 grid | verified | SOM, CAC |
| `tube-size` | Tube plan size | 75 × 75 ft (22.9 m) | verified | SOM |
| `base-size` | Base plan size | 225 × 225 ft (68.6 m) | approximate | 3 × 75 ft tube (SOM) |
| `site-area` | Site area | 3 acres | verified | SOM |
| `orientation` | Orientation | Aligned with the street grid, about 1° from true north | approximate | Calculated from OSM polygon nodes |
| `setback-50` | Floor 50: NW and SE tubes end | 7 tubes continue | approximate | Secondary source (Wikipedia); SOM confirms all 9 tubes reach floor 50 |
| `setback-66` | Floor 66: NE and SW tubes end | 5 continue | approximate | Secondary source (Wikipedia) |
| `setback-90` | Floor 90: N, E, and S tubes end | 2 continue (W and center) | approximate | Secondary source (Wikipedia) |
| `column-spacing` | Perimeter column spacing | 15 ft (4.6 m) on center | approximate | Secondary source (Wikipedia) |
| `floor-height` | Typical floor-to-floor | about 12.5 ft | approximate | 1,354 ft ÷ 108 floors; an average, not a stated figure |
| `antenna-each` | Individual antenna heights | — | pending | Not stated by any source checked |

### Ground and underground (cutaway)

| Key | Fact | Value | Class | Source / derivation |
|---|---|---|---|---|
| `block` | Block | Bounded by Wacker, Adams, Franklin, Jackson; Quincy St closed | approximate | Secondary source (Wikipedia) |
| `basement-depth` | Lowest basement level | 43 ft below Franklin St (excavation 50 ft) | approximate | Secondary source (Wikipedia) |
| `foundation-type` | Foundations | Reinforced concrete caissons to bedrock | verified | SOM |
| `caisson-count` | Caissons reaching rock | 114 | approximate | Secondary sources (PBS; Wikipedia: 201 total, 114 to rock) |
| `caisson-diameter` | Caisson diameter | up to 10 ft (3.0 m) | approximate | Secondary source (Wikipedia) |
| `caisson-depth` | Caisson depth | — | pending | Not stated by any source checked |
| `bedrock-depth` | Depth to limestone bedrock | up to about 100 ft (30 m), clay above | approximate | Secondary source (Wikipedia) |
| `tunnel-depth` | Freight tunnel depth | 40 ft (12.2 m) below street | approximate | Secondary sources (Wikipedia, WBEZ) |
| `tunnel-network` | Freight tunnels | about 60 mi; built 1899 to about 1914; service 1906–1959; flooded 13 April 1992 | approximate | Secondary sources (Wikipedia, WBEZ) |
| `tunnel-section` | Tunnel cross-section | 7.5 ft high × 6 ft wide | approximate | Secondary source (Wikipedia; WBEZ: 7 ft) |
| `tunnel-here` | Freight tunnel under this block's streets | — | pending | Not confirmed by any source checked |
| `lower-wacker` | Wacker Drive beside the tower | Two levels; South Wacker extension built 1948–1954 | approximate | Secondary source (Wikipedia) |
| `pedway` | Pedway | Mostly a basement level; **Willis Tower is not among the listed connections** | approximate | Secondary sources (Choose Chicago, Wikipedia); official CDOT maps were not reachable |

### Footprint data

- **OSM way 380868216** (76 nodes; `chicago:building_id=358897`): covers the whole base and annex,
  about 94 × 121 m, not just the 68.6 m tower square. No height or level tags. Usable for the
  ground-plane outline with "© OpenStreetMap contributors" attribution (ODbL).
- **City of Chicago Building Footprints** (`syp8-uezg`, bldg_id 358897, "SEARS TOWER"):
  MultiPolygon with stories = 110, year_built = 1974; no height field; last updated 2015.
- **Decision**: v1 draws the tower square from `tube-size` and orients it to the street grid
  (`orientation`). The OSM outline, if used for the ground plane, is a small static GeoJSON file
  with attribution. Neither footprint is presented as a 3D model (FR-023).

### Effects on the design

- **Floor lines** in the wireframe are evenly spaced using `floor-height`, labeled approximate.
  Setback heights follow from the setback floors, so they are approximate too.
- **Pedway**: no source checked shows Willis Tower connected to it. The cutaway shows the Pedway
  only as Loop context, labeled "no known connection to Willis Tower", and never as a passage
  into the building. (Approved by the author, 2026-10-22.)
- **Freight tunnels**: the cutaway shows the tunnel level at its 40 ft depth, labeled with its
  secondary source, and "location under this block not verified" (`tunnel-here`).

### Disagreements and open items

- Floors: 108 (CTBUH) against 110 (SOM, CAC, city data). Show 108 with the 110 note.
- Height: 1,450 (SOM), 1,451 (CTBUH), 1,454 ft (PBS). Show CTBUH.
- Completion: 1973 or 1974. Show 1974 with a note.
- Setbacks: one unopened secondary source swaps the floor-50 and floor-66 pairs, and another cites
  floor 65. Keep the Wikipedia pairs as approximate until SOM, CTBUH, or CAC material confirms.
- Not verified: individual antenna heights, caisson depth, tunnels under adjacent streets, Lower
  Wacker clearances and any loading dock.
