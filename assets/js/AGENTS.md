# AGENTS.md

JavaScript instructions for Bro-Ops Trophy Room.

This file applies to JavaScript work in `assets/js/`.

## Role of the JavaScript layer

The JavaScript should remain lightweight and readable. Its responsibilities are:
- loading data from `data/games.json`
- deriving stats and active subsets
- rendering cards and sections
- wiring filters
- opening and closing modals
- preserving accessibility basics
- handling schema-aware formatting and graceful degradation

Do not turn the site into a complex client app.

## Data model rules

The JavaScript must follow the canonical repository schema.

### Primary collections
Only read from:
- `completed_games`
- `to_play_games`

Do not introduce a third primary collection for active games.

### Optional activity
The currently active / in rotation view must be derived by scanning both primary collections for `activity_state`.

Allowed `activity_state` values:
- `Currently Playing`
- `In Rotation`
- `Paused`

Treat blank/null activity as inactive.

### Status rules
Completed `status` values:
- `Completed`
- `100%`

To-play `status` values:
- `Queued`
- `Active`
- `Waiting for Sale`
- `Waiting for Release`
- `Considering`
- `On Hold`

Priority values:
- `High`
- `Medium`
- `Low`

Do not reintroduce `backlog_status` into rendering or filtering logic.

## Field-shape rules relevant to JS

- use shared `platform` for both collections when the approved migration is complete
- use shared `playtime_hours` for both collections when the approved migration is complete
- support both `YYYY`, `YYYY-MM`, and `YYYY-MM-DD` date shapes cleanly
- treat booleans as booleans, not strings
- treat blank/null optional values as absent in the UI
- preserve exact string values for externally controlled vocabularies

## Rendering rules

- Completed cards should be denser than to-play cards
- To-play cards can remain slightly richer and more planning-oriented
- Cards should show only high-signal information
- Rich details belong in modals
- Active items should integrate into the same browse/detail model as the main collections
- Modals should surface cover art when available
- Use fixed field order with optional fields omitted when blank

## Filtering and sorting rules

- Keep completed and to-play controls separate
- `status` and `priority` are different concepts and must remain separate
- Filters should be robust to missing optional fields
- Derived filter options should reflect the actual data values present
- Empty results must render an intentional empty state, not a blank area
- `setting` may be added as a filter when prompts call for it
- Avoid crowding the control area with too many low-value filters

## Stats rules

- Stats must be derived from the two primary collections
- Platform reporting should communicate useful counts/breakdowns rather than vague totals
- Genre breakdowns may be surfaced when requested
- Do not hardcode user-facing totals that can be computed from data

## Formatting rules

- Dates displayed in the UI should support partial historical values gracefully
- Full dates should be human-friendly
- Partial dates should not crash formatting logic
- Half-step ratings should display cleanly
- Optional fields should degrade gracefully when absent

## Accessibility rules

- Modal interactions must support keyboard use
- Preserve Escape close
- Preserve overlay click close
- Preserve focus return
- Keep focus trapping intact when the modal is open
- Interactive active items and cards must remain button- or link-like

## Code quality rules

- Keep functions small and purposeful
- Avoid framework-style abstractions
- Avoid unnecessary generic utility layers
- Prefer straightforward data transforms over cleverness
- Preserve GitHub Pages-safe relative path assumptions
- When migrating schema, remove deprecated logic cleanly rather than piling compatibility hacks on top forever
