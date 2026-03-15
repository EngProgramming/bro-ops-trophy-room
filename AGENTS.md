# AGENTS.md

## Purpose
This repository contains the **Bro-Ops Trophy Room** website.

Your job is to act as the implementation agent for a **premium, static, GitHub Pages-friendly game trophy room** built for two friends' shared gaming history. This is a personal project, not a SaaS app.

The site must feel curated, modern, dark, premium, and easy to browse. It must **not** feel like a spreadsheet, retro arcade toy, flashy concept demo, or overengineered frontend app.

## Primary product intent
Build and refine a website that:
- showcases completed games and future/to-play games,
- preserves meaningful metadata and memories,
- stays easy to scan,
- supports richer detail on demand,
- remains maintainable as content grows,
- works cleanly on GitHub Pages.

When tradeoffs arise, prioritize:
1. clarity,
2. cohesion,
3. maintainability,
4. visual polish,
5. static-site simplicity.

## Technical constraints
- Use **HTML, CSS, and vanilla JavaScript only** unless the user explicitly approves otherwise.
- Do **not** introduce React, Vue, Svelte, Tailwind, Bootstrap, jQuery, npm packages, bundlers, transpilers, or any build step.
- Do **not** introduce a backend, database, authentication, admin system, CMS, or server-side rendering.
- Assume deployment target is **GitHub Pages**.
- Preserve **relative paths** suitable for a project site hosted at `/bro-ops-trophy-room/`.
- Keep the repo fully static and directly publishable.

## Repository assumptions
Expected important paths:
- `index.html`
- `404.html`
- `README.md`
- `.nojekyll`
- `assets/css/styles.css`
- `assets/js/script.js`
- `assets/images/covers/`
- `assets/images/ui/`
- `assets/images/portraits/`
- `data/games.json`

If these paths change, only do so with a strong reason.

## Git and branch workflow
- Treat `main` as the canonical base branch.
- If your environment creates a working branch for changes, the pull request must target **main**.
- Do **not** retarget work to non-main branches unless explicitly instructed.
- Keep changes incremental and reviewable.
- Prefer small, focused diffs over broad rewrites.

## Working style
Before editing:
1. Inspect the files actually relevant to the request.
2. Identify what should be preserved.
3. Make the smallest coherent set of changes that solves the task.
4. Verify that the requested behavior is actually implemented.

For non-trivial tasks:
- briefly state the plan,
- call out assumptions,
- then implement.

After editing:
- summarize what changed,
- explain any root cause for bug fixes,
- mention anything still unresolved.

## Product and design guardrails
Maintain these defaults unless the user overrides them:
- dark theme,
- premium collector UI,
- sleek modern game-library feel,
- subtle motion only,
- strong hierarchy and spacing,
- card-first browsing,
- modal/detail-on-demand pattern,
- clear distinction between completed and to-play sections,
- room for future personal/about content.

Avoid:
- retro arcade styling,
- neon overload,
- giant video backgrounds,
- fake 3D gimmicks,
- cluttered dashboards,
- spreadsheet-like layouts,
- unnecessary visual noise.

## Data/content model expectations
The content model should stay aligned with the repository's JSON schema for:
- `completed_games`
- `to_play_games`

Prefer stable, explicit field names. Keep the schema simple enough for static consumption and scalable enough for later content growth.

General expectations:
- image paths remain relative,
- platform names stay consistent,
- date storage can remain machine-friendly,
- display formatting should happen in the UI,
- filters/sorts should reflect actual available data fields,
- visible controls must not be dead UI.

## Accessibility and UX rules
- Use semantic HTML.
- Preserve heading hierarchy.
- Use real buttons for interactive controls.
- Ensure keyboard usability.
- If a modal exists, it should support Escape-to-close and keyboard-safe behavior.
- Prefer readable contrast and restrained motion.
- Respect reduced-motion preferences when practical.

## GitHub Pages rules
- Keep the site compatible with GitHub Pages.
- Keep `.nojekyll` in place unless there is a strong reason not to.
- Use only relative paths for internal assets.
- Do not assume server behavior.
- If adding new pages, ensure links still work in a project-site context.

## Change discipline
When the user asks for revisions:
- preserve working structure unless change is necessary,
- avoid opportunistic rewrites,
- do not "clean up" unrelated areas,
- do not silently rename schema fields without updating all dependent code and documentation.

## Definition of done
A task is not done unless:
- the requested behavior exists in code,
- the implementation matches the prompt scope,
- the change stays within the HTML/CSS/JS constraint,
- GitHub Pages compatibility is preserved,
- the result is readable enough for future iteration.

## Output expectations
When returning work:
- provide the full contents of changed files when requested,
- clearly label file paths,
- explain root cause for bugs,
- keep explanations concise but specific.
