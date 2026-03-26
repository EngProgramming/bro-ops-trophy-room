# AGENTS.md

Bro-Ops Trophy Room repository instructions for Codex.

## Mission

This repository powers a static website called **Bro-Ops Trophy Room**. The site is a premium-feeling digital archive of two friends' shared gaming history. It must remain easy to host on GitHub Pages and easy for a non-expert owner to maintain.

Default priorities, in order:
1. Preserve correctness and GitHub Pages compatibility
2. Preserve the established information architecture and approved schema discipline
3. Improve scanability, polish, and emotional tone
4. Make manual data entry safer and easier where practical
5. Avoid unnecessary complexity

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
- future timeline views

Derived sections must be computed from the primary collections rather than duplicating data.

## Canonical schema rules

### Shared template strategy

The data model should favor easier manual editing by the repository owner.

Use a broadly shared template shape across both collections when practical.

Recommended empty-value conventions:
- optional text/date/state fields: `""`
- optional numeric fields: `null`
- optional booleans: `null`
- arrays: `[]`

The UI should not render blank optional values.

### Common fields

Use these common fields when applicable:
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

### Completed-game fields

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
- `favorite_memory`
- `replayable`

### To-play fields

To-play entries primarily use:
- `status`
- `platform`
- `start_date` and `finish_date` if planned dates are known
- `playtime_hours` as estimated hours
- `priority`
- `reason_to_play`
- `activity_state`
- `replayable` when relevant for naturally ongoing games

### Deprecated / disallowed fields

- `backlog_status` is deprecated and must not be introduced into new data or new UI logic
- `target_platform` and `estimated_playtime_hours` are deprecated and must not be introduced into new data or UI logic
- `cover_image` is deprecated and must not be introduced into new data or UI logic

## Controlled vocabularies owned in this repo

### Completed `status`
Allowed values:
- `Completed`
- `100%`

### To-play `status`
Allowed values:
- `Queued`
- `Active`
- `Waiting for Sale`
- `Waiting for Release`
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
- treat `activity_state` as active-only metadata
- do not use backlog concepts like `Queued` as `activity_state`
- blank/null activity should not render in the UI

### `completion_type`
Allowed values:
- `Main Story`
- `Main Story + Side Content`
- `All Routes`
- `Milestone / Open-Ended`

### `dlc_status`
Allowed values:
- `""`
- `Some DLC Played`
- `All DLC Played`
- `DLC Pending`

## Field-shape rules

- `id`: lowercase kebab-case string
- `title`: full display title string
- `cover_art_landscape`: relative repo path string when available
- `cover_art_portrait`: relative repo path string when available
- `platform`: single string from the controlled platform vocabulary
- `genre`: single string from the external controlled vocabulary
- `tags`: array of exactly 3 strings for now, from the external controlled vocabulary
- `setting`, `audience`, `theme`, `purpose`: external controlled vocabulary fields
- `rating`: numeric 1.0 to 5.0, half-step values allowed
- `start_date` / `finish_date`: support `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`
- `replayable`: boolean if present
- `has_achievements`: boolean if present

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

Only add new platform values when genuinely needed. Prefer consistency over exhaustiveness.

## External taxonomies

Genre, tags, setting, audience, theme, and purpose vocabularies are controlled externally by another project.

This repository should:
- preserve field shape,
- preserve expected render/filter behavior,
- avoid inventing new competing vocabularies here,
- and keep exact value usage consistent with the external source.

## UX rules

The site follows a scan-first, detail-on-demand model.

- Cards should stay compact and readable
- Completed archive should be denser than to-play
- Richer details belong in modals
- Active items should feel integrated, not duplicated
- Cover art should be visible on cards and in modals
- Card image treatment should avoid destructive cropping when practical
- Use optional-field rendering rather than showing empty placeholders

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
- state how real existing data was normalized when migrations are involved
