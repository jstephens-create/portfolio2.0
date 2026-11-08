# Contract: Entry Commands

The command line (Story 3, FR-013 to FR-018) is an optional, secondary feature in the Willis
Tower panel (constitution v2.0.0). It is hidden until `js/command.js` runs, and the section nav
reaches every destination without it.

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
| `identity` | `about`, `whoami` | `#identity` | "Opening Identity." |
| `technology` | `tech`, `skills` | `#technology` | "Opening Technology." |
| `leadership` | — | `#leadership` | "Opening Leadership." |
| `business` | — | `#business` (inside Leadership) | "Opening Business." |
| `career` | `career planning` | `#career` | "Opening Career Planning." |
| `resume` | `cv` | Opens `assets/resume/Jordan_Stephens_Resume.pdf` in a new tab; says "The resume link is pending." if no linked PDF exists | "Opening resume in a new tab." |
| `contact` | `email` | `#contact` | "Opening Contact." |
| `tower` | `willis`, `model` | Willis Tower panel (`#gis`) | "Opening Willis Tower." |
| `help` | `?`, `ls` | Stays | Lists every command name |

Unknown or empty input → "Unknown command. Try: identity, technology, leadership, business,
career, resume, contact, tower."

## Navigation behavior

- Section destinations update the URL fragment, so back/forward and sharing work (FR-003).
- Moving to a section moves keyboard focus to that section's heading.
- When reduced motion is preferred, navigation jumps instead of smooth-scrolling (FR-033).
