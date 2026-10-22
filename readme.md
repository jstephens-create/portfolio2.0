# Jordan Stephens Portfolio

My i.c.stars C60 digital portfolio: Leadership, Business, Technology, Career Planning, and
Wellness, presented as a descent from a Chicago skyline into the ground beneath it.

## The experience

1. **Entry**: a command prompt (`begin`, `leadership`, `resume`, `help`, …) beside my name and
   professional links.
2. **Willis Tower**: a rotatable wireframe of the bundled-tube structure, drawn only from a facts
   table where every figure is labeled verified, approximate, or interpretation, with its source.
3. **Underground descent**: scrolling moves the view below the street into a drafted cutaway:
   Lower Wacker, the Loop Pedway (shown as context; no known connection to the tower), the freight
   tunnel level, the basement, caissons, and limestone bedrock.
4. **Portfolio sections**: each cutaway level opens one section of the portfolio.
5. **Direct access**: name, resume, LinkedIn, GitHub, and contact are in the first view, and the
   navigation reaches every section without the immersive stages.

Everything works with JavaScript off and with reduced motion; the stages are enhancements.

## Run it locally

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
2D for the tower, inline SVG for the cutaway. Tests use Node's built-in test runner. Hosted on
GitHub Pages.

## Project structure

```text
index.html            All content, facts tables, and the cutaway drawing
css/site.css          Visual system, layout, reduced-motion and print styles
js/main.js            Loads each stage in isolation
js/command.js         Entry prompt
js/gis/               Tower geometry (from the facts table) and Canvas renderer
js/descent.js         Scroll-driven descent
js/audit.js           Content audit (?audit)
assets/               Resume, images, static tower drawing
tests/                Unit tests
specs/                Spec Kit specification, plan, research, and tasks
01_inspiration/, Architectual-gis-wireframe/   Design references (not published as site assets)
```

## Live site

Not published yet.

## Future improvements

- Photography collections with keyboard-accessible galleries
- Additional project case studies
- Broader media codec support, if video evidence is added

## Author

Jordan Stephens
