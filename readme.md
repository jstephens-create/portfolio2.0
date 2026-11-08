# Jordan Stephens Portfolio

**Live site:** <https://jstephens-create.github.io/portfolio2.0/>

My i.c.stars C60 digital portfolio. Who I am comes first; a Willis Tower wireframe beside it
shows the technical side of my work.

## The experience

1. **Identity**: my name, role, background, resume, LinkedIn, GitHub, and email in the first view.
2. **Sections**: 01 Identity, 02 Resume (opens my resume PDF), 03 Technology, 04 Leadership (with
   Business), 05 Career, 06 Contact.
3. **Willis Tower instrument**: on desktop the right quarter of the page holds a slowly rotating
   wireframe of the bundled-tube structure, with rotate, zoom, pause, and reset controls. Every
   figure is labeled verified, approximate, or interpretation; the full data table and sources sit
   in a collapsed "Technical data and sources" panel. Phones stack it after the portfolio.
4. **Command line** (optional): type `help` in the tower panel for keyboard shortcuts to sections.

Everything works with JavaScript off and with reduced motion; the tower and command line are
enhancements.

## Local development

Optional, for previewing changes before they are merged. Any static file server works; Python's
built-in server is one option and is not used in production:

```bash
python -m http.server 8000
```

Open <http://127.0.0.1:8000/>. Opening `index.html` from disk does not work, because browsers
block script modules on `file://`.

## Checks

```bash
node --test "tests/*.test.js"
```

- `?audit` in the URL shows the content coverage report; `?audit=release` is the final gate.
- Manual scenarios, performance budgets, and the link check are in
  [specs/001-portfolio-experience/quickstart.md](specs/001-portfolio-experience/quickstart.md).

## Technologies

HTML, CSS, and JavaScript modules, with no framework, build step, or runtime dependency. Canvas
2D for the tower, with a static SVG drawing as its fallback. Tests use Node's built-in test runner. Hosted on
GitHub Pages.

## Project structure

```text
index.html            All content and the Willis Tower facts table
css/site.css          Visual system, 75/25 layout, reduced-motion and print styles
js/main.js            Loads each stage in isolation
js/command.js         Optional command line in the tower panel
js/gis/               Tower geometry (from the facts table) and Canvas renderer
js/nav.js             Section ticker and scroll spy
js/audit.js           Content audit (?audit)
assets/               Headshot, resume PDF, static tower drawing
tests/                Unit tests
specs/                Spec Kit specification, plan, research, and tasks
01_inspiration/, Architectual-gis-wireframe/   Design references (not published as site assets)
```

## Live site

<https://jstephens-create.github.io/portfolio2.0/>

## Deployment

GitHub Pages serves the files in this repository as they are, from the root (`/`) of the `main`
branch. Merging into `main` publishes the site, usually within a minute or two. There is no build
step, server, or runtime dependency.

## Future improvements

- Photography collections with keyboard-accessible galleries
- Additional project case studies
- Broader media codec support, if video evidence is added

## Author

Jordan Stephens
