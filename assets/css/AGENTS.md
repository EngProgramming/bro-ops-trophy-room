# AGENTS.md

CSS instructions for Bro-Ops Trophy Room.

This file applies to styling work in `assets/css/`.

## Visual direction

The site should feel:
- dark
- premium
- modern
- curated
- game-centric
- clean
- readable

Avoid:
- retro arcade aesthetics
- loud neon overload
- fake 3D gimmicks
- clutter
- dashboard/spreadsheet energy

## Layout hierarchy

The site follows this hierarchy:
- strong hero
- compact but premium stats
- lightweight currently active layer
- denser completed archive
- slightly richer to-play archive
- future-ready about/archive wing
- restrained footer

Preserve that hierarchy unless the task explicitly changes it.

## Archive density rules

- Completed archive should be denser and more scan-friendly
- To-play cards may remain slightly richer
- Cards should not become oversized showcase tiles when the collection grows
- Preserve strong spacing, but do not waste vertical space
- Reassess density only after real content reveals a need

## Card design rules

- Card media should remain visually pleasing in landscape frames
- Avoid destructive cover cropping when possible
- Prefer image-fitting strategies that preserve readability of cover art
- If letterboxing/pillarboxing appears, make it look intentional with a styled background
- Metadata should be grouped clearly
- Limit visual noise from chips and tags
- High-signal fields should be visually prioritized
- Rich detail belongs in modals, not jammed onto cards

## Modal design rules

- Modals should feel like richer trophy entries, not just text dumps
- Show cover art in modals when assets are available
- Portrait art is preferred in the modal when available; landscape art may be used as fallback
- Keep the modal clean, premium, and readable
- Optional fields may disappear, but the layout should still feel consistent

## Section identity rules

Completed and to-play sections should feel distinct but cohesive:
- completed: earned, archival, trophy-like
- to-play: forward-looking, planned, anticipatory
- currently active: compact, live, integrated

Do not make the sections feel like different websites.

## Motion rules

- Keep motion subtle
- Respect reduced-motion behavior where practical
- No flashy animations
- No gimmicks

## Accessibility rules

- Preserve contrast and readability
- Preserve visible focus states
- Do not rely only on color to communicate state
- Keep controls large enough to use comfortably

## Maintainability rules

- Organize styles by section and component
- Prefer clear selectors over overengineered nesting strategies
- Preserve reusable tokens and consistent spacing systems
- Make targeted changes rather than restyling the whole site during focused tasks
