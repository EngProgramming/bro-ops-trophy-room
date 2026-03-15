# Bro-Ops Trophy Room

A static, GitHub Pages-friendly trophy room site for tracking completed and planned bro-op games.

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

## Data organization (`data/games.json`)

The site reads game content from JSON and expects:

- `completed_games`: array of finished entries
- `to_play_games`: array of planned entries

Each object includes metadata used in cards, stats, filters, and modal details. Keep field names consistent when adding new games.

### Canonical status fields

Both collections now include a canonical `status` field:

- `completed_games[].status`: completion-oriented values such as `Completed`, `100%`, or `Replayed`
- `to_play_games[].status`: planning/backlog values such as `High Priority`, `Planned`, or `Waiting for Sale`

For to-play items, `backlog_status` remains an optional supplemental workflow field (for example `Queued` or `On Hold`) and is separate from `status` and `priority`.

### Field guidance

Common fields used across entries:

- `id`
- `title`
- `cover_image`
- `genre`
- `tags`
- `notes` (optional)
- `status`

Completed game fields typically include:

- `platform`
- `start_date`
- `finish_date`
- `total_playtime_hours`
- `completion_type`
- `achievements_completed`
- `achievements_total`
- `rating`
- `favorite_memory`

To-play game fields typically include:

- `target_platform`
- `estimated_playtime_hours`
- `priority`
- `backlog_status` (optional supplemental state)
- `reason_to_play`

## Adding cover art

1. Add cover files into `assets/images/covers/`.
2. Use web-friendly formats (`.jpg`, `.png`, `.webp`, or `.svg`).
3. Update each game's `cover_image` value with a relative path such as:
   - `assets/images/covers/my-game-cover.jpg`

## Image asset locations

- Cover artwork: `assets/images/covers/`
- UI graphics/background accents: `assets/images/ui/`
- Player photos/portraits: `assets/images/portraits/`

## Replacing placeholder game data

1. Open `data/games.json`.
2. Replace placeholder game objects with real entries.
3. Preserve array structure and required fields for each category.
4. Save and refresh the page—cards, stats, and modal content update from JSON automatically.

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
