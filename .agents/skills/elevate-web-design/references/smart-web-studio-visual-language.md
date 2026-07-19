# Smart Web Studio visual language

Use this reference for design work in this repository. It records accepted preferences and implementation lessons, not immutable component specifications.

## Desired character

- Aim for precise, calm, technically sophisticated dark interfaces.
- Combine editorial whitespace with credible system-like details.
- Favor deep navy and near-black surfaces, fine cool borders, restrained cyan or blue light, and selective warm orange or amber contrast.
- Use Geist or Inter for primary reading and JetBrains Mono for small system labels, states, indexes, and data.
- Build depth through hierarchy, contrast, thin rules, controlled shadows, and local light rather than heavy glass effects everywhere.
- Make every section feel related while giving it a different composition and visual metaphor.

## Preferences learned from approved iterations

- Preserve strong text but free it from overcrowded bubbles and undersized pills.
- Remove redundant background cards when two surfaces appear directly behind one another.
- Create dynamic cards through purposeful internal states, not whole-card wobble.
- Reveal repeated cards sequentially with a subtle delay from first to last.
- On hover, animate the visualization according to its meaning: audio moves like live audio, signals travel, nodes react, and data changes plausibly.
- Keep phase labels and microcopy above dividers or in a dedicated layer so rules never strike through text.
- Integrate related action buttons into service cards when this improves ownership and reduces detached controls.
- Preserve and improve both sides of flip cards; never polish only the front.
- Respect content hierarchy such as entry package and recommended package on the front, back, and associated actions.
- In the hero, prioritize a fast and complete first render. Prefer a sharp inline SVG system visual over an additional WebGL scene.
- Make network connections terminate exactly at their visible nodes.
- Make code panels loop naturally, scroll inside a clipped viewport, and disappear behind the header divider rather than overlap it.
- Make a digital-brain visual clearly recognizable through silhouette, folds, network points, and signal behavior.

## Composition patterns

Use these as ingredients, not templates:

- editorial header plus technical visualization
- asymmetric bento composition with one dominant element
- system chrome with mono labels and quiet live-state indicators
- thin connector diagrams with exact endpoints
- integrated CTA zones inside cards
- split front/back information architecture for reversible cards
- masked content viewport beneath a fixed panel header
- local radial illumination that belongs to one component

## Motion character

- Prefer smooth, slightly delayed motion over fast simultaneous entrances.
- Use small amplitude and deliberate easing.
- Keep continuous motion localized to one or two hero signals.
- Use hover and focus as triggers for richer inner animation.
- Use short pauses at the end of loops so information remains readable.
- Fade or mask loop resets instead of abruptly jumping.
- Preserve a complete static presentation for reduced-motion users.

## Avoid

- generic neon glass dashboards
- full-section ambient gradients or pseudo-element background layers on the Webentwicklung content sections; keep the fixed global page background as the single source of ambience and contain local light inside components, because clipped section layers can create visible seams on mobile
- clipping a section with `overflow: hidden` when a child surface casts an ambient shadow; the shadow will end as a hard horizontal brightness seam at the section boundary, especially at narrow viewport widths
- excessive rounded pills
- equal visual weight across every card
- text squeezed to fit a decorative shape
- arbitrary floating particles
- repeated identical card layouts across neighboring sections
- deep nested borders and multiple background panels
- connectors that almost reach a node
- animation that begins too quickly to read
- hero effects that add a large runtime or delay the first render

## Existing project constraints

- Keep the static multi-page HTML, CSS, and vanilla JavaScript architecture.
- Keep local fonts and local Tailwind build behavior.
- Reuse existing CSS variables before introducing new local values.
- Prefer component-specific CSS files for substantial visuals.
- Respect the one-section-at-a-time workflow in `AGENTS.md`.
