# Code and product conventions
- ES modules, two-space indentation, single quotes, semicolons, descriptive names.
- Keep command, nav, GIS, and audit behavior modular. Load expensive stage enhancements only when needed; isolate failures and retain lightweight/static fallbacks.
- `index.html` owns semantic content and facts; `css/site.css` owns presentation and responsive, reduced-motion, and print behavior.
- Preserve no-JavaScript content access, keyboard navigation, visible focus, reduced motion, responsive layouts, meaningful text alternatives, and source traceability for architectural facts.
- Keep audit metadata/contracts aligned with `js/audit.js`, `specs/001-portfolio-experience/data-model.md`, and related contracts. Mark facts accurately as verified, approximate, interpretation, or pending. Do not invent author content.