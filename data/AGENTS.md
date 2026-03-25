# AGENTS.md

Data instructions for Bro-Ops Trophy Room.

This file applies to `data/` and especially `data/games.json`.

## Top-level structure

The canonical JSON structure is:

- `completed_games`
- `to_play_games`

Do not add a third top-level collection for active games.
Active behavior must be derived from the two main collections.

## Shared template strategy

The repository should favor a stable shared template shape that is easier for a human owner to edit consistently.

Recommended empty-value conventions:
- optional text/date/state fields: `""`
- optional numeric fields: `null`
- optional booleans: `null`
- arrays: `[]`

The UI layer should avoid rendering blank optional values.

## Common fields

Common fields used when applicable:
- `id`
- `title`
- `cover_art_landscape`
- `cover_art_portrait`
- `status`
- `platform`
- `start_date`
- `finish_date`
- `playtime_hours`
- `genre`
- `tags`
- `setting`
- `audience`
- `theme`
- `purpose`
- `activity_state`
- `replayable`
- `has_achievements`
- `achievements_completed`
- `achievements_total`
- `rating`
- `priority`
- `reason_to_play`
- `notes`
- `favorite_memory`
- `completion_type`
- `dlc_status`

## Completed-game schema

Completed entries primarily use:
- `status`
- `platform`
- `start_date`
- `finish_date`
- `playtime_hours`
- `completion_type`
- `dlc_status`
- `has_achievements`
- `achievements_completed`
- `achievements_total`
- `rating`
- `notes`
- `favorite_memory`
- `activity_state`
- `replayable`

### Completed status vocabulary
Allowed values:
- `Completed`
- `100%`

### Completed completion_type vocabulary
Allowed values:
- `Main Story`
- `Main Story + Side Content`
- `All Routes`
- `Milestone / Open-Ended`

### DLC status vocabulary
Allowed values:
- `""`
- `Some DLC Played`
- `All DLC Played`
- `DLC Pending`

## To-play schema

To-play entries primarily use:
- `status`
- `platform`
- `start_date`
- `finish_date`
- `playtime_hours`
- `priority`
- `reason_to_play`
- `notes`
- `activity_state`
- `replayable`

### To-play status vocabulary
Allowed values:
- `Queued`
- `Active`
- `Waiting for Sale`
- `Waiting for Release`
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
- blank/null activity means inactive
- do not use backlog states like `Queued` as activity states
- completed entries may use `In Rotation`
- to-play entries may use `Currently Playing` or `Paused`

## Achievements rules

- `has_achievements` should indicate whether achievement counts are meaningful at all
- when `has_achievements` is false, achievement counts may be null
- avoid using `0 / 0` as the preferred representation for “achievements do not exist”

## Field-shape rules

- `id`: lowercase kebab-case string
- `title`: formal display title string
- `cover_art_landscape`: relative repo path string when available
- `cover_art_portrait`: relative repo path string when available
- `platform`: single string
- `genre`: single string from an external controlled vocabulary
- `tags`: array of exactly 3 strings for now, from an external controlled vocabulary
- `setting`, `audience`, `theme`, `purpose`: external controlled vocabulary fields
- `rating`: numeric 1.0 to 5.0, half-step values allowed
- `start_date` / `finish_date`: may be `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`
- `replayable`: boolean if present
- `has_achievements`: boolean if present

## Platform vocabulary

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
- `PlayStation 4 Pro`
- `PlayStation 5`
- `PlayStation 5 Pro`
- `Xbox`
- `Xbox 360`
- `Xbox One`
- `Xbox Series S`
- `Xbox Series X`
- `Nintendo 64`
- `GameCube`
- `Wii`
- `Wii U`
- `Nintendo Switch`
- `Nintendo Switch 2`
- `Dreamcast`
- `Nintendo DS`
- `Nintendo 3DS`

## External taxonomies

`genre`, `tags`, `setting`, `audience`, `theme`, and `purpose` are controlled externally.

This repo should define shape and usage, not maintain competing value lists here.

## Deprecated fields

- `backlog_status` is deprecated and should not be used in new data entries
- `target_platform` and `estimated_playtime_hours` are legacy field names slated for migration toward the shared template model
- `cover_image` is a legacy field name slated for migration toward split landscape/portrait cover fields

## Editing rules

When editing `games.json`:
- preserve valid JSON syntax
- keep commas correct
- preserve the two top-level arrays
- do not mix old and new schema models
- prefer the shared-template conventions over ad hoc omissions once the migration prompt is approved
- keep real user-authored notes and memories intact during migrations
