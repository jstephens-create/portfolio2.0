# Contract: Content Markup

`index.html` is the single content source (FR-011). Scripts, styles, and the content audit
depend only on the hooks below; the author edits text inside them without touching code.

## Sections and anchors

Shareable links (FR-003) and command destinations use these fragments. They MUST NOT change once
published.

| Fragment | Element | Heading |
|---|---|---|
| `#main` | `<main>` | — (skip-link target) |
| `#entry` | `<section>` | visually hidden `h2` "Entry" |
| `#gis` | `<section>` | `h2` Willis Tower |
| `#descent` | `<section>` | `h2` Beneath the Loop |
| `#identity` | `<section data-section data-minimum="0">` | `h2` Identity |
| `#leadership` | `<section data-section data-minimum="5">` | `h2` Leadership |
| `#business` | `<section data-section data-minimum="4">` | `h2` Business |
| `#technology` | `<section data-section data-minimum="5">` | `h2` Technology |
| `#career` | `<section data-section data-minimum="4">` | `h2` Career Planning |
| `#wellness` | `<section data-section data-minimum="0">` | `h2` Wellness |
| `#wellness-financial`, `#wellness-emotional`, `#wellness-mental`, `#wellness-physical` | nested `<section data-section data-minimum="1">` | `h3` |
| `#contact` | `<section data-section data-minimum="0">` | `h2` Contact |

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

Columns: label, value with unit, classification in words, source link. `data-class` ∈
`verified`, `approximate`, `interpretation`, `pending`. The GIS stage and cutaway read values from
this table; they never hard-code figures.

## Cutaway levels

```html
<a class="level" href="#leadership" data-level="leadership"><text>Leadership · Foundation</text></a>
```

Exactly one `data-level` per top-level section: `identity`, `leadership`, `business`,
`technology`, `career`, `wellness`, `contact` (seven levels). Wellness subareas are reached from
the Wellness section, not as separate levels.

## Requirement keys

Keys follow `{section}.{option}`. Bonus items append `.bonus`.

| Section | Keys |
|---|---|
| leadership | `team-week`, `gifts-project`, `community-role`, `feedback-workshops`, `tea-host`, `tea-debriefs`, `dream-speech`, `civics-project`, `bonus` |
| business | `client-project`, `consulting-company`, `rfp-proposal`, `engagement-days`, `mentor-feedback`, `external-guests`, `bonus` |
| technology | `web-app`, `geek-week`, `coding-clicked`, `debugging-growth`, `github-collaboration`, `cloud-tools`, `business-tools`, `typing-speed`, `five-hour-minimums`, `bonus` |
| career | `career-plans`, `career-director`, `employer-workshops`, `resume-prep`, `professional-brand`, `target-roles`, `bonus` |
| wellness-financial | `spending-reflection`, `financial-goals`, `workshop-notes`, `credit-score`, `bonus` |
| wellness-emotional | `journal-entry`, `self-talk`, `mood-tracker`, `affirmations`, `bonus` |
| wellness-mental | `coping-strategies`, `stress-reflection`, `focus-journal`, `toolbox`, `bonus` |
| wellness-physical | `habit-tracker`, `appointment-notes`, `physical-routine`, `local-resources`, `bonus` |
| identity | `introduction`, `headshot`, `mission-statement` |

Bonus items never count toward a minimum.
