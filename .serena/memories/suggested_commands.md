# Windows commands
- From repository root, serve over HTTP: `py -m http.server 8000`; open `http://localhost:8000/`. Do not use `file://` because browsers restrict ES module loading there.
- Run the built-in Node suite: `node --test "tests/*.test.js"`.
- Content audit: open `http://localhost:8000/?audit`; release audit: `http://localhost:8000/?audit=release`.
- Detailed manual scenarios and release checks are in `specs/001-portfolio-experience/quickstart.md`. No install, build, lint, or formatter command is configured.