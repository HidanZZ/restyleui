# Teamwork Graph style

Add `data-kit="teamwork"` to `<html>`. Use the values in `theme.css`.
The source uses dark mode. Keep that palette and use invented copy, icons, and images.
Do not use Atlassian or connector logos.

## Look and feel

- Use an ink-black canvas with bright blue graph lines and small yellow, green, or lilac nodes.
- Connect page sections with thin lines, dotted grids, and diagrams. Group related information in cards.
- Set headings in regular or medium weight. Use mono metrics and compact labels for contrast.
- Leave open space around the hero and main diagrams. Keep navigation and controls quiet.

## Tokens

| Use | Value |
|---|---|
| Page background | `--background: #111213` |
| Main surface | `--card: #1f1f21` |
| Raised surface | `--secondary: #242528` |
| Overlay surface | `--popover: #2b2c2f` |
| Sunken surface | `--teamwork-surface-sunken: #18191a` |
| Primary text | `--foreground: #cecfd2` |
| Secondary text | `--muted-foreground: #a9abaf` |
| Subtle text | `--teamwork-text-subtle: #96999e` |
| Brand blue | `--primary: #669df1` |
| Bright blue | `--teamwork-blue-strong: #357de8` |
| Yellow, green, lilac | `--teamwork-yellow: #fca700`, `--teamwork-green: #94c748`, `--teamwork-lilac: #c97cf4` |
| Border | `--border: #e3e4f21f` |
| Input border and focus | `--input: #7e8188`, `--ring: #8fb8f6` |

The source also uses dark blue `#1c2b42`, deep blue `#1558bc`, and teal `#42b2d7`.
Use `#2b2c2f` for low-contrast graph strokes.
Limit most diagrams to two or three accents. Use other colors for node categories and status.

## Typography

- Body: Atlassian Sans, with Inter as the free fallback.
- Display: Charlie Display, with Manrope as the free fallback.
- Mono: Atlassian Mono, with IBM Plex Mono as the free fallback.
- The clone uses Charlie Text for some paragraphs. Keep Atlassian Sans in the shared body stack.

| Role | Size and line height | Use |
|---|---|---|
| UI label | 12px / 20px | Navigation, footer labels, and captions |
| Body | 14px / 20px | Compact interface copy |
| Reading copy | 16px / 28px | Descriptions and supporting paragraphs |
| Small heading | 20px / 30px | Metric labels |
| Section heading | 24px / 36px | Overview panel headings |
| Major heading | 32px / 48px | Major sections |
| Hero supporting copy | 32px / 38.4px | Supporting text below the wordmark |
| Metric | 28px / 40px | Rolling values and counts |

Use regular or medium weight with generous line height. Build the wordmark as artwork.
Keep supporting text in sentence case.

## Layout and grid

- Set the main content width to 1200px. At 1440px, use a 1320px shell with 60px side insets.
- Use 24px gutters by default. Use 48px to 60px at wide desktop. Use 16px to 24px on mobile.
- Use 120px between major sections. Give the wide desktop hero an 1180px artboard.
- Crop the graph field at narrow widths.
- Use an 840px near-square artboard beside a three-item overview accordion.
- Stack the artboard, controls, and copy on mobile.
- Draw graphs on a 60px dotted grid with one-pixel lines.
- Align nodes to the grid. Let selected connectors cross grid lines.
- Center the footer in a six-column grid on wide screens. Use two columns at medium widths and one on narrow screens.

## Surfaces, borders, and radii

- Use `#111213` for the page and `#1f1f21` for filled panels.
- Use `#242528` for raised cards and `#2b2c2f` for overlays.
- Use one-pixel translucent borders with `#e3e4f21f`. Use blue borders for selected items and keyboard focus.
- Use 2px to 4px radii for chips and small controls, 6px for buttons and inputs, and 8px to 12px for cards.
- Use 16px radii for large panels and full rounding for pills.
- When a diagram node floats above the graph, add a shadow.
- Leave other diagram nodes flat.
- Use thin dotted graph connectors and square corners.

## Motion

- **Hero intro:** Stagger avatar entry by 60ms from the center out.
- Draw connector lines over 800ms.
- Pop app icons in over 300ms with a 1.8 overshoot.
- Start wordmark letters after 480ms. Fade them over 400ms.
- Start the yellow stroke at 700ms.
- Draw it over one second.
- Show the subtitle at 1000ms.
- Show the CTA at 1150ms.
- Add slow ambient drift after the entrance. Add edge shimmer to a few connections.
- **Staged overview:** Reveal nodes and connector masks over 1400ms.
- Crossfade active graph layers over 300ms to 400ms.
- Change copy height over 350ms.
- Fade copy over 250ms.
- Use a spring for the progress marker.
- If at least 25% of the section is in view, advance to the next scene every seven seconds.
- **Connector marquee:** Move the icon rail at 60px per second.
- If the rail is outside view or `prefers-reduced-motion` is set, pause it.
- Keep each tile's authored rotation.
- Scale nearby tiles up to 1.6x with a damped pointer response.
- Keep this interaction in the plane. Do not add 3D tilt.
- **Odometer:** Use fixed-width digit cells and a 0-9 roll column.
- The clone uses an estimated 1800ms duration with ease-out cubic.
- When a metric enters view, start the count.
- When `prefers-reduced-motion` is set, show final values without motion.
- Respect `prefers-reduced-motion`. Show required content without animation.

## Imagery and illustration

- Build invented work-graph diagrams with crisp lines, document and task cards, abstract app tiles, and circular people markers.
- Use pale card faces with cobalt, saffron, mint, and lilac details.
- Use luminous nodes on a dark grid.
- Draw partner tiles as abstract geometric symbols. Use invented wordmarks for a logo row.
- Do not use real company names, logos, or copied glyphs.
- Avoid screenshots, office photos, stock images, dominant gradients, and dense UI text.

## Component patterns

- Give buttons and inputs thin borders, dark fills, 6px corners, and a blue focus ring.
- Keep primary blue actions bright and their text readable.
- Give cards a raised dark surface, a translucent border, and moderate padding.
- Add a small grid or connector inside a card. Do not place a grid behind every card.
- Use small status badges with blue, green, yellow, or lilac accents.
- Keep badge text readable.
- Style tabs and accordion rows after the overview selector.
- Use simple headings, fine dividers, one active state, and one progress marker.
- Use text-led navigation. Put dropdowns and dialogs on raised dark surfaces.
- Show clear focus and dismissal states.

## Do / Don't

**Do**

- Use thin lines, consistent graph spacing, clear node categories, and a small accent palette.
- Let diagrams carry the visual weight. Use text to explain graph relationships.
- Show keyboard focus and a reduced-motion path.

**Don't**

- Do not copy source marketing text, trademarks, connector marks, or original media.
- Do not add bright borders to every element, strong blur, heavy shadows, or 3D tilt.
- Do not animate all cards at once. Keep required content visible without motion.
- Do not let the grid obscure content.
