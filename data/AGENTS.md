# AGENTS.md

Data instructions for Bro-Ops Trophy Room.

This file applies to `data/` and especially `data/games.json`.

## Top-level structure

The canonical JSON structure is:

- `completed_games`
- `to_play_games`

Do not add a third top-level collection for active games.
Active behavior must be derived from the two main collections.

## Common fields

Common fields used when applicable:
- `id`
- `title`
- `cover_image`
- `status`
- `genre`
- `tags`
- `activity_state` (optional; omit if inactive)
- `notes` (optional)

## Completed-game schema

Required / supported fields:
- `id`
- `title`
- `cover_image`
- `status`
- `platform`
- `start_date`
- `finish_date`
- `total_playtime_hours`
- `completion_type`
- `achievements_completed`
- `achievements_total`
- `rating`
- `genre`
- `tags`
- `notes` (optional)
- `favorite_memory` (optional)
- `activity_state` (optional)
- `replayable` (optional boolean)

### Completed status vocabulary
Allowed values:
- `Completed`
- `100%`

### Completed completion_type vocabulary
Allowed values:
- `Main Story`
- `Main Story + Side Content`
- `All Routes`

Do not use `Total Completion` here because it overlaps with `status: "100%"`.

## To-play schema

Required / supported fields:
- `id`
- `title`
- `cover_image`
- `status`
- `target_platform`
- `estimated_playtime_hours`
- `priority`
- `reason_to_play`
- `genre`
- `tags`
- `notes` (optional)
- `activity_state` (optional)

### To-play status vocabulary
Allowed values:
- `Queued`
- `Waiting for Sale`
- `Considering`
- `On Hold`

### Priority vocabulary
Allowed values:
- `High`
- `Medium`
- `Low`

## Activity-state vocabulary

Allowed values:
- `Currently Playing`
- `In Rotation`
- `Paused`

Rules:
- omit `activity_state` when inactive
- do not use empty strings
- do not use backlog states like `Queued` as activity states
- completed entries may use `In Rotation`
- to-play entries may use `Currently Playing`

## Field-shape rules

- `id`: lowercase kebab-case string
- `title`: formal display title string
- `cover_image`: relative repo path string such as `assets/images/covers/game-title.jpg`
- `platform` / `target_platform`: single string
- `genre`: single string
- `tags`: array of 0 to 3 strings
- `rating`: numeric 1.0 to 5.0, half-step values allowed
- dates: `YYYY-MM-DD`
- `replayable`: boolean if present

## Controlled platform vocabulary

Use exact spelling from the repository-standard platform vocabulary:
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

## Controlled genre vocabulary

Use one value from:
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

## Controlled tag vocabulary

Use up to 3 high-signal tags from:
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

Expand the vocabulary only when truly needed and keep naming consistent.

## Deprecated field

- `backlog_status` is deprecated and should not be used in new data entries

## Editing rules

When editing `games.json`:
- preserve valid JSON syntax
- keep commas correct
- preserve the two top-level arrays
- do not mix old and new schema models
- prefer omission over fake placeholder values for optional fields
