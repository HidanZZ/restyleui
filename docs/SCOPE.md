# Restyle UI: v1 scope

Status: draft from the grilling session on 2026-11-23. Waiting for confirmation.

## Product

- **Name:** Restyle UI. Domain `restyleui.dev`. Registry namespace `@restyleui`. Repo `HidanZZ/restyleui`.
- **What it is:** a free, public library of design kits rebuilt from real websites. Developers and their coding agents install the pieces and build new sites in that style.
- **Audience:** developers and their agents.
- **License:** MIT for our code. Brands, original fonts, and original media keep their owners' rights.
- **Inspiration:** [ui-sdk.dev](https://ui-sdk.dev/) for small behaviors that agents compose, and [boardui.com](https://www.boardui.com/) for the website layout.

## Model

```
Shared behaviors ──┐
                   ├─> Common components (same list and same props in every kit)
Kit style ─────────┤
(tokens + fonts)   └─> Unique components (one kit only)
                            │
                            v
                        Sections ──> Landing page template ──> Kit demo page
```

- **Behaviors:** shared by all kits. Interaction behaviors use `@ui-sdk/core` (pinned version). Motion behaviors are ours.
- **Common components and sections:** every kit has the same list with the **same props**. Each kit has its **own implementation**. An agent can switch a site from one kit to another by changing imports only.
- **Gaps:** when the original site has no source for a common piece, we design it in the kit's style. Every piece has a label: **from source** or **designed in style**.
- **One kit per site.** Mixing kits is not supported, and the docs and skill say so.

## Kits in v1

| Kit | Source clone | Mode | Difficulty |
|---|---|---|---|
| Norma style | `~/projects/clone-website-skill/apps/norma` | light | easy |
| Linear style | `~/projects/clone-website-skill/apps/linear` | dark | easy |
| Apple style | `~/projects/clone-website-skill/apps/apple` | light | medium |
| Teamwork Graph style | `~/projects/clone-website-skill/apps/teamworkgraph` | light | medium |
| mckp style | `~/projects/clone-website-skill/apps/mckp` | dark | medium |

Each kit ships only in its native mode. The website itself has light and dark mode.

## Behaviors (8)

1. Responsive nav: hover dropdown, mobile drawer, scroll lock (`@ui-sdk/core`)
2. Scroll reveal and staged entrance
3. Video plays in view, or scrubs with scroll
4. Carousel and marquee
5. Animated tabs and panels (`@ui-sdk/core` for tab logic)
6. Pointer tilt and follow
7. Count-up numbers
8. Overlay and dialog with focus return (`@ui-sdk/core`)

## Common components (14)

| Group | Components |
|---|---|
| Actions | Button, Link, Badge |
| Layout | Card, Logo row |
| Navigation | Navbar, Footer |
| Disclosure | Tabs, Accordion, Dialog |
| Motion | Carousel, Marquee, Reveal, Count-up |
| Forms | Input (field plus button) |

## Common sections (8)

Hero, Logo strip, Feature grid, Feature tabs, Testimonials, FAQ, CTA, Footer.

## Unique components (2 to 3 per kit)

- **Norma:** globe, scroll-scrubbed video reveal, screen-time calculator
- **Linear:** product demo hero with scene tabs, tech-spec drawer
- **Apple:** endless gallery, flyout mega nav
- **Teamwork Graph:** odometer, staged overview carousel, connector marquee with tilt
- **mckp:** library preview with play queue, typing code demo

## Per kit deliverables

- Style tokens as CSS variables for Tailwind v4
- `DESIGN.md`: tokens, motion feel, layout rules, do and don't. The agent skill reads it before it builds.
- 14 common components, 8 common sections, and 2 or 3 unique components
- Landing page template, installable as `@restyleui/<kit>/landing`
- Live demo page built only from the kit's pieces

## Fonts and media

- **Fonts:** each kit names its exact fonts in its tokens.
  - Ship free fonts as files: Inter, IBM Plex Mono, DM Mono.
  - Apple style uses `-apple-system`, which renders SF Pro on Apple devices.
  - Paid or private fonts (Berkeley Mono, Tiempos, Suisse, Atlassian Sans, Charlie) load only if the user owns them. Each has a free fallback and a link to buy it.
- **Media:** no original images, videos, or logos. Use AI-generated images and short video loops per kit, plus CSS and SVG for small elements.
- **Brand names:** kept, as "<Brand> style".

## Tech

- pnpm monorepo:
  - `packages/behaviors`: the 8 behaviors
  - `registry/<kit>/`: tokens, `DESIGN.md`, components, sections, landing template
  - `apps/web`: Next.js App Router website. It also serves the registry JSON and `llms.txt`.
  - `skills/restyleui`: the agent skill
- React only. Tailwind v4, CSS variables, Motion, `@ui-sdk/core`.
- Behaviors and components are copied into the user's project through the shadcn registry. `@ui-sdk/core` and `motion` stay npm dependencies.
- Hosting: Vercel free tier at `restyleui.dev`. Public GitHub repo.

## Agent access

- shadcn registry: `npx shadcn add @restyleui/<kit>/<item>`
- Agent skill: teaches the agent to pick one kit, read its `DESIGN.md`, and compose pieces
- `llms.txt`, and every docs page as markdown, with a "Copy Page" button
- "Copy Prompt" setup button, like ui-sdk
- MCP: document the shadcn MCP server with our registry. No MCP server of our own.

## Website

- **Look:** neutral, clean, and white like BoardUI, with dark mode. Design it with the `impeccable` skill.
- **Home:** BoardUI-style hero over a wall of live components from all 5 kits, mostly unique pieces. Includes "Copy Prompt".
- **Sidebar groups:** Getting started, Kits, Behaviors, Components, Sections, Unique (by kit).
- **Kit page:** live demo, tokens, fonts, and the list of components and sections with install commands. No screenshot of the original site.
- **Component page:** Preview and Code tabs, install (CLI and manual), anatomy, variants, keyboard and accessibility, Copy Page, and a "from source" or "designed in style" label.
- **Kit switcher:** a floating bottom-right button that changes every preview and install command on the site to the selected kit.

## Quality bar

- **From source:** screenshot and motion comparison against the clone, at desktop and mobile widths.
- **Designed in style:** visual review only.
- hidanz reviews every piece before it ships.

## Launch

- Launch all 5 kits together, after every piece passes review.
- Rough estimate, with high uncertainty: agent ~40 h of work (~10 to 15 h of wall time with parallel subagents). hidanz ~7 h, mostly reviews.
- Share on Reddit and LinkedIn at launch.

## Not in v1

- Lusion kit (Three.js scenes, Astro, tangled modules)
- Stripe and Nothing clones
- Other frameworks (Vue, Svelte, Solid, Web Components)
- Second color mode per kit
- Mixing kits on one site
- Our own MCP server
- Paid kits or a Pro tier
- Side-by-side or screenshot view of the original site
- Select, tooltip, and pricing table components

## Open items

- Register `restyleui.dev` before launch.
