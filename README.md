# Bro-Ops Trophy Room

A static, GitHub Pages-friendly trophy room site for tracking completed and to-play bro-op games.

## Repository structure

```text
.
├── index.html
├── 404.html
├── .nojekyll
├── README.md
├── data/
│   └── games.json
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── script.js
    └── images/
        ├── covers/
        ├── portraits/
        └── ui/
```

## Data schema (`data/games.json`)

The site reads game content from JSON and uses exactly two top-level collections:

- `completed_games`
- `to_play_games`

Do not add a third top-level collection for active games.

### Shared-template model

Both collections use the same canonical field template for easier manual editing:

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

Recommended empty-value conventions:

- optional text/date/state fields: `""`
- optional numeric fields: `null`
- optional booleans: `null`
- arrays: `[]`

The UI is schema-aware and does not render blank optional values.

### Collection-specific usage

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

To-play entries primarily use:

- `status`
- `platform`
- `start_date` / `finish_date` (when planned dates are known)
- `playtime_hours` (estimated)
- `priority`
- `reason_to_play`
- `activity_state`
- `replayable`

### Controlled vocabularies owned in this repo

Completed `status`:

- `Completed`
- `100%`

To-play `status`:

- `Queued`
- `Active`
- `Waiting for Sale`
- `Waiting for Release`
- `Considering`
- `On Hold`

`priority`:

- `High`
- `Medium`
- `Low`

`activity_state`:

- `Currently Playing`
- `In Rotation`
- `Paused`

`completion_type`:

- `Main Story`
- `Main Story + Side Content`
- `All Routes`
- `Milestone / Open-Ended`

`dlc_status`:

- `""`
- `Some DLC Played`
- `All DLC Played`
- `DLC Pending`

### External taxonomies

The following fields are controlled externally and should keep consistent values aligned with the external source taxonomy:

- `genre`
- `tags`
- `setting`
- `audience`
- `theme`
- `purpose`

This repository defines field shape and rendering behavior for those fields, but does not maintain competing allowed-value lists.

### Date support

`start_date` and `finish_date` support:

- `YYYY`
- `YYYY-MM`
- `YYYY-MM-DD`

UI behavior:

- year-only displays as year
- year-month displays as month + year
- full date displays as a full readable date

### Deprecated fields

Do not use:

- `backlog_status`
- `cover_image`
- `target_platform`
- `total_playtime_hours`
- `estimated_playtime_hours`

## Currently Active behavior

The **Currently Active** section is a derived view computed from `completed_games` and `to_play_games` entries that include `activity_state`.

It is not a separate source collection.

## Browse and modal behavior

- Collection Snapshot highlights `Genres Completed` using `completed_games` only, and `Top Genre Mix` is also derived from `completed_games` only.
- Cards in both collections surface `genre` as a first-class metadata line for faster scanability.
- Completed and to-play filters each include derived `genre`, `setting`, and `tag` controls sourced from live data values.
- Modals use a stable structure: media, title/subtitle, primary metadata grid, taxonomy section, then dedicated long-text cards (for notes/reason/favorite memory).
- Replayable appears as a subtle header badge when true instead of a standalone metadata box.
- `purpose` remains in the data schema but is intentionally not surfaced in the modal taxonomy section right now.
- Optional fields still omit cleanly, but section order remains consistent across entries.

## Adding cover art

1. Add cover files into `assets/images/covers/`.
2. Use web-friendly formats (`.jpg`, `.png`, `.webp`, or `.svg`).
3. Update each game's `cover_art_landscape` and/or `cover_art_portrait` values with relative paths.

Presentation behavior:

- Cards prefer `cover_art_landscape`, then fall back to `cover_art_portrait`, then a no-cover placeholder.
- Modals prefer `cover_art_portrait`, then fall back to `cover_art_landscape`, then a no-cover placeholder.
- Card and modal media use contain-style fitting in dark matte frames to reduce destructive cropping.

## Updating game entries

1. Open `data/games.json`.
2. Add or edit real game entries in `completed_games` or `to_play_games`.
3. Keep all canonical fields present on each entry.
4. Use shared empty-value conventions for fields not currently used by that entry.
5. Save and refresh the page—cards, stats, filters, active strip, and modal details update from JSON.

## GitHub Pages deployment note

This repository is configured for static hosting and uses relative paths so it works as a project site under:

`https://EngProgramming.github.io/bro-ops-trophy-room/`

The `.nojekyll` file is included to prevent Jekyll processing.

## Local preview note

Because this site loads JSON with `fetch`, preview with a simple local server instead of opening files directly:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
