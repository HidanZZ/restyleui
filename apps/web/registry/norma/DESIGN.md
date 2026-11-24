# Norma style: design rules

Norma is quiet Swiss product minimalism: a white page, near-black type and soft gray wells, with every action in a pill and a brushed steel object as the only hero. Photography is moody and tactile, type is tightly tracked, and color is almost absent beyond ink, paper, steel, and one blue locator dot. Motion is slow and physical: content blurs into focus, media slides under a finger, and film plays only when scroll or the viewport asks for it.

Source: https://nor.ma (homepage). Clone used for values: `apps/norma` in the clone repo. Native mode: light only.

## Tokens

All tokens live in `theme.css` under `[data-kit="norma"]`.

| Token | Value | Use |
|---|---|---|
| `--background` | `#ffffff` | Page base |
| `--foreground` | `#0a0a0a` | Headings, body, icons |
| `--card` | `#ffffff` | Cards on gray wells |
| `--primary` | `#0a0a0a` | Solid buttons, active tab, selection |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--secondary` | `#f5f5f5` | Quiet panels, section wells |
| `--muted` / `--muted-foreground` | `#f5f5f5` / `#6b6b6b` | Supporting copy, subtle fills |
| `--accent` | `#ececec` | Hover rows, quiet chips |
| `--border` / `--input` | `#0a0a0a1a` | 1px hairlines, field edges |
| `--ring` | `#0a0a0a4d` | Focus ring |
| `--kit-container` | `1040px` | Text and content max width |
| `--kit-gutter` | `1.5rem`, `2rem` from 640px | Content side padding |
| `--kit-section-y` | `3rem`, `4rem` from 640px | Standard section padding |
| `--kit-radius-sm` | `0.75rem` | Chips, drawer rows |
| `--kit-radius` | `1rem` | FAQ, calculator, inputs |
| `--kit-radius-lg` | `1.75rem` | Media shells, large cards |
| `--kit-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | The signature curve, used everywhere |
| `--kit-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Two-way state moves such as a lifting phone |

Extras: `--norma-paper-2` `#f5f5f5`, `--norma-paper-3` `#ececec`, `--norma-ink-3` `#a1a1a1`, `--norma-faint` `#e3e3e3`, `--norma-coal` `#111111`, `--norma-line-soft` `#0a0a0a0f`, `--norma-line-inverse` `#ffffff24`, `--norma-blue` `#3d8bfd` (globe beam), `--norma-globe` `#2c2c2e`, `--norma-globe-grid` `#3a3a3c`. Radii extras: `--norma-radius-xl` `36px` for tall step cards, `--norma-radius-phone` `44px`, `--norma-radius-pill` `9999px`. Air extras: `--norma-container-wide` `1920px` for full-bleed shells, `--norma-section-y-lg` `6rem` / `8rem`, `--norma-gutter-outer` `0.75rem` / `1rem`. Shadows: `--norma-shadow-float` `0 24px 60px -24px rgb(0 0 0 / 0.25)`, `--norma-shadow-tooltip` `0 10px 30px -10px rgb(0 0 0 / 0.5)`.

## Typography

One family for everything: Suisse Intl (paid), falling back to Inter Tight. Weights 400, 500, 600; 700 almost never. Apply `font-feature-settings: "ss01", "cv01", "cv11"` on the page body. Numerals in data UI use `font-variant-numeric: tabular-nums lining-nums`.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display h1 | `clamp(2rem, 1.35rem + 2.8vw, 3.5rem)` | 600 | `1.02` | `-0.03em` |
| Heading h2 | `clamp(1.5rem, 1.15rem + 1.5vw, 2.25rem)` | 600 | `1.1` | `-0.015em` |
| Heading h3 | `clamp(1.125rem, 0.95rem + 0.7vw, 1.375rem)` | 600 | `1.3` | `-0.01em` |
| Data numeral | `clamp(2.5rem, 1.7rem + 3.4vw, 4rem)` | 600 | `1` | `-0.03em` |
| Lead body | `1.0625rem` (17px) | 400 or 500 | `1.5` | `0` |
| Body | `1rem` (16px) | 400 | `1.5`, `1.55` in long answers | `0` |
| UI label | `0.9375rem` (15px) | 500 | `1.3` | `0` |
| Button and nav | `0.875rem` (14px) | 500, 600 for order | `1` | `0` |
| Eyebrow, caption, legal | `0.8125rem` (13px) | 400 or 500, 600 for column titles | `1.4` | `0` |

Headlines are short and end with a period. Hero headlines balance two lines: a 55% white first line and a white second line over film. Never use all caps for headings; uppercase is reserved for invented wordmarks. Italic appears only in a tiny floating tooltip. `text-balance` on headings and `text-pretty` on paragraphs.

## Layout

- Content container: `1040px` max, centered, `24px` side padding, `32px` from 640px. Sections use it even when their background is full bleed.
- Full-bleed media shells: `max-width: 1920px`, inset `12px` from the viewport edge, `16px` from 640px, radius `28px`. The hero is one; the trust panel tucks under it with a `-28px` / `-32px` margin and square bottom corners sharing the radius.
- Grid rhythms: hero text `1.15fr 0.85fr`; feature tabs `1fr 280px` with a phone at the right; gallery `1fr 1fr`; steps `3` equal columns; footer `1.3fr 2.4fr` with four link columns; journal `1.1fr 1fr`.
- Spacing rhythm is 4px based. Section padding `48px`, `64px` from 640px; feature-led sections `96px`, `128px`. Inside a section, steps of `12`, `16`, `20`, `28`, `48`, `64`. Card padding `28px`, `32px`, `48px` to `56px` for large panels. Stack gaps are `4px` to `16px`; block gaps `40px` to `64px`.
- Section headings sit left-aligned with copy below, except the trust tagline, the globe line, and the closing order block, which are centered. Photo rails escape the container and start at the container edge.
- Rounded shells nest with a consistent inset: media inside a card touches the card edge or sits inside a `28px` inner radius, never a sharp corner on a rounded surface.

## Surfaces, borders, radii

- White is the default surface. Quiet panels use `#f5f5f5`. Media sits on `#111` / `#1a1a1a`. Inverted sections are near-black with white type, never pure gray text on gray.
- Borders are always 1px. On light surfaces `rgba(10,10,10,0.10)`; softer separators `rgba(10,10,10,0.06)`; on dark media `rgba(255,255,255,0.14)`.
- Pills (`9999px`) for every action, chip, tab, nav group, and status dot. Large media and panels `28px`; tall step cards `36px`; FAQ and calculator `16px`; small chips `12px`; phone mockups `44px`.
- Only floating UI has a shadow: the phone mockup and tiny tooltips. Cards and wells are flat, separated by fill and hairline only.
- Glass is used over film: `bg-white/15`, `backdrop-blur-md` or `xl`, white text at 80 to 85%, and a `ring-1 ring-white/25` on the stock badge. Never use glass on a plain white page.

## Motion

- The signature curve is `cubic-bezier(0.22, 1, 0.36, 1)`, `--kit-ease`. Color hovers run `150ms` to `200ms`. Larger settles run `300ms` to `700ms`.
- Scroll reveal: opacity `0` to `1`, blur `10px` to `0`, translateY `12px` to `0`, over `700ms`. It fires once at 15% visibility. Stagger direct children at `80ms` to `160ms`.
- Nav is fixed and starts `28px` below the top; the offset shrinks to `0` as the page scrolls, with no tween. Over the hero it inverts to white glass and white text, dropping the shadow once past 72% of the viewport.
- Hover: surfaces darken one step, borders go from 10% to 20 to 40% ink, arrows shift `4px` right in `300ms`, photos scale to `1.05` in `600ms`. Pressing a primary button scales to `0.99` in `200ms`.
- Tabs crossfade panels in `600ms`; the active pill flips fill instantly. Accordion uses `grid-template-rows` `0fr` to `1fr` in `300ms` while the plus rotates `45deg`.
- Galleries crossfade slides in `700ms`, auto-advance every `4.2s`, and fill a progress pill. Reviews enter with blur `4px` and `16px` lift in `600ms`, `100ms` apart.
- The logo strip swaps one logo every `2s`: fade out `420ms`, swap, fade in `500ms`. It stops when every logo is visible.
- The globe idles at a `30deg` pitch, follows the pointer with a `0.08` per-frame lerp (about `30deg` yaw, `18deg` pitch), and its beam points at the pointer. Touch devices drift on slow sine waves. Reduced motion keeps only direct pointer feedback.
- Scroll video: progress spans `0.8` viewport heights starting at `0.7` viewport from the top; target time is `min(duration, 2.7s)`; the playhead lerps `0.12` per frame and can scrub backward. Reduced motion plays the clip once at 40% visibility.
- Everything respects `prefers-reduced-motion`: reveals show at once, videos play instead of scrub, idle globe drift stops, and smooth scrolling turns off.

## Imagery

- One recurring object: a matte brushed stainless steel disc, coaster sized, with a soft bevel and a small center recess. It is the product, never a logo.
- Palette: deep charcoal and black backgrounds, warm walnut, pale limestone, oat linen, concrete. Soft directional daylight from one side, deep but open shadows, a cool gray cast.
- Framing: macro product studies with a single highlight along the rim, or quiet home scenes where the disc is small in frame. Shallow depth of field, fine film grain, no hard flash.
- People appear as hands, shoulders, or soft portraits. No faces needed in product scenes. Avatars are candid, neutral, window-lit, plain backgrounds.
- Media corners are `28px`; portrait rails use `4:5`; feature media `4:3`; tab media `16:10`; hero and film `16:10` to `16:9`. Gradients over film go from `black/55` at the top to transparent, and from paper at the bottom of the scroll video.
- No text, logos, badges, UI screenshots, or real brands inside generated images.

## Component patterns

- **Button:** pill. Primary is ink fill with white text, `h-36px` small, `h-40px` nav, `h-48px` closing CTA, labels `14px` to `16px`, medium or semibold. Arrow sits `10px` from the label and shifts right on hover. Secondary over film is white glass with a `ring` or `border-white/30`; secondary on paper is white with a hairline. Ghost is text with an arrow.
- **Text link:** `15px` semibold ink, optional trailing arrow, underline on hover with `underline-offset-4`. "Read all" sits at the end of a heading row.
- **Badge:** pill, `13px` medium, `bg-paper-2` or white glass, optionally a status dot with a `2.2s` ping. Unavailable states use a dashed `border-ink/20` and `ink-3` text.
- **Card:** white or `paper-2`, `28px` radius, 1px hairline, media flush to the edge, copy padded `28px` to `32px`. Hover darkens the border and scales the image; no lift, no shadow.
- **Navbar:** fixed, three-part pill layout: wordmark left, icon plus label items center, region and order right. Mobile collapses to a `40px` icon button and a dropdown sheet with `12px` rows; the menu pill sits over the same glass.
- **Tabs:** a wrap of pill chips, each `36px` tall, `14px` medium, with an icon. Active is solid ink; inactive is white with a hairline; disabled is dashed and muted. Panel heading and copy sit under the chips; media lives in a separate rail.
- **Accordion:** one border around all rows, `16px` radius, `1px` row dividers, icon plus question at `17px` medium, plus icon rotates on open, answer is body copy at 55 to 70 characters.
- **Dialog:** white panel, `16px` to `28px` radius, backdrop fades `200ms`, panel pops from `translateY(16px) scale(0.985)` in `320ms`.
- **Carousel:** either a full-bleed snap rail of `280px` / `340px` cards with `44px` round arrow buttons, or a fading `1fr` gallery with a glass progress pill. Both use `28px` media radii.
- **Sections:** alternate white and `paper-2` wells; lead with a two-line sentence, not an eyebrow. Data sections invert to black media with white glass stat cards. Closing sections use a single large statement and one pill.

## Do

- Use one idea per section, with generous white space and a short headline.
- Keep all actions pill shaped and all imagery inside a `28px` shell.
- Use the gray well to group a story, not to decorate every block.
- Let photography carry the emotion; keep type neutral, tight, and calm.
- Use blur plus a small lift for entrances, and ease out on the signature curve.
- Keep copy plain, invented, and sentence case, ending key lines with a period.
- Use tabular numerals for stats and calculators.

## Don't

- Don't introduce a second accent color, gradients as decoration, or rainbow charts. Blue is only the locator beam.
- Don't use square buttons, sharp cards, heavy shadows, or glass on white.
- Don't set headings in all caps, use wide tracking, or use a second typeface.
- Don't animate more than one thing per hover; no bouncing, spinning, or springy overshoot.
- Don't put text or logos inside generated imagery, and don't reuse original Norma photos or wordmarks.
- Don't mix Norma with another kit on one page.
