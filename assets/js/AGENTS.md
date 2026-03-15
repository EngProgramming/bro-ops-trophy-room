# AGENTS.md for assets/js

## Purpose
This directory contains the JavaScript for the Bro-Ops Trophy Room site.

Write JavaScript that is **clear, incremental, and easy to review**. This project is intentionally lightweight. Do not turn it into an app framework.

## JavaScript standards
- Use plain modern JavaScript.
- Favor small, readable functions with obvious names.
- Organize logic by responsibility:
  - data loading,
  - derived stats,
  - filters/sorts,
  - rendering,
  - interaction behavior,
  - modal behavior.
- Keep the code understandable to a non-expert owner.
- Avoid clever abstractions unless they clearly reduce complexity.

## Do not
- Do not introduce framework patterns.
- Do not create unnecessary class hierarchies.
- Do not add a state-management library.
- Do not over-abstract one-off UI behavior.
- Do not leave visible controls partially unwired.

## Data handling rules
- Treat `data/games.json` as the canonical content source unless told otherwise.
- Preserve the distinction between `completed_games` and `to_play_games`.
- Keep filtering and sorting logic aligned with actual fields in the JSON.
- If a filter is visible, it must work.
- If the data model changes, update all dependent render and filter logic.

## UI behavior rules
- Keep rendered card markup and modal markup readable.
- Prefer graceful empty states over blank areas.
- Format dates for display in the UI instead of forcing presentation formatting into JSON.
- Keep hero/stats/card content driven from data when practical.
- Maintain keyboard-friendly interaction patterns.

## Modal rules
If a modal is used:
- open reliably from cards or explicit triggers,
- close on Escape,
- close on overlay click when appropriate,
- return focus to the triggering element,
- trap focus while open when practical.

## Stats and filters
- Derived values should be semantically clear, not technically misleading.
- Avoid ambiguous labels like "combined hours" unless the combined meaning is explicit.
- Platform counts should communicate counts by platform, not just the number of unique platforms, unless that is explicitly requested.

## Performance and scope
- Optimize for simplicity and correctness over micro-optimizations.
- This is a small static site. Keep the implementation light.
- Prefer incremental edits over full rewrites.
