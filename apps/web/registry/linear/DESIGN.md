# Linear style

## Look and feel

A near-black graphite canvas gives product imagery room to lead, with fine borders and restrained surface changes instead of bright cards. Inter typography is crisp and compact, while indigo is reserved for selected states, links, and focus. Motion stays quick and purposeful: headline lines resolve from a soft blur, controls respond immediately, and technical details slide in from the right.

## Tokens

Use the CSS properties in `theme.css` under `[data-kit="linear"]` only.

| Token | Value and use |
|---|---|
| `--background`, `--foreground` | `#08090a` page canvas and `#f7f8f8` primary text. |
| `--card`, `--popover` | `#0f1011` quiet panels and overlay surfaces. |
| `--secondary`, `--muted` | `#1c1c1f` control surfaces and `#141516` selected/tinted surfaces. |
| `--primary`, `--ring` | `#5e6ad2` brand indigo for primary states and keyboard focus. |
| `--accent` | `#18182f` subdued indigo tint; pair with `#f7f8f8` text. |
| `--muted-foreground` | `#8a8f98` supporting text; use `--linear-text-quaternary` `#62666d` only for tertiary metadata. |
| `--border`, `--input` | `#23252a` quiet separators and `#34343a` control outlines. |
| `--linear-bg-marketing` | `#010102` for deep hero/feature backgrounds. |
| `--linear-bg-tertiary`, `--linear-bg-quaternary` | `#232326` and `#28282c` for layered app UI, not large page sections. |
| `--linear-link`, `--linear-accent-hover` | `#828fff` link and hover indigo. |
| `--linear-blue`, `--linear-red`, `--linear-green`, `--linear-orange`, `--linear-yellow`, `--linear-teal` | Product-status colors from the source palette; use sparingly for meaningful state, never as decoration. |
| `--kit-radius-sm`, `--kit-radius`, `--kit-radius-lg` | `6px`, `8px`, `16px`; use `--linear-radius-*` for the rest of the source scale: 4, 6, 8, 12, 16, 24, 32px and pill `9999px`. |
| `--kit-ease`, `--kit-ease-in-out` | Source ease-out quad and ease-in-out quad curves for short control transitions and panel movement. |
| `--kit-container`, `--kit-gutter` | Homepage wrapper is `1344px` content plus responsive outer padding (`46px`, `10px` at 1280px, `28px` at 1024px, `16px` at 640px). Generic pages use a `1024px` max width and `24px` side padding. |
| `--kit-section-y` | `64px` section padding, reduced to `48px` at 768px. |
| `--linear-prose-max`, `--linear-page-max` | `624px` readable text column and `1024px` generic page max width. |
| `--linear-shadow-low`, `--linear-shadow-medium`, `--linear-shadow-high` | Source shadows for floating controls and overlays. Most page surfaces remain shadowless. |

The original body face is Inter Variable, with `var(--font-inter)` as its free fallback. Tiempos Headline is the paid display face, with Newsreader as the free fallback; Berkeley Mono is paid, with JetBrains Mono as the fallback. The site hero itself uses the sans family. Use the display face only where an editorial serif accent is called for, and reserve mono for IDs, code, and small technical labels.

## Typography

The base font is `15px` with `1.5` body line height. Source weight values are `400` regular, `510` medium, `590` semibold, and `680` bold. The clone also defines `300` light.

| Title size token | Size | Line height | Letter spacing | Weight |
|---|---:|---:|---:|---:|
| `--linear-title-1-size` | 17px | 1.4 | -0.012em | 590 |
| `--linear-title-2-size` | 20px | 1.33 | -0.012em | 590 |
| `--linear-title-3-size` | 24px | 1.33 | -0.012em | 590 |
| `--linear-title-4-size` | 32px | 1.125 | -0.022em | 590 |
| `--linear-title-5-size` | 40px | 1.1 | -0.022em | 590 |
| `--linear-title-6-size` | 48px | 1 | -0.022em | 590 |
| `--linear-title-7-size` | 56px | 1.1 | -0.022em | 590 |
| `--linear-title-8-size` | 64px | 1.06 | -0.022em | 590 |
| `--linear-title-9-size` | 72px | 1 | -0.022em | 590 |

Body sizes: large `17px / 1.6 / 0`, regular `15px / 1.6 / -0.011em`, small `14px / 1.5 / -0.013em`, mini `13px / 1.5 / -0.01em`, micro `12px / 1.4 / 0`, and tiny `10px / 1.5 / -0.015em`. Compact UI labels also use `11px`, `12px`, `13px`, `15px`, and `18px` steps. Let the headline scale fluidly down on mobile rather than squeezing desktop line breaks.

## Layout and rhythm

The homepage content maxes at `1344px`; its outer wrapper adds `46px` side padding at wide desktop, `10px` below `1280px`, `28px` below `1024px`, and `16px` below `640px`. The generic page max is `1024px`, prose max is `624px`, and the standard page padding is `24px`. Use a 12-column grid, 8 columns through tablet widths, and 4 columns below `640px`. Keep small UI gaps near `8px`, give major sections `64px` vertical padding, and use `48px` on narrow screens. The sticky header is `72px` high on desktop and `64px` on mobile, with a `20px` backdrop blur.

## Surfaces, borders, and radii

Keep the base canvas nearly black (`#08090a`) and use `#0f1011`, `#141516`, `#1c1c1f`, `#232326`, then `#28282c` to distinguish adjacent interface layers. Use one-pixel borders in `#23252a` or `#34343a`; translucent dividers are `#ffffff0d` and stronger edges are `#ffffff14`. Use `6px` and `8px` for compact controls, `12px` or `16px` for product panels, and `24px` or `32px` only for large media frames. The source uses low, medium, and high shadows of `0 2px 4px #0000001a`, `0 4px 24px #0003`, and `0 7px 32px #00000059`; do not add shadows to every panel.

## Motion

The clone uses `100ms` quick and `250ms` regular transitions; buttons take `160ms` with `cubic-bezier(.25, .46, .45, .94)`. The hero headline resolves from `10px` blur and `26%` vertical offset over `750ms`, staggered by about `90ms`, with `cubic-bezier(.22, .61, .36, 1)`; the product stage fades in over `700ms` after `300ms`. Menus fade or slide over `180ms`, and popup size changes take `220ms`. The tech-spec panel enters from the right with a dim backdrop, closes on Escape or backdrop, and returns focus to its opener. Animate in-view product diagrams once, keep hover feedback to color/opacity/very small transforms, and honor reduced-motion preferences.

## Imagery and component patterns

Use invented dark product-interface renders: dense but legible app chrome, precise dividers, subtle indigo highlights, restrained green or teal status marks, and no copied logos, screenshots, names, or readable real-world text. The source homepage pairs a left-aligned headline with a large interactive workspace preview, then alternates feature copy with product surfaces; customer marks sit in a horizontally moving strip and testimonial cards use quiet tonal variety. Its navigation is compact and sticky, with a full-height mobile menu, while technical details use a right-side drawer.

## Do and don't

- Do use near-black layers, hairline dividers, crisp type, and one controlled accent color.
- Do keep text blocks narrow and product screenshots wide; use status colors only when they communicate state.
- Do use pill buttons selectively and keep primary actions high contrast.
- Do use opacity and short transform transitions, with reduced-motion support.
- Don't use bright gradients, neon glows, or elevated cards as the default surface.
- Don't use real Linear artwork, logos, copy, or screenshots; make every app render invented.
- Don't turn every heading into serif or every label into monospace.
- Don't add bounce, oversized parallax, decorative graphs, or long entrance delays.
