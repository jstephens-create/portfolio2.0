# Repository instructions

## Project structure

- The Git repository root is `portfolio2.0/` (the nested folder), not its parent wrapper.
- This is a static HTML, CSS, and JavaScript ES module site. There is no package manifest,
  framework, build step, or runtime dependency.
- `index.html` is the canonical semantic content, facts, and section metadata source.
- `css/site.css` owns site styling and responsive, reduced-motion, and print behavior.
- `js/main.js` loads enhancements; keep command, GIS, descent, and audit behavior modular.
- `specs/001-portfolio-experience/` contains feature requirements, plan, research,
  contracts, tasks, and validation guidance.
- `.specify/memory/constitution.md` is the governing project authority. Resolve conflicts
  through the feature spec or constitution process rather than silently overriding it.

## Product and content requirements

- Preserve the command-style entry, Willis Tower wireframe, and underground descent.
  Do not replace them with a generic template without the author's approval.
- Keep all portfolio content readable and navigable without JavaScript. Interactive stages
  enhance the semantic page; they must not gate access to sections.
- Preserve keyboard access, visible focus, reduced-motion behavior, responsive layouts,
  meaningful text alternatives, and the project's accessibility requirements.
- Keep architectural facts traceable to sources and label verified, approximate,
  interpretation, and pending values accurately.
- Do not invent the author's experiences, reflections, quotes, outcomes, or contact details.
  Keep incomplete content visibly marked as pending until the author supplies it.
- Preserve the assignment's required sections and minimum item counts.

## Implementation conventions

- Prefer platform features and small vanilla ES modules. Add dependencies or build tooling
  only when a feature plan explains the need, maintenance cost, and simpler alternatives.
- Keep each interactive stage isolated so its failure does not hide content or break other
  stages. Load expensive enhancements only when needed and retain a lightweight fallback.
- Use the existing JavaScript style: ES modules, two-space indentation, single quotes,
  semicolons, and descriptive names.
- Keep audit metadata and its contracts aligned with `js/audit.js`,
  `specs/001-portfolio-experience/data-model.md`, and the related contracts.
- Treat `01_inspiration/` and `Architectual-gis-wireframe/` as source references, not
  published assets. Do not move, rename, overwrite, or delete them without authorization.
- Keep local settings, secrets, credentials, and large local media out of version control.
  Do not add ignored Serena or Claude local settings to commits.

## Workflow and validation

- For feature work, follow the Spec Kit sequence and review the relevant spec, plan, tasks,
  and constitution before implementation.
- Serve the site from the repository root with `py -m http.server 8000`; do not use `file://`.
- Run automated checks with `node --test "tests/*.test.js"` when validation is requested.
- Use the feature quickstart for audit URLs and manual browser checks, including keyboard,
  reduced motion, no JavaScript, mobile, and print behavior.
- Before release, complete the release audit, test links, verify required content and facts,
  and record the manual checks from the quickstart.
- Do not install dependencies, commit, push, or deploy without the author's approval.
