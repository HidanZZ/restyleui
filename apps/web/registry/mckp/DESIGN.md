# mckp style

A dark product studio. Near-black pages, cinematic 3D device renders, white type and almost no color. The brand accent is electric blue used only for selection and code highlights. Motion is slow and engineered: things ease into place, tilt a few degrees under the pointer, and play video only when seen.

Use this file before building any mckp piece. Tokens live in `theme.css`; add `data-kit="mckp"` to `<html>` and load Inter (400, 500, 600) plus DM Mono (400) from Google Fonts.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--background` | `#101010` | Page. |
| `--foreground` | `#ffffff` | Primary text. |
| `--card` | `#161616` | Card and library tile surface. |
| `--card-foreground` | `#ffffff` | Card titles. |
| `--popover` | `#181818` | Menus, dialogs, raised panels. |
| `--popover-foreground` | `#ffffff` | Popover text. |
| `--primary` | `#ffffff` | Primary button fill. |
| `--primary-foreground` | `#000000` | Primary button text. |
| `--secondary` | `#161616` | Secondary button surface. |
| `--secondary-foreground` | `#ffffff` | Secondary button text. |
| `--muted` | `#161616` | Quiet surface. |
| `--muted-foreground` | `#b8b8b8` | Body copy on black. |
| `--accent` | `#2f00ff` | Electric blue: selection, code, rare highlight. |
| `--accent-foreground` | `#ffffff` | Text on electric blue. |
| `--border` | `#252525` | Hairlines and dividers. |
| `--input` | `#252525` | Field borders. |
| `--ring` | `#ffffff` | Focus rings. |
| `--kit-radius-sm` | `6px` | Logo tile, small chips. |
| `--kit-radius` | `8px` | Buttons, feature cards, nav links. |
| `--kit-radius-lg` | `12px` | Cards, library tiles, editor videos. |
| `--kit-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, reveals, large moves. |
| `--kit-ease-in-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Hover and color swaps. |
| `--kit-container` | `1200px` | Page content width, gutter included. |
| `--kit-section-y` | `120px` | Section padding, 80px at 1024px, 60px at 768px. |
| `--kit-gutter` | `40px` | Page side padding, 24px at 1024px, 16px at 768px. |

Extra surfaces: `--mckp-surface-deep: #121212`, `--mckp-surface: #161616`, `--mckp-surface-raised: #181818`, `--mckp-surface-glass: #1c1c1cb8`, `--mckp-page-black: #000000`.
Extra ink: `--mckp-ink-soft: #b8b8b8`, `--mckp-ink-dim: #3b3b3b`, `--mckp-ink-faint: #7c7c7c`, `--mckp-ink-mono: #818181`.
Lines: `--mckp-line-soft: #1e1e1e`, `--mckp-line-strong: #2e2e2e`.
Code demo colors: `--mckp-code-blue: #00a1ff`, `--mckp-code-violet: #9346ff`, `--mckp-code-orange: #ff6600`, `--mckp-code-green: #67c416`.
Space: 6, 8, 12, 24, 60px. Larger section tops use `--mckp-section-y-lg: 160px`; compact section bottoms use `--mckp-section-y-sm: 80px`.

## Typography

| Role | Size / line | Weight | Tracking | Color |
|---|---|---|---|---|
| Display, section names | 80 / 80px | 500 | -4.2px | `#ffffff` |
| H1, hero and CTA | 70 / 1 | 500 | -3px | `#ffffff` |
| H2, section headings | 38 / 42px | 400 | -1.52px | `#ffffff` |
| Body | 16 / 24px | 400 | normal | `#b8b8b8` or `#3b3b3b` |
| Nav and button | 14 / 24px | 600 | normal | `#ffffff` |
| Small, footer | 14 / 22px | 400 | normal | `#7c7c7c` |
| Mono, numbers and dates | 12 / 24px | 400 | normal | `#818181` |
| Note under media | 11 / 16px | 400 | normal | `#5c5c5c` |

Responsive: H1 56px at 1024px and 36px at 768px; H2 32/36 at 1024px and 26/30 at 768px; display name 60px then 42px. All in `theme.css` as `--mckp-type-*`.

Only Inter. Display type is still Inter 500; never 700. Headlines are tight and often line-broken by hand. Body copy is quiet: use white for the message and `#3b3b3b` for the second sentence on cards. The hero description and CTA subtitle max out at 494px. Card descriptions max 30ch. DM Mono is for uppercase-free micro labels: step numbers `01`, dates, percentages, version tags. Do not letterspace mono text.

## Layout

- Page content sits in a 1200px container that includes `--kit-gutter`. Full-bleed media is allowed; text is not.
- 9 column grid. Body copy starts at column 2, not column 1. Headings span 2/6 or 2/5; the matching aside sits at 7/9 and aligns to the bottom. This left indent is the signature, keep it.
- Card grids use 3 columns with a 2px gap. Library previews use 4 columns with 2px gaps and 4:3 tiles, 3 columns under 1024px, 1 column under 768px.
- Feature grid is 2x2, 4px gap, 548px rows, 32px padding. Below 768px it becomes one column and each card is at least 400px tall.
- Hero: centered, 544px minimum, 60px vertical padding, 24px gaps. Header is 12px outer padding, 20px on the left.
- Sections: 120px top and 80px bottom by default; 160px top for text-led blocks and the CTA. Mobile: 60/40.
- Editorial sections often end with a 1px `#252525` divider that spans the container.

## Surfaces, borders, radii

- Cards: `#161616`, 12px radius, 24px padding, no border, no shadow. Hover raises the surface to `#181818`.
- Feature and demo cards: `#121212`, 8px radius, 32px padding. The full-bleed progressive card is pure black.
- Library tiles: `#161616`, 12px radius, 4:3, overflow clipped, name appears on hover at bottom left.
- Buttons: 8px radius, pill is wrong. Primary is white with black text, secondary is transparent with a `#161616` border, hover fills `#161616`.
- Header nav links: 8px radius, 6px 12px padding, hover `#161616`. Header CTA is white, small text.
- Glass panels (buy bar, dialogs, menus): `#1c1c1cb8` with `backdrop-filter: blur(40px) saturate(1.4)`, 16px radius, shadow `0 24px 60px #00000080`.
- Dividers and accordion rules are 1px `#252525`; footer top border is `#1e1e1e`. Never use shadows on cards; depth comes from surface steps and light.
- Focus: 2px white outline, 2px offset, or `--ring`. Selection: electric blue `#2f00ff` with white text.

## Motion

- Global easing is `var(--kit-ease)` for entrances and `var(--kit-ease-in-out)` for hover. Typical durations: 0.2s color, 0.5s surface, 0.9s reveal, 1.2s media fade.
- Reveal: opacity 0 plus `translateY(50px)`, 0.9s `cubic-bezier(.16,1,.3,1)`, delay from `--d`. Observer threshold 0.12 with a -40px bottom margin. Hero items enter from 40px below, header items from 20px above; never bounce.
- Card intro: when a demo card is 40 percent visible, run the staged intro once. The skeleton shimmer is a 100deg `#1d1d1d` to `#292929` band, 1.1s linear, removed after 700 to 900ms. Intro classes are removed after 1.7 to 2s.
- Pointer parallax: clamp pointer to -1..1 inside the card, ignore touch, ease with `1 - 0.92^frames`. Move demos 6px horizontally and 4px vertically, rotate Y 3deg and X -4deg. Larger panels move 2 to 8px with 4 to 6deg. Reset to center on pointer leave.
- Feature tabs: the active effect swaps the video `src`, calls `load()` and `play()` immediately. The active tab gets a `#161616` fill, hover gets `#ffffff0f`; there is no underline. A two-option segmented switch instead uses a `#ffffff0a` glass track, a `#ffffff1a` thumb and a 0.5s `cubic-bezier(.3,1.25,.5,1)` slide.
- Library preview: preload videos 200px before they enter; play when 50 percent visible. Only one queued clip plays at a time, the next starts 100ms after the current one. Shuffle and pick a subset, then stagger tiles 60ms.
- Editor video: sources load 300px early, playback starts at 20 percent visible and pauses off screen. While an editor video owns the middle of the viewport the page background drops from `#101010` to `#000` over 0.7s.
- Typing demo: wait 2.2s, delete at 45ms per character, type at 75ms, then pause. After each full round press the copy button and show `Copied` for 1.3s. Hover pauses the loop. Caret is a 1.2px wide block.
- Progressive demo: 7s cycle. Hold 0, then a 3s uneven load curve (fast start, squeeze at 54 percent, ease-out), hold the done check, then reset.
- Trigger demo: auto-advance every 1.5s with a 450ms swap window; hovering pauses it and the highlight follows focus.
- Editor stage, hero media and dialogs fade rather than snap. Always honor `prefers-reduced-motion`: skip intros, set demos to the finished frame, stop background video autoplay.

## Imagery

- One mood: a dark photographic studio for hardware. Deep black or `#0b0b12` backgrounds, one hard key light, soft fog, a stone or concrete plinth, cool rim light.
- Subjects are 3D device mockups: phone in hand, laptop half open, studio display on a stand, tablet tilted on rock. Devices are sculpture, shot at low angles with long lenses.
- Screens carry abstract gradients, caustic light, liquid metal or cropped motion blur. Never readable UI, logos, brand marks or app chrome.
- Color is monochrome plus one cool cast: indigo, electric blue or teal. No warm lifestyle palettes, no stock-photo offices, no people except low-key portrait avatars for testimonials.
- Textures: brushed aluminium, matte black glass, smoke, dust. Slight film grain is welcome. No drop shadows baked into the image.
- Ratios: hero 2400x1500, feature 1200x900, tabs 1600x1000, library tiles 4:3, loop 1600x900. Compress to WebP; loops are muted H.264 under 2 MB.
- Library tiles are motion-design video tiles: a 2 to 4 second silent loop of one device scene, 4:3, with an 800x600 poster. The standard `loop.mp4` is a 6 second 16:9 studio dolly.
- Media is decorative: empty `alt` or a plain description of the device, never fake product copy.
- Files: `hero.webp`, `feature-1` to `feature-3`, `tab-1` to `tab-3`, `avatar-1` to `avatar-3`, `loop.mp4` with `loop-poster.webp`. Library loops, each with a `-poster.webp`: `library-display-pedestal`, `library-display-turn`, `library-fold-phone`, `library-laptop-desk`, `library-laptop-fog`, `library-laptop-open`, `library-phone-cradle`, `library-phone-float`, `library-phone-hand`, `library-phone-stack`, `library-tablet-angle`, `library-tablet-rock`.

## Component patterns

- Button: primary white, 12px 26px, 16px text, radius 8. Secondary transparent with `1px solid #161616`, hover fill. Ghost is text only with a 0.2s opacity hover.
- Badge: an inline announcement line, not a pill. Dim prefix (`New!` in `#3b3b3b`) then label in `#b8b8b8`; hover the pair to white.
- Text link: white or grey text with a short arrow; hover shifts color only, never underlines body links except in legal copy.
- Navbar: logo tile 28px, 12px gaps, nav 14px 600, white CTA. Mobile drawer is a dark sheet with 24px padding.
- Card: surface, optional 4:3 media, 24px padding, title 16px white, description 16px `#3b3b3b`. Meta in DM Mono may sit above the title.
- Tabs: a row of text buttons with 8px radius, 6px 12px padding and an 8px gap. Active fills `#161616`, hover fills `#ffffff0f`; no underline. For a two-option switch use a `#ffffff0a` glass track with a 10px thumb (`#ffffff1a`) that slides.
- Accordion: hairline rows, 20px vertical padding, 12px plus icon made of two 1.5px bars; open rotates the vertical bar flat. Answer is 16/24 `#b8b8b8`, max 560px.
- Dialog: glass panel, 16px radius, title 16 to 20px, actions at the bottom. Overlay is `#000000b3` with no blur.
- Input: dark field, 1px `#252525`, radius 8, white submit button inside or beside. Hint 12px mono grey, success white with a green check.
- Carousel: full-bleed 4:3 media with 2px gaps, white dot controls at the bottom left, no arrows on mobile.
- Marquee: device stills or wordmarks on `#101010`, no gradient edge masks.
- Logo strip: quiet single row, white wordmarks at 60 percent opacity, 32px gaps, no boxes.
- Testimonials: large quote in H2 scale white with a 38px mono quote mark, author in 14px, avatar 40px round.
- Footer: 9 column grid, brand at 1/5, link columns at the right, 14px links, legal 14px `#7c7c7c`.

## Do

- Keep the page black and let one lit device carry each section.
- Use 2px gaps for adjacent tiles; they read as a single cut grid.
- Use white for the message and a darker grey for the support line.
- Let big headlines breathe with negative tracking and tight leading.
- Animate one thing at a time, slowly, and stop it off screen.
- Use DM Mono only for numbers, dates and micro labels.

## Don't

- Don't add bright brand colors, gradients across text, or more than one accent hue.
- Don't use pill buttons or rounded 999px cards; the largest radius is 16px on glass.
- Don't use bold display weights, wide tracking, or all caps headlines.
- Don't put borders or shadows on cards; separate them with gaps and surface steps.
- Don't autoplay many videos at once, loop heavy clips outside the viewport, or ignore reduced motion.
- Don't use stock photography, real brand devices, readable UI text or copied marketing copy.
