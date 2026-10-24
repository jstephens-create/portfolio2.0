# Contract: Entry Commands

The command prompt (Story 3, FR-013 to FR-018) is the site's only text interface.

## Input rules

- Input is trimmed, lower-cased, and a leading `/`, `>` or `$` is ignored, so `> Leadership`
  and `leadership` match.
- Matching is exact on the name or an alias. No fuzzy matching.
- Empty input and unknown input both return the help response.
- The prompt never auto-focuses on any device. This keeps the on-screen keyboard closed on touch
  devices (FR-017) and keeps the skip link first in focus order for keyboard and screen-reader
  users (FR-031).

## Commands

| Command | Aliases | Destination | Response text (announced, FR-018) |
|---|---|---|---|
| `begin` | `start`, `enter` | GIS stage (`#gis`) | "Opening Willis Tower." |
| `identity` | `about`, `whoami` | `#identity` | "Opening Identity." |
| `leadership` | — | `#leadership` | "Opening Leadership." |
| `business` | — | `#business` | "Opening Business." |
| `technology` | `tech` | `#technology` | "Opening Technology." |
| `career` | `career planning` | `#career` | "Opening Career Planning." |
| `wellness` | — | `#wellness` | "Opening Wellness." |
| `resume` | `cv` | Opens resume PDF in new tab | "Opening resume in a new tab." |
| `contact` | `email` | `#contact` | "Opening Contact." |
| `help` | `?`, `ls` | Stays | Lists every command name |

Unknown or empty input → "Unknown command. Try: begin, identity, leadership, business,
technology, career, wellness, resume, contact."

## Suggestions

Every command except `help` is also rendered as a visible button or link under the prompt
(FR-016). Without scripts, the suggestions are plain links to the same destinations, so the entry
stage degrades to navigation.

## Navigation behavior

- Section destinations update the URL fragment, so back/forward and sharing work (FR-003).
- Moving to a section moves keyboard focus to that section's heading.
- When reduced motion is preferred, navigation jumps instead of smooth-scrolling (FR-033).
