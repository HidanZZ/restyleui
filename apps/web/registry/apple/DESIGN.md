# Apple style kit

Build a calm, image-led product page with centered type, large product photography, and generous empty space. Alternate black tiles with soft gray tiles, then use a small blue action color.

## Tokens

Set `data-kit="apple"` on `<html>`. `theme.css` defines every token below inside `[data-kit="apple"]`.

| Token | Value | Use |
|---|---|---|
| `--background` | `#fff` | Page surface |
| `--foreground` | `#1d1d1f` | Main text |
| `--card`, `--secondary`, `--muted` | `#f5f5f7` | Light tiles and quiet surfaces |
| `--popover` | `#fafafc` | Open navigation surface |
| `--muted-foreground` | `#6e6e73` | Supporting copy |
| `--accent` | `#e8e8ed` | Hover and quiet contrast |
| `--primary` | `#0071e3` | Filled actions and focus ring |
| `--apple-link` | `#0066cc` | Inline links and outlined actions |
| `--apple-blue-hover` | `#0076df` | Action hover |
| `--apple-blue-active` | `#006edb` | Action press |
| `--border`, `--input` | `#d2d2d7` | Rules and fields |
| `--apple-tertiary-text` | `#86868b` | Low-emphasis copy on dark tiles |

Use `--kit-font-body` for SF Pro Text and `--kit-font-display` for SF Pro Display. The stack falls back to Inter and system sans-serif fonts. SF Pro comes from Apple operating systems. Do not ship font files. The mono token uses system monospace only.

The base radius tokens are `--kit-radius-sm: 5px`, `--kit-radius: 8px`, and `--kit-radius-lg: 12px`. Keep product tiles square. Use `--apple-button-radius: 980px` for pill actions. Cover artwork can use an `8px` clip radius. Use `--kit-ease: cubic-bezier(.4, 0, .6, 1)` for navigation and `--kit-ease-in-out: cubic-bezier(.645, .045, .355, 1)` for the gallery.

Set `--kit-container` to `1024px` for the nav and `--apple-page-max` to `2560px` for the full page. Set `--kit-gutter` to `12px` and `--kit-section-y` to `48px` for the page gutter and base tile padding. Use a `12px` grid gap. Tile padding is `48px` on desktop, `54px` on tablet, and `39px` on mobile. Tall desktop tiles use `56px`. The hero media region measures `580px`, `570px`, and `500px` at those breakpoints. Promo media measures `580px`, `490px`, and `500px`.

## Typography

Use SF Pro Display for tile and gallery headlines. Use SF Pro Text for body copy, buttons, and compact details. Each table cell lists size, weight, line height, and letter spacing, in that order.

| Pattern | Wide desktop, above 1068px | Tablet, 735px to 1068px | Mobile, 734px and below |
|---|---|---|---|
| Body copy | `17px / 400 / 1.4705882353 / -.022em` | Same | Same |
| Hero tile title | `56px / 600 / 1.0714285714 / -.005em` | `48px / 600 / 1.0834933333 / -.002em` | `32px / 600 / 1.125 / .002em` |
| Hero tile subtitle | `28px / 400 / 1.1428571429 / .007em` | `24px / 400 / 1.1666666667 / .009em` | `19px / 400 / 1.2105263158 / .012em` |
| Hero tile callout | `19px / 400 / 1.2105263158 / .012em` | `17px / 400 / 1.2353641176 / -.022em` | Same as tablet |
| Promo tile title | `40px / 600 / 1.1 / 0em` | `32px / 600 / 1.125 / .002em` | Same as tablet |
| Promo tile subtitle | `21px / 400 / 1.1904761905 / .011em` | `19px / 400 / 1.2105263158 / .012em` | Same as tablet |
| Promo detail | `14px / 400 / 1.2857742857 / -.016em` | Same | Same |
| Gallery title | `56px / 600 / 1.0714285714 / -.005em` | `32px / 600 / 1.125 / .004em` | Same as tablet |
| Gallery caption | `21px / 400 / 1.1904761905 / .011em` | `17px / 400 / 1.2353641176 / -.022em` | Same as tablet |
| Default action label | `14px / 400 / 1.2857742857 / -.016em` | Same | Same |

Hero actions use `17px / 400 / 1.1764805882 / -.022em` from 735px up. Use the default action size on mobile.

## Layout and surfaces

Stack the hero tiles at full viewport width with a `12px` gap. Use two equal columns for promo tiles from 735px up. Collapse the promo grid to one column below 735px and remove its outer gutter. Keep all tile media full bleed and bottom aligned. Center the heading, subtitle, and one or two actions above the image.

Use `#f5f5f7` for light tiles and `#000` for dark tiles. Use `#1d1d1f` on light surfaces and `#f5f5f7` on dark surfaces. Keep corners square on large sections. Avoid card borders and shadows. Use pill buttons with blue fill or a blue outline.

## Motion

The desktop flyout waits about `460ms` after pointer exit before it closes. The CSS close delay is `120ms`. Flyout links fade and rise over `320ms` with the nav easing curve. Stagger links by `20ms` and groups by `80ms`. Use a `240ms` transition for nav color and surface changes.

The gallery advances on a `4.16s` timer. The clone controller uses a `1s` track transition with the gallery easing curve. Its stylesheet fallback sets `800ms`; caption opacity changes over `400ms`. Pause playback when the user requests it and respect reduced motion.

Keep inline link chevrons static, with a `--apple-link-chevron-gap` of `.24em`. The source underlines these links on hover. Tile links do not lift or zoom their images. Filled actions change from `#0071e3` to `#0076df` on hover and to `#006edb` while pressed.

## Imagery and component patterns

Use large, centered product photography on flat studio backgrounds. Show invented, unbranded devices with clear materials and one focal object. Gallery slides can show original fictional scenes, but they contain no titles, logos, or readable interface text. Do not reuse Apple products, Apple logos, source photography, or source copy.

Build cards as flat image tiles, not floating boxes. Use short centered headings and concise copy. Use the navbar for a translucent, grouped flyout. Use the footer as a compact link directory that becomes an accordion on mobile. Use carousel dots for the endless gallery. Use a badge for a small count or label, not a large callout.

The generated media files are:

- Standard set: `hero.webp`, `feature-1.webp` to `feature-3.webp`, `tab-1.webp` to `tab-3.webp`, `avatar-1.webp` to `avatar-3.webp`, `loop.mp4`, and `loop-poster.webp`.
- Endless gallery slides: `gallery-far-shore.webp`, `gallery-orbit-station.webp`, `gallery-citrus-kitchen.webp`, `gallery-cloud-train.webp`, `gallery-alpine-fox.webp`, and `gallery-city-volley.webp`.

## Do and do not

- Do keep the page quiet, spacious, and product focused.
- Do use a small number of colors and a clear type hierarchy.
- Do keep motion short and tied to a state change.
- Do make every product and scene original, unbranded, and free of text.
- Do not use Apple logos, product images, interface captures, or brand copy.
- Do not add gradients, decorative shadows, rounded tile grids, or spring motion.
- Do not add hover lift or image zoom to product tiles.
