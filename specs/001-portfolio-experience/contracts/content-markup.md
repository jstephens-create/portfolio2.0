# Contract: Content Markup

`index.html` is the single content source (FR-011). Scripts, styles, and the content audit
depend only on the hooks below; the author edits text inside them without touching code.

## Sections and anchors

Shareable links (FR-003) and command destinations use these fragments. They MUST NOT change once
published.

| Fragment | Element | Heading |
|---|---|---|
| `#main` | `<main>` | — (skip-link target) |
| `#identity` | `<section data-section data-minimum="0">` | `h1` name (identity hero) |
| `#profile` | hero block inside `#identity` | name, role, resume and profile links |
| `#resume` | `<section data-section data-minimum="0">` | `h2` Resume (one link to the PDF) |
| `#leadership` | `<section data-section data-minimum="5">` | `h2` Leadership |
| `#business` | `<section data-section data-minimum="4">` nested in `#leadership` | `h3` Business |
| `#technology` | `<section data-section data-minimum="5">` | `h2` Technology |
| `#career` | `<section data-section data-minimum="4">` | `h2` Career Planning |
| `#contact` | `<section data-section data-minimum="0">` | `h2` Contact |
| `#gis` | `<aside>` beside `<main>` (right quarter on desktop) | `h2` Willis Tower |
| `#entry` | optional command line inside `#gis`, `hidden` until scripts run | label "Command line" |

`#descent` was removed with the underground descent (constitution v2.0.0, 2026-11-08).

## Profile links

```html
<a data-profile="linkedin" data-status="supplied" href="…">LinkedIn</a>
<span data-profile="github" data-status="pending">GitHub — link pending</span>
```

`data-profile` ∈ `email`, `location`, `resume-view`, `resume-download`, `linkedin`, `github`.
A `pending` profile entry is never an `<a>` (FR-005).

## Portfolio items

```html
<article data-item data-requirement="leadership.team-week" data-status="pending"
         data-source="Google Drive: Team Week folder">
  <h3>Team Week</h3>
  <p class="pending">Content pending — Leadership: Team Week reflection and team role.</p>
</article>
```

- `data-status` ∈ `pending`, `external`, `gathered`, `draft`, `final` (see data model).
- `data-source` is required when `data-status="external"`; it is not shown to visitors.
- Pending marker text format: `Content pending — {Section}: {requirement label}.`
- Evidence links carry `data-evidence`; meaningful images carry non-empty `alt`.

## Architectural facts

```html
<tr data-fact="height-roof" data-class="pending">
  <th scope="row">Height to roof</th><td></td><td>Pending verification</td><td></td>
</tr>
```

Columns: label, value with unit, classification in words, source link. Rows used in drawings also carry `data-value` with the number in feet or floors (e.g. `data-value="1451"`); pending rows carry none. `data-class` ∈
`verified`, `approximate`, `interpretation`, `pending`. The GIS stage reads values from this table;
it never hard-codes figures. The table sits in the collapsed "Technical data and sources" panel.
Underground and foundation figures live in [research.md](../research.md).

## Requirement keys

Keys follow `{section}.{option}`. Bonus items append `.bonus`.

| Section | Keys |
|---|---|
| leadership | `team-week`, `gifts-project`, `community-role`, `feedback-workshops`, `tea-host`, `tea-debriefs`, `dream-speech`, `civics-project`, `bonus` |
| business | `client-project`, `consulting-company`, `rfp-proposal`, `engagement-days`, `mentor-feedback`, `external-guests`, `bonus` |
| technology | `web-app`, `geek-week`, `coding-clicked`, `debugging-growth`, `github-collaboration`, `cloud-tools`, `business-tools`, `typing-speed`, `five-hour-minimums`, `bonus` |
| career | `career-plans`, `career-director`, `employer-workshops`, `resume-prep`, `professional-brand`, `target-roles`, `bonus` |
| identity | `introduction`, `headshot`, `mission-statement` |

Bonus items never count toward a minimum.
