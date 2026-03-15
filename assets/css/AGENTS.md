# AGENTS.md for assets/css

## Purpose
This directory contains styling for the Bro-Ops Trophy Room site.

The visual goal is a **premium dark collector UI** with strong scanability, tasteful contrast, and restrained motion.

## Styling direction
Keep the site:
- dark,
- modern,
- premium,
- game-forward,
- clean,
- readable,
- card-based,
- desktop-first but responsive.

## Visual priorities
Prioritize:
1. hierarchy,
2. spacing,
3. contrast,
4. card polish,
5. section distinction,
6. subtle interaction feedback.

## Avoid
- retro arcade styling,
- over-bright palettes,
- gimmicky gradients everywhere,
- fake 3D effects,
- visual clutter,
- dashboard/spreadsheet aesthetics,
- excessively dense metadata blocks.

## CSS conventions
- Prefer reusable tokens/custom properties for colors, spacing, radius, and shadows.
- Keep sections clearly commented.
- Preserve a consistent spacing rhythm.
- Keep component styles localized and understandable.
- Do not introduce a utility-framework style naming explosion.

## Interaction and motion
- Motion should be subtle only.
- Hover/focus states should feel polished, not flashy.
- Respect `prefers-reduced-motion` when practical.
- Modal transitions should be restrained.

## Content presentation rules
- Completed and to-play sections should feel related but not identical.
- Cover art should support the design, not overpower it.
- Chips, badges, and metadata pills should look refined and legible.
- Empty states and placeholders should look intentional.

## Responsiveness
- Maintain desktop quality first.
- Do not allow the mobile layout to break, overlap, or become unreadable.
- Prefer straightforward responsive adjustments over complex layout tricks.
