# Data Model: Portfolio Experience v1

There is no database. Every entity lives in `index.html` as semantic markup with `data-*`
attributes, so content is readable without scripts (FR-011, Principle III) and scripts read the
same markup instead of keeping a second copy. The exact attribute contract is in
[contracts/content-markup.md](contracts/content-markup.md).

## Professional Profile

Rendered once, in the first view (FR-001, FR-004, FR-006a).

| Field | Required | Rule |
|---|---|---|
| name | yes | Page `h1` |
| email | yes | `mailto:` link |
| location | yes | Text "Chicago, IL"; no street address |
| resumeView | yes | Opens the repository PDF in a new tab; announces "opens in new tab" |
| resumeDownload | yes | Same PDF, `download` attribute |
| linkedin | yes | External profile URL |
| github | yes | External profile URL |
| introduction | yes | 2–4 first-person sentences (Identity section) |
| headshot | yes | Optimized image with text description |
| missionStatement | yes | Identity section; counts toward Career Planning bonus |

Each link field has a status: `supplied` or `pending`. A pending field renders as marked text,
never as a link (FR-005). Phone number and street address are not fields and MUST NOT appear.

## Portfolio Section

| Field | Rule |
|---|---|
| id | One of `identity`, `leadership`, `business`, `technology`, `career`, `wellness`, `wellness-financial`, `wellness-emotional`, `wellness-mental`, `wellness-physical`, `contact` |
| heading | Visible heading; `h2` for sections, `h3` for Wellness subareas |
| minimum | Leadership 5, Business 4, Technology 5, Career 4, each Wellness subarea 1; others 0 |
| items | Ordered Portfolio Items |

The section `id` doubles as its shareable link fragment (FR-003), its command name, and its
cutaway level target.

## Portfolio Item

| Field | Rule |
|---|---|
| title | Visible `h3`/`h4` |
| requirement | One requirement key from [contracts/content-markup.md](contracts/content-markup.md#requirement-keys) (FR-008) |
| status | `pending`, `external` (spec: "available externally"), `gathered`, `draft`, `final` |
| source | Where external material currently lives; required when status is `external` |
| body | Author's own first-person text; empty unless status is `draft` or `final` |
| evidence | Zero or more Evidence entries |

**Status transitions** (FR-012a):

```text
pending ──► external ──► gathered ──► draft ──► final
   └──────────────────────────────────┘ (written from scratch)
```

- `pending` and `external` items render the standard "Content pending" marker with the
  requirement label (FR-009). No generated text, ever.
- An item counts toward its section minimum in v1 at any status; at final release only `final`
  counts (SC-001, SC-009).

## Evidence

| Field | Rule |
|---|---|
| href | Must resolve publicly without sign-in (FR-010, FR-012a edge case) |
| label | Link text describing the evidence |
| alt | Required for meaningful images |

## Assignment Requirement

Static reference data: section, requirement key, label, and whether it is a bonus item. Defined
once in [contracts/content-markup.md](contracts/content-markup.md#requirement-keys) and mirrored
by the content audit (see [contracts/audit-report.md](contracts/audit-report.md)).

## Architectural Fact

One row of the technical data table shared by the GIS stage and the cutaway (FR-021, FR-022,
FR-034). The table is the text equivalent and the static fallback's legend.

| Field | Rule |
|---|---|
| key | Stable identifier, e.g. `height-roof` |
| label | Human-readable name |
| value | Number or text; empty when `pending` |
| unit | `m`, `ft`, `floors`, `°`, etc. |
| class | `verified`, `approximate`, `interpretation`, `pending` (shown as text, FR-036) |
| source | URL; required when `verified`; derivation note when `approximate` |

Validation: a `verified` fact without a source, or a `pending` fact with a value, fails the audit
(SC-007).

## Cutaway Level

| Field | Rule |
|---|---|
| section | Target top-level Portfolio Section `id`; seven levels (FR-027) |
| label | Visible text naming the section and the layer it sits in |
| layer | Layer depicted: street and Lower Wacker, basement, Pedway (Loop context only), freight-tunnel level, caissons, bedrock; or `interpretation` |
| facts | Optional Architectural Fact keys shown on the level |

Spacing between levels is interpretation and is labeled so (spec Assumptions).

## Command

Defined in [contracts/commands.md](contracts/commands.md): name, aliases, destination, and help
text.

## Design Reference

Not runtime data. Recorded in [research.md](research.md) with status `proposed` or `approved`.
