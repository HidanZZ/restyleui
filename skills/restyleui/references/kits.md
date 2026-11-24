# Restyle UI kits

One kit per site. Pick a kit, install its theme and pieces, and keep the `data-kit` value, theme import and piece prefix the same everywhere. Mixing kits is not supported.

Item names are `<kit>-<slug>`. Install one with:

```bash
npx shadcn@latest add @restyleui/<kit>-<slug>
```

The kit theme installs `app/restyle-<kit>.css` and `restyle/<kit>/DESIGN.md`. In a project with a `src/` folder both sit under `src/`. Read `DESIGN.md` before building.

## Overview

| Kit | `data-kit` | Mode | Look | Unique items |
|---|---|---|---|---|
| Norma | `norma` | Light | Quiet Swiss product minimalism: white page, near-black type, soft gray wells, pill controls and moody steel photography | `norma-globe`, `norma-scroll-video-reveal`, `norma-screen-time-calculator` |
| Linear | `linear` | Dark | Near-black graphite canvas, crisp Inter, restrained indigo accents, quick fades and right-side panel motion | `linear-product-demo-hero`, `linear-tech-spec-drawer` |
| Apple | `apple` | Light | Light, image-led product style with precise typography, quiet surfaces and restrained motion | `apple-endless-gallery`, `apple-mega-nav` |
| Teamwork Graph | `teamwork` | Dark | Ink-black canvas, editorial display type and luminous graph connections | `teamwork-odometer`, `teamwork-overview-carousel`, `teamwork-connector-marquee` |
| mckp | `mckp` | Dark | Black cinematic studio for 3D device mockups, white product buttons, quiet grey type and 2px tile gaps | `mckp-library-preview`, `mckp-code-typing-demo` |

## Fonts

Each kit's `theme.css` references free fonts through CSS variables. Define those variables in your app and load the fonts from Google Fonts or `next/font/google`. The original paid or private faces are optional: if the files are absent, the stack uses the free fallback.

| Kit | Load from Google Fonts | CSS variables in the stack | Original face |
|---|---|---|---|
| Norma | Inter Tight 400, 500, 600, 700; optional IBM Plex Mono | `--font-inter-tight`, `--font-plex-mono` | Suisse Intl (paid) |
| Linear | Inter, Newsreader, JetBrains Mono | `--font-inter`, `--font-newsreader`, `--font-jetbrains-mono` | Tiempos Headline, Berkeley Mono (paid) |
| Apple | Nothing required. Load Inter for the non-Apple fallback | `--font-inter` | SF Pro (system) |
| Teamwork Graph | Inter, Manrope, IBM Plex Mono | `--font-inter`, `--font-manrope`, `--font-plex-mono` | Atlassian Sans, Charlie Display, Atlassian Mono (private) |
| mckp | Inter 400, 500, 600 and DM Mono 400 | `--font-inter`, `--font-dm-mono` | None, both are free |

Define every variable the kit you use reads. An undefined `var(--font-*)` makes the whole `font-family` declaration invalid, and the browser falls back to its default font.

With Vite, add the link to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Then define the variables in the global stylesheet:

```css
:root {
  --font-inter: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-inter-tight: "Inter Tight", ui-sans-serif, system-ui, sans-serif;
  --font-newsreader: "Newsreader", ui-serif, Georgia, serif;
  --font-jetbrains-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-manrope: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-plex-mono: "IBM Plex Mono", ui-monospace, monospace;
  --font-dm-mono: "DM Mono", ui-monospace, monospace;
}
```

Google Fonts links for each kit:

- Norma: `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&display=swap`
- Linear: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=JetBrains+Mono:wght@400;500&display=swap`
- Apple: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap`
- Teamwork Graph: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap`
- mckp: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Mono:wght@400&display=swap`

With Next.js, use `next/font/google` and map each font to its variable. For Linear:

```tsx
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })

<html className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}>
```

The same pattern maps `Inter_Tight` to `--font-inter-tight`, `Manrope` to `--font-manrope`, `IBM_Plex_Mono` to `--font-plex-mono`, and `DM_Mono` to `--font-dm-mono`. `IBM_Plex_Mono` and `DM_Mono` are not variable fonts, so pass `weight` to them, for example `weight: ["400", "500"]`.

## Norma

- Mode: light only. `data-kit="norma"`.
- Look: quiet Swiss product minimalism. White paper, near-black ink, soft gray wells, pill controls, tight type and slow blur-to-focus motion with scroll-scrubbed film.
- Fonts: Suisse Intl (paid) first, Inter Tight as the free fallback. Load Inter Tight 400, 500, 600 and 700. IBM Plex Mono is optional for code.
- Unique items: `@restyleui/norma-globe`, `@restyleui/norma-scroll-video-reveal`, `@restyleui/norma-screen-time-calculator`.
- Signature tokens: `--kit-container: 1040px`; radii `0.75rem`, `1rem`, `1.75rem`; `--kit-section-y: 3rem`, `4rem` from 640px; `--kit-ease: cubic-bezier(0.22, 1, 0.36, 1)`.
- Extras include `--norma-paper-2`, `--norma-paper-3`, `--norma-ink-3`, `--norma-line-soft`, `--norma-blue`, `--norma-globe`.

## Linear

- Mode: dark only. `data-kit="linear"`.
- Look: a near-black graphite product canvas with fine borders, crisp Inter, restrained indigo for selected states and links, quick fades and panel motion from the right.
- Fonts: Inter Variable (free) with Inter as fallback; Tiempos Headline (paid) with Newsreader; Berkeley Mono (paid) with JetBrains Mono. The hero uses the sans family.
- Unique items: `@restyleui/linear-product-demo-hero`, `@restyleui/linear-tech-spec-drawer`.
- Signature tokens: `--background: #08090a`; `--primary: #5e6ad2`; `--card: #0f1011`; radii `6px`, `8px`, `16px`; `--kit-container` is `1344px` plus outer padding; `--kit-section-y: 64px`.
- Extras include `--linear-bg-marketing`, `--linear-link`, `--linear-accent-hover`, the status colors and `--linear-shadow-low`, `--linear-shadow-medium`, `--linear-shadow-high`.

## Apple

- Mode: light only. `data-kit="apple"`.
- Look: centered type, large product imagery, generous space, alternating light and dark tiles, and a small blue action color.
- Fonts: SF Pro Text and SF Pro Display from the operating system. No font files ship. Inter is the fallback on non-Apple devices; load it and set `--font-inter` if you want a closer match.
- Unique items: `@restyleui/apple-endless-gallery`, `@restyleui/apple-mega-nav`.
- Signature tokens: `--background: #ffffff`; `--foreground: #1d1d1f`; `--primary: #0071e3`; `--apple-link: #0066cc`; radii `5px`, `8px`, `12px`; `--kit-container: 1024px`; `--kit-section-y: 48px`; `--kit-gutter: 12px`.
- Extras include `--apple-page-max`, `--apple-button-radius`, `--apple-tertiary-text`, `--apple-blue-hover` and `--apple-blue-active`.

## Teamwork Graph

- Mode: dark only. `data-kit="teamwork"`.
- Look: an ink-black canvas with bright blue graph lines, small yellow, green and lilac nodes, thin connectors, dotted grids and editorial display headings.
- Fonts: Atlassian Sans, Charlie Display and Atlassian Mono are private. Load the free fallbacks Inter, Manrope and IBM Plex Mono.
- Unique items: `@restyleui/teamwork-odometer`, `@restyleui/teamwork-overview-carousel`, `@restyleui/teamwork-connector-marquee`.
- Signature tokens: `--background: #111213`; `--card: #1f1f21`; `--primary: #669df1`; `--teamwork-blue-strong: #357de8`; node colors `--teamwork-yellow`, `--teamwork-green`, `--teamwork-lilac`; radii `4px`, `6px`, `12px`; `--kit-container: 1200px`.
- Keep diagrams to two or three accents. Use the other colors only for node categories and status.

## mckp

- Mode: dark only. `data-kit="mckp"`.
- Look: a black cinematic studio. Near-black pages, cinematic 3D device renders, white type, almost no color, 2px tile gaps and slow, engineered motion.
- Fonts: Inter 400, 500 and 600, plus DM Mono 400. Both are free.
- Unique items: `@restyleui/mckp-library-preview`, `@restyleui/mckp-code-typing-demo`.
- Signature tokens: `--background: #101010`; `--card: #161616`; `--primary: #ffffff`; `--accent: #2f00ff`; radii `6px`, `8px`, `12px`; `--kit-container: 1200px`; `--kit-section-y: 120px`; `--kit-gutter: 40px`.
- Extras include `--mckp-surface-raised`, `--mckp-ink-soft`, `--mckp-line-soft` and the code demo colors `--mckp-code-blue`, `--mckp-code-violet`, `--mckp-code-orange`, `--mckp-code-green`.

## Before installing

- Read the kit `DESIGN.md`. It is the full set of type, spacing, motion and layout rules. This file only summarizes it.
- Unique pieces have every prop optional and default to demo content. Read the installed component file before passing props.
- The common pieces all follow `@/lib/contract`. See `contract.md` in this folder.
