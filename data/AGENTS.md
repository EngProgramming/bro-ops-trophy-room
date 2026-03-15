# AGENTS.md for data

## Purpose
This directory contains the canonical structured content for the Bro-Ops Trophy Room site.

Treat data consistency as important. The site will eventually scale to many games, so schema discipline matters.

## Collection model
Maintain two logical collections:
- `completed_games`
- `to_play_games`

Do not collapse them into a single undifferentiated list unless explicitly instructed.

## Schema guidance
Use stable, descriptive field names.

Recommended common expectations:
- `id`: stable slug-like identifier
- `title`
- `cover_image`
- `genre`
- `tags`
- `notes`
- `status`

Completed-game-oriented fields may include:
- `platform`
- `start_date`
- `finish_date`
- `total_playtime_hours`
- `completion_type`
- `achievements_completed`
- `achievements_total`
- `rating` or `user_rating`
- `favorite_memory`

To-play-oriented fields may include:
- `target_platform`
- `estimated_playtime_hours`
- `priority`
- `reason_to_play`
- `backlog_status`

## Data quality rules
- Use consistent platform naming.
- Use consistent status vocabulary.
- Keep date values machine-friendly and consistent.
- Prefer ISO-like dates in data and human-friendly formatting in the UI.
- Keep tags controlled where possible.
- Do not invent unnecessary fields without a real UI or filtering use.

## Status guidance
Use collection-appropriate status labels.
Examples:

Completed:
- `Completed`
- `100%`
- `Partial Completion`
- `Replayed`

To-play:
- `Planned`
- `High Priority`
- `Waiting for Sale`
- `Researching`
- `Backlog`

## Asset path rules
- Keep `cover_image` values relative.
- Prefer paths like `assets/images/covers/example-title.jpg`.
- Do not use root-absolute paths for project-site assets.

## Change discipline
If you rename a field:
- update all dependent JavaScript,
- update documentation,
- preserve compatibility where practical,
- avoid silent schema drift.
