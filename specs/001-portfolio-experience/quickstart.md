# Quickstart: Validate Portfolio Experience v1

Run guide for proving the feature works. Uses only tools already on the machine (Python, Node,
curl, Chrome or Edge). Nothing is installed.

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Open <http://localhost:8000/>. Opening `index.html` directly from disk is not supported, because
browsers block script modules on `file://`.

## Automated checks

```bash
node --test "tests/*.test.js"
```

Expected: all tests pass. They cover command parsing ([contracts/commands.md](contracts/commands.md)),
descent scroll progress, tower geometry built from the facts table, and the content audit rules
([contracts/audit-report.md](contracts/audit-report.md)).

Content audit: open <http://localhost:8000/?audit>. Expected in v1: no `fail` rows; pending
content shows as `warn`. Before final release, open `?audit=release`; expected: zero `fail`.

Link check (external links; LinkedIn often answers bots with 999, so check it by hand). It prints
the final status and the URL each link lands on:

```bash
grep -oE 'href="https?://[^"]+"' index.html | cut -d'"' -f2 | sort -u |
  while read -r u; do curl -s -o /dev/null -L -w '%{http_code} %{url_effective}  <- '"$u"'\n' "$u"; done
```

Expected: every line starts with `200` (SC-008), and no link lands on a sign-in page such as
`accounts.google.com` or `login.microsoftonline.com`. A private Drive or Office 365 link can
return `200` from its sign-in page, so the landing URL matters (FR-012a).

Resume PDF: open it and search for digits; expected: no phone number or street address (FR-004).

## Manual scenarios

Use Chrome or Edge DevTools. Each maps to a spec story and the constitution's release gates.

| # | Scenario | Steps | Expected |
|---|---|---|---|
| 1 | First view (Story 1) | Device toolbar at 375×667 and 1440×900; reload | Name, email, "Chicago, IL", resume view/download, LinkedIn, GitHub visible without scrolling |
| 2 | Deep link | Open `/#wellness-mental` | Page opens at Mental Wellness; entry and descent do not replay |
| 3 | No scripts | DevTools › Settings › Debugger › Disable JavaScript; reload | All sections, facts table, static tower drawing, cutaway links usable |
| 4 | Reduced motion | Rendering panel › Emulate `prefers-reduced-motion: reduce` | No scroll-linked motion; descent shows as stacked sections |
| 5 | Commands (Story 3) | Type each command in [contracts/commands.md](contracts/commands.md), then `xyz` and empty | Correct destination; help for unknown and empty; response announced |
| 6 | Touch entry | Device toolbar, touch emulation, reload | Keyboard does not open; suggestions tappable |
| 7 | Tower (Story 4) | Drag, arrow keys, rotate buttons, zoom, reset | Full 360° turn; zoom clamps; reset returns; every label shows its classification |
| 8 | Touch scroll over tower | Touch emulation, swipe vertically over the tower | Page scrolls; horizontal drag rotates |
| 9 | No 3D | Disable JavaScript, or block `js/gis/` in the Network panel | Static elevation drawing with the same facts |
| 10 | Descent (Story 5) | Scroll from tower down and back up; select each cutaway level | View follows scroll both ways; each level opens its section |
| 11 | Keyboard only | Tab from the top through the whole page | Skip link first; visible focus everywhere; no traps |
| 12 | Text 200% | Browser zoom 200% at 1280 wide | No overlap or loss of content |
| 13 | Narrow width | Device toolbar at 320 wide | No horizontal page scroll (SC-011) |
| 14 | Print | Print preview | Readable portfolio text without immersive layers |

## Performance and accessibility

Lighthouse (DevTools › Lighthouse › Mobile, Navigation):

| Metric | Target |
|---|---|
| Accessibility | 100, zero axe violations (SC-006) |
| Performance | ≥ 90 |
| Largest Contentful Paint | ≤ 2.5 s (SC-004 allows 3 s) |
| Cumulative Layout Shift | ≤ 0.1 |
| Total Blocking Time | ≤ 200 ms |

Transfer budgets (Network panel, "Disable cache", compressed sizes) are listed in
[plan.md](plan.md#performance-budgets).

Frame rate (SC-012): Performance panel with 4× CPU throttling; rotate the tower and scroll the
descent. Expected: ≥ 30 fps throttled, ≥ 60 fps unthrottled.

## Audience test (SC-013)

Ask three people from the audience to find the resume and a named section on their first visit.
Expected: each succeeds within 30 seconds.
