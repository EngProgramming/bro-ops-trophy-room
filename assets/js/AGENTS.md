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

Treat absence of `activity_state` as inactive.
Do not rely on blank strings.
Do not use `Queued` or other backlog states as activity values.

### Status rules
Completed `status` values:
- `Completed`
- `100%`

To-play `status` values:
- `Queued`
- `Waiting for Sale`
- `Considering`
- `On Hold`

Priority values:
- `High`
- `Medium`
- `Low`

Do not reintroduce `backlog_status` into rendering or filtering logic.

## Rendering rules

- Completed cards should be denser than to-play cards
- To-play cards can remain slightly richer and more planning-oriented
- Cards should show only high-signal information
- Rich details belong in modals
- Active items should integrate into the same browse/detail model as the main collections when the prompt calls for it

## Filtering and sorting rules

- Keep completed and to-play controls separate
- `status` and `priority` are different concepts and must remain separate
- Filters should be robust to missing optional fields
- Derived filter options should reflect controlled vocabularies found in the data
- Empty results must render an intentional empty state, not a blank area

## Stats rules

- Stats must be derived from the two primary collections
- Completed logged hours and planned estimated hours are separate concepts
- Platform reporting should communicate useful counts/breakdowns rather than vague totals
- Do not hardcode user-facing totals that can be computed from data

## Formatting rules

- Dates displayed in the UI should be human-friendly
- Raw JSON date values stay in `YYYY-MM-DD`
- Half-step ratings should display cleanly
- Optional fields should degrade gracefully when absent

## Accessibility rules

- Modal interactions must support keyboard use
- Preserve Escape close
- Preserve overlay click close
- Preserve focus return
- Keep focus trapping intact when the modal is open

## Code quality rules

- Keep functions small and purposeful
- Avoid framework-style abstractions
- Avoid unnecessary generic utility layers
- Prefer straightforward data transforms over cleverness
- Preserve GitHub Pages-safe relative path assumptions
- When migrating schema, update legacy logic carefully rather than piling compatibility hacks on top forever

## When schema changes happen

If a prompt changes schema expectations:
- update rendering logic
- update filtering logic
- update derived views
- remove deprecated field dependencies
- keep the final code aligned to the current canonical schema, not mixed old/new behavior
