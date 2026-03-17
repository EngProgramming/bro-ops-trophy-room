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

### Common fields

Use these common fields when applicable:

- `id`
- `title`
- `cover_image`
- `status`
- `genre`
- `tags`
- `activity_state` (optional; omit when inactive)
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

## Controlled vocabularies

### Completed status

Allowed values:

- `Completed`
- `100%`

### To-play status

Allowed values:

- `Queued`
- `Waiting for Sale`
- `Considering`
- `On Hold`

### Priority

Allowed values:

- `High`
- `Medium`
- `Low`

### Activity state

Allowed values:

- `Currently Playing`
- `In Rotation`
- `Paused`

Rules:

- `activity_state` is optional.
- Omit it entirely when the game is inactive.
- Do not use backlog workflow values as activity states.

## Deprecated field

- `backlog_status` has been removed from the canonical model and should not be used in data or UI logic.
- To-play workflow stage now lives in `status`.

## Currently Active behavior

The **Currently Active** section is a derived view computed from `completed_games` and `to_play_games` entries that include `activity_state`.

It is not a separate source collection.

## Adding cover art

1. Add cover files into `assets/images/covers/`.
2. Use web-friendly formats (`.jpg`, `.png`, `.webp`, or `.svg`).
3. Update each game's `cover_image` value with a relative path such as:
   - `assets/images/covers/my-game-cover.jpg`

## Image asset locations

- Cover artwork: `assets/images/covers/`
- UI graphics/background accents: `assets/images/ui/`
- Player photos/portraits: `assets/images/portraits/`

## Updating game entries

1. Open `data/games.json`.
2. Add or edit real game entries in `completed_games` or `to_play_games`.
3. Keep field names and values aligned to the schema and controlled vocabularies above.
4. Save and refresh the page—cards, stats, filters, active strip, and modal details update from JSON.

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
