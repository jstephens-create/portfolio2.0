# portfolio2.0 Constitution

## Core Principles

### I. Assignment Completeness

The i.c.stars C60 Digital Portfolio assignment (`instruction.md`) is the governing requirement.

- Every required section MUST be present: Leadership, Business, Technology, Career Planning,
  and Wellness (Financial, Emotional, Mental, and Physical).
- Each section MUST meet or exceed the assignment's minimum item counts.
- The homepage MUST present the author's name, contact information, resume, and LinkedIn.
- Content MUST be written in first person, MUST be specific rather than general, and every
  link MUST be tested before release.
- The site MUST be delivered on an approved platform (GitHub repository or GitHub Pages)
  by the assignment due date.
- When creative or technical ambitions compete with assignment completeness, completeness wins.

Rationale: the portfolio is graded against the assignment; an impressive experience that omits
a required item fails its purpose.

### II. Creative Direction Integrity

The portfolio's identity is a three-part experience that MUST be preserved:

1. A command-style entry that introduces the visitor to the portfolio.
2. An interactive Chicago architectural GIS wireframe (Willis Tower as the primary subject).
3. A scroll-driven transition descending into an industrial underground environment, where
   the portfolio sections live.

- These elements MAY be simplified, staged, or delivered progressively, but MUST NOT be
  replaced, removed, or substituted with a generic template without the author's approval.
- Reference material MUST be interpreted for its underlying principles, not reproduced.

Rationale: the experience expresses the author's voice and is part of what the portfolio
demonstrates.

### III. Content Before Spectacle

Portfolio information MUST be reachable without completing, watching, or interacting with any
animation, 3D scene, or command-style input.

- All required content MUST exist in the page document as readable, semantic content, and MUST
  remain usable if scripts, WebGL, or animation fail or are disabled.
- The visitor MUST be able to skip or bypass the command entry and the scroll descent.
- Navigation MUST provide direct access to every section.
- Motion MUST respect the user's reduced-motion preference.
- The site MUST be operable by keyboard, use a correct heading hierarchy, provide text
  alternatives for meaningful visuals, and meet WCAG 2.2 AA contrast.

Rationale: employers, staff, and mentors must find the material quickly on any device, and an
inaccessible experience excludes part of the audience.

### IV. Lightweight, Responsive Performance

- The site MUST be fully usable on mobile and desktop viewports, with no horizontal scrolling
  of the page at phone width.
- Required content MUST NOT depend on heavy assets; 3D geometry, large media, and other
  expensive resources MUST load only when needed and MUST have a lightweight fallback.
- Each implementation plan MUST define measurable performance budgets (for example page weight
  and load time on a mid-range mobile device) and verify them before release.
- Media MUST be optimized for the web; source-resolution references MUST NOT be shipped.

Rationale: the audience will often open the portfolio from a phone, and a slow first view
loses them before the content appears.

### V. Verified Data, Labeled Approximation

Architectural and geographic information MUST be traceable to a source.

- Every measurement or geographic fact presented (height, footprint, setbacks, coordinates,
  structural system) MUST be classified as verified (with its source), approximated, or
  artistic interpretation, and that classification MUST be visible where the data appears.
- Measurements MUST NOT be fabricated, and approximations MUST NOT be presented as verified.
- A GIS building footprint MUST NOT be treated as a complete 3D building model.

Rationale: the wireframe is an architectural reconstruction grounded in research; its
credibility depends on honesty about what is measured and what is inferred.

### VI. Purposeful Motion and Drafted Design

The visual language draws on Swiss typography, technical drafting, and industrial design.

- Layout MUST follow a deliberate grid with strong typographic hierarchy, precise alignment,
  and readable metadata.
- Drafting conventions (coordinates, grids, dimensions, measurement labels, annotation) SHOULD
  carry real information rather than decoration.
- Motion MUST communicate something: spatial relationships, transitions between places, or
  state. Decorative motion without informational purpose MUST NOT be added.
- Generic futuristic interfaces, arbitrary particle effects, and excessive glow MUST NOT be
  used.

Rationale: restraint is what makes the experience read as engineered rather than effects-driven,
consistent with the architectural GIS README.

### VII. Technology by Demonstrated Need

- Frameworks, libraries, tools, and build steps MUST be adopted only when the plan documents
  the need they meet, their cost (size, complexity, maintenance), and the simpler alternative
  considered.
- Platform capabilities (HTML, CSS, browser APIs) SHOULD be preferred when they meet the need.
- Specific technology choices belong in each feature's plan, not in this constitution, and MAY
  change as needs change.

Rationale: every dependency adds weight and maintenance; choosing by need keeps the site light
and the code understandable to its author.

### VIII. Modular, Maintainable Code

- Content, presentation, and behavior MUST be kept separable so portfolio writing can be edited
  without touching rendering or animation code.
- Each experience module (command entry, wireframe, descent, portfolio sections) MUST be
  independent enough that a failure in one does not break the others or hide content.
- Code MUST use clear names, follow one consistent convention per language, and contain no dead
  or speculative code.
- Comments SHOULD explain why, not what.

Rationale: the author must maintain and extend this portfolio after the program, and graders
may read the repository as evidence of technical growth.

### IX. Repository Scope and Source Preservation

- Work MUST stay within the portfolio2.0 repository.
- Existing source material (`instruction.md`, `01_inspiration/`, `Architectual-gis-wireframe/`,
  and other author-provided references) MUST NOT be deleted, moved, renamed, or overwritten
  without the author's approval.
- Large local media MUST remain excluded from version control, and secrets, credentials, and
  machine-specific configuration MUST NOT be committed.
- Installing dependencies, committing, pushing, and deploying MUST happen only with the
  author's approval.

Rationale: the references hold the creative direction, and the author controls what is
published under their name.

## Assignment and Content Standards

- **Audience**: employers, i.c.stars staff, mentors, and community partners.
- **Due date**: 2026-11-23, delivered as a live GitHub repository or GitHub Pages site.
- **Minimum content**: Leadership ≥ 5 items; Business ≥ 4; Technology ≥ 5; Career Planning ≥ 4;
  Wellness ≥ 1 item in each of Financial, Emotional, Mental, and Physical.
- **Placeholders**: draft or placeholder content MUST be visibly marked and MUST be replaced
  before release; placeholder text MUST NOT ship as if it were the author's reflection.
- **Authorship**: reflections are the author's own experience; tooling MAY structure and format
  content but MUST NOT invent experiences, quotes, or outcomes.
- **Traceability**: each feature specification MUST map its requirements to the assignment
  section and minimum they satisfy.

## Development Workflow and Quality Gates

- Work follows the Spec Kit sequence: constitution → specify → clarify → plan → tasks →
  implement. Each plan MUST pass a Constitution Check before design and again after design.
- Implementation, dependency installation, commits, pushes, and deployments each require the
  author's approval at the time they occur.
- Before any release, the following MUST be verified and recorded:
  1. Assignment checklist complete against Principle I and the content standards above.
  2. All content reachable with scripts or WebGL unavailable and with reduced motion enabled.
  3. Keyboard-only navigation through every section.
  4. Layout checked at phone and desktop widths.
  5. Performance budgets from the plan met.
  6. All links tested.
  7. Every architectural and geographic figure labeled per Principle V.

## Governance

This constitution supersedes other practices and instructions for this repository. Where a
reference document (such as a README) conflicts with it, the constitution governs and the
conflict MUST be resolved in the relevant specification or by amendment.

- **Amendments**: proposed in writing, approved by the author, and recorded with a Sync Impact
  Report and updated version and date.
- **Versioning**: semantic versioning. MAJOR for removing or redefining a principle; MINOR for
  adding a principle or materially expanding guidance; PATCH for clarifications and wording.
- **Compliance**: every plan's Constitution Check and every review MUST confirm compliance.
  Deviations MUST be justified in the plan's Complexity Tracking section with the simpler
  alternative that was rejected and why.
- **Priority**: when principles conflict, lower-numbered principles take precedence.

**Version**: 1.0.0 | **Ratified**: 2026-10-22 | **Last Amended**: 2026-10-22
