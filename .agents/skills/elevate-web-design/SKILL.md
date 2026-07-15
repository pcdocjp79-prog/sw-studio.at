---
name: elevate-web-design
description: Transform, refine, or review website sections, cards, heroes, interactions, and responsive layouts until they reach a distinctive award-level visual standard without sacrificing usability or performance. Use for HTML, CSS, and JavaScript frontend work when the user asks to beautify, modernize, visually improve, make less generic, add premium motion, create stronger hover behavior, run iterative design loops, or achieve an Awwwards/SOTD-quality result.
---

# Elevate Web Design

Create a deliberate, production-ready visual experience rather than a decorative reskin. Preserve the user's content and intent, build one memorable idea per section, and validate the result through structured improvement loops.

## Load the project context

1. Read the nearest `AGENTS.md` and obey its scope, stack, performance, and editing rules.
2. Read [references/smart-web-studio-visual-language.md](references/smart-web-studio-visual-language.md) before changing this project.
3. Inspect the complete requested section in HTML, every CSS rule that affects it, and its related JavaScript.
4. Inspect adjacent sections so the redesign creates rhythm rather than an isolated showpiece.
5. Preserve copy, colors, order, flip sides, buttons, and behavior unless the user explicitly authorizes changing them.

## Combine relevant skills

Inspect the available skill catalog and use the smallest relevant combination:

- Use `frontend-design` for distinctive art direction and production-grade frontend implementation.
- Use `ui-ux-pro-max` for layout, accessibility, interaction, typography, and responsive guidance.
- Use the available browser-control skill for visual inspection at desktop and mobile widths.
- Use `design-md-catalog` only when a new design direction is needed, not when an established project language already exists.
- Use `imagegen` only when a raster visual materially improves the concept. Prefer HTML, CSS, inline SVG, and existing assets for interface graphics.

Announce each skill when its instructions require it. Do not install dependencies or change frameworks merely to achieve a visual effect.

## Define the design thesis

Before editing, express the section's concept in one internal sentence:

`This section communicates [meaning] through [visual metaphor] with [interaction principle].`

Reject ideas that do not strengthen comprehension, hierarchy, or brand character. Do not equate award-level design with more glow, blur, animation, or decoration.

## Run the three-pass quality loop

Treat all three passes as one scoped upgrade step. Inspect the current result between passes and make targeted improvements instead of repeatedly rebuilding it.

Continue through the passes autonomously when the choices stay inside the requested section. Ask the user only when a decision would change copy, brand direction, functionality, or scope.

### Pass 1 — Composition and hierarchy

- Fix reading order, alignment, spacing, proportions, and responsive structure.
- Remove redundant nested backgrounds and card-within-card framing.
- Give dense text enough room; never force valuable copy into cramped bubbles or pills.
- Integrate controls into the component when that creates a clearer relationship.
- Make the section understandable with animation disabled.

Ask: Is the intended focal point obvious within two seconds?

### Pass 2 — Signature visual language

- Add one ownable visual idea connected to the content.
- Refine typography, dividers, labels, depth, borders, and restrained lighting.
- Use mono micro-labels, diagrams, status indicators, or technical details only when they support the story.
- Reuse existing tokens and visual grammar while avoiding copy-pasted compositions.
- Prefer intentional asymmetry and whitespace over generic equal-card grids where appropriate.

Ask: Could this component be mistaken for a generic template? If yes, strengthen the concept, not the ornament count.

### Pass 3 — Motion, interaction, and hardening

- Animate inner content logically on hover or focus: waveforms should play, signals should travel, meters should react, and diagrams should reveal their state.
- Stagger entry animations subtly from first to last item; avoid instant simultaneous reveals.
- Keep motion calm, legible, and reversible. Prefer `transform` and `opacity`.
- Prevent clipping, overlapping labels, misaligned connector endpoints, and layout shifts.
- Add or preserve `prefers-reduced-motion` behavior.
- Re-check mobile density, touch behavior, keyboard access, contrast, and performance.

Ask: Does every movement explain state or causality? Remove motion that exists only to attract attention.

## Score every pass

Score each dimension internally from 0 to 2 after every pass:

- hierarchy
- distinctiveness
- coherence with adjacent sections
- interaction logic
- responsive resilience
- accessibility
- performance

Do not finish while any dimension scores 0. Run one additional targeted pass for weak dimensions, but stop when further decoration would reduce clarity. Never claim quality based only on subjective confidence.

## Performance rules

- Prefer CSS and inline SVG for interface visuals.
- Reuse the existing JavaScript lifecycle and observers.
- Pause continuous animation outside the viewport when practical.
- Avoid new WebGL scenes, canvas loops, large images, libraries, and network-loaded fonts in the hero unless their benefit clearly outweighs their cost.
- Keep hover animation scoped to the hovered component.
- Ensure the static first frame looks complete before JavaScript executes.

## Implementation rules

- Work only on the section requested by the user.
- Never use an improvement loop as permission to redesign adjacent sections.
- Keep changes modular and reversible.
- Preserve semantic HTML and existing behavior.
- Use the project's established CSS and JavaScript conventions.
- Do not add a framework or dependency for presentation alone.
- Prefer precise selectors and local custom properties over broad overrides.
- Treat desktop, tablet, and narrow mobile layouts as part of the same implementation.
- Compare every addition against the previous state; remove it when it adds noise without improving meaning.

## Visual failure checklist

Reject or fix the result if any item is true:

- Important text is clipped, hidden behind a line, or outside its container.
- Decorative layers obscure labels, nodes, controls, or content.
- Connector lines visually miss their endpoints.
- Multiple nested surfaces create an accidental double-card effect.
- Pills or bubbles contain more text than their proportions support.
- All elements glow, float, pulse, or compete for attention.
- The component works only on hover or only at one viewport width.
- Motion continues unnecessarily when off-screen or reduced motion is requested.
- The result copies a reference instead of expressing the project's own identity.

## Verify before handoff

1. Inspect the result in the available in-app browser at representative desktop and mobile widths.
2. Exercise hover, focus, click, flip, typing, loop, and reduced-motion states that apply.
3. If browser inspection is unavailable, state that briefly and compensate with structural and build validation.
4. Run the project's repository check, syntax-check every changed JavaScript file, run `git diff --check`, and create a production build.
5. Review the final diff for accidental changes outside the requested section.

Report the visual outcome, the meaningful interaction changes, and the verification result. Avoid presenting internal effort or exaggerated award claims as evidence.
