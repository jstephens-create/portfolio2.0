# Technology and dependencies
- Browser-native static site: semantic HTML, CSS, and vanilla JavaScript ES modules.
- Serena project configuration enables TypeScript, HTML, and SCSS language servers. Repository source is JavaScript, HTML, and CSS; no TypeScript or SCSS application files surfaced in the root layout.
- No framework, package manifest, build step, package manager, or runtime dependency. Tests use Node's built-in test runner; local serving uses Python's standard HTTP server.
- `index.html` references `css/site.css` and `js/main.js` as the only page entry assets. `main.js` dynamically imports independent stage modules; GIS drawing uses project modules, not a runtime library.