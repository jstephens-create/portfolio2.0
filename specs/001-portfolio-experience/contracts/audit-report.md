# Contract: Content Audit

The coverage summary (FR-012) and release gate. It reads the markup defined in
[content-markup.md](content-markup.md) and changes nothing.

## Invocation

Opening the site with `?audit` in the URL shows the report in a panel. The audit code loads only
in that case, so visitors never download it.

## Report

| Check | Pass condition | Spec |
|---|---|---|
| Section coverage | Each `data-section` has ≥ `data-minimum` non-bonus items | FR-007, SC-001 |
| Requirement labels | Every item has a known requirement key | FR-008 |
| Duplicate options | No requirement key used twice | FR-008 |
| Pending content | Count of items not `final`; release requires 0 | SC-009 |
| External sources | Every `external` item has `data-source` | FR-012a |
| Profile links | Every `data-profile` is `supplied` | FR-001, FR-005 |
| Images | Every `<img>` has `alt` (empty only if decorative) | FR-010 |
| Facts | `verified` has a source; `pending` has no value | FR-022, SC-007 |
| Forbidden contact data | No phone-number pattern in page text | FR-001 |
| Cutaway levels | Each level's `href` matches an existing section | FR-027 |

Each row reports `pass`, `fail`, or `warn` (warn = acceptable in v1, fails at final release) with
the offending elements listed.

## Release modes

- **v1 prototype**: pending content is `warn`.
- **Final release** (`?audit=release`): pending content and pending profile links are `fail`.
