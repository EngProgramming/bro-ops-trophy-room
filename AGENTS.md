# AGENTS.md

Bro-Ops Trophy Room repository instructions for Codex.

## Mission

This repository powers a static website called **Bro-Ops Trophy Room**. The site is a premium-feeling digital archive of two friends' shared gaming history. It must remain easy to host on GitHub Pages and easy for a non-expert owner to maintain.

Default priorities, in order:
1. Preserve correctness and GitHub Pages compatibility
2. Preserve the established information architecture and schema discipline
3. Improve scanability, polish, and emotional tone
4. Avoid unnecessary complexity

## Technical constraints

- Use plain HTML, CSS, and JavaScript only
- No frameworks
- No build tools
- No package managers
- No server-side code
- No external dependencies that require a build step
- Keep all paths GitHub Pages safe and relative
- Preserve static hosting compatibility

## Branch / workflow rules

- The canonical base branch is `main`
- Any pull request must target `main`
- Treat `main` as the only long-lived branch
- Keep changes incremental and tightly scoped
- Do not rewrite unrelated parts of the site during a focused task

## Project direction

The site should feel:
- dark
- modern
- premium
- game-centric
- clean
- curated
- scan-friendly

Avoid:
- retro arcade styling
- bright/neon overload
- spreadsheet-like layouts
- giant video backgrounds
- gimmicky fake-3D effects
- overengineering

## Core information architecture

There are exactly **two primary collections**:
- `completed_games`
- `to_play_games`

Do **not** add a third top-level collection for active games.

The site may derive secondary views from those two collections, such as:
- stats
- currently active / in rotation strip
- filtered subsets
- spotlight sections

Derived sections must be computed from the primary collections rather than duplicating data.

## Canonical schema rules

### Common fields

Use these common fields when applicable:
- `id`
- `title`
- `cover_image`
- `status`
- `genre`
- `tags`
- `activity_state` (optional; omit if inactive)
- `notes` (optional)

### Completed-game fields

Completed entries use:
- `platform`
- `start_date`
- `finish_date`
- `total_playtime_hours`
- `completion_type`
- `achievements_completed`
- `achievements_total`
- `rating`
- `favorite_memory` (optional)
- `replayable` (optional boolean)

### To-play fields

To-play entries use:
- `target_platform`
- `estimated_playtime_hours`
- `priority`
- `reason_to_play`
- `notes` (optional)

### Deprecated / disallowed field

- `backlog_status` is deprecated and must not be introduced into new data or new UI logic
- If legacy code still references it, migrate that logic toward `status`

## Controlled vocabularies

### Completed `status`
Allowed values:
- `Completed`
- `100%`

### To-play `status`
Allowed values:
- `Queued`
- `Waiting for Sale`
- `Considering`
- `On Hold`

### `priority`
Allowed values:
- `High`
- `Medium`
- `Low`

### `activity_state`
Allowed values:
- `Currently Playing`
- `In Rotation`
- `Paused`

Important:
- Omit `activity_state` entirely when a game is not active
- Do not use blank strings for inactive items
- Do not use backlog concepts like `Queued` as an `activity_state`

### `completion_type`
Allowed values:
- `Main Story`
- `Main Story + Side Content`
- `All Routes`

Important:
- Do not use `Total Completion` here because that overlaps with `status: "100%"`

## Field-shape rules

- `id`: lowercase kebab-case string
- `title`: full display title string
- `cover_image`: relative repo path string
- `platform` / `target_platform`: single string from the controlled platform vocabulary
- `genre`: single string from the controlled genre vocabulary
- `tags`: array of 0 to 3 strings from the controlled tag vocabulary
- `rating`: numeric 1.0 to 5.0, half-step values allowed
- dates: `YYYY-MM-DD` strings
- `replayable`: boolean

Do not change field shapes casually. Keep the schema stable.

## Controlled platform vocabulary

Use exact spelling and consistent casing.

Starter platform vocabulary:
- `Steam`
- `PC`
- `GOG`
- `EA App`
- `Ubisoft Connect`
- `Epic Games Store`
- `PlayStation`
- `PlayStation 2`
- `PlayStation 3`
- `PlayStation 4`
- `PlayStation 5`
- `Xbox`
- `Xbox 360`
- `Xbox One`
- `Xbox Series X|S`
- `Nintendo Switch`

Only add new platform values when they are genuinely needed. Prefer consistency over completeness.

## Controlled genre vocabulary

Use this site-level genre taxonomy:
- `Action`
- `Adventure`
- `Action-Adventure`
- `RPG`
- `Shooter`
- `Strategy`
- `Puzzle`
- `Platformer`
- `Fighting`
- `Racing`
- `Simulation`
- `Survival`
- `Horror`
- `Visual Novel`
- `Roguelike`
- `Rhythm`
- `Party`
- `Sandbox`

Do not convert `genre` into an array. Additional nuance belongs in `tags`.

## Controlled tag vocabulary

Use a controlled starter tag list and expand only when needed.

Starter tags:
- `Co-op`
- `Online Co-op`
- `Local Co-op`
- `Story`
- `Cinematic`
- `Choice-Driven`
- `Psychological Horror`
- `Horror`
- `Mystery`
- `Comedy`
- `Strategy`
- `Deckbuilding`
- `Replayable`
- `Rhythm`
- `Dating Sim`
- `Female Protagonist`
- `Fantasy`
- `Sci-Fi`
- `Stealth`
- `Survival`
- `Open World`
- `Turn-Based`

Keep tags high-signal and restrained. Avoid tag bloat.

## UX rules

The site follows a scan-first, detail-on-demand model.

- Cards should stay compact and readable
- Completed archive should be denser than to-play
- Richer details belong in modals
- Cross-collection active items should feel integrated, not duplicated
- Preserve the existing distinction between completed, to-play, and currently active derived views

## Review / change rules

When asked to make changes:
- update only the files necessary for the task
- preserve working features unless the prompt explicitly asks to change them
- keep code readable
- avoid broad refactors during focused tasks
- update `README.md` whenever schema, setup, or content-editing workflows change materially

## Output expectations for Codex tasks

Unless the prompt says otherwise:
- provide full contents of every changed file
- clearly label each file path
- explain any schema migrations or deprecations
