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

The site reads game content from JSON and currently expects:

- `completed_games`: array of finished entries
- `to_play_games`: array of planned entries

Each game entry should include a canonical `status` field in addition to category-specific fields.

- Example completed status: `Completed`
- Example to-play status: `High Priority`, `Queued`, `Paused`

Keep field names consistent when adding new games so filters, stats, cards, and modal views continue to work.

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
4. Ensure each object has a `status` value appropriate to its category.
5. Save and refresh the page—cards, stats, and modal content update from JSON automatically.

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
