# Feature Specification: Portfolio Experience v1

**Feature Branch**: `001-portfolio-experience`

**Created**: 2026-10-22

**Status**: Clarified

**Input**: User description: "Define the first functional version of my portfolio2.0 website, with
five connected stages: command-style entry, Chicago GIS wireframe of Willis Tower, scroll-driven
underground descent, portfolio exploration in an industrial environment, and direct professional
access. Experimental, architectural, industrial, and computational, while lightweight on desktop
and mobile. Do not invent personal experiences, reflections, quotes, or architectural
measurements; mark missing content clearly. Treat the underground aesthetic as a proposed
direction until its references are approved. Resolve the outdated README requirements without
silently deleting potentially relevant assignment information."

**Governing documents**: `.specify/memory/constitution.md` (v1.0.0), `instruction.md`
(i.c.stars C60 Digital Portfolio Assignment), `Architectual-gis-wireframe/readme.md`,
`01_inspiration/`.

## Clarifications

### Session 2026-10-22

- Q: Which contact details should appear publicly on the site? → A: Email and city/region
  ("Chicago, IL"), plus LinkedIn, GitHub, and resume links; no phone number or street address.
- Q: How should visitors get to your resume? → A: One PDF stored in the repository, opened in
  a new tab by the browser's own viewer, with a separate download link; the public copy omits
  phone number and street address.
- Q: Which direction should the industrial underground take? → A: A drafted cutaway section
  beneath Willis Tower (foundations, freight-tunnel and Pedway levels, utilities, bedrock) in
  monochrome linework with labeled layers; each portfolio section is one labeled level, and real
  figures follow the verified/approximated labeling rules.
- Q: What should the Identity section contain beyond your name and professional links? → A: A
  short first-person introduction, a headshot with a text description, and the mission
  statement; values and professional brand stay in Career Planning.
- Q: How much of your assignment content exists today, and where does it live? → A: Some exists
  in external locations (Google Drive, Office 365, slides, photos) and needs gathering; the rest
  is unwritten.

## User Scenarios & Testing *(mandatory)*

The five stages are delivered as five stories. Priority follows the constitution: the layer that
satisfies the assignment comes first, and each immersive stage is added on top of it without ever
standing between the visitor and the content.

### User Story 1 - Direct professional access (Priority: P1)

An employer, mentor, or i.c.stars staff member opens the portfolio and immediately sees the
author's name and direct links to the resume, LinkedIn, GitHub, and contact information, plus
navigation to every portfolio section. They can reach any of these without typing a command,
watching an animation, or scrolling through the immersive experience.

**Why this priority**: The assignment requires name, contact info, resume, and LinkedIn on the
homepage, and the audience often has seconds to spare. This is the minimum that makes the site
usable as a professional portfolio.

**Independent Test**: Open the site on a phone and a desktop with interactive enhancements
disabled; confirm the name and all four professional links are visible in the first view and that
each section can be reached from navigation.

**Acceptance Scenarios**:

1. **Given** a first-time visitor on any supported device, **When** the page finishes its first
   view, **Then** the author's name and links to resume, LinkedIn, GitHub, and contact information
   are visible without scrolling, typing, or waiting for any animation.
2. **Given** a visitor anywhere in the experience, **When** they open the navigation, **Then** they
   can jump directly to Identity, Leadership, Business, Technology, Career Planning, Wellness, or
   Contact in one action.
3. **Given** a visitor who follows a shared link to a specific section, **When** the page loads,
   **Then** it opens at that section without replaying the entry or descent.
4. **Given** a professional link whose target is not yet supplied by the author, **When** it is
   displayed, **Then** it is clearly marked as pending rather than linking to a broken or invented
   destination.

---

### User Story 2 - Complete, requirement-mapped portfolio content (Priority: P1)

A grader or mentor reads each portfolio section and finds content organized under clear headings
that matches the assignment: Identity, Leadership, Business, Technology, Career Planning, and
Wellness with its Financial, Emotional, Mental, and Physical subareas. Every item states which
assignment requirement it satisfies, and any item the author has not yet written is visibly marked
as missing.

**Why this priority**: The portfolio is graded against the assignment. Without this story the site
cannot pass, regardless of how the immersive stages perform.

**Independent Test**: Compare the rendered sections against the Assignment Requirement Map below;
confirm every section and Wellness subarea exists, each minimum is represented by items or
clearly marked placeholders, and no placeholder could be mistaken for the author's writing.

**Acceptance Scenarios**:

1. **Given** the published site, **When** a reviewer reads the Leadership section, **Then** it
   contains at least 5 items, each labeled with the assignment option it satisfies.
2. **Given** the Wellness section, **When** a reviewer reads it, **Then** it contains Financial,
   Emotional, Mental, and Physical subsections, each with at least 1 item.
3. **Given** an item the author has not yet supplied, **When** it is displayed, **Then** it shows a
   visible "content pending" marker naming the requirement it will satisfy, and contains no
   generated reflection, quote, or outcome.
4. **Given** an item with evidence (slides, repos, documents, images), **When** a reviewer
   activates its link, **Then** the evidence opens and the link is not broken.

---

### User Story 3 - Command-style entry (Priority: P2)

A visitor arriving at the homepage sees a command-style text prompt that invites them to begin
exploring. Typing a recognized command, or choosing one from visible suggestions, takes them to
the Chicago GIS stage or directly to a section. The prompt sits alongside the professional
information from Story 1 rather than in front of it.

**Why this priority**: It is the first impression and the signature of the creative direction, but
the portfolio remains complete without it.

**Independent Test**: On the homepage, enter each documented command and an unknown command;
confirm each recognized command reaches its destination, the unknown command returns help, and the
same destinations are reachable by tapping suggestions without typing.

**Acceptance Scenarios**:

1. **Given** the homepage, **When** the visitor enters the begin command, **Then** the experience
   proceeds to the Chicago GIS stage.
2. **Given** the homepage, **When** the visitor enters a section name (for example "leadership",
   "resume", or "contact"), **Then** they are taken to that destination.
3. **Given** the homepage, **When** the visitor enters an unrecognized or empty command, **Then** a
   help response lists the available commands, and nothing breaks.
4. **Given** a touch-screen visitor, **When** the homepage loads, **Then** the on-screen keyboard
   does not open on its own, and visible command suggestions can be tapped instead of typed.
5. **Given** a screen-reader user, **When** they submit a command, **Then** the response is
   announced.

---

### User Story 4 - Chicago GIS wireframe of Willis Tower (Priority: P3)

A visitor explores a technical wireframe of Willis Tower in its Chicago setting. They rotate it
through 360 degrees, zoom to inspect its stepped profile and bundled-tube structure, and read
annotations. Each annotation states whether its information is verified (with a cited source),
approximated, or artistic interpretation.

**Why this priority**: It is the centerpiece of the creative direction and evidence of technical
skill, but it is enhancement over the content layer and depends on architectural research.

**Independent Test**: Load the GIS stage on desktop and mobile; rotate a full 360 degrees with
pointer, touch, and keyboard; open every annotation and confirm each shows its classification and,
when verified, its source. Disable 3D capability and confirm a static drawing with the same
annotations appears.

**Acceptance Scenarios**:

1. **Given** the GIS stage, **When** the visitor drags horizontally, uses arrow keys, or uses
   on-screen rotate controls, **Then** the model rotates and can complete a full 360-degree turn.
2. **Given** the GIS stage, **When** the visitor zooms in or out, **Then** the view stays within
   limits that keep the building recognizable, and a reset control returns to the default view.
3. **Given** any annotation, **When** it is displayed, **Then** it shows its classification
   (verified, approximated, or interpretation) in text, not color alone, and verified items cite
   their source.
4. **Given** a figure not yet researched, **When** it would appear, **Then** it is shown as
   "pending verification" instead of a number.
5. **Given** a device without 3D capability or with interactive enhancements disabled, **When** the
   stage is reached, **Then** a static architectural drawing with the same annotations is shown
   and the page continues to work.
6. **Given** a touch-screen visitor scrolling vertically over the model, **When** they swipe up or
   down, **Then** the page scrolls; the model does not trap scrolling.

---

### User Story 5 - Underground descent into the portfolio (Priority: P4)

As the visitor scrolls past the skyline, the view descends beneath the street into a drafted
cutaway section of the ground under Willis Tower: foundations, the freight-tunnel and Pedway
levels, utility layers, and bedrock, drawn as monochrome technical linework with labeled layers.
Each portfolio section is one labeled level of the cutaway, so exploring the underground is an
alternate way into the same content from Story 2.

**Why this priority**: It completes the creative direction, but every piece of content it leads
to is already reachable through Stories 1 and 2, and its real-world figures depend on research.

**Independent Test**: Scroll from the GIS stage downward and back up; confirm the descent follows
scroll position in both directions, each cutaway level opens the same content as direct
navigation, and with reduced motion enabled the descent becomes a non-animated transition.

**Acceptance Scenarios**:

1. **Given** the GIS stage, **When** the visitor scrolls down, **Then** the view moves beneath the
   skyline in step with scroll position, and scrolling up reverses it.
2. **Given** the underground cutaway, **When** the visitor selects a labeled level,
   **Then** the corresponding portfolio section opens with the same content shown by direct
   navigation.
3. **Given** a visitor with reduced motion enabled, **When** they pass through the descent,
   **Then** they see a simple, non-animated transition and reach the same content.
4. **Given** the visitor at any point in the descent, **When** they use navigation or a skip
   control, **Then** they leave the descent immediately for the chosen destination.
5. **Given** the cutaway, **When** a layer label shows a real-world figure (such as a tunnel or
   foundation depth), **Then** it carries its classification and source like the GIS
   annotations, or "pending verification" if not yet researched.

---

### Edge Cases

- **Interactive enhancements unavailable or disabled**: all content, professional links, and
  navigation remain usable; the GIS stage shows its static drawing; the descent is replaced by
  ordinary section flow.
- **Reduced motion preferred**: no camera motion or scroll-linked animation; transitions are
  instant or simple fades.
- **Slow connection**: name, professional links, navigation, and section text appear before any
  immersive asset; immersive assets load only as the visitor approaches them.
- **Deep link to a section**: opens at that section without replaying the entry or descent.
- **Browser back/forward**: returns to the previous section position without restarting the
  experience.
- **Unknown, empty, or mistyped command**: help response; suggestions remain visible.
- **Narrow phone (320 px wide), landscape phone, and large desktop**: layout adapts with no
  horizontal page scrolling.
- **Text enlarged to 200%**: content remains readable without loss of information or overlap.
- **Touch drag on the model versus page scroll**: vertical gestures scroll the page; rotation uses
  horizontal drag or explicit controls.
- **Visitor leaves the tab or scrolls the model off-screen**: animation pauses so the device is not
  kept busy.
- **Missing author content or links**: shown as clearly marked pending items, never as broken links
  or invented text.
- **External evidence that requires sign-in** (for example a private Drive or Office 365 file):
  treated as a broken link; it MUST be made publicly viewable, copied into the repository, or
  removed before release.
- **Printing or saving the page**: the portfolio content prints as readable text without the
  immersive layers.

## Requirements *(mandatory)*

### Functional Requirements

**Professional access (Story 1)**

- **FR-001**: The first view on every supported device MUST show the author's name and links to
  resume, LinkedIn, GitHub, and contact information without scrolling, typing, or waiting for
  animation. Public contact information is limited to an email address and city/region
  ("Chicago, IL"); the author's phone number or home street address MUST NOT appear anywhere on
  the site. Building and geographic addresses in the facts tables are not personal contact data.
- **FR-002**: Persistent navigation MUST be available from every stage and MUST reach Identity,
  Leadership, Business, Technology, Career Planning, Wellness, and Contact in one action.
- **FR-003**: Each portfolio section MUST be directly addressable by a shareable link that opens at
  that section.
- **FR-004**: The resume MUST be a single PDF kept in the repository, linked from the first view.
  A "view" link MUST open it in a new tab in the browser's own viewer, and a separate "download"
  link MUST download it; it MUST NOT be embedded in the page. The published PDF MUST omit phone
  number and street address. Links that open a new tab MUST say so to assistive technology.
- **FR-005**: Professional links whose targets have not been supplied MUST be displayed as pending
  and MUST NOT point to placeholder or invented destinations.

**Portfolio content (Story 2)**

- **FR-006**: The site MUST present Identity, Leadership, Business, Technology, Career Planning,
  and Wellness sections under clear headings, with Wellness divided into Financial, Emotional,
  Mental, and Physical subsections.
- **FR-006a**: The Identity section MUST contain a short first-person introduction (2–4
  sentences), a headshot with a text description, and the author's mission statement. The
  mission statement counts toward the Career Planning bonus; values and professional brand
  appear only in Career Planning so no text is duplicated.
- **FR-007**: Each section MUST meet the assignment minimums in the Assignment Requirement Map,
  counting only items that are written or visibly marked as pending.
- **FR-008**: Each portfolio item MUST identify the assignment option it satisfies.
- **FR-009**: Items not yet supplied by the author MUST display a visible "content pending" marker
  and MUST NOT contain generated reflections, experiences, quotes, or outcomes.
- **FR-010**: Each item MAY include evidence (links, documents, slides, images, video); every
  evidence link MUST resolve, and every meaningful image MUST have a text alternative.
- **FR-011**: Portfolio content MUST come from one source so that direct navigation and the
  underground environment always show identical content.
- **FR-012**: Authors MUST be able to see which assignment minimums are met, unmet, or pending
  (a coverage summary), so release readiness can be checked.
- **FR-012a**: A content inventory MUST list every assignment option with its status (available
  externally, gathered, draft, final, or pending) and, for available material, where it currently
  lives. Gathered material MUST be brought into the single content source (FR-011) or linked as
  evidence; evidence hosted on external services MUST be viewable by the public without signing
  in.

**Command-style entry (Story 3)**

- **FR-013**: The homepage MUST provide a labeled command-style text input alongside, not in front
  of, the professional information.
- **FR-014**: The input MUST recognize at least: a begin command (proceeds to the GIS stage), each
  section name, "resume", "contact", and "help".
- **FR-015**: Unrecognized or empty input MUST return a help response listing available commands.
- **FR-016**: Every command destination MUST also be reachable through visible suggestions that
  do not require typing.
- **FR-017**: The input MUST NOT open the on-screen keyboard automatically on touch devices.
- **FR-018**: Command responses MUST be announced to assistive technology.

**Chicago GIS wireframe (Story 4)**

- **FR-019**: The GIS stage MUST present a wireframe representation of Willis Tower in its Chicago
  geographic context.
- **FR-020**: Visitors MUST be able to rotate the model through 360 degrees using pointer, touch,
  keyboard, and on-screen controls, zoom within limits, and reset the view.
- **FR-021**: The stage MUST show annotations for the building's location, footprint, height,
  stepped profile, and bundled-tube structural configuration.
- **FR-022**: Every annotated figure MUST be classified in text as verified (with source),
  approximated, or artistic interpretation; unresearched figures MUST show "pending verification".
- **FR-023**: Geometry derived from a building footprint MUST NOT be presented as a complete or
  verified 3D model; reconstructed portions MUST be identified as reconstruction.
- **FR-024**: When 3D capability is unavailable, the stage MUST show a static architectural drawing
  with the same annotations.
- **FR-025**: The model MUST NOT prevent vertical page scrolling on touch devices.

**Underground descent (Story 5)**

- **FR-026**: Scrolling below the GIS stage MUST move the view beneath the skyline in step with
  scroll position, and reverse when scrolling up.
- **FR-027**: The underground cutaway MUST present each portfolio section as one labeled level;
  selecting a level MUST open that section's content (FR-011).
- **FR-028**: A skip control and the persistent navigation MUST let visitors leave the descent at
  any point.
- **FR-029**: The underground MUST be drawn as a drafted cutaway section beneath Willis Tower,
  showing foundations, freight-tunnel and Pedway levels, utility layers, and bedrock in monochrome
  linework with labeled layers. Real-world figures in the cutaway MUST follow FR-022
  classification. The visual treatment MUST be replaceable without changing content.

**Cross-cutting: accessibility**

- **FR-030**: The site MUST meet WCAG 2.2 AA, including color contrast, visible focus, text
  resizing to 200%, and minimum target size.
- **FR-031**: The full experience MUST be operable by keyboard alone, with a skip link to the main
  content.
- **FR-032**: Headings MUST form a correct hierarchy matching the section structure.
- **FR-033**: When reduced motion is preferred, scroll-linked motion and camera movement MUST be
  replaced with non-animated transitions.
- **FR-034**: Interactive visual stages MUST provide a text equivalent of the information they
  convey, including all annotations.
- **FR-035**: Content MUST NOT flash more than three times per second.
- **FR-036**: Information MUST NOT be conveyed by color alone (including data classification).

**Cross-cutting: performance and resilience**

- **FR-037**: Name, professional links, navigation, and section text MUST be usable before any
  immersive asset finishes loading.
- **FR-038**: Immersive assets MUST load only when the visitor approaches the stage that needs
  them.
- **FR-039**: A failure in any one stage MUST NOT break other stages or hide content.
- **FR-040**: Animation MUST pause when its stage is off-screen or the tab is hidden.
- **FR-041**: The layout MUST work from 320 px to wide desktop widths without horizontal page
  scrolling.

**Design direction**

- **FR-042**: The visual language MUST follow the constitution: Swiss grid and typographic
  hierarchy, drafting conventions that carry real information, and motion that communicates; no
  generic futuristic interface, arbitrary particles, or excessive glow.
- **FR-043**: Design references MUST be interpreted, not reproduced; source images from
  `01_inspiration/` MUST NOT be published as site assets unless the author approves.

**Repository documentation**

- **FR-044**: The project README MUST be updated to describe this experience and the README
  reconciliation decisions below.

### Assignment Requirement Map

Source: `instruction.md`. Every option is listed so none is lost; the author chooses which options
fill each minimum. Bonus items are optional.

| Section | Minimum | Options (author selects) |
|---|---|---|
| Leadership | 5 | Team Week reflection and team role; Gifts Project; Community Role and service leadership; Giving & Receiving Feedback or Planetary Responsibility workshops; Tea Host experience; Tea Debrief lessons; Dream Speech highlights and recognition; CIVICs Project and post-internship use. Bonus: visuals, quotes, slides, scanned artifacts |
| Business | 4 | Client Project overview (problem, team approach, individual role); Consulting Company reflections; RFP proposal artifacts and takeaways; Company Engagement Days (e.g., Accenture, Salesforce); mentor/client/guest consultant experiences (receiving feedback, adapting, professionalism); Allskates, Tea Guests, or external guest feedback. Bonus: proposal slides, decks, documentation, mentor quotes |
| Technology | 5 | Responsive web application walkthrough (problem solved, personal contribution); Geek Week (SQL, Excel, hot keys, timed testing, data analysis, coaching); moments coding clicked or was overcome; debugging, testing, and technical questions; GitHub collaboration, branching, version control; cloud tools (Office 365, Google Drive, versioned workflows); business tools (Trello, Teams, Zoom, Outlook, Windows Explorer); typing speed (40+ WPM); 5 Hour Minimums. Bonus: repo links, code snippets, wireframes, demo videos |
| Career Planning | 4 | Short- and long-term career plans (tech roles, leadership or entrepreneurial goals, consulting aspirations); work with Career Development Director and Program Manager; employer-partner workshop insights (Accenture, Capital One, Salesforce, others); resume feedback or job-search preparation; professional brand or values; target roles and why. Bonus: mission statement, career timeline, resume link |
| Wellness: Financial | 1 | Spending-pattern reflection; short- and long-term financial goals; financial workshop notes; credit score techniques. Bonus: post-program budget, vision board, "The Money Story I Want to Tell", dos and don'ts for past self |
| Wellness: Emotional | 1 | Journal entry on a challenging moment; challenging negative self-talk or imposter syndrome; mood tracker; affirmations. Bonus: video/audio clip, letter to younger self, check-in tool, art/music/poetry |
| Wellness: Mental | 1 | Coping strategies; handling stress or burnout; focus journal or self-check; mental wellness toolbox. Bonus: stress routine, before/after tough-day comparison, focus playlist, "How I Kept My Mind Right During Geek Week" |
| Wellness: Physical | 1 | Habit tracker; wellness or medical appointment notes; improved physical routine; local resources. Bonus: before/after reflections, food/sleep/movement journal, health SMART goals, "I Am My Own Health Advocate" |
| Identity (homepage) | — | Name, email, city/region, resume, LinkedIn (required); GitHub (author requested); first-person introduction, headshot, mission statement (FR-006a) |

Portfolio guidelines that apply to all content: clear section headings, first person, specific
rather than general, links to work tested, delivered on GitHub repository or GitHub Pages, due
2026-11-23.

Note: this portfolio site may itself serve as evidence for the Technology "responsive web
application" option, at the author's discretion.

### README Reconciliation

`readme.md` predates this specification. Each of its requirements is kept, mapped, or deferred
here rather than deleted.

| README item | Decision |
|---|---|
| About section | Kept as the **Identity** section |
| Selected projects | Mapped to Technology (web application walkthrough, repos) and Business (Client Project) evidence |
| Contact section | Kept as **Contact** and the professional access links (Story 1) |
| Responsive navigation | Kept (FR-002, FR-041) |
| Photography collections with keyboard-accessible galleries | Deferred from v1; MAY return as Wellness or Leadership bonus visuals or a later feature. Any gallery added later MUST be keyboard-accessible |
| Multi-page website structure | Superseded by one connected experience in which every section is directly addressable (FR-003); page structure is a planning decision |
| Technologies list (HTML5, CSS3, JavaScript, Git, GitHub Pages) | Moved to the technical plan; the hosting platform remains constrained by the assignment |
| Future: additional project case studies | Deferred |
| Future: broader media codec support | Deferred; relevant only if video evidence is added |
| Future: further accessibility refinements | Superseded by FR-030 to FR-036 |

### Key Entities

- **Professional Profile**: name, email, city/region, resume, LinkedIn, GitHub, first-person
  introduction, headshot (with text description), and mission statement; each item has a status
  (supplied or pending). No phone number or street address.
- **Portfolio Section**: one of Identity, Leadership, Business, Technology, Career Planning, or
  Wellness (with four subareas); has a heading, an assignment minimum, and ordered items.
- **Portfolio Item**: a piece of the author's content; has a title, the assignment option it
  satisfies, a status (available externally, gathered, draft, final, or pending), its current
  source location when external, body text, and optional evidence.
- **Evidence**: a link, document, slide, image, or video supporting an item; has a description and
  text alternative where it is visual.
- **Assignment Requirement**: a section's minimum count and selectable options from
  `instruction.md`; used to compute coverage.
- **Architectural Fact**: a figure or statement about Willis Tower, its geography, or the ground
  and infrastructure beneath it; has a value,
  unit, classification (verified, approximated, interpretation, or pending verification), and
  source.
- **Command**: a word the entry prompt recognizes, its destination, and its help text.
- **Design Reference**: an inspiration source for a stage; has a status (proposed or approved).
- **Cutaway Level**: one labeled layer of the underground section; links to one portfolio
  section and may carry Architectural Facts about the real layer it depicts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of assignment minimums (22 items: Leadership 5, Business 4, Technology 5,
  Career Planning 4, and 1 in each of the 4 Wellness subareas) are represented by written or
  visibly pending items in v1, and by written items at final release.
- **SC-002**: From the first view, a visitor reaches the resume, LinkedIn, GitHub, or contact
  information in one action, without scrolling or waiting for animation.
- **SC-003**: From anywhere in the experience, any section is reachable in at most two actions.
- **SC-004**: On a mid-range phone over a typical mobile connection, the name, professional links,
  and navigation are visible and usable within 3 seconds of opening the site.
- **SC-005**: With interactive enhancements disabled, 3D capability unavailable, or reduced motion
  enabled, 100% of portfolio content and professional links remain reachable.
- **SC-006**: The site passes an automated WCAG 2.2 AA check with zero violations and a manual
  keyboard-only pass through every section.
- **SC-007**: 100% of architectural figures carry a visible classification, 100% of verified
  figures cite a source, and zero figures are unsourced numbers.
- **SC-008**: Zero broken links at release.
- **SC-009**: Zero "content pending" markers remain at final release.
- **SC-010**: The wireframe completes a 360-degree rotation using pointer, touch, and keyboard on
  desktop and mobile.
- **SC-011**: The layout has no horizontal page scrolling at any width from 320 px to 1920 px.
- **SC-012**: Animated stages hold at least 30 frames per second on a mid-range phone and 60 on a
  typical desktop, reducing detail rather than stuttering when a device cannot.
- **SC-013**: In a review with at least three people from the audience (mentors, staff, or peers),
  each locates the resume and a named section within 30 seconds on their first visit.

## Assumptions

- The site is delivered on GitHub Pages or as a GitHub repository, per the assignment; technology
  choices beyond that are made in the plan (constitution Principle VII).
- All personal content, reflections, evidence, the resume file, and profile links are supplied by
  the author; v1 MAY ship with clearly marked pending items, but final release MUST NOT.
- Some content already exists in the author's Google Drive, Office 365, slides, and photos; the
  rest is unwritten. Gathering, writing, and placing content is a tracked workstream alongside
  the build, driven by the content inventory (FR-012a).
- Willis Tower figures are researched during planning from the sources listed in
  `Architectual-gis-wireframe/readme.md`; until then they display "pending verification".
- Willis Tower is the only building in v1; other Chicago skyscrapers and an interactive city map
  are out of scope.
- Supported browsers are current versions of major desktop and mobile browsers.
- Content is in English.
- No visitor accounts, contact forms, comments, or analytics are included; contact is by link.
- The underground direction (drafted cutaway) is approved; depths and positions of foundations,
  tunnels, and the Pedway are researched during planning and display "pending verification"
  until sourced. The vertical spacing of portfolio levels is a design choice, labeled as
  interpretation, not as real depth.
- The inspiration video (`01_inspiration/Xbox.0.mov`) has not been reviewed and is not a
  confirmed reference.
